import React from 'react';
import {
  Smartphone,
  LayoutDashboard,
  Code2,
  Wifi,
  WifiOff,
  Radio,
  Zap,
  ShieldAlert,
  RefreshCw,
} from 'lucide-react';
import { NetworkCondition } from '../../types';

interface TopNavigationBarProps {
  currentTab: 'mobile' | 'admin' | 'code';
  setCurrentTab: (tab: 'mobile' | 'admin' | 'code') => void;
  networkCondition: NetworkCondition;
  setNetworkCondition: (condition: NetworkCondition) => void;
  pendingSyncCount: number;
  onSyncNow: () => void;
  isSyncing: boolean;
  onTriggerTamperDemo: () => void;
  isPhoneFrame: boolean;
  setIsPhoneFrame: (val: boolean) => void;
}

export const TopNavigationBar: React.FC<TopNavigationBarProps> = ({
  currentTab,
  setCurrentTab,
  networkCondition,
  setNetworkCondition,
  pendingSyncCount,
  onSyncNow,
  isSyncing,
  onTriggerTamperDemo,
  isPhoneFrame,
  setIsPhoneFrame,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 py-2.5 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand & Project Title */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-slate-950 font-black text-xl">
              <Zap className="w-5 h-5 text-slate-950 fill-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white tracking-tight text-base sm:text-lg">
                  SportsTalent<span className="text-emerald-400">AI</span>
                </span>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  College Prototype
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Democratizing Grassroots Sports Assessment with Computer Vision
              </p>
            </div>
          </div>

          {/* Mobile frame toggle button on smaller screens */}
          {currentTab === 'mobile' && (
            <button
              onClick={() => setIsPhoneFrame(!isPhoneFrame)}
              className="md:hidden text-xs bg-slate-800 text-slate-300 px-2.5 py-1.5 rounded-lg border border-slate-700"
            >
              {isPhoneFrame ? 'Expand' : 'Phone'}
            </button>
          )}
        </div>

        {/* Center: Main Navigation Tabs */}
        <div className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setCurrentTab('mobile')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              currentTab === 'mobile'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Mobile App</span>
          </button>

          <button
            onClick={() => setCurrentTab('admin')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              currentTab === 'admin'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Scout / Admin Portal</span>
          </button>

          <button
            onClick={() => setCurrentTab('code')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              currentTab === 'code'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Codebase</span>
          </button>
        </div>

        {/* Right Tools: Network Simulator & Demo Actions */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          {/* Phone Frame Toggle (Desktop) */}
          {currentTab === 'mobile' && (
            <button
              onClick={() => setIsPhoneFrame(!isPhoneFrame)}
              title="Toggle between realistic smartphone frame and expanded full view"
              className="hidden md:flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1.5 rounded-lg border border-slate-700 transition"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isPhoneFrame ? 'Full View' : 'Phone Frame'}</span>
            </button>
          )}

          {/* Network Simulator Selector */}
          <div className="flex items-center bg-slate-950 rounded-lg border border-slate-800 p-0.5 text-xs">
            <button
              onClick={() => setNetworkCondition('online')}
              className={`flex items-center gap-1 px-2 py-1 rounded transition ${
                networkCondition === 'online'
                  ? 'bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Standard 4G/Broadband network"
            >
              <Wifi className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Online</span>
            </button>

            <button
              onClick={() => setNetworkCondition('slow2g')}
              className={`flex items-center gap-1 px-2 py-1 rounded transition ${
                networkCondition === 'slow2g'
                  ? 'bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Rural 2G edge network with packet latency"
            >
              <Radio className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">2G</span>
            </button>

            <button
              onClick={() => setNetworkCondition('offline')}
              className={`flex items-center gap-1 px-2 py-1 rounded transition ${
                networkCondition === 'offline'
                  ? 'bg-red-500/20 text-red-400 font-bold border border-red-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Zero connectivity (Offline store-and-forward mode)"
            >
              <WifiOff className="w-3.5 h-3.5 text-red-400" />
              <span className="hidden sm:inline">Offline</span>
            </button>
          </div>

          {/* Pending Sync Badge & Trigger */}
          {pendingSyncCount > 0 && (
            <button
              onClick={onSyncNow}
              disabled={isSyncing || networkCondition === 'offline'}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-sm ${
                networkCondition === 'offline'
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold'
              }`}
              title="Sync offline submissions to central cloud"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>Sync ({pendingSyncCount})</span>
            </button>
          )}

          {/* Quick Cheating Test Button */}
          <button
            onClick={onTriggerTamperDemo}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition"
            title="Demonstrate AI Authenticity / Cheating Detection flags"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline">Test Cheating Alert</span>
          </button>
        </div>
      </div>
    </header>
  );
};
