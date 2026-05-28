import React, { useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import type { InboxItem } from '../store/useAppStore'
import { Search, Plus, Trash2, ArrowUpRight, Check, Sparkles } from 'lucide-react'

export const Garden: React.FC = () => {
  const { inbox, deleteInboxItem, addTask } = useAppStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [newNote, setNewNote] = useState('')

  const handleAddQuickNote = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newNote.trim()) return

    useAppStore.getState().addInboxItem({
      type: 'text',
      content: newNote
    })

    setNewNote('')
  }

  const handleActionize = (item: InboxItem) => {
    addTask({
      title: item.type === 'link' ? `Review link: ${item.linkMetadata?.title || item.content}` : item.content,
      completed: false,
      dueDate: new Date().toISOString().split('T')[0],
      priority: 'medium'
    })
    deleteInboxItem(item.id)
  }

  const filteredItems = inbox.filter(item => 
    item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.linkMetadata?.title && item.linkMetadata.title.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div style={styles.container}>
      {/* Search and Quick Note Header */}
      <div style={styles.header}>
        <div style={styles.searchBar}>
          <Search size={18} color="var(--text-secondary)" />
          <input
            style={styles.searchInput}
            type="text"
            placeholder="Search saved clips, notes, and links..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <form onSubmit={handleAddQuickNote} style={styles.quickNoteForm}>
          <input
            style={styles.quickNoteInput}
            type="text"
            placeholder="Quick note paste..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
          />
          <button type="submit" style={styles.quickNoteBtn}>
            <Plus size={16} />
          </button>
        </form>
      </div>

      {/* Masonry Grid */}
      <div style={styles.grid}>
        {filteredItems.length === 0 ? (
          <div style={styles.emptyContainer}>
            <Sparkles size={24} color="var(--text-muted)" />
            <p style={styles.emptyText}>No inspiration cards found. Try quick capturing voice notes or bookmarking reels!</p>
          </div>
        ) : (
          filteredItems.map(item => (
            <div key={item.id} style={styles.card} className="animate-fade-in">
              {item.type === 'link' && item.linkMetadata?.thumbnail && (
                <div style={styles.thumbnailContainer}>
                  <img src={item.linkMetadata.thumbnail} alt="Thumbnail" style={styles.thumbnail} />
                  <span style={styles.domainBadge}>{item.linkMetadata.domain}</span>
                </div>
              )}

              <div style={styles.cardBody}>
                <div style={styles.cardMeta}>
                  <span style={{
                    ...styles.badge,
                    backgroundColor: item.type === 'link' ? 'var(--accent-amber-glow)' : item.type === 'voice' ? 'var(--accent-purple-glow)' : 'var(--border)',
                    color: item.type === 'link' ? 'var(--accent-amber)' : item.type === 'voice' ? 'var(--accent-purple)' : 'var(--text-secondary)',
                  }}>
                    {item.type.toUpperCase()}
                  </span>
                  <span style={styles.date}>
                    {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                </div>

                <h4 style={styles.cardTitle}>
                  {item.type === 'link' && item.linkMetadata?.title ? item.linkMetadata.title : item.content}
                </h4>

                {item.type === 'link' && (
                  <a href={item.content} target="_blank" rel="noopener noreferrer" style={styles.linkText}>
                    <span>Visit Link</span>
                    <ArrowUpRight size={12} />
                  </a>
                )}

                {item.parsedTasks && item.parsedTasks.length > 0 && (
                  <div style={styles.tasksPreview}>
                    {item.parsedTasks.map((t, idx) => (
                      <div key={idx} style={styles.taskPreviewItem}>
                        <Check size={10} color="var(--accent-purple)" />
                        <span style={styles.previewText}>{t}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Hover Actions Bar */}
              <div style={styles.actionsBar}>
                <button style={styles.actionBtn} onClick={() => handleActionize(item)}>
                  <Plus size={14} />
                  <span>Actionize</span>
                </button>
                <button style={styles.actionBtnDelete} onClick={() => deleteInboxItem(item.id)}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
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
    flexDirection: 'column',
    gap: '0.75rem',
  },
  searchBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: '0.5rem',
    padding: '0.5rem 0.75rem',
    flex: 1,
    maxWidth: '28rem',
  },
  searchInput: {
    width: '100%',
    fontSize: '0.85rem',
  },
  quickNoteForm: {
    display: 'flex',
    gap: '0.5rem',
    backgroundColor: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: '0.5rem',
    padding: '0.25rem',
    maxWidth: '22rem',
    width: '100%',
  },
  quickNoteInput: {
    flex: 1,
    padding: '0.25rem 0.5rem',
    fontSize: '0.85rem',
  },
  quickNoteBtn: {
    backgroundColor: 'var(--accent-purple)',
    color: '#fff',
    borderRadius: '0.35rem',
    width: '2rem',
    height: '2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(16rem, 1fr))',
    gap: '1.25rem',
    alignItems: 'start',
  },
  emptyContainer: {
    gridColumn: '1 / -1',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4rem 1rem',
    gap: '1rem',
    backgroundColor: 'var(--surface)',
    border: '1px dashed var(--border)',
    borderRadius: '1rem',
    textAlign: 'center',
  },
  emptyText: {
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
    maxWidth: '20rem',
  },
  card: {
    backgroundColor: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: '0.75rem',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    transition: 'all var(--transition-smooth)',
    position: 'relative',
  },
  thumbnailContainer: {
    position: 'relative',
    height: '10rem',
    width: '100%',
    backgroundColor: 'var(--bg-dark)',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  domainBadge: {
    position: 'absolute',
    bottom: '0.5rem',
    right: '0.5rem',
    backgroundColor: 'rgba(0,0,0,0.7)',
    backdropFilter: 'blur(2px)',
    color: '#fff',
    fontSize: '0.65rem',
    padding: '0.15rem 0.4rem',
    borderRadius: '0.25rem',
    fontWeight: '500',
  },
  cardBody: {
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.6rem',
  },
  cardMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    fontSize: '0.6rem',
    padding: '0.15rem 0.4rem',
    borderRadius: '0.25rem',
    fontWeight: '700',
    fontFamily: 'var(--font-display)',
  },
  date: {
    fontSize: '0.7rem',
    color: 'var(--text-muted)',
  },
  cardTitle: {
    fontSize: '0.9rem',
    color: 'var(--text-primary)',
    lineHeight: '1.4',
    fontFamily: 'var(--font-sans)',
  },
  linkText: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.25rem',
    fontSize: '0.75rem',
    color: 'var(--accent-purple)',
    textDecoration: 'none',
    fontWeight: '600',
    fontFamily: 'var(--font-display)',
    alignSelf: 'flex-start',
  },
  tasksPreview: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
    backgroundColor: 'var(--bg-dark)',
    padding: '0.5rem',
    borderRadius: '0.35rem',
    marginTop: '0.25rem',
  },
  taskPreviewItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.3rem',
  },
  previewText: {
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  actionsBar: {
    display: 'flex',
    borderTop: '1px solid var(--border)',
    backgroundColor: 'var(--bg-dark)',
  },
  actionBtn: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.3rem',
    padding: '0.6rem 0',
    fontSize: '0.75rem',
    fontWeight: '600',
    fontFamily: 'var(--font-display)',
    color: 'var(--text-secondary)',
    borderRight: '1px solid var(--border)',
    transition: 'color var(--transition-fast)',
  },
  actionBtnDelete: {
    padding: '0 0.8rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--text-muted)',
    transition: 'color var(--transition-fast)',
  }
}
