import React, { useEffect } from 'react';
import {
  Trophy,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  Share2,
  Flame,
  Info,
  RotateCcw,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AthleteProfile, FitnessTest, TestSubmission } from '../../types';

interface ResultScreenProps {
  athlete: AthleteProfile;
  test: FitnessTest;
  result: {
    primaryScore: number;
    primaryUnit: string;
    validReps: number;
    invalidReps: number;
    durationSeconds: number;
    jumpHeightCm?: number;
    lapTimes?: number[];
    aiConfidence: number;
    authenticityReport: {
      isAuthentic: boolean;
      confidence: number;
      warnings: string[];
      scoreBreakdown: {
        frameIntegrity: number;
        poseContinuity: number;
        biomechanicalValidity: number;
        soloCandidateRating: number;
      };
    };
  };
  onSaveAndReturn: () => void;
  onRetest: () => void;
  isOnline: boolean;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  athlete,
  test,
  result,
  onSaveAndReturn,
  onRetest,
  isOnline,
}) => {
  const benchmark = athlete.gender === 'female' ? test.nationalBenchmarkFemale : test.nationalBenchmarkMale;
  const isBenchmarkMet =
    test.metricType === 'time_seconds'
      ? result.primaryScore <= benchmark
      : result.primaryScore >= benchmark;

  const isVerified = result.authenticityReport.isAuthentic && result.authenticityReport.confidence >= 0.75;

  useEffect(() => {
    if (isBenchmarkMet && isVerified) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10B981', '#34D399', '#FBBF24'],
        });
      } catch {
        // Confetti optional
      }
    }
  }, [isBenchmarkMet, isVerified]);

  return (
    <div className="p-4 space-y-4">
      {/* Top Banner Status */}
      <div
        className={`p-4 rounded-2xl border text-center shadow-lg relative overflow-hidden ${
          isVerified
            ? 'bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-900 border-emerald-500/30'
            : 'bg-gradient-to-br from-amber-950 via-slate-900 to-slate-900 border-amber-500/30'
        }`}
      >
        <div className="flex items-center justify-center mb-2">
          {isVerified ? (
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
          )}
        </div>

        <span
          className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider border ${
            isVerified
              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
              : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
          }`}
        >
          {isVerified ? 'Verified Authentic Assessment' : 'Needs Coach Review'}
        </span>

        <h2 className="text-xl font-black text-white mt-1">{test.name}</h2>
        <p className="text-xs text-slate-400">
          Athlete: <span className="text-slate-200 font-bold">{athlete.fullName}</span> ({athlete.district}, {athlete.state})
        </p>
      </div>

      {/* Main Primary Performance Score Card */}
      <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 shadow-md">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Official Recorded Score
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-4xl font-black text-white">{result.primaryScore}</span>
              <span className="text-sm font-bold text-emerald-400">{result.primaryUnit}</span>
              {test.id === 'vertical_jump' && (
                <span className="text-[10px] text-slate-400 italic ml-1">
                  (Estimated via flight time)
                </span>
              )}
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">
              National Benchmark
            </span>
            <span className="text-base font-bold text-slate-200 mt-0.5 block">
              {benchmark} {test.unit}
            </span>
            <span
              className={`text-[10px] font-bold inline-block px-1.5 py-0.5 rounded mt-0.5 ${
                isBenchmarkMet ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-400 bg-slate-800'
              }`}
            >
              {isBenchmarkMet ? 'Exceeds Benchmark ✓' : 'Developmental Range'}
            </span>
          </div>
        </div>

        {/* Detailed Kinematic Breakdown (Section 8 spec) */}
        <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
          <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80">
            <span className="text-[10px] text-slate-400 uppercase block font-medium">Valid Repetitions</span>
            <span className="text-base font-bold text-emerald-400">{result.validReps} Clean Reps</span>
          </div>

          <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80">
            <span className="text-[10px] text-slate-400 uppercase block font-medium">Invalid Repetitions</span>
            <span className="text-base font-bold text-rose-400">{result.invalidReps} Faults</span>
          </div>

          <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80">
            <span className="text-[10px] text-slate-400 uppercase block font-medium">Test Duration</span>
            <span className="text-sm font-bold text-slate-200 font-mono">{result.durationSeconds}s Recorded</span>
          </div>

          <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80">
            <span className="text-[10px] text-slate-400 uppercase block font-medium">AI Pose Confidence</span>
            <span className="text-sm font-bold text-emerald-400">{Math.round(result.aiConfidence * 100)}%</span>
          </div>
        </div>
      </div>

      {/* Authenticity & Anti-Cheating Report (Section 9 spec) */}
      <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {result.authenticityReport.isAuthentic ? (
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            ) : (
              <ShieldAlert className="w-4 h-4 text-amber-400" />
            )}
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Authenticity Verification
            </h3>
          </div>

          <span
            className={`text-xs font-black ${
              result.authenticityReport.confidence >= 0.8
                ? 'text-emerald-400'
                : 'text-amber-400'
            }`}
          >
            {Math.round(result.authenticityReport.confidence * 100)}% Trust Index
          </span>
        </div>

        {/* Breakdown bars */}
        <div className="space-y-2 text-[11px]">
          <div>
            <div className="flex justify-between text-slate-400 mb-1">
              <span>Frame Rate & Splicing Integrity</span>
              <span className="font-mono text-slate-200">
                {result.authenticityReport.scoreBreakdown.frameIntegrity}%
              </span>
            </div>
            <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full"
                style={{ width: `${result.authenticityReport.scoreBreakdown.frameIntegrity}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-slate-400 mb-1">
              <span>Solo Athlete Isolation (No Multiple Bodies)</span>
              <span className="font-mono text-slate-200">
                {result.authenticityReport.scoreBreakdown.soloCandidateRating}%
              </span>
            </div>
            <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full"
                style={{ width: `${result.authenticityReport.scoreBreakdown.soloCandidateRating}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-slate-400 mb-1">
              <span>Biomechanical Velocity Plausibility</span>
              <span className="font-mono text-slate-200">
                {result.authenticityReport.scoreBreakdown.biomechanicalValidity}%
              </span>
            </div>
            <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full"
                style={{ width: `${result.authenticityReport.scoreBreakdown.biomechanicalValidity}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Warnings list if any */}
        {result.authenticityReport.warnings.length > 0 && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-2.5 text-[11px] text-amber-300 space-y-1">
            <span className="font-bold flex items-center gap-1 text-amber-400">
              <AlertTriangle className="w-3.5 h-3.5" />
              Automated Audit Flags:
            </span>
            <ul className="list-disc list-inside space-y-0.5 text-amber-200/90">
              {result.authenticityReport.warnings.map((w, idx) => (
                <li key={idx}>{w}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Primary Action Buttons */}
      <div className="pt-2 space-y-2">
        <button
          onClick={onSaveAndReturn}
          className="w-full bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-slate-950 font-black py-3.5 px-6 rounded-2xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition"
        >
          <CheckCircle2 className="w-4 h-4 fill-slate-950" />
          <span>{isOnline ? 'Save & Synchronize to Cloud' : 'Save to Offline Local Database'}</span>
        </button>

        <button
          onClick={onRetest}
          className="w-full bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 border border-slate-800 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Discard & Re-test Protocol</span>
        </button>
      </div>
    </div>
  );
};
