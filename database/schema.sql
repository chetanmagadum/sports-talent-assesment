-- ==============================================================================
-- AI-Powered Mobile Platform for Democratizing Sports Talent Assessment
-- Database Schema for Supabase (PostgreSQL)
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'athlete' CHECK (role IN ('athlete', 'coach', 'admin', 'scout')),
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. ATHLETE PROFILES TABLE
CREATE TABLE IF NOT EXISTS athlete_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date_of_birth DATE NOT NULL,
    age INT,
    gender VARCHAR(20) NOT NULL CHECK (gender IN ('male', 'female', 'other')),
    height_cm NUMERIC(5, 2),
    weight_kg NUMERIC(5, 2),
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    village_or_town VARCHAR(150),
    preferred_sport VARCHAR(100),
    aadhaar_verified BOOLEAN DEFAULT FALSE,
    profile_image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. FITNESS TESTS TABLE (Standardized protocol definitions)
CREATE TABLE IF NOT EXISTS fitness_tests (
    id VARCHAR(50) PRIMARY KEY, -- e.g., 'sit_ups', 'vertical_jump', 'shuttle_run', 'endurance_run'
    name VARCHAR(150) NOT NULL,
    category VARCHAR(100) NOT NULL, -- e.g., 'Core Endurance', 'Lower Body Power', 'Agility'
    description TEXT NOT NULL,
    instructions TEXT NOT NULL,
    duration_seconds INT NOT NULL DEFAULT 60,
    metric_type VARCHAR(50) NOT NULL, -- 'reps', 'height_cm', 'time_seconds', 'distance_meters'
    camera_placement_guideline TEXT NOT NULL,
    target_landmarks TEXT[] DEFAULT ARRAY['left_shoulder', 'right_shoulder', 'left_hip', 'right_hip', 'left_knee', 'right_knee'],
    national_benchmark_male NUMERIC(10, 2),
    national_benchmark_female NUMERIC(10, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. TEST SUBMISSIONS TABLE
CREATE TABLE IF NOT EXISTS test_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    athlete_id UUID NOT NULL REFERENCES athlete_profiles(id) ON DELETE CASCADE,
    test_id VARCHAR(50) NOT NULL REFERENCES fitness_tests(id),
    recorded_at TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_seconds NUMERIC(6, 2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'analyzing', 'verified', 'needs_review', 'flagged', 'rejected')),
    authenticity_status VARCHAR(50) NOT NULL DEFAULT 'unverified' CHECK (authenticity_status IN ('authentic', 'suspicious', 'tampered', 'unverified')),
    authenticity_confidence NUMERIC(5, 2) DEFAULT 0.00,
    ai_confidence NUMERIC(5, 2) DEFAULT 0.00,
    authenticity_warnings TEXT[] DEFAULT ARRAY[]::TEXT[],
    client_local_id VARCHAR(100),
    device_model VARCHAR(150),
    synced_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. PERFORMANCE RESULTS TABLE (Kinematic & biomechanical outputs)
CREATE TABLE IF NOT EXISTS performance_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    submission_id UUID NOT NULL REFERENCES test_submissions(id) ON DELETE CASCADE,
    primary_score NUMERIC(10, 2) NOT NULL, -- e.g., 34 reps or 48.5 cm
    primary_metric_unit VARCHAR(30) NOT NULL,
    total_repetitions INT DEFAULT 0,
    valid_repetitions INT DEFAULT 0,
    invalid_repetitions INT DEFAULT 0,
    jump_height_cm NUMERIC(6, 2),
    takeoff_velocity_mps NUMERIC(6, 2),
    flight_time_seconds NUMERIC(6, 3),
    lap_times_seconds NUMERIC(6, 2)[],
    cadence_spm INT,
    average_joint_angle_degrees NUMERIC(6, 2),
    tempo_seconds_per_rep NUMERIC(5, 2),
    form_consistency_score NUMERIC(5, 2), -- 0 to 100
    raw_metrics JSONB, -- Frame-by-frame angles and key landmark trajectories
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. TEST VIDEOS TABLE
CREATE TABLE IF NOT EXISTS test_videos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    submission_id UUID NOT NULL REFERENCES test_submissions(id) ON DELETE CASCADE,
    storage_path TEXT NOT NULL,
    file_size_bytes BIGINT,
    frame_rate INT DEFAULT 30,
    resolution VARCHAR(30) DEFAULT '720p',
    checksum_hash VARCHAR(128),
    upload_status VARCHAR(50) DEFAULT 'completed' CHECK (upload_status IN ('pending', 'uploading', 'completed', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. AUDIT & COACH REVIEWS
CREATE TABLE IF NOT EXISTS coach_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    submission_id UUID NOT NULL REFERENCES test_submissions(id) ON DELETE CASCADE,
    coach_id UUID NOT NULL REFERENCES users(id),
    status VARCHAR(50) NOT NULL CHECK (status IN ('approved', 'flagged_for_retest', 'disqualified')),
    feedback_notes TEXT,
    scouting_interest_level VARCHAR(30) DEFAULT 'medium' CHECK (scouting_interest_level IN ('none', 'low', 'medium', 'high', 'priority_talent')),
    reviewed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_submissions_athlete ON test_submissions(athlete_id);
CREATE INDEX IF NOT EXISTS idx_submissions_test ON test_submissions(test_id);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON test_submissions(status);
CREATE INDEX IF NOT EXISTS idx_profiles_district ON athlete_profiles(state, district);
CREATE INDEX IF NOT EXISTS idx_results_submission ON performance_results(submission_id);

-- SEED STANDARDIZED FITNESS TESTS
INSERT INTO fitness_tests (id, name, category, description, instructions, duration_seconds, metric_type, camera_placement_guideline, national_benchmark_male, national_benchmark_female)
VALUES
('sit_ups', '1-Minute Abdominal Sit-ups', 'Core Muscular Endurance', 
 'Assesses core endurance through continuous trunk flexion while lying supine with knees bent.',
 '1. Lie flat on mat with knees bent at ~90 degrees.
2. Cross arms on chest or keep hands touching ears.
3. Elevate torso until elbows touch thighs/knees.
4. Lower torso until shoulder blades contact the floor.
5. Complete maximum valid repetitions within 60 seconds.',
 60, 'reps', 'Place camera on tripod/stable ground 2-2.5 meters away perpendicular to the athlete (side-on profile view at hip height).', 45, 38),

('vertical_jump', 'Countermovement Vertical Jump', 'Lower Body Explosive Power',
 'Evaluates lower body explosive power by measuring flight time and vertical hip displacement.',
 '1. Stand tall with feet shoulder-width apart in full camera frame.
2. When ready, perform a quick countermovement squat dip.
3. Explode vertically upward reaching for maximum height.
4. Land on both feet softly with knees absorbing impact.
5. 3 valid attempts recorded; highest jump counts.',
 30, 'height_cm', 'Position camera 3 meters directly perpendicular to the sagittal or frontal plane, keeping entire body visible from toes to overhead reach.', 52.0, 42.0),

('shuttle_run', '4 x 10m Agility Shuttle Run', 'Agility & Acceleration',
 'Assesses speed, acceleration, and rapid direction-change agility between two 10m marker cones.',
 '1. Start behind line A in athletic staggered stance.
2. On start signal, sprint 10 meters to line B.
3. Pick up/touch line B block and sprint back to line A.
4. Repeat for total of 4 lengths (40m total).
5. Minimize turnaround time without stepping over markings.',
 45, 'time_seconds', 'Place smartphone at mid-court (5m line) raised 1.2m off ground, with wide lens showing both turnaround lines.', 9.8, 10.9),

('endurance_run', '600m / 1.6km Aerobic Run', 'Cardiorespiratory Endurance',
 'Measures aerobic endurance and running economy over timed distance.',
 '1. Start behind the track or measured boundary line.
2. Maintain steady, sustainable racing pace.
3. Complete designated laps or loop distance.
4. Smartphone records cadence, split times, and total duration.',
 300, 'time_seconds', 'Position smartphone at designated checkpoint/finish line or handheld by coach/evaluator.', 135, 160)
ON CONFLICT (id) DO NOTHING;
