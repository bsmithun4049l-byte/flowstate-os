import React, { useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import { Plus, Trash2, CheckCircle2, AlertOctagon, Target } from 'lucide-react'

export const Mindset: React.FC = () => {
  const {
    goals,
    dos,
    donts,
    addGoal,
    deleteGoal,
    addDo,
    deleteDo,
    addDont,
    deleteDont
  } = useAppStore()

  const [newGoal, setNewGoal] = useState('')
  const [newDo, setNewDo] = useState('')
  const [newDont, setNewDont] = useState('')

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newGoal.trim()) return
    addGoal(newGoal.trim())
    setNewGoal('')
  }

  const handleAddDo = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newDo.trim()) return
    addDo(newDo.trim())
    setNewDo('')
  }

  const handleAddDont = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newDont.trim()) return
    addDont(newDont.trim())
    setNewDont('')
  }

  return (
    <div style={styles.container} className="animate-fade-in">
      <div style={styles.header}>
        <Target size={24} color="var(--accent-purple)" />
        <h2 style={styles.headerTitle}>Mindset & Focus Center</h2>
      </div>

      <div style={styles.layoutGrid}>
        {/* Left Side: Goals */}
        <div style={styles.cardPanel}>
          <div style={styles.panelHeader}>
            <h3 style={styles.panelTitle}>Focus Goals & Aspirations</h3>
            <span style={styles.panelBadge}>High Level</span>
          </div>

          <form onSubmit={handleAddGoal} style={styles.form}>
            <input
              type="text"
              placeholder="Add a new high-level focus goal..."
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              style={styles.input}
            />
            <button type="submit" style={styles.addBtn} title="Add Goal">
              <Plus size={16} />
            </button>
          </form>

          <div style={styles.list}>
            {goals.length === 0 ? (
              <p style={styles.emptyText}>No goals defined yet. Write down what drives you!</p>
            ) : (
              goals.map((goal, idx) => (
                <div key={idx} style={styles.itemCard}>
                  <div style={styles.goalNumber}>{idx + 1}</div>
                  <p style={styles.itemText}>{goal}</p>
                  <button style={styles.deleteBtn} onClick={() => deleteGoal(idx)} title="Delete goal">
                    <Trash2 size={14} color="var(--text-muted)" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Side: Do's and Don'ts */}
        <div style={styles.guardrailsGrid} className="guardrails-flex-container">
          {/* Do's card */}
          <div style={{ ...styles.cardPanel, ...styles.dosPanel, flex: 1 }}>
            <div style={styles.panelHeader}>
              <h3 style={styles.panelTitle}>Do's (What to focus on)</h3>
              <span style={{ ...styles.panelBadge, backgroundColor: 'var(--accent-green-glow)', color: 'var(--accent-green)' }}>Do</span>
            </div>

            <form onSubmit={handleAddDo} style={styles.form}>
              <input
                type="text"
                placeholder="Guidelines / Good behaviors..."
                value={newDo}
                onChange={(e) => setNewDo(e.target.value)}
                style={styles.input}
              />
              <button type="submit" style={{ ...styles.addBtn, backgroundColor: 'var(--accent-green)' }} title="Add Guideline">
                <Plus size={16} />
              </button>
            </form>

            <div style={styles.list}>
              {dos.length === 0 ? (
                <p style={styles.emptyText}>No guidelines added yet.</p>
              ) : (
                dos.map((item, idx) => (
                  <div key={idx} style={styles.itemCard}>
                    <CheckCircle2 size={16} color="var(--accent-green)" style={{ flexShrink: 0 }} />
                    <p style={styles.itemText}>{item}</p>
                    <button style={styles.deleteBtn} onClick={() => deleteDo(idx)} title="Delete guideline">
                      <Trash2 size={14} color="var(--text-muted)" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Don'ts card */}
          <div style={{ ...styles.cardPanel, ...styles.dontsPanel, flex: 1 }}>
            <div style={styles.panelHeader}>
              <h3 style={styles.panelTitle}>Don'ts (What to avoid)</h3>
              <span style={{ ...styles.panelBadge, backgroundColor: 'var(--accent-red-glow)', color: 'var(--accent-red)' }}>Avoid</span>
            </div>

            <form onSubmit={handleAddDont} style={styles.form}>
              <input
                type="text"
                placeholder="Bad habits / things to avoid..."
                value={newDont}
                onChange={(e) => setNewDont(e.target.value)}
                style={styles.input}
              />
              <button type="submit" style={{ ...styles.addBtn, backgroundColor: 'var(--accent-red)' }} title="Add Anti-Goal">
                <Plus size={16} />
              </button>
            </form>

            <div style={styles.list}>
              {donts.length === 0 ? (
                <p style={styles.emptyText}>No warnings added yet.</p>
              ) : (
                donts.map((item, idx) => (
                  <div key={idx} style={styles.itemCard}>
                    <AlertOctagon size={16} color="var(--accent-red)" style={{ flexShrink: 0 }} />
                    <p style={styles.itemText}>{item}</p>
                    <button style={styles.deleteBtn} onClick={() => deleteDont(idx)} title="Delete guideline">
                      <Trash2 size={14} color="var(--text-muted)" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
    width: '100%',
    height: '100%',
    paddingBottom: '2rem',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    textAlign: 'left',
  },
  headerTitle: {
    fontSize: '1.25rem',
    fontFamily: 'var(--font-display)',
    fontWeight: '800',
    color: '#fff',
    margin: 0,
  },
  layoutGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(20rem, 1fr))',
    gap: '1.5rem',
    flex: 1,
    alignItems: 'start',
  },
  cardPanel: {
    backgroundColor: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: '0.75rem',
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
  },
  dosPanel: {
    borderLeft: '4px solid var(--accent-green)',
  },
  dontsPanel: {
    borderLeft: '4px solid var(--accent-red)',
  },
  panelHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  panelTitle: {
    fontSize: '1rem',
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    color: '#fff',
    margin: 0,
    textAlign: 'left',
  },
  panelBadge: {
    fontSize: '0.65rem',
    padding: '0.15rem 0.4rem',
    borderRadius: '0.25rem',
    backgroundColor: 'var(--accent-purple-glow)',
    color: 'var(--accent-purple)',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  form: {
    display: 'flex',
    gap: '0.5rem',
  },
  input: {
    flex: 1,
    backgroundColor: 'var(--bg-dark)',
    border: '1px solid var(--border)',
    borderRadius: '0.5rem',
    padding: '0.5rem 0.75rem',
    fontSize: '0.85rem',
    color: '#fff',
    outline: 'none',
  },
  addBtn: {
    backgroundColor: 'var(--accent-purple)',
    color: '#fff',
    borderRadius: '0.5rem',
    width: '2.2rem',
    height: '2.2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    border: 'none',
    flexShrink: 0,
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.6rem',
    maxHeight: '28rem',
    overflowY: 'auto',
    paddingRight: '0.25rem',
  },
  itemCard: {
    backgroundColor: 'var(--bg-dark)',
    border: '1px solid var(--border)',
    borderRadius: '0.5rem',
    padding: '0.6rem 0.75rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    width: '100%',
  },
  goalNumber: {
    width: '1.4rem',
    height: '1.4rem',
    borderRadius: '50%',
    backgroundColor: 'var(--accent-purple-glow)',
    color: 'var(--accent-purple)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.75rem',
    fontWeight: '700',
    flexShrink: 0,
  },
  itemText: {
    fontSize: '0.85rem',
    color: 'var(--text-primary)',
    fontWeight: '500',
    textAlign: 'left',
    margin: 0,
    flex: 1,
    lineHeight: '1.4',
    wordBreak: 'break-word',
  },
  deleteBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0.15rem',
    borderRadius: '0.25rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  emptyText: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    textAlign: 'center',
    padding: '2rem 0',
    margin: 0,
  },
  guardrailsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  }
}
