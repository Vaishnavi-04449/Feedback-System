import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Users, Globe2, LogOut, ShieldCheck, UserCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const { user, logout } = useAuth();
  const isGTM = user?.role === 'GTM Manager';

  // Minimal links per requirements
  const links = [
    { 
      name: isGTM ? 'Global View' : 'My Team', 
      path: isGTM ? '/gtm/dashboard' : '/cu/dashboard', 
      icon: isGTM ? Globe2 : Users 
    },
  ];

  return (
    <motion.aside
      initial={{ width: 280 }}
      animate={{ width: isOpen ? 280 : 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="bg-card border-r border-border flex-shrink-0 overflow-hidden h-full z-50 flex flex-col"
    >
      <div className="h-16 flex items-center px-6 border-b border-border shrink-0">
        <div className="flex items-center space-x-3 text-primary">
          <div className="p-2 bg-primary/20 rounded-xl shadow-inner">
            <ShieldCheck size={24} />
          </div>
          <span className="text-xl font-black tracking-tight text-foreground uppercase">
            Feedback
          </span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto custom-scrollbar">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3.5 rounded-2xl transition-all font-semibold text-sm group ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                    : 'text-muted-foreground hover:bg-muted hover:text-primary'
                }`
              }
            >
              <Icon size={20} className="group-hover:scale-110 transition-transform" />
              <span>{link.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User Session Info & Logout */}
      <div className="p-4 mt-auto space-y-3">
        <div className="px-4 py-4 bg-muted rounded-2xl border border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
              <UserCircle size={24} />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-foreground truncate">
                {user?.name}
              </p>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">
                {user?.role}
              </p>
            </div>
          </div>
        </div>
        
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl transition-all font-bold text-sm text-destructive hover:bg-destructive/10 active:scale-95"
        >
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
