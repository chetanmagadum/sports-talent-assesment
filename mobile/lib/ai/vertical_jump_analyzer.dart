import 'dart:math';
import 'pose_processor.dart';

enum JumpState {
  standingQuiet,
  squatDip,
  flightAscent,
  peakApex,
  flightDescent,
  landedImpact,
}

class VerticalJumpAnalyzer extends PoseProcessor {
  JumpState _state = JumpState.standingQuiet;
  double _baselineStandingHipY = 0.0;
  int _baselineFrameCount = 0;

  double _takeoffTime = 0.0;
  double _landingTime = 0.0;
  double _maxHipElevationY = 1.0; // In normalized image coords, lower Y is higher physical elevation
  double _lowestSquatHipY = 0.0;

  final List<double> _attemptJumpHeights = [];
  final List<double> _confidenceScores = [];

  JumpState get currentState => _state;
  List<double> get recordedAttempts => _attemptJumpHeights;

  @override
  Map<String, double> calculateAngles(Map<String, LandmarkPoint> landmarks) {
    final hip = landmarks['right_hip'] ?? landmarks['left_hip'];
    final knee = landmarks['right_knee'] ?? landmarks['left_knee'];
    final ankle = landmarks['right_ankle'] ?? landmarks['left_ankle'];

    if (hip == null || knee == null || ankle == null) {
      return {'knee_flexion_angle': -1.0};
    }

    final angle = PoseProcessor.computeJointAngle(hip, knee, ankle);
    return {'knee_flexion_angle': angle};
  }

  @override
  void processFrame({
    required Map<String, LandmarkPoint> landmarks,
    required double timestampSeconds,
  }) {
    final hip = landmarks['right_hip'] ?? landmarks['left_hip'];
    final ankle = landmarks['right_ankle'] ?? landmarks['left_ankle'];

    if (hip == null || ankle == null) {
      _confidenceScores.add(0.25);
      return;
    }
    _confidenceScores.add((hip.confidence + ankle.confidence) / 2.0);

    final double hipY = hip.y;

    // 1. Initial Calibration Phase
    if (_baselineFrameCount < 20) {
      _baselineStandingHipY += hipY;
      _baselineFrameCount++;
      if (_baselineFrameCount == 20) {
        _baselineStandingHipY /= 20.0;
      }
      return;
    }

    // 2. State Machine for Jump Dynamics
    switch (_state) {
      case JumpState.standingQuiet:
        // Detect countermovement squat dip (hip moves downward in camera frame -> higher Y)
        if (hipY > _baselineStandingHipY + 0.06) {
          _lowestSquatHipY = hipY;
          _state = JumpState.squatDip;
        }
        break;

      case JumpState.squatDip:
        if (hipY > _lowestSquatHipY) {
          _lowestSquatHipY = hipY;
        }
        // Explosive take-off (hip shoots upward past baseline)
        if (hipY < _baselineStandingHipY - 0.02) {
          _state = JumpState.flightAscent;
          _takeoffTime = timestampSeconds;
          _maxHipElevationY = hipY;
        }
        break;

      case JumpState.flightAscent:
        if (hipY < _maxHipElevationY) {
          _maxHipElevationY = hipY;
        } else if (hipY > _maxHipElevationY + 0.02) {
          _state = JumpState.peakApex;
        }
        break;

      case JumpState.peakApex:
        _state = JumpState.flightDescent;
        break;

      case JumpState.flightDescent:
        // Feet contact ground when hip returns close to baseline
        if (hipY >= _baselineStandingHipY - 0.03) {
          _landingTime = timestampSeconds;
          _state = JumpState.landedImpact;

          _calculateAndRecordAttempt();
        }
        break;

      case JumpState.landedImpact:
        // Cooldown and return to ready state for next attempt
        if ((hipY - _baselineStandingHipY).abs() < 0.04) {
          _state = JumpState.standingQuiet;
        }
        break;
    }
  }

  void _calculateAndRecordAttempt() {
    final double flightDuration = _landingTime - _takeoffTime;
    if (flightDuration > 0.15 && flightDuration < 1.1) {
      // Standard ballistic physics formula: h = (1/8) * g * t^2
      const double g = 9.80665;
      final double estimatedHeightMeters = 0.125 * g * pow(flightDuration, 2);
      final double heightCm = estimatedHeightMeters * 100.0;

      if (heightCm >= 15.0 && heightCm <= 110.0) {
        _attemptJumpHeights.add(double.parse(heightCm.toStringAsFixed(1)));
      }
    }
  }

  @override
  Map<String, dynamic> calculateMetrics() {
    double bestJump = 0.0;
    if (_attemptJumpHeights.isNotEmpty) {
      bestJump = _attemptJumpHeights.reduce(max);
    }

    return {
      'test_id': 'vertical_jump',
      'jump_height_cm': bestJump,
      'is_estimate': true,
      'estimation_method': 'Flight-time kinematic derivation (t_flight) via MediaPipe landmark tracking',
      'total_valid_attempts': _attemptJumpHeights.length,
      'all_attempts_cm': _attemptJumpHeights,
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
    _state = JumpState.standingQuiet;
    _baselineStandingHipY = 0.0;
    _baselineFrameCount = 0;
    _takeoffTime = 0.0;
    _landingTime = 0.0;
    _maxHipElevationY = 1.0;
    _lowestSquatHipY = 0.0;
    _attemptJumpHeights.clear();
    _confidenceScores.clear();
  }
}
