import React from 'react';
import { Search, ChevronRight, ChevronDown, User, ShoppingBag, CreditCard, Database, MessageSquare, Box, Cpu } from 'lucide-react';
import { Module, ModuleData } from '@/types/moduleTypes';
import DraggableModuleItem from './DraggableModuleItem';

interface SidebarProps {
  modules: Module[];
  expandedModules: Record<string, boolean>;
  onToggleModule: (moduleId: string) => void;
}

// 背景颜色映射
const backgroundColorMap: Record<string, string> = {
  'open-source': '#F0FFF4',
  'database': '#EFF6FF',
  'messaging': '#FEFCE8',
  'base-component': '#FFF7ED',
  'base-runtime': '#FAF5FF',
  'container-runtime': '#EEF2FF',
  'kubernetes': '#FFF1F2',
};

// 标题文字颜色映射（比背景色更深的色调）
const textColorMap: Record<string, string> = {
  'open-source': '#166534', // 深绿色
  'database': '#1e40af', // 深蓝色
  'messaging': '#854d0e', // 深黄色
  'base-component': '#9a3412', // 深橙色
  'base-runtime': '#6b21a8', // 深紫色
  'container-runtime': '#3730a3', // 深靛蓝色
  'kubernetes': '#9f1239', // 深玫瑰色
};

const iconMap: Record<string, React.ReactNode> = {
  'user': <User className="h-4 w-4" />,
  'shopping': <ShoppingBag className="h-4 w-4" />,
  'credit-card': <CreditCard className="h-4 w-4" />,
  'database': <Database className="h-4 w-4" />,
  'message': <MessageSquare className="h-4 w-4" />,
  'box': <Box className="h-4 w-4" />,
  'environment': <Cpu className="h-4 w-4" />,
  'cluster': <Cpu className="h-4 w-4" />,
  'code': <Box className="h-4 w-4" />,
  'cube': <Box className="h-4 w-4" />,
};

const Sidebar = ({ modules, expandedModules, onToggleModule }: SidebarProps) => {
  return (
    <div className="h-full bg-white border-r border-gray-200 flex flex-col overflow-hidden">
      <div className="p-2">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="搜索模板..."
            className="w-full pl-8 pr-2 py-2 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <div className="text-base">
          {modules.map((module) => (
            <div key={module.id} className="mb-2">
              <div
                className="flex items-center px-3 py-2.5 hover:bg-opacity-80 cursor-pointer rounded-md mx-2"
                onClick={() => onToggleModule(module.id)}
                style={{ 
                  backgroundColor: backgroundColorMap[module.id],
                  color: textColorMap[module.id]
                }}
              >
                {expandedModules[module.id] ? (
                  <ChevronDown className="h-4 w-4 mr-2" />
                ) : (
                  <ChevronRight className="h-4 w-4 mr-2" />
                )}
                <span className="font-semibold">{module.name}</span>
              </div>
              
              {expandedModules[module.id] && module.items.length > 0 && (
                <div className="pl-6 mt-1 mx-2">
                  {module.items.map((item) => (
                    <DraggableModuleItem
                      key={item.id}
                      item={item}
                      icon={iconMap[item.icon]}
                      groupId={module.id}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
