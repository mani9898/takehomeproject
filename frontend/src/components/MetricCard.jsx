import React from 'react';

const MetricCard = ({ title, value, icon, subtext, color = "blue", status = "normal", onClick }) => {
    
    // Status colors mapped to deep dark mode equivalents
    const statusMap = {
        normal: 'bg-[#4d8eff]/10 text-[#adc6ff]',
        warning: 'bg-[#ffb786]/10 text-[#ffb786]',
        success: 'bg-[#10b981]/10 text-[#6ee7b7]'
    };

    const isClickable = !!onClick;

    return (
        <div 
            onClick={onClick}
            className={`obsidian-panel p-6 flex flex-col justify-between hover:-translate-y-1 transition-all ${isClickable ? 'cursor-pointer hover:border-[#ffb786]/50 hover:shadow-[0_15px_40px_rgba(255,183,134,0.15)] ring-1 ring-transparent hover:ring-[#ffb786]/30' : 'cursor-default'}`}
        >
            <div className="flex justify-between items-start mb-4">
                <h4 className="text-[0.68rem] font-extrabold tracking-[0.18em] uppercase text-[#7f879a]">{title}</h4>
                <div className={`p-2 rounded-lg ${statusMap[status]}`}>
                    {icon}
                </div>
            </div>
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-[#dae2fd]">{value}</h2>
                {subtext && <p className="text-xs font-semibold mt-2 text-[#c2c6d6]">{subtext}</p>}
                {isClickable && <p className="text-[0.55rem] font-extrabold uppercase tracking-widest text-[#ffb786] mt-2 animate-pulse">Click to View</p>}
            </div>
        </div>
    );
};

export default MetricCard;
