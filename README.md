# AI-Powered Mobile Platform for Democratizing Sports Talent Assessment

A college-level working prototype designed to identify and assess athletic talent in rural and underprivileged regions using a standard smartphone, AI-powered computer vision pose estimation, biomechanical authenticity verification, offline store-and-forward synchronization, and a centralized scout/coach analytics portal.

---

## 1. System Architecture

```text
               ATHLETE IN RURAL / GRASSROOTS REGION
                                ↓
               FLUTTER ANDROID APPLICATION
                                ↓
          ┌──────────────────────────────────────────┐
          │  Standardized Test Protocol Selection    │
          │  (Sit-ups, Vertical Jump, Shuttle, Run)  │
          └──────────────────────────────────────────┘
                                ↓
                 Audio & Visual Placement Guide
                                ↓
                 Smartphone Camera Video Recording
                                ↓
             Local Video & Frame Stream Buffer
                                ↓
     ┌───────────────────────────────────────────────────┐
     │           AI / COMPUTER VISION PROCESSING         │
     │  - MediaPipe Human Pose Extraction (33 Keypoints) │
     │  - Real-time Joint Angle Derivations (θ)          │
     │  - Repetition State Machines & Flight-Time Physics│
     │  - Biomechanical Metrics Calculation              │
     └───────────────────────────────────────────────────┘
                                ↓
     ┌───────────────────────────────────────────────────┐
     │        AUTHENTICITY & INTEGRITY VERIFICATION      │
     │  - Frame Rate Discontinuity & Splice Detection    │
     │  - Solo Candidate Validation (Multi-Person Flag)  │
     │  - Biomechanical Velocity Anomaly Detection       │
     │  - Occlusion & Landmark Continuity Rating         │
     └───────────────────────────────────────────────────┘
                                ↓
               Local Offline SQLite / Hive Storage
                                ↓
                  IS INTERNET DETECTED?
                 ├── NO  → Enqueue with Status: PENDING / RETRY
                 └── YES → Batch Sync Protocol
                                ↓
              NODE.JS / EXPRESS REST BACKEND
                                ↓
              SUPABASE POSTGRESQL & OBJECT STORAGE
                                ↓
              COACH / SCOUT TALENT RADAR PORTAL
          (Scouting Pipeline, Benchmark Filters, CSV Export)
```

---

## 2. Directory Structure

```text
sports-talent-platform/
│
├── mobile/                           # Flutter Android Mobile App
│   ├── lib/
│   │   ├── main.dart                 # Application entrypoint & routing
│   │   ├── ai/
│   │   │   ├── pose_processor.dart   # Abstract PoseProcessor base class
│   │   │   ├── situp_analyzer.dart   # FSM for trunk flexion & rep validation
│   │   │   ├── vertical_jump_analyzer.dart # Flight-time & hip displacement
│   │   │   └── authenticity_analyzer.dart  # Multi-factor integrity analysis
│   │   ├── database/
│   │   │   └── offline_database.dart # SQLite offline storage & sync queue
│   │   └── models/                   # Dart data models
│   └── pubspec.yaml                  # Flutter package dependencies
│
├── backend/                          # Node.js / Express Centralized API
│   ├── src/
│   │   ├── server.js                 # Express server & REST endpoints
│   │   └── services/
│   │       └── authenticityService.js# Server-side validation & auditing
│   ├── package.json
│   └── .env.example
│
├── database/                         # Relational Database Definitions
│   ├── schema.sql                    # PostgreSQL / Supabase table definitions
│   └── policies.sql                  # Supabase Row Level Security (RLS) policies
│
├── src/                              # Interactive Live Prototype (React + Vite)
│   ├── ai/                           # Web-ready Pose & Biomechanical Analyzers
│   ├── components/
│   │   ├── mobile/                   # Interactive Smartphone Simulator
│   │   ├── admin/                    # Scout & Coach Analytics Portal
│   │   └── common/                   # Network Simulator & Monorepo Explorer
│   └── services/                     # Offline storage & IndexedDB synchronization
│
└── README.md
```

---

## 3. Standardized Fitness Tests Protocol

| Test Name | Measured Attribute | Biomechanical Metric | Algorithmic Method | National Male Benchmark | National Female Benchmark |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1-Min Sit-ups** | Core Muscular Endurance | Valid Repetitions | State machine measuring hip-shoulder-knee flexion ($140^\circ \rightarrow \le 65^\circ$) | 45 reps | 38 reps |
| **Vertical Jump** | Explosive Lower Body Power | Jump Height (cm) | Ballistic flight time equation: $h = \frac{1}{8} g t_{\text{flight}}^2$ + hip displacement | 52.0 cm | 42.0 cm |
| **4x10m Shuttle** | Agility & Acceleration | Elapsed Time (s) | Motion velocity pivot detection at $10\text{m}$ marker boundaries | $< 9.8\text{ s}$ | $< 10.9\text{ s}$ |
| **600m Aerobic Run** | Cardiorespiratory Endurance | Split Times & Cadence | Stride frequency tracking and finish-line checkpoint detection | $< 135\text{ s}$ | $< 160\text{ s}$ |

---

## 4. Biomechanical Authenticity & Anti-Cheating Module

The platform protects against video manipulation, physical cheating, and coach interference using a 4-tier check:

1. **Frame Rate Delta Analysis**: Analyzes timestamp differences ($\Delta t$) between consecutive video frames. Irregular spikes ($>2.8\times \mu$) flag video splicing, cuts, or artificial speed modifications.
2. **Solo Candidate Validation**: Tracks detected human skeletons across the frame. If multiple bodies are detected during recording, flags an alert for coaching assistance, physical pushing, or athlete substitution.
3. **Kinematic Velocity Boundary Check**: Computes displacement speed of primary keypoints (e.g. hip and ankles). Movements exceeding physiological biomechanical limits ($>15\text{ m/s}$ instantaneous change) indicate video splicing or frame drops.
4. **Occlusion & Landmark Drop Ratio**: Ensures candidate's full body remains in camera bounds. Submissions with $>25\%$ missing keypoints are flagged for review.

---

## 5. Offline Store-and-Forward Protocol

Because rural athletes often train in fields with intermittent or zero 2G/3G connectivity:
1. **Local Recording & Analysis**: All tests are fully recorded and analyzed on-device or locally buffered.
2. **Local Database Storage**: Video, kinematic landmark metrics, rep counts, and authenticity reports are written immediately to the local SQLite database with `sync_status = 'pending'`.
3. **Network Connectivity Listener**: The application monitors network state via `connectivity_plus` / browser online events.
4. **Batch Sync Enqueue**: Once an active connection is restored, pending records transition to `UPLOADING`, send compressed payload and video checksum to `/api/sync`, and on confirmation transition to `SYNCED`.

---

## 6. How to Run

### A. Interactive Prototype (Web)
The web application running in this environment provides a complete, interactive simulation of both the **Athlete Mobile Experience** and the **Coach/Admin Scouting Portal**:
```bash
npm install
npm run dev
```
Open browser at `http://localhost:3000`.

### B. Node.js Backend
```bash
cd backend
npm install
cp .env.example .env
npm start
```
Runs Express REST API on `http://localhost:5000`.

### C. Flutter Mobile Application (Android)
```bash
cd mobile
flutter pub get
flutter run
```

---

## 7. Demo Credentials

- **Athlete Demo**:
  - Email: `athlete@sportsdemo.org`
  - Password: `demo123`
  - Profile: *Ramesh Kumar (Age 17, Satara, Maharashtra - Athletics)*
- **Coach / Scout Demo**:
  - Email: `coach@sportsdemo.org`
  - Password: `admin123`
  - Role: *Balwant Singh (National Sports Authority Scout)*

---

## 8. College Project Verification & Limitations

- **Prototype Scope**: Designed as an accessible college-level working prototype demonstrating computer vision pose assessment on mobile smartphones.
- **Estimated Heights**: Vertical jump height is derived via kinematic flight-time and pixel calibration; labeled clearly as an **estimate** in compliance with Rule 18.
- **Lighting & Angle**: Requires adequate daylight or floodlights and perpendicular camera orientation for optimal landmark visibility.
