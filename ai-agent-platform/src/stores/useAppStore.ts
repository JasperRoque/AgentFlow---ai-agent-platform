import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Agent, Task, FileItem, User, UserStats, SuperAgentWorkflow } from '../types';

interface AppStore {
  // Data
  agents: Agent[];
  tasks: Task[];
  files: FileItem[];
  user: User | null;
  userStats: UserStats | null;
  workflows: SuperAgentWorkflow[];
  
  // UI State
  loading: boolean;
  currentTask: Task | null;
  selectedAgent: Agent | null;
  
  // Actions
  setAgents: (agents: Agent[]) => void;
  setTasks: (tasks: Task[]) => void;
  setFiles: (files: FileItem[]) => void;
  setUser: (user: User) => void;
  setUserStats: (stats: UserStats) => void;
  setWorkflows: (workflows: SuperAgentWorkflow[]) => void;
  setLoading: (loading: boolean) => void;
  setCurrentTask: (task: Task | null) => void;
  setSelectedAgent: (agent: Agent | null) => void;
  
  // Task actions
  addTask: (task: Task) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  
  // File actions
  addFile: (file: FileItem) => void;
  deleteFile: (fileId: string) => void;
  
  // Workflow actions
  addWorkflow: (workflow: SuperAgentWorkflow) => void;
  updateWorkflow: (workflowId: string, updates: Partial<SuperAgentWorkflow>) => void;
  
  // Data loading
  loadInitialData: () => Promise<void>;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // Initial state
      agents: [],
      tasks: [],
      files: [],
      user: null,
      userStats: null,
      workflows: [],
      loading: false,
      currentTask: null,
      selectedAgent: null,
      
      // Basic setters
      setAgents: (agents) => set({ agents }),
      setTasks: (tasks) => set({ tasks }),
      setFiles: (files) => set({ files }),
      setUser: (user) => set({ user }),
      setUserStats: (stats) => set({ userStats: stats }),
      setWorkflows: (workflows) => set({ workflows }),
      setLoading: (loading) => set({ loading }),
      setCurrentTask: (task) => set({ currentTask: task }),
      setSelectedAgent: (agent) => set({ selectedAgent: agent }),
      
      // Task actions
      addTask: (task) => {
        const { tasks } = get();
        set({ tasks: [task, ...tasks] });
      },
      
      updateTask: (taskId, updates) => {
        const { tasks } = get();
        const updatedTasks = tasks.map(task => 
          task.id === taskId ? { ...task, ...updates } : task
        );
        set({ tasks: updatedTasks });
      },
      
      deleteTask: (taskId) => {
        const { tasks } = get();
        const filteredTasks = tasks.filter(task => task.id !== taskId);
        set({ tasks: filteredTasks });
      },
      
      // File actions
      addFile: (file) => {
        const { files } = get();
        set({ files: [file, ...files] });
      },
      
      deleteFile: (fileId) => {
        const { files } = get();
        const filteredFiles = files.filter(file => file.id !== fileId);
        set({ files: filteredFiles });
      },
      
      // Workflow actions
      addWorkflow: (workflow) => {
        const { workflows } = get();
        set({ workflows: [workflow, ...workflows] });
      },
      
      updateWorkflow: (workflowId, updates) => {
        const { workflows } = get();
        const updatedWorkflows = workflows.map(workflow =>
          workflow.id === workflowId ? { ...workflow, ...updates } : workflow
        );
        set({ workflows: updatedWorkflows });
      },
      
      // Data loading
      loadInitialData: async () => {
        set({ loading: true });
        try {
          // Load agents data
          const agentsResponse = await fetch('/data/agents_data.json');
          const agentsData = await agentsResponse.json();
          const allAgents = [...agentsData.advancedAgents, ...agentsData.basicAgents];
          
          // Load mock data
          const mockResponse = await fetch('/data/mock_data.json');
          const mockData = await mockResponse.json();
          
          set({
            agents: allAgents,
            tasks: mockData.tasks || [],
            files: mockData.files || [],
            user: mockData.users?.[0] || null,
            userStats: mockData.userStats?.['user-1'] || null,
            workflows: mockData.superAgentWorkflows || [],
            loading: false
          });
        } catch (error) {
          console.error('Failed to load initial data:', error);
          set({ loading: false });
        }
      }
    }),
    {
      name: 'ai-agent-platform-store',
      partialize: (state) => ({
        tasks: state.tasks,
        files: state.files,
        user: state.user,
        workflows: state.workflows,
      }),
    }
  )
);
