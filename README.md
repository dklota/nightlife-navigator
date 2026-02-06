# WTM (What's the Move)

A React Native mobile app for tracking bar traffic, checking in, and discovering exclusive deals with friends.

## Features

- 🎓 **Student Verification** - Verify with .edu email for exclusive access
- 🗺️ **Live Map** - See bar popularity with color-coded markers
- ⚡ **Quick Check-In** - Log wait time, vibe, and photos in seconds
- 👥 **Friends** - See where your friends are checked in
- 🎁 **Exclusive Deals** - Unlock student-only discounts after check-in

## Tech Stack

- **Frontend**: React Native + Expo
- **Navigation**: Expo Router
- **Backend**: Supabase
- **State**: Zustand
- **Maps**: react-native-maps

## Getting Started

```bash
cd mobile
npm install
npm start
```

Press `i` for iOS simulator or `a` for Android emulator.

## Project Structure

```
mobile/
├── app/                    # Screens (Expo Router)
│   ├── (auth)/             # Login, Signup, Verification
│   ├── (tabs)/             # Main tabs (Explore, Friends, Activity, Profile)
│   └── checkin/            # Check-in flow
├── src/
│   ├── services/           # Supabase client
│   ├── stores/             # Zustand state
│   ├── types/              # TypeScript interfaces
│   └── constants/          # Theme & config
└── assets/                 # Images & fonts
```

## Environment Variables

Create `mobile/.env`:
```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```
