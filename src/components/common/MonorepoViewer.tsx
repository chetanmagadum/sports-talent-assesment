import React, { useState } from 'react';
import {
  FolderTree,
  FileCode,
  Copy,
  Check,
  Smartphone,
  Server,
  Database,
  BookOpen,
} from 'lucide-react';

export const MonorepoViewer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<string>('mobile/lib/ai/situp_analyzer.dart');
  const [copied, setCopied] = useState(false);

  const files: Record<string, { category: 'mobile' | 'backend' | 'database' | 'docs'; language: string; content: string }> = {
    'mobile/lib/main.dart': {
      category: 'mobile',
      language: 'dart',
      content: `// Flutter Application Entry Point for Sports Talent Assessment
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const SportsTalentApp());
}

class SportsTalentApp extends StatelessWidget {
  const SportsTalentApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Sports Talent AI',
      theme: ThemeData.dark().copyWith(
        primaryColor: const Color(0xFF10B981),
        scaffoldBackgroundColor: const Color(0xFF0F172A),
      ),
      home: const AthleteDashboardScreen(),
    );
  }
}`
    },
    'mobile/lib/ai/pose_processor.dart': {
      category: 'mobile',
      language: 'dart',
      content: `// Standardized Base Pose Processor Interface
import 'dart:math';

class LandmarkPoint {
  final double x;
  final double y;
  final double z;
  final double confidence;

  LandmarkPoint({required this.x, required this.y, this.z = 0.0, required this.confidence});
}

abstract class PoseProcessor {
  Map<String, double> calculateAngles(Map<String, LandmarkPoint> landmarks);
  void processFrame({required Map<String, LandmarkPoint> landmarks, required double timestampSeconds});
  Map<String, dynamic> calculateMetrics();
  double generateConfidence();
  void reset();

  static double computeJointAngle(LandmarkPoint a, LandmarkPoint b, LandmarkPoint c) {
    final v1x = a.x - b.x; final v1y = a.y - b.y;
    final v2x = c.x - b.x; final v2y = c.y - b.y;
    final dot = (v1x * v2x) + (v1y * v2y);
    final mag1 = sqrt(v1x * v1x + v1y * v1y);
    final mag2 = sqrt(v2x * v2x + v2y * v2y);
    if (mag1 == 0 || mag2 == 0) return 0.0;
    return acos((dot / (mag1 * mag2)).clamp(-1.0, 1.0)) * (180.0 / pi);
  }
}`
    },
    'mobile/lib/ai/situp_analyzer.dart': {
      category: 'mobile',
      language: 'dart',
      content: `// Sit-Up Repetition Counter Finite State Machine
import 'pose_processor.dart';

enum SitUpState { lyingDown, ascending, peakFlexion, descending }

class SitUpAnalyzer extends PoseProcessor {
  SitUpState _currentState = SitUpState.lyingDown;
  int _validReps = 0;
  int _invalidReps = 0;
  double _minAngleInCurrentRep = 180.0;

  static const double downAngleThreshold = 135.0; // Torso flat on mat
  static const double upAngleThreshold = 65.0;     // Full sit-up flexion reaching knees

  @override
  Map<String, double> calculateAngles(Map<String, LandmarkPoint> landmarks) {
    final shoulder = landmarks['right_shoulder'] ?? landmarks['left_shoulder'];
    final hip = landmarks['right_hip'] ?? landmarks['left_hip'];
    final knee = landmarks['right_knee'] ?? landmarks['left_knee'];
    if (shoulder == null || hip == null || knee == null) return {'trunk_hip_angle': -1.0};
    return {'trunk_hip_angle': PoseProcessor.computeJointAngle(shoulder, hip, knee)};
  }

  @override
  void processFrame({required Map<String, LandmarkPoint> landmarks, required double timestampSeconds}) {
    final trunkAngle = calculateAngles(landmarks)['trunk_hip_angle'] ?? -1.0;
    if (trunkAngle < 0) return;

    if (trunkAngle < _minAngleInCurrentRep) _minAngleInCurrentRep = trunkAngle;

    switch (_currentState) {
      case SitUpState.lyingDown:
        if (trunkAngle < downAngleThreshold - 15.0) _currentState = SitUpState.ascending;
        break;
      case SitUpState.ascending:
        if (trunkAngle <= upAngleThreshold) {
          _currentState = SitUpState.peakFlexion;
        } else if (trunkAngle > downAngleThreshold) {
          _invalidReps++;
          _currentState = SitUpState.lyingDown;
          _minAngleInCurrentRep = 180.0;
        }
        break;
      case SitUpState.peakFlexion:
        if (trunkAngle > upAngleThreshold + 15.0) _currentState = SitUpState.descending;
        break;
      case SitUpState.descending:
        if (trunkAngle >= downAngleThreshold) {
          if (_minAngleInCurrentRep <= upAngleThreshold) {
            _validReps++;
          } else {
            _invalidReps++;
          }
          _currentState = SitUpState.lyingDown;
          _minAngleInCurrentRep = 180.0;
        }
        break;
    }
  }

  @override
  Map<String, dynamic> calculateMetrics() => {
    'test_id': 'sit_ups',
    'total_repetitions': _validReps + _invalidReps,
    'valid_repetitions': _validReps,
    'invalid_repetitions': _invalidReps,
  };
}`
    },
    'mobile/lib/ai/authenticity_analyzer.dart': {
      category: 'mobile',
      language: 'dart',
      content: `// Biomechanical Authenticity & Cheating Detection Engine
import 'pose_processor.dart';

class AuthenticityReport {
  final bool isAuthentic;
  final double confidence;
  final List<String> warnings;

  AuthenticityReport({required this.isAuthentic, required this.confidence, required this.warnings});
}

class AuthenticityAnalyzer {
  final List<double> _timestamps = [];
  final List<int> _personCountsPerFrame = [];

  void recordFrame({required double timestampSeconds, int detectedPersonsCount = 1}) {
    _timestamps.add(timestampSeconds);
    _personCountsPerFrame.add(detectedPersonsCount);
  }

  AuthenticityReport evaluate() {
    final List<String> warnings = [];
    double penalty = 0.0;

    // 1. Multi-Person Detection Check
    final multiPersons = _personCountsPerFrame.where((c) => c > 1).length;
    if (multiPersons > 2) {
      warnings.add('Multiple individuals detected in testing area ($multiPersons frames)');
      penalty += 30.0;
    }

    // 2. Timestamp delta anomaly check (video slicing / fast-forward)
    if (_timestamps.length >= 10) {
      final deltas = [for (int i = 1; i < _timestamps.length; i++) _timestamps[i] - _timestamps[i - 1]];
      final avg = deltas.reduce((a, b) => a + b) / deltas.length;
      final abnormal = deltas.where((d) => d > avg * 3.0 || d < avg * 0.15).length;
      if (abnormal > 4) {
        warnings.add('Detected $abnormal abnormal timestamp gaps (potential frame drop or cut)');
        penalty += 20.0;
      }
    }

    final score = (100.0 - penalty).clamp(0.0, 100.0);
    return AuthenticityReport(
      isAuthentic: score >= 70.0 && warnings.length <= 1,
      confidence: double.parse((score / 100.0).toStringAsFixed(2)),
      warnings: warnings,
    );
  }
}`
    },
    'backend/src/server.js': {
      category: 'backend',
      language: 'javascript',
      content: `// Express.js Centralized REST API
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// In-Memory store simulating Supabase PostgreSQL for local prototype
app.post('/api/submissions', (req, res) => {
  const { athleteId, testId, validReps, durationSeconds } = req.body;
  const submission = {
    id: 'sub_' + Date.now(),
    athleteId,
    testId,
    validReps,
    status: 'verified',
    syncedAt: new Date().toISOString()
  };
  res.status(201).json({ submission });
});

// Offline Store-and-Forward Batch Sync Endpoint
app.post('/api/sync', (req, res) => {
  const { queue = [] } = req.body;
  const synced = queue.map(item => ({ localId: item.localId, serverId: 'srv_' + Date.now(), status: 'SYNCED' }));
  res.json({ message: 'Batch sync complete', syncedItems: synced });
});

app.listen(5000, () => console.log('API running on port 5000'));`
    },
    'database/schema.sql': {
      category: 'database',
      language: 'sql',
      content: `-- PostgreSQL Database Schema for Supabase
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'athlete'
);

CREATE TABLE IF NOT EXISTS athlete_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    age INT NOT NULL,
    gender VARCHAR(20) NOT NULL,
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    preferred_sport VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS test_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    athlete_id UUID REFERENCES athlete_profiles(id),
    test_id VARCHAR(50) NOT NULL,
    primary_score NUMERIC(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    authenticity_confidence NUMERIC(5, 2),
    synced_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);`
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(files[selectedFile]?.content || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
      <div>
        <div className="flex items-center gap-2">
          <FolderTree className="w-5 h-5 text-emerald-400" />
          <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
            Monorepo Architecture & Source Code
          </h1>
        </div>
        <p className="text-xs text-slate-400 mt-0.5">
          Browse the Flutter Android client code, Node.js Express backend, and Supabase SQL schemas.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* File Tree Sidebar */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 space-y-3">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">
            Workspace Files
          </div>

          <div className="space-y-1 text-xs">
            {Object.keys(files).map((filePath) => {
              const file = files[filePath];
              const isSelected = selectedFile === filePath;

              return (
                <button
                  key={filePath}
                  onClick={() => setSelectedFile(filePath)}
                  className={`w-full text-left px-3 py-2 rounded-xl flex items-center gap-2 transition ${
                    isSelected
                      ? 'bg-emerald-500/10 text-emerald-300 font-bold border border-emerald-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  {file.category === 'mobile' && <Smartphone className="w-3.5 h-3.5 text-blue-400 shrink-0" />}
                  {file.category === 'backend' && <Server className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                  {file.category === 'database' && <Database className="w-3.5 h-3.5 text-purple-400 shrink-0" />}
                  <span className="truncate text-[11px]">{filePath}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Code View Pane */}
        <div className="md:col-span-3 bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden flex flex-col shadow-xl">
          <div className="bg-slate-900/90 px-4 py-3 border-b border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-emerald-400" />
              <span className="font-mono text-white font-bold">{selectedFile}</span>
            </div>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>

          <pre className="p-4 overflow-x-auto text-xs font-mono text-emerald-400/90 bg-slate-950/95 leading-relaxed flex-1">
            <code>{files[selectedFile]?.content}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
