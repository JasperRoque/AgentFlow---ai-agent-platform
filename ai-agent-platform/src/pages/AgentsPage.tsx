import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../stores/useAppStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
  Search,
  Filter,
  Star,
  ArrowRight,
  Zap,
  Crown,
  Users
} from 'lucide-react';

export function AgentsPage() {
  const { agents } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const advancedAgents = agents.filter(agent => agent.type === 'advanced');
  const basicAgents = agents.filter(agent => agent.type === 'basic');

  const filteredAgents = (agentList: typeof agents) => {
    return agentList.filter(agent => {
      const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           agent.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           agent.capabilities.some(cap => cap.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || agent.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  };

  const categories = Array.from(new Set(agents.map(agent => agent.category)));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Agents</h1>
          <p className="text-gray-600">Choose from our collection of specialized AI agents</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search agents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Agent Categories */}
      <Tabs defaultValue="advanced" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="advanced" className="flex items-center space-x-2">
            <Crown className="h-4 w-4" />
            <span>Advanced Agents ({advancedAgents.length})</span>
          </TabsTrigger>
          <TabsTrigger value="basic" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Basic Agents ({basicAgents.length})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="advanced" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAgents(advancedAgents).map(agent => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
          {filteredAgents(advancedAgents).length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No advanced agents found matching your criteria</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="basic" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAgents(basicAgents).map(agent => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
          {filteredAgents(basicAgents).length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No basic agents found matching your criteria</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function AgentCard({ agent }: { agent: any }) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-3xl">{agent.icon}</div>
            <div>
              <CardTitle className="text-lg">{agent.name}</CardTitle>
              <div className="flex items-center space-x-2 mt-1">
                <Badge 
                  variant={agent.type === 'advanced' ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {agent.type}
                </Badge>
                {agent.status === 'new' && (
                  <Badge variant="outline" className="text-xs text-green-600 border-green-300">
                    <Star className="h-3 w-3 mr-1" />
                    New
                  </Badge>
                )}
                {agent.pricing === 'premium' && (
                  <Badge variant="outline" className="text-xs text-purple-600 border-purple-300">
                    <Crown className="h-3 w-3 mr-1" />
                    Pro
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
        <CardDescription className="text-sm mt-2 line-clamp-2">
          {agent.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Capabilities */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Key Capabilities</h4>
          <div className="flex flex-wrap gap-1">
            {agent.capabilities.slice(0, 3).map((capability: string, index: number) => (
              <Badge key={index} variant="outline" className="text-xs">
                {capability}
              </Badge>
            ))}
            {agent.capabilities.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{agent.capabilities.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        {/* Popular Task Preview */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Popular Task</h4>
          <p className="text-xs text-gray-600 line-clamp-2">
            {agent.popularTasks[0]}
          </p>
        </div>

        {/* Action Button */}
        <Link to={`/agents/${agent.id}`} className="block">
          <Button className="w-full group-hover:bg-primary/90">
            Start Task
            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
