import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import type { Consultant, Feedback } from '../../types';
import { X, Star, Send, Loader2, History, Calendar, User, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

interface FeedbackFormModalProps {
  consultant: Consultant;
  countryName: string;
  onClose: () => void;
  onFeedbackSubmitted?: () => void;
}

const FeedbackFormModal: React.FC<FeedbackFormModalProps> = ({ consultant, countryName, onClose, onFeedbackSubmitted }) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comments, setComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [history, setHistory] = useState<Feedback[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [activeTab, setActiveTab] = useState<'history' | 'add'>('history');

  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoadingHistory(true);
      try {
        const data = await api.getFeedbackHistory(consultant.id);
        setHistory(data);
      } catch (error) {
        console.error('Failed to fetch history', error);
      } finally {
        setIsLoadingHistory(false);
      }
    };
    fetchHistory();
  }, [consultant.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    setIsSubmitting(true);
    try {
      const newFeedback = await api.submitFeedback({
        consultantId: consultant.id,
        gtmManagerId: user!.id,
        rating,
        comments,
      });
      
      toast.success('Feedback submitted successfully!');
      setHistory(prev => [newFeedback, ...prev]);
      setRating(0);
      setComments('');
      setActiveTab('history');
      if (onFeedbackSubmitted) onFeedbackSubmitted();
    } catch (error) {
      toast.error('Failed to submit feedback');
      console.error('Failed to submit feedback', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#334155]/60 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative w-full max-w-4xl bg-white dark:bg-[#252b32] rounded-[2.5rem] shadow-2xl overflow-hidden pointer-events-auto flex flex-col max-h-[90vh] border border-gray-100 dark:border-gray-800"
        >
          {/* Header */}
          <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-white dark:bg-[#252b32] z-10 shrink-0">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-[#a7f3d0] dark:bg-[#0d9488]/20 text-[#0d9488] rounded-2xl flex items-center justify-center text-2xl font-bold shadow-inner">
                {consultant.name[0]}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#334155] dark:text-gray-100 tracking-tight">{consultant.name}</h2>
                <p className="text-sm font-semibold text-gray-500 flex items-center gap-2">
                  <span className="text-[#0d9488]">{countryName}</span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full" />
                  <span>{consultant.role}</span>
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-3 text-gray-400 hover:text-[#334155] dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl transition-all active:scale-95"
            >
              <X size={24} />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex px-8 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-[#1a1f24]/50 shrink-0">
            <button 
              onClick={() => setActiveTab('history')}
              className={`px-6 py-4 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${activeTab === 'history' ? 'border-[#0d9488] text-[#0d9488]' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
            >
              <History size={18} /> Feedback History
            </button>
            <button 
              onClick={() => setActiveTab('add')}
              className={`px-6 py-4 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${activeTab === 'add' ? 'border-[#0d9488] text-[#0d9488]' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
            >
              <Star size={18} /> New Feedback
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
            <AnimatePresence mode="wait">
              {activeTab === 'history' ? (
                <motion.div
                  key="history"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-8 relative"
                >
                  {isLoadingHistory ? (
                    <div className="space-y-6">
                      {[1, 2].map(i => <div key={i} className="animate-pulse bg-gray-100 dark:bg-gray-800/50 h-32 rounded-3xl" />)}
                    </div>
                  ) : history.length > 0 ? (
                    <div className="relative pl-8">
                      {/* Vertical line */}
                      <div className="absolute left-0 top-2 bottom-2 w-px bg-gray-200 dark:bg-gray-800" />
                      
                      {history.map((fb, idx) => (
                        <div key={fb.id} className="relative mb-8 last:mb-0">
                          {/* Dot */}
                          <div className="absolute -left-[36.5px] top-1.5 w-4 h-4 rounded-full bg-white dark:bg-[#252b32] border-2 border-[#0d9488] z-10 shadow-sm" />
                          
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-gray-50 dark:bg-[#1a1f24] rounded-3xl p-6 border border-gray-100 dark:border-gray-800 hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-none transition-all"
                          >
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-white dark:bg-[#252b32] rounded-xl shadow-sm text-gray-400">
                                  <User size={16} />
                                </div>
                                <div>
                                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">SUBMITTED BY</p>
                                  <p className="text-sm font-bold text-[#334155] dark:text-gray-100">GTM Manager (ID: {fb.gtmManagerId})</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-1.5 bg-[#fef3c7] dark:bg-[#fef3c7]/10 px-3 py-1.5 rounded-xl border border-[#fef3c7] dark:border-[#fef3c7]/20">
                                <span className="text-sm font-black text-amber-600">{fb.rating}.0</span>
                                <Star size={14} className="fill-amber-600 text-amber-600" />
                              </div>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4 italic">"{fb.comments}"</p>
                            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-white dark:bg-[#252b32] px-3 py-1.5 rounded-full w-fit">
                              <Calendar size={12} />
                              {format(new Date(fb.createdAt), 'MMMM d, yyyy')}
                            </div>
                          </motion.div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-20 text-center">
                      <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                        <MessageSquare size={40} />
                      </div>
                      <h4 className="text-lg font-bold text-[#334155] dark:text-gray-100 mb-2">No feedback available</h4>
                      <p className="text-gray-500 max-w-xs mx-auto">Be the first to provide insights for this consultant's performance.</p>
                      <button 
                        onClick={() => setActiveTab('add')}
                        className="mt-6 text-[#0d9488] font-bold hover:underline"
                      >
                        Provide feedback now
                      </button>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.form
                  key="add"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  onSubmit={handleSubmit}
                  className="space-y-8"
                >
                  <div className="space-y-4">
                    <label className="block text-lg font-bold text-[#334155] dark:text-gray-100">
                      Performance Rating
                    </label>
                    <div className="flex items-center gap-4 bg-gray-50 dark:bg-[#1a1f24] p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800">
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="p-1 transition-transform active:scale-95"
                          >
                            <Star
                              size={40}
                              className={`transition-all duration-300 ${
                                (hoverRating || rating) >= star
                                  ? 'text-amber-400 fill-amber-400 scale-110 drop-shadow-[0_0_10px_rgba(251,191,36,0.2)]'
                                  : 'text-gray-200 dark:text-gray-700'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                      <div className="h-10 w-px bg-gray-200 dark:bg-gray-800 mx-2" />
                      <div className="text-xl font-black text-[#334155] dark:text-white">
                        {rating > 0 ? `${rating}.0` : '--'}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="block text-lg font-bold text-[#334155] dark:text-gray-100">
                      Detailed Observation
                    </label>
                    <textarea
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      rows={6}
                      placeholder="Share your thoughts on delivery quality, communication, and impact..."
                      className="w-full px-6 py-5 bg-gray-50 dark:bg-[#1a1f24] border border-gray-100 dark:border-gray-800 rounded-[2rem] text-gray-900 dark:text-white focus:ring-4 focus:ring-[#0d9488]/10 focus:border-[#0d9488] outline-none transition-all resize-none shadow-inner"
                    />
                  </div>

                  <div className="pt-4 flex justify-end">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      disabled={isSubmitting || rating === 0}
                      className="px-10 py-5 bg-[#0d9488] hover:bg-[#0b7a6d] text-white rounded-2xl font-black shadow-xl shadow-[#0d9488]/20 flex items-center gap-3 transition-all disabled:opacity-50 disabled:grayscale"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={24} className="animate-spin" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <Send size={24} />
                          <span>Finalize Feedback</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default FeedbackFormModal;
