import React, { useState } from 'react';
import {
  User,
  MapPin,
  ShieldCheck,
  Medal,
  Dna,
  Edit3,
  Check,
  Phone,
  Calendar,
} from 'lucide-react';
import { AthleteProfile } from '../../types';

interface ProfileScreenProps {
  athlete: AthleteProfile;
  onUpdateProfile: (updated: AthleteProfile) => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  athlete,
  onUpdateProfile,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...athlete });

  const handleSave = () => {
    onUpdateProfile(formData);
    setIsEditing(false);
  };

  return (
    <div className="p-4 space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
            Registration & Identity
          </span>
          <h2 className="text-base font-bold text-white">Athlete Profile</h2>
        </div>

        <button
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
            isEditing
              ? 'bg-emerald-500 text-slate-950 shadow-md'
              : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
          }`}
        >
          {isEditing ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </>
          ) : (
            <>
              <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Edit Info</span>
            </>
          )}
        </button>
      </div>

      {/* Main Identity Card */}
      <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 flex items-center gap-4">
        <img
          src={athlete.profileImageUrl}
          alt={athlete.fullName}
          className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500/40 shadow-md"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="text-base font-bold text-white truncate">{athlete.fullName}</h3>
            {athlete.aadhaarVerified && (
              <span title="Aadhaar Biometrically Verified">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400">
            {athlete.district}, {athlete.state}
          </p>
          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full inline-block mt-1 border border-emerald-500/20">
            {athlete.nationalTalentCategory}
          </span>
        </div>
      </div>

      {/* Demographics & Physical Attributes Form */}
      <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 space-y-3 text-xs">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
          <Dna className="w-4 h-4 text-emerald-400" />
          <span>Biometric & Geographic Details</span>
        </h4>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] text-slate-400 font-semibold block mb-1">Age</label>
            {isEditing ? (
              <input
                type="number"
                value={formData.age}
                onChange={e => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold text-xs"
              />
            ) : (
              <span className="text-xs font-bold text-white">{athlete.age} Years</span>
            )}
          </div>

          <div>
            <label className="text-[10px] text-slate-400 font-semibold block mb-1">Gender</label>
            {isEditing ? (
              <select
                value={formData.gender}
                onChange={e => setFormData({ ...formData, gender: e.target.value as any })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold text-xs"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            ) : (
              <span className="text-xs font-bold text-white uppercase">{athlete.gender}</span>
            )}
          </div>

          <div>
            <label className="text-[10px] text-slate-400 font-semibold block mb-1">Standing Height</label>
            {isEditing ? (
              <input
                type="number"
                value={formData.heightCm}
                onChange={e => setFormData({ ...formData, heightCm: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold text-xs"
              />
            ) : (
              <span className="text-xs font-bold text-white">{athlete.heightCm} cm</span>
            )}
          </div>

          <div>
            <label className="text-[10px] text-slate-400 font-semibold block mb-1">Body Weight</label>
            {isEditing ? (
              <input
                type="number"
                value={formData.weightKg}
                onChange={e => setFormData({ ...formData, weightKg: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold text-xs"
              />
            ) : (
              <span className="text-xs font-bold text-white">{athlete.weightKg} kg</span>
            )}
          </div>

          <div>
            <label className="text-[10px] text-slate-400 font-semibold block mb-1">State / Province</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.state}
                onChange={e => setFormData({ ...formData, state: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold text-xs"
              />
            ) : (
              <span className="text-xs font-bold text-white">{athlete.state}</span>
            )}
          </div>

          <div>
            <label className="text-[10px] text-slate-400 font-semibold block mb-1">District / Tehsil</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.district}
                onChange={e => setFormData({ ...formData, district: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold text-xs"
              />
            ) : (
              <span className="text-xs font-bold text-white">{athlete.district}</span>
            )}
          </div>
        </div>

        <div className="pt-2">
          <label className="text-[10px] text-slate-400 font-semibold block mb-1">Preferred Sport</label>
          {isEditing ? (
            <input
              type="text"
              value={formData.preferredSport}
              onChange={e => setFormData({ ...formData, preferredSport: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold text-xs"
            />
          ) : (
            <span className="text-xs font-bold text-emerald-400">{athlete.preferredSport}</span>
          )}
        </div>
      </div>
    </div>
  );
};
