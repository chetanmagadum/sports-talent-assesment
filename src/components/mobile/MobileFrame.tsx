import React, { useState, useEffect } from 'react';
import {
  Wifi,
  WifiOff,
  BatteryCharging,
  Home,
  Activity,
  History,
  RefreshCw,
  User,
  Radio,
} from 'lucide-react';
import { NetworkCondition } from '../../types';

interface MobileFrameProps {
  children: React.ReactNode;
  activeNav: 'home' | 'tests' | 'history' | 'sync' | 'profile';
  setActiveNav: (nav: 'home' | 'tests' | 'history' | 'sync' | 'profile') => void;
  networkCondition: NetworkCondition;
  pendingSyncCount: number;
  isPhoneFrame: boolean;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({
  children,
  activeNav,
  setActiveNav,
  networkCondition,
  pendingSyncCount,
  isPhoneFrame,
}) => {
  const [time, setTime] = useState('09:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const content = (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 overflow-hidden relative font-sans select-none">
      {/* Dynamic Mobile Status Bar */}
      <div className="h-10 bg-slate-900/90 backdrop-blur-md px-5 flex items-center justify-between text-[13px] font-semibold text-slate-300 z-30 shrink-0 border-b border-slate-800/60">
        <span>{time}</span>

        {/* Dynamic Notch Speaker / Front Cam */}
        {isPhoneFrame && (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-950 rounded-full border border-slate-800">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-700"></div>
            <div className="w-12 h-1.5 bg-slate-800 rounded-full"></div>
          </div>
        )}

        {/* Status Icons */}
        <div className="flex items-center gap-2">
          {networkCondition === 'online' && <Wifi className="w-3.5 h-3.5 text-emerald-400" />}
          {networkCondition === 'slow2g' && <Radio className="w-3.5 h-3.5 text-amber-400 animate-pulse" />}
          {networkCondition === 'offline' && <WifiOff className="w-3.5 h-3.5 text-rose-400" />}
          <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
            <span>92%</span>
            <BatteryCharging className="w-4 h-4 text-emerald-400" />
          </div>
        </div>
      </div>

      {/* Main Scrollable Screen Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden relative scrollbar-thin scrollbar-thumb-slate-800">
        {children}
      </div>

      {/* Rural-Optimized Bottom Navigation Bar */}
      <div className="h-16 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 px-3 flex items-center justify-around z-30 shrink-0 shadow-lg">
        <button
          onClick={() => setActiveNav('home')}
          className={`flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-xl transition ${
            activeNav === 'home' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[11px]">Home</span>
        </button>

        <button
          onClick={() => setActiveNav('tests')}
          className={`flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-xl transition ${
            activeNav === 'tests' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Activity className="w-5 h-5" />
          <span className="text-[11px]">Tests</span>
        </button>

        <button
          onClick={() => setActiveNav('history')}
          className={`flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-xl transition ${
            activeNav === 'history' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <History className="w-5 h-5" />
          <span className="text-[11px]">History</span>
        </button>

        <button
          onClick={() => setActiveNav('sync')}
          className={`flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-xl relative transition ${
            activeNav === 'sync' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <RefreshCw className="w-5 h-5" />
          <span className="text-[11px]">Sync</span>
          {pendingSyncCount > 0 && (
            <span className="absolute top-0 right-2 w-4 h-4 bg-amber-500 text-slate-950 font-black text-[9px] rounded-full flex items-center justify-center">
              {pendingSyncCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveNav('profile')}
          className={`flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-xl transition ${
            activeNav === 'profile' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[11px]">Profile</span>
        </button>
      </div>

      {/* Home Indicator Bar */}
      <div className="h-4 bg-slate-900 flex items-center justify-center shrink-0">
        <div className="w-28 h-1 bg-slate-700 rounded-full"></div>
      </div>
    </div>
  );

  if (!isPhoneFrame) {
    return (
      <div className="max-w-2xl mx-auto my-4 bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden min-h-[720px] flex flex-col">
        {content}
      </div>
    );
  }

  return (
    <div className="py-4 flex items-center justify-center">
      {/* Smartphone Outer Chassis with Realistic Curves and Bevel */}
      <div className="w-[390px] h-[820px] bg-slate-900 rounded-[50px] p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] border-[5px] border-slate-800 relative flex flex-col ring-1 ring-slate-700/50">
        {/* Physical Button Accents */}
        <div className="absolute -left-[9px] top-28 w-1 h-10 bg-slate-700 rounded-l-md"></div>
        <div className="absolute -left-[9px] top-42 w-1 h-12 bg-slate-700 rounded-l-md"></div>
        <div className="absolute -right-[9px] top-36 w-1 h-14 bg-slate-700 rounded-r-md"></div>

        {/* Screen Bezel and Inner Glass */}
        <div className="w-full h-full rounded-[40px] overflow-hidden border border-slate-800 relative">
          {content}
        </div>
      </div>
    </div>
  );
};
