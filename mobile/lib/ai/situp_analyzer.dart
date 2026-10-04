import 'pose_processor.dart';

enum SitUpState {
  lyingDown,
  ascending,
  peakFlexion,
  descending,
}

class SitUpAnalyzer extends PoseProcessor {
  SitUpState _currentState = SitUpState.lyingDown;
  int _validReps = 0;
  int _invalidReps = 0;
  double _minAngleInCurrentRep = 180.0;
  double _maxAngleInCurrentRep = 0.0;

  final List<double> _confidenceScores = [];
  final List<double> _repDurations = [];
  double _lastRepTimestamp = 0.0;

  // Biomechanical thresholds in degrees
  static const double downAngleThreshold = 135.0; // Torso flat on mat
  static const double upAngleThreshold = 65.0;     // Full sit-up flexion reaching knees

  int get validRepetitions => _validReps;
  int get invalidRepetitions => _invalidReps;
  int get totalRepetitions => _validReps + _invalidReps;
  SitUpState get currentState => _currentState;

  @override
  Map<String, double> calculateAngles(Map<String, LandmarkPoint> landmarks) {
    // Prefer right side, fallback to left side
    final shoulder = landmarks['right_shoulder'] ?? landmarks['left_shoulder'];
    final hip = landmarks['right_hip'] ?? landmarks['left_hip'];
    final knee = landmarks['right_knee'] ?? landmarks['left_knee'];

    if (shoulder == null || hip == null || knee == null) {
      return {'trunk_hip_angle': -1.0};
    }

    final angle = PoseProcessor.computeJointAngle(shoulder, hip, knee);
    return {'trunk_hip_angle': angle};
  }

  @override
  void processFrame({
    required Map<String, LandmarkPoint> landmarks,
    required double timestampSeconds,
  }) {
    final angles = calculateAngles(landmarks);
    final trunkAngle = angles['trunk_hip_angle'] ?? -1.0;

    if (trunkAngle < 0) {
      // Landmark missing or low visibility
      _confidenceScores.add(0.2);
      return;
    }

    final shoulder = landmarks['right_shoulder'] ?? landmarks['left_shoulder'];
    final hip = landmarks['right_hip'] ?? landmarks['left_hip'];
    final knee = landmarks['right_knee'] ?? landmarks['left_knee'];
    final avgConf = ((shoulder?.confidence ?? 0) + (hip?.confidence ?? 0) + (knee?.confidence ?? 0)) / 3.0;
    _confidenceScores.add(avgConf);

    if (trunkAngle < _minAngleInCurrentRep) {
      _minAngleInCurrentRep = trunkAngle;
    }
    if (trunkAngle > _maxAngleInCurrentRep) {
      _maxAngleInCurrentRep = trunkAngle;
    }

    // State Machine Transitions
    switch (_currentState) {
      case SitUpState.lyingDown:
        if (trunkAngle < downAngleThreshold - 15.0) {
          _currentState = SitUpState.ascending;
        }
        break;

      case SitUpState.ascending:
        if (trunkAngle <= upAngleThreshold) {
          _currentState = SitUpState.peakFlexion;
        } else if (trunkAngle > downAngleThreshold) {
          // Aborted attempt without reaching peak
          _invalidReps++;
          _currentState = SitUpState.lyingDown;
          _resetRepMetrics();
        }
        break;

      case SitUpState.peakFlexion:
        if (trunkAngle > upAngleThreshold + 15.0) {
          _currentState = SitUpState.descending;
        }
        break;

      case SitUpState.descending:
        if (trunkAngle >= downAngleThreshold) {
          // Completed full cycle!
          if (_minAngleInCurrentRep <= upAngleThreshold) {
            _validReps++;
            if (_lastRepTimestamp > 0) {
              _repDurations.add(timestampSeconds - _lastRepTimestamp);
            }
            _lastRepTimestamp = timestampSeconds;
          } else {
            _invalidReps++;
          }
          _currentState = SitUpState.lyingDown;
          _resetRepMetrics();
        }
        break;
    }
  }

  void _resetRepMetrics() {
    _minAngleInCurrentRep = 180.0;
    _maxAngleInCurrentRep = 0.0;
  }

  @override
  Map<String, dynamic> calculateMetrics() {
    double avgPace = 0.0;
    if (_repDurations.isNotEmpty) {
      avgPace = _repDurations.reduce((a, b) => a + b) / _repDurations.length;
    }

    return {
      'test_id': 'sit_ups',
      'total_repetitions': totalRepetitions,
      'valid_repetitions': _validReps,
      'invalid_repetitions': _invalidReps,
      'average_rep_duration_seconds': double.parse(avgPace.toStringAsFixed(2)),
      'completion_quality': _validReps > 0 ? (_validReps / totalRepetitions) * 100 : 0.0,
      'ai_confidence': generateConfidence(),
    };
  }

  @override
  double generateConfidence() {
    if (_confidenceScores.isEmpty) return 0.0;
    final total = _confidenceScores.reduce((a, b) => a + b);
    return double.parse((total / _confidenceScores.length).toStringAsFixed(2));
  }

  @override
  void reset() {
    _currentState = SitUpState.lyingDown;
    _validReps = 0;
    _invalidReps = 0;
    _minAngleInCurrentRep = 180.0;
    _maxAngleInCurrentRep = 0.0;
    _confidenceScores.clear();
    _repDurations.clear();
    _lastRepTimestamp = 0.0;
  }
}
