import React, { useState, useEffect, useMemo } from 'react';
import { getAgencies, getAgencyMetrics, getComparison } from '../api/ecfrApi';
import MetricCard from '../components/MetricCard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { BookOpen, AlertTriangle, Activity, Database, Clock, Calendar, CheckSquare } from 'lucide-react';
import TimelineTable from '../components/TimelineTable';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAgencies, setSelectedAgencies] = useState([]);
  const [correlations, setCorrelations] = useState([]);
  const [metricsLoading, setMetricsLoading] = useState(false);
  
  // Date Filtering States
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
        navigate('/login');
        return;
    }
    fetchAgencies();
  }, [navigate]);

  const fetchAgencies = async () => {
    try {
      const data = await getAgencies();
      setAgencies(data);
    } catch (e) {
      console.error(e);
      if (e.response && e.response.status === 401) navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const addAgencyData = async (slug) => {
    if (!slug || selectedAgencies.find(a => a.slug === slug)) return;
    
    setMetricsLoading(true);
    const updatedSlugs = [...selectedAgencies.map(a => a.slug), slug];
    try {
      const data = await getComparison(updatedSlugs);
      setSelectedAgencies(data.metrics);
      setCorrelations(data.correlations || []);
    } catch(e) {
      console.error(e);
    } finally {
      setMetricsLoading(false);
    }
  };

  const removeAgency = async (slugToRemove) => {
      const filtered = selectedAgencies.filter(a => a.slug !== slugToRemove);
      if (filtered.length === 0) {
          setSelectedAgencies([]);
          setCorrelations([]);
          return;
      }
      setMetricsLoading(true);
      try {
          const data = await getComparison(filtered.map(a => a.slug));
          setSelectedAgencies(data.metrics);
          setCorrelations(data.correlations || []);
      } catch(e) {}
      finally {
          setMetricsLoading(false);
      }
  };

  // Predefined obsidian radiant colors for dynamic lines
  const CHART_COLORS = ['#4d8eff', '#ffb786', '#10b981', '#c0c1ff', '#ec4899', '#eab308'];

  // Time-Series Aggregation Logic
  const lineChartData = useMemo(() => {
    if (selectedAgencies.length === 0) return [];

    let rawEvents = [];
    selectedAgencies.forEach(ag => {
        if (ag.recentEvents) {
            ag.recentEvents.forEach(evt => {
                rawEvents.push({
                    date: new Date(evt.amendmentDate),
                    name: ag.shortName || ag.slug
                });
            });
        }
    });

    // 1. Filter by Date Range
    if (startDate) {
        const start = new Date(startDate);
        rawEvents = rawEvents.filter(e => e.date >= start);
    }
    if (endDate) {
        let end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        rawEvents = rawEvents.filter(e => e.date <= end);
    }

    // 2. Group by Month (YYYY-MM)
    const grouped = {};

    // Pre-fill the X-Axis with chronological 0s if bounds are selected
    if (startDate && endDate) {
        const s = new Date(startDate);
        const e = new Date(endDate);
        if (s <= e) {
            let current = new Date(s.getFullYear(), s.getMonth(), 1);
            const endLimit = new Date(e.getFullYear(), e.getMonth(), 1);
            let safetyCount = 0;
            while (current <= endLimit && safetyCount < 120) {
                const mk = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}`;
                grouped[mk] = {};
                current.setMonth(current.getMonth() + 1);
                safetyCount++;
            }
        }
    }

    rawEvents.forEach(e => {
        const monthKey = `${e.date.getFullYear()}-${String(e.date.getMonth() + 1).padStart(2, '0')}`;
        if (!grouped[monthKey]) grouped[monthKey] = {};
        grouped[monthKey][e.name] = (grouped[monthKey][e.name] || 0) + 1;
    });

    // 3. Format to Array and Sort Chronologically
    const sortedKeys = Object.keys(grouped).sort((a, b) => new Date(a) - new Date(b));
    return sortedKeys.map(key => {
        const point = { name: key };
        // Assign 0 for missing data points for each active agency
        selectedAgencies.forEach((ag, index) => {
            const agName = ag.shortName || ag.slug;
            let val = grouped[key] ? (grouped[key][agName] || 0) : 0;
            // Prevent visually occluding SVGs
            if (val === 0) {
                val = 0 + (index * 0.05);
            }
            point[agName] = val;
        });
        return point;
    });
  }, [selectedAgencies, startDate, endDate]);

  if (loading) return <div className="flex h-screen items-center justify-center text-[#c2c6d6]">Loading USDS Infrastructure...</div>;

  return (
    <div className="flex h-screen bg-transparent text-[#dae2fd] overflow-hidden font-sans">
      
      {/* OBSIDIAN SIDEBAR */}
      <aside className="w-80 flex-shrink-0 border-r border-[#424754]/20 bg-[#131b2e]/60 backdrop-blur-xl p-8 flex flex-col h-full overflow-y-auto relative z-10 shadow-[8px_0_30px_rgba(8,16,31,0.6)]">
        
        <div className="mb-10">
            <h1 className="text-3xl font-black text-[#adc6ff] tracking-tighter">eCFR Matrix</h1>
            <p className="text-[0.65rem] font-bold tracking-[0.2em] uppercase text-[#ffb786] mt-2 block">Intelligence Layer</p>
        </div>

        <div className="mb-8 relative z-20">
            <label className="text-[0.65rem] font-extrabold uppercase tracking-widest text-[#7f879a] mb-3 block">Available Targets</label>
            <div className="relative">
                <select 
                   className="obsidian-input w-full p-4 pr-10 shadow-inner appearance-none cursor-pointer"
                   onChange={(e) => { addAgencyData(e.target.value); e.target.value = ""; }}
                   defaultValue=""
                >
                   <option value="" disabled>Add Agency Database...</option>
                   {agencies.map(a => (
                       <option key={a.slug} value={a.slug} className="bg-[#171f33] text-[#dae2fd]">{a.name} ({a.shortName || a.slug})</option>
                   ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#7f879a]">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
            </div>
            {metricsLoading && <p className="text-[#ffb786] text-xs font-bold mt-3 animate-pulse tracking-wide">COMPILING MATRIX...</p>}
        </div>

        <div className="flex flex-col gap-4">
           <label className="text-[0.65rem] font-extrabold uppercase tracking-widest text-[#7f879a] border-b border-[#424754]/30 pb-2">Active Components</label>
           {selectedAgencies.length === 0 && <p className="text-sm italic text-[#7f879a]">No targets active. Select an agency to lock in.</p>}
           
           <div className="flex flex-col gap-3 mt-2">
             {selectedAgencies.map((a, idx) => (
                <div key={a.slug} className="group flex flex-col p-4 rounded-xl bg-gradient-to-r from-[#171f33] to-[#222a3d]/80 border border-[#424754]/40 hover:border-[#4d8eff]/50 hover:shadow-[0_0_15px_rgba(77,142,255,0.15)] transition-all cursor-default">
                   <div className="flex justify-between items-center text-sm font-bold text-[#dae2fd]">
                      <span className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: CHART_COLORS[idx % CHART_COLORS.length] }}></span>
                          {a.shortName || a.slug}
                      </span>
                      <button onClick={() => removeAgency(a.slug)} className="text-[#7f879a] hover:text-[#ffb786] transition-colors p-1" title="Disengage Target">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                      </button>
                   </div>
                   <div className="text-[0.65rem] text-[#7f879a] mt-2 flex items-center justify-between tracking-wider uppercase font-mono">
                      <span>{a.checksum ? a.checksum.substring(0, 10) + '...' : 'N/A'}</span>
                      <Database className="w-3 h-3 text-[#4d8eff]" />
                   </div>
                </div>
             ))}
           </div>
        </div>
      </aside>

      {/* MATRIX CENTER */}
      <main className="flex-1 overflow-y-auto px-8 py-10 relative">
        {selectedAgencies.length > 0 ? (
          <div className="max-w-6xl mx-auto flex flex-col gap-8 pb-20 animate-fade-in relative z-10">
              {/* Abstract Aggregations */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <MetricCard 
                      title="Total Words" 
                      value={selectedAgencies.reduce((acc, a) => acc + (a.wordCount || 0), 0).toLocaleString()} 
                      icon={<BookOpen className="w-6 h-6" />}
                      status="normal"
                  />
                  <MetricCard 
                      title="Complexity Scans" 
                      value={selectedAgencies.reduce((acc, a) => acc + (a.complexityScore || 0), 0).toLocaleString()} 
                      icon={<AlertTriangle className="w-6 h-6" />}
                      status="warning"
                  />
                  <MetricCard 
                      title="Total Amendments" 
                      value={selectedAgencies.reduce((acc, a) => acc + (a.historicalChangesCount || 0), 0).toLocaleString()} 
                      icon={<Activity className="w-6 h-6" />}
                      status="success"
                  />
                  <MetricCard 
                      title="Collision Overlaps" 
                      value={correlations.length} 
                      icon={<Database className="w-6 h-6" />}
                      status={correlations.length > 0 ? "warning" : "normal"}
                      onClick={correlations.length > 0 ? () => {
                          document.getElementById('timeline-table-section')?.scrollIntoView({ behavior: 'smooth' });
                      } : null}
                  />
              </div>

              {/* Bar Chart Container */}
              <div className="obsidian-panel p-8 mt-4">
                  <h3 className="text-lg font-bold text-[#adc6ff] mb-6 tracking-wide">Comparative Complexity & Volume Matrix</h3>
                  <div className="h-96">
                      <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={selectedAgencies.map(a => ({
                              name: a.shortName || a.slug,
                              WordVolume: a.wordCount ? a.wordCount / 1000 : 0,
                              Complexity: a.complexityScore || 0
                          }))}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2d3449" />
                              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#c2c6d6', fontWeight: 600}} />
                              <YAxis yAxisId="left" orientation="left" stroke="#4d8eff" axisLine={false} tickLine={false} />
                              <YAxis yAxisId="right" orientation="right" stroke="#ffb786" axisLine={false} tickLine={false} />
                              <Tooltip cursor={{fill: '#222a3d'}} contentStyle={{borderRadius: '12px', border: '1px solid #424754', backgroundColor: '#0b1326', boxShadow: '0 30px 80px rgba(8,16,31,0.6)'}}/>
                              <Bar yAxisId="left" name="Word Volume (Thousands)" dataKey="WordVolume" fill="#4d8eff" radius={[6, 6, 0, 0]} />
                              <Bar yAxisId="right" name="Complexity Score" dataKey="Complexity" fill="#ffb786" radius={[6, 6, 0, 0]} />
                          </BarChart>
                      </ResponsiveContainer>
                  </div>
              </div>

              {/* Time-Series Line Chart Component */}
              <div className="obsidian-panel p-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                      <div>
                          <h3 className="text-xl font-bold text-[#adc6ff] flex items-center tracking-wide">
                              <Activity className="w-5 h-5 mr-3 text-[#4d8eff]" />
                              Regulatory Actions Over Time
                          </h3>
                          <p className="text-sm text-[#7f879a] mt-1">Velocity of structural amendments grouped by month.</p>
                      </div>
                      
                      {/* Date Filters Modified for Obsidian */}
                      <div className="flex flex-wrap items-center gap-3 mt-4 md:mt-0 bg-[#08101f]/60 p-3 rounded-xl border border-[#424754]/30 shadow-inner">
                          <div className="flex items-center">
                              <Calendar className="w-4 h-4 text-[#7f879a] mr-2" />
                              <input 
                                  type="date" 
                                  value={startDate}
                                  onChange={(e) => setStartDate(e.target.value)}
                                  className="bg-transparent text-sm font-medium text-[#dae2fd] outline-none"
                                  title="Start Date"
                              />
                          </div>
                          <span className="text-[#424754]">-</span>
                          <div className="flex items-center">
                              <input 
                                  type="date" 
                                  value={endDate}
                                  onChange={(e) => setEndDate(e.target.value)}
                                  className="bg-transparent text-sm font-medium text-[#dae2fd] outline-none"
                                  title="End Date"
                              />
                          </div>
                      </div>
                  </div>

                  <div className="h-96 w-full">
                      {lineChartData.length > 0 ? (
                          <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={lineChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2d3449" />
                                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#c2c6d6', fontSize: 12}} />
                                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#7f879a', fontSize: 12}} allowDecimals={false} />
                                  <Tooltip 
                                      contentStyle={{borderRadius: '12px', border: '1px solid #424754', backgroundColor: '#0b1326', boxShadow: '0 30px 80px rgba(8,16,31,0.6)', padding: '12px'}}
                                      labelStyle={{fontWeight: 'bold', color: '#adc6ff', marginBottom: '8px'}}
                                  />
                                  <Legend iconType="circle" wrapperStyle={{paddingTop: '20px', color: '#c2c6d6'}} />
                                  
                                  {selectedAgencies.map((ag, index) => {
                                      const agName = ag.shortName || ag.slug;
                                      return (
                                          <Line 
                                              key={agName}
                                              type="monotone" 
                                              dataKey={agName} 
                                              name={agName}
                                              stroke={CHART_COLORS[index % CHART_COLORS.length]} 
                                              strokeWidth={3}
                                              dot={{r: 4, strokeWidth: 0, fill: '#131b2e', stroke: CHART_COLORS[index % CHART_COLORS.length]}}
                                              activeDot={{r: 6, strokeWidth: 2}}
                                          />
                                      );
                                  })}
                              </LineChart>
                          </ResponsiveContainer>
                      ) : (
                          <div className="flex items-center justify-center h-full border border-dashed border-[#424754]/50 rounded-xl bg-[#08101f]/30">
                              <p className="text-[#7f879a] font-bold tracking-widest uppercase text-sm">No amendment data in bounds</p>
                          </div>
                      )}
                  </div>
              </div>

              <div id="timeline-table-section">
                  <TimelineTable agencies={selectedAgencies} correlations={correlations} startDate={startDate} endDate={endDate} />
              </div>
          </div>
        ) : (
            <div className="flex flex-col items-center justify-center h-full text-center relative z-10">
               <div className="w-24 h-24 mb-6 rounded-3xl bg-gradient-to-br from-[#4d8eff]/20 to-[#10b981]/10 flex items-center justify-center shadow-[0_0_50px_rgba(77,142,255,0.15)] backdrop-blur-md border border-[#4d8eff]/20">
                   <CheckSquare className="w-10 h-10 text-[#4d8eff]" />
               </div>
               <h2 className="text-3xl font-black text-[#dae2fd] mb-3 tracking-tight">System Online</h2>
               <p className="text-[#7f879a] text-lg font-medium max-w-sm leading-relaxed">Engage a target agency from the sidebar to compile the matrix intelligence.</p>
            </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
