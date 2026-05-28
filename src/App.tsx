import React from 'react'
import { useAppStore } from './store/useAppStore'
import { DailyCanvas } from './components/DailyCanvas'
import { Garden } from './components/Garden'
import { Studio } from './components/Studio'
import { QuickCapture } from './components/QuickCapture'
import { Mindset } from './components/Mindset'
import { Calendar, Sprout, Folder, Mic, Sparkles, CheckCircle2, Target } from 'lucide-react'

// Manual Service Worker registration for PWA installability
if ('serviceWorker' in navigator && !import.meta.env.DEV) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', { scope: '/' })
      .then((reg) => console.log('ServiceWorker registration successful with scope: ', reg.scope))
      .catch((err) => console.error('ServiceWorker registration failed: ', err))
  })
}

export const App: React.FC = () => {
  const { activeTab, setActiveTab, setCaptureOpen, user, tasks } = useAppStore()

  const pendingTasksCount = tasks.filter(t => !t.completed).length

  return (
    <div className="app-shell animate-fade-in">
      {/* Navigation (Sidebar on Desktop, Bottom Bar on Mobile) */}
      <nav className="nav-bar">
        {/* Header (Desktop only) */}
        <div className="desktop-header-logo" style={styles.desktopLogo}>
          <Sparkles size={24} color="var(--accent-purple)" />
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: '800' }}>FlowState</h2>
        </div>

        {/* Navigation Items */}
        <button 
          className={`nav-item ${activeTab === 'canvas' ? 'active' : ''}`}
          onClick={() => setActiveTab('canvas')}
        >
          <Calendar size={20} />
          <span>Canvas</span>
        </button>

        <button 
          className={`nav-item ${activeTab === 'garden' ? 'active' : ''}`}
          onClick={() => setActiveTab('garden')}
        >
          <Sprout size={20} />
          <span>Garden</span>
        </button>

        {/* Middle Quick Capture Button */}
        <button 
          className="nav-item-center-btn"
          onClick={() => setCaptureOpen(true)}
          title="Voice Capture"
        >
          <Mic size={22} />
        </button>

        <button 
          className={`nav-item ${activeTab === 'studio' ? 'active' : ''}`}
          onClick={() => setActiveTab('studio')}
        >
          <Folder size={20} />
          <span>Studio</span>
        </button>

        <button 
          className={`nav-item ${activeTab === 'mindset' ? 'active' : ''}`}
          onClick={() => setActiveTab('mindset')}
        >
          <Target size={20} />
          <span>Mindset</span>
        </button>

        {/* Profile Card (Desktop only) */}
        <div style={styles.desktopProfile} className="desktop-profile-card">
          <div style={styles.profileAvatar}>
            {user.name.charAt(0)}
          </div>
          <div style={{ flex: 1, overflow: 'hidden', textAlign: 'left' }}>
            <p style={styles.profileName}>{user.name}</p>
            <p style={styles.profileRole}>Solo Creator</p>
          </div>
        </div>
      </nav>

      {/* Main Workspace Area */}
      <main className="main-content">
        {/* Dynamic Greeting/Header based on viewport */}
        <header style={styles.mobileHeader} className="mobile-header-view">
          <div style={{ textAlign: 'left' }}>
            <h1 style={styles.greetingTitle}>Hey, {user.name}</h1>
            <p style={styles.greetingSubtitle}>
              You have {pendingTasksCount} actions pending today.
            </p>
          </div>
          <button style={styles.mobileMicBtn} onClick={() => setCaptureOpen(true)}>
            <Mic size={18} color="#fff" />
          </button>
        </header>

        {/* Desktop Header view */}
        <header style={styles.desktopHeader} className="desktop-header-view">
          <div style={{ textAlign: 'left' }}>
            <h1 style={styles.desktopGreetingTitle}>Welcome back, {user.name}</h1>
            <p style={styles.desktopGreetingSubtitle}>
              Make it a flow day. You have {pendingTasksCount} focus tasks to complete.
            </p>
          </div>
          <div style={styles.desktopStatusBadge}>
            <CheckCircle2 size={14} color="var(--accent-green)" />
            <span>Active Flow State</span>
          </div>
        </header>

        {/* Render Active View */}
        <div style={{ width: '100%', height: '100%', marginTop: '1rem' }}>
          {activeTab === 'canvas' && <DailyCanvas />}
          {activeTab === 'garden' && <Garden />}
          {activeTab === 'studio' && <Studio />}
          {activeTab === 'mindset' && <Mindset />}
        </div>
      </main>

      {/* Quick Capture Bottom Sheet Drawer */}
      <QuickCapture />
    </div>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  desktopLogo: {
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '2rem',
    width: '100%',
    padding: '0 0.5rem',
  },
  desktopProfile: {
    alignItems: 'center',
    gap: '0.75rem',
    marginTop: 'auto',
    padding: '0.75rem',
    borderRadius: '0.5rem',
    backgroundColor: 'var(--surface)',
    border: '1px solid var(--border)',
    width: '100%',
  },
  profileAvatar: {
    width: '2.2rem',
    height: '2.2rem',
    borderRadius: '50%',
    backgroundColor: 'var(--accent-purple)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    color: '#fff',
    fontSize: '0.9rem',
  },
  profileName: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: 'var(--text-primary)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    margin: 0,
  },
  profileRole: {
    fontSize: '0.7rem',
    color: 'var(--text-muted)',
    margin: 0,
  },
  mobileHeader: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  greetingTitle: {
    fontSize: '1.4rem',
    fontWeight: '700',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-display)',
    margin: 0,
  },
  greetingSubtitle: {
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
    marginTop: '0.1rem',
  },
  mobileMicBtn: {
    width: '2.5rem',
    height: '2.5rem',
    borderRadius: '50%',
    backgroundColor: 'var(--accent-purple)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 10px hsla(260, 85%, 65%, 0.3)',
  },
  desktopHeader: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
    borderBottom: '1px solid var(--border)',
    paddingBottom: '1.25rem',
  },
  desktopGreetingTitle: {
    fontSize: '2rem',
    fontWeight: '800',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-display)',
    letterSpacing: '-0.03em',
    margin: 0,
  },
  desktopGreetingSubtitle: {
    fontSize: '0.9rem',
    color: 'var(--text-secondary)',
    marginTop: '0.2rem',
  },
  desktopStatusBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: 'var(--accent-green-glow)',
    border: '1px solid rgba(16, 172, 132, 0.2)',
    padding: '0.5rem 1rem',
    borderRadius: '2rem',
    fontSize: '0.8rem',
    color: 'var(--accent-green)',
    fontFamily: 'var(--font-display)',
    fontWeight: '600',
  }
}

export default App
