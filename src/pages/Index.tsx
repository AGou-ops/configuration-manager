import React, { useState, useCallback, useEffect } from 'react';
import { 
  ReactFlow, 
  Controls, 
  Background, 
  useNodesState, 
  useEdgesState,
  addEdge,
  Node,
  Edge
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Box, Code, Cpu, Database, MessageSquare } from 'lucide-react';
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import DetailPanel from '@/components/DetailPanel';
import ModuleSection from '@/components/ModuleSection';
import { DraggableModuleNode } from '@/components/DraggableModuleNode';
import { ModuleData, Module } from '@/types/moduleTypes';
import { toast } from 'sonner';
import { setWithExpiry, getWithExpiry } from '@/utils/storage';

const nodeTypes = {
  moduleNode: DraggableModuleNode,
};

const initialModules: Module[] = [
  { id: 'open-source', name: '开源组件', icon: 'code', items: [
    { id: 'rabbitmq', name: 'RabbitMQ', icon: 'message', version: '3.9' },
    { id: 'kafka', name: 'Kafka', icon: 'message', version: '2.8' },
  ]},
  { id: 'database', name: '数据存储', icon: 'database', items: [
    { id: 'mysql', name: 'MySQL', icon: 'database', version: '8.0' },
    { id: 'postgres', name: 'Postgres', icon: 'database', version: '8.0' },
    { id: 'clickhouse', name: 'ClickHouse', icon: 'database', version: '8.0' },
    { id: 'elasticsearch', name: 'ElasticSearch', icon: 'database', version: '8.0' },
    { id: 'redis', name: 'Redis', icon: 'database', version: '6.2' },
    { id: 'mongodb', name: 'MongoDB', icon: 'database', version: '5.0' },
  ]},
  { id: 'messaging', name: '消息中间件', icon: 'message', items: [
    { id: 'rabbitmq-msg', name: 'RabbitMQ', icon: 'message', version: '3.9' },
    { id: 'kafka-msg', name: 'Kafka', icon: 'message', version: '2.8' },
  ]},
  { id: 'base-component', name: '基础组件', icon: 'box', items: [] },
  { id: 'base-runtime', name: '基础运行时', icon: 'environment', items: []},
  { id: 'container-runtime', name: '容器运行时', icon: 'environment', items: [
    { id: 'docker', name: 'Docker', icon: 'environment', version: '20.10' },
    { id: 'containerd', name: 'Containerd', icon: 'environment', version: '1.5' },
  ] },
];

// Define sections to display in the main area
const sections = [
  { id: 'open-source', title: '开源组件', icon: <Code className="h-5 w-5 text-green-500" />, backgroundColor: '#F0FFF4' },
  { id: 'database', title: '数据存储', icon: <Database className="h-5 w-5 text-blue-500" />, backgroundColor: '#EFF6FF' },
  { id: 'messaging', title: '消息中间件', icon: <MessageSquare className="h-5 w-5 text-yellow-500" />, backgroundColor: '#FEFCE8' },
  { id: 'base-component', title: '基础组件', icon: <Box className="h-5 w-5 text-orange-500" />, backgroundColor: '#FFF7ED' },
  { id: 'base-runtime', title: '基础运行时', icon: <Cpu className="h-5 w-5 text-purple-500" />, backgroundColor: '#FAF5FF' },
  { id: 'container-runtime', title: '容器运行时', icon: <Box className="h-5 w-5 text-indigo-500" />, backgroundColor: '#EEF2FF' },
];

const Index = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedModule, setSelectedModule] = useState<ModuleData | null>(null);
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>(
    initialModules.reduce((acc, module) => ({ ...acc, [module.id]: true }), {})
  );

  // Load nodes and edges from storage on initial render
  useEffect(() => {
    const savedNodes = getWithExpiry<Node[]>('flow-nodes');
    const savedEdges = getWithExpiry<Edge[]>('flow-edges');
    
    if (savedNodes && savedNodes.length > 0) {
      // Restore the onSelect callback for each node
      const nodesWithCallbacks = savedNodes.map(node => ({
        ...node,
        data: {
          ...node.data,
          onSelect: handleModuleSelect
        }
      }));
      setNodes(nodesWithCallbacks);
    } else {
      // If no nodes are saved in flow-nodes, try to recreate them from section storage
      // This ensures we have a consistent state between visual nodes and section data
      const newNodes: Node[] = [];
      
      sections.forEach(section => {
        const storageKey = `placed-modules-${section.id}`;
        const sectionModules = getWithExpiry<ModuleData[]>(storageKey);
        
        if (sectionModules && sectionModules.length > 0) {
          sectionModules.forEach((moduleData, index) => {
            // Create positions that are staggered to avoid overlap
            const position = { 
              x: 100 + (index % 3) * 150, 
              y: 100 + Math.floor(index / 3) * 100 
            };
            
            // Create a stable ID based on the module ID and section ID
            const nodeId = `${moduleData.id}-${section.id}-${index}`;
            
            const newNode = {
              id: nodeId,
              type: 'moduleNode',
              position,
              data: { 
                ...moduleData, 
                onSelect: handleModuleSelect,
                sectionId: section.id,
              },
            };
            
            newNodes.push(newNode);
          });
        }
      });
      
      // Set all nodes at once to avoid multiple state updates
      if (newNodes.length > 0) {
        setNodes(newNodes);
      }
    }
    
    if (savedEdges && savedEdges.length > 0) {
      setEdges(savedEdges);
    }
  }, []);

  // Save nodes and edges to storage whenever they change
  useEffect(() => {
    if (nodes.length > 0) {
      // Save with 7-day expiration
      setWithExpiry('flow-nodes', nodes);
    } else {
      localStorage.removeItem('flow-nodes');
    }
    
    if (edges.length > 0) {
      // Save with 7-day expiration
      setWithExpiry('flow-edges', edges);
    } else {
      localStorage.removeItem('flow-edges');
    }
  }, [nodes, edges]);

  const handleModuleDrop = useCallback((moduleId: string, sectionId: string, position: { x: number, y: number }) => {
    // Find the module data from initialModules
    let moduleData: ModuleData | null = null;
    
    for (const moduleCategory of initialModules) {
      const foundModule = moduleCategory.items.find(item => item.id === moduleId);
      if (foundModule) {
        moduleData = foundModule;
        break;
      }
    }
    
    if (!moduleData) return;
    
    // Create a stable ID that includes a timestamp to ensure uniqueness
    const timestamp = Date.now();
    const nodeId = `${moduleId}-${sectionId}-${timestamp}`;
    
    const newNode = {
      id: nodeId,
      type: 'moduleNode',
      position,
      data: { 
        ...moduleData, 
        onSelect: handleModuleSelect,
        sectionId,
      },
    };
    
    setNodes((nds) => [...nds, newNode]);
    
    toast.success(`成功添加 ${moduleData.name} 模块`, {
      duration: 2000,
    });
  }, [setNodes]);

  const handleModuleSelect = useCallback((module: ModuleData) => {
    setSelectedModule(module);
  }, []);

  const handleCloseDetailPanel = useCallback(() => {
    setSelectedModule(null);
  }, []);

  const onConnect = useCallback((params: any) => {
    setEdges((eds) => addEdge(params, eds));
  }, [setEdges]);

  const handleToggleModule = useCallback((moduleId: string) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  }, []);

  const onNodeClick = useCallback((_: React.MouseEvent, node: any) => {
    const nodeData = node.data;
    if (nodeData) {
      handleModuleSelect(nodeData);
    }
  }, [handleModuleSelect]);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <TopBar />
      <div className="flex-1 overflow-hidden">
        <div className="h-full">
          <PanelGroup direction="horizontal">
            <Panel defaultSize={15} minSize={15} maxSize={25}>
              <Sidebar 
                modules={initialModules} 
                expandedModules={expandedModules}
                onToggleModule={handleToggleModule}
              />
            </Panel>

            <PanelResizeHandle className="w-1 bg-gray-200 hover:bg-blue-500 transition-colors duration-150 cursor-col-resize" />
            
            <Panel defaultSize={60}>
              <div className="h-full overflow-y-auto">
                <div className="p-4">
                  <div className="flow-container space-y-6">
                    {sections.map((section) => (
                      <ModuleSection
                        key={section.id}
                        id={section.id}
                        title={section.title}
                        icon={section.icon}
                        backgroundColor={section.backgroundColor}
                        onDrop={handleModuleDrop}
                        onSelectModule={handleModuleSelect}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </Panel>

            <PanelResizeHandle className="w-1 bg-gray-200 hover:bg-blue-500 transition-colors duration-150 cursor-col-resize" />
            
            <Panel defaultSize={20} minSize={15}>
              {selectedModule ? (
                <DetailPanel 
                  selectedModule={selectedModule} 
                  onClose={handleCloseDetailPanel}
                />
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400 p-4 text-center">
                  <div>
                    <Box className="h-12 w-12 mx-auto mb-4 opacity-30" />
                    <p>选择一个模块查看详情</p>
                  </div>
                </div>
              )}
            </Panel>
          </PanelGroup>
        </div>
      </div>
    </div>
  );
};

export default Index;
