import { useEffect } from 'react';
import './App.css';

function App() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="app-container">
      <div className="bg-ambient">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>
      <div className="noise-overlay"></div>

      {/* Navigation */}
      <nav className="navbar">
        <div className="logo">WTM</div>
        <div className="nav-links">
          <a href="#how-it-works">The Journey</a>
          <a href="#features">Features</a>
          <a href="#radar">Intelligence</a>
          <a href="#join" className="join-btn">Join the Move</a>
        </div>
      </nav>

      {/* Hero Section */}
      <header id="about" className="hero reveal">
        <div className="hero-content">
          <h1>Find your vibe tonight.</h1>
          <p className="hero-subtitle">
            Real-time heatmaps, live wait times, and who's where.
            The ultimate companion for your night out.
          </p>
          <div className="cta-group">
            <a href="https://forms.gle/DdZu4Jy3Y198npai7" target="_blank" rel="noopener noreferrer" className="primary-btn">Download for iOS</a>
            <a href="https://forms.gle/DdZu4Jy3Y198npai7" target="_blank" rel="noopener noreferrer" className="secondary-btn">Download for Android</a>
          </div>
        </div>
        <div className="hero-visual">
          <div className="phone-mockup">
            {/* Real App Status Bar */}
            <div className="phone-status-bar">
              <span className="time">9:41</span>
              <div className="status-icons">📶 🔋</div>
            </div>

            <div className="phone-slider">
              {/* Slide 1: Discover (Map) */}
              <div className="phone-row-slide">
                <div className="mock-app-header glass-header">
                  <div className="mock-search-ui glass-element">🔍 Search for the move...</div>
                </div>
                <div className="mock-map high-fid-map">
                  <div className="map-grid-overlay"></div>
                  {/* Pin on The Grand Hotel */}
                  <div className="mock-radar-dot highlight-pin" style={{ top: '40%', left: '45%' }}>
                    <div className="pin-pulse-ring"></div>
                    📍
                    <div className="touch-ripple"></div>
                  </div>
                  <div className="mock-venue-peek glass-card">
                    <div className="peek-header">
                      <strong>The Grand Hotel</strong>
                      <div className="lit-badge-small">🔥 9.8</div>
                    </div>
                    <div className="peek-stats">
                      <span>⏱️ 5m</span>
                      <span>👥 324</span>
                    </div>
                  </div>
                  <div className="mock-map-controls">
                    <div className="mock-control-btn glass-element">🌌</div>
                    <div className="mock-control-btn active-btn">🧭</div>
                  </div>
                </div>
              </div>

              {/* Slide 2: Coordinate (Chat) */}
              <div className="phone-row-slide">
                <div className="mock-app-header chat-header glass-header">
                  <span className="back-arrow">←</span>
                  <div className="chat-info">
                    <span className="chat-name">Squad Move ⚡️</span>
                    <span className="chat-status">Mike is typing...</span>
                  </div>
                </div>
                <div className="mock-chat high-fid-chat">
                  <div className="chat-bubble-mock glass-bubble">The Grand Hotel is 🔥</div>
                  <div className="chat-bubble-mock reply glass-bubble">Yo, where we at?</div>
                  <div className="chat-bubble-mock reply glass-bubble">Pulling up now!</div>
                  <div className="chat-bubble-mock system-msg glass-element">
                    <em>You shared a Move: The Grand Hotel</em>
                  </div>
                </div>
                <div className="mock-chat-input glass-footer">
                  <div className="input-placeholder glass-element">Send a move...</div>
                  <div className="touch-ripple ripple-chat"></div>
                </div>
              </div>

              {/* Slide 3: Action (Check-In) */}
              <div className="phone-row-slide">
                <div className="mock-app-header glass-header">
                  <span>Venue Intel</span>
                </div>
                <div className="mock-venue high-fid-venue">
                  <div className="venue-card-mock glass-card-pro">
                    <div className="hero-venue-image"></div>
                    <div className="venue-lit-header">
                      <label>LIT SCORE</label>
                      <div className="venue-lit-big">🔥 9.8</div>
                    </div>
                    <div className="venue-info-pro">
                      <h3>The Grand Hotel</h3>
                      <div className="venue-stats-pro">
                        <div className="stat-pill">⏱️ 5m Wait</div>
                        <div className="stat-pill">👥 324 Inside</div>
                      </div>
                      <div className="checkin-container-pro">
                        <button className="mock-checkin-btn-pro">CHECK IN</button>
                        <div className="touch-ripple ripple-btn"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Real App Bottom Nav */}
            <div className="phone-bottom-nav">
              <div className="nav-item active">🏠</div>
              <div className="nav-item">💬</div>
              <div className="nav-item plus-btn">+</div>
              <div className="nav-item">🔥</div>
              <div className="nav-item">👤</div>
            </div>
          </div>
        </div>
      </header>

      {/* How it Works Section */}
      <section id="how-it-works" className="how-it-works reveal">
        <div className="steps-container">
          <div className="step">
            <span className="step-num">Identity</span>
            <h4>Verify</h4>
            <p>Connect with your .edu email to unlock student-only deals and exclusive vibes.</p>
          </div>
          <div className="step">
            <span className="step-num">Radar</span>
            <h4>Explore</h4>
            <p>Access the real-time social radar. See the scores, see your friends, choose your vibe.</p>
          </div>
          <div className="step">
            <span className="step-num">Pulse</span>
            <h4>Move</h4>
            <p>Arrive, check-in, and share the wave. The night belongs to those who move.</p>
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section id="features" className="features-grid-section reveal">
        <div className="feature-grid">
          <div className="feature-card">
            <div className="icon">🔥</div>
            <h3>Lit Score</h3>
            <p>Our proprietary algorithm tells you which venues are actually busy right now.</p>
          </div>
          <div className="feature-card">
            <div className="icon">🗺️</div>
            <h3>Social Radar</h3>
            <p>See exactly where your friends are and coordinate your next move instantly.</p>
          </div>
          <div className="feature-card">
            <div className="icon">⚡</div>
            <h3>Live Intel</h3>
            <p>Real-time wait times and vibes updated by people on the ground.</p>
          </div>
        </div>
      </section>

      {/* Intelligence Dashboard Section */}
      <section id="radar" className="features reveal">
        <div className="section-header">
          <h2>The Move, quantified.</h2>
          <p>Real-time data at your fingertips. Know what's happening before you even leave the house.</p>
        </div>
        <div className="city-pulse-dashboard">
          <div className="dashboard-glass">
            {/* Header */}
            <div className="dash-header">
              <div className="live-indicator">
                <span className="pulse-dot"></span> LIVE CITY PULSE
              </div>
              <div className="dash-time">02:42 AM</div>
            </div>

            {/* Top Moves Leaderboard */}
            <div className="dash-section">
              <label>TOP MOVES NEARBY</label>
              <div className="leaderboard">
                <div className="leader-item">
                  <span className="rank">01</span>
                  <span className="venue">The Grand Hotel</span>
                  <div className="lit-score-badge">🔥 9.8</div>
                </div>
                <div className="leader-item">
                  <span className="rank">02</span>
                  <span className="venue">Neon Lounge</span>
                  <div className="lit-score-badge">🔥 9.2</div>
                </div>
                <div className="leader-item">
                  <span className="rank">03</span>
                  <span className="venue">Underground</span>
                  <div className="lit-score-badge">🔥 8.5</div>
                </div>
              </div>
            </div>

            {/* Activity Feed */}
            <div className="dash-section">
              <label>REAL-TIME UPDATES</label>
              <div className="activity-feed">
                <div className="feed-item">
                  <span className="user-initial">JD</span>
                  <p><strong>Josh D.</strong> just checked in — <span>⏱️ No line</span></p>
                </div>
                <div className="feed-item">
                  <span className="user-initial">ST</span>
                  <p><strong>Sarah T.</strong> posted a video — <span>🕺 Vibe is lit</span></p>
                </div>
                <div className="feed-item">
                  <span className="user-initial">MK</span>
                  <p><strong>Mike K.</strong> is heading to Neon Lounge</p>
                </div>
              </div>
            </div>

            {/* Social Pulse */}
            <div className="social-pulse-mini">
              <div className="pulse-inner">
                <div className="scanner"></div>
                <div className="radar-dot" style={{ top: '20%', left: '30%' }}></div>
                <div className="radar-dot" style={{ top: '60%', left: '70%' }}></div>
                <div className="radar-dot" style={{ top: '40%', left: '50%' }}></div>
              </div>
              <div className="pulse-text">8 Friends active right now</div>
            </div>
          </div>
          <div className="map-caption">Instant city intelligence</div>
        </div>
      </section>

      {/* Waitlist Section */}
      <section id="join" className="waitlist-section reveal">
        <div className="waitlist-container">
          <div className="waitlist-content">
            <span className="beta-tag">Limited Availability</span>
            <h2>Interested in the Beta?</h2>
            <p>Join the inner circle. Get early access to the Social Radar and exclusive moves.</p>
            <div className="join-cta-container">
              <a href="https://forms.gle/DdZu4Jy3Y198npai7" target="_blank" rel="noopener noreferrer" className="primary-btn big-btn">Join Now</a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="logo">WTM</div>
            <p>The Operating System for your Social Life.</p>
          </div>
          <div className="footer-links">
            <a href="#">Terms</a>
            <a href="#">Privacy</a>
            <a href="#">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
