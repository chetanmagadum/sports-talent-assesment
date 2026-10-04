/**
 * Node.js / Express Backend for Sports Talent Assessment Platform
 */

const express = require('express');
const cors = require('cors');
const AuthenticityService = require('./services/authenticityService');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// In-Memory state simulating Supabase PostgreSQL for local prototype execution
const db = {
  users: [
    {
      id: 'usr_coach_01',
      email: 'coach@sportsdemo.org',
      full_name: 'Coach Balwant Singh',
      role: 'coach',
      phone: '+919876543210'
    },
    {
      id: 'usr_ath_01',
      email: 'athlete@sportsdemo.org',
      full_name: 'Ramesh Kumar',
      role: 'athlete',
      phone: '+919421001122'
    }
  ],
  athleteProfiles: [
    {
      id: 'ath_ramesh_01',
      userId: 'usr_ath_01',
      fullName: 'Ramesh Kumar',
      age: 17,
      gender: 'male',
      state: 'Maharashtra',
      district: 'Satara',
      village: 'Karad Rural',
      heightCm: 174,
      weightKg: 64,
      preferredSport: 'Athletics (Middle Distance & Sprints)',
      nationalTalentCategory: 'High Potential Tier-1',
      profileImageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
    },
    {
      id: 'ath_anjali_02',
      userId: 'usr_ath_02',
      fullName: 'Anjali Devi',
      age: 16,
      gender: 'female',
      state: 'Haryana',
      district: 'Rohtak',
      village: 'Meham Kalan',
      heightCm: 165,
      weightKg: 56,
      preferredSport: 'Wrestling & Power Lifting',
      nationalTalentCategory: 'Exceptional Explosive Power',
      profileImageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150'
    }
  ],
  fitnessTests: [
    {
      id: 'sit_ups',
      name: '1-Minute Abdominal Sit-ups',
      category: 'Core Muscular Endurance',
      durationSeconds: 60,
      metricType: 'reps',
      nationalBenchmarkMale: 45,
      nationalBenchmarkFemale: 38
    },
    {
      id: 'vertical_jump',
      name: 'Countermovement Vertical Jump',
      category: 'Explosive Lower-Body Power',
      durationSeconds: 30,
      metricType: 'height_cm',
      nationalBenchmarkMale: 52,
      nationalBenchmarkFemale: 42
    },
    {
      id: 'shuttle_run',
      name: '4 x 10m Agility Shuttle Run',
      category: 'Agility & Speed',
      durationSeconds: 45,
      metricType: 'time_seconds',
      nationalBenchmarkMale: 9.8,
      nationalBenchmarkFemale: 10.9
    },
    {
      id: 'endurance_run',
      name: '600m Aerobic Run',
      category: 'Aerobic Capacity',
      durationSeconds: 300,
      metricType: 'time_seconds',
      nationalBenchmarkMale: 135,
      nationalBenchmarkFemale: 160
    }
  ],
  submissions: [
    {
      id: 'sub_demo_01',
      athleteId: 'ath_ramesh_01',
      athleteName: 'Ramesh Kumar',
      testId: 'sit_ups',
      recordedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      durationSeconds: 60,
      status: 'verified',
      authenticityStatus: 'authentic',
      authenticityConfidence: 0.94,
      aiConfidence: 0.93,
      primaryScore: 36,
      primaryUnit: 'reps',
      validReps: 34,
      invalidReps: 2,
      warnings: [],
      syncedAt: new Date().toISOString()
    }
  ]
};

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'AI Sports Talent Assessment API',
    timestamp: new Date().toISOString()
  });
});

// AUTH ROUTES
app.post('/api/auth/register', (req, res) => {
  const { email, password, fullName, phone, role = 'athlete', state, district, age, gender, preferredSport } = req.body;
  if (!email || !fullName) {
    return res.status(400).json({ error: 'Missing mandatory registration fields' });
  }

  const existing = db.users.find(u => u.email === email);
  if (existing) {
    return res.status(409).json({ error: 'User with this email already exists' });
  }

  const newUser = {
    id: `usr_${Date.now()}`,
    email,
    fullName,
    phone: phone || '',
    role
  };
  db.users.push(newUser);

  let newProfile = null;
  if (role === 'athlete') {
    newProfile = {
      id: `ath_${Date.now()}`,
      userId: newUser.id,
      fullName,
      age: parseInt(age) || 16,
      gender: gender || 'male',
      state: state || 'Maharashtra',
      district: district || 'Satara',
      village: 'Gramin Sector',
      heightCm: 170,
      weightKg: 60,
      preferredSport: preferredSport || 'Athletics'
    };
    db.athleteProfiles.push(newProfile);
  }

  res.status(201).json({
    message: 'Athlete registered successfully',
    user: newUser,
    profile: newProfile,
    token: `jwt_token_demo_${newUser.id}`
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email } = req.body;
  const user = db.users.find(u => u.email === email);
  if (!user) {
    // For prototype demo convenience, create on the fly or reject
    return res.status(401).json({ error: 'Invalid credentials. Use demo credentials or register.' });
  }

  const profile = db.athleteProfiles.find(p => p.userId === user.id) || null;
  res.json({
    user,
    profile,
    token: `jwt_token_demo_${user.id}`
  });
});

// ATHLETE ROUTES
app.get('/api/athletes/:id', (req, res) => {
  const profile = db.athleteProfiles.find(p => p.id === req.params.id || p.userId === req.params.id);
  if (!profile) return res.status(404).json({ error: 'Athlete profile not found' });
  const athleteSubmissions = db.submissions.filter(s => s.athleteId === profile.id);
  res.json({ profile, submissions: athleteSubmissions });
});

// FITNESS TESTS PROTOCOL
app.get('/api/tests', (req, res) => {
  res.json({ tests: db.fitnessTests });
});

// SUBMISSION & AI ANALYSIS INGESTION
app.post('/api/submissions', (req, res) => {
  const {
    athleteId,
    testId,
    recordedAt,
    durationSeconds,
    primaryScore,
    primaryUnit,
    validReps,
    invalidReps,
    rawMetrics,
    clientTimestamps = [],
    clientLandmarks = []
  } = req.body;

  // Run backend authenticity verification
  const authAnalysis = AuthenticityService.verifySubmissionAuthenticity({
    timestamps: clientTimestamps,
    landmarks: clientLandmarks,
    duration: durationSeconds,
    testType: testId
  });

  const athlete = db.athleteProfiles.find(a => a.id === athleteId);
  const newSubmission = {
    id: `sub_${Date.now()}`,
    athleteId,
    athleteName: athlete ? athlete.fullName : 'Rural Athlete',
    testId,
    recordedAt: recordedAt || new Date().toISOString(),
    durationSeconds: durationSeconds || 60,
    status: authAnalysis.isAuthentic ? 'verified' : 'needs_review',
    authenticityStatus: authAnalysis.isAuthentic ? 'authentic' : 'suspicious',
    authenticityConfidence: authAnalysis.confidence,
    aiConfidence: rawMetrics?.confidence || 0.91,
    primaryScore: primaryScore || validReps || 0,
    primaryUnit: primaryUnit || 'reps',
    validReps: validReps || 0,
    invalidReps: invalidReps || 0,
    warnings: authAnalysis.warnings,
    syncedAt: new Date().toISOString()
  };

  db.submissions.unshift(newSubmission);
  res.status(201).json({ submission: newSubmission, authenticity: authAnalysis });
});

// BATCH SYNC ENDPOINT (FOR OFFLINE FLUTTER APP STORE-AND-FORWARD)
app.post('/api/sync', (req, res) => {
  const { queue = [] } = req.body;
  const processed = [];
  const errors = [];

  for (const item of queue) {
    try {
      const authAnalysis = AuthenticityService.verifySubmissionAuthenticity({
        timestamps: item.clientTimestamps || [],
        landmarks: item.clientLandmarks || [],
        duration: item.durationSeconds,
        testType: item.testId
      });

      const syncedSubmission = {
        id: `sub_sync_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        athleteId: item.athleteId,
        athleteName: item.athleteName || 'Offline Athlete',
        testId: item.testId,
        recordedAt: item.recordedAt,
        durationSeconds: item.durationSeconds,
        status: authAnalysis.isAuthentic ? 'verified' : 'needs_review',
        authenticityStatus: authAnalysis.isAuthentic ? 'authentic' : 'suspicious',
        authenticityConfidence: authAnalysis.confidence,
        aiConfidence: item.aiConfidence || 0.89,
        primaryScore: item.primaryScore,
        primaryUnit: item.primaryUnit,
        validReps: item.validReps || 0,
        invalidReps: item.invalidReps || 0,
        warnings: authAnalysis.warnings,
        clientLocalId: item.localId,
        syncedAt: new Date().toISOString()
      };

      db.submissions.unshift(syncedSubmission);
      processed.push({ localId: item.localId, serverId: syncedSubmission.id, status: 'SYNCED' });
    } catch (err) {
      errors.push({ localId: item.localId, error: err.message });
    }
  }

  res.json({
    message: `Batch sync complete: ${processed.length} synced, ${errors.length} failed`,
    syncedItems: processed,
    errors
  });
});

// ADMIN / COACH SCOUTING ENDPOINTS
app.get('/api/admin/athletes', (req, res) => {
  const { search, state, district, talentTier } = req.query;
  let results = [...db.athleteProfiles];

  if (search) {
    const q = search.toLowerCase();
    results = results.filter(a => a.fullName.toLowerCase().includes(q) || a.district.toLowerCase().includes(q));
  }
  if (state) {
    results = results.filter(a => a.state.toLowerCase() === state.toLowerCase());
  }

  // Enrich with aggregated stats
  const enriched = results.map(ath => {
    const athSubs = db.submissions.filter(s => s.athleteId === ath.id);
    const verifiedSubs = athSubs.filter(s => s.status === 'verified');
    return {
      ...ath,
      totalTests: athSubs.length,
      verifiedTests: verifiedSubs.length,
      latestTest: athSubs[0] || null
    };
  });

  res.json({ athletes: enriched });
});

app.get('/api/admin/submissions', (req, res) => {
  res.json({ submissions: db.submissions });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Sports Talent Assessment Backend running on port ${PORT}`);
  });
}

module.exports = app;
