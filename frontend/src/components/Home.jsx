import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import profileIcon from '../assets/usericon.png';
import Navbar from './Navbar';
import RecommendedMentors from './recommendedMentors';

// Redesigned Home component — single-file, colors embedded via CSS variables.
// Palette: Mint & Deep Navy (mint accents, deep navy backgrounds, warm cream cards).

const Badge = ({ children }) => (
  <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full badge">{children}</span>
);

const FeatureCard = ({ title, text, emoji }) => (
  <div className="rounded-2xl p-6 feature-card hover:shadow-lg transition transform hover:-translate-y-1">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-lg icon">{emoji}</div>
      <div>
        <h4 className="text-lg font-semibold feature-title">{title}</h4>
        <p className="mt-1 text-sm feature-sub">{text}</p>
      </div>
    </div>
  </div>
);

const Testimonial = ({ quote, name, role }) => (
  <div className="p-6 rounded-xl testimonial">
    <p className="text-sm feature-sub italic">“{quote}”</p>
    <div className="mt-4 flex items-center gap-3">
      <img src={profileIcon} alt={name} className="w-10 h-10 rounded-full object-cover" />
      <div>
        <div className="text-sm font-semibold feature-title">{name}</div>
        <div className="text-xs feature-sub">{role}</div>
      </div>
    </div>
  </div>
);

const Home = ({ isLoggedIn, onLogout }) => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen text-cream-50 page-bg">
      {/* Inline CSS for palette and helper classes */}
      <style>{`
        :root{
          --mint-600: #2dd4bf;
          --mint-500: #34d399;
          --navy-900: #071025;
          --navy-950: #020617;
          --cream-50: #fffaf0;
          --cream-200: rgba(255,250,240,0.85);
          --card-bg: rgba(255,250,240,0.04);
          --card-border: rgba(255,250,240,0.08);
        }

        /* Page background gradient */
        .page-bg {
          background: linear-gradient(180deg, var(--navy-900) 0%, #031027 50%, var(--navy-950) 100%);
          color: var(--cream-50);
        }

        /* Badge */
        .badge {
          background: rgba(45,212,191,0.12);
          color: var(--mint-600);
          border: 1px solid rgba(45,212,191,0.14);
        }

        /* Feature Card */
        .feature-card {
          background: var(--card-bg);
          border: 1px solid var(--card-border);
        }

        .feature-card .icon {
          background: linear-gradient(135deg, var(--mint-600), #60a5fa 80%);
          display:flex; align-items:center; justify-content:center; color: #042033; font-weight:700;
        }

        .feature-title { color: #f8fafc; }
        .feature-sub { color: var(--cream-200); }

        /* Testimonials & general card */
        .testimonial {
          background: rgba(255,250,240,0.03);
          border: 1px solid rgba(255,250,240,0.06);
        }

        /* Buttons (small helpers to complement Tailwind) */
        .btn-primary {
          background: var(--mint-600);
          color: #051826;
        }
        .btn-ghost {
          background: transparent;
          border: 1px solid rgba(255,250,240,0.08);
          color: var(--cream-50);
        }
        .btn-chat {
          background: linear-gradient(90deg, #60a5fa, var(--mint-600));
          color: #051826;
        }

        /* Small decorative blur used near hero card */
        .glow-circle {
          filter: blur(20px);
          opacity: 0.18;
          background: linear-gradient(135deg, rgba(45,212,191,0.24), rgba(96,165,250,0.16));
        }

        /* Footer links (hover) */
        .footer-link { color: var(--cream-200); }
        .footer-link:hover { color: var(--mint-500); text-decoration: underline; }

        /* Floating chat button */
        .fab-chat {
          position: fixed;
          right: 20px;
          bottom: 20px;
          z-index: 60;
          width: 56px;
          height: 56px;
          border-radius: 999px;
          display:flex;
          align-items:center;
          justify-content:center;
          box-shadow: 0 10px 30px rgba(2,6,23,0.6);
          background: linear-gradient(90deg, var(--mint-600), #60a5fa);
          color: #041f2d;
          font-weight: 800;
          cursor:pointer;
          transition: transform .12s ease, box-shadow .12s ease;
          border: 1px solid rgba(255,250,240,0.06);
        }
        .fab-chat:hover { transform: translateY(-4px); box-shadow: 0 14px 34px rgba(2,6,23,0.7); }
      `}</style>

      <Navbar isLoggedIn={isLoggedIn} onLogout={onLogout} />

      {/* HERO */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <Badge>New • Community-first</Badge>
            <h1 className="mt-6 text-5xl md:text-6xl font-extrabold leading-tight">Learn from peers, teach with purpose.</h1>
            <p className="mt-4 text-lg feature-sub max-w-xl">SkillExchange helps people teach what they love and learn what they need through short sessions, hands-on projects, and active feedback loops.</p>

            <div className="mt-8 flex flex-wrap gap-4">
              <button onClick={() => navigate(isLoggedIn ? '/search-skills' : '/register')} className="px-6 py-3 rounded-full btn-primary font-semibold hover:brightness-105 transition">
                {isLoggedIn ? 'Find a Session' : 'Create Free Account'}
              </button>

              {isLoggedIn && (
                <button onClick={() => navigate('/profile-templates')} className="px-6 py-3 rounded-full btn-outline font-semibold hover:brightness-105 transition">
                  Browse Templates
                </button>
              )}

              <Link to="/how-it-works" className="px-6 py-3 rounded-full btn-ghost">How it works</Link>

              {/* CHAT BUTTON ADDED */}
              <button
                onClick={() => navigate('/chat')}
                className="px-6 py-3 rounded-full btn-chat font-semibold hover:brightness-105 transition"
                title="Open Chat"
              >
                Chat
              </button>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4 max-w-md">
              <div className="text-center">
                <div className="text-2xl font-bold" style={{ color: 'var(--mint-500)' }}>12k+</div>
                <div className="text-xs feature-sub">Members</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold" style={{ color: 'var(--mint-500)' }}>3.2k</div>
                <div className="text-xs feature-sub">Live Sessions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold" style={{ color: 'var(--mint-500)' }}>4.9</div>
                <div className="text-xs feature-sub">Avg Rating</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-3xl p-6" style={{ background: 'rgba(255,250,240,0.03)', border: '1px solid rgba(255,250,240,0.06)' }}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm feature-sub">Upcoming</div>
                  <div className="text-xl font-semibold feature-title">Build a Portfolio in 6 Weeks</div>
                  <div className="text-xs mt-1 feature-sub">Dec 3 · 7:00 PM IST</div>
                </div>
                <div className="w-16 h-16 rounded-lg flex items-center justify-center" style={{ background: 'var(--mint-600)', color: '#051826', fontWeight: 800 }}>LIVE</div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button className="py-2 rounded-lg btn-primary font-semibold">Join Now</button>
                <button className="py-2 rounded-lg border" style={{ borderColor: 'rgba(255,250,240,0.06)', background: 'transparent' }}>Save</button>
                <button className="py-2 rounded-lg border" style={{ borderColor: 'rgba(255,250,240,0.06)', background: 'transparent' }}>Share</button>
                <button onClick={() => navigate('/schedule')} className="py-2 rounded-lg border" style={{ borderColor: 'rgba(255,250,240,0.06)', background: 'transparent' }}>Full Schedule</button>
              </div>

              <p className="mt-4 text-xs feature-sub">Tip: complete your profile for better personalized recommendations.</p>
            </div>

            <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-2xl glow-circle" aria-hidden />
          </div>
        </div>
      </section>

      {/* --- START OF AI RECOMMENDATION SECTION --- */}
      {/* Only show this to logged-in users */}
      {isLoggedIn && (
        <section className="container mx-auto px-6">
          <RecommendedMentors />
        </section>
      )}
      {/* --- END OF AI RECOMMENDATION SECTION --- */}

      {/* FEATURES */}
      <section className="container mx-auto px-6 mt-16">
        <h2 className="text-3xl font-bold">What you can do</h2>
        <p className="mt-2 feature-sub max-w-2xl">Host micro-lessons, join interactive cohorts, list your skills, and get micro-feedback from peers.</p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard emoji={'🤝'} title={'Connect & Collaborate'} text={'Find people who want to learn the same skills; form study pairs and groups.'} />
          <FeatureCard emoji={'📚'} title={'Short & Focused'} text={'Lessons that respect your time: focused, practical, and project-driven.'} />
          <FeatureCard emoji={'⚙️'} title={'Tools & Templates'} text={'Ready-made templates for sessions, feedback forms, and learning tracks.'} />
        </div>
      </section>

      {/* TUTORIALS */}
      <section className="container mx-auto px-6 mt-20">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold">Trending Tutorials</h3>
          <Link to="/tutorials" className="text-sm" style={{ color: 'var(--mint-500)' }}>View all</Link>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <article className="rounded-xl p-6" style={{ background: 'rgba(255,250,240,0.03)', border: '1px solid rgba(255,250,240,0.06)' }}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg icon">🎨</div>
              <div>
                <h4 className="font-semibold feature-title">UI Basics — From Wireframe to Prototype</h4>
                <p className="text-xs feature-sub mt-1">By Neha • 45 min</p>
              </div>
            </div>
            <p className="mt-4 text-sm feature-sub">A practical workshop to convert ideas into clickable prototypes using free tools.</p>
            <div className="mt-4 flex gap-2">
              <button className="py-2 px-3 rounded-lg btn-primary font-semibold">Start</button>
              <button className="py-2 px-3 rounded-lg border" style={{ borderColor: 'rgba(255,250,240,0.06)' }}>Save</button>
            </div>
          </article>

          <article className="rounded-xl p-6" style={{ background: 'rgba(255,250,240,0.03)', border: '1px solid rgba(255,250,240,0.06)' }}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg icon">💻</div>
              <div>
                <h4 className="font-semibold feature-title">Intro to Full-stack with React</h4>
                <p className="text-xs feature-sub mt-1">By Arjun • 60 min</p>
              </div>
            </div>
            <p className="mt-4 text-sm feature-sub">Hands-on coding with deployable sample projects and live Q&A.</p>
            <div className="mt-4 flex gap-2">
              <button className="py-2 px-3 rounded-lg btn-primary font-semibold">Start</button>
              <button className="py-2 px-3 rounded-lg border" style={{ borderColor: 'rgba(255,250,240,0.06)' }}>Save</button>
            </div>
          </article>

          <article className="rounded-xl p-6" style={{ background: 'rgba(255,250,240,0.03)', border: '1px solid rgba(255,250,240,0.06)' }}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg icon">📈</div>
              <div>
                <h4 className="font-semibold feature-title">Data Storytelling Essentials</h4>
                <p className="text-xs feature-sub mt-1">By Aisha • 38 min</p>
              </div>
            </div>
            <p className="mt-4 text-sm feature-sub">Transform numbers into persuasive narratives with simple frameworks and visuals.</p>
            <div className="mt-4 flex gap-2">
              <button className="py-2 px-3 rounded-lg btn-primary font-semibold">Start</button>
              <button className="py-2 px-3 rounded-lg border" style={{ borderColor: 'rgba(255,250,240,0.06)' }}>Save</button>
            </div>
          </article>
        </div>
      </section>

      {/* MENTOR SPOTLIGHT */}
      <section className="container mx-auto px-6 mt-20">
        <h3 className="text-2xl font-bold">Mentor Spotlight</h3>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Testimonial quote={'Helped me build a portfolio that landed interviews.'} name={'Priya Shah'} role={'Product Designer'} />
          <Testimonial quote={'Practical sessions that were easy to follow and fun.'} name={'Arjun Mehta'} role={'Full-stack Engineer'} />
          <Testimonial quote={'Great feedback and real projects to showcase.'} name={'Sana Patel'} role={'Marketing Lead'} />
        </div>
      </section>

      {/* NEWSLETTER / CTA */}
      <section className="container mx-auto px-6 mt-20 py-12 rounded-2xl" style={{ background: 'rgba(255,250,240,0.03)', border: '1px solid rgba(255,250,240,0.06)' }}>
        <div className="md:flex md:items-center md:justify-between gap-6">
          <div>
            <h4 className="text-xl font-bold">Stay in the loop</h4>
            <p className="mt-2 feature-sub">Get weekly picks: new sessions, trending mentors, and community stories.</p>
          </div>
          <form className="mt-4 md:mt-0 flex gap-3" onSubmit={(e) => { e.preventDefault(); alert('Subscribed! (stub)'); }}>
            <input aria-label="Email" type="email" placeholder="you@domain.com" required className="px-4 py-3 rounded-lg" style={{ background: 'transparent', border: '1px solid rgba(255,250,240,0.06)', color: 'var(--cream-50)' }} />
            <button type="submit" className="px-5 py-3 rounded-lg btn-primary font-semibold">Subscribe</button>
          </form>
        </div>
      </section>

      {/* FAQ */}
      <section className="container mx-auto px-6 mt-20 pb-12">
        <h3 className="text-2xl font-bold">FAQ</h3>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <details className="p-5 rounded-lg" style={{ background: 'rgba(255,250,240,0.03)', border: '1px solid rgba(255,250,240,0.06)' }}>
            <summary className="font-semibold cursor-pointer">How do I list a skill?</summary>
            <p className="mt-3 feature-sub">From your profile, select "Create Listing," add a short description, set duration and price (optional), and publish.</p>
          </details>

          <details className="p-5 rounded-lg" style={{ background: 'rgba(255,250,240,0.03)', border: '1px solid rgba(255,250,240,0.06)' }}>
            <summary className="font-semibold cursor-pointer">Can I charge for sessions?</summary>
            <p className="mt-3 feature-sub">Yes — we support optional paid sessions. Payments are handled through a secure provider.</p>
          </details>

          <details className="p-5 rounded-lg" style={{ background: 'rgba(255,250,240,0.03)', border: '1px solid rgba(255,250,240,0.06)' }}>
            <summary className="font-semibold cursor-pointer">Are there any rules?</summary>
            <p className="mt-3 feature-sub">Be respectful, provide honest feedback, and follow our community guidelines available on the terms page.</p>
          </details>

          <details className="p-5 rounded-lg" style={{ background: 'rgba(255,250,240,0.03)', border: '1px solid rgba(255,250,240,0.06)' }}>
            <summary className="font-semibold cursor-pointer">How is my data protected?</summary>
            <p className="mt-3 feature-sub">We use encrypted connections and role-based access — review our privacy policy for full details.</p>
          </details>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-16 py-10" style={{ borderTop: '1px solid rgba(255,250,240,0.06)' }}>
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-bold text-lg">SkillExchange</h4>
            <p className="mt-2 feature-sub">A place to teach, learn, and grow together.</p>
          </div>
          <div>
            <h5 className="font-semibold">Company</h5>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link to="/about" className="footer-link">About</Link></li>
              <li><Link to="/blog" className="footer-link">Blog</Link></li>
              <li><Link to="/careers" className="footer-link">Careers</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold">Support</h5>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link to="/help" className="footer-link">Help Center</Link></li>
              <li><Link to="/terms" className="footer-link">Terms</Link></li>
              <li><Link to="/privacy" className="footer-link">Privacy</Link></li>
            </ul>
          </div>
        </div>

        <div className="container mx-auto px-6 mt-8 text-center feature-sub">&copy; {new Date().getFullYear()} SkillExchange. All rights reserved.</div>
      </footer>

      {/* Floating Chat FAB */}
      <button
        className="fab-chat"
        onClick={() => navigate('/chat')}
        aria-label="Open chats"
        title="Open chats"
      >
        💬
      </button>
    </div>
  );
};

export default Home;
