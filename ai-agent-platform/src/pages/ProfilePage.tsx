import { useState } from 'react';
import { useAppStore } from '../stores/useAppStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Progress } from '../components/ui/progress';
import { Switch } from '../components/ui/switch';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import {
  User,
  Settings,
  Crown,
  BarChart3,
  TrendingUp,
  Calendar,
  Clock,
  Bot,
  FileText,
  Star,
  Award,
  Zap,
  Mail,
  Bell,
  Shield,
  Palette
} from 'lucide-react';

// Mock data for charts
const tasksByDay = [
  { day: 'Mon', tasks: 4 },
  { day: 'Tue', tasks: 3 },
  { day: 'Wed', tasks: 6 },
  { day: 'Thu', tasks: 8 },
  { day: 'Fri', tasks: 5 },
  { day: 'Sat', tasks: 2 },
  { day: 'Sun', tasks: 1 }
];

const agentUsage = [
  { name: 'Deep Research', value: 35, color: '#3B82F6' },
  { name: 'AI Slides', value: 25, color: '#8B5CF6' },
  { name: 'AI Sheets', value: 20, color: '#10B981' },
  { name: 'AI Chat', value: 15, color: '#F59E0B' },
  { name: 'Others', value: 5, color: '#6B7280' }
];

const monthlyProgress = [
  { month: 'Jan', tasks: 12, storage: 45 },
  { month: 'Feb', tasks: 19, storage: 67 },
  { month: 'Mar', tasks: 15, storage: 89 },
  { month: 'Apr', tasks: 28, storage: 112 },
  { month: 'May', tasks: 34, storage: 145 },
  { month: 'Jun', tasks: 42, storage: 156 }
];

export function ProfilePage() {
  const { user, userStats, tasks, agents } = useAppStore();
  const [activeTab, setActiveTab] = useState('overview');

  if (!user || !userStats) {
    return (
      <div className="text-center py-12">
        <User className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">No user data available</p>
      </div>
    );
  }

  const completionRate = Math.round((userStats.completedTasks / userStats.totalTasks) * 100);
  const favoriteAgent = agents.find(a => a.id === userStats.favoriteAgent);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="flex items-center space-x-6">
          <Avatar className="h-20 w-20">
            <AvatarImage src={`https://api.dicebear.com/7.x/avatars/svg?seed=${user.email}`} />
            <AvatarFallback className="text-2xl">
              <User className="h-8 w-8" />
            </AvatarFallback>
          </Avatar>
          
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{user.username}</h1>
            <p className="text-gray-600">{user.email}</p>
            <div className="flex items-center space-x-3 mt-2">
              <Badge 
                variant={user.subscription === 'premium' ? 'default' : 'secondary'}
                className="flex items-center space-x-1"
              >
                {user.subscription === 'premium' && <Crown className="h-3 w-3" />}
                <span className="capitalize">{user.subscription} Plan</span>
              </Badge>
              <Badge variant="outline">
                <Calendar className="h-3 w-3 mr-1" />
                Joined {new Date(user.createdAt).toLocaleDateString()}
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          {user.subscription === 'free' && (
            <Button>
              <Crown className="h-4 w-4 mr-2" />
              Upgrade to Pro
            </Button>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{userStats.totalTasks}</p>
                <p className="text-sm text-gray-600">Total Tasks</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{completionRate}%</p>
                <p className="text-sm text-gray-600">Success Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{userStats.totalFiles}</p>
                <p className="text-sm text-gray-600">Files Created</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{userStats.storageUsed}</p>
                <p className="text-sm text-gray-600">Storage Used</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Activity Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your task completion progress this week</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={tasksByDay}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="tasks" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Agent Usage */}
            <Card>
              <CardHeader>
                <CardTitle>Agent Usage</CardTitle>
                <CardDescription>Distribution of your favorite AI agents</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={agentUsage}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {agentUsage.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Current Status */}
            <Card>
              <CardHeader>
                <CardTitle>Current Status</CardTitle>
                <CardDescription>Your account overview</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Favorite Agent</span>
                  <div className="flex items-center space-x-2">
                    {favoriteAgent && (
                      <>
                        <span className="text-lg">{favoriteAgent.icon}</span>
                        <span className="font-medium">{favoriteAgent.name}</span>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Running Tasks</span>
                  <Badge variant="secondary">{userStats.runningTasks}</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">This Month</span>
                  <span className="font-medium">{userStats.monthlyUsage.tasks} tasks</span>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Storage Usage</span>
                    <span className="text-sm font-medium">{userStats.storageUsed} / 1 GB</span>
                  </div>
                  <Progress value={65} className="w-full" />
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks you might want to perform</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Bot className="h-4 w-4 mr-2" />
                  Start New Research Task
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Create Presentation
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Zap className="h-4 w-4 mr-2" />
                  Run Super Agent Workflow
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <div className="space-y-6">
            {/* Monthly Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Progress</CardTitle>
                <CardDescription>Track your task completion and storage usage over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyProgress}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="tasks" stroke="#3B82F6" strokeWidth={2} />
                    <Line type="monotone" dataKey="storage" stroke="#8B5CF6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Detailed Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Agent Performance</CardTitle>
                  <CardDescription>Success rates by agent type</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {userStats.monthlyUsage.agents.slice(0, 4).map((agentId, index) => {
                    const agent = agents.find(a => a.id === agentId);
                    const successRate = 85 + Math.random() * 15; // Mock success rate
                    return (
                      <div key={agentId} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            {agent?.name || 'Unknown Agent'}
                          </span>
                          <span className="text-sm text-gray-600">
                            {Math.round(successRate)}% success
                          </span>
                        </div>
                        <Progress value={successRate} className="w-full" />
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Usage Insights</CardTitle>
                  <CardDescription>Key metrics about your platform usage</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-600">Average tasks per day</span>
                    <span className="font-medium">4.2</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-600">Most productive day</span>
                    <span className="font-medium">Thursday</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-600">Average completion time</span>
                    <span className="font-medium">3.5 minutes</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-600">Files per task</span>
                    <span className="font-medium">1.8</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Achievements & Badges</CardTitle>
                <CardDescription>Unlock achievements as you use the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <AchievementBadge
                    icon="🏆"
                    title="First Task"
                    description="Complete your first AI task"
                    earned={true}
                  />
                  <AchievementBadge
                    icon="🔥"
                    title="On Fire"
                    description="Complete 10 tasks in a day"
                    earned={true}
                  />
                  <AchievementBadge
                    icon="🚀"
                    title="Super User"
                    description="Use Super Agent workflow"
                    earned={true}
                  />
                  <AchievementBadge
                    icon="📊"
                    title="Data Master"
                    description="Create 5 spreadsheets"
                    earned={false}
                  />
                  <AchievementBadge
                    icon="🎨"
                    title="Creative Genius"
                    description="Generate 100 images"
                    earned={false}
                  />
                  <AchievementBadge
                    icon="💎"
                    title="Premium Explorer"
                    description="Try all premium agents"
                    earned={false}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <div className="space-y-6">
            {/* Account Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-gray-600">Receive updates about your tasks</p>
                  </div>
                  <Switch defaultChecked={user.preferences.notifications} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium">Task Completion Alerts</p>
                    <p className="text-sm text-gray-600">Get notified when tasks finish</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium">Marketing Emails</p>
                    <p className="text-sm text-gray-600">Receive product updates and tips</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            {/* Privacy Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Privacy & Security</CardTitle>
                <CardDescription>Control your privacy and data settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="h-4 w-4 mr-2" />
                  Change Password
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Download My Data
                </Button>
                <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                  <User className="h-4 w-4 mr-2" />
                  Delete Account
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function AchievementBadge({ icon, title, description, earned }: {
  icon: string;
  title: string;
  description: string;
  earned: boolean;
}) {
  return (
    <Card className={`${earned ? 'border-yellow-200 bg-yellow-50' : 'border-gray-200 opacity-60'}`}>
      <CardContent className="p-4 text-center">
        <div className="text-3xl mb-2">{icon}</div>
        <h3 className="font-medium text-sm">{title}</h3>
        <p className="text-xs text-gray-600 mt-1">{description}</p>
        {earned && (
          <Badge variant="secondary" className="mt-2 text-xs">
            <Award className="h-3 w-3 mr-1" />
            Earned
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}
