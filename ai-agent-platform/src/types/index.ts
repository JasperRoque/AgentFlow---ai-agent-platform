// Agent Types
export interface Agent {
  id: string;
  name: string;
  type: 'advanced' | 'basic';
  category: string;
  description: string;
  status: 'new' | 'task' | 'mixture-of-agents';
  icon: string;
  capabilities: string[];
  popularTasks: string[];
  pricing: 'free' | 'premium';
}

// Task Types
export interface Task {
  id: string;
  userId: string;
  agentId: string;
  title: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  input: Record<string, any>;
  output?: {
    summary?: string;
    keyFindings?: string[];
    recommendations?: string[];
    files?: string[];
    content?: any;
  };
  createdAt: string;
  completedAt?: string;
  files: string[];
  progress?: number;
}

// File Types
export interface FileItem {
  id: string;
  userId: string;
  taskId?: string;
  name: string;
  type: string;
  size: number;
  url: string;
  createdAt: string;
  tags: string[];
}

// User Types
export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
    defaultAgent: string;
  };
  subscription: 'free' | 'premium';
}

// User Stats Types
export interface UserStats {
  totalTasks: number;
  completedTasks: number;
  runningTasks: number;
  pendingTasks: number;
  totalFiles: number;
  storageUsed: string;
  favoriteAgent: string;
  lastActive: string;
  monthlyUsage: {
    tasks: number;
    agents: string[];
    storageAdded: string;
  };
}

// Super Agent Workflow Types
export interface SuperAgentWorkflow {
  id: string;
  userId: string;
  name: string;
  description: string;
  agents: Array<{
    agentId: string;
    step: number;
    task: string;
  }>;
  status: 'template' | 'running' | 'completed';
  estimatedDuration: string;
}

// Navigation Types
export interface NavItem {
  title: string;
  href: string;
  icon?: any;
  disabled?: boolean;
}

// Theme Types
export type Theme = 'light' | 'dark' | 'system';
