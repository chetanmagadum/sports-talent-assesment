import { PoseLandmarks } from '../types';
import { PoseEngine } from './poseEngine';

export type SitUpState = 'LYING_DOWN' | 'ASCENDING' | 'PEAK_FLEXION' | 'DESCENDING';

export interface SitUpFrameResult {
  trunkAngle: number;
  state: SitUpState;
  stateLabel: string;
  validReps: number;
  invalidReps: number;
  totalReps: number;
  isFault: boolean;
  faultMessage?: string;
  repCompletedThisFrame: boolean;
  wasValidRep?: boolean;
}

export class SitUpAnalyzer {
  private state: SitUpState = 'LYING_DOWN';
  private validReps = 0;
  private invalidReps = 0;
  private minAngleThisRep = 180;
  private isFault = false;
  private faultMessage: string | undefined = undefined;

  // Biomechanical thresholds
  private readonly DOWN_ANGLE = 135; // degrees flat on mat
  private readonly UP_ANGLE = 65;    // degrees flexion reaching knees

  reset() {
    this.state = 'LYING_DOWN';
    this.validReps = 0;
    this.invalidReps = 0;
    this.minAngleThisRep = 180;
    this.isFault = false;
    this.faultMessage = undefined;
  }

  processFrame(landmarks: PoseLandmarks): SitUpFrameResult {
    const shoulder = landmarks['right_shoulder'] || landmarks['left_shoulder'];
    const hip = landmarks['right_hip'] || landmarks['left_hip'];
    const knee = landmarks['right_knee'] || landmarks['left_knee'];

    let repCompletedThisFrame = false;
    let wasValidRep = false;

    if (!shoulder || !hip || !knee) {
      return {
        trunkAngle: -1,
        state: this.state,
        stateLabel: 'Tracking Joint...',
        validReps: this.validReps,
        invalidReps: this.invalidReps,
        totalReps: this.validReps + this.invalidReps,
        isFault: false,
        repCompletedThisFrame: false,
      };
    }

    const trunkAngle = PoseEngine.calculateAngle(shoulder, hip, knee);

    if (trunkAngle < this.minAngleThisRep) {
      this.minAngleThisRep = trunkAngle;
    }

    // Biomechanical Finite State Machine
    switch (this.state) {
      case 'LYING_DOWN':
        this.faultMessage = undefined;
        this.isFault = false;
        if (trunkAngle < this.DOWN_ANGLE - 12) {
          this.state = 'ASCENDING';
        }
        break;

      case 'ASCENDING':
        if (trunkAngle <= this.UP_ANGLE) {
          this.state = 'PEAK_FLEXION';
        } else if (trunkAngle > this.DOWN_ANGLE) {
          // Aborted before reaching peak: incomplete repetition fault
          this.invalidReps++;
          this.isFault = true;
          this.faultMessage = 'Incomplete elevation (elbows did not reach knees)';
          this.state = 'LYING_DOWN';
          this.minAngleThisRep = 180;
          repCompletedThisFrame = true;
          wasValidRep = false;
        }
        break;

      case 'PEAK_FLEXION':
        if (trunkAngle > this.UP_ANGLE + 15) {
          this.state = 'DESCENDING';
        }
        break;

      case 'DESCENDING':
        if (trunkAngle >= this.DOWN_ANGLE) {
          repCompletedThisFrame = true;
          if (this.minAngleThisRep <= this.UP_ANGLE) {
            this.validReps++;
            wasValidRep = true;
            this.isFault = false;
            this.faultMessage = undefined;
          } else {
            this.invalidReps++;
            wasValidRep = false;
            this.isFault = true;
            this.faultMessage = 'Poor form / Incomplete range of motion';
          }
          this.state = 'LYING_DOWN';
          this.minAngleThisRep = 180;
        }
        break;
    }

    const stateLabels: Record<SitUpState, string> = {
      LYING_DOWN: 'Ready (Mat Contact)',
      ASCENDING: 'Ascending...',
      PEAK_FLEXION: 'Peak Flexion ✓',
      DESCENDING: 'Descending...',
    };

    return {
      trunkAngle,
      state: this.state,
      stateLabel: stateLabels[this.state],
      validReps: this.validReps,
      invalidReps: this.invalidReps,
      totalReps: this.validReps + this.invalidReps,
      isFault: this.isFault,
      faultMessage: this.faultMessage,
      repCompletedThisFrame,
      wasValidRep,
    };
  }

  calculateMetrics() {
    return {
      test_id: 'sit_ups',
      total_repetitions: this.validReps + this.invalidReps,
      valid_repetitions: this.validReps,
      invalid_repetitions: this.invalidReps,
    };
  }
}
