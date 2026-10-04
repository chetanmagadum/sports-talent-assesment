import { PoseLandmarks } from '../types';

export interface ShuttleRunResult {
  currentLap: number;
  totalLaps: number;
  elapsedTimeSec: number;
  lapSplits: number[];
  direction: 'HEADING_RIGHT' | 'HEADING_LEFT';
  stateLabel: string;
  isCompleted: boolean;
}

export class ShuttleRunAnalyzer {
  private currentLap = 1;
  private readonly totalLaps = 4;
  private lapSplits: number[] = [];
  private direction: 'HEADING_RIGHT' | 'HEADING_LEFT' = 'HEADING_RIGHT';
  private lastPivotTime = 0;
  private startTime = 0;
  private isCompleted = false;

  reset() {
    this.currentLap = 1;
    this.lapSplits = [];
    this.direction = 'HEADING_RIGHT';
    this.lastPivotTime = 0;
    this.startTime = 0;
    this.isCompleted = false;
  }

  processFrame(landmarks: PoseLandmarks, timestampSec: number): ShuttleRunResult {
    if (this.startTime === 0) {
      this.startTime = timestampSec;
      this.lastPivotTime = timestampSec;
    }

    const hip = landmarks['right_hip'] || landmarks['left_hip'];
    const elapsed = Math.max(0, timestampSec - this.startTime);

    if (hip && !this.isCompleted) {
      const x = hip.x; // 0.0 left boundary, 1.0 right boundary

      // Detect turnaround boundary touch
      if (this.direction === 'HEADING_RIGHT' && x > 0.82) {
        const lapTime = timestampSec - this.lastPivotTime;
        if (lapTime > 1.4) {
          this.lapSplits.push(parseFloat(lapTime.toFixed(2)));
          this.lastPivotTime = timestampSec;
          this.direction = 'HEADING_LEFT';
          this.currentLap++;
        }
      } else if (this.direction === 'HEADING_LEFT' && x < 0.18) {
        const lapTime = timestampSec - this.lastPivotTime;
        if (lapTime > 1.4) {
          this.lapSplits.push(parseFloat(lapTime.toFixed(2)));
          this.lastPivotTime = timestampSec;
          this.direction = 'HEADING_RIGHT';
          this.currentLap++;
        }
      }

      if (this.currentLap > this.totalLaps) {
        this.isCompleted = true;
      }
    }

    return {
      currentLap: Math.min(this.currentLap, this.totalLaps),
      totalLaps: this.totalLaps,
      elapsedTimeSec: parseFloat(elapsed.toFixed(2)),
      lapSplits: this.lapSplits,
      direction: this.direction,
      stateLabel: this.isCompleted
        ? 'Completed 4x10m Shuttle ✓'
        : `Lap ${Math.min(this.currentLap, this.totalLaps)} / ${this.totalLaps} (${this.direction === 'HEADING_RIGHT' ? 'Line B' : 'Line A'})`,
      isCompleted: this.isCompleted,
    };
  }
}
