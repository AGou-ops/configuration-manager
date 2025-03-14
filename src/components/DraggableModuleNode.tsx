import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { User, ShoppingBag, CreditCard, Database, MessageSquare, Box, Cpu, X } from 'lucide-react';
import { ModuleData } from '@/types/moduleTypes';

interface DraggableModuleNodeProps {
  data: {
    id: string;
    name: string;
    icon: string;
    version: string;
    onSelect: (module: ModuleData) => void;
    sectionId: string;
  };
  selected?: boolean;
}

export const iconMap: Record<string, React.ReactNode> = {
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

export function DraggableModuleNode({ data, selected }: DraggableModuleNodeProps) {
  return (
    <div 
      className={`px-4 py-3 bg-white rounded-md border ${selected ? 'border-blue-500 shadow-md' : 'border-gray-200 shadow-sm'} w-60`}
      onClick={() => data.onSelect({ id: data.id, name: data.name, icon: data.icon, version: data.version })}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <span className={`mr-2 ${selected ? 'text-blue-500' : 'text-gray-600'}`}>
            {iconMap[data.icon]}
          </span>
          <span className="font-medium">{data.name}</span>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-2 text-xs text-gray-500">
        <span>版本: {data.version}</span>
      </div>
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-blue-500" />
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-blue-500" />
    </div>
  );
}
