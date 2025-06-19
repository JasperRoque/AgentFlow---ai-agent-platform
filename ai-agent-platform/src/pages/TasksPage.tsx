import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../stores/useAppStore';
import { formatTaskDuration } from '../utils/taskSimulation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Progress } from '../components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import {
  Search,
  Filter,
  Clock,
  CheckCircle,
  PlayCircle,
  AlertCircle,
  Bot,
  FileText,
  Download,
  ExternalLink,
  Plus,
  Calendar,
  BarChart3
} from 'lucide-react';

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'running':
      return <PlayCircle className="h-4 w-4 text-blue-500" />;
    case 'completed':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'pending':
      return <Clock className="h-4 w-4 text-yellow-500" />;
    case 'failed':
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    default:
      return <Clock className="h-4 w-4 text-gray-500" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'running':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'completed':
      return 'bg-green-50 text-green-700 border-green-200';
    case 'pending':
      return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    case 'failed':
      return 'bg-red-50 text-red-700 border-red-200';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200';
  }
};

export function TasksPage() {
  const { tasks, agents, deleteTask } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || task.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const tasksByStatus = {
    all: filteredTasks,
    running: filteredTasks.filter(t => t.status === 'running'),
    completed: filteredTasks.filter(t => t.status === 'completed'),
    pending: filteredTasks.filter(t => t.status === 'pending'),
    failed: filteredTasks.filter(t => t.status === 'failed')
  };



  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-600">Manage and monitor your AI-powered tasks</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          
          <Link to="/agents">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Task
            </Button>
          </Link>
        </div>
      </div>

      {/* Task Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{tasks.length}</p>
                <p className="text-sm text-gray-600">Total Tasks</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <PlayCircle className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{tasksByStatus.running.length}</p>
                <p className="text-sm text-gray-600">Running</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{tasksByStatus.completed.length}</p>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{tasksByStatus.pending.length}</p>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Task Filters */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All ({tasksByStatus.all.length})</TabsTrigger>
          <TabsTrigger value="running">Running ({tasksByStatus.running.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({tasksByStatus.completed.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({tasksByStatus.pending.length})</TabsTrigger>
          <TabsTrigger value="failed">Failed ({tasksByStatus.failed.length})</TabsTrigger>
        </TabsList>

        {Object.entries(tasksByStatus).map(([status, statusTasks]) => (
          <TabsContent key={status} value={status} className="mt-6">
            <div className="space-y-4">
              {statusTasks.length > 0 ? (
                statusTasks.map(task => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    agent={agents.find(a => a.id === task.agentId)} 
                    onDelete={() => deleteTask(task.id)}
                  />
                ))
              ) : (
                <div className="text-center py-12">
                  <Bot className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">
                    No {status === 'all' ? '' : status} tasks found
                  </p>
                  {status === 'all' && (
                    <Link to="/agents">
                      <Button variant="outline" className="mt-4">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Your First Task
                      </Button>
                    </Link>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

function TaskCard({ task, agent, onDelete }: { task: any; agent: any; onDelete: () => void }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-lg">{task.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{task.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className={`${getStatusColor(task.status)} flex items-center space-x-1`}>
                  {getStatusIcon(task.status)}
                  <span className="capitalize">{task.status}</span>
                </Badge>
              </div>
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Bot className="h-4 w-4" />
                <span>{agent?.name || 'Unknown Agent'}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{new Date(task.createdAt).toLocaleDateString()}</span>
              </div>
              {task.completedAt && (
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{formatTaskDuration(task.createdAt, task.completedAt)}</span>
                </div>
              )}
            </div>

            {task.status === 'running' && task.progress !== undefined && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Progress</span>
                  <span>{Math.round(task.progress)}%</span>
                </div>
                <Progress value={task.progress} className="w-full" />
              </div>
            )}

            {task.output && (
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <h4 className="font-medium text-sm">Results</h4>
                {task.output.summary && (
                  <p className="text-sm text-gray-700">{task.output.summary}</p>
                )}
                
                {task.output.keyFindings && task.output.keyFindings.length > 0 && (
                  <div>
                    <h5 className="text-xs font-medium text-gray-600 mb-2">Key Findings</h5>
                    <ul className="space-y-1">
                      {task.output.keyFindings.slice(0, 2).map((finding: string, index: number) => (
                        <li key={index} className="text-xs text-gray-600 flex items-start">
                          <span className="mr-2">•</span>
                          <span>{finding}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {task.files && task.files.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-gray-400" />
                    <span className="text-xs text-gray-600">
                      {task.files.length} file{task.files.length > 1 ? 's' : ''} generated
                    </span>
                    <Button variant="outline" size="sm" className="h-6 px-2 text-xs">
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{task.title}</DialogTitle>
                  <DialogDescription>{task.description}</DialogDescription>
                </DialogHeader>
                <TaskDetailsDialog task={task} agent={agent} />
              </DialogContent>
            </Dialog>
          </div>
          
          {task.status === 'completed' && (
            <Button variant="ghost" size="sm" onClick={onDelete} className="text-red-600 hover:text-red-700">
              Delete
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function TaskDetailsDialog({ task, agent }: { task: any; agent: any }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="font-medium">Agent:</span>
          <p className="text-gray-600">{agent?.name}</p>
        </div>
        <div>
          <span className="font-medium">Status:</span>
          <p className="text-gray-600 capitalize">{task.status}</p>
        </div>
        <div>
          <span className="font-medium">Created:</span>
          <p className="text-gray-600">{new Date(task.createdAt).toLocaleString()}</p>
        </div>
        {task.completedAt && (
          <div>
            <span className="font-medium">Completed:</span>
            <p className="text-gray-600">{new Date(task.completedAt).toLocaleString()}</p>
          </div>
        )}
      </div>

      {task.output && (
        <div className="space-y-4">
          {task.output.summary && (
            <div>
              <h4 className="font-medium mb-2">Summary</h4>
              <p className="text-sm text-gray-700">{task.output.summary}</p>
            </div>
          )}

          {task.output.keyFindings && (
            <div>
              <h4 className="font-medium mb-2">Key Findings</h4>
              <ul className="space-y-1">
                {task.output.keyFindings.map((finding: string, index: number) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start">
                    <span className="mr-2">•</span>
                    <span>{finding}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {task.output.recommendations && (
            <div>
              <h4 className="font-medium mb-2">Recommendations</h4>
              <ul className="space-y-1">
                {task.output.recommendations.map((rec: string, index: number) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start">
                    <span className="mr-2">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {task.output.content && (
            <div>
              <h4 className="font-medium mb-2">Additional Details</h4>
              <div className="bg-gray-50 rounded-lg p-3">
                <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                  {JSON.stringify(task.output.content, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
