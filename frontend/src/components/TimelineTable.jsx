import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const TimelineTable = ({ agencies, correlations, startDate, endDate }) => {
  const [expandedDate, setExpandedDate] = useState(null);

  if (!agencies || agencies.length === 0) return null;

  // 1. Flatten all agency events into a massive array
  let allEvents = [];
  agencies.forEach(agency => {
      if (agency.recentEvents) {
          agency.recentEvents.forEach(evt => {
              allEvents.push({
                  ...evt,
                  isCorrelation: false,
                  agencyName: agency.shortName || agency.slug,
                  agencyObj: agency
              });
          });
      }
  });

  // 2. Map correlations
  if (correlations) {
      correlations.forEach(corr => {
          allEvents.push({
              amendmentDate: corr.amendmentDate,
              name: corr.description,
              type: "CORRELATION SNAP",
              agencyName: corr.involvedAgencies,
              isCorrelation: true
          });
      });
  }

  // Filter based on parent Dashboard bounds
  if (startDate) {
      const start = new Date(startDate);
      allEvents = allEvents.filter(e => new Date(e.amendmentDate) >= start);
  }
  if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      allEvents = allEvents.filter(e => new Date(e.amendmentDate) <= end);
  }

  // 3. Sort Chronologically
  allEvents.sort((a, b) => new Date(b.amendmentDate) - new Date(a.amendmentDate));

  return (
      <div className="obsidian-panel p-8 mt-8 overflow-hidden">
          <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-6 border-b border-[#424754]/30 pb-4">
              <div>
                  <h3 className="text-xl font-bold text-[#adc6ff]">Collated Regulatory Timeline</h3>
                  <p className="text-sm text-[#7f879a] mt-1">Chronological history across all selected matrix endpoints.</p>
              </div>
          </div>
          
          <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                  <thead>
                      <tr>
                          <th className="py-4 px-4 text-xs font-extrabold text-[#7f879a] uppercase tracking-wider border-b border-[#2d3449] w-32">Date</th>
                          <th className="py-4 px-4 text-xs font-extrabold text-[#7f879a] uppercase tracking-wider border-b border-[#2d3449] w-32">Agency</th>
                          <th className="py-4 px-4 text-xs font-extrabold text-[#7f879a] uppercase tracking-wider border-b border-[#2d3449] w-32">Type</th>
                          <th className="py-4 px-4 text-xs font-extrabold text-[#7f879a] uppercase tracking-wider border-b border-[#2d3449]">Title / Detail</th>
                          <th className="py-4 px-4 text-xs font-extrabold text-[#7f879a] uppercase tracking-wider border-b border-[#2d3449] w-48">Action</th>
                      </tr>
                  </thead>
                  <tbody>
                      {allEvents.length === 0 && (
                          <tr>
                              <td colSpan="5" className="py-8 text-center text-[#7f879a] italic">No historical events found in this date window.</td>
                          </tr>
                      )}
                      {allEvents.map((event, index) => {
                          const isCorr = event.isCorrelation;
                          const isExpanded = isCorr && expandedDate === event.amendmentDate;
                          
                          return (
                              <React.Fragment key={index}>
                                  <tr className={`border-b border-[#2d3449]/50 hover:bg-[#222a3d]/40 transition-colors ${isCorr ? 'border-l-4 border-l-[#4d8eff] bg-[#4d8eff]/5' : ''}`}>
                                      <td className="py-4 px-4 align-top whitespace-nowrap">
                                          <span className={`font-semibold ${isCorr ? 'text-[#adc6ff]' : 'text-[#c2c6d6]'}`}>{event.amendmentDate}</span>
                                      </td>
                                      <td className="py-4 px-4 align-top">
                                          <span className={`px-2 py-1 rounded text-xs font-extrabold tracking-wider ${isCorr ? 'bg-[#adc6ff]/20 text-[#adc6ff]' : 'bg-[#222a3d] text-[#c2c6d6]'}`}>
                                              {event.agencyName}
                                          </span>
                                      </td>
                                      <td className="py-4 px-4 align-top">
                                          <span className={`text-xs font-medium ${isCorr ? 'text-[#ffb786] font-bold' : 'text-[#7f879a] uppercase'}`}>{event.type}</span>
                                      </td>
                                      <td className="py-4 px-4 align-top max-w-md">
                                          <p className={`text-sm ${isCorr ? 'text-[#dae2fd] font-semibold' : 'text-[#c2c6d6] truncate'}`} title={event.name}>{event.name}</p>
                                      </td>
                                      <td className="py-4 px-4 align-top">
                                          {!isCorr ? (
                                            <div className="flex gap-2 w-full">
                                                <Link to={`/data/${event.agencyObj.slug}`} className="text-xs font-bold text-[#4d8eff] hover:text-[#adc6ff] transition-colors uppercase tracking-wider">
                                                    Raw Data
                                                </Link>
                                            </div>
                                          ) : (
                                              <button 
                                                  onClick={() => setExpandedDate(isExpanded ? null : event.amendmentDate)}
                                                  className="text-xs text-[#ffb786] bg-[#ffb786]/20 px-3 py-1.5 rounded hover:bg-[#ffb786]/30 font-bold uppercase tracking-wider transition-all"
                                              >
                                                  {isExpanded ? "Close Matrix" : "Expand Matrix"}
                                              </button>
                                          )}
                                      </td>
                                  </tr>
                                  
                                  {/* Expandable Correlation Row */}
                                  {isExpanded && (
                                      <tr className="bg-[#0b1326]/80 border-b border-[#2d3449]/50">
                                          <td colSpan="5" className="p-0">
                                              <div className="px-12 py-6 border-l-4 border-l-[#ffb786] bg-gradient-to-r from-[#171f33]/80 to-transparent">
                                                  <h4 className="text-xs font-extrabold text-[#7f879a] uppercase tracking-widest mb-4">Correlated Baseline Events ({event.amendmentDate})</h4>
                                                  <div className="grid gap-3">
                                                      {allEvents.filter(e => !e.isCorrelation && e.amendmentDate === event.amendmentDate).map((subEvent, subIdx) => (
                                                          <div key={subIdx} className="flex gap-4 items-center bg-[#131b2e] p-3 rounded-lg border border-[#2d3449]">
                                                              <span className="px-2 py-1 bg-[#222a3d] text-[#adc6ff] rounded text-[0.65rem] font-bold uppercase tracking-widest min-w-[60px] text-center">
                                                                  {subEvent.agencyName}
                                                              </span>
                                                              <span className="text-xs font-bold text-[#c2c6d6] uppercase min-w-[70px]">
                                                                  {subEvent.type}
                                                              </span>
                                                              <p className="text-sm text-[#dae2fd] truncate flex-1">
                                                                  {subEvent.name}
                                                              </p>
                                                          </div>
                                                      ))}
                                                  </div>
                                              </div>
                                          </td>
                                      </tr>
                                  )}
                              </React.Fragment>
                          );
                      })}
                  </tbody>
              </table>
          </div>
      </div>
  );
};

export default TimelineTable;
