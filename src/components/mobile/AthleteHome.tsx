import React from 'react';
import {
  Trophy,
  ArrowRight,
  Flame,
  CheckCircle2,
  AlertTriangle,
  Volume2,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { AthleteProfile, FitnessTest, TestSubmission } from '../../types';

interface AthleteHomeProps {
  athlete: AthleteProfile;
  tests: FitnessTest[];
  submissions: TestSubmission[];
  onSelectTest: (test: FitnessTest) => void;
  onNavigateToSync: () => void;
  pendingSyncCount: number;
}

export const AthleteHome: React.FC<AthleteHomeProps> = ({
  athlete,
  tests,
  submissions,
  onSelectTest,
  onNavigateToSync,
  pendingSyncCount,
}) => {
  const verifiedCount = submissions.filter(s => s.status === 'verified').length;
  const recentSubmissions = submissions.slice(0, 3);

  return (
    <div className="p-4 space-y-4">
      {/* Athlete Identity Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 p-4 rounded-2xl border border-slate-800 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
        <div className="flex items-center gap-3 relative z-10">
          <div className="relative">
            <img
              src={athlete.profileImageUrl}
              alt={athlete.fullName}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500/40 shadow-inner"
            />
            {athlete.aadhaarVerified && (
              <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-slate-950 p-0.5 rounded-full" title="Aadhaar ID Verified">
                <CheckCircle2 className="w-3.5 h-3.5 fill-emerald-500 text-slate-950" />
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h2 className="text-base font-bold text-white truncate">{athlete.fullName}</h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                Talent Tier-1
              </span>
            </div>
            <p className="text-xs text-slate-400 truncate">
              {athlete.district}, {athlete.state} • Age {athlete.age}
            </p>
            <p className="text-[11px] text-emerald-400/90 font-medium truncate mt-0.5">
              Target: {athlete.preferredSport}
            </p>
          </div>
        </div>

        {/* Quick Athlete Stats */}
        <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-800/80 text-center">
          <div className="bg-slate-950/60 rounded-xl p-2 border border-slate-800/60">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Tests Done</span>
            <span className="text-sm font-bold text-white">{submissions.length}</span>
          </div>
          <div className="bg-slate-950/60 rounded-xl p-2 border border-slate-800/60">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Verified</span>
            <span className="text-sm font-bold text-emerald-400">{verifiedCount}</span>
          </div>
          <div className="bg-slate-950/60 rounded-xl p-2 border border-slate-800/60">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Scout Radar</span>
            <span className="text-sm font-bold text-amber-400 flex items-center justify-center gap-0.5">
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              Top 8%
            </span>
          </div>
        </div>
      </div>

      {/* Offline Pending Sync Warning Banner */}
      {pendingSyncCount > 0 && (
        <div
          onClick={onNavigateToSync}
          className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-3 flex items-center justify-between gap-3 cursor-pointer hover:bg-amber-500/15 transition"
        >
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/20 rounded-xl text-amber-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-300">
                {pendingSyncCount} test saved offline on this phone
              </p>
              <p className="text-[11px] text-amber-400/80">
                Tap to sync with national sports database
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-amber-400 bg-amber-500/20 px-2 py-1 rounded-lg">
            Review
          </span>
        </div>
      )}

      {/* Featured Primary Fitness Assessment Button */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-4 text-white shadow-lg shadow-emerald-900/30 relative overflow-hidden">
        <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-15">
          <Trophy className="w-32 h-32" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-1.5 text-emerald-200 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            Standardized Protocol
          </div>
          <h3 className="text-lg font-black tracking-tight leading-snug">
            1-Minute Abdominal Sit-ups
          </h3>
          <p className="text-xs text-emerald-100/90 mt-1 max-w-[240px]">
            AI computer vision tracks knee-to-elbow torso flexion and posture integrity.
          </p>

          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={() => {
                const situpTest = tests.find(t => t.id === 'sit_ups') || tests[0];
                onSelectTest(situpTest);
              }}
              className="bg-white text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md hover:bg-emerald-50 transition active:scale-95"
            >
              <span>Record Test</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <div className="flex items-center gap-1 text-[11px] text-emerald-100 bg-emerald-700/50 px-2.5 py-2 rounded-xl backdrop-blur-sm">
              <Volume2 className="w-3.5 h-3.5" />
              <span>Voice Guidance Ready</span>
            </div>
          </div>
        </div>
      </div>

      {/* Standardized Tests List */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="text-sm font-bold text-white">All Fitness Protocols</h3>
          <span className="text-[11px] text-slate-400">4 Approved Tests</span>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {tests.map(test => {
            const benchmark = athlete.gender === 'female' ? test.nationalBenchmarkFemale : test.nationalBenchmarkMale;
            return (
              <div
                key={test.id}
                onClick={() => onSelectTest(test)}
                className="bg-slate-900/90 hover:bg-slate-800/80 border border-slate-800 rounded-2xl p-3 flex items-center justify-between gap-3 cursor-pointer transition active:scale-[0.98]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-emerald-400 border border-slate-700 font-bold text-sm">
                    {test.id === 'sit_ups' && 'ST'}
                    {test.id === 'vertical_jump' && 'VJ'}
                    {test.id === 'shuttle_run' && 'SR'}
                    {test.id === 'endurance_run' && 'ER'}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{test.name}</h4>
                    <p className="text-[11px] text-slate-400">{test.category}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[10px] text-emerald-400 font-medium">
                        Target: {benchmark} {test.unit}
                      </span>
                      <span className="text-slate-600 text-[10px]">•</span>
                      <span className="text-[10px] text-slate-400">{test.durationSeconds}s duration</span>
                    </div>
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-slate-800 text-slate-400">
                  <ArrowRight className="w-4 h-4 text-emerald-400" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Test History */}
      {recentSubmissions.length > 0 && (
        <div className="pt-2">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-white">Recent Records</h3>
            <span className="text-[11px] text-emerald-400 font-semibold">Verified Log</span>
          </div>

          <div className="space-y-2">
            {recentSubmissions.map(sub => (
              <div
                key={sub.id}
                className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-200">{sub.testName}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                      sub.status === 'verified'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {sub.status === 'verified' ? 'Verified' : 'Needs Review'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(sub.recordedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                    <span>•</span>
                    <span className="text-emerald-400 font-semibold">AI Conf: {Math.round(sub.aiConfidence * 100)}%</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-black text-white">
                    {sub.primaryScore} {sub.primaryUnit}
                  </span>
                  <p className="text-[10px] text-slate-400 font-mono">
                    {sub.syncStatus.toUpperCase()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
