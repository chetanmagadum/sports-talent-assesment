import 'dart:convert';
import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';

enum SyncStatus {
  pending,
  uploading,
  synced,
  failed,
  retry,
}

class LocalSubmissionRecord {
  final String localId;
  final String athleteId;
  final String testId;
  final String testName;
  final double primaryScore;
  final String primaryUnit;
  final int validReps;
  final int invalidReps;
  final double durationSeconds;
  final double aiConfidence;
  final double authenticityConfidence;
  final bool isAuthentic;
  final List<String> warnings;
  final String localVideoPath;
  final DateTime recordedAt;
  final SyncStatus syncStatus;
  final String? serverId;

  LocalSubmissionRecord({
    required this.localId,
    required this.athleteId,
    required this.testId,
    required this.testName,
    required this.primaryScore,
    required this.primaryUnit,
    required this.validReps,
    required this.invalidReps,
    required this.durationSeconds,
    required this.aiConfidence,
    required this.authenticityConfidence,
    required this.isAuthentic,
    required this.warnings,
    required this.localVideoPath,
    required this.recordedAt,
    required this.syncStatus,
    this.serverId,
  });

  Map<String, dynamic> toMap() {
    return {
      'local_id': localId,
      'athlete_id': athleteId,
      'test_id': testId,
      'test_name': testName,
      'primary_score': primaryScore,
      'primary_unit': primaryUnit,
      'valid_reps': validReps,
      'invalid_reps': invalidReps,
      'duration_seconds': durationSeconds,
      'ai_confidence': aiConfidence,
      'authenticity_confidence': authenticityConfidence,
      'is_authentic': isAuthentic ? 1 : 0,
      'warnings_json': jsonEncode(warnings),
      'local_video_path': localVideoPath,
      'recorded_at': recordedAt.toIso8601String(),
      'sync_status': syncStatus.name,
      'server_id': serverId,
    };
  }

  factory LocalSubmissionRecord.fromMap(Map<String, dynamic> map) {
    return LocalSubmissionRecord(
      localId: map['local_id'],
      athleteId: map['athlete_id'],
      testId: map['test_id'],
      testName: map['test_name'],
      primaryScore: map['primary_score'],
      primaryUnit: map['primary_unit'],
      validReps: map['valid_reps'] ?? 0,
      invalidReps: map['invalid_reps'] ?? 0,
      durationSeconds: map['duration_seconds'],
      aiConfidence: map['ai_confidence'],
      authenticityConfidence: map['authenticity_confidence'],
      isAuthentic: map['is_authentic'] == 1,
      warnings: List<String>.from(jsonDecode(map['warnings_json'] ?? '[]')),
      localVideoPath: map['local_video_path'] ?? '',
      recordedAt: DateTime.parse(map['recorded_at']),
      syncStatus: SyncStatus.values.firstWhere(
        (e) => e.name == map['sync_status'],
        orElse: () => SyncStatus.pending,
      ),
      serverId: map['server_id'],
    );
  }
}

class OfflineDatabase {
  static final OfflineDatabase instance = OfflineDatabase._init();
  static Database? _database;

  OfflineDatabase._init();

  Future<Database> get database async {
    if (_database != null) return _database!;
    _database = await _initDB('sports_talent_offline.db');
    return _database!;
  }

  Future<Database> _initDB(String filePath) async {
    final dbPath = await getDatabasesPath();
    final path = join(dbPath, filePath);

    return await openDatabase(
      path,
      version: 1,
      onCreate: _createDB,
    );
  }

  Future<void> _createDB(Database db, int version) async {
    await db.execute('''
      CREATE TABLE local_submissions (
        local_id TEXT PRIMARY KEY,
        athlete_id TEXT NOT NULL,
        test_id TEXT NOT NULL,
        test_name TEXT NOT NULL,
        primary_score REAL NOT NULL,
        primary_unit TEXT NOT NULL,
        valid_reps INTEGER DEFAULT 0,
        invalid_reps INTEGER DEFAULT 0,
        duration_seconds REAL NOT NULL,
        ai_confidence REAL NOT NULL,
        authenticity_confidence REAL NOT NULL,
        is_authentic INTEGER NOT NULL,
        warnings_json TEXT NOT NULL,
        local_video_path TEXT,
        recorded_at TEXT NOT NULL,
        sync_status TEXT NOT NULL,
        server_id TEXT
      )
    ''');
  }

  Future<void> insertSubmission(LocalSubmissionRecord record) async {
    final db = await instance.database;
    await db.insert('local_submissions', record.toMap(), conflictAlgorithm: ConflictAlgorithm.replace);
  }

  Future<List<LocalSubmissionRecord>> getAllSubmissions() async {
    final db = await instance.database;
    final maps = await db.query('local_submissions', orderBy: 'recorded_at DESC');
    return maps.map((m) => LocalSubmissionRecord.fromMap(m)).toList();
  }

  Future<List<LocalSubmissionRecord>> getPendingSubmissions() async {
    final db = await instance.database;
    final maps = await db.query(
      'local_submissions',
      where: 'sync_status = ? OR sync_status = ?',
      whereArgs: [SyncStatus.pending.name, SyncStatus.retry.name],
    );
    return maps.map((m) => LocalSubmissionRecord.fromMap(m)).toList();
  }

  Future<void> updateSyncStatus(String localId, SyncStatus status, {String? serverId}) async {
    final db = await instance.database;
    await db.update(
      'local_submissions',
      {
        'sync_status': status.name,
        if (serverId != null) 'server_id': serverId,
      },
      where: 'local_id = ?',
      whereArgs: [localId],
    );
  }
}
