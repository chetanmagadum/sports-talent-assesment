import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
  ]);
  runApp(const SportsTalentApp());
}

class SportsTalentApp extends StatelessWidget {
  const SportsTalentApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Sports Talent AI',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: const Color(0xFF0F172A),
        primaryColor: const Color(0xFF10B981),
        colorScheme: const ColorScheme.dark(
          primary: Color(0xFF10B981),
          secondary: Color(0xFF06B6D4),
          surface: Color(0xFF1E293B),
        ),
        fontFamily: 'Roboto',
        textTheme: const TextTheme(
          headlineMedium: TextStyle(fontSize: 26, fontWeight: FontWeight.bold, color: Colors.white),
          titleLarge: TextStyle(fontSize: 20, fontWeight: FontWeight.w600, color: Colors.white),
          bodyLarge: TextStyle(fontSize: 16, color: Color(0xFFCBD5E1)),
        ),
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            backgroundColor: const Color(0xFF10B981),
            foregroundColor: Colors.white,
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
            textStyle: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),
        ),
      ),
      home: const SplashScreen(),
    );
  }
}

class SplashScreen extends StatefulWidget {
  const SplashScreen({Key? key}) : super(key: key);

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();
    Future.delayed(const Duration(seconds: 2), () {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (context) => const AthleteDashboardScreen()),
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: const Color(0xFF10B981).withOpacity(0.15),
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.fitness_center_rounded, size: 72, color: Color(0xFF10B981)),
            ),
            const SizedBox(height: 24),
            const Text(
              'Sports Talent AI',
              style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: Colors.white),
            ),
            const SizedBox(height: 8),
            const Text(
              'Democratizing Grassroots Athlete Discovery',
              style: TextStyle(fontSize: 14, color: Color(0xFF94A3B8)),
            ),
            const SizedBox(height: 36),
            const CircularProgressIndicator(color: Color(0xFF10B981)),
          ],
        ),
      ),
    );
  }
}

class AthleteDashboardScreen extends StatefulWidget {
  const AthleteDashboardScreen({Key? key}) : super(key: key);

  @override
  State<AthleteDashboardScreen> createState() => _AthleteDashboardScreenState();
}

class _AthleteDashboardScreenState extends State<AthleteDashboardScreen> {
  bool isOnline = true;
  int pendingSyncCount = 1;

  final List<Map<String, dynamic>> tests = [
    {
      'id': 'sit_ups',
      'title': '1-Min Sit-ups',
      'category': 'Core Muscular Endurance',
      'target': '35+ Reps',
      'icon': Icons.accessibility_new_rounded,
      'color': Color(0xFF10B981),
    },
    {
      'id': 'vertical_jump',
      'title': 'Vertical Jump',
      'category': 'Lower Body Explosive Power',
      'target': '48+ cm',
      'icon': Icons.arrow_upward_rounded,
      'color': Color(0xFF3B82F6),
    },
    {
      'id': 'shuttle_run',
      'title': '4 x 10m Shuttle Run',
      'category': 'Agility & Speed',
      'target': '< 10.2 sec',
      'icon': Icons.directions_run_rounded,
      'color': Color(0xFFF59E0B),
    },
    {
      'id': 'endurance_run',
      'title': '600m Aerobic Run',
      'category': 'Cardiovascular Capacity',
      'target': '< 2m 15s',
      'icon': Icons.timer_rounded,
      'color': Color(0xFFEC4899),
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: const Color(0xFF1E293B),
        title: const Text('Athlete Portal', style: TextStyle(fontWeight: FontWeight.bold)),
        actions: [
          Container(
            margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
            decoration: BoxDecoration(
              color: isOnline ? Colors.green.withOpacity(0.2) : Colors.amber.withOpacity(0.2),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(
                color: isOnline ? Colors.green : Colors.amber,
                width: 1,
              ),
            ),
            child: Row(
              children: [
                Icon(
                  isOnline ? Icons.wifi : Icons.wifi_off,
                  size: 16,
                  color: isOnline ? Colors.greenAccent : Colors.amberAccent,
                ),
                const SizedBox(width: 6),
                Text(
                  isOnline ? 'Online' : 'Offline Mode',
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                    color: isOnline ? Colors.greenAccent : Colors.amberAccent,
                  ),
                ),
              ],
            ),
          )
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Athlete Profile Card
            Container(
              padding: const EdgeInsets.all(18),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFF1E293B), Color(0xFF0F172A)],
                ),
                borderRadius: BorderRadius.circular(18),
                border: Border.all(color: Colors.white12),
              ),
              child: Row(
                children: [
                  const CircleAvatar(
                    radius: 32,
                    backgroundColor: Color(0xFF10B981),
                    child: Text('RK', style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: Colors.white)),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: const [
                        Text('Ramesh Kumar', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
                        SizedBox(height: 4),
                        Text('Age 17 • Satara, Maharashtra', style: TextStyle(color: Color(0xFF94A3B8), fontSize: 14)),
                        SizedBox(height: 4),
                        Text('Category: High Potential Tier-1', style: TextStyle(color: Color(0xFF10B981), fontWeight: FontWeight.w600, fontSize: 13)),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            if (pendingSyncCount > 0) ...[
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: Colors.amber.withOpacity(0.12),
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: Colors.amber.withOpacity(0.3)),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.sync_problem_rounded, color: Colors.amber),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Text(
                        '$pendingSyncCount test saved locally awaiting network sync',
                        style: const TextStyle(fontSize: 13, color: Colors.amberAccent),
                      ),
                    ),
                    ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.amber,
                        foregroundColor: Colors.black84,
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                      ),
                      onPressed: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Syncing pending tests to centralized cloud...')),
                        );
                        setState(() => pendingSyncCount = 0);
                      },
                      child: const Text('Sync Now', style: TextStyle(fontSize: 12)),
                    )
                  ],
                ),
              ),
            ],

            const SizedBox(height: 24),
            const Text('Standardized Fitness Tests', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 6),
            const Text('Select a test to record with AI posture guidance', style: TextStyle(fontSize: 13, color: Color(0xFF94A3B8))),
            const SizedBox(height: 16),

            ...tests.map((t) => Container(
              margin: const EdgeInsets.only(bottom: 14),
              decoration: BoxDecoration(
                color: const Color(0xFF1E293B),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.white10),
              ),
              child: ListTile(
                contentPadding: const EdgeInsets.symmetric(horizontal: 18, vertical: 10),
                leading: Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: (t['color'] as Color).withOpacity(0.2),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(t['icon'], color: t['color'], size: 28),
                ),
                title: Text(t['title'], style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 17)),
                subtitle: Text('${t['category']} • Benchmark: ${t['target']}', style: const TextStyle(fontSize: 13, color: Color(0xFF94A3B8))),
                trailing: const Icon(Icons.arrow_forward_ios_rounded, size: 18, color: Colors.white54),
                onTap: () {
                  // Navigate to instructions & test recording
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text('Starting ${t['title']} protocol...')),
                  );
                },
              ),
            )),
          ],
        ),
      ),
    );
  }
}
