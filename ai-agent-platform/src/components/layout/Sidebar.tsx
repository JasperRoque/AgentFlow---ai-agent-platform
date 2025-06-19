import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import {
  Home,
  Bot,
  ListTodo,
  FolderOpen,
  User,
  Zap,
  ChevronRight
} from 'lucide-react';

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Agents', href: '/agents', icon: Bot },
  { name: 'Tasks', href: '/tasks', icon: ListTodo },
  { name: 'AI Drive', href: '/aidrive', icon: FolderOpen },
  { name: 'Super Agent', href: '/super-agent', icon: Zap },
  { name: 'Profile', href: '/me', icon: User },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 overflow-y-auto">
      <nav className="p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href || 
            (item.href !== '/' && location.pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <div className="flex items-center space-x-3">
                <item.icon className={cn(
                  'h-5 w-5',
                  isActive ? 'text-blue-600' : 'text-gray-400'
                )} />
                <span>{item.name}</span>
              </div>
              {isActive && (
                <ChevronRight className="h-4 w-4 text-blue-600" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Quick Stats */}
      <div className="p-4 mt-6 border-t border-gray-200">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Quick Stats
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Tasks Today</span>
            <span className="font-medium text-gray-900">3</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Files Stored</span>
            <span className="font-medium text-gray-900">28</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Storage Used</span>
            <span className="font-medium text-gray-900">156 MB</span>
          </div>
        </div>
      </div>

      {/* Upgrade Banner */}
      <div className="p-4 m-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white">
        <h3 className="font-semibold text-sm mb-1">Upgrade to Pro</h3>
        <p className="text-xs text-blue-100 mb-3">
          Unlock all agents and unlimited tasks
        </p>
        <button className="w-full bg-white text-blue-600 text-xs font-medium py-2 px-3 rounded-md hover:bg-blue-50 transition-colors">
          Upgrade Now
        </button>
      </div>
    </aside>
  );
}
