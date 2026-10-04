import 'pose_processor.dart';

class AuthenticityReport {
  final bool isAuthentic;
  final double confidence;
  final List<String> warnings;
  final Map<String, double> integrityScores;

  AuthenticityReport({
    required this.isAuthentic,
    required this.confidence,
    required this.warnings,
    required this.integrityScores,
  });

  Map<String, dynamic> toJson() => {
    'isAuthentic': isAuthentic,
    'confidence': confidence,
    'warnings': warnings,
    'integrityScores': integrityScores,
  };
}

class AuthenticityAnalyzer {
  final List<double> _timestamps = [];
  final List<Map<String, LandmarkPoint>> _frameLandmarks = [];
  final List<int> _personCountsPerFrame = [];

  void recordFrame({
    required double timestampSeconds,
    required Map<String, LandmarkPoint> landmarks,
    int detectedPersonsCount = 1,
  }) {
    _timestamps.add(timestampSeconds);
    _frameLandmarks.add(landmarks);
    _personCountsPerFrame.add(detectedPersonsCount);
  }

  AuthenticityReport evaluate() {
    final List<String> warnings = [];
    double penalty = 0.0;

    if (_timestamps.length < 30) {
      warnings.add('Video stream too brief to ensure biomechanical authenticity (<1 second of valid capture)');
      penalty += 35.0;
    }

    // 1. Frame Interval Consistency
    if (_timestamps.length >= 10) {
      final List<double> deltas = [];
      for (int i = 1; i < _timestamps.length; i++) {
        deltas.add(_timestamps[i] - _timestamps[i - 1]);
      }
      final double avgDelta = deltas.reduce((a, b) => a + b) / deltas.length;
      final int irregularDeltas = deltas.where((d) => d > avgDelta * 3.0 || d < avgDelta * 0.15).length;

      if (irregularDeltas > 4) {
        warnings.add('Detected $irregularDeltas abnormal timestamp discontinuities (possible frame drops or video splicing)');
        penalty += 20.0;
      }
    }

    // 2. Multi-Person Detection
    final int multiPersonFrames = _personCountsPerFrame.where((c) => c > 1).length;
    if (multiPersonFrames > 2) {
      warnings.add('Multiple individuals detected in frame during $multiPersonFrames frames (coaching interference or substitution)');
      penalty += 30.0;
    }

    // 3. Landmark Occlusion / Tracking Loss
    int missingBodyFrames = 0;
    for (final frame in _frameLandmarks) {
      if (frame.isEmpty || (frame['left_hip'] == null && frame['right_hip'] == null)) {
        missingBodyFrames++;
      }
    }

    if (_frameLandmarks.isNotEmpty) {
      final double missingRatio = missingBodyFrames / _frameLandmarks.length;
      if (missingRatio > 0.3) {
        warnings.add('Subject lost from camera view in ${(missingRatio * 100).toStringAsFixed(1)}% of recorded frames');
        penalty += 25.0;
      }
    }

    // 4. Physical Discontinuity / Teleportation Speed Spike
    int kinematicGlitches = 0;
    for (int i = 1; i < _frameLandmarks.length; i++) {
      final prevHip = _frameLandmarks[i - 1]['right_hip'] ?? _frameLandmarks[i - 1]['left_hip'];
      final currHip = _frameLandmarks[i]['right_hip'] ?? _frameLandmarks[i]['left_hip'];
      if (prevHip != null && currHip != null) {
        final double dist = (currHip.x - prevHip.x).abs() + (currHip.y - prevHip.y).abs();
        if (dist > 0.40) {
          kinematicGlitches++;
        }
      }
    }

    if (kinematicGlitches > 2) {
      warnings.add('Detected $kinematicGlitches impossible instantaneous coordinate displacement spikes (video fast-forward or cut)');
      penalty += 25.0;
    }

    final double score = (100.0 - penalty).clamp(0.0, 100.0);
    final double confidence = double.parse((score / 100.0).toStringAsFixed(2));
    final bool isAuthentic = confidence >= 0.70 && warnings.length <= 1;

    return AuthenticityReport(
      isAuthentic: isAuthentic,
      confidence: confidence,
      warnings: warnings,
      integrityScores: {
        'frame_continuity': (100.0 - (penalty > 20 ? 20 : 0)),
        'solo_candidate_verification': (multiPersonFrames == 0 ? 100.0 : 50.0),
        'biomechanical_plausibility': (kinematicGlitches == 0 ? 100.0 : 60.0),
      },
    );
  }

  void reset() {
    _timestamps.clear();
    _frameLandmarks.clear();
    _personCountsPerFrame.clear();
  }
}
