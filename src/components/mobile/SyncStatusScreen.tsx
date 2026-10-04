import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  RefreshCw,
  AlertTriangle,
  Wifi,
  WifiOff,
  Radio,
  FileVideo,
  ArrowRight,
} from 'lucide-react';
import { TestSubmission, NetworkCondition, SyncStatus } from '../../types';

interface SyncStatusScreenProps {
  submissions: TestSubmission[];
  networkCondition: NetworkCondition;
  onSyncAll: () => Promise<void>;
  isSyncing: boolean;
}

export const SyncStatusScreen: React.FC<SyncStatusScreenProps> = ({
  submissions,
  networkCondition,
  onSyncAll,
  isSyncing,
}) => {
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  const pendingItems = submissions.filter(
    s => s.syncStatus === 'pending' || s.syncStatus === 'retry' || s.syncStatus === 'failed'
  );
  const syncedItems = submissions.filter(s => s.syncStatus === 'synced');

  const handleSyncClick = async () => {
    try {
      setSyncFeedback('Initiating offline store-and-forward batch sync...');
      await onSyncAll();
      setSyncFeedback('All offline assessments successfully synchronized to cloud database!');
      setTimeout(() => setSyncFeedback(null), 4000);
    } catch (err: any) {
      setSyncFeedback(err.message || 'Sync failed. Check connection.');
    }
  };

  const getStatusBadge = (status: SyncStatus) => {
    switch (status) {
      case 'synced':
        return (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            SYNCED
          </span>
        );
      case 'uploading':
        return (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-bold border border-blue-500/30 flex items-center gap-1">
            <RefreshCw className="w-3 h-3 animate-spin" />
            UPLOADING
          </span>
        );
      case 'pending':
        return (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            PENDING
          </span>
        );
      case 'retry':
      case 'failed':
        return (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            RETRY
          </span>
        );
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* Top Header */}
      <div>
        <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
          Offline Store-and-Forward
        </span>
        <h2 className="text-base font-bold text-white">Synchronization Manager</h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Local SQLite buffer manages test uploads when internet becomes accessible.
        </p>
      </div>

      {/* Network Connection Status Card */}
      <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300">Connection Status</span>
          <div className="flex items-center gap-1.5">
            {networkCondition === 'online' && (
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <Wifi className="w-3.5 h-3.5" /> Online (High-Speed)
              </span>
            )}
            {networkCondition === 'slow2g' && (
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                <Radio className="w-3.5 h-3.5 animate-pulse" /> Rural 2G Edge
              </span>
            )}
            {networkCondition === 'offline' && (
              <span className="text-xs font-bold text-rose-400 flex items-center gap-1">
                <WifiOff className="w-3.5 h-3.5" /> Offline (Zero Signal)
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-center text-xs">
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Pending Queue</span>
            <span className="text-lg font-black text-amber-400">{pendingItems.length}</span>
          </div>
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Synced to Cloud</span>
            <span className="text-lg font-black text-emerald-400">{syncedItems.length}</span>
          </div>
        </div>

        {/* Sync Action Button */}
        <button
          onClick={handleSyncClick}
          disabled={isSyncing || networkCondition === 'offline' || pendingItems.length === 0}
          className={`w-full py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition ${
            networkCondition === 'offline' || pendingItems.length === 0
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20 active:scale-[0.98]'
          }`}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>
            {networkCondition === 'offline'
              ? 'Connect Internet to Sync'
              : pendingItems.length === 0
              ? 'All Local Data Synchronized'
              : `Synchronize ${pendingItems.length} Pending Test${pendingItems.length > 1 ? 's' : ''}`}
          </span>
        </button>

        {syncFeedback && (
          <p className="text-[11px] text-emerald-400 text-center font-medium bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
            {syncFeedback}
          </p>
        )}
      </div>

      {/* Pending Items Queue */}
      {pendingItems.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Pending Upload Queue ({pendingItems.length})
            </h3>
            <span className="text-[10px] text-amber-400 font-semibold">Local Storage</span>
          </div>

          <div className="space-y-2">
            {pendingItems.map((item) => (
              <div
                key={item.id || item.localId}
                className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">{item.testName}</span>
                  {getStatusBadge(isSyncing ? 'uploading' : item.syncStatus)}
                </div>

                <div className="flex items-center justify-between text-slate-400 text-[11px]">
                  <span>Score: <strong className="text-slate-200">{item.primaryScore} {item.primaryUnit}</strong></span>
                  <span>Recorded: {new Date(item.recordedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>

                <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                  <FileVideo className="w-3 h-3 text-slate-400" />
                  <span className="truncate">Local buffer: /storage/emulated/0/sports_talent/{item.testId}_compressed.mp4</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Successfully Synced Cloud Records */}
      <div className="space-y-2 pt-2">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider">
          Synchronized Cloud Archives ({syncedItems.length})
        </h3>

        <div className="space-y-2">
          {syncedItems.map((item) => (
            <div
              key={item.id}
              className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between text-xs"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-200">{item.testName}</span>
                  {getStatusBadge('synced')}
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Synced: {item.syncedAt ? new Date(item.syncedAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Verified'}
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-white">{item.primaryScore} {item.primaryUnit}</span>
                <span className="text-[10px] text-emerald-400 block font-semibold">
                  {Math.round(item.authenticityConfidence * 100)}% Trust
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
