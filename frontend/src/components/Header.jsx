import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-primary-container text-white shadow-md z-50 relative h-16 w-full shrink-0">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between items-center h-full">
          <div className="flex items-center gap-3">
            <div className="bg-white p-0.5 rounded-sm">
              <img alt="VW Logo" className="h-6 w-6" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA11ANjWq1wTC7VNWOezYljeb5baOUd_R6SRFjEvvZwml7nG3EfFC6Q2F9CiYWmEjBoA2oNkMsO9U4uTXbij9_dNXDntexXQnobJAgGiGYUH5cjpGlSO4vp6bPPka6W3GCjaHhZKuFXPwPplM_BLCMSZGkQ9ibz_5t8IK9WI1FCQM1LHImUem5oE348XJrBMI3fC1U5uJimnh7PkzLJQSjWxyDqkkr5vSOF5rJBcTcyidam9dFiKcndOYA0EbCjjpvrAYNQVydFTX3F"/>
            </div>
            <span className="font-title-md text-sm md:text-lg tracking-tight">SISTEMA SPC DIGITAL</span>
            <div className="h-6 w-[1px] bg-white/30 mx-2 hidden sm:block"></div>
            <span className="hidden sm:inline-block text-xs font-label-md text-secondary-container tracking-widest uppercase">PLANTA GUANAJUATO</span>
          </div>

          {user && (
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-sm font-code-data">{user.name}</span>
                <span className={`text-[10px] px-2 py-0.5 mt-0.5 rounded font-label-md tracking-wider uppercase ${
                  user.role === 'ADMIN' ? 'bg-secondary-container text-on-secondary-container' : 'bg-surface-variant text-on-surface-variant'
                }`}>
                  {user.role === 'ADMIN' ? 'ADMIN' : 'OPERADOR'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
