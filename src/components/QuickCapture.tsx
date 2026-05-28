import React, { useState, useEffect, useRef } from 'react'
import { useAppStore } from '../store/useAppStore'
import { Mic, MicOff, Link, Keyboard, Send, X, Sparkles } from 'lucide-react'

// Web Speech API Types extension
interface SpeechRecognitionErrorEvent extends Event {
  error: string
  message: string
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number
  results: SpeechRecognitionResultList
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  start: () => void
  stop: () => void
  abort: () => void
  onstart: (event: Event) => void
  onend: (event: Event) => void
  onerror: (event: SpeechRecognitionErrorEvent) => void
  onresult: (event: SpeechRecognitionEvent) => void
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognition
    webkitSpeechRecognition?: new () => SpeechRecognition
  }
}

export const QuickCapture: React.FC = () => {
  const { isCaptureOpen, setCaptureOpen, addInboxItem } = useAppStore()
  const [activeMode, setActiveMode] = useState<'voice' | 'link' | 'text'>('voice')
  const [inputText, setInputText] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [interimTranscript, setInterimTranscript] = useState('')
  const [recognitionError, setRecognitionError] = useState<string | null>(null)
  
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const waveformRef = useRef<number[]>([15, 30, 10, 45, 25, 35, 15, 50, 30, 20, 40, 15])

  useEffect(() => {
    // Initialize Web Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SpeechRecognition) {
      const rec = new SpeechRecognition()
      rec.continuous = true
      rec.interimResults = true
      rec.lang = 'en-US'

      rec.onstart = () => {
        setIsRecording(true)
        setRecognitionError(null)
      }

      rec.onresult = (event: SpeechRecognitionEvent) => {
        let interim = ''
        let final = ''

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript
          } else {
            interim += event.results[i][0].transcript
          }
        }

        if (final) {
          setInputText((prev) => prev + (prev ? ' ' : '') + final)
        }
        setInterimTranscript(interim)
      }

      rec.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error', event.error)
        setRecognitionError(`Error: ${event.error}. Please check mic permissions.`)
        setIsRecording(false)
      }

      rec.onend = () => {
        setIsRecording(false)
        setInterimTranscript('')
      }

      recognitionRef.current = rec
    } else {
      setRecognitionError('Web Speech API is not supported in this browser. Please type or use Chrome/Safari.')
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
    }
  }, [])

  const toggleRecording = () => {
    if (!recognitionRef.current) return

    if (isRecording) {
      recognitionRef.current.stop()
    } else {
      setInterimTranscript('')
      recognitionRef.current.start()
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputText.trim()) return

    if (activeMode === 'link') {
      const isUrl = inputText.startsWith('http://') || inputText.startsWith('https://')
      const cleanUrl = isUrl ? inputText : `https://${inputText}`
      const domain = cleanUrl.replace('https://', '').replace('http://', '').split('/')[0]
      
      addInboxItem({
        type: 'link',
        content: cleanUrl,
        linkMetadata: {
          title: `Resource from ${domain}`,
          domain: domain
        }
      })
    } else {
      // For text and voice transcripts
      // Generate some mock checklist items if it looks like a task list
      let parsedTasks: string[] | undefined
      if (inputText.includes(' and ') || inputText.includes(',') || inputText.length > 50) {
        parsedTasks = inputText
          .split(/and|,|\n/i)
          .map(t => t.trim())
          .filter(t => t.length > 3 && !t.startsWith('http'))
      }

      addInboxItem({
        type: activeMode,
        content: inputText,
        parsedTasks: parsedTasks
      })
    }

    // Reset and close
    setInputText('')
    setInterimTranscript('')
    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop()
    }
    setCaptureOpen(false)
  }

  if (!isCaptureOpen) return null

  return (
    <div style={styles.overlay} className="animate-fade-in">
      <div style={styles.backdrop} onClick={() => setCaptureOpen(false)} />
      
      <div style={styles.drawer} className="animate-slide-up">
        {/* Header */}
        <div style={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={18} color="var(--accent-purple)" />
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem' }}>Quick Capture</h3>
          </div>
          <button style={styles.closeBtn} onClick={() => setCaptureOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div style={styles.tabsContainer}>
          <button 
            style={{ ...styles.tab, ...(activeMode === 'voice' ? styles.activeTab : {}) }} 
            onClick={() => { setActiveMode('voice'); setInputText(''); }}
          >
            <Mic size={16} />
            <span>Voice</span>
          </button>
          <button 
            style={{ ...styles.tab, ...(activeMode === 'link' ? styles.activeTab : {}) }} 
            onClick={() => { setActiveMode('link'); setInputText(''); }}
          >
            <Link size={16} />
            <span>Link</span>
          </button>
          <button 
            style={{ ...styles.tab, ...(activeMode === 'text' ? styles.activeTab : {}) }} 
            onClick={() => { setActiveMode('text'); setInputText(''); }}
          >
            <Keyboard size={16} />
            <span>Note</span>
          </button>
        </div>

        {/* Interactive Content */}
        <form onSubmit={handleSubmit} style={styles.form}>
          {activeMode === 'voice' && (
            <div style={styles.voiceSection}>
              {recognitionError && (
                <div style={styles.errorMessage}>{recognitionError}</div>
              )}
              
              <button 
                type="button" 
                onClick={toggleRecording} 
                style={{
                  ...styles.recordButton,
                  ...(isRecording ? styles.recordingBtnActive : {})
                }}
              >
                {isRecording ? <MicOff size={28} /> : <Mic size={28} />}
              </button>

              <p style={styles.recordStatus}>
                {isRecording ? 'Listening to you speak...' : 'Tap mic to start recording'}
              </p>

              {/* Pulsing visualizer */}
              {isRecording && (
                <div style={styles.waveformContainer}>
                  {waveformRef.current.map((height, idx) => (
                    <div 
                      key={idx} 
                      style={{
                        ...styles.waveBar,
                        height: `${height}px`,
                        animationDelay: `${idx * 0.08}s`
                      }} 
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Transcript / Text Window */}
          <div style={styles.textContainer}>
            <textarea
              style={styles.textarea}
              placeholder={
                activeMode === 'voice' 
                  ? "Your transcribed text will display here as you speak..." 
                  : activeMode === 'link' 
                    ? "Paste or type a URL link (e.g. instagram.com/reel/...)" 
                    : "Jot down a quick thought, note, or task item..."
              }
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={4}
            />
            {interimTranscript && (
              <div style={styles.interimText}>{interimTranscript}</div>
            )}
          </div>

          {/* Action Footer */}
          <div style={styles.footer}>
            <p style={styles.tipText}>
              {activeMode === 'voice' 
                ? "Tip: Speak naturally. AI parses tasks when done." 
                : activeMode === 'link' 
                  ? "Tip: Links are processed into the Inspiration Garden."
                  : "Tip: Saved as an unorganized thought in the Inbox."}
            </p>
            <button 
              type="submit" 
              disabled={!inputText.trim() && !interimTranscript.trim()}
              style={{
                ...styles.submitBtn,
                ...((inputText.trim() || interimTranscript.trim()) ? styles.submitBtnActive : {})
              }}
            >
              <span>Capture</span>
              <Send size={14} />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 999,
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    backdropFilter: 'blur(4px)',
  },
  drawer: {
    position: 'relative',
    width: '100%',
    maxWidth: '48rem',
    backgroundColor: 'var(--surface)',
    borderTopLeftRadius: '1.25rem',
    borderTopRightRadius: '1.25rem',
    border: '1px solid var(--border)',
    borderBottom: 'none',
    padding: '1.5rem',
    boxShadow: '0 -10px 25px rgba(0,0,0,0.5)',
    paddingBottom: 'calc(1.5rem + var(--safe-area-bottom))',
    zIndex: 1000,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.25rem',
  },
  closeBtn: {
    color: 'var(--text-secondary)',
    padding: '0.25rem',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'color var(--transition-fast)',
  },
  tabsContainer: {
    display: 'flex',
    backgroundColor: 'var(--bg-dark)',
    padding: '0.25rem',
    borderRadius: '0.5rem',
    marginBottom: '1.25rem',
    border: '1px solid var(--border)',
  },
  tab: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.4rem',
    padding: '0.6rem 0',
    borderRadius: '0.35rem',
    fontSize: '0.85rem',
    fontFamily: 'var(--font-display)',
    fontWeight: '500',
    color: 'var(--text-secondary)',
    transition: 'all var(--transition-fast)',
  },
  activeTab: {
    backgroundColor: 'var(--surface)',
    color: 'var(--accent-purple)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  voiceSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem 0',
    gap: '0.75rem',
  },
  errorMessage: {
    color: 'var(--accent-red)',
    fontSize: '0.8rem',
    textAlign: 'center',
    marginBottom: '0.5rem',
    backgroundColor: 'rgba(238, 82, 83, 0.1)',
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    border: '1px solid rgba(238, 82, 83, 0.2)',
  },
  recordButton: {
    width: '4.5rem',
    height: '4.5rem',
    borderRadius: '50%',
    backgroundColor: 'var(--bg-dark)',
    border: '3px solid var(--border)',
    color: 'var(--text-primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all var(--transition-fast)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
  },
  recordingBtnActive: {
    backgroundColor: 'var(--accent-purple)',
    borderColor: 'transparent',
    color: '#fff',
    animation: 'pulseGlow 2s infinite',
  },
  recordStatus: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    fontFamily: 'var(--font-display)',
  },
  waveformContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    height: '60px',
    paddingTop: '0.5rem',
  },
  waveBar: {
    width: '4px',
    backgroundColor: 'var(--accent-purple)',
    borderRadius: '2px',
    animation: 'wave 1.2s ease-in-out infinite',
  },
  textContainer: {
    border: '1px solid var(--border)',
    borderRadius: '0.75rem',
    padding: '0.75rem',
    backgroundColor: 'var(--bg-dark)',
    position: 'relative',
  },
  textarea: {
    width: '100%',
    border: 'none',
    resize: 'none',
    backgroundColor: 'transparent',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-sans)',
    fontSize: '0.95rem',
    lineHeight: '1.45',
  },
  interimText: {
    color: 'var(--text-muted)',
    fontStyle: 'italic',
    fontSize: '0.9rem',
    marginTop: '0.5rem',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '1rem',
  },
  tipText: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
  },
  submitBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.6rem 1.2rem',
    borderRadius: '0.5rem',
    backgroundColor: 'var(--border)',
    color: 'var(--text-muted)',
    fontSize: '0.9rem',
    fontWeight: '600',
    fontFamily: 'var(--font-display)',
    cursor: 'not-allowed',
    transition: 'all var(--transition-fast)',
  },
  submitBtnActive: {
    backgroundColor: 'var(--accent-purple)',
    color: '#white',
    cursor: 'pointer',
  }
}
