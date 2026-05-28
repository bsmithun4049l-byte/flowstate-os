import { create } from 'zustand'

export interface Task {
  id: string
  title: string
  completed: boolean
  dueDate: string // YYYY-MM-DD
  timeSlot?: string // e.g. "09:00 - 10:00"
  projectId?: string
  priority: 'low' | 'medium' | 'high'
}

export interface Project {
  id: string
  name: string
  description: string
  color: string // HSL string
  tasksCount: number
}

export interface InboxItem {
  id: string
  type: 'voice' | 'link' | 'text'
  content: string
  createdAt: string
  parsedTasks?: string[]
  linkMetadata?: {
    title?: string
    thumbnail?: string
    domain?: string
  }
}

interface AppState {
  user: {
    name: string
  }
  activeTab: 'canvas' | 'garden' | 'studio' | 'mindset'
  isCaptureOpen: boolean
  tasks: Task[]
  projects: Project[]
  inbox: InboxItem[]
  goals: string[]
  dos: string[]
  donts: string[]
  
  setActiveTab: (tab: 'canvas' | 'garden' | 'studio' | 'mindset') => void
  setCaptureOpen: (open: boolean) => void
  addTask: (task: Omit<Task, 'id'>) => void
  toggleTask: (id: string) => void
  deleteTask: (id: string) => void
  addProject: (project: Omit<Project, 'tasksCount'>) => void
  addInboxItem: (item: Omit<InboxItem, 'id' | 'createdAt'>) => void
  deleteInboxItem: (id: string) => void
  processInboxToTasks: (id: string) => void
  addGoal: (text: string) => void
  deleteGoal: (index: number) => void
  addDo: (text: string) => void
  deleteDo: (index: number) => void
  addDont: (text: string) => void
  deleteDont: (index: number) => void
}

export const useAppStore = create<AppState>((set, get) => ({
  user: {
    name: 'Mithun'
  },
  activeTab: 'canvas',
  isCaptureOpen: false,
  goals: [
    'Focus on deep work blocks for coding the core engine',
    'Record at least 3 high-quality voice captures for ideas'
  ],
  dos: [
    'Start the day with the 12:00 AM timeline blocking',
    'Mark tasks done explicitly as soon as they are completed',
    'Keep distractions turned off during flow state blocks'
  ],
  donts: [
    'Do not check social media during work hours',
    'Do not schedule overlapping tasks without buffer blocks',
    'Do not forget to convert voice transcripts into project tasks'
  ],
  tasks: [
    {
      id: 'task-1',
      title: 'Review Wireframes for Client Redesign',
      completed: false,
      dueDate: new Date().toISOString().split('T')[0],
      timeSlot: '10:00 AM - 11:30 AM',
      priority: 'high',
      projectId: 'proj-1'
    },
    {
      id: 'task-2',
      title: 'Draft scripting layout for next React tutorial',
      completed: false,
      dueDate: new Date().toISOString().split('T')[0],
      timeSlot: '02:00 PM - 03:00 PM',
      priority: 'medium',
      projectId: 'proj-2'
    },
    {
      id: 'task-3',
      title: 'Check invoice status for project delivery',
      completed: true,
      dueDate: new Date().toISOString().split('T')[0],
      priority: 'low'
    }
  ],
  projects: [
    {
      id: 'proj-1',
      name: 'Client Redesign',
      description: 'UX and interface overhaul for Sarah\'s e-commerce shop.',
      color: 'hsl(260, 85%, 65%)', // Electric Indigo
      tasksCount: 1
    },
    {
      id: 'proj-2',
      name: 'YouTube Content',
      description: 'Weekly educational coding tutorials and reels.',
      color: 'hsl(35, 90%, 60%)', // Amber
      tasksCount: 1
    }
  ],
  inbox: [
    {
      id: 'inbox-1',
      type: 'link',
      content: 'https://instagram.com/p/C_abc123/reel',
      createdAt: new Date().toISOString(),
      linkMetadata: {
        title: 'Cinematic B-Roll Lighting setups for home studios',
        domain: 'instagram.com',
        thumbnail: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=400&h=300&q=80'
      }
    },
    {
      id: 'inbox-2',
      type: 'voice',
      content: 'Need to follow up with the branding agency next Monday about font licenses and final logo package.',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      parsedTasks: ['Follow up with branding agency about font licenses', 'Request final logo package']
    }
  ],

  setActiveTab: (tab) => set({ activeTab: tab }),
  setCaptureOpen: (open) => set({ isCaptureOpen: open }),
  
  addGoal: (text) => set((state) => ({ goals: [...state.goals, text] })),
  deleteGoal: (index) => set((state) => ({ goals: state.goals.filter((_, i) => i !== index) })),
  addDo: (text) => set((state) => ({ dos: [...state.dos, text] })),
  deleteDo: (index) => set((state) => ({ dos: state.dos.filter((_, i) => i !== index) })),
  addDont: (text) => set((state) => ({ donts: [...state.donts, text] })),
  deleteDont: (index) => set((state) => ({ donts: state.donts.filter((_, i) => i !== index) })),
  
  addTask: (taskData) => set((state) => ({
    tasks: [...state.tasks, { ...taskData, id: `task-${Date.now()}` }]
  })),

  toggleTask: (id) => set((state) => ({
    tasks: state.tasks.map((task) => 
      task.id === id ? { ...task, completed: !task.completed } : task
    )
  })),

  deleteTask: (id) => set((state) => ({
    tasks: state.tasks.filter((task) => task.id !== id)
  })),

  addProject: (projData) => set((state) => ({
    projects: [...state.projects, { ...projData, id: projData.id || `proj-${Date.now()}`, tasksCount: 0 }]
  })),

  addInboxItem: (itemData) => set((state) => ({
    inbox: [{ ...itemData, id: `inbox-${Date.now()}`, createdAt: new Date().toISOString() }, ...state.inbox]
  })),

  deleteInboxItem: (id) => set((state) => ({
    inbox: state.inbox.filter((item) => item.id !== id)
  })),

  processInboxToTasks: (id) => {
    const item = get().inbox.find((item) => item.id === id)
    if (!item) return

    if (item.parsedTasks && item.parsedTasks.length > 0) {
      item.parsedTasks.forEach((taskTitle) => {
        get().addTask({
          title: taskTitle,
          completed: false,
          dueDate: new Date().toISOString().split('T')[0],
          priority: 'medium'
        })
      })
    } else {
      get().addTask({
        title: item.content,
        completed: false,
        dueDate: new Date().toISOString().split('T')[0],
        priority: 'medium'
      })
    }

    get().deleteInboxItem(id)
  }
}))
