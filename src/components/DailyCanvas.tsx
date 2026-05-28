import React, { useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import type { Task } from '../store/useAppStore'
import { Plus, Check, Calendar, CheckSquare, RefreshCw, Clock, ArrowRight, Trash2, X } from 'lucide-react'

export const DailyCanvas: React.FC = () => {
  const { 
    tasks, 
    inbox, 
    projects, 
    addTask, 
    toggleTask, 
    deleteInboxItem,
    addProject,
    processInboxToTasks 
  } = useAppStore()

  const [activeSubTab, setActiveSubTab] = useState<'timeline' | 'backlog'>('timeline')
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [selectedPriority, setSelectedPriority] = useState<'low' | 'medium' | 'high'>('medium')
  const [selectedProject, setSelectedProject] = useState('')

  // Calendar View Date State
  const todayStr = new Date().toISOString().split('T')[0]
  const [selectedDate, setSelectedDate] = useState<string>(todayStr)

  // Creation Form Inline Scheduling State
  const [isSchedulingInline, setIsSchedulingInline] = useState(false)
  const [taskDueDate, setTaskDueDate] = useState(todayStr)
  const [inlineStartHour, setInlineStartHour] = useState('08')
  const [inlineStartMin, setInlineStartMin] = useState('00')
  const [inlineStartPeriod, setInlineStartPeriod] = useState<'AM' | 'PM'>('AM')
  const [inlineEndHour, setInlineEndHour] = useState('09')
  const [inlineEndMin, setInlineEndMin] = useState('00')
  const [inlineEndPeriod, setInlineEndPeriod] = useState<'AM' | 'PM'>('AM')

  // Custom Scheduler Form States (for backlog list)
  const [schedulingTaskId, setSchedulingTaskId] = useState<string | null>(null)
  const [schedStartHour, setSchedStartHour] = useState('08')
  const [schedStartMin, setSchedStartMin] = useState('00')
  const [schedStartPeriod, setSchedStartPeriod] = useState<'AM' | 'PM'>('AM')
  const [schedEndHour, setSchedEndHour] = useState('09')
  const [schedEndMin, setSchedEndMin] = useState('00')
  const [schedEndPeriod, setSchedEndPeriod] = useState<'AM' | 'PM'>('AM')

  // Timeline Event Scheduling Modal States
  const [isTimelineModalOpen, setIsTimelineModalOpen] = useState(false)
  const [timelineHour, setTimelineHour] = useState(8)
  const [timelinePeriod, setTimelinePeriod] = useState<'AM' | 'PM'>('AM')
  const [timelineTitle, setTimelineTitle] = useState('')
  const [timelineProject, setTimelineProject] = useState('')
  const [timelinePriority, setTimelinePriority] = useState<'low' | 'medium' | 'high'>('medium')
  const [timelineStartHour, setTimelineStartHour] = useState('08')
  const [timelineStartMin, setTimelineStartMin] = useState('00')
  const [timelineStartPeriod, setTimelineStartPeriod] = useState<'AM' | 'PM'>('AM')
  const [timelineEndHour, setTimelineEndHour] = useState('09')
  const [timelineEndMin, setTimelineEndMin] = useState('00')
  const [timelineEndPeriod, setTimelineEndPeriod] = useState<'AM' | 'PM'>('AM')

  // Full 24-Hour Timeline in 12-Hour format starting from 12:00 AM
  const hours12: { label: string; hour: number; period: 'AM' | 'PM' }[] = [
    { label: '12:00 AM', hour: 12, period: 'AM' },
    { label: '1:00 AM', hour: 1, period: 'AM' },
    { label: '2:00 AM', hour: 2, period: 'AM' },
    { label: '3:00 AM', hour: 3, period: 'AM' },
    { label: '4:00 AM', hour: 4, period: 'AM' },
    { label: '5:00 AM', hour: 5, period: 'AM' },
    { label: '6:00 AM', hour: 6, period: 'AM' },
    { label: '7:00 AM', hour: 7, period: 'AM' },
    { label: '8:00 AM', hour: 8, period: 'AM' },
    { label: '9:00 AM', hour: 9, period: 'AM' },
    { label: '10:00 AM', hour: 10, period: 'AM' },
    { label: '11:00 AM', hour: 11, period: 'AM' },
    { label: '12:00 PM', hour: 12, period: 'PM' },
    { label: '1:00 PM', hour: 1, period: 'PM' },
    { label: '2:00 PM', hour: 2, period: 'PM' },
    { label: '3:00 PM', hour: 3, period: 'PM' },
    { label: '4:00 PM', hour: 4, period: 'PM' },
    { label: '5:00 PM', hour: 5, period: 'PM' },
    { label: '6:00 PM', hour: 6, period: 'PM' },
    { label: '7:00 PM', hour: 7, period: 'PM' },
    { label: '8:00 PM', hour: 8, period: 'PM' },
    { label: '9:00 PM', hour: 9, period: 'PM' },
    { label: '10:00 PM', hour: 10, period: 'PM' },
    { label: '11:00 PM', hour: 11, period: 'PM' }
  ]

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTaskTitle.trim()) return

    let timeSlotStr: string | undefined
    if (isSchedulingInline) {
      timeSlotStr = `${inlineStartHour.padStart(2, '0')}:${inlineStartMin.padStart(2, '0')} ${inlineStartPeriod} - ${inlineEndHour.padStart(2, '0')}:${inlineEndMin.padStart(2, '0')} ${inlineEndPeriod}`
    }

    addTask({
      title: newTaskTitle,
      completed: false,
      dueDate: isSchedulingInline ? taskDueDate : selectedDate,
      priority: selectedPriority,
      projectId: selectedProject || undefined,
      timeSlot: timeSlotStr
    })

    setNewTaskTitle('')
    setIsSchedulingInline(false)
  }

  const handleCreateProjectInline = () => {
    const name = prompt('Enter new project name:')
    if (!name) return
    const colors = [
      'hsl(260, 85%, 65%)', // Electric Indigo
      'hsl(35, 90%, 60%)',  // Amber
      'hsl(150, 70%, 50%)', // Mint Green
      'hsl(195, 85%, 50%)', // Sky Blue
      'hsl(325, 80%, 60%)', // Neon Pink
    ]
    const randomColor = colors[Math.floor(Math.random() * colors.length)]
    const newProjId = `proj-${Date.now()}`
    
    addProject({
      id: newProjId,
      name,
      description: 'Quick added from Task creator.',
      color: randomColor
    })
    
    setSelectedProject(newProjId)
  }

  const handleCreateProjectInlineModal = () => {
    const name = prompt('Enter new project name:')
    if (!name) return
    const colors = ['hsl(260, 85%, 65%)', 'hsl(35, 90%, 60%)', 'hsl(150, 70%, 50%)', 'hsl(195, 85%, 50%)', 'hsl(325, 80%, 60%)']
    const randomColor = colors[Math.floor(Math.random() * colors.length)]
    const newProjId = `proj-${Date.now()}`
    
    addProject({
      id: newProjId,
      name,
      description: 'Quick added inline.',
      color: randomColor
    })
    
    setTimelineProject(newProjId)
  }

  // Get tasks for the current viewed day
  const todayTasks = tasks.filter(t => t.dueDate === selectedDate)
  
  // Tasks on the schedule
  const scheduledTasks = todayTasks.filter(t => t.timeSlot)
  // Tasks not yet scheduled (backlog) for the active date and not completed
  const unscheduledTasks = todayTasks.filter(t => !t.timeSlot && !t.completed)

  // Parse time slots like "08:15 AM - 09:30 AM"
  const parseTimeSlot = (slot: string) => {
    if (!slot) return null
    const startPart = slot.split('-')[0].trim()
    const match = startPart.match(/(\d+):(\d+)\s*(AM|PM)/i)
    if (match) {
      return {
        hour: parseInt(match[1]),
        minute: parseInt(match[2]),
        period: match[3].toUpperCase() as 'AM' | 'PM'
      }
    }
    // Fallback support for 24h formats
    const parts = startPart.split(':')
    if (parts.length >= 2) {
      const h24 = parseInt(parts[0])
      const period = h24 >= 12 ? 'PM' : 'AM'
      const h12 = h24 % 12 === 0 ? 12 : h24 % 12
      return {
        hour: h12,
        minute: parseInt(parts[1]),
        period: period as 'AM' | 'PM'
      }
    }
    return null
  }

  const getTaskForHour = (hour: number, period: string): Task[] => {
    return scheduledTasks.filter(t => {
      const parsed = parseTimeSlot(t.timeSlot || '')
      if (!parsed) return false
      return parsed.hour === hour && parsed.period === period
    })
  }

  const handleOpenScheduler = (taskId: string) => {
    setSchedulingTaskId(taskId)
    const task = tasks.find(t => t.id === taskId)
    if (task && task.timeSlot) {
      const parsed = parseTimeSlot(task.timeSlot)
      if (parsed) {
        setSchedStartHour(parsed.hour.toString().padStart(2, '0'))
        setSchedStartMin(parsed.minute.toString().padStart(2, '0'))
        setSchedStartPeriod(parsed.period)
        
        const endPart = task.timeSlot.split('-')[1]?.trim()
        const endMatch = endPart?.match(/(\d+):(\d+)\s*(AM|PM)/i)
        if (endMatch) {
          setSchedEndHour(endMatch[1].padStart(2, '0'))
          setSchedEndMin(endMatch[2].padStart(2, '0'))
          setSchedEndPeriod(endMatch[3].toUpperCase() as any)
        }
      }
    } else {
      setSchedStartHour('08')
      setSchedStartMin('00')
      setSchedStartPeriod('AM')
      setSchedEndHour('09')
      setSchedEndMin('00')
      setSchedEndPeriod('AM')
    }
  }

  const handleConfirmSchedule = (taskId: string) => {
    const startHourNum = parseInt(schedStartHour)
    const endHourNum = parseInt(schedEndHour)
    if (isNaN(startHourNum) || isNaN(endHourNum) || startHourNum < 1 || startHourNum > 12 || endHourNum < 1 || endHourNum > 12) {
      alert('Please select valid hours (1-12)')
      return
    }

    const formattedSlot = `${schedStartHour.padStart(2, '0')}:${schedStartMin.padStart(2, '0')} ${schedStartPeriod} - ${schedEndHour.padStart(2, '0')}:${schedEndMin.padStart(2, '0')} ${schedEndPeriod}`
    
    useAppStore.setState((state) => ({
      tasks: state.tasks.map(t => 
        t.id === taskId ? { ...t, timeSlot: formattedSlot } : t
      )
    }))
    setSchedulingTaskId(null)
  }

  const unscheduleTask = (taskId: string) => {
    useAppStore.setState((state) => ({
      tasks: state.tasks.map(t => 
        t.id === taskId ? { ...t, timeSlot: undefined } : t
      )
    }))
  }

  // Opens the dedicated Event Scheduling Modal for the Timeline
  const handleCalendarSlotClick = (hour: number, period: 'AM' | 'PM') => {
    setTimelineHour(hour)
    setTimelinePeriod(period)
    
    setTimelineStartHour(hour.toString().padStart(2, '0'))
    setTimelineStartMin('00')
    setTimelineStartPeriod(period)
    
    const nextHour = hour === 12 ? 1 : hour + 1
    const nextPeriod = hour === 11 && period === 'AM' ? 'PM' : hour === 11 && period === 'PM' ? 'AM' : period
    
    setTimelineEndHour(nextHour.toString().padStart(2, '0'))
    setTimelineEndMin('00')
    setTimelineEndPeriod(nextPeriod)

    setIsTimelineModalOpen(true)
  }

  const handleConfirmTimelineSchedule = () => {
    if (!timelineTitle.trim()) {
      alert('Please enter an event name')
      return
    }
    const startHourNum = parseInt(timelineStartHour)
    const endHourNum = parseInt(timelineEndHour)
    if (isNaN(startHourNum) || isNaN(endHourNum) || startHourNum < 1 || startHourNum > 12 || endHourNum < 1 || endHourNum > 12) {
      alert('Please select valid hours (1-12)')
      return
    }

    const formattedSlot = `${timelineStartHour.padStart(2, '0')}:${timelineStartMin.padStart(2, '0')} ${timelineStartPeriod} - ${timelineEndHour.padStart(2, '0')}:${timelineEndMin.padStart(2, '0')} ${timelineEndPeriod}`
    
    addTask({
      title: timelineTitle,
      completed: false,
      dueDate: selectedDate, // Schedules for the date active on calendar
      priority: timelinePriority,
      timeSlot: formattedSlot,
      projectId: timelineProject || undefined
    })

    // Reset and Close
    setTimelineTitle('')
    setTimelineProject('')
    setTimelinePriority('medium')
    setIsTimelineModalOpen(false)
  }

  // Calendar Date Navigation helpers (Timezone-safe)
  const parseLocalDate = (dateStr: string): Date => {
    const parts = dateStr.split('-')
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10)
      const month = parseInt(parts[1], 10) - 1
      const day = parseInt(parts[2], 10)
      return new Date(year, month, day)
    }
    return new Date(dateStr)
  }

  const formatLocalDate = (date: Date): string => {
    const y = date.getFullYear()
    const m = (date.getMonth() + 1).toString().padStart(2, '0')
    const d = date.getDate().toString().padStart(2, '0')
    return `${y}-${m}-${d}`
  }

  const handlePrevDay = () => {
    const d = parseLocalDate(selectedDate)
    d.setDate(d.getDate() - 1)
    setSelectedDate(formatLocalDate(d))
  }

  const handleNextDay = () => {
    const d = parseLocalDate(selectedDate)
    d.setDate(d.getDate() + 1)
    setSelectedDate(formatLocalDate(d))
  }

  const formatDateLabel = (dateStr: string) => {
    const d = parseLocalDate(dateStr)
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
  }

  // Pre-configured list options for dynamic picker
  const hourOptions = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
  const minuteOptions = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55']

  return (
    <div style={styles.container}>
      {/* Mobile Sub Tabs */}
      <div style={styles.mobileTabs} className="mobile-tabs-container">
        <button 
          style={{ ...styles.mobileTab, ...(activeSubTab === 'timeline' ? styles.activeMobileTab : {}) }}
          onClick={() => setActiveSubTab('timeline')}
        >
          <Calendar size={16} />
          <span>Focus Timeline</span>
        </button>
        <button 
          style={{ ...styles.mobileTab, ...(activeSubTab === 'backlog' ? styles.activeMobileTab : {}) }}
          onClick={() => setActiveSubTab('backlog')}
        >
          <CheckSquare size={16} />
          <span>Tasks & Inbox ({unscheduledTasks.length + inbox.length})</span>
        </button>
      </div>

      <div style={styles.desktopLayout}>
        {/* Left Side: Tasks & Inbox */}
        <div style={{
          ...styles.panel,
          ...styles.leftPanel,
          display: activeSubTab === 'backlog' ? 'flex' : 'none'
        }} className="desktop-visible-flex">
          {/* Quick Capture Feed (Inbox) */}
          {inbox.length > 0 && (
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Inbox Captures ({inbox.length})</h2>
              <div style={styles.inboxList}>
                {inbox.map((item) => (
                  <div key={item.id} style={styles.inboxCard}>
                    <div style={styles.inboxCardHeader}>
                      <span style={{
                        ...styles.badge,
                        backgroundColor: item.type === 'voice' ? 'var(--accent-purple-glow)' : 'var(--accent-amber-glow)',
                        color: item.type === 'voice' ? 'var(--accent-purple)' : 'var(--accent-amber)',
                      }}>
                        {item.type.toUpperCase()}
                      </span>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button style={styles.iconBtn} onClick={() => processInboxToTasks(item.id)} title="Process Tasks">
                          <RefreshCw size={14} color="var(--accent-green)" />
                        </button>
                        <button style={styles.iconBtn} onClick={() => deleteInboxItem(item.id)} title="Archive">
                          <Trash2 size={14} color="var(--accent-red)" />
                        </button>
                      </div>
                    </div>

                    <p style={styles.inboxContent}>{item.content}</p>

                    {item.parsedTasks && item.parsedTasks.length > 0 && (
                      <div style={styles.parsedTasksList}>
                        <p style={styles.parsedTitle}>AI Parsed Actions:</p>
                        {item.parsedTasks.map((tText, tIdx) => (
                          <div key={tIdx} style={styles.parsedTaskItem}>
                            <ArrowRight size={10} color="var(--accent-purple)" />
                            <span>{tText}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Add Task Form */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Create New Task</h2>
            <form onSubmit={handleAddTask} style={styles.addTaskForm}>
              <input
                style={styles.addTaskInput}
                type="text"
                placeholder="Write a task (e.g. Finish editorial schedule)..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
              />
              <div style={styles.formRow}>
                <select 
                  style={styles.select}
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value as any)}
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>

                <div style={{ display: 'flex', gap: '0.25rem', flex: 1.2 }}>
                  <select 
                    style={{ ...styles.select, flex: 1 }}
                    value={selectedProject}
                    onChange={(e) => setSelectedProject(e.target.value)}
                  >
                    <option value="">No Project</option>
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                  <button 
                    type="button" 
                    style={styles.inlineAddProjBtn} 
                    onClick={handleCreateProjectInline}
                    title="Add New Project Inline"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {/* Inline Schedule Toggles */}
              <div style={styles.scheduleToggleRow}>
                <button 
                  type="button"
                  style={{
                    ...styles.scheduleToggleBtn,
                    backgroundColor: isSchedulingInline ? 'var(--accent-red)' : 'var(--surface-hover)',
                    color: isSchedulingInline ? '#fff' : 'var(--text-secondary)'
                  }}
                  onClick={() => setIsSchedulingInline(!isSchedulingInline)}
                >
                  <Clock size={12} />
                  <span>{isSchedulingInline ? 'Scheduled' : 'Schedule Time'}</span>
                </button>
                
                <input 
                  type="date" 
                  style={styles.dateInput} 
                  value={taskDueDate} 
                  onChange={e => setTaskDueDate(e.target.value)}
                />
              </div>

              {/* Inline Time Slot Picker */}
              {isSchedulingInline && (
                <div style={styles.inlineSchedulerContainer} className="animate-fade-in">
                  <div style={styles.schedulerRow}>
                    <div style={styles.timeGroup}>
                      <select 
                        style={styles.timeSelect} 
                        value={inlineStartHour} 
                        onChange={e => setInlineStartHour(e.target.value)}
                      >
                        {hourOptions.map(h => (
                          <option key={h} value={h}>{h}</option>
                        ))}
                      </select>
                      <span>:</span>
                      <select 
                        style={styles.timeSelect} 
                        value={inlineStartMin} 
                        onChange={e => setInlineStartMin(e.target.value)}
                      >
                        {minuteOptions.map(m => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                      <select 
                        style={styles.periodSelect} 
                        value={inlineStartPeriod} 
                        onChange={e => setInlineStartPeriod(e.target.value as any)}
                      >
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                      </select>
                    </div>
                    
                    <span style={{ color: 'var(--text-muted)' }}>to</span>

                    <div style={styles.timeGroup}>
                      <select 
                        style={styles.timeSelect} 
                        value={inlineEndHour} 
                        onChange={e => setInlineEndHour(e.target.value)}
                      >
                        {hourOptions.map(h => (
                          <option key={h} value={h}>{h}</option>
                        ))}
                      </select>
                      <span>:</span>
                      <select 
                        style={styles.timeSelect} 
                        value={inlineEndMin} 
                        onChange={e => setInlineEndMin(e.target.value)}
                      >
                        {minuteOptions.map(m => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                      <select 
                        style={styles.periodSelect} 
                        value={inlineEndPeriod} 
                        onChange={e => setInlineEndPeriod(e.target.value as any)}
                      >
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              <button type="submit" style={styles.addTaskSubmitBtn}>
                <Plus size={16} />
                <span>Create & Add Task</span>
              </button>
            </form>
          </div>

          {/* Unscheduled Backlog Tasks */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Backlog Tasks ({unscheduledTasks.length})</h2>
            <div style={styles.taskList}>
              {unscheduledTasks.length === 0 ? (
                <p style={styles.emptyText}>All tasks scheduled! Capture more thoughts or take a break.</p>
              ) : (
                unscheduledTasks.map(task => {
                  const proj = projects.find(p => p.id === task.projectId)
                  const isSchedulingThis = schedulingTaskId === task.id

                  return (
                    <div key={task.id} style={taskCardContainer}>
                      <div style={styles.taskCard}>
                        {/* Done Button */}
                        <button 
                          style={{
                            ...styles.tasksDoneBtn,
                            backgroundColor: task.completed ? 'var(--accent-green-glow)' : 'var(--surface)',
                            borderColor: task.completed ? 'var(--accent-green)' : 'var(--border)',
                            color: task.completed ? 'var(--accent-green)' : 'var(--text-secondary)'
                          }}
                          onClick={() => toggleTask(task.id)}
                        >
                          <Check size={12} />
                          <span>{task.completed ? 'Done' : 'Mark Done'}</span>
                        </button>
                        
                        <div style={{ flex: 1 }}>
                          <p style={{ ...styles.taskTitle, textDecoration: task.completed ? 'line-through' : 'none' }}>
                            {task.title}
                          </p>
                          <div style={styles.taskMeta}>
                            {proj && (
                              <span style={{ ...styles.projectDot, backgroundColor: proj.color }}>
                                {proj.name}
                              </span>
                            )}
                            <span style={{
                              color: task.priority === 'high' ? 'var(--accent-red)' : task.priority === 'medium' ? 'var(--accent-amber)' : 'var(--text-secondary)'
                            }}>
                              {task.priority.toUpperCase()}
                            </span>
                          </div>
                        </div>

                        {/* Red Schedule button */}
                        <button 
                          style={styles.scheduleWidgetTrigger} 
                          onClick={() => handleOpenScheduler(task.id)}
                        >
                          <Clock size={12} />
                          <span>Schedule</span>
                        </button>
                      </div>

                      {/* Custom Time Selector Dropdowns Widget */}
                      {isSchedulingThis && (
                        <div style={styles.schedulerWidget} className="animate-fade-in">
                          <p style={styles.schedulerWidgetTitle}>Set Time Slot (12h format)</p>
                          <div style={styles.schedulerRow}>
                            <div style={styles.timeGroup}>
                              <select 
                                style={styles.timeSelect} 
                                value={schedStartHour} 
                                onChange={e => setSchedStartHour(e.target.value)}
                              >
                                {hourOptions.map(h => (
                                  <option key={h} value={h}>{h}</option>
                                ))}
                              </select>
                              <span>:</span>
                              <select 
                                style={styles.timeSelect} 
                                value={schedStartMin} 
                                onChange={e => setSchedStartMin(e.target.value)}
                              >
                                {minuteOptions.map(m => (
                                  <option key={m} value={m}>{m}</option>
                                ))}
                              </select>
                              <select 
                                style={styles.periodSelect} 
                                value={schedStartPeriod} 
                                onChange={e => setSchedStartPeriod(e.target.value as any)}
                              >
                                <option value="AM">AM</option>
                                <option value="PM">PM</option>
                              </select>
                            </div>
                            
                            <span style={{ color: 'var(--text-muted)' }}>to</span>

                            <div style={styles.timeGroup}>
                              <select 
                                style={styles.timeSelect} 
                                value={schedEndHour} 
                                onChange={e => setSchedEndHour(e.target.value)}
                              >
                                {hourOptions.map(h => (
                                  <option key={h} value={h}>{h}</option>
                                ))}
                              </select>
                              <span>:</span>
                              <select 
                                style={styles.timeSelect} 
                                value={schedEndMin} 
                                onChange={e => setSchedEndMin(e.target.value)}
                              >
                                {minuteOptions.map(m => (
                                  <option key={m} value={m}>{m}</option>
                                ))}
                              </select>
                              <select 
                                style={styles.periodSelect} 
                                value={schedEndPeriod} 
                                onChange={e => setSchedEndPeriod(e.target.value as any)}
                              >
                                <option value="AM">AM</option>
                                <option value="PM">PM</option>
                              </select>
                            </div>
                          </div>
                          
                          <div style={styles.schedulerActions}>
                            <button 
                              type="button" 
                              style={styles.schedCancelBtn} 
                              onClick={() => setSchedulingTaskId(null)}
                            >
                              Cancel
                            </button>
                            <button 
                              type="button" 
                              style={styles.schedSaveBtn} 
                              onClick={() => handleConfirmSchedule(task.id)}
                            >
                              Save Block
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Calendar Grid Timeline */}
        <div style={{
          ...styles.panel,
          ...styles.rightPanel,
          display: activeSubTab === 'timeline' ? 'flex' : 'none'
        }} className="desktop-visible-flex">
          <div style={styles.calendarHeader}>
            <h2 style={styles.sectionTitle}>Daily Calendar Focus</h2>
            
            {/* Interactive Date Picker Selector */}
            <div style={styles.dateSelectorContainer}>
              <button style={styles.dateNavBtn} onClick={handlePrevDay} title="Previous Day">&lt;</button>
              
              <label 
                style={{
                  ...styles.dateSelectTriggerBtn,
                  position: 'relative',
                  display: 'inline-flex',
                }}
              >
                <Calendar size={12} style={{ marginRight: '4px' }} />
                <span>{formatDateLabel(selectedDate)}</span>
                <input 
                  type="date"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    opacity: 0,
                    cursor: 'pointer',
                    zIndex: 10,
                    border: 'none',
                    outline: 'none'
                  }}
                  value={selectedDate}
                  onChange={(e) => {
                    if (e.target.value) {
                      setSelectedDate(e.target.value)
                    }
                  }}
                />
              </label>

              <button style={styles.dateNavBtn} onClick={handleNextDay} title="Next Day">&gt;</button>
              {selectedDate !== todayStr && (
                <button style={styles.todayBtn} onClick={() => setSelectedDate(todayStr)}>Today</button>
              )}
            </div>
          </div>

          <div style={styles.timelineGrid}>
            {hours12.map(({ label, hour, period }) => {
              const hourTasks = getTaskForHour(hour, period)
              return (
                <div key={label} style={styles.hourRow}>
                  <div style={styles.hourRowMeta}>
                    <div style={styles.hourLabel}>
                      {label}
                    </div>
                    <button 
                      style={styles.calendarAddBtn}
                      onClick={() => handleCalendarSlotClick(hour, period)}
                      title={`Schedule at ${label}`}
                    >
                      <Plus size={10} color="#fff" />
                      <span>Block</span>
                    </button>
                  </div>
                  <div style={styles.hourContent}>
                    {hourTasks.length > 0 ? (
                      hourTasks.map(task => {
                        const proj = projects.find(p => p.id === task.projectId)
                        return (
                          <div 
                            key={task.id} 
                            style={{ 
                              ...styles.scheduledTaskCard, 
                              borderLeftColor: proj ? proj.color : 'var(--accent-purple)',
                              opacity: task.completed ? 0.6 : 1
                            }}
                          >
                            <div style={{ flex: 1, textAlign: 'left' }}>
                              <p style={{ ...styles.scheduledTaskTitle, textDecoration: task.completed ? 'line-through' : 'none' }}>
                                {task.title}
                              </p>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.1rem' }}>
                                <Clock size={10} color="var(--text-muted)" />
                                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{task.timeSlot}</span>
                                {proj && (
                                  <>
                                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>•</span>
                                    <span style={{ fontSize: '0.65rem', color: proj.color, fontWeight: '600' }}>{proj.name}</span>
                                  </>
                                )}
                              </div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                              {/* Mini done button */}
                              <button 
                                style={{
                                  ...styles.doneMiniBtn,
                                  backgroundColor: task.completed ? 'var(--accent-green-glow)' : 'var(--bg-dark)',
                                  color: task.completed ? 'var(--accent-green)' : 'var(--text-muted)'
                                }}
                                onClick={() => toggleTask(task.id)}
                              >
                                {task.completed ? <Check size={8} style={{ marginRight: '2px' }} /> : null}
                                <span>Done</span>
                              </button>
                              
                              <button style={styles.unschedBtn} onClick={() => unscheduleTask(task.id)}>
                                <X size={12} />
                              </button>
                            </div>
                          </div>
                        )
                      })
                    ) : (
                      // Empty placeholder
                      <div style={styles.emptyHourPlaceholder}>
                        <span>No events scheduled</span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Dynamic Event Scheduling Modal */}
      {isTimelineModalOpen && (
        <div style={styles.modalOverlay} className="animate-fade-in">
          <div style={styles.modalBackdrop} onClick={() => setIsTimelineModalOpen(false)} />
          <div style={styles.modalContent} className="animate-slide-up">
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Schedule Event ({timelineHour}:00 {timelinePeriod})</h3>
              <button style={styles.closeBtn} onClick={() => setIsTimelineModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            
            <div style={styles.modalBody}>
              <div style={styles.formGroup}>
                <label style={styles.modalLabel}>Event Title</label>
                <input 
                  type="text" 
                  style={styles.modalInput} 
                  value={timelineTitle} 
                  onChange={e => setTimelineTitle(e.target.value)} 
                  placeholder="e.g. Draft video outline..."
                  required
                />
              </div>

              <div style={styles.formRow}>
                <div style={{ ...styles.formGroup, flex: 1 }}>
                  <label style={styles.modalLabel}>Priority</label>
                  <select 
                    style={styles.modalSelect} 
                    value={timelinePriority} 
                    onChange={e => setTimelinePriority(e.target.value as any)}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                
                <div style={{ ...styles.formGroup, flex: 1.5 }}>
                  <label style={styles.modalLabel}>Project</label>
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    <select 
                      style={{ ...styles.modalSelect, flex: 1 }} 
                      value={timelineProject} 
                      onChange={e => setTimelineProject(e.target.value)}
                    >
                      <option value="">No Project</option>
                      {projects.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                    <button 
                      type="button" 
                      style={styles.inlineAddProjBtnModal} 
                      onClick={handleCreateProjectInlineModal}
                      title="Add New Project"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.modalLabel}>Time Slot Options</label>
                <div style={styles.schedulerRow}>
                  <div style={styles.timeGroup}>
                    <select 
                      style={styles.timeSelect} 
                      value={timelineStartHour} 
                      onChange={e => setTimelineStartHour(e.target.value)}
                    >
                      {hourOptions.map(h => (
                        <option key={h} value={h}>{h}</option>
                      ))}
                    </select>
                    <span>:</span>
                    <select 
                      style={styles.timeSelect} 
                      value={timelineStartMin} 
                      onChange={e => setTimelineStartMin(e.target.value)}
                    >
                      {minuteOptions.map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                    <select 
                      style={styles.periodSelect} 
                      value={timelineStartPeriod} 
                      onChange={e => setTimelineStartPeriod(e.target.value as any)}
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                  
                  <span style={{ color: 'var(--text-muted)' }}>to</span>

                  <div style={styles.timeGroup}>
                    <select 
                      style={styles.timeSelect} 
                      value={timelineEndHour} 
                      onChange={e => setTimelineEndHour(e.target.value)}
                    >
                      {hourOptions.map(h => (
                        <option key={h} value={h}>{h}</option>
                      ))}
                    </select>
                    <span>:</span>
                    <select 
                      style={styles.timeSelect} 
                      value={timelineEndMin} 
                      onChange={e => setTimelineEndMin(e.target.value)}
                    >
                      {minuteOptions.map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                    <select 
                      style={styles.periodSelect} 
                      value={timelineEndPeriod} 
                      onChange={e => setTimelineEndPeriod(e.target.value as any)}
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div style={styles.modalFooter}>
              <button 
                type="button" 
                style={styles.modalCancelBtn} 
                onClick={() => setIsTimelineModalOpen(false)}
              >
                Cancel
              </button>
              <button 
                type="button" 
                style={styles.modalSaveBtn} 
                onClick={handleConfirmTimelineSchedule}
              >
                Schedule Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const taskCardContainer: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  mobileTabs: {
    backgroundColor: 'var(--surface)',
    borderRadius: '0.5rem',
    padding: '0.2rem',
    marginBottom: '1rem',
    border: '1px solid var(--border)',
  },
  mobileTab: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.4rem',
    padding: '0.5rem 0',
    borderRadius: '0.35rem',
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
    fontFamily: 'var(--font-display)',
    fontWeight: '500',
  },
  activeMobileTab: {
    backgroundColor: 'var(--bg-dark)',
    color: 'var(--accent-purple)',
    boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
  },
  desktopLayout: {
    display: 'flex',
    gap: '1.5rem',
    flex: 1,
    height: '100%',
  },
  panel: {
    flexDirection: 'column',
    gap: '1.25rem',
    height: '100%',
    overflowY: 'auto',
  },
  leftPanel: {
    flex: 4,
  },
  rightPanel: {
    flex: 6,
    borderLeft: '1px solid var(--border)',
    paddingLeft: '1.5rem',
  },
  calendarHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem',
  },
  dateLabel: {
    fontFamily: 'var(--font-display)',
    color: 'var(--accent-purple)',
    fontSize: '0.9rem',
    fontWeight: '600',
  },
  section: {
    backgroundColor: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: '0.75rem',
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  sectionTitle: {
    fontSize: '1rem',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-display)',
    textAlign: 'left',
  },
  inboxList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  inboxCard: {
    backgroundColor: 'var(--bg-dark)',
    border: '1px solid var(--border)',
    borderRadius: '0.5rem',
    padding: '0.75rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  inboxCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    fontSize: '0.65rem',
    padding: '0.15rem 0.4rem',
    borderRadius: '0.25rem',
    fontWeight: '700',
    fontFamily: 'var(--font-display)',
  },
  inboxContent: {
    fontSize: '0.85rem',
    color: 'var(--text-primary)',
    lineHeight: '1.4',
    textAlign: 'left',
  },
  parsedTasksList: {
    marginTop: '0.25rem',
    paddingTop: '0.5rem',
    borderTop: '1px solid var(--border)',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
    textAlign: 'left',
  },
  parsedTitle: {
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
    fontWeight: '600',
  },
  parsedTaskItem: {
    fontSize: '0.8rem',
    color: 'var(--text-primary)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
  },
  iconBtn: {
    padding: '0.2rem',
    borderRadius: '0.25rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.02)',
    border: '1px solid var(--border)',
  },
  addTaskForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  addTaskInput: {
    backgroundColor: 'var(--bg-dark)',
    border: '1px solid var(--border)',
    borderRadius: '0.5rem',
    padding: '0.6rem 0.75rem',
    fontSize: '0.9rem',
    width: '100%',
  },
  formRow: {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
  },
  select: {
    backgroundColor: 'var(--bg-dark)',
    border: '1px solid var(--border)',
    color: 'var(--text-secondary)',
    borderRadius: '0.5rem',
    padding: '0.5rem',
    fontSize: '0.85rem',
    outline: 'none',
  },
  inlineAddProjBtn: {
    backgroundColor: 'var(--bg-dark)',
    border: '1px solid var(--border)',
    color: 'var(--text-secondary)',
    borderRadius: '0.5rem',
    padding: '0 0.6rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  addTaskBtn: {
    backgroundColor: 'var(--accent-purple)',
    color: '#fff',
    borderRadius: '0.5rem',
    padding: '0.5rem 1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scheduleToggleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    width: '100%',
  },
  scheduleToggleBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    padding: '0.4rem 0.6rem',
    borderRadius: '0.35rem',
    fontSize: '0.75rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all var(--transition-fast)',
  },
  dateInput: {
    backgroundColor: 'var(--bg-dark)',
    border: '1px solid var(--border)',
    color: 'var(--text-secondary)',
    borderRadius: '0.35rem',
    padding: '0.35rem 0.5rem',
    fontSize: '0.75rem',
    fontFamily: 'var(--font-sans)',
    outline: 'none',
    flex: 1,
  },
  inlineSchedulerContainer: {
    backgroundColor: 'var(--bg-dark)',
    border: '1px solid var(--border)',
    borderRadius: '0.5rem',
    padding: '0.5rem',
    width: '100%',
  },
  addTaskSubmitBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.4rem',
    backgroundColor: 'var(--accent-purple)',
    color: '#fff',
    borderRadius: '0.5rem',
    padding: '0.6rem 1rem',
    fontSize: '0.85rem',
    fontWeight: '600',
    fontFamily: 'var(--font-display)',
    width: '100%',
    boxShadow: '0 4px 10px hsla(260, 85%, 65%, 0.2)',
    border: 'none',
    cursor: 'pointer',
  },
  taskList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  taskCard: {
    backgroundColor: 'var(--bg-dark)',
    border: '1px solid var(--border)',
    borderRadius: '0.5rem',
    padding: '0.6rem 0.75rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    width: '100%',
  },
  taskTitle: {
    fontSize: '0.85rem',
    color: 'var(--text-primary)',
    fontWeight: '500',
    textAlign: 'left',
  },
  taskMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginTop: '0.2rem',
    fontSize: '0.7rem',
  },
  projectDot: {
    display: 'inline-block',
    padding: '0.05rem 0.3rem',
    borderRadius: '0.2rem',
    fontSize: '0.65rem',
    color: 'rgba(255,255,255,0.9)',
  },
  scheduleWidgetTrigger: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    backgroundColor: 'var(--accent-red)',
    padding: '0.35rem 0.6rem',
    borderRadius: '0.35rem',
    border: 'none',
    fontSize: '0.75rem',
    color: '#fff',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 2px 5px rgba(238, 82, 83, 0.2)',
    transition: 'all var(--transition-fast)',
  },
  schedulerWidget: {
    backgroundColor: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: '0.5rem',
    padding: '0.75rem',
    marginTop: '0.4rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    width: '100%',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
  },
  schedulerWidgetTitle: {
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
    fontWeight: '600',
    textAlign: 'left',
  },
  schedulerRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: '0.5rem',
  },
  timeGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    backgroundColor: 'var(--bg-dark)',
    border: '1px solid var(--border)',
    borderRadius: '0.35rem',
    padding: '0.2rem 0.4rem',
  },
  timeSelect: {
    backgroundColor: 'transparent',
    border: 'none',
    color: 'var(--text-primary)',
    fontSize: '0.8rem',
    outline: 'none',
    cursor: 'pointer',
  },
  periodSelect: {
    backgroundColor: 'transparent',
    border: 'none',
    color: 'var(--text-primary)',
    fontSize: '0.75rem',
    outline: 'none',
    cursor: 'pointer',
  },
  schedulerActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '0.4rem',
  },
  schedCancelBtn: {
    fontSize: '0.7rem',
    color: 'var(--text-secondary)',
    padding: '0.2rem 0.5rem',
  },
  schedSaveBtn: {
    fontSize: '0.7rem',
    backgroundColor: 'var(--accent-red)',
    color: '#fff',
    borderRadius: '0.25rem',
    padding: '0.2rem 0.6rem',
    fontWeight: '600',
    boxShadow: '0 2px 4px rgba(238, 82, 83, 0.2)',
  },
  emptyText: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    textAlign: 'center',
    padding: '1rem 0',
  },
  timelineGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    overflowY: 'auto',
    flex: 1,
    paddingRight: '0.5rem',
  },
  hourRow: {
    display: 'flex',
    borderBottom: '1px dashed var(--border)',
    paddingBottom: '0.5rem',
    paddingTop: '0.25rem',
    minHeight: '3.5rem',
  },
  hourRowMeta: {
    width: '6.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  hourLabel: {
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
    fontFamily: 'var(--font-display)',
    fontWeight: '600',
    paddingTop: '0.25rem',
    textAlign: 'left',
  },
  calendarAddBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.2rem',
    backgroundColor: 'var(--accent-red)',
    color: '#fff',
    fontSize: '0.65rem',
    fontWeight: '700',
    fontFamily: 'var(--font-display)',
    padding: '0.2rem 0.4rem',
    borderRadius: '0.25rem',
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(238, 82, 83, 0.2)',
  },
  hourContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },
  scheduledTaskCard: {
    backgroundColor: 'var(--surface)',
    borderLeft: '4px solid',
    borderRadius: '0.35rem',
    padding: '0.5rem 0.75rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
  },
  scheduledTaskTitle: {
    fontSize: '0.85rem',
    color: 'var(--text-primary)',
    fontWeight: '600',
  },
  unschedBtn: {
    color: 'var(--text-muted)',
    padding: '0.15rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyHourPlaceholder: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    border: '1px dashed var(--border)',
    borderRadius: '0.35rem',
    padding: '0.4rem 0.75rem',
    color: 'var(--text-muted)',
    fontSize: '0.75rem',
    opacity: 0.5,
  },
  // Modal Style variables
  modalOverlay: {
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '1rem',
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    backdropFilter: 'blur(4px)',
  },
  modalContent: {
    position: 'relative',
    width: '100%',
    maxWidth: '28rem',
    backgroundColor: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: '1rem',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    boxShadow: '0 10px 25px rgba(0,0,0,0.4)',
    zIndex: 1001,
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid var(--border)',
    paddingBottom: '0.5rem',
  },
  modalTitle: {
    fontSize: '1.05rem',
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    color: '#fff',
  },
  closeBtn: {
    color: 'var(--text-secondary)',
    padding: '0.25rem',
    cursor: 'pointer',
  },
  modalBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  modalLabel: {
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
    fontWeight: '600',
    textAlign: 'left',
    marginBottom: '0.25rem',
  },
  modalInput: {
    backgroundColor: 'var(--bg-dark)',
    border: '1px solid var(--border)',
    borderRadius: '0.5rem',
    padding: '0.6rem 0.75rem',
    fontSize: '0.85rem',
    color: '#fff',
  },
  modalSelect: {
    backgroundColor: 'var(--bg-dark)',
    border: '1px solid var(--border)',
    color: 'var(--text-secondary)',
    borderRadius: '0.5rem',
    padding: '0.5rem',
    fontSize: '0.85rem',
    outline: 'none',
  },
  inlineAddProjBtnModal: {
    backgroundColor: 'var(--bg-dark)',
    border: '1px solid var(--border)',
    color: 'var(--text-secondary)',
    borderRadius: '0.5rem',
    padding: '0 0.6rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  modalFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '0.5rem',
    borderTop: '1px solid var(--border)',
    paddingTop: '0.75rem',
    marginTop: '0.5rem',
  },
  modalCancelBtn: {
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
    padding: '0.5rem 1rem',
  },
  modalSaveBtn: {
    fontSize: '0.8rem',
    backgroundColor: 'var(--accent-red)',
    color: '#fff',
    borderRadius: '0.5rem',
    padding: '0.5rem 1rem',
    fontWeight: '600',
    boxShadow: '0 2px 4px rgba(238, 82, 83, 0.2)',
    border: 'none',
    cursor: 'pointer',
  },
  tasksDoneBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    padding: '0.35rem 0.6rem',
    borderRadius: '0.35rem',
    border: '1px solid',
    fontSize: '0.75rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all var(--transition-fast)',
  },
  doneMiniBtn: {
    padding: '0.25rem 0.5rem',
    borderRadius: '0.25rem',
    fontSize: '0.65rem',
    fontWeight: '700',
    border: 'none',
    cursor: 'pointer',
    transition: 'all var(--transition-fast)',
    display: 'flex',
    alignItems: 'center',
  },
  dateSelectorContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    backgroundColor: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: '2rem',
    padding: '0.2rem 0.5rem',
  },
  dateNavBtn: {
    color: 'var(--text-secondary)',
    padding: '0.15rem 0.4rem',
    fontSize: '0.85rem',
    fontWeight: '600',
  },
  dateSelectTriggerBtn: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'var(--surface-hover)',
    border: '1px solid var(--border)',
    color: 'var(--accent-purple)',
    borderRadius: '1rem',
    padding: '0.2rem 0.6rem',
    fontSize: '0.8rem',
    fontWeight: '700',
    fontFamily: 'var(--font-display)',
    cursor: 'pointer',
  },
  todayBtn: {
    fontSize: '0.7rem',
    backgroundColor: 'var(--surface-hover)',
    color: 'var(--accent-purple)',
    padding: '0.15rem 0.4rem',
    borderRadius: '1rem',
    fontWeight: '600',
  },
  plusIcon: {
    transition: 'transform var(--transition-fast)',
  }
}
