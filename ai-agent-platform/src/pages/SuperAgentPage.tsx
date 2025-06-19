import { useState } from 'react';
import { useAppStore } from '../stores/useAppStore';
import { generateTaskId, simulateTaskExecution } from '../utils/taskSimulation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Progress } from '../components/ui/progress';
import { Separator } from '../components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { toast } from 'sonner';
import {
  Zap,
  Plus,
  Play,
  Clock,
  CheckCircle,
  ArrowRight,
  Bot,
  Workflow,
  Settings,
  Star,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Edit,
  Trash2
} from 'lucide-react';
import { SuperAgentWorkflow, Task } from '../types';

const workflowTemplates = [
  {
    id: 'market-research',
    name: 'Complete Market Research',
    description: 'End-to-end market analysis with presentation',
    estimatedDuration: '45 minutes',
    agents: [
      { agentId: 'deep-research', step: 1, task: 'Research market trends and competitors', icon: '🔍' },
      { agentId: 'ai-sheets', step: 2, task: 'Organize data into analytical spreadsheet', icon: '📈' },
      { agentId: 'ai-slides', step: 3, task: 'Create presentation from analysis', icon: '📊' }
    ]
  },
  {
    id: 'content-creation',
    name: 'Content Creation Pipeline',
    description: 'Research, write, and visualize content',
    estimatedDuration: '30 minutes',
    agents: [
      { agentId: 'deep-research', step: 1, task: 'Research topic and gather information', icon: '🔍' },
      { agentId: 'ai-chat', step: 2, task: 'Write comprehensive content', icon: '💬' },
      { agentId: 'image-studio', step: 3, task: 'Generate supporting visuals', icon: '🎨' }
    ]
  },
  {
    id: 'business-intelligence',
    name: 'Business Intelligence Report',
    description: 'Data analysis with insights and recommendations',
    estimatedDuration: '60 minutes',
    agents: [
      { agentId: 'download-for-me', step: 1, task: 'Collect relevant business data', icon: '⬇️' },
      { agentId: 'ai-sheets', step: 2, task: 'Analyze and visualize data', icon: '📈' },
      { agentId: 'deep-research', step: 3, task: 'Generate insights and recommendations', icon: '🔍' },
      { agentId: 'ai-slides', step: 4, task: 'Create executive summary presentation', icon: '📊' }
    ]
  },
  {
    id: 'event-planning',
    name: 'Event Planning Assistant',
    description: 'Complete event organization workflow',
    estimatedDuration: '40 minutes',
    agents: [
      { agentId: 'deep-research', step: 1, task: 'Research venues and vendors', icon: '🔍' },
      { agentId: 'call-for-me', step: 2, task: 'Make reservation calls', icon: '📞' },
      { agentId: 'ai-sheets', step: 3, task: 'Create event planning spreadsheet', icon: '📈' },
      { agentId: 'ai-slides', step: 4, task: 'Design event presentation', icon: '📊' }
    ]
  }
];

export function SuperAgentPage() {
  const { agents, workflows, addWorkflow, updateWorkflow, addTask, user } = useAppStore();
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [customWorkflow, setCustomWorkflow] = useState<any>(null);
  const [workflowName, setWorkflowName] = useState('');
  const [workflowDescription, setWorkflowDescription] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionProgress, setExecutionProgress] = useState<{ [key: string]: number }>({});
  const [executingWorkflow, setExecutingWorkflow] = useState<SuperAgentWorkflow | null>(null);

  const handleTemplateSelect = (template: any) => {
    setSelectedTemplate(template);
    setWorkflowName(template.name);
    setWorkflowDescription(template.description);
  };

  const executeWorkflow = async (workflow: any) => {
    if (!user) return;

    setIsExecuting(true);
    setExecutingWorkflow(workflow);
    
    const workflowId = `workflow-${Date.now()}`;
    const newWorkflow: SuperAgentWorkflow = {
      id: workflowId,
      userId: user.id,
      name: workflow.name,
      description: workflow.description,
      agents: workflow.agents,
      status: 'running',
      estimatedDuration: workflow.estimatedDuration
    };

    addWorkflow(newWorkflow);
    toast.success(`Started ${workflow.name} workflow!`);

    try {
      // Execute each agent step sequentially
      for (let i = 0; i < workflow.agents.length; i++) {
        const agentStep = workflow.agents[i];
        const agent = agents.find(a => a.id === agentStep.agentId);
        
        if (!agent) continue;

        // Create task for this step
        const stepTask: Task = {
          id: generateTaskId(),
          userId: user.id,
          agentId: agent.id,
          title: `${workflow.name} - Step ${agentStep.step}`,
          description: agentStep.task,
          status: 'running',
          input: {
            workflowId,
            step: agentStep.step,
            task: agentStep.task
          },
          createdAt: new Date().toISOString(),
          files: [],
          progress: 0
        };

        addTask(stepTask);

        // Simulate execution for this step
        await simulateTaskExecution(
          stepTask,
          agent,
          (progress) => {
            setExecutionProgress(prev => ({
              ...prev,
              [agentStep.agentId]: progress
            }));
          }
        );

        // Mark step as completed
        setExecutionProgress(prev => ({
          ...prev,
          [agentStep.agentId]: 100
        }));
      }

      // Mark workflow as completed
      updateWorkflow(workflowId, { status: 'completed' });
      toast.success(`${workflow.name} workflow completed successfully!`);

    } catch (error) {
      toast.error('Workflow execution failed');
      updateWorkflow(workflowId, { status: 'completed' });
    } finally {
      setIsExecuting(false);
      setExecutingWorkflow(null);
      setExecutionProgress({});
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <Zap className="h-8 w-8 text-purple-600" />
          <h1 className="text-3xl font-bold text-gray-900">Super Agent</h1>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Coordinate multiple AI agents to work together on complex tasks. 
          Choose from pre-built workflows or create your own custom automation.
        </p>
      </div>

      {/* Execution Status */}
      {executingWorkflow && (
        <Card className="border-purple-200 bg-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-purple-600 animate-pulse" />
              <span>Executing: {executingWorkflow.name}</span>
            </CardTitle>
            <CardDescription>Multi-agent workflow in progress</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {executingWorkflow.agents.map((agentStep, index) => {
              const agent = agents.find(a => a.id === agentStep.agentId);
              const progress = executionProgress[agentStep.agentId] || 0;
              const isCompleted = progress === 100;
              const isActive = progress > 0 && progress < 100;
              
              return (
                <div key={agentStep.agentId} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-lg">{agent?.icon || '🤖'}</div>
                      <div>
                        <p className="font-medium text-sm">
                          Step {agentStep.step}: {agent?.name}
                        </p>
                        <p className="text-xs text-gray-600">{agentStep.task}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {isCompleted && <CheckCircle className="h-4 w-4 text-green-500" />}
                      {isActive && <Clock className="h-4 w-4 text-blue-500 animate-spin" />}
                      <span className="text-sm font-medium">{Math.round(progress)}%</span>
                    </div>
                  </div>
                  <Progress value={progress} className="w-full" />
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Workflow Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Workflow className="h-5 w-5" />
            <span>Workflow Templates</span>
          </CardTitle>
          <CardDescription>
            Pre-built workflows for common multi-agent tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {workflowTemplates.map((template) => (
              <WorkflowCard
                key={template.id}
                workflow={template}
                onSelect={() => handleTemplateSelect(template)}
                onExecute={() => executeWorkflow(template)}
                isSelected={selectedTemplate?.id === template.id}
                disabled={isExecuting}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Custom Workflow Builder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Custom Workflow Builder</span>
          </CardTitle>
          <CardDescription>
            Create your own multi-agent workflow
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Workflow Name
              </label>
              <Input
                placeholder="Enter workflow name"
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
                disabled={isExecuting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <Input
                placeholder="Brief description"
                value={workflowDescription}
                onChange={(e) => setWorkflowDescription(e.target.value)}
                disabled={isExecuting}
              />
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-4">
              Custom workflow builder coming soon! For now, you can customize existing templates.
            </p>
            <Button variant="outline" disabled>
              <Plus className="h-4 w-4 mr-2" />
              Add Agent Step
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Your Workflows */}
      <Card>
        <CardHeader>
          <CardTitle>Your Workflows</CardTitle>
          <CardDescription>
            Previously executed and saved workflows
          </CardDescription>
        </CardHeader>
        <CardContent>
          {workflows.length > 0 ? (
            <div className="space-y-4">
              {workflows.map((workflow) => (
                <div key={workflow.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{workflow.name}</h3>
                      <p className="text-sm text-gray-600">{workflow.description}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <Badge variant={workflow.status === 'completed' ? 'default' : 'secondary'}>
                          {workflow.status}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {workflow.agents.length} agents • {workflow.estimatedDuration}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => executeWorkflow(workflow)}
                        disabled={isExecuting}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Run Again
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Workflow className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No workflows created yet</p>
              <p className="text-sm text-gray-400 mt-2">
                Execute a template above to get started
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function WorkflowCard({ 
  workflow, 
  onSelect, 
  onExecute, 
  isSelected, 
  disabled 
}: { 
  workflow: any; 
  onSelect: () => void; 
  onExecute: () => void; 
  isSelected: boolean;
  disabled: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className={`cursor-pointer transition-all duration-200 ${
      isSelected ? 'ring-2 ring-purple-500 border-purple-200' : 'hover:shadow-md'
    }`}>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-lg">{workflow.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{workflow.description}</p>
              <div className="flex items-center space-x-4 mt-2">
                <Badge variant="outline" className="text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  {workflow.estimatedDuration}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  <Bot className="h-3 w-3 mr-1" />
                  {workflow.agents.length} agents
                </Badge>
              </div>
            </div>
            <Star className="h-5 w-5 text-yellow-500" />
          </div>

          <Separator />

          <div className="space-y-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center justify-between w-full text-left"
            >
              <span className="text-sm font-medium text-gray-700">Agent Flow</span>
              {isExpanded ? (
                <ChevronUp className="h-4 w-4 text-gray-400" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-400" />
              )}
            </button>

            {isExpanded && (
              <div className="space-y-3">
                {workflow.agents.map((agent: any, index: number) => (
                  <div key={agent.agentId} className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-6 h-6 bg-purple-100 text-purple-600 rounded-full text-xs font-medium">
                      {agent.step}
                    </div>
                    <div className="text-lg">{agent.icon}</div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{agent.task}</p>
                    </div>
                    {index < workflow.agents.length - 1 && (
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onSelect}
              disabled={disabled}
            >
              <Edit className="h-4 w-4 mr-2" />
              Customize
            </Button>
            <Button
              onClick={onExecute}
              disabled={disabled}
              className="flex-1"
            >
              {disabled ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Executing...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Execute Workflow
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
