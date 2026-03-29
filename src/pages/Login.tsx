import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await login(email, password);
      
      if (result.success) {
        toast.success(result.message);
        // Determine navigation from email pattern
        if (email.toLowerCase().includes('.gtm@')) {
          navigate('/gtm/dashboard');
        } else {
          navigate('/cu/dashboard');
        }
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#fdfaf6] dark:bg-[#1a1f24] transition-colors duration-500 overflow-hidden relative">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-[#a7f3d0]/20 dark:bg-[#0d9488]/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-[#fef3c7]/30 dark:bg-[#fef3c7]/5 rounded-full blur-[100px]" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="z-10 w-full max-w-lg p-4"
      >
        <div className="bg-white dark:bg-[#252b32] rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="p-8 pb-4 text-center">
            <motion.div 
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#0d9488] text-white shadow-lg mb-6"
            >
              <Lock size={32} />
            </motion.div>
            <h2 className="text-3xl font-bold text-[#334155] dark:text-gray-100 tracking-tight">Enterprise Access</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Sign in with your corporate email</p>
          </div>

          <div className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0d9488] transition-colors" size={20} />
                  <input 
                    type="email" 
                    required
                    placeholder="name.role@enterprise.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-[#1a1f24] border border-gray-200 dark:border-gray-800 rounded-2xl text-gray-900 dark:text-white focus:ring-4 focus:ring-[#0d9488]/10 focus:border-[#0d9488] outline-none transition-all"
                  />
                </div>
                <p className="text-[10px] text-gray-400 ml-1 mt-1">Role detected from email (.gtm@ or .cu@)</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0d9488] transition-colors" size={20} />
                  <input 
                    type="password" 
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-[#1a1f24] border border-gray-200 dark:border-gray-800 rounded-2xl text-gray-900 dark:text-white focus:ring-4 focus:ring-[#0d9488]/10 focus:border-[#0d9488] outline-none transition-all"
                  />
                </div>
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#0d9488] hover:bg-[#0b7a6d] text-white rounded-2xl font-bold shadow-lg shadow-[#0d9488]/20 flex items-center justify-center gap-2 group transition-all disabled:opacity-70 mt-4"
              >
                {isSubmitting ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Sign In
                    <ChevronRight className="group-hover:translate-x-1 transition-transform" size={20} />
                  </>
                )}
              </motion.button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 text-center">
              <p className="text-sm text-gray-500">
                Authorized access only. Logins are audited based on email patterns.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
