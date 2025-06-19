import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '../stores/useAppStore';
import { generateTaskId, simulateTaskExecution } from '../utils/taskSimulation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Progress } from '../components/ui/progress';
import { Separator } from '../components/ui/separator';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Play,
  Star,
  Crown,
  CheckCircle,
  Clock,
  Lightbulb,
  Zap
} from 'lucide-react';
import { Task } from '../types';

export function AgentDetailPage() {
  const { agentId } = useParams();
  const navigate = useNavigate();
  const { agents, addTask, updateTask, user } = useAppStore();
  
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [executingTask, setExecutingTask] = useState<Task | null>(null);
  const [taskProgress, setTaskProgress] = useState(0);

  const agent = agents.find(a => a.id === agentId);

  useEffect(() => {
    if (!agent) {
      navigate('/agents');
    }
  }, [agent, navigate]);

  if (!agent) {
    return null;
  }

  const handlePopularTaskClick = (task: string) => {
    setTaskTitle(task);
    setTaskDescription(`Execute: ${task}`);
  };

  const handleCreateTask = async () => {
    if (!taskTitle.trim() || !user) {
      toast.error('Please provide a task title');
      return;
    }

    setIsCreating(true);
    
    const newTask: Task = {
      id: generateTaskId(),
      userId: user.id,
      agentId: agent.id,
      title: taskTitle,
      description: taskDescription || taskTitle,
      status: 'running',
      input: {
        query: taskTitle,
        description: taskDescription,
        agentType: agent.type
      },
      createdAt: new Date().toISOString(),
      files: [],
      progress: 0
    };

    // Add task to store
    addTask(newTask);
    setExecutingTask(newTask);
    
    toast.success('Task created! Executing now...');

    try {
      // Simulate task execution
      const completedTask = await simulateTaskExecution(
        newTask, 
        agent,
        (progress) => {
          setTaskProgress(progress);
          updateTask(newTask.id, { progress });
        }
      );

      // Update task with results
      updateTask(newTask.id, completedTask);
      
      toast.success('Task completed successfully!');
      
      // Reset form
      setTaskTitle('');
      setTaskDescription('');
      setExecutingTask(null);
      setTaskProgress(0);
      
      // Navigate to tasks page
      setTimeout(() => {
        navigate('/tasks');
      }, 2000);
      
    } catch (error) {
      toast.error('Task execution failed');
      updateTask(newTask.id, { status: 'failed' });
      setExecutingTask(null);
      setTaskProgress(0);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/agents')}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Agents</span>
        </Button>
      </div>

      {/* Agent Info */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">{agent.icon}</div>
              <div>
                <CardTitle className="text-2xl">{agent.name}</CardTitle>
                <CardDescription className="text-base mt-1">
                  {agent.description}
                </CardDescription>
                <div className="flex items-center space-x-2 mt-3">
                  <Badge 
                    variant={agent.type === 'advanced' ? 'default' : 'secondary'}
                  >
                    {agent.type}
                  </Badge>
                  {agent.status === 'new' && (
                    <Badge variant="outline" className="text-green-600 border-green-300">
                      <Star className="h-3 w-3 mr-1" />
                      New
                    </Badge>
                  )}
                  {agent.pricing === 'premium' && (
                    <Badge variant="outline" className="text-purple-600 border-purple-300">
                      <Crown className="h-3 w-3 mr-1" />
                      Premium
                    </Badge>
                  )}
                  <Badge variant="outline" className="capitalize">
                    {agent.category}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Capabilities */}
          <div>
            <h3 className="font-semibold text-lg mb-3 flex items-center">
              <Zap className="h-5 w-5 mr-2 text-blue-500" />
              Capabilities
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {agent.capabilities.map((capability, index) => (
                <div 
                  key={index}
                  className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg"
                >
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">{capability}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Popular Tasks */}
          <div>
            <h3 className="font-semibold text-lg mb-3 flex items-center">
              <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
              Popular Tasks
            </h3>
            <div className="space-y-2">
              {agent.popularTasks.slice(0, 4).map((task, index) => (
                <button
                  key={index}
                  onClick={() => handlePopularTaskClick(task)}
                  className="w-full text-left p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <p className="text-sm">{task}</p>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Task Creation */}
      <Card>
        <CardHeader>
          <CardTitle>Create New Task</CardTitle>
          <CardDescription>
            Describe what you want this agent to accomplish
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Task Title *
            </label>
            <Input
              placeholder="Enter a clear, descriptive title for your task"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              disabled={isCreating}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Detailed Description (Optional)
            </label>
            <Textarea
              placeholder="Provide additional context, requirements, or specific instructions..."
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              disabled={isCreating}
              rows={4}
            />
          </div>

          {/* Execution Progress */}
          {executingTask && (
            <div className="space-y-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-blue-600 animate-spin" />
                <span className="font-medium text-blue-900">
                  Executing Task: {executingTask.title}
                </span>
              </div>
              <Progress value={taskProgress} className="w-full" />
              <p className="text-sm text-blue-700">
                {taskProgress < 25 ? 'Initializing agent...' :
                 taskProgress < 50 ? 'Processing your request...' :
                 taskProgress < 75 ? 'Generating results...' :
                 taskProgress < 100 ? 'Finalizing output...' :
                 'Task completed!'}
              </p>
            </div>
          )}

          <Button 
            onClick={handleCreateTask}
            disabled={!taskTitle.trim() || isCreating}
            className="w-full"
            size="lg"
          >
            {isCreating ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Executing Task...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Start Task
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
