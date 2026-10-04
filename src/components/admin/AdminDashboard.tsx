import React, { useState } from 'react';
import {
  Users,
  Award,
  CheckCircle2,
  AlertTriangle,
  Search,
  Filter,
  Download,
  Eye,
  Flame,
  ArrowUpDown,
  ShieldCheck,
  ShieldAlert,
  BarChart3,
  MapPin,
  Calendar,
  X,
  FileText,
  Activity,
  UserCheck,
} from 'lucide-react';
import { AthleteProfile, TestSubmission, FitnessTest } from '../../types';

interface AdminDashboardProps {
  athletes: AthleteProfile[];
  submissions: TestSubmission[];
  tests: FitnessTest[];
  onSelectAthlete: (athlete: AthleteProfile) => void;
  selectedAthlete: AthleteProfile | null;
  onCloseAthleteModal: () => void;
  onUpdateSubmissionStatus: (submissionId: string, status: any) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  athletes,
  submissions,
  tests,
  onSelectAthlete,
  selectedAthlete,
  onCloseAthleteModal,
  onUpdateSubmissionStatus,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [viewingSubmission, setViewingSubmission] = useState<TestSubmission | null>(null);

  // Aggregated scout analytics
  const totalAthletes = athletes.length;
  const totalSubmissions = submissions.length;
  const verifiedSubmissions = submissions.filter(s => s.status === 'verified').length;
  const reviewSubmissions = submissions.filter(s => s.status === 'needs_review' || s.authenticityStatus === 'suspicious').length;
  const pendingSync = submissions.filter(s => s.syncStatus === 'pending' || s.syncStatus === 'retry').length;
  const authenticityRate = totalSubmissions > 0 ? Math.round((verifiedSubmissions / totalSubmissions) * 100) : 100;

  // Filtered athletes list
  const filteredAthletes = athletes.filter(ath => {
    const matchesSearch =
      ath.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ath.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ath.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ath.preferredSport.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesState = selectedState === 'ALL' || ath.state === selectedState;
    const matchesCategory = selectedCategory === 'ALL' || ath.nationalTalentCategory.includes(selectedCategory);

    return matchesSearch && matchesState && matchesCategory;
  });

  const states = Array.from(new Set(athletes.map(a => a.state)));

  // Export CSV functionality
  const handleExportCSV = () => {
    const headers = ['Athlete Name', 'Age', 'Gender', 'State', 'District', 'Sport', 'Total Tests', 'Verified Tests', 'Talent Tier'];
    const rows = filteredAthletes.map(a => {
      const athSubs = submissions.filter(s => s.athleteId === a.id);
      const vSubs = athSubs.filter(s => s.status === 'verified');
      return [
        `"${a.fullName}"`,
        a.age,
        a.gender,
        `"${a.state}"`,
        `"${a.district}"`,
        `"${a.preferredSport}"`,
        athSubs.length,
        vSubs.length,
        `"${a.nationalTalentCategory}"`
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SportsTalent_Scout_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Top Header & Scout Title */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
              Scout & Coach Analytics Portal
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
              SAI Protocol Compliant
            </span>
          </div>
          <p className="text-xs md:text-sm text-slate-400 mt-0.5">
            Grassroots athlete discovery pipeline powered by MediaPipe biomechanical assessment.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition"
        >
          <Download className="w-4 h-4 text-emerald-400" />
          <span>Export Talent CSV</span>
        </button>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase">Total Athletes</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">{totalAthletes}</div>
          <p className="text-[11px] text-slate-500 mt-1">Across 6 States</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase">Tests Assessed</span>
            <Activity className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white">{totalSubmissions}</div>
          <p className="text-[11px] text-slate-500 mt-1">Computer Vision Audited</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase">Verified Authentic</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">{verifiedSubmissions}</div>
          <p className="text-[11px] text-emerald-500/80 mt-1">{authenticityRate}% Integrity Rate</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase">Requires Review</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">{reviewSubmissions}</div>
          <p className="text-[11px] text-amber-400/80 mt-1">Cheating/Occlusion Flags</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-sm col-span-2 md:col-span-1">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase">Pending Sync</span>
            <BarChart3 className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white">{pendingSync}</div>
          <p className="text-[11px] text-slate-500 mt-1">Offline Store Buffer</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-3 shadow-sm">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search athlete, district, sport..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Filter className="w-3.5 h-3.5 text-emerald-400" />
            <span>State:</span>
          </div>
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
          >
            <option value="ALL">All States</option>
            {states.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
          >
            <option value="ALL">All Talent Tiers</option>
            <option value="Tier-1">Tier-1 High Potential</option>
            <option value="Junior">Junior National Level</option>
            <option value="Agility">Grassroots Agility</option>
          </select>
        </div>
      </div>

      {/* Main Athlete Table (Section 14 spec) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 font-bold uppercase tracking-wider text-[11px] border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Athlete</th>
                <th className="py-3.5 px-4">Age / Gender</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Preferred Sport</th>
                <th className="py-3.5 px-4 text-center">Tests Assessed</th>
                <th className="py-3.5 px-4">Latest Result</th>
                <th className="py-3.5 px-4">Talent Prospect Tier</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredAthletes.map((athlete) => {
                const athSubmissions = submissions.filter(s => s.athleteId === athlete.id);
                const verifiedCount = athSubmissions.filter(s => s.status === 'verified').length;
                const latest = athSubmissions[0];

                return (
                  <tr key={athlete.id} className="hover:bg-slate-800/50 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={athlete.profileImageUrl}
                          alt={athlete.fullName}
                          className="w-9 h-9 rounded-xl object-cover border border-slate-700"
                        />
                        <div>
                          <div className="font-bold text-white flex items-center gap-1.5">
                            <span>{athlete.fullName}</span>
                            {athlete.aadhaarVerified && (
                              <span title="Aadhaar Biometrically Verified">
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono">ID: {athlete.id.slice(-6)}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-300">
                      <span>{athlete.age} yrs • {athlete.gender.toUpperCase()}</span>
                      <span className="block text-[10px] text-slate-500">{athlete.heightCm}cm / {athlete.weightKg}kg</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1 text-slate-300">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        <span>{athlete.district}, {athlete.state}</span>
                      </div>
                      <span className="text-[10px] text-slate-500">{athlete.village}</span>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-slate-300">
                      {athlete.preferredSport}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className="font-black text-white">{athSubmissions.length}</span>
                      <span className="text-[10px] text-emerald-400 block font-semibold">({verifiedCount} Verified)</span>
                    </td>

                    <td className="py-3.5 px-4">
                      {latest ? (
                        <div>
                          <span className="font-bold text-white">
                            {latest.primaryScore} {latest.primaryUnit}
                          </span>
                          <span className="block text-[10px] text-slate-400 truncate max-w-[120px]">
                            {latest.testName}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-500 italic">No tests</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {athlete.nationalTalentCategory}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => onSelectAthlete(athlete)}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-xl font-bold text-xs inline-flex items-center gap-1.5 transition border border-slate-700"
                      >
                        <Eye className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Inspect Dossier</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Athlete Detail Scout Dossier Modal */}
      {selectedAthlete && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 space-y-6 shadow-2xl relative my-8">
            <button
              onClick={onCloseAthleteModal}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-4">
              <img
                src={selectedAthlete.profileImageUrl}
                alt={selectedAthlete.fullName}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500/40 shadow-md"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-black text-white">{selectedAthlete.fullName}</h3>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                    {selectedAthlete.nationalTalentCategory}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  {selectedAthlete.village}, {selectedAthlete.district}, {selectedAthlete.state} • Age {selectedAthlete.age} • {selectedAthlete.preferredSport}
                </p>
                <div className="flex items-center gap-3 text-xs text-slate-300 mt-1">
                  <span>Height: <strong>{selectedAthlete.heightCm} cm</strong></span>
                  <span>•</span>
                  <span>Weight: <strong>{selectedAthlete.weightKg} kg</strong></span>
                  <span>•</span>
                  <span className="text-emerald-400 font-bold">Aadhaar Verified ✓</span>
                </div>
              </div>
            </div>

            {/* Test History & Biomechanical Audits for Selected Athlete */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span>Recorded Fitness Tests & Kinematic Audits</span>
              </h4>

              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {submissions
                  .filter(s => s.athleteId === selectedAthlete.id)
                  .map((sub) => {
                    const isVerified = sub.status === 'verified';
                    return (
                      <div
                        key={sub.id}
                        className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-sm">{sub.testName}</span>
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border ${
                                isVerified
                                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                                  : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                              }`}
                            >
                              {isVerified ? 'Verified Authentic' : 'Needs Review'}
                            </span>
                          </div>

                          <div className="text-right">
                            <span className="text-base font-black text-white">
                              {sub.primaryScore} {sub.primaryUnit}
                            </span>
                            <span className="text-[10px] text-slate-500 block">
                              Recorded: {new Date(sub.recordedAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                          </div>
                        </div>

                        {/* Kinematic Metrics Breakdown */}
                        <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
                          <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                            <span className="text-[9px] text-slate-400 uppercase block">Valid Reps</span>
                            <span className="font-bold text-emerald-400">{sub.validReps}</span>
                          </div>
                          <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                            <span className="text-[9px] text-slate-400 uppercase block">Invalid Reps</span>
                            <span className="font-bold text-rose-400">{sub.invalidReps}</span>
                          </div>
                          <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                            <span className="text-[9px] text-slate-400 uppercase block">AI Confidence</span>
                            <span className="font-bold text-slate-200">{Math.round(sub.aiConfidence * 100)}%</span>
                          </div>
                          <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                            <span className="text-[9px] text-slate-400 uppercase block">Trust Index</span>
                            <span className="font-bold text-emerald-400">{Math.round(sub.authenticityConfidence * 100)}%</span>
                          </div>
                        </div>

                        {/* Biomechanical Warnings or Notes */}
                        {sub.warnings.length > 0 && (
                          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-2.5 text-[11px] text-amber-300">
                            <span className="font-bold block mb-1">Authenticity Warnings:</span>
                            <ul className="list-disc list-inside space-y-0.5 text-amber-200/90">
                              {sub.warnings.map((w, idx) => (
                                <li key={idx}>{w}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Coach Feedback Note */}
                        {sub.coachNotes && (
                          <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800 text-[11px] text-slate-300">
                            <strong className="text-emerald-400">Scout Analysis:</strong> "{sub.coachNotes}"
                          </div>
                        )}

                        {/* Review Status Action Buttons */}
                        <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-800/80">
                          <button
                            onClick={() => onUpdateSubmissionStatus(sub.id, 'verified')}
                            className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold px-3 py-1 rounded-lg border border-emerald-500/40 text-[11px] transition"
                          >
                            Mark Verified
                          </button>
                          <button
                            onClick={() => onUpdateSubmissionStatus(sub.id, 'needs_review')}
                            className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold px-3 py-1 rounded-lg border border-amber-500/40 text-[11px] transition"
                          >
                            Flag for Daylight Retest
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Close Button */}
            <div className="flex justify-end pt-2">
              <button
                onClick={onCloseAthleteModal}
                className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
