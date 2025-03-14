import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, History, Download, Save, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { CreateConfigDialog } from './CreateConfigDialog';

const TopBar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [selectedVersion, setSelectedVersion] = useState('v2.1.0');
  const [isVersionDropdownOpen, setIsVersionDropdownOpen] = useState(false);

  const versions = ['v2.0.0', 'v2.1.0', 'v3.0.0', 'v3.1.0'];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleCreateConfig = (values: any) => {
    console.log('创建新配置:', values);
    // TODO: 实现创建配置的逻辑
  };

  const handleVersionSelect = (version: string) => {
    setSelectedVersion(version);
    setIsVersionDropdownOpen(false);
  };

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200">
      <div className="flex items-center">
        <div className="flex items-center text-black font-bold text-xl">
          <span className="flex items-center justify-center mr-2">
            <i className="fa fa-cube text-blue-600" aria-hidden="true"></i>
          </span>
          容器配置管理平台
        </div>

        <CreateConfigDialog onSubmit={handleCreateConfig} />
&nbsp;&nbsp;当前版本:
        <div className="relative">
          <div 
            className="flex items-center ml-1 border rounded px-2 py-1 cursor-pointer hover:bg-gray-50"
            onClick={() => setIsVersionDropdownOpen(!isVersionDropdownOpen)}
          >
            <span className="mr-2">{selectedVersion}</span>
            <ChevronDown className="h-4 w-4" />
          </div>

          {isVersionDropdownOpen && (
            <div className="absolute z-10 mt-1 w-full right-0 bg-white border rounded-md shadow-lg">
              {versions.map((version) => (
                <div
                  key={version}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-right text-left"
                  onClick={() => handleVersionSelect(version)}
                >
                  {version}
                </div>
              ))}
            </div>
          )}
        </div>

        <Button variant="ghost" className="ml-2">
          <History className="mr-2 h-4 w-4" />
          历史版本
        </Button>
      </div>

      <div className="flex items-center">
        <Button variant="outline" className="mr-2">
          <Download className="mr-2 h-4 w-4" />
          导出配置
        </Button>

        <Button variant="outline" className="mr-2">
          <Save className="mr-2 h-4 w-4" />
          保存
        </Button>

        <Button
          variant="ghost"
          onClick={handleLogout}
          className="text-gray-600 hover:text-red-600 px-2"
          title="退出登录"
        >
          <LogOut className="mr-1 h-4 w-4" />
          退出登录
        </Button>
      </div>
    </div>
  );
};

export default TopBar;
