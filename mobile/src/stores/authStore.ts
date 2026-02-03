import { create } from 'zustand';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '../services/supabase';
import type { User, AuthState } from '../types';

interface AuthStore extends AuthState {
    // Actions
    initialize: () => Promise<void>;
    signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
    signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
    signOut: () => Promise<void>;
    verifyStudentEmail: (studentEmail: string) => Promise<{ error: Error | null }>;
    refreshUser: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
    user: null,
    session: null,
    isLoading: true,
    isAuthenticated: false,
    isStudentVerified: false,

    initialize: async () => {
        try {
            set({ isLoading: true });

            // Get current session
            const { data: { session }, error } = await supabase.auth.getSession();

            if (error) throw error;

            if (session?.user) {
                // Fetch user profile from our users table
                const { data: profile } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();

                set({
                    session,
                    user: profile as User,
                    isAuthenticated: true,
                    isStudentVerified: profile?.student_verified ?? false,
                    isLoading: false,
                });
            } else {
                set({
                    session: null,
                    user: null,
                    isAuthenticated: false,
                    isStudentVerified: false,
                    isLoading: false,
                });
            }

            // Listen for auth changes
            supabase.auth.onAuthStateChange(async (event, session) => {
                if (event === 'SIGNED_IN' && session?.user) {
                    const { data: profile } = await supabase
                        .from('users')
                        .select('*')
                        .eq('id', session.user.id)
                        .single();

                    set({
                        session,
                        user: profile as User,
                        isAuthenticated: true,
                        isStudentVerified: profile?.student_verified ?? false,
                    });
                } else if (event === 'SIGNED_OUT') {
                    set({
                        session: null,
                        user: null,
                        isAuthenticated: false,
                        isStudentVerified: false,
                    });
                }
            });
        } catch (error) {
            console.error('Auth initialization error:', error);
            // Reset to unauthenticated state on error so login screen shows
            set({
                session: null,
                user: null,
                isAuthenticated: false,
                isStudentVerified: false,
                isLoading: false,
            });
        }
    },

    signIn: async (email: string, password: string) => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) return { error };

            if (data.user) {
                const { data: profile } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', data.user.id)
                    .single();

                set({
                    session: data.session,
                    user: profile as User,
                    isAuthenticated: true,
                    isStudentVerified: profile?.student_verified ?? false,
                });
            }

            return { error: null };
        } catch (error) {
            return { error: error as Error };
        }
    },

    signUp: async (email: string, password: string, fullName: string) => {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                    },
                },
            });

            if (error) return { error };

            // Create user profile in our users table
            if (data.user && data.session) {
                const { error: profileError } = await supabase.from('users').insert({
                    id: data.user.id,
                    email: data.user.email,
                    full_name: fullName,
                    student_verified: false,
                });

                if (profileError) {
                    console.error('Error creating user profile:', profileError);
                }

                // Set authenticated state so user can proceed to verification
                const { data: profile } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', data.user.id)
                    .single();

                set({
                    session: data.session,
                    user: profile as User,
                    isAuthenticated: true,
                    isStudentVerified: false,
                });
            }

            return { error: null };
        } catch (error) {
            return { error: error as Error };
        }
    },

    signOut: async () => {
        await supabase.auth.signOut();
        set({
            session: null,
            user: null,
            isAuthenticated: false,
            isStudentVerified: false,
        });
    },

    verifyStudentEmail: async (studentEmail: string) => {
        try {
            const { user } = get();
            if (!user) return { error: new Error('Not authenticated') };

            // Check if email ends with .edu
            if (!studentEmail.endsWith('.edu')) {
                return { error: new Error('Please use a valid .edu email address') };
            }

            // Update user profile with student email and verification status
            const { error } = await supabase
                .from('users')
                .update({
                    student_email: studentEmail,
                    student_verified: true,
                    verified_at: new Date().toISOString(),
                })
                .eq('id', user.id);

            if (error) return { error };

            // Refresh user data
            await get().refreshUser();

            return { error: null };
        } catch (error) {
            return { error: error as Error };
        }
    },

    refreshUser: async () => {
        const { session } = get();
        if (!session?.user) return;

        const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

        if (profile) {
            set({
                user: profile as User,
                isStudentVerified: profile.student_verified ?? false,
            });
        }
    },
}));
