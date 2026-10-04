import React, { useEffect, useState } from 'react';
import {
  Cpu,
  CheckCircle2,
  Activity,
  ShieldCheck,
  FileCheck,
  Loader2,
} from 'lucide-react';
import { FitnessTest } from '../../types';

interface ProcessingScreenProps {
  test: FitnessTest;
  onAnalysisFinished: () => void;
}

export const ProcessingScreen: React.FC<ProcessingScreenProps> = ({
  test,
  onAnalysisFinished,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps = [
    {
      title: 'Extracting 33 Human Pose Landmarks',
      desc: 'Normalizing joint coordinates and spatial depth via MediaPipe Pose model',
      icon: Activity,
    },
    {
      title: 'Computing Biomechanical Kinematics',
      desc: 'Calculating trunk flexion angles, joint velocities, and flight time curves',
      icon: Cpu,
    },
    {
      title: 'Repetition & Motion State Machine Audit',
      desc: 'Validating complete range-of-motion cycles and detecting technical faults',
      icon: FileCheck,
    },
    {
      title: 'Anti-Cheating & Authenticity Verification',
      desc: 'Auditing frame rate continuity, solo candidate isolation, and physical speed limits',
      icon: ShieldCheck,
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(timer);
          setTimeout(() => {
            onAnalysisFinished();
          }, 600);
          return prev;
        }
      });
    }, 700);

    return () => clearInterval(timer);
  }, [onAnalysisFinished, steps.length]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] p-6 text-center select-none">
      {/* Central Pulsing AI Engine Visualizer */}
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center animate-pulse">
          <Cpu className="w-12 h-12 text-emerald-400 animate-spin" style={{ animationDuration: '6s' }} />
        </div>
        <div className="absolute -inset-2 rounded-full border border-emerald-500/20 animate-ping" style={{ animationDuration: '2s' }}></div>
      </div>

      <h2 className="text-lg font-black text-white tracking-tight">
        AI Computer Vision Analysis
      </h2>
      <p className="text-xs text-slate-400 mt-1 max-w-[280px]">
        Processing standardized kinematics for <span className="text-emerald-400 font-bold">{test.name}</span>
      </p>

      {/* Progress Checklist Steps */}
      <div className="w-full max-w-sm mt-8 space-y-3 text-left">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isDone = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;

          return (
            <div
              key={idx}
              className={`p-3 rounded-2xl border transition-all ${
                isCurrent
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300 shadow-md'
                  : isDone
                  ? 'bg-slate-900/60 border-slate-800 text-slate-300'
                  : 'bg-slate-950 border-slate-900 text-slate-600 opacity-60'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                    isDone
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : isCurrent
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-slate-800 text-slate-600'
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : isCurrent ? (
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold leading-tight truncate">{step.title}</h4>
                    {isDone && <span className="text-[10px] font-bold text-emerald-400">PASSED</span>}
                  </div>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5">{step.desc}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
