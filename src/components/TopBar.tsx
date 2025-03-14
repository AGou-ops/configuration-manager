import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, ChevronDown, History, Download, Save, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const TopBar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
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
        
        <Button variant="default" className="ml-4 bg-blue-600 hover:bg-blue-700">
          <PlusCircle className="mr-2 h-4 w-4" />
          新建配置
        </Button>
        
        <div className="flex items-center ml-4 border rounded px-2 py-1">
          <span className="mr-2">当前版本: v2.1.0</span>
          <ChevronDown className="h-4 w-4" />
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

        <Button variant="ghost" onClick={handleLogout} className="text-gray-600 hover:text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          退出登录
        </Button>
      </div>
    </div>
  );
};

export default TopBar;
