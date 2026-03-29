import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Menu, Bell, Moon, Sun, Check, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Notification } from '../../types';
import { format } from 'date-fns';
import { useTheme } from '../../context/ThemeContext';

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);



  useEffect(() => {
    const fetchNotifications = async () => {
      if (user) {
        const data = await api.getNotifications(user.id);
        setNotifications(data);
      }
    };
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);



  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = async () => {
    if (user) {
      await api.markNotificationsRead(user.id);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    }
  };

  return (
    <header className="h-16 flex-shrink-0 bg-background/80 backdrop-blur-md border-b border-border flex items-center justify-between px-6 z-40 sticky top-0 transition-colors duration-300">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-xl text-muted-foreground hover:bg-muted transition-all active:scale-95"
          aria-label="Toggle Sidebar"
        >
          <Menu size={24} />
        </button>
        <div className="hidden md:block">
          <h1 className="text-lg font-bold text-foreground">
            {user?.role === 'GTM Manager' ? 'Global Dashboard' : 'Team Portal'}
          </h1>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {/* Notifications */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => {
              setShowNotifications(!showNotifications);
              if (!showNotifications && unreadCount > 0) markAsRead();
            }}
            className="p-2.5 rounded-xl text-muted-foreground hover:bg-muted transition-all relative active:scale-95"
          >
            <Bell size={20} />
            <AnimatePresence>
              {unreadCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute top-2 right-2 w-4 h-4 bg-primary text-[10px] font-bold text-primary-foreground rounded-full flex items-center justify-center border-2 border-background"
                >
                  {unreadCount}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-3 w-80 bg-card rounded-2xl shadow-2xl border border-border overflow-hidden"
              >
                <div className="p-4 border-b border-border flex items-center justify-between bg-muted/50">
                  <h3 className="font-bold text-sm text-foreground">Notifications</h3>
                  {unreadCount > 0 && <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-bold">NEW</span>}
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((n) => (
                      <div key={n.id} className={`p-4 border-b border-border last:border-0 hover:bg-muted/30 transition-colors ${!n.isRead ? 'bg-primary/5' : ''}`}>
                        <div className="flex gap-3">
                          <div className={`mt-1 p-1.5 rounded-lg ${!n.isRead ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                            <Check size={12} />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-foreground leading-tight">{n.message}</p>
                            <p className="text-[10px] text-muted-foreground mt-1">{format(new Date(n.createdAt), 'MMM d, h:mm a')}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center">
                      <p className="text-sm text-muted-foreground">No notifications yet</p>
                    </div>
                  )}
                </div>
                <div className="p-3 bg-muted/50 text-center">
                  <button className="text-xs font-bold text-primary hover:underline flex items-center justify-center gap-1 mx-auto">
                    View all alerts <ExternalLink size={12} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl text-muted-foreground hover:bg-muted transition-all active:scale-95 shadow-sm"
          title="Toggle Theme"
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </div>
    </header>
  );
};

export default Header;
