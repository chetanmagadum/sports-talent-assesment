import React from 'react';
import {
  ArrowLeft,
  Camera,
  CheckCircle,
  AlertCircle,
  Smartphone,
  Play,
  Volume2,
  ShieldCheck,
  Eye,
} from 'lucide-react';
import { FitnessTest } from '../../types';

interface TestInstructionsModalProps {
  test: FitnessTest;
  onBack: () => void;
  onStartRecording: () => void;
}

export const TestInstructionsModal: React.FC<TestInstructionsModalProps> = ({
  test,
  onBack,
  onStartRecording,
}) => {
  return (
    <div className="p-4 space-y-4">
      {/* Top Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
            Test Protocol
          </span>
          <h2 className="text-base font-bold text-white">{test.name}</h2>
        </div>
      </div>

      {/* Camera Placement Graphic Card */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
            <Camera className="w-4 h-4" />
            <span>Smartphone Setup Guidelines</span>
          </div>
          <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded-full text-slate-300">
            Landscape Required
          </span>
        </div>

        {/* Visual Camera Distance Diagram */}
        <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800/80 flex items-center justify-between text-center relative overflow-hidden">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-1">
              <Smartphone className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-slate-300">Phone (Horizontal)</span>
            <span className="text-[9px] text-slate-500">Waist Height</span>
          </div>

          <div className="flex-1 px-3 flex flex-col items-center">
            <span className="text-[11px] font-mono text-emerald-400 font-bold">2.5 Meters</span>
            <div className="w-full flex items-center justify-center my-1">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <div className="flex-1 h-0.5 bg-dashed border-b border-dashed border-emerald-500/50"></div>
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            </div>
            <span className="text-[9px] text-slate-400">Perpendicular Profile</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 mb-1">
              <Eye className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-slate-300">Athlete</span>
            <span className="text-[9px] text-slate-500">Full Body View</span>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          {test.cameraPlacement}
        </p>
      </div>

      {/* Biomechanical Execution Instructions */}
      <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 space-y-3">
        <h3 className="text-xs font-bold text-white flex items-center gap-1.5 uppercase tracking-wider">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>Execution Instructions</span>
        </h3>

        <ul className="space-y-2 text-xs text-slate-300">
          {test.instructions.map((step, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 text-emerald-400 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* AI Authenticity & Anti-Cheating Advisory */}
      <div className="bg-slate-900/60 rounded-2xl p-3.5 border border-slate-800 space-y-2 text-xs">
        <div className="flex items-center gap-2 text-amber-400 font-bold">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span>Automated Authenticity Checks</span>
        </div>
        <p className="text-slate-400 text-[11px] leading-relaxed">
          The AI system verifies continuous video frames, solo athlete presence, and natural kinematic speeds. Any camera obstruction or multiple individuals in frame will mark test for coach manual review.
        </p>
      </div>

      {/* Audio Guidance Announcement */}
      <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 rounded-xl p-2.5 text-xs">
        <Volume2 className="w-4 h-4 shrink-0 text-emerald-400" />
        <span>Audio beeps will cue 3-2-1 countdown and confirmed rep counts!</span>
      </div>

      {/* Start Button */}
      <div className="pt-2">
        <button
          onClick={onStartRecording}
          className="w-full bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-slate-950 font-black py-3.5 px-6 rounded-2xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition"
        >
          <Play className="w-4 h-4 fill-slate-950" />
          <span>Start Camera & Record Test</span>
        </button>
      </div>
    </div>
  );
};
