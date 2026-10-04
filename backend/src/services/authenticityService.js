/**
 * Biomechanical Authenticity & Anti-Cheating Verification Service
 * Evaluates video timing, landmark trajectory anomalies, and multi-person interference.
 */

class AuthenticityService {
  /**
   * Evaluates raw frame and landmark stream metrics for spoofing, splicing, or physical tampering.
   * @param {Object} input - { frames, timestamps, landmarks, duration, testType }
   * @returns {Object} { isAuthentic, confidence, warnings, scoreBreakdown }
   */
  static verifySubmissionAuthenticity(input) {
    const warnings = [];
    let integrityDeduction = 0;
    const { frames = [], timestamps = [], landmarks = [], duration = 0, testType = 'sit_ups' } = input;

    // 1. Frame Interval & Dropped Frame Analysis
    if (timestamps.length >= 10) {
      const intervals = [];
      for (let i = 1; i < timestamps.length; i++) {
        intervals.push(timestamps[i] - timestamps[i - 1]);
      }
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const abnormalGaps = intervals.filter(d => d > avgInterval * 2.8 || d < avgInterval * 0.2);

      if (abnormalGaps.length > 5) {
        warnings.push(`Detected ${abnormalGaps.length} erratic frame time gaps (possible video splice or frame rate manipulation)`);
        integrityDeduction += 18;
      }
    }

    // 2. Pose Continuity & Occlusion Check
    if (landmarks.length > 0) {
      let missingPoseFrames = 0;
      let multiPersonDetections = 0;

      landmarks.forEach((frameLandmarks) => {
        if (!frameLandmarks || frameLandmarks.length === 0) {
          missingPoseFrames++;
        } else if (frameLandmarks.detectedPersons && frameLandmarks.detectedPersons > 1) {
          multiPersonDetections++;
        }
      });

      const missingRatio = missingPoseFrames / landmarks.length;
      if (missingRatio > 0.25) {
        warnings.push(`Athlete body lost from view in ${(missingRatio * 100).toFixed(1)}% of video frames`);
        integrityDeduction += 22;
      }

      if (multiPersonDetections > 3) {
        warnings.push(`Multiple individuals detected in testing area during ${multiPersonDetections} frames (potential substitution or coaching interference)`);
        integrityDeduction += 30;
      }
    }

    // 3. Biomechanical Feasibility & Kinematic Velocity Bounds
    if (landmarks.length > 10) {
      let impossibleSpeedSpikes = 0;
      for (let i = 1; i < landmarks.length; i++) {
        const prev = landmarks[i - 1];
        const curr = landmarks[i];
        if (prev?.hip && curr?.hip) {
          const dy = Math.abs(curr.hip.y - prev.hip.y);
          // Normalized coordinate displacement greater than 0.35 in a single 33ms frame indicates video speedup / teleport
          if (dy > 0.35) {
            impossibleSpeedSpikes++;
          }
        }
      }

      if (impossibleSpeedSpikes > 2) {
        warnings.push(`Detected ${impossibleSpeedSpikes} unnatural body displacement spikes (abnormal velocity glitch or video fast-forwarding)`);
        integrityDeduction += 25;
      }
    }

    // 4. Test Duration Validation
    if (testType === 'sit_ups' && (duration < 25 || duration > 75)) {
      warnings.push(`Standard test duration protocol expected ~60s (recorded ${Math.round(duration)}s)`);
      integrityDeduction += 10;
    }

    // Compute final confidence
    const rawScore = Math.max(0, 100 - integrityDeduction);
    const confidence = parseFloat((rawScore / 100).toFixed(2));
    const isAuthentic = confidence >= 0.70 && warnings.length <= 2;

    return {
      isAuthentic,
      confidence,
      warnings,
      scoreBreakdown: {
        frameIntegrity: Math.max(0, 100 - (integrityDeduction > 20 ? 20 : 0)),
        poseContinuity: Math.max(0, 100 - (integrityDeduction > 30 ? 30 : 0)),
        biomechanicalValidity: Math.max(0, 100 - (integrityDeduction > 40 ? 40 : 0)),
      }
    };
  }
}

module.exports = AuthenticityService;
