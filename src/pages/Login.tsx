import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext'; // Assuming AuthContext is in a separate file

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login, isAuthenticated } = useAuth(); // Get the login function and authentication state from AuthContext
  const navigate = useNavigate();

  // Redirect to home if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple static authentication
    if (username === 'admin' && password === 'admin') {
      // Call the login function from AuthContext
      login();
      
      toast.success('登录成功', {
        duration: 2000,
      });
      
      // Navigate is handled by the useEffect above
    } else {
      toast.error('用户名或密码错误', {
        duration: 2000,
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex h-screen w-full">
      {/* Left side with gradient background and branding */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-400 via-blue-600 to-indigo-800 flex-col justify-center p-12">
        <div className="text-white">
          <h1 className="text-4xl font-bold mb-4 flex items-center">
            <i className="fa fa-cube mr-3 text-3xl text-blue-300" aria-hidden="true"></i>
            容器配置管理平台
          </h1>
          <div className="mt-20">
            <h4 className="text-5xl font-bold mb-4">some descriptions here.</h4>
          </div>
        </div>
      </div>
      
      {/* Right side with login form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-800">欢迎使用容器配置管理平台</h2>
          </div>
          
          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-8">
            <button className="flex-1 py-2 text-center text-blue-600 border-b-2 border-blue-600 font-medium">
              账号登录
            </button>
            <button className="flex-1 py-2 text-center text-gray-500">
              注册账号
            </button>
          </div>
          
          <form onSubmit={handleLogin}>
            {/* Username field */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">用户名/邮箱</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="请输入用户名/邮箱"
                  className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            
            {/* Password field */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">密码</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="请输入密码"
                  className="pl-10 pr-10 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>
            
            {/* Remember me and forgot password */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  记住密码
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className="text-blue-600 hover:text-blue-500">
                  忘记密码?
                </a>
              </div>
            </div>
            
            {/* Login button */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
            >
              登录
            </button>
          </form>
          
          {/* Other login methods */}
          <div className="mt-8">
            <p className="text-center text-sm text-gray-600 mb-4">其他登录方式?</p>
            <div className="flex justify-center space-x-6">
              <button 
                className="text-gray-500 hover:text-gray-700" 
                title="使用钉钉登录"
              >
                <svg 
                  width="24" 
                  height="24" 
                  viewBox="0 0 1024 1024" 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="icon"
                  fill="#007dfe"
                >
                    <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm227 385.3c-1 4.2-3.5 10.4-7 17.8h.1l-.4.7c-20.3 43.1-73.1 127.7-73.1 127.7s-.1-.2-.3-.5l-15.5 26.8h74.5L575.1 810l32.3-128h-58.6l20.4-84.7c-16.5 3.9-35.9 9.4-59 16.8 0 0-31.2 18.2-89.9-35 0 0-39.6-34.7-16.6-43.4 9.8-3.7 47.4-8.4 77-12.3 40-5.4 64.6-8.2 64.6-8.2S422 517 392.7 512.5c-29.3-4.6-66.4-53.1-74.3-95.8 0 0-12.2-23.4 26.3-12.3 38.5 11.1 197.9 43.2 197.9 43.2s-207.4-63.3-221.2-78.7c-13.8-15.4-40.6-84.2-37.1-126.5 0 0 1.5-10.5 12.4-7.7 0 0 153.3 69.7 258.1 107.9 104.8 37.9 195.9 57.3 184.2 106.7z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
