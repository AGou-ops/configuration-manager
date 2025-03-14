import React from 'react';
import { ModuleData } from '@/types/moduleTypes';

interface DraggableModuleItemProps {
  item: ModuleData;
  icon: React.ReactNode;
  groupId: string;
}

const DraggableModuleItem = ({ item, icon, groupId }: DraggableModuleItemProps) => {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('moduleData', JSON.stringify({ ...item, groupId }));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleClick = () => {
    const targetSection = document.querySelector(`[data-section-id="${groupId}"]`);
    if (targetSection) {
      const rect = targetSection.getBoundingClientRect();
      const dropEvent = new DragEvent('drop', {
        clientX: rect.left + 100,
        clientY: rect.top + 100,
        bubbles: true,
      });
      
      // 设置模拟的dataTransfer
      Object.defineProperty(dropEvent, 'dataTransfer', {
        value: {
          getData: () => JSON.stringify({ ...item, groupId }),
        },
      });
      
      targetSection.dispatchEvent(dropEvent);
    }
  };

  return (
    <div 
      draggable
      onDragStart={handleDragStart}
      onClick={handleClick}
      className="flex items-center px-2 py-2 hover:bg-gray-100 rounded cursor-pointer"
    >
      <div className="mr-2 text-gray-600">{icon}</div>
      <span className="text-sm">{item.name} {item.version}</span>
    </div>
  );
};

export default DraggableModuleItem;
