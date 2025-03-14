import React, { useState, useEffect } from 'react';
import { Plus, X, Tag } from 'lucide-react';
import { ModuleData } from '@/types/moduleTypes';
import { toast } from 'sonner';
import { iconMap } from '@/components/DraggableModuleNode';
import { setWithExpiry, getWithExpiry } from '@/utils/storage';

interface ModuleSectionProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  backgroundColor: string;
  onDrop: (moduleId: string, moduleType: string, position: { x: number; y: number }) => void;
  onSelectModule: (module: ModuleData, moduleId: string) => void;
  selectedModuleId: string | null;
  onModuleRemove?: (moduleId: string) => void;
}

interface PlacedModuleProps {
  module: ModuleData;
  onRemove: () => void;
  onSelect: () => void;
  isSelected: boolean;
  backgroundColor: string;
  className?: string;
}

const PlacedModule = ({ module, onRemove, onSelect, isSelected, backgroundColor, className }: PlacedModuleProps) => {
  return (
    <div 
      className={`px-4 py-3 rounded-md border bg-white ${isSelected ? 'border-blue-500 shadow-md' : 'border-gray-200 shadow-sm'} w-[200px] ${className || ''}`}
      onClick={onSelect}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <span className="mr-2 text-gray-600">
            {iconMap[module.icon]}
          </span>
          <span className="font-medium">{module.name}</span>
        </div>
        <button 
          className="text-gray-400 hover:text-gray-600"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-2 text-xs text-gray-500 flex items-center">
        <Tag className="h-3 w-3 mr-1" />
        <span>版本: {module.version}</span>
      </div>
    </div>
  );
};

const ModuleSection: React.FC<ModuleSectionProps> = ({
  id,
  title,
  icon,
  backgroundColor,
  onDrop,
  onSelectModule,
  selectedModuleId,
  onModuleRemove,
}) => {
  const [placedModules, setPlacedModules] = useState<ModuleData[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  // Storage key for this section's modules
  const storageKey = `placed-modules-${id}`;
  
  // Load saved modules from storage on initial render
  useEffect(() => {
    const savedModules = getWithExpiry<ModuleData[]>(storageKey);
    if (savedModules && savedModules.length > 0) {
      setPlacedModules(savedModules);
      
      // Recreate nodes for saved modules
      savedModules.forEach(moduleData => {
        // Use a default position if not available
        const position = { x: 100, y: 100 };
        onDrop(moduleData.id, id, position);
      });
    }
    // 初始加载完成后设置标记
    setIsInitialLoad(false);
  }, [id, onDrop]);
  
  // Save modules to storage whenever they change
  useEffect(() => {
    if (placedModules.length > 0) {
      // Save with 7-day expiration
      setWithExpiry(storageKey, placedModules, 604800); // 604800 seconds = 7 days
    } else {
      // If no modules, remove the storage item
      localStorage.removeItem(storageKey);
    }
  }, [placedModules, storageKey]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    try {
      const moduleData = JSON.parse(e.dataTransfer.getData('moduleData'));
      
      // 检查分组是否匹配
      if (moduleData.groupId !== id) {
        toast.error(`${moduleData.name} 组件不能添加到 ${title} 分组中`, {
          duration: 2000,
        });
        return;
      }
      
      // 检查是否已存在相同id的模块
      if (placedModules.some(module => module.id === moduleData.id)) {
        toast.error(`${moduleData.name} 组件已存在，不允许重复添加`, {
          duration: 2000,
        });
        return;
      }
      
      // Get position relative to the section
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      onDrop(moduleData.id, id, { x, y });
      
      // Add module to this section
      setPlacedModules(prev => [...prev, moduleData]);
      
      // 只在非初始加载时显示提示
      if (!isInitialLoad) {
        toast.success(`成功添加 ${moduleData.name} 模块`, {
          duration: 2000,
        });
      }
    } catch (error) {
      console.error("Failed to parse dragged module data:", error);
    }
  };

  const handleRemoveModule = (moduleId: string) => {
    setPlacedModules(prev => prev.filter(m => m.id !== moduleId));
    
    // If the removed module is the currently selected one, notify the parent
    if (selectedModuleId === moduleId && onModuleRemove) {
      onModuleRemove(moduleId);
    }
  };

  const handleSelectModule = (moduleId: string, module: ModuleData) => {
    onSelectModule(module, moduleId); // Pass the selected module to parent component
  };

  return (
    <div 
      className="flex flex-col mb-6"
    >
      <div 
        className="flex items-center p-3 rounded-t-lg"
        style={{ backgroundColor }}
      >
        <span className="mr-2">{icon}</span>
        <span className="font-medium">{title}</span>
      </div>
      
      <div 
        className="flex-1 border border-dashed border-gray-300 rounded-b-lg px-2 pt-4 pb-8 min-h-[150px] max-h-[400px] overflow-y-auto"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        data-section-id={id}
        style={{ backgroundColor }}
      >
        {placedModules.length > 0 ? (
          <div className="flex flex-wrap gap-x-20 gap-y-4 justify-start pl-16">
          {placedModules.map((module) => (
            <PlacedModule 
              key={module.id}
              module={module}
              onRemove={() => handleRemoveModule(module.id)}
              onSelect={() => handleSelectModule(module.id, module)}
              isSelected={selectedModuleId === module.id}
              backgroundColor={backgroundColor}
              className="mb-1"
            />
          ))}
        </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <Plus className="h-8 w-8 text-gray-400 mb-2" />
            <p className="text-gray-500 text-center">拖拽{title}组件到此处</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModuleSection;
