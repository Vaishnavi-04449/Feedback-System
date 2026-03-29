import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { api } from '../services/api';
import type { Country, Consultant } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Search, MapPin, User, SlidersHorizontal, ArrowRight } from 'lucide-react';
import FeedbackFormModal from '../components/dashboard/FeedbackFormModal.tsx';

const GTMDashboard: React.FC = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [expandedCountries, setExpandedCountries] = useState<Record<number, boolean>>({});
  const [selectedConsultant, setSelectedConsultant] = useState<Consultant | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [countriesData, consultantsData] = await Promise.all([
          api.getCountries(),
          api.getAllConsultants()
        ]);
        setCountries(countriesData);
        setConsultants(consultantsData);
        if (countriesData.length > 0) {
          setExpandedCountries({ [countriesData[0].id]: true });
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleCountry = (countryId: number) => {
    setExpandedCountries(prev => ({
      ...prev,
      [countryId]: !prev[countryId]
    }));
  };

  const filteredConsultants = consultants.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-10 pb-20 px-4 sm:px-0">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-2">
            <motion.h1 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="text-4xl font-black text-foreground tracking-tight"
            >
              Global Talent <span className="text-primary">Overview</span>
            </motion.h1>
            <p className="text-muted-foreground font-medium">Monitor performance across global consultants and provide impactful feedback.</p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-80 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search name or role..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-card border border-border rounded-2xl text-sm font-semibold shadow-sm focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-foreground"
              />
            </div>
            <button
              type="button"
              aria-label="Open filter options"
              className="p-3.5 bg-card border border-border rounded-2xl text-muted-foreground hover:text-primary transition-all shadow-sm"
            >
              <SlidersHorizontal size={20} />
            </button>
          </div>
        </header>

        {loading ? (
          <div className="grid grid-cols-1 gap-8">
            {[1, 2].map(i => (
              <div key={i} className="bg-white dark:bg-[#252b32] rounded-[2.5rem] border border-gray-50 dark:border-gray-800 h-48 animate-pulse shadow-sm" />
            ))}
          </div>
        ) : (
          <div className="space-y-10">
            {countries.map((country, countryIdx) => {
              const countryConsultants = filteredConsultants.filter(c => c.countryId === country.id);
              if (searchQuery && countryConsultants.length === 0) return null;

              const isExpanded = expandedCountries[country.id];

              return (
                <motion.section 
                  key={country.id} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: countryIdx * 0.1 }}
                  className="bg-card border border-border rounded-[2.5rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)] dark:shadow-none overflow-hidden"
                >
                  <button 
                    onClick={() => toggleCountry(country.id)}
                    className="w-full px-10 py-8 flex items-center justify-between hover:bg-muted/50 transition-all group"
                  >
                    <div className="flex items-center gap-6">
                      <div className={`p-4 rounded-2xl transition-all shadow-inner ${isExpanded ? 'bg-primary text-primary-foreground' : 'bg-primary/20 text-primary'}`}>
                        <MapPin size={24} />
                      </div>
                      <div className="text-left">
                        <h2 className="text-2xl font-black text-foreground">{country.name}</h2>
                        <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mt-1">
                          {countryConsultants.length} TEAM MEMBERS
                        </p>
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: isExpanded ? 90 : 0 }}
                      className="p-2 border border-border rounded-xl text-muted-foreground group-hover:text-primary group-hover:border-primary/50 transition-all"
                    >
                      <ChevronRight size={24} />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden bg-[#fdfaf6]/50 dark:bg-[#1a1f24]/50"
                      >
                        <div className="p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                          {countryConsultants.map((consultant, idx) => (
                            <motion.div 
                              initial={{ scale: 0.9, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ delay: idx * 0.05 }}
                              key={consultant.id}
                              className="group bg-card p-6 rounded-[2rem] border border-border hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/50 transition-all duration-500 relative overflow-hidden"
                            >
                              <div className="absolute top-0 right-0 p-4">
                                <span className={`text-[10px] font-black uppercase tracking-tighter px-3 py-1 rounded-full ${
                                  consultant.status === 'Active' ? 'bg-primary/20 text-primary' : 'bg-destructive/10 text-destructive'
                                }`}>
                                  {consultant.status}
                                </span>
                              </div>

                              <div className="flex items-center gap-4 mb-6">
                                <div className="w-14 h-14 rounded-2xl bg-muted border border-border flex items-center justify-center text-primary font-black text-xl shadow-sm group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                                  {consultant.name.charAt(0)}
                                </div>
                                <div className="overflow-hidden">
                                  <h3 className="font-bold text-foreground truncate">{consultant.name}</h3>
                                  <p className="text-xs font-semibold text-muted-foreground mt-0.5">{consultant.role}</p>
                                </div>
                              </div>
                              
                              <button 
                                onClick={() => setSelectedConsultant(consultant)}
                                className="w-full flex items-center justify-between px-6 py-4 bg-muted/80 hover:bg-primary text-foreground hover:text-primary-foreground rounded-2xl font-bold text-sm transition-all duration-300 group/btn"
                              >
                                <span>Track Performance</span>
                                <ArrowRight size={18} className="translate-x-0 group-hover/btn:translate-x-1 transition-transform" />
                              </button>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.section>
              );
            })}
            
            {!loading && filteredConsultants.length === 0 && (
              <div className="py-40 text-center space-y-4">
                <div className="w-24 h-24 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto text-gray-300">
                  <User size={48} />
                </div>
                <h3 className="text-2xl font-black text-[#334155] dark:text-gray-100">No consultants found</h3>
                <p className="text-gray-500">Try adjusting your search criteria to find who you're looking for.</p>
              </div>
            )}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedConsultant && (
          <FeedbackFormModal 
            consultant={selectedConsultant} 
            countryName={countries.find(c => c.id === selectedConsultant.countryId)?.name || ''}
            onClose={() => setSelectedConsultant(null)} 
          />
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default GTMDashboard;
