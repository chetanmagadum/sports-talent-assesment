import React from 'react';
import {
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Award,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { TestSubmission } from '../../types';

interface HistoryScreenProps {
  submissions: TestSubmission[];
  onSelectSubmission?: (sub: TestSubmission) => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({
  submissions,
  onSelectSubmission,
}) => {
  return (
    <div className="p-4 space-y-4">
      <div>
        <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
          Athlete Dossier
        </span>
        <h2 className="text-base font-bold text-white">Assessment History</h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Chronological record of verified and pending fitness tests.
        </p>
      </div>

      {submissions.length === 0 ? (
        <div className="text-center py-12 text-slate-400 text-xs">
          No tests recorded yet. Start your first test from the Home tab.
        </div>
      ) : (
        <div className="space-y-3">
          {submissions.map((sub) => {
            const isVerified = sub.status === 'verified';
            return (
              <div
                key={sub.id || sub.localId}
                onClick={() => onSelectSubmission && onSelectSubmission(sub)}
                className="bg-slate-900/90 hover:bg-slate-800/80 border border-slate-800 rounded-2xl p-3.5 space-y-2 text-xs transition cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{sub.testName}</span>
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase border ${
                        isVerified
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                      }`}
                    >
                      {isVerified ? 'Verified' : 'Review'}
                    </span>
                  </div>

                  <span className="text-sm font-black text-white">
                    {sub.primaryScore} {sub.primaryUnit}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-800/70 text-[11px] text-slate-400">
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase block">Valid Reps</span>
                    <span className="font-semibold text-emerald-400">{sub.validReps} Clean</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase block">AI Confidence</span>
                    <span className="font-semibold text-slate-200">{Math.round(sub.aiConfidence * 100)}%</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] text-slate-500 uppercase block">Recorded</span>
                    <span className="font-semibold text-slate-300">
                      {new Date(sub.recordedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>

                {sub.coachNotes && (
                  <div className="bg-slate-950 p-2 rounded-xl border border-slate-800 text-[11px] text-slate-300 italic">
                    Scout Note: "{sub.coachNotes}"
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
