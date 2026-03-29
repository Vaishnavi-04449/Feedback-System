import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { Consultant, Feedback } from '../types';
import { Search, History, Star, Calendar, MessageSquare, User, ArrowRight, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

const CUDashboard: React.FC = () => {
  const { user } = useAuth();
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedConsultant, setSelectedConsultant] = useState<Consultant | null>(null);
  const [feedbackHistory, setFeedbackHistory] = useState<Feedback[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    const fetchTeam = async () => {
      setLoading(true);
      try {
        const team = await api.getAssignedConsultants(user!.id);
        setConsultants(team);
        if (team.length > 0) {
          handleSelectConsultant(team[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchTeam();
  }, [user]);

  const handleSelectConsultant = async (consultant: Consultant) => {
    setSelectedConsultant(consultant);
    setLoadingHistory(true);
    try {
      const history = await api.getFeedbackHistory(consultant.id);
      setFeedbackHistory(history);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const filteredConsultants = consultants.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="max-w-7xl mx-auto h-[calc(100vh-10rem)] flex flex-col lg:flex-row gap-8 px-4 sm:px-0">
        
        {/* Left Side: Team Sidebar */}
        <div className="w-full lg:w-80 flex flex-col shrink-0 gap-6">
          <header className="space-y-1">
            <h1 className="text-3xl font-black text-[#334155] dark:text-gray-100 tracking-tight">My Team</h1>
            <p className="text-sm font-semibold text-gray-500">Manage {consultants.length} members</p>
          </header>
          
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0d9488] transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search team..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-[#252b32] border border-gray-100 dark:border-gray-800 rounded-2xl text-sm font-semibold shadow-sm focus:ring-4 focus:ring-[#0d9488]/10 focus:border-[#0d9488] outline-none transition-all dark:text-white"
            />
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            {loading ? (
              [1,2,3].map(i => <div key={i} className="animate-pulse bg-white dark:bg-[#252b32] h-24 rounded-[2rem] border border-gray-50 dark:border-gray-800" />)
            ) : filteredConsultants.map(consultant => (
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                key={consultant.id}
                onClick={() => handleSelectConsultant(consultant)}
                className={`w-full text-left p-5 rounded-[2rem] transition-all border group relative overflow-hidden ${
                  selectedConsultant?.id === consultant.id
                    ? 'bg-[#0d9488] border-[#0d9488] text-white shadow-xl shadow-[#0d9488]/20'
                    : 'bg-white dark:bg-[#252b32] border-gray-100 dark:border-gray-800 hover:border-[#a7f3d0] dark:hover:border-[#0d9488]/50 text-[#334155] dark:text-gray-400'
                }`}
              >
                <div className="flex justify-between items-start mb-2 relative z-10">
                  <div className={`font-bold transition-colors ${selectedConsultant?.id === consultant.id ? 'text-white' : 'dark:text-gray-100'}`}>
                    {consultant.name}
                  </div>
                  {selectedConsultant?.id === consultant.id && <CheckCircle2 size={16} className="text-[#a7f3d0]" />}
                </div>
                <div className={`text-xs font-semibold truncate relative z-10 ${selectedConsultant?.id === consultant.id ? 'text-white/80' : 'text-gray-400'}`}>
                  {consultant.role}
                </div>
                {selectedConsultant?.id === consultant.id && (
                  <motion.div 
                    layoutId="active-pill"
                    className="absolute inset-0 bg-gradient-to-r from-[#0d9488] to-[#0b7a6d] z-0"
                  />
                )}
              </motion.button>
            ))}
            {!loading && filteredConsultants.length === 0 && (
              <div className="py-10 text-center space-y-3">
                <User size={32} className="mx-auto text-gray-300" />
                <p className="text-gray-400 font-bold text-sm">No members found</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Timeline View */}
        <div className="flex-1 bg-white dark:bg-[#252b32] border border-gray-50 dark:border-gray-800 rounded-[3rem] shadow-[0_10px_60px_rgba(0,0,0,0.03)] dark:shadow-none flex flex-col overflow-hidden">
          {selectedConsultant ? (
            <AnimatePresence mode="wait">
              <motion.div 
                key={selectedConsultant.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-col h-full"
              >
                {/* Profile Header */}
                <div className="px-10 py-10 border-b border-gray-50 dark:border-gray-800 flex flex-col sm:flex-row items-center gap-6 bg-[#fdfaf6]/30 dark:bg-[#1a1f24]/30">
                  <div className="w-24 h-24 bg-[#a7f3d0] dark:bg-[#0d9488]/20 text-[#0d9488] rounded-[2rem] flex items-center justify-center text-4xl font-black shadow-inner">
                    {selectedConsultant.name[0]}
                  </div>
                  <div className="text-center sm:text-left flex-1">
                    <h2 className="text-4xl font-black text-[#334155] dark:text-gray-100 tracking-tight mb-2">{selectedConsultant.name}</h2>
                    <div className="flex flex-wrap justify-center sm:justify-start gap-3 items-center">
                      <span className="px-3 py-1 bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 rounded-full text-xs font-bold text-gray-500 uppercase tracking-widest">{selectedConsultant.role}</span>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${selectedConsultant.status === 'Active' ? 'bg-[#a7f3d0] text-[#0d9488]' : 'bg-orange-100 text-orange-600'}`}>{selectedConsultant.status}</span>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                  <div className="flex items-center gap-2 mb-10">
                    <div className="p-2 bg-[#fef3c7] dark:bg-[#fef3c7]/10 text-amber-600 rounded-xl">
                      <History size={20} />
                    </div>
                    <h3 className="text-xl font-bold text-[#334155] dark:text-gray-100">Performance Timeline</h3>
                  </div>

                  <div className="relative pl-10">
                    {/* Line */}
                    <div className="absolute left-0 top-3 bottom-0 w-px bg-gray-200 dark:bg-gray-800" />

                    {loadingHistory ? (
                      <div className="space-y-6">
                        {[1, 2].map(i => <div key={i} className="animate-pulse bg-gray-50 dark:bg-gray-800/50 h-32 rounded-3xl" />)}
                      </div>
                    ) : feedbackHistory.length > 0 ? (
                      feedbackHistory.map((fb, idx) => (
                        <div key={fb.id} className="relative mb-10 last:mb-0">
                          {/* Dot */}
                          <div className="absolute -left-[45px] top-1.5 w-5 h-5 rounded-full bg-white dark:bg-[#252b32] border-2 border-[#0d9488] z-10 shadow-sm" />
                          
                          <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white dark:bg-[#1a1f24] border border-gray-100 dark:border-gray-800 p-8 rounded-[2.5rem] hover:shadow-2xl hover:shadow-[#0d9488]/5 transition-all group"
                          >
                            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                              <div className="flex items-center gap-4">
                                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl text-gray-400">
                                  <User size={20} />
                                </div>
                                <div>
                                  <p className="text-[10px] font-black text-gray-400 tracking-widest uppercase">GTM EVALUATOR</p>
                                  <p className="font-bold text-[#334155] dark:text-gray-100">Regional Manager</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 bg-[#fef3c7] dark:bg-[#fef3c7]/5 px-4 py-2 rounded-2xl border border-[#fef3c7] dark:border-[#fef3c7]/10">
                                <span className="text-xl font-black text-amber-600">{fb.rating}.0</span>
                                <Star size={18} className="fill-amber-600 text-amber-600" />
                              </div>
                            </div>
                            
                            <p className="text-gray-600 dark:text-gray-300 font-medium leading-relaxed italic mb-6">
                              "{fb.comments}"
                            </p>

                            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 bg-gray-50 dark:bg-gray-800 px-4 py-2 rounded-full w-fit">
                              <Calendar size={14} />
                              {format(new Date(fb.createdAt), 'MMMM d, yyyy')}
                            </div>
                          </motion.div>
                        </div>
                      ))
                    ) : (
                      <div className="py-20 text-center space-y-4">
                        <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto text-gray-300">
                          <MessageSquare size={40} />
                        </div>
                        <h4 className="text-lg font-bold text-[#334155] dark:text-gray-100">No Feedback Data</h4>
                        <p className="text-gray-500 max-w-xs mx-auto text-sm">Waiting for Global Managers to provide the first performance review.</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-10 space-y-6 text-center">
              <div className="w-32 h-32 bg-[#fdfaf6] dark:bg-[#1a1f24] rounded-[3rem] flex items-center justify-center text-gray-200">
                <ArrowRight size={64} className="animate-pulse" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-[#334155] dark:text-gray-100">Select Member</h3>
                <p className="text-gray-500 max-w-sm">Choose a consultant from your team to explore detailed performance analytics and history.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CUDashboard;
