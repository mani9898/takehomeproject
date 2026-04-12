import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const EventDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { event, agency } = location.state || {};

  if (!event) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-xl text-white font-semibold">Event Not Found</div>
        <button onClick={() => navigate('/')} className="ml-4 px-4 py-2 bg-indigo-600 rounded-lg text-white hover:bg-indigo-700">Go Back</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 p-8 text-slate-100 font-sans">
      <div className="max-w-4xl mx-auto backdrop-blur-xl bg-slate-800/50 border border-slate-700/50 p-8 rounded-2xl shadow-2xl">
        <button 
          onClick={() => navigate(-1)}
          className="mb-6 flex flex-row items-center space-x-2 text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          <span>Back to Dashboard</span>
        </button>

        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent mb-2">
          Regulatory Event Details
        </h1>
        <p className="text-slate-400 mb-8 font-medium tracking-wide border-b border-slate-700/50 pb-4">
          Agency: {agency?.name} ({agency?.shortName || agency?.slug})
        </p>

        <div className="space-y-6">
          <div className="flex flex-col bg-slate-900/50 p-6 rounded-xl border border-slate-700/30">
             <span className="text-sm text-slate-400 uppercase tracking-wider font-semibold mb-1">Regulation Section Name</span>
             <span className="text-2xl font-bold text-white">{event.name || "N/A"}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col bg-slate-900/50 p-6 rounded-xl border border-slate-700/30">
               <span className="text-sm text-slate-400 uppercase tracking-wider font-semibold mb-1">Amendment Date</span>
               <span className="text-xl font-bold text-emerald-400">{event.amendmentDate}</span>
            </div>
            <div className="flex flex-col bg-slate-900/50 p-6 rounded-xl border border-slate-700/30">
               <span className="text-sm text-slate-400 uppercase tracking-wider font-semibold mb-1">Published Issue Date</span>
               <span className="text-xl font-bold text-emerald-500">{event.issueDate || 'Unknown'}</span>
            </div>
            <div className="flex flex-col bg-slate-900/50 p-6 rounded-xl border border-slate-700/30">
               <span className="text-sm text-slate-400 uppercase tracking-wider font-semibold mb-1">Rule Type</span>
               <span className="text-xl font-bold text-indigo-400">{event.type || 'Standard'}</span>
            </div>
            <div className="flex flex-col bg-slate-900/50 p-6 rounded-xl border border-slate-700/30">
               <span className="text-sm text-slate-400 uppercase tracking-wider font-semibold mb-1">Internal Identifier</span>
               <span className="text-xl font-bold text-indigo-400">{event.identifier || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
