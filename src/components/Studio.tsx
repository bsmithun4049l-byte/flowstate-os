import React, { useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import { FolderPlus, CheckSquare, Plus, Trash2, Check } from 'lucide-react'

export const Studio: React.FC = () => {
  const { projects, tasks, addProject, addTask, toggleTask, deleteTask } = useAppStore()
  
  const [showAddForm, setShowAddForm] = useState(false)
  const [projectName, setProjectName] = useState('')
  const [projectDesc, setProjectDesc] = useState('')
  const [projectColor, setProjectColor] = useState('hsl(260, 85%, 65%)') // HSL color

  const colors = [
    'hsl(260, 85%, 65%)', // Electric Indigo
    'hsl(35, 90%, 60%)',  // Amber
    'hsl(150, 70%, 50%)', // Mint Green
    'hsl(195, 85%, 50%)', // Sky Blue
    'hsl(325, 80%, 60%)', // Neon Pink
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!projectName.trim()) return

    addProject({
      id: `proj-${Date.now()}`,
      name: projectName,
      description: projectDesc,
      color: projectColor
    })

    setProjectName('')
    setProjectDesc('')
    setShowAddForm(false)
  }

  // Calculate project metrics
  const getProjectStats = (projectId: string) => {
    const projTasks = tasks.filter(t => t.projectId === projectId)
    const total = projTasks.length
    const completed = projTasks.filter(t => t.completed).length
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0
    return { total, completed, progress }
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.title}>Project Studio</h2>
        <button 
          style={styles.newProjectBtn}
          onClick={() => setShowAddForm(!showAddForm)}
        >
          <FolderPlus size={16} />
          <span>New Project</span>
        </button>
      </div>

      {/* Add Project Form Drawer/Collapse */}
      {showAddForm && (
        <form onSubmit={handleSubmit} style={styles.addForm} className="animate-fade-in">
          <h3 style={styles.formTitle}>Create Project</h3>
          <div style={styles.formGroup}>
            <label style={styles.label}>Project Name</label>
            <input
              style={styles.input}
              type="text"
              placeholder="e.g. Portfolio Redesign"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Description</label>
            <textarea
              style={styles.textarea}
              placeholder="What is the key goal of this project?"
              value={projectDesc}
              onChange={(e) => setProjectDesc(e.target.value)}
              rows={2}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Accent Color</label>
            <div style={styles.colorRow}>
              {colors.map(c => (
                <button
                  type="button"
                  key={c}
                  style={{
                    ...styles.colorDot,
                    backgroundColor: c,
                    borderColor: projectColor === c ? '#fff' : 'transparent'
                  }}
                  onClick={() => setProjectColor(c)}
                />
              ))}
            </div>
          </div>
          <div style={styles.formActions}>
            <button 
              type="button" 
              style={styles.cancelBtn}
              onClick={() => setShowAddForm(false)}
            >
              Cancel
            </button>
            <button type="submit" style={styles.submitBtn}>
              Create Project
            </button>
          </div>
        </form>
      )}

      {/* Projects Grid */}
      <div style={styles.grid}>
        {projects.map(proj => {
          const { total, completed, progress } = getProjectStats(proj.id)
          const projTasks = tasks.filter(t => t.projectId === proj.id)

          return (
            <div key={proj.id} style={styles.card}>
              {/* Colored tag line */}
              <div style={{ ...styles.cardColorBar, backgroundColor: proj.color }} />

              <div style={styles.cardHeader}>
                <h3 style={styles.cardName}>{proj.name}</h3>
                <span style={styles.taskCounter}>
                  <CheckSquare size={12} />
                  <span>{completed}/{total}</span>
                </span>
              </div>

              <p style={styles.cardDesc}>{proj.description}</p>

              {/* Progress Bar */}
              <div style={styles.progressContainer}>
                <div style={styles.progressLabel}>
                  <span>Progress</span>
                  <span>{progress}%</span>
                </div>
                <div style={styles.progressBarBg}>
                  <div style={{
                    ...styles.progressBarFill,
                    width: `${progress}%`,
                    backgroundColor: proj.color
                  }} />
                </div>
              </div>

              {/* Action checklist preview */}
              <div style={styles.taskListPreview}>
                <p style={styles.previewHeader}>Key Actions ({projTasks.length})</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: '10rem', overflowY: 'auto', paddingRight: '0.25rem', marginBottom: '0.5rem' }}>
                  {projTasks.map(task => (
                    <div key={task.id} style={styles.taskPreviewItem}>
                      <button
                        style={{
                          ...styles.checkboxMini,
                          backgroundColor: task.completed ? 'var(--accent-green)' : 'transparent',
                          borderColor: task.completed ? 'var(--accent-green)' : 'var(--border)'
                        }}
                        onClick={() => toggleTask(task.id)}
                      >
                        {task.completed && <Check size={8} color="#fff" />}
                      </button>
                      <span style={{
                        ...styles.previewText,
                        textDecoration: task.completed ? 'line-through' : 'none',
                        color: task.completed ? 'var(--text-muted)' : 'var(--text-secondary)',
                        flex: 1
                      }}>
                        {task.title}
                      </span>
                      <button 
                        style={styles.deleteMiniBtn}
                        onClick={() => deleteTask(task.id)}
                        title="Delete Task"
                      >
                        <Trash2 size={12} color="var(--text-muted)" />
                      </button>
                    </div>
                  ))}
                  {projTasks.length === 0 && (
                    <p style={styles.emptyTaskText}>No tasks added yet.</p>
                  )}
                </div>
                <button 
                  style={{ ...styles.addTaskQuickBtn, color: proj.color }}
                  onClick={() => {
                    const title = prompt(`Add a new task to ${proj.name}:`)
                    if (title) {
                      addTask({
                        title,
                        completed: false,
                        dueDate: new Date().toISOString().split('T')[0],
                        priority: 'medium',
                        projectId: proj.id
                      })
                    }
                  }}
                >
                  <Plus size={12} />
                  <span>Add Action Item</span>
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    width: '100%',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: '1.25rem',
    fontFamily: 'var(--font-display)',
    fontWeight: '600',
  },
  newProjectBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    backgroundColor: 'var(--surface)',
    border: '1px solid var(--border)',
    padding: '0.5rem 0.8rem',
    borderRadius: '0.5rem',
    fontSize: '0.8rem',
    fontWeight: '600',
    fontFamily: 'var(--font-display)',
    transition: 'all var(--transition-fast)',
  },
  addForm: {
    backgroundColor: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: '0.75rem',
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  formTitle: {
    fontSize: '1rem',
    fontFamily: 'var(--font-display)',
    fontWeight: '600',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },
  label: {
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
    fontWeight: '500',
  },
  input: {
    backgroundColor: 'var(--bg-dark)',
    border: '1px solid var(--border)',
    borderRadius: '0.5rem',
    padding: '0.5rem 0.75rem',
    fontSize: '0.85rem',
  },
  textarea: {
    backgroundColor: 'var(--bg-dark)',
    border: '1px solid var(--border)',
    borderRadius: '0.5rem',
    padding: '0.5rem 0.75rem',
    fontSize: '0.85rem',
    color: '#fff',
    resize: 'none',
    fontFamily: 'var(--font-sans)',
  },
  colorRow: {
    display: 'flex',
    gap: '0.5rem',
  },
  colorDot: {
    width: '1.5rem',
    height: '1.5rem',
    borderRadius: '50%',
    border: '2px solid transparent',
  },
  formActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '0.5rem',
    marginTop: '0.5rem',
  },
  cancelBtn: {
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
  },
  submitBtn: {
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    backgroundColor: 'var(--accent-purple)',
    color: '#fff',
    fontSize: '0.8rem',
    fontWeight: '600',
    fontFamily: 'var(--font-display)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(18rem, 1fr))',
    gap: '1.5rem',
  },
  card: {
    backgroundColor: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: '0.75rem',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  },
  cardColorBar: {
    height: '4px',
    width: '100%',
  },
  cardHeader: {
    padding: '1.25rem 1.25rem 0.5rem 1.25rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '0.5rem',
  },
  cardName: {
    fontSize: '1rem',
    fontFamily: 'var(--font-display)',
    fontWeight: '600',
  },
  taskCounter: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    fontSize: '0.7rem',
    color: 'var(--text-secondary)',
    backgroundColor: 'var(--bg-dark)',
    padding: '0.15rem 0.4rem',
    borderRadius: '0.25rem',
  },
  cardDesc: {
    padding: '0 1.25rem',
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.4',
    flex: 1,
  },
  progressContainer: {
    padding: '1rem 1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },
  progressLabel: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.7rem',
    color: 'var(--text-secondary)',
    fontWeight: '500',
  },
  progressBarBg: {
    height: '4px',
    backgroundColor: 'var(--bg-dark)',
    borderRadius: '2px',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: '2px',
    transition: 'width var(--transition-smooth)',
  },
  taskListPreview: {
    borderTop: '1px solid var(--border)',
    backgroundColor: 'var(--bg-dark)',
    padding: '1rem 1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },
  previewHeader: {
    fontSize: '0.7rem',
    color: 'var(--text-muted)',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '0.2rem',
  },
  taskPreviewItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
  },
  dotIndicator: {
    width: '4px',
    height: '4px',
    borderRadius: '50%',
  },
  previewText: {
    fontSize: '0.75rem',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  emptyTaskText: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    fontStyle: 'italic',
  },
  addTaskQuickBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.3rem',
    fontSize: '0.75rem',
    fontWeight: '600',
    fontFamily: 'var(--font-display)',
    marginTop: '0.4rem',
    alignSelf: 'flex-start',
  },
  checkboxMini: {
    width: '0.9rem',
    height: '0.9rem',
    borderRadius: '0.2rem',
    border: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    transition: 'all var(--transition-fast)',
  },
  deleteMiniBtn: {
    padding: '0.15rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    opacity: 0.7,
    transition: 'opacity var(--transition-fast)',
  }
}
