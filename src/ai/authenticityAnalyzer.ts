import { AuthenticityReport, PoseLandmarks } from '../types';

export interface RecordedFrameSample {
  timestampSec: number;
  landmarks: PoseLandmarks;
  personCount: number;
  simulatedTampering?: boolean;
}

export class AuthenticityAnalyzer {
  private frames: RecordedFrameSample[] = [];

  recordFrame(sample: RecordedFrameSample) {
    this.frames.push(sample);
  }

  reset() {
    this.frames = [];
  }

  evaluate(): AuthenticityReport {
    const warnings: string[] = [];
    let frameIntegrityScore = 98;
    let poseContinuityScore = 96;
    let biomechanicalValidityScore = 97;
    let soloCandidateScore = 100;

    if (this.frames.length < 20) {
      warnings.push('Video stream buffer too short for rigorous biomechanical audit (<1.5s total capture)');
      frameIntegrityScore -= 30;
    }

    // 1. Check for intentional tamper flag (for Demo Mode evaluator testing)
    const hasTamperFlag = this.frames.some(f => f.simulatedTampering);
    if (hasTamperFlag) {
      warnings.push('Simulated Video Tampering Injected: Irregular frame rate time-splice anomaly detected');
      warnings.push('Biomechanical Velocity Spike: Instantaneous hip joint displacement exceeded 14 m/s');
      frameIntegrityScore -= 40;
      biomechanicalValidityScore -= 35;
    }

    // 2. Multi-Person Detection
    const multiPersonFrames = this.frames.filter(f => f.personCount > 1).length;
    if (multiPersonFrames > 3) {
      warnings.push(`Multiple individuals (${multiPersonFrames} frames) detected in test zone (prohibited physical assistance or coaching intervention)`);
      soloCandidateScore = Math.max(20, 100 - (multiPersonFrames * 8));
    }

    // 3. Occlusion & Landmark Continuity Check
    let occludedCount = 0;
    this.frames.forEach(f => {
      const hip = f.landmarks['right_hip'] || f.landmarks['left_hip'];
      const shoulder = f.landmarks['right_shoulder'] || f.landmarks['left_shoulder'];
      if (!hip || !shoulder || hip.confidence < 0.3) {
        occludedCount++;
      }
    });

    if (this.frames.length > 0) {
      const occludedRatio = occludedCount / this.frames.length;
      if (occludedRatio > 0.22) {
        warnings.push(`Athlete body partially obscured or out-of-frame in ${(occludedRatio * 100).toFixed(0)}% of frames`);
        poseContinuityScore -= Math.round(occludedRatio * 70);
      }
    }

    // 4. Biomechanical Kinematic Acceleration Limits
    let extremeVelocitySpikes = 0;
    for (let i = 1; i < this.frames.length; i++) {
      const prev = this.frames[i - 1];
      const curr = this.frames[i];
      const dt = curr.timestampSec - prev.timestampSec;
      if (dt > 0.005) {
        const prevHip = prev.landmarks['right_hip'] || prev.landmarks['left_hip'];
        const currHip = curr.landmarks['right_hip'] || curr.landmarks['left_hip'];
        if (prevHip && currHip) {
          const dy = Math.abs(currHip.y - prevHip.y);
          // Normalized Y coordinate displacement rate per second
          const speed = dy / dt;
          if (speed > 8.0) { // Unnatural teleportation or video skip
            extremeVelocitySpikes++;
          }
        }
      }
    }

    if (extremeVelocitySpikes > 2) {
      warnings.push(`Detected ${extremeVelocitySpikes} unnatural body displacement spikes (abnormal speed glitch or video fast-forward)`);
      biomechanicalValidityScore -= 30;
    }

    // Final Weighted Confidence Calculation
    const compositeScore = Math.max(
      0,
      Math.min(
        100,
        frameIntegrityScore * 0.25 +
        poseContinuityScore * 0.25 +
        biomechanicalValidityScore * 0.25 +
        soloCandidateScore * 0.25
      )
    );

    const confidence = parseFloat((compositeScore / 100).toFixed(2));
    const isAuthentic = confidence >= 0.75 && warnings.length <= 1;

    return {
      isAuthentic,
      confidence,
      warnings,
      scoreBreakdown: {
        frameIntegrity: Math.max(0, frameIntegrityScore),
        poseContinuity: Math.max(0, poseContinuityScore),
        biomechanicalValidity: Math.max(0, biomechanicalValidityScore),
        soloCandidateRating: Math.max(0, soloCandidateScore),
      },
    };
  }
}
