import React from 'react';
import { X, Plus, Settings2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ModuleData } from '@/types/moduleTypes';
import { Checkbox } from '@/components/ui/checkbox';

interface DetailPanelProps {
  selectedModule: ModuleData | null;
  onClose?: () => void;
}

const DetailPanel = ({ selectedModule, onClose }: DetailPanelProps) => {
  if (!selectedModule) {
    return (
      <div className="h-full bg-white border-l border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-medium">配置属性</h3>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <div className="mb-3">
              <Settings2 className="h-8 w-8 text-gray-400 mx-auto" />
            </div>
            <p className="text-sm text-gray-500">
              选择组件查看配置项
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-white border-l border-gray-200 overflow-y-auto flex flex-col">
      <div className="p-4 flex-1">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">配置属性</h3>
          <button 
            className="text-gray-400 hover:text-gray-600"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">基本信息</h4>
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="text-sm text-gray-600 w-24 flex-shrink-0">容器名称</div>
                <Input className="flex-1 h-8 text-sm" value={selectedModule.name} readOnly />
              </div>
              <div className="flex items-center">
                <div className="text-sm text-gray-600 w-24 flex-shrink-0">版本号</div>
                <Input className="flex-1 h-8 text-sm" value={selectedModule.version} readOnly />
              </div>
              <div className="flex items-center">
                <div className="text-sm text-gray-600 w-24 flex-shrink-0">配置数量</div>
                <Input className="flex-1 h-8 text-sm" value="1" />
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">构建配置</h4>
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="text-sm text-gray-600 w-24 flex-shrink-0">镜像名称</div>
                <Input className="flex-1 h-8 text-sm" value={`${selectedModule.name}:${selectedModule.version}`} />
              </div>
              <div className="flex items-center">
                <div className="text-sm text-gray-600 w-24 flex-shrink-0">包地址</div>
                <Input className="flex-1 h-8 text-sm" value="" placeholder="输入包地址" />
              </div>
              <div className="flex items-center">
                <div className="text-sm text-gray-600 w-24 flex-shrink-0">Dockerfile</div>
                <Input className="flex-1 h-8 text-sm" value="file://docker/Dockerfile" placeholder="Dockerfile 路径" />
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">部署配置</h4>
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="text-sm text-gray-600 w-24 flex-shrink-0">服务地址</div>
                <Input className="flex-1 h-8 text-sm" value={`aliphe-registry:5000/${selectedModule.name}:${selectedModule.version}`} />
              </div>
              <div className="flex items-center">
                <div className="text-sm text-gray-600 w-24 flex-shrink-0">服务端口</div>
                <div className="flex-1 flex gap-1">
                  <Input className="flex-1 h-8 text-sm" value="6379" />
                  <Button size="sm" variant="ghost" className="h-8 px-2">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center">
                <div className="text-sm text-gray-600 w-24 flex-shrink-0">日志路径</div>
                <Input className="flex-1 h-8 text-sm" value="/var/log" />
              </div>
              <div className="flex items-center">
                <div className="text-sm text-gray-600 w-24 flex-shrink-0">健康检查</div>
                <Input className="flex-1 h-8 text-sm" value="" placeholder="健康检查路径" />
              </div>
              <div className="flex items-center">
                <div className="text-sm text-gray-600 w-24 flex-shrink-0">检查端口</div>
                <Input className="flex-1 h-8 text-sm" value="/" />
              </div>
            </div>
          </div>

          {/* Add Redis specific configuration for example purposes */}
          {selectedModule.name.toLowerCase().includes('redis') && (
            <div>
              <h4 className="text-sm font-medium mb-2">Redis 配置</h4>
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="text-sm text-gray-600 w-24 flex-shrink-0">端口</div>
                  <Input className="flex-1 h-8 text-sm" value="6379" />
                </div>
                <div className="flex items-center">
                  <div className="text-sm text-gray-600 w-24 flex-shrink-0">密码</div>
                  <Input className="flex-1 h-8 text-sm" type="password" value="" />
                </div>
                <div className="flex items-center">
                  <div className="text-sm text-gray-600 w-24 flex-shrink-0">最大内存</div>
                  <div className="flex-1 flex items-center gap-2">
                    <Input className="flex-1 h-8 text-sm" value="1" />
                    <span className="text-sm text-gray-600">GB</span>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="text-sm text-gray-600 w-24 flex-shrink-0">持久化</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Checkbox id="enable-rdb" />
                      <label htmlFor="enable-rdb" className="text-sm">启用 RDB</label>
                    </div>
                    <div className="flex items-center">
                      <div className="text-xs text-gray-600 w-24 flex-shrink-0">保存间隔</div>
                      <Input className="flex-1 h-7 text-xs" value="300" />
                    </div>
                    <div className="flex items-center mt-1">
                      <div className="text-xs text-gray-600 w-24 flex-shrink-0">修改次数</div>
                      <Input className="flex-1 h-7 text-xs" value="100" />
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <Checkbox id="enable-aof" />
                      <label htmlFor="enable-aof" className="text-sm">启用 AOF</label>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="text-sm text-gray-600 w-24 flex-shrink-0">数据目录</div>
                  <Input className="flex-1 h-8 text-sm" value="/data" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 border-t border-gray-200">
        <Button className="w-full bg-blue-600 hover:bg-blue-700">保存</Button>
      </div>
    </div>
  );
};

export default DetailPanel;
