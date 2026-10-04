import { LandmarkPoint, PoseLandmarks } from '../types';

export interface KeypointAngle {
  jointName: string;
  angleDeg: number;
}

/**
 * Biomechanical Pose Engine
 * Handles 2D landmark geometry, joint angle calculations, and canvas skeleton rendering.
 */
export class PoseEngine {
  /**
   * Calculates angle between three landmark points A-B-C with vertex B.
   * Return value is in degrees [0, 180].
   */
  static calculateAngle(a: LandmarkPoint, b: LandmarkPoint, c: LandmarkPoint): number {
    const v1x = a.x - b.x;
    const v1y = a.y - b.y;
    const v2x = c.x - b.x;
    const v2y = c.y - b.y;

    const dot = v1x * v2x + v1y * v2y;
    const mag1 = Math.sqrt(v1x * v1x + v1y * v1y);
    const mag2 = Math.sqrt(v2x * v2x + v2y * v2y);

    if (mag1 === 0 || mag2 === 0) return 0;

    let cosine = dot / (mag1 * mag2);
    cosine = Math.max(-1.0, Math.min(1.0, cosine));
    return (Math.acos(cosine) * 180) / Math.PI;
  }

  /**
   * Draws human pose skeleton with color-coded joints and bones on an HTML5 canvas context.
   */
  static drawSkeleton(
    ctx: CanvasRenderingContext2D,
    landmarks: PoseLandmarks,
    width: number,
    height: number,
    options: {
      highlightColor?: string;
      showAngles?: boolean;
      primaryAngle?: number;
      repStateLabel?: string;
      faultDetected?: boolean;
    } = {}
  ) {
    const {
      highlightColor = '#10B981',
      showAngles = true,
      primaryAngle,
      repStateLabel,
      faultDetected = false,
    } = options;

    const boneColor = faultDetected ? '#EF4444' : highlightColor;

    // Define standard skeleton connections (MediaPipe 33-point subset)
    const connections: Array<[string, string]> = [
      ['left_shoulder', 'right_shoulder'],
      ['left_shoulder', 'left_elbow'],
      ['left_elbow', 'left_wrist'],
      ['right_shoulder', 'right_elbow'],
      ['right_elbow', 'right_wrist'],
      ['left_shoulder', 'left_hip'],
      ['right_shoulder', 'right_hip'],
      ['left_hip', 'right_hip'],
      ['left_hip', 'left_knee'],
      ['left_knee', 'left_ankle'],
      ['right_hip', 'right_knee'],
      ['right_knee', 'right_ankle'],
      ['nose', 'left_shoulder'],
      ['nose', 'right_shoulder'],
    ];

    ctx.save();

    // 1. Draw Bones
    ctx.lineWidth = 4;
    ctx.strokeStyle = boneColor;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    connections.forEach(([j1, j2]) => {
      const p1 = landmarks[j1];
      const p2 = landmarks[j2];
      if (p1 && p2 && p1.confidence > 0.3 && p2.confidence > 0.3) {
        ctx.beginPath();
        ctx.moveTo(p1.x * width, p1.y * height);
        ctx.lineTo(p2.x * width, p2.y * height);
        ctx.stroke();
      }
    });

    // 2. Draw Landmark Keypoints
    Object.entries(landmarks).forEach(([name, point]) => {
      if (point.confidence > 0.3) {
        const px = point.x * width;
        const py = point.y * height;

        // Outer glow circle
        ctx.beginPath();
        ctx.arc(px, py, 6, 0, 2 * Math.PI);
        ctx.fillStyle = faultDetected ? '#F87171' : '#34D399';
        ctx.fill();

        // Inner core
        ctx.beginPath();
        ctx.arc(px, py, 3, 0, 2 * Math.PI);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();

        // Joint highlight for primary active joints
        if (name.includes('hip') || name.includes('knee') || name.includes('shoulder')) {
          ctx.beginPath();
          ctx.arc(px, py, 10, 0, 2 * Math.PI);
          ctx.strokeStyle = faultDetected ? 'rgba(239, 68, 68, 0.4)' : 'rgba(16, 185, 129, 0.4)';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }
    });

    // 3. Draw On-Screen Biomechanical Gauges
    if (showAngles && primaryAngle !== undefined && primaryAngle >= 0) {
      const hip = landmarks['right_hip'] || landmarks['left_hip'];
      if (hip) {
        const gx = hip.x * width + 20;
        const gy = hip.y * height - 10;

        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.roundRect ? ctx.roundRect(gx - 8, gy - 20, 95, 30, 8) : ctx.rect(gx - 8, gy - 20, 95, 30);
        ctx.fill();

        ctx.strokeStyle = boneColor;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 13px monospace';
        ctx.fillText(`θ: ${primaryAngle.toFixed(0)}°`, gx, gy);
      }
    }

    // 4. Repetition State Indicator Tag
    if (repStateLabel) {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      const tagWidth = 140;
      const tagHeight = 32;
      ctx.roundRect ? ctx.roundRect(16, 16, tagWidth, tagHeight, 8) : ctx.rect(16, 16, tagWidth, tagHeight);
      ctx.fill();

      ctx.strokeStyle = faultDetected ? '#EF4444' : '#10B981';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = faultDetected ? '#FCA5A5' : '#6EE7B7';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(repStateLabel, 26, 37);
    }

    ctx.restore();
  }
}
