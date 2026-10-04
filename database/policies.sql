-- ==============================================================================
-- Supabase Row Level Security (RLS) Policies
-- AI-Powered Mobile Platform for Democratizing Sports Talent Assessment
-- ==============================================================================

-- Enable RLS on all core tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE athlete_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE fitness_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE coach_reviews ENABLE ROW LEVEL SECURITY;

-- 1. USERS POLICIES
-- Users can view their own profile; admins/coaches can view user metadata
CREATE POLICY "Users can view their own user account"
    ON users FOR SELECT
    USING (auth.uid() = id OR (SELECT role FROM users WHERE id = auth.uid()) IN ('coach', 'admin', 'scout'));

CREATE POLICY "Users can update their own user account"
    ON users FOR UPDATE
    USING (auth.uid() = id);

-- 2. ATHLETE PROFILES POLICIES
-- Athletes can manage their own profile; scouts and coaches can search and view all profiles
CREATE POLICY "Athletes can view their own profile"
    ON athlete_profiles FOR SELECT
    USING (user_id = auth.uid() OR (SELECT role FROM users WHERE id = auth.uid()) IN ('coach', 'admin', 'scout'));

CREATE POLICY "Athletes can insert and update their profile"
    ON athlete_profiles FOR ALL
    USING (user_id = auth.uid());

-- 3. FITNESS TESTS POLICIES
-- Standardized fitness protocols are public read for all authenticated users
CREATE POLICY "Anyone can view fitness tests protocol"
    ON fitness_tests FOR SELECT
    USING (true);

-- 4. TEST SUBMISSIONS POLICIES
-- Athletes can insert and view their own submissions; coaches and admins can view all
CREATE POLICY "Athletes can insert their submissions"
    ON test_submissions FOR INSERT
    WITH CHECK (athlete_id IN (SELECT id FROM athlete_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Athletes can read their submissions"
    ON test_submissions FOR SELECT
    USING (
        athlete_id IN (SELECT id FROM athlete_profiles WHERE user_id = auth.uid())
        OR (SELECT role FROM users WHERE id = auth.uid()) IN ('coach', 'admin', 'scout')
    );

CREATE POLICY "Admins and coaches can update submission status"
    ON test_submissions FOR UPDATE
    USING ((SELECT role FROM users WHERE id = auth.uid()) IN ('coach', 'admin'));

-- 5. PERFORMANCE RESULTS POLICIES
CREATE POLICY "Read performance results"
    ON performance_results FOR SELECT
    USING (
        submission_id IN (
            SELECT ts.id FROM test_submissions ts
            JOIN athlete_profiles ap ON ts.athlete_id = ap.id
            WHERE ap.user_id = auth.uid()
        )
        OR (SELECT role FROM users WHERE id = auth.uid()) IN ('coach', 'admin', 'scout')
    );

CREATE POLICY "Insert performance results from verified analysis"
    ON performance_results FOR INSERT
    WITH CHECK (
        submission_id IN (
            SELECT ts.id FROM test_submissions ts
            JOIN athlete_profiles ap ON ts.athlete_id = ap.id
            WHERE ap.user_id = auth.uid()
        )
        OR (SELECT role FROM users WHERE id = auth.uid()) IN ('coach', 'admin')
    );

-- 6. TEST VIDEOS POLICIES
CREATE POLICY "Access test videos"
    ON test_videos FOR SELECT
    USING (
        submission_id IN (
            SELECT ts.id FROM test_submissions ts
            JOIN athlete_profiles ap ON ts.athlete_id = ap.id
            WHERE ap.user_id = auth.uid()
        )
        OR (SELECT role FROM users WHERE id = auth.uid()) IN ('coach', 'admin', 'scout')
    );

-- 7. COACH REVIEWS POLICIES
CREATE POLICY "Coaches can insert and manage reviews"
    ON coach_reviews FOR ALL
    USING ((SELECT role FROM users WHERE id = auth.uid()) IN ('coach', 'admin', 'scout'));

CREATE POLICY "Athletes can view reviews of their submissions"
    ON coach_reviews FOR SELECT
    USING (
        submission_id IN (
            SELECT ts.id FROM test_submissions ts
            JOIN athlete_profiles ap ON ts.athlete_id = ap.id
            WHERE ap.user_id = auth.uid()
        )
    );
