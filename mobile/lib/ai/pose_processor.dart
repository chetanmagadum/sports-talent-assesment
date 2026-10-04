import 'dart:math';

/// Generic point representation for normalized landmark coordinates
class LandmarkPoint {
  final double x;
  final double y;
  final double z;
  final double confidence;

  LandmarkPoint({
    required this.x,
    required this.y,
    this.z = 0.0,
    required this.confidence,
  });
}

/// Abstract base class for all sport-specific fitness test analyzers
abstract class PoseProcessor {
  /// Extract joint angles from detected landmarks
  Map<String, double> calculateAngles(Map<String, LandmarkPoint> landmarks);

  /// Process an individual video frame or real-time camera pose frame
  void processFrame({
    required Map<String, LandmarkPoint> landmarks,
    required double timestampSeconds,
  });

  /// Calculate the primary and secondary metrics upon test completion
  Map<String, dynamic> calculateMetrics();

  /// Calculate AI detection confidence based on landmark visibility and tracking quality
  double generateConfidence();

  /// Reset internal state machine for a new attempt
  void reset();

  /// Utility method to compute 2D angle between three joints in degrees
  /// vertex is the central joint (e.g. hip between shoulder and knee)
  static double computeJointAngle(
    LandmarkPoint pointA,
    LandmarkPoint vertex,
    LandmarkPoint pointB,
  ) {
    final double v1x = pointA.x - vertex.x;
    final double v1y = pointA.y - vertex.y;
    final double v2x = pointB.x - vertex.x;
    final double v2y = pointB.y - vertex.y;

    final double dotProduct = (v1x * v2x) + (v1y * v2y);
    final double mag1 = sqrt((v1x * v1x) + (v1y * v1y));
    final double mag2 = sqrt((v2x * v2x) + (v2y * v2y));

    if (mag1 == 0 || mag2 == 0) return 0.0;

    double cosine = dotProduct / (mag1 * mag2);
    // Clamp to valid range [-1, 1] to prevent NaN
    cosine = cosine.clamp(-1.0, 1.0);

    final double radians = acos(cosine);
    return radians * (180.0 / pi);
  }
}
