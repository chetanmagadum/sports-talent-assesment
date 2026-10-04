import { PoseLandmarks } from '../types';

export type JumpPhase = 'CALIBRATION' | 'STANDING_READY' | 'SQUAT_DIP' | 'EXPLOSIVE_ASCENT' | 'PEAK_APEX' | 'LANDED';

export interface JumpFrameResult {
  phase: JumpPhase;
  phaseLabel: string;
  currentJumpHeightCm: number;
  bestJumpHeightCm: number;
  attemptsCount: number;
  flightTimeSec: number;
  attemptCompletedThisFrame: boolean;
}

export class VerticalJumpAnalyzer {
  private phase: JumpPhase = 'CALIBRATION';
  private baselineHipY = 0;
  private baselineSamples = 0;
  private takeoffTime = 0;
  private landingTime = 0;
  private maxElevationY = 1.0;
  private currentAttemptHeight = 0;
  private bestAttemptHeight = 0;
  private attempts: number[] = [];

  reset() {
    this.phase = 'CALIBRATION';
    this.baselineHipY = 0;
    this.baselineSamples = 0;
    this.takeoffTime = 0;
    this.landingTime = 0;
    this.maxElevationY = 1.0;
    this.currentAttemptHeight = 0;
    this.bestAttemptHeight = 0;
    this.attempts = [];
  }

  processFrame(landmarks: PoseLandmarks, timestampSec: number): JumpFrameResult {
    const hip = landmarks['right_hip'] || landmarks['left_hip'];
    let attemptCompletedThisFrame = false;

    if (!hip) {
      return {
        phase: this.phase,
        phaseLabel: 'Searching Athlete...',
        currentJumpHeightCm: this.currentAttemptHeight,
        bestJumpHeightCm: this.bestAttemptHeight,
        attemptsCount: this.attempts.length,
        flightTimeSec: 0,
        attemptCompletedThisFrame: false,
      };
    }

    const hipY = hip.y;

    // Calibration phase (first 15 frames)
    if (this.phase === 'CALIBRATION') {
      this.baselineHipY += hipY;
      this.baselineSamples++;
      if (this.baselineSamples >= 15) {
        this.baselineHipY /= 15;
        this.phase = 'STANDING_READY';
      }
      return {
        phase: this.phase,
        phaseLabel: 'Calibrating Baseline Height...',
        currentJumpHeightCm: 0,
        bestJumpHeightCm: 0,
        attemptsCount: 0,
        flightTimeSec: 0,
        attemptCompletedThisFrame: false,
      };
    }

    // Jump State Transitions
    switch (this.phase) {
      case 'STANDING_READY':
        // Detect countermovement squat dip (hip goes down, Y increases)
        if (hipY > this.baselineHipY + 0.05) {
          this.phase = 'SQUAT_DIP';
        }
        break;

      case 'SQUAT_DIP':
        // Detect explosive take-off upward past baseline
        if (hipY < this.baselineHipY - 0.03) {
          this.phase = 'EXPLOSIVE_ASCENT';
          this.takeoffTime = timestampSec;
          this.maxElevationY = hipY;
        }
        break;

      case 'EXPLOSIVE_ASCENT':
        if (hipY < this.maxElevationY) {
          this.maxElevationY = hipY;
        } else if (hipY > this.maxElevationY + 0.02) {
          this.phase = 'PEAK_APEX';
        }
        break;

      case 'PEAK_APEX':
        // On returning to ground level (near baseline)
        if (hipY >= this.baselineHipY - 0.03) {
          this.landingTime = timestampSec;
          this.phase = 'LANDED';

          const flightDuration = Math.max(0, this.landingTime - this.takeoffTime);
          if (flightDuration > 0.2 && flightDuration < 1.0) {
            // Ballistic equation: h = (1/8) * g * t^2
            const g = 9.80665;
            const heightCm = 0.125 * g * Math.pow(flightDuration, 2) * 100;
            const clampedHeight = Math.min(105, Math.max(15, parseFloat(heightCm.toFixed(1))));

            this.currentAttemptHeight = clampedHeight;
            this.attempts.push(clampedHeight);
            if (clampedHeight > this.bestAttemptHeight) {
              this.bestAttemptHeight = clampedHeight;
            }
            attemptCompletedThisFrame = true;
          }
        }
        break;

      case 'LANDED':
        // Cool down and return to ready position
        if (Math.abs(hipY - this.baselineHipY) < 0.04) {
          this.phase = 'STANDING_READY';
        }
        break;
    }

    const labels: Record<JumpPhase, string> = {
      CALIBRATION: 'Calibrating...',
      STANDING_READY: 'Ready to Jump',
      SQUAT_DIP: 'Squat Loading',
      EXPLOSIVE_ASCENT: 'Explosion Phase 🚀',
      PEAK_APEX: 'Peak Apex Height',
      LANDED: 'Landed Softly ✓',
    };

    return {
      phase: this.phase,
      phaseLabel: labels[this.phase],
      currentJumpHeightCm: this.currentAttemptHeight,
      bestJumpHeightCm: this.bestAttemptHeight,
      attemptsCount: this.attempts.length,
      flightTimeSec: this.landingTime > this.takeoffTime ? parseFloat((this.landingTime - this.takeoffTime).toFixed(3)) : 0,
      attemptCompletedThisFrame,
    };
  }

  calculateMetrics() {
    return {
      test_id: 'vertical_jump',
      jump_height_cm: this.bestAttemptHeight,
      total_valid_attempts: this.attempts.length,
      all_attempts: this.attempts,
    };
  }
}
