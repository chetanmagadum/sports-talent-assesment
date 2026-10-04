export type UserRole = 'athlete' | 'coach' | 'admin' | 'scout';

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  role: UserRole;
  createdAt: string;
}

export interface AthleteProfile {
  id: string;
  userId: string;
  fullName: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  heightCm: number;
  weightKg: number;
  state: string;
  district: string;
  village: string;
  preferredSport: string;
  nationalTalentCategory: string; // e.g. "Tier-1 National Prospect", "Promising Grassroots"
  profileImageUrl: string;
  aadhaarVerified: boolean;
}

export type FitnessTestId = 'sit_ups' | 'vertical_jump' | 'shuttle_run' | 'endurance_run';

export interface FitnessTest {
  id: FitnessTestId;
  name: string;
  category: string;
  description: string;
  instructions: string[];
  durationSeconds: number;
  metricType: 'reps' | 'height_cm' | 'time_seconds' | 'distance_meters';
  unit: string;
  cameraPlacement: string;
  requiredLandmarks: string[];
  nationalBenchmarkMale: number;
  nationalBenchmarkFemale: number;
  videoGuidelines: string[];
}

export interface LandmarkPoint {
  x: number;
  y: number;
  z?: number;
  confidence: number;
}

export type PoseLandmarks = Record<string, LandmarkPoint>;

export interface JointAngle {
  joint: string;
  angle: number; // degrees
  isValidRange: boolean;
}

export interface AuthenticityReport {
  isAuthentic: boolean;
  confidence: number; // 0.0 to 1.0
  warnings: string[];
  scoreBreakdown: {
    frameIntegrity: number; // 0 to 100
    poseContinuity: number;
    biomechanicalValidity: number;
    soloCandidateRating: number;
  };
}

export type SubmissionStatus = 'pending' | 'analyzing' | 'verified' | 'needs_review' | 'flagged' | 'rejected';
export type SyncStatus = 'pending' | 'uploading' | 'synced' | 'failed' | 'retry';

export interface TestSubmission {
  id: string;
  localId?: string;
  athleteId: string;
  athleteName: string;
  testId: FitnessTestId;
  testName: string;
  recordedAt: string;
  durationSeconds: number;
  status: SubmissionStatus;
  authenticityStatus: 'authentic' | 'suspicious' | 'tampered' | 'unverified';
  authenticityConfidence: number;
  aiConfidence: number;
  primaryScore: number;
  primaryUnit: string;
  validReps: number;
  invalidReps: number;
  jumpHeightCm?: number;
  lapTimes?: number[];
  warnings: string[];
  authenticityReport?: AuthenticityReport;
  syncStatus: SyncStatus;
  videoUrl?: string;
  syncedAt?: string;
  coachNotes?: string;
}

export type NetworkCondition = 'online' | 'offline' | 'slow2g';
