import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../stores/useAppStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import {
  Bot,
  Plus,
  TrendingUp,
  Clock,
  CheckCircle,
  PlayCircle,
  ArrowRight,
  Sparkles,
  Zap
} from 'lucide-react';

export function HomePage() {
  const { agents, tasks, userStats, user } = useAppStore();
  const [greeting, setGreeting] = useState('');

  const recentTasks = tasks.slice(0, 4);
  const runningTasks = tasks.filter(task => task.status === 'running');
  const popularAgents = agents.filter(agent => 
    ['super-agent', 'deep-research', 'ai-slides', 'ai-chat'].includes(agent.id)
  ).slice(0, 4);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">
              {greeting}, {user?.username || 'there'}! 👋
            </h1>
            <p className="text-blue-100 text-lg max-w-2xl">
              Ready to supercharge your productivity? Choose from our powerful AI agents 
              to automate tasks, generate content, and get insights in minutes.
            </p>
            <div className="flex items-center space-x-4 pt-4">
              <Link to="/agents">
                <Button className="bg-white text-blue-600 hover:bg-blue-50">
                  <Bot className="h-4 w-4 mr-2" />
                  Browse Agents
                </Button>
              </Link>
              <Link to="/super-agent">
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                  <Zap className="h-4 w-4 mr-2" />
                  Try Super Agent
                </Button>
              </Link>
            </div>
          </div>
          <div className="hidden lg:block">
            <Sparkles className="h-32 w-32 text-blue-200 opacity-50" />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{userStats?.completedTasks || 0}</p>
                <p className="text-sm text-gray-600">Completed Tasks</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <PlayCircle className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{userStats?.runningTasks || 0}</p>
                <p className="text-sm text-gray-600">Running Tasks</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Bot className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{agents.length}</p>
                <p className="text-sm text-gray-600">Available Agents</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{userStats?.storageUsed || '0 MB'}</p>
                <p className="text-sm text-gray-600">Storage Used</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Tasks */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Tasks</CardTitle>
              <CardDescription>Your latest AI-powered activities</CardDescription>
            </div>
            <Link to="/tasks">
              <Button variant="outline" size="sm">
                View All
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentTasks.length > 0 ? (
              recentTasks.map(task => (
                <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium text-sm">{task.title}</p>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant={task.status === 'completed' ? 'default' : 
                                task.status === 'running' ? 'secondary' : 'outline'}
                        className="text-xs"
                      >
                        {task.status}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {agents.find(a => a.id === task.agentId)?.name}
                      </span>
                    </div>
                    {task.status === 'running' && task.progress !== undefined && (
                      <Progress value={task.progress} className="w-full h-1" />
                    )}
                  </div>
                  <Clock className="h-4 w-4 text-gray-400" />
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Bot className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No tasks yet</p>
                <Link to="/agents">
                  <Button variant="outline" className="mt-2">
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Task
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Popular Agents */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Popular Agents</CardTitle>
              <CardDescription>Most used AI agents on the platform</CardDescription>
            </div>
            <Link to="/agents">
              <Button variant="outline" size="sm">
                Browse All
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {popularAgents.map(agent => (
              <Link 
                key={agent.id}
                to={`/agents/${agent.id}`}
                className="block"
              >
                <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="text-2xl">{agent.icon}</div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{agent.name}</p>
                    <p className="text-xs text-gray-500 line-clamp-1">{agent.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={agent.type === 'advanced' ? 'default' : 'secondary'} className="text-xs">
                      {agent.type}
                    </Badge>
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Jump into common workflows</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/agents/deep-research">
              <Button variant="outline" className="w-full h-auto p-4 flex-col space-y-2">
                <div className="text-2xl">🔍</div>
                <div className="text-center">
                  <p className="font-medium">Start Research</p>
                  <p className="text-xs text-gray-500">Deep dive into any topic</p>
                </div>
              </Button>
            </Link>

            <Link to="/agents/ai-slides">
              <Button variant="outline" className="w-full h-auto p-4 flex-col space-y-2">
                <div className="text-2xl">📊</div>
                <div className="text-center">
                  <p className="font-medium">Create Presentation</p>
                  <p className="text-xs text-gray-500">AI-powered slides</p>
                </div>
              </Button>
            </Link>

            <Link to="/super-agent">
              <Button variant="outline" className="w-full h-auto p-4 flex-col space-y-2">
                <div className="text-2xl">🚀</div>
                <div className="text-center">
                  <p className="font-medium">Multi-Agent Task</p>
                  <p className="text-xs text-gray-500">Coordinate multiple agents</p>
                </div>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
