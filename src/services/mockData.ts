import { AthleteProfile, FitnessTest, TestSubmission } from '../types';

export const FITNESS_TESTS: FitnessTest[] = [
  {
    id: 'sit_ups',
    name: '1-Minute Abdominal Sit-ups',
    category: 'Core Muscular Endurance',
    description: 'Measures continuous trunk flexion and core stamina from a supine knees-bent position.',
    instructions: [
      'Lie flat on a firm exercise mat with knees bent at ~90 degrees.',
      'Cross arms across chest or hold fingertips lightly behind ears.',
      'On START, curl your trunk upward until elbows touch or pass knees.',
      'Descend under control until shoulder blades touch the mat before beginning next rep.',
      'Complete maximum clean repetitions within 60 seconds.'
    ],
    durationSeconds: 60,
    metricType: 'reps',
    unit: 'reps',
    cameraPlacement: 'Place smartphone 2.0 to 2.5 meters away at waist level, oriented horizontally for a 90° side profile.',
    requiredLandmarks: ['shoulder', 'hip', 'knee', 'ankle'],
    nationalBenchmarkMale: 45,
    nationalBenchmarkFemale: 38,
    videoGuidelines: [
      'Ensure full body is visible throughout the entire 60 seconds.',
      'Avoid loose clothing that obscures hip or knee joints.',
      'Natural daylight or uniform indoor lighting is recommended.'
    ]
  },
  {
    id: 'vertical_jump',
    name: 'Countermovement Vertical Jump',
    category: 'Lower Body Explosive Power',
    description: 'Measures explosive vertical jumping capacity derived from ballistic flight time and hip elevation.',
    instructions: [
      'Stand upright in camera frame with feet shoulder-width apart.',
      'Remain still for 2 seconds to allow AI baseline standing height calibration.',
      'Perform a rapid countermovement dip (squat flexion) and immediately explode upward.',
      'Reach upward with both hands for maximum peak elevation.',
      'Land softly on both feet absorbing impact. 3 recorded attempts; highest counts.'
    ],
    durationSeconds: 30,
    metricType: 'height_cm',
    unit: 'cm',
    cameraPlacement: 'Place smartphone 3.0 meters away perpendicular to the athlete, capturing full head-to-toe frame.',
    requiredLandmarks: ['hip', 'knee', 'ankle', 'shoulder'],
    nationalBenchmarkMale: 52.0,
    nationalBenchmarkFemale: 42.0,
    videoGuidelines: [
      'Ensure overhead clearance is completely visible above the head.',
      'Athlete must stay in frame during takeoff and landing.'
    ]
  },
  {
    id: 'shuttle_run',
    name: '4 x 10m Agility Shuttle Run',
    category: 'Agility & Direction Change Speed',
    description: 'Assesses rapid acceleration, deceleration, and pivoting between two 10-meter boundary markers.',
    instructions: [
      'Stand behind baseline line A in ready athletic split stance.',
      'On buzzer signal, sprint at 100% effort to line B (10 meters away).',
      'Touch the marker block with one hand behind line B and pivot.',
      'Sprint back to line A, touch marker, and repeat for 4 total lengths (40m total).',
      'Cross final baseline at top velocity.'
    ],
    durationSeconds: 45,
    metricType: 'time_seconds',
    unit: 'seconds',
    cameraPlacement: 'Position phone at midpoint (5m marker), 4m back with wide landscape field of view covering both lines.',
    requiredLandmarks: ['hip', 'ankle', 'shoulder'],
    nationalBenchmarkMale: 9.8,
    nationalBenchmarkFemale: 10.9,
    videoGuidelines: [
      'Both turnaround cones/lines must remain in view at all times.',
      'Do not cross in front of the camera.'
    ]
  },
  {
    id: 'endurance_run',
    name: '600m Aerobic Cadence Run',
    category: 'Cardiovascular Aerobic Capacity',
    description: 'Evaluates aerobic endurance, pacing efficiency, and running cadence over standard track loop.',
    instructions: [
      'Stand at marked starting gate.',
      'Run designated 600m loop or track lane maintaining even cadence.',
      'Smartphone records stride frequency, rhythm consistency, and lap time splits.',
      'Manual lap checkpoints can be verified by local evaluator.'
    ],
    durationSeconds: 300,
    metricType: 'time_seconds',
    unit: 'seconds',
    cameraPlacement: 'Held by local teacher/coach at track checkpoint or placed on tripod at finish lap gate.',
    requiredLandmarks: ['hip', 'knee', 'ankle'],
    nationalBenchmarkMale: 135,
    nationalBenchmarkFemale: 160,
    videoGuidelines: [
      'Record checkpoint crossings and runner posture.'
    ]
  }
];

export const INITIAL_ATHLETES: AthleteProfile[] = [
  {
    id: 'ath_ramesh_01',
    userId: 'usr_ath_01',
    fullName: 'Ramesh Kumar',
    age: 17,
    gender: 'male',
    heightCm: 174,
    weightKg: 64,
    state: 'Maharashtra',
    district: 'Satara',
    village: 'Wai Rural Tehsil',
    preferredSport: 'Middle-Distance Athletics & Sprints',
    nationalTalentCategory: 'Tier-1 High Potential Prospect',
    profileImageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces',
    aadhaarVerified: true
  },
  {
    id: 'ath_anjali_02',
    userId: 'usr_ath_02',
    fullName: 'Anjali Devi',
    age: 16,
    gender: 'female',
    heightCm: 164,
    weightKg: 58,
    state: 'Haryana',
    district: 'Rohtak',
    village: 'Meham Block',
    preferredSport: 'Wrestling & Explosive Power',
    nationalTalentCategory: 'National Level Junior Power',
    profileImageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&crop=faces',
    aadhaarVerified: true
  },
  {
    id: 'ath_birsa_03',
    userId: 'usr_ath_03',
    fullName: 'Birsa Munda Tirkey',
    age: 18,
    gender: 'male',
    heightCm: 178,
    weightKg: 68,
    state: 'Jharkhand',
    district: 'Ranchi',
    village: 'Khunti Tribal Belt',
    preferredSport: 'Field Hockey & Agility Running',
    nationalTalentCategory: 'Exceptional Grassroots Agility',
    profileImageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces',
    aadhaarVerified: true
  },
  {
    id: 'ath_priya_04',
    userId: 'usr_ath_04',
    fullName: 'Priya Nair',
    age: 15,
    gender: 'female',
    heightCm: 168,
    weightKg: 54,
    state: 'Kerala',
    district: 'Wayanad',
    village: 'Sulthan Bathery',
    preferredSport: 'Track & Field / High Jump',
    nationalTalentCategory: 'Elite Spring Mechanics Prospect',
    profileImageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=faces',
    aadhaarVerified: true
  },
  {
    id: 'ath_gurpreet_05',
    userId: 'usr_ath_05',
    fullName: 'Gurpreet Singh',
    age: 17,
    gender: 'male',
    heightCm: 182,
    weightKg: 74,
    state: 'Punjab',
    district: 'Tarn Taran',
    village: 'Patti Sector',
    preferredSport: 'Rowing & Decathlon',
    nationalTalentCategory: 'All-Round Core Stamina',
    profileImageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=faces',
    aadhaarVerified: false
  }
];

export const INITIAL_SUBMISSIONS: TestSubmission[] = [
  {
    id: 'sub_001',
    athleteId: 'ath_ramesh_01',
    athleteName: 'Ramesh Kumar',
    testId: 'sit_ups',
    testName: '1-Minute Abdominal Sit-ups',
    recordedAt: '2026-09-28T09:15:00Z',
    durationSeconds: 60,
    status: 'verified',
    authenticityStatus: 'authentic',
    authenticityConfidence: 0.96,
    aiConfidence: 0.94,
    primaryScore: 42,
    primaryUnit: 'reps',
    validReps: 40,
    invalidReps: 2,
    warnings: [],
    authenticityReport: {
      isAuthentic: true,
      confidence: 0.96,
      warnings: [],
      scoreBreakdown: {
        frameIntegrity: 98,
        poseContinuity: 96,
        biomechanicalValidity: 95,
        soloCandidateRating: 100
      }
    },
    syncStatus: 'synced',
    syncedAt: '2026-09-28T09:25:00Z',
    coachNotes: 'Excellent core control and rhythmic pacing. 2 invalid reps were due to minor neck flexion before trunk lift.'
  },
  {
    id: 'sub_002',
    athleteId: 'ath_ramesh_01',
    athleteName: 'Ramesh Kumar',
    testId: 'vertical_jump',
    testName: 'Countermovement Vertical Jump',
    recordedAt: '2026-09-29T10:30:00Z',
    durationSeconds: 30,
    status: 'verified',
    authenticityStatus: 'authentic',
    authenticityConfidence: 0.94,
    aiConfidence: 0.92,
    primaryScore: 54.2,
    primaryUnit: 'cm',
    validReps: 3,
    invalidReps: 0,
    jumpHeightCm: 54.2,
    warnings: [],
    authenticityReport: {
      isAuthentic: true,
      confidence: 0.94,
      warnings: [],
      scoreBreakdown: {
        frameIntegrity: 95,
        poseContinuity: 92,
        biomechanicalValidity: 96,
        soloCandidateRating: 100
      }
    },
    syncStatus: 'synced',
    syncedAt: '2026-09-29T11:00:00Z',
    coachNotes: 'Exceeds National Benchmark (52.0cm). Flight time measured at 0.665s. High explosive potential.'
  },
  {
    id: 'sub_003',
    athleteId: 'ath_anjali_02',
    athleteName: 'Anjali Devi',
    testId: 'vertical_jump',
    testName: 'Countermovement Vertical Jump',
    recordedAt: '2026-09-30T14:20:00Z',
    durationSeconds: 30,
    status: 'verified',
    authenticityStatus: 'authentic',
    authenticityConfidence: 0.93,
    aiConfidence: 0.91,
    primaryScore: 47.8,
    primaryUnit: 'cm',
    validReps: 3,
    invalidReps: 0,
    jumpHeightCm: 47.8,
    warnings: [],
    authenticityReport: {
      isAuthentic: true,
      confidence: 0.93,
      warnings: [],
      scoreBreakdown: {
        frameIntegrity: 94,
        poseContinuity: 93,
        biomechanicalValidity: 92,
        soloCandidateRating: 100
      }
    },
    syncStatus: 'synced',
    syncedAt: '2026-09-30T14:45:00Z',
    coachNotes: 'Top 5% among female junior wrestlers. Strong hip extension trajectory.'
  },
  {
    id: 'sub_004',
    athleteId: 'ath_birsa_03',
    athleteName: 'Birsa Munda Tirkey',
    testId: 'shuttle_run',
    testName: '4 x 10m Agility Shuttle Run',
    recordedAt: '2026-10-01T08:00:00Z',
    durationSeconds: 40,
    status: 'verified',
    authenticityStatus: 'authentic',
    authenticityConfidence: 0.95,
    aiConfidence: 0.90,
    primaryScore: 9.4,
    primaryUnit: 'seconds',
    validReps: 4,
    invalidReps: 0,
    lapTimes: [2.3, 2.4, 2.4, 2.3],
    warnings: [],
    authenticityReport: {
      isAuthentic: true,
      confidence: 0.95,
      warnings: [],
      scoreBreakdown: {
        frameIntegrity: 96,
        poseContinuity: 94,
        biomechanicalValidity: 95,
        soloCandidateRating: 100
      }
    },
    syncStatus: 'synced',
    syncedAt: '2026-10-01T08:15:00Z',
    coachNotes: 'Outstanding turnaround acceleration. Sub-9.5s on dirt surface indicates top tier field agility.'
  },
  {
    id: 'sub_005',
    athleteId: 'ath_priya_04',
    athleteName: 'Priya Nair',
    testId: 'sit_ups',
    testName: '1-Minute Abdominal Sit-ups',
    recordedAt: '2026-10-01T16:10:00Z',
    durationSeconds: 60,
    status: 'needs_review',
    authenticityStatus: 'suspicious',
    authenticityConfidence: 0.72,
    aiConfidence: 0.81,
    primaryScore: 39,
    primaryUnit: 'reps',
    validReps: 35,
    invalidReps: 4,
    warnings: [
      'Athlete lower legs obscured in 14% of frames due to shadow/camera angle',
      '2 frames had sudden movement acceleration near border'
    ],
    authenticityReport: {
      isAuthentic: false,
      confidence: 0.72,
      warnings: [
        'Athlete lower legs obscured in 14% of frames due to shadow/camera angle',
        '2 frames had sudden movement acceleration near border'
      ],
      scoreBreakdown: {
        frameIntegrity: 82,
        poseContinuity: 70,
        biomechanicalValidity: 76,
        soloCandidateRating: 90
      }
    },
    syncStatus: 'synced',
    syncedAt: '2026-10-01T17:00:00Z',
    coachNotes: 'Flagged for coach review due to camera shadow. Biomechanics appear genuine, recommend daylight retest.'
  }
];
