import React, { useState } from 'react';
import { useGame, FOUNDER_EMAIL } from '../context/GameContext';
import { Question, Category, Option, Announcement, UserRole, StaffPermissions } from '../types';
import {
  ShieldAlert,
  PlusCircle,
  Lock,
  Unlock,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Search,
  UserX,
  UserCheck,
  Megaphone,
  Youtube,
  Clock,
  Sparkles,
  Edit3,
  Award,
  Coins,
  AlertTriangle,
  RotateCcw,
  Check,
  Send,
  Eye,
  Settings,
  HelpCircle,
  Users,
  ShieldCheck,
  Trash2,
  UserPlus,
  Key,
  LogIn
} from 'lucide-react';

const CATEGORIES: Category[] = [
  'Eviction',
  'Captaincy',
  'Fights & Drama',
  'Tasks',
  'Weekend Ka Vaar',
  'Season Long',
];

export const AdminView: React.FC = () => {
  const {
    user,
    login,
    questions,
    addQuestion,
    updateQuestion,
    toggleQuestionLock,
    refundQuestion,
    simulateResolveQuestion,
    banUser,
    unbanUser,
    adjustUserBalance,
    toggleAdminRole,
    announcements,
    addAnnouncement,
    toggleAnnouncement,
    deleteAnnouncement,
    youtubeRaffleNotice,
    setYoutubeRaffleNotice,
    leaderboard,
    staffMembers,
    addStaffMember,
    removeStaffMember,
    updateStaffPermissions,
    checkUserStaffAccess,
  } = useGame();

  const userAccess = user?.email ? checkUserStaffAccess(user.email) : { isAuthorized: false, role: 'USER' };
  const isAuthorizedStaff = user?.isAdmin && userAccess.isAuthorized;

  const [activeTab, setActiveTab] = useState<'questions' | 'staff' | 'users' | 'announcements' | 'youtube'>('questions');

  // Moderator Login Screen State
  const [authEmailInput, setAuthEmailInput] = useState('');
  const [authErrorMsg, setAuthErrorMsg] = useState<string | null>(null);

  // Staff Management State
  const [staffEmailInput, setStaffEmailInput] = useState('');
  const [staffNameInput, setStaffNameInput] = useState('');
  const [staffRoleInput, setStaffRoleInput] = useState<UserRole>('MODERATOR');

  // Question Creation Form State
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newCategory, setNewCategory] = useState<Category>('Eviction');
  const [newMultiplier, setNewMultiplier] = useState<number>(2.5);
  const [newDeadlineDateTime, setNewDeadlineDateTime] = useState('');
  const [newOptions, setNewOptions] = useState<string[]>([
    'Contestant A',
    'Contestant B',
    'No Eviction / Cancelled',
  ]);

  // Question Editing State
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  // Resolution State
  const [resolvingQuestionId, setResolvingQuestionId] = useState<string | null>(null);
  const [selectedWinningOptionId, setSelectedWinningOptionId] = useState<string>('');
  const [resolutionNote, setResolutionNote] = useState<string>('');
  const [adminSecretKeyInput, setAdminSecretKeyInput] = useState<string>('');
  const [resolutionStatusMsg, setResolutionStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // User Management Search & Modal
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [banReasonInput, setBanReasonInput] = useState('');
  const [selectedUserForAction, setSelectedUserForAction] = useState<string | null>(null);
  const [coinsAdjInput, setCoinsAdjInput] = useState<number>(500);
  const [crownsAdjInput, setCrownsAdjInput] = useState<number>(200);

  // Announcement Form State
  const [annTitle, setAnnTitle] = useState('');
  const [annMsg, setAnnMsg] = useState('');
  const [annType, setAnnType] = useState<'INFO' | 'ALERT' | 'CELEBRATION'>('INFO');
  const [annLink, setAnnLink] = useState('https://instagram.com/thefanmahal');

  // YouTube Raffle State
  const [ytUrl, setYtUrl] = useState(youtubeRaffleNotice?.youtubeUrl || 'https://youtube.com/@thefanmahal');
  const [ytDate, setYtDate] = useState(youtubeRaffleNotice?.scheduledDate || 'Sunday 8:00 PM IST');
  const [ytTitle, setYtTitle] = useState(youtubeRaffleNotice?.title || 'Monthly Royal Fan Hamper & Voucher Raffle Stream');
  const [ytNote, setYtNote] = useState(youtubeRaffleNotice?.note || 'Drawn live on YouTube using third-party randomizer for 100% transparency.');

  // Handle Moderator Sign-In Gate
  const handleStaffLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = authEmailInput.trim();
    if (!cleanEmail) return;

    const access = checkUserStaffAccess(cleanEmail);
    if (access.isAuthorized) {
      login(
        cleanEmail,
        cleanEmail.toLowerCase() === FOUNDER_EMAIL.toLowerCase() ? '@Prithvi_Founder' : `@${cleanEmail.split('@')[0]}_Mod`,
        '👑',
        access.role === 'SUPER_ADMIN' ? 'Founder & Chairman' : 'Operations Moderator',
        `@${cleanEmail.split('@')[0]}`
      );
      setAuthErrorMsg(null);
    } else {
      setAuthErrorMsg(
        `⛔ Access Denied: Email '${cleanEmail}' is not registered in FanMahal Moderator Registry. Please contact Founder Prithvi (@prithvirajkz94) for staff access.`
      );
    }
  };

  // Add Staff Member Submit
  const handleAddStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffEmailInput.trim()) {
      alert('Please enter a staff email address.');
      return;
    }

    const res = addStaffMember(staffEmailInput, staffNameInput, staffRoleInput);
    alert(res.message);
    if (res.success) {
      setStaffEmailInput('');
      setStaffNameInput('');
    }
  };

  // IF USER IS NOT AUTHORIZED STAFF -> RENDER HIGH-SECURITY ACCESS GATE
  if (!isAuthorizedStaff) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 bg-gradient-to-b from-[#1E0240] via-[#120027] to-[#0D001C] rounded-3xl border border-amber-500/40 shadow-2xl space-y-6 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-16 h-16 bg-amber-500/20 rounded-2xl border border-amber-400/50 flex items-center justify-center mx-auto text-amber-400 shadow-lg relative z-10">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="relative z-10">
          <span className="text-[10px] font-black tracking-widest text-amber-400 uppercase bg-amber-400/10 border border-amber-400/30 px-3 py-1 rounded-full">
            RESTRICTED STAFF PORTAL
          </span>
          <h2 className="text-2xl font-black text-white mt-2">FanMahal Moderator Sign-In</h2>
          <p className="text-xs text-purple-200/80 mt-1 max-w-md mx-auto">
            This page (<code>fanmahal.com/moderator</code>) is reserved for operations management, Founders, & authorized moderators.
          </p>
        </div>

        {/* Staff Authentication Form */}
        <form onSubmit={handleStaffLoginSubmit} className="space-y-4 text-left bg-black/40 p-5 rounded-2xl border border-purple-800/60 relative z-10 shadow-inner">
          <div>
            <label className="text-xs font-bold text-amber-300 block mb-1">Moderator Email Address:</label>
            <input
              type="email"
              value={authEmailInput}
              onChange={(e) => {
                setAuthEmailInput(e.target.value);
                setAuthErrorMsg(null);
              }}
              placeholder="Enter your authorized moderator email..."
              className="w-full bg-[#110125] text-white border border-purple-700/80 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-400 font-medium"
              required
            />
            <p className="text-[11px] text-purple-300/70 mt-1">
              Example Founder: <code>prithvirajkz94@gmail.com</code> | Mod: <code>priya@fanmahal.com</code>
            </p>
          </div>

          {authErrorMsg && (
            <div className="p-3 bg-rose-500/20 border border-rose-500/50 rounded-xl text-xs text-rose-200 flex items-start gap-2">
              <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{authErrorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:opacity-90 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg transition flex items-center justify-center gap-2 border border-amber-300/50 cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In to Operations Console</span>
          </button>
        </form>

        <div className="text-[11px] text-purple-300/60 leading-relaxed border-t border-purple-800/40 pt-4 relative z-10">
          🔒 Role-Based Access Control Enabled. Standard users cannot access this panel without authorization from Founder <strong>Prithvi</strong>.
        </div>
      </div>
    );
  }

  // Handle Option Builder
  const handleAddOptionField = () => {
    if (newOptions.length < 8) {
      setNewOptions([...newOptions, `Option ${newOptions.length + 1}`]);
    }
  };

  const handleOptionTextChange = (index: number, text: string) => {
    const updated = [...newOptions];
    updated[index] = text;
    setNewOptions(updated);
  };

  const handleRemoveOptionField = (index: number) => {
    if (newOptions.length > 2) {
      setNewOptions(newOptions.filter((_, i) => i !== index));
    }
  };

  // Submit New Question
  const handleCreateQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      alert('Please enter a question title.');
      return;
    }

    if (newOptions.some((opt) => !opt.trim())) {
      alert('All prediction option fields must be filled out.');
      return;
    }

    let deadlineTs = Date.now() + 86400000; // default 24 hours
    let deadlineDisplay = 'In 24 Hours';

    if (newDeadlineDateTime) {
      const dt = new Date(newDeadlineDateTime);
      deadlineTs = dt.getTime();
      deadlineDisplay = dt.toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        dateStyle: 'medium',
        timeStyle: 'short',
      }) + ' IST';
    }

    const formattedOptions: Option[] = newOptions.map((text, idx) => ({
      id: `opt_${Date.now()}_${idx + 1}`,
      text: text.trim(),
      communityPercent: Math.round(100 / newOptions.length),
    }));

    const result = addQuestion({
      title: newTitle.trim(),
      subtitle: newSubtitle.trim() || undefined,
      category: newCategory,
      multiplier: Number(newMultiplier) || 2.0,
      deadline: deadlineDisplay,
      deadlineTimestamp: deadlineTs,
      options: formattedOptions,
    });

    if (result.success) {
      alert(result.message);
      setNewTitle('');
      setNewSubtitle('');
      setNewDeadlineDateTime('');
    }
  };

  // Submit Question Resolution & Payout
  const handleExecuteResolution = async () => {
    if (!resolvingQuestionId || !selectedWinningOptionId) {
      alert('Please select the winning prediction option.');
      return;
    }

    setResolutionStatusMsg(null);
    const result = await simulateResolveQuestion(
      resolvingQuestionId,
      selectedWinningOptionId,
      resolutionNote,
      adminSecretKeyInput
    );

    if (result.success) {
      setResolutionStatusMsg({ type: 'success', text: result.message });
      setTimeout(() => {
        setResolvingQuestionId(null);
        setSelectedWinningOptionId('');
        setResolutionNote('');
        setResolutionStatusMsg(null);
      }, 1500);
    } else {
      setResolutionStatusMsg({ type: 'error', text: result.message });
    }
  };

  // Edit Question Submit
  const handleSaveQuestionEdits = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuestion) return;

    const res = updateQuestion(editingQuestion.id, {
      title: editingQuestion.title,
      subtitle: editingQuestion.subtitle,
      category: editingQuestion.category,
      multiplier: editingQuestion.multiplier,
      deadline: editingQuestion.deadline,
      deadlineTimestamp: editingQuestion.deadlineTimestamp,
      options: editingQuestion.options,
    });

    if (res.success) {
      alert(res.message);
      setEditingQuestion(null);
    }
  };

  // Submit Announcement
  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annMsg.trim()) return;

    addAnnouncement({
      title: annTitle,
      message: annMsg,
      type: annType,
      active: true,
      linkUrl: annLink || undefined,
    });

    setAnnTitle('');
    setAnnMsg('');
    alert('Top Announcement published live to all users!');
  };

  // Submit YouTube Notice
  const handleSaveYouTubeNotice = (e: React.FormEvent) => {
    e.preventDefault();
    setYoutubeRaffleNotice({
      id: 'yt_raffle_active',
      title: ytTitle,
      scheduledDate: ytDate,
      youtubeUrl: ytUrl,
      note: ytNote,
      active: true,
    });
    alert('YouTube Raffle Stream Notice updated successfully!');
  };

  // Filter Users
  const filteredUsers = leaderboard.filter(
    (u) =>
      u.username.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      u.id.toLowerCase().includes(userSearchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner / Studio Header */}
      <div className="bg-gradient-to-r from-[#22034D] via-[#31056C] to-[#1C023E] rounded-2xl p-6 border border-amber-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-amber-400 font-extrabold text-xs uppercase tracking-widest mb-1">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>In-App Operations Control Panel</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Fanmahal Admin Studio</span>
              <span className="text-xs bg-amber-400/20 text-amber-300 border border-amber-400/40 px-2 py-0.5 rounded-full font-bold">
                PROD ACCESS
              </span>
            </h1>
            <p className="text-xs text-purple-200/80 mt-1">
              Manage live prediction questions, set deadlines, settle Crown payouts, moderate accounts, & broadcast announcements.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={toggleAdminRole}
              className="px-3.5 py-2 bg-purple-900/60 hover:bg-purple-800 text-purple-200 border border-purple-500/40 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md"
              title="Toggle view between Admin Mode & Standard User Mode"
            >
              <Eye className="w-3.5 h-3.5 text-amber-300" />
              <span>{user?.isAdmin ? 'Switch to Standard User View' : 'Enable Admin Mode'}</span>
            </button>
          </div>
        </div>

        {/* Server Admin Secret Key Input & Direct Moderator URL Bar */}
        <div className="mt-4 pt-4 border-t border-purple-800/40 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <label className="text-xs font-semibold text-purple-300 flex items-center gap-1">
              <Settings className="w-3.5 h-3.5 text-amber-400" />
              <span>Server Admin Key:</span>
            </label>
            <input
              type="password"
              value={adminSecretKeyInput}
              onChange={(e) => setAdminSecretKeyInput(e.target.value)}
              placeholder="Enter ADMIN_SECRET_KEY..."
              className="bg-[#110125] text-amber-200 border border-purple-700/60 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-amber-400 w-56 font-mono"
            />
            <span className="text-[11px] text-emerald-400 font-medium">
              ✓ Ready for instant payout resolution
            </span>
          </div>

          <div className="flex items-center gap-2 bg-[#110125]/80 px-3 py-1.5 rounded-xl border border-amber-500/30 text-xs">
            <span className="text-amber-300 font-bold">🌐 Direct Moderator Web Page:</span>
            <code className="text-purple-200 font-mono text-[11px] bg-black/40 px-2 py-0.5 rounded border border-purple-800">
              {typeof window !== 'undefined' ? `${window.location.origin}/moderator` : 'fanmahal.com/moderator'}
            </code>
            <button
              onClick={() => {
                if (navigator.clipboard) {
                  navigator.clipboard.writeText(
                    typeof window !== 'undefined' ? `${window.location.origin}/moderator` : 'https://fanmahal.com/moderator'
                  );
                  alert('Moderator URL copied to clipboard!');
                }
              }}
              className="px-2 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 text-[10px] font-black rounded transition"
            >
              Copy Link
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-purple-800/50 pb-2">
        <button
          onClick={() => setActiveTab('questions')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition ${
            activeTab === 'questions'
              ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20'
              : 'bg-[#1C023E] text-purple-300 hover:bg-purple-900/40'
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          <span>Questions & Deadlines ({questions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('staff')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition ${
            activeTab === 'staff'
              ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20'
              : 'bg-[#1C023E] text-purple-300 hover:bg-purple-900/40'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Staff & Access Control ({staffMembers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition ${
            activeTab === 'users'
              ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20'
              : 'bg-[#1C023E] text-purple-300 hover:bg-purple-900/40'
          }`}
        >
          <UserX className="w-4 h-4" />
          <span>User Moderation & TOS</span>
        </button>

        <button
          onClick={() => setActiveTab('announcements')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition ${
            activeTab === 'announcements'
              ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20'
              : 'bg-[#1C023E] text-purple-300 hover:bg-purple-900/40'
          }`}
        >
          <Megaphone className="w-4 h-4" />
          <span>Broadcast Banners ({announcements.filter((a) => a.active).length})</span>
        </button>

        <button
          onClick={() => setActiveTab('youtube')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition ${
            activeTab === 'youtube'
              ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20'
              : 'bg-[#1C023E] text-purple-300 hover:bg-purple-900/40'
          }`}
        >
          <Youtube className="w-4 h-4 text-rose-400" />
          <span>YouTube Raffle Notice</span>
        </button>
      </div>

      {/* TAB: STAFF & ACCESS CONTROL */}
      {activeTab === 'staff' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Grant Moderator Access Form */}
          <div className="lg:col-span-5 bg-[#1C023E] border border-purple-800/60 rounded-2xl p-5 shadow-xl space-y-4">
            <h2 className="text-lg font-black text-white flex items-center gap-2 border-b border-purple-800/60 pb-3">
              <UserPlus className="w-5 h-5 text-amber-400" />
              <span>Grant Moderator Access</span>
            </h2>

            <form onSubmit={handleAddStaffSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-purple-200 font-bold mb-1">
                  Staff Email Address *
                </label>
                <input
                  type="email"
                  value={staffEmailInput}
                  onChange={(e) => setStaffEmailInput(e.target.value)}
                  placeholder="e.g. priya@fanmahal.com or moderator@domain.com"
                  className="w-full bg-[#110125] text-white border border-purple-700/60 rounded-xl px-3 py-2.5 focus:outline-none focus:border-amber-400 font-mono"
                  required
                />
                <p className="text-[11px] text-purple-300/60 mt-1">
                  When this person visits <code>fanmahal.com/moderator</code> and signs in with this email, they will be granted moderator access.
                </p>
              </div>

              <div>
                <label className="block text-purple-200 font-bold mb-1">
                  Staff Member Name
                </label>
                <input
                  type="text"
                  value={staffNameInput}
                  onChange={(e) => setStaffNameInput(e.target.value)}
                  placeholder="e.g. Priya (Operations Manager)"
                  className="w-full bg-[#110125] text-purple-200 border border-purple-700/60 rounded-xl px-3 py-2.5 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-purple-200 font-bold mb-1">
                  Assigned Access Role
                </label>
                <select
                  value={staffRoleInput}
                  onChange={(e) => setStaffRoleInput(e.target.value as UserRole)}
                  className="w-full bg-[#110125] text-amber-300 border border-purple-700/60 rounded-xl px-3 py-2.5 focus:outline-none focus:border-amber-400 font-bold"
                >
                  <option value="MODERATOR">MODERATOR (Questions, Settle Payouts, Banners)</option>
                  <option value="SUPER_ADMIN">SUPER ADMIN (Full Unrestricted Access)</option>
                </select>
              </div>

              <div className="bg-purple-950/60 p-3 rounded-xl border border-purple-800/60 space-y-2">
                <span className="text-[11px] font-extrabold text-amber-300 block uppercase tracking-wider">
                  Operational Permissions Granted:
                </span>
                <ul className="text-[11px] text-purple-200/90 space-y-1">
                  <li className="flex items-center gap-1.5 text-emerald-400">
                    <Check className="w-3.5 h-3.5" />
                    <span>Create & Edit Prediction Questions</span>
                  </li>
                  <li className="flex items-center gap-1.5 text-emerald-400">
                    <Check className="w-3.5 h-3.5" />
                    <span>Lock Predictions & Settle Crown Payouts</span>
                  </li>
                  <li className="flex items-center gap-1.5 text-emerald-400">
                    <Check className="w-3.5 h-3.5" />
                    <span>Publish Broadcast Announcements & YouTube Stream Notices</span>
                  </li>
                </ul>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold rounded-xl shadow-lg transition flex items-center justify-center gap-2 text-xs cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Authorize & Save Staff Credentials</span>
              </button>
            </form>
          </div>

          {/* Active Staff List Table */}
          <div className="lg:col-span-7 bg-[#1C023E] border border-purple-800/60 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-purple-800/60 pb-3">
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-400" />
                <span>Authorized Moderators & Staff ({staffMembers.length})</span>
              </h2>
              <span className="text-xs text-amber-300/80 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/30 font-extrabold">
                RBAC Active
              </span>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {staffMembers.map((member) => {
                const isFounder = member.email.toLowerCase() === FOUNDER_EMAIL.toLowerCase();
                return (
                  <div
                    key={member.id}
                    className="bg-[#110125] p-4 rounded-xl border border-purple-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-white">{member.name}</span>
                        <span
                          className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                            member.role === 'SUPER_ADMIN'
                              ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          }`}
                        >
                          {member.role}
                        </span>
                        {isFounder && (
                          <span className="text-[10px] bg-purple-800/80 text-purple-200 px-2 py-0.5 rounded font-bold">
                            Founder
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-mono text-purple-300">{member.email}</p>
                      <p className="text-[11px] text-purple-400">
                        Added: {member.dateAdded} by {member.addedBy}
                      </p>
                    </div>

                    {!isFounder && (
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to revoke moderator access for ${member.email}?`)) {
                            const res = removeStaffMember(member.id);
                            alert(res.message);
                          }
                        }}
                        className="px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 rounded-lg text-xs font-bold transition flex items-center gap-1 self-start sm:self-center cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Revoke Access</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 1: QUESTIONS MANAGER */}
      {activeTab === 'questions' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Create Question Panel */}
          <div className="lg:col-span-5 bg-[#1C023E] border border-purple-800/60 rounded-2xl p-5 shadow-xl space-y-4">
            <h2 className="text-lg font-black text-white flex items-center gap-2 border-b border-purple-800/60 pb-3">
              <PlusCircle className="w-5 h-5 text-amber-400" />
              <span>Create New Prediction Question</span>
            </h2>

            <form onSubmit={handleCreateQuestionSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-purple-200 font-bold mb-1">
                  Question Title *
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Who will win the Captaincy Task in Episode 42?"
                  className="w-full bg-[#110125] text-white border border-purple-700/60 rounded-xl px-3 py-2 focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div>
                <label className="block text-purple-200 font-bold mb-1">
                  Subtitle / Context (Optional)
                </label>
                <input
                  type="text"
                  value={newSubtitle}
                  onChange={(e) => setNewSubtitle(e.target.value)}
                  placeholder="e.g. Winner gets immunity & bedroom power."
                  className="w-full bg-[#110125] text-purple-200 border border-purple-700/60 rounded-xl px-3 py-2 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-purple-200 font-bold mb-1">
                    Category Tag *
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as Category)}
                    className="w-full bg-[#110125] text-amber-300 border border-purple-700/60 rounded-xl px-3 py-2 focus:outline-none focus:border-amber-400 font-bold"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-purple-200 font-bold mb-1">
                    Multiplier Odds *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1.0"
                    max="50.0"
                    value={newMultiplier}
                    onChange={(e) => setNewMultiplier(parseFloat(e.target.value) || 2.0)}
                    className="w-full bg-[#110125] text-amber-300 font-black border border-purple-700/60 rounded-xl px-3 py-2 focus:outline-none focus:border-amber-400"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-purple-200 font-bold mb-1 flex items-center justify-between">
                  <span>Prediction Closing Deadline Date & Time *</span>
                  <span className="text-[10px] text-amber-400 font-normal">Auto-locks when reached</span>
                </label>
                <input
                  type="datetime-local"
                  value={newDeadlineDateTime}
                  onChange={(e) => setNewDeadlineDateTime(e.target.value)}
                  className="w-full bg-[#110125] text-amber-200 border border-purple-700/60 rounded-xl px-3 py-2 focus:outline-none focus:border-amber-400 font-mono"
                  required
                />
              </div>

              {/* Options Builder */}
              <div className="space-y-2 pt-2 border-t border-purple-800/40">
                <div className="flex items-center justify-between">
                  <label className="text-purple-200 font-bold">
                    Prediction Options ({newOptions.length})
                  </label>
                  <button
                    type="button"
                    onClick={handleAddOptionField}
                    className="text-[11px] text-amber-300 hover:text-amber-200 font-bold flex items-center gap-1"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Add Option</span>
                  </button>
                </div>

                {newOptions.map((optText, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-purple-400 font-bold w-5">{idx + 1}.</span>
                    <input
                      type="text"
                      value={optText}
                      onChange={(e) => handleOptionTextChange(idx, e.target.value)}
                      placeholder={`Option ${idx + 1}`}
                      className="flex-1 bg-[#110125] text-white border border-purple-700/60 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-amber-400"
                    />
                    {newOptions.length > 2 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveOptionField(idx)}
                        className="p-1 text-rose-400 hover:text-rose-300 transition"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black py-3 rounded-xl shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2 text-sm uppercase tracking-wide mt-4"
              >
                <Send className="w-4 h-4" />
                <span>Publish Prediction Question</span>
              </button>
            </form>
          </div>

          {/* Existing Questions List & Controls */}
          <div className="lg:col-span-7 space-y-4">
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-400" />
              <span>Live Question Directory & Resolutions ({questions.length})</span>
            </h2>

            <div className="space-y-3">
              {questions.map((q) => {
                const isAutoLocked = q.deadlineTimestamp > 0 && Date.now() >= q.deadlineTimestamp;
                const isLocked = q.isLockedManual || isAutoLocked;

                return (
                  <div
                    key={q.id}
                    className={`bg-[#1C023E] border rounded-2xl p-4 space-y-3 transition shadow-lg ${
                      q.resolved
                        ? 'border-emerald-500/40 bg-emerald-950/10'
                        : isLocked
                        ? 'border-amber-500/40 bg-amber-950/10'
                        : 'border-purple-800/60'
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-purple-900/80 text-amber-300 border border-purple-700/50">
                            {q.category}
                          </span>
                          <span className="text-xs font-black text-amber-400 bg-amber-400/10 border border-amber-400/30 px-2 py-0.5 rounded-md">
                            {q.multiplier}x Crowns
                          </span>
                          {q.resolved ? (
                            <span className="text-[10px] font-bold text-emerald-300 bg-emerald-900/50 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              RESOLVED
                            </span>
                          ) : isLocked ? (
                            <span className="text-[10px] font-bold text-amber-300 bg-amber-900/50 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Lock className="w-3 h-3" />
                              LOCKED / CLOSED
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-900/30 px-2 py-0.5 rounded-full">
                              ● ACTIVE PREDICTIONS
                            </span>
                          )}
                        </div>

                        <h3 className="text-sm font-extrabold text-white leading-snug">
                          {q.title}
                        </h3>
                        {q.subtitle && (
                          <p className="text-xs text-purple-300/80">{q.subtitle}</p>
                        )}
                        <p className="text-[11px] text-amber-200/90 flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3 text-amber-400" />
                          <span>Deadline: {q.deadline}</span>
                        </p>
                      </div>

                      {/* Options breakdown */}
                      <div className="w-full bg-[#110125] p-2.5 rounded-xl border border-purple-800/40 text-xs space-y-1">
                        <span className="text-[10px] font-bold text-purple-300 uppercase tracking-wider block">
                          Options ({q.options.length}):
                        </span>
                        <div className="grid grid-cols-2 gap-1.5">
                          {q.options.map((opt) => {
                            const isWinner = q.winningOptionId === opt.id;
                            return (
                              <div
                                key={opt.id}
                                className={`px-2 py-1 rounded-md text-[11px] font-medium flex items-center justify-between ${
                                  isWinner
                                    ? 'bg-emerald-500/20 text-emerald-200 font-extrabold border border-emerald-500/40'
                                    : 'bg-purple-900/30 text-purple-200'
                                }`}
                              >
                                <span>{opt.text}</span>
                                {isWinner && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Admin Quick Control Buttons */}
                      <div className="w-full flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-purple-800/40">
                        <div className="flex items-center gap-2">
                          {/* Toggle Lock/Unlock Button */}
                          <button
                            onClick={() => {
                              const res = toggleQuestionLock(q.id);
                              alert(res.message);
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                              q.isLockedManual
                                ? 'bg-emerald-600/30 text-emerald-200 hover:bg-emerald-600/50 border border-emerald-500/40'
                                : 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/40 border border-amber-500/40'
                            }`}
                          >
                            {q.isLockedManual ? (
                              <>
                                <Unlock className="w-3.5 h-3.5" />
                                <span>Unlock Question</span>
                              </>
                            ) : (
                              <>
                                <Lock className="w-3.5 h-3.5" />
                                <span>Lock Question</span>
                              </>
                            )}
                          </button>

                          {/* Edit Question Button */}
                          <button
                            onClick={() => setEditingQuestion(q)}
                            className="px-3 py-1.5 bg-purple-900/60 hover:bg-purple-800 text-purple-200 rounded-lg text-xs font-bold transition flex items-center gap-1 border border-purple-700/50"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-amber-300" />
                            <span>Edit Question</span>
                          </button>

                          {/* Refund Button */}
                          {!q.resolved && (
                            <button
                              onClick={() => {
                                const reason = prompt('Enter refund reason (e.g., Task aborted on TV episode):');
                                if (reason) {
                                  const res = refundQuestion(q.id, reason);
                                  alert(res.message);
                                }
                              }}
                              className="px-2.5 py-1.5 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 rounded-lg text-xs font-bold transition flex items-center gap-1 border border-rose-800/40"
                              title="Refund Fan Coins if task was cancelled on TV"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Refund & Void</span>
                            </button>
                          )}
                        </div>

                        {/* Declare Winner & Resolve Button */}
                        {!q.resolved ? (
                          <button
                            onClick={() => {
                              setResolvingQuestionId(q.id);
                              setSelectedWinningOptionId(q.options[0]?.id || '');
                              setResolutionNote(`Official Result: ${q.options[0]?.text || ''}`);
                            }}
                            className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black rounded-lg text-xs transition shadow-md flex items-center gap-1"
                          >
                            <Award className="w-3.5 h-3.5" />
                            <span>Settle Payouts & Declare Winner</span>
                          </button>
                        ) : (
                          <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Payouts Distributed</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* RESOLUTION MODAL */}
      {resolvingQuestionId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#1C023E] border border-amber-500/50 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-purple-800/50 pb-3">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                <span>Declare Winner & Issue Crown Payouts</span>
              </h3>
              <button
                onClick={() => setResolvingQuestionId(null)}
                className="text-purple-300 hover:text-white"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {(() => {
              const targetQ = questions.find((q) => q.id === resolvingQuestionId);
              if (!targetQ) return null;

              return (
                <div className="space-y-4 text-xs">
                  <div className="bg-[#110125] p-3 rounded-xl border border-purple-700/50">
                    <span className="text-[10px] text-amber-400 font-bold uppercase">{targetQ.category} • {targetQ.multiplier}x Multiplier</span>
                    <h4 className="text-sm font-extrabold text-white mt-1">{targetQ.title}</h4>
                  </div>

                  <div>
                    <label className="block text-purple-200 font-bold mb-1.5">
                      Select Winning Outcome Option *
                    </label>
                    <div className="space-y-1.5">
                      {targetQ.options.map((opt) => (
                        <label
                          key={opt.id}
                          className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                            selectedWinningOptionId === opt.id
                              ? 'bg-emerald-950/60 border-emerald-400 text-emerald-200 font-bold'
                              : 'bg-[#110125] border-purple-800/60 text-purple-200 hover:bg-purple-900/30'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="winningOption"
                              checked={selectedWinningOptionId === opt.id}
                              onChange={() => setSelectedWinningOptionId(opt.id)}
                              className="accent-emerald-400"
                            />
                            <span>{opt.text}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-purple-200 font-bold mb-1">
                      Resolution Note / Episode Context
                    </label>
                    <input
                      type="text"
                      value={resolutionNote}
                      onChange={(e) => setResolutionNote(e.target.value)}
                      placeholder="e.g. Winner announced on TV episode broadcast."
                      className="w-full bg-[#110125] text-white border border-purple-700/60 rounded-xl px-3 py-2 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  {resolutionStatusMsg && (
                    <div
                      className={`p-3 rounded-xl text-xs font-bold ${
                        resolutionStatusMsg.type === 'success'
                          ? 'bg-emerald-900/80 text-emerald-200 border border-emerald-500'
                          : 'bg-rose-900/80 text-rose-200 border border-rose-500'
                      }`}
                    >
                      {resolutionStatusMsg.text}
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-purple-800/50">
                    <button
                      onClick={() => setResolvingQuestionId(null)}
                      className="px-4 py-2 bg-purple-900/50 hover:bg-purple-800 text-purple-200 rounded-xl font-bold"
                    >
                      Cancel
                    </button>

                    <button
                      onClick={handleExecuteResolution}
                      className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black rounded-xl shadow-lg transition"
                    >
                      Settle & Distribute Crowns
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* EDIT QUESTION MODAL */}
      {editingQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#1C023E] border border-amber-500/50 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-purple-800/50 pb-3">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-amber-400" />
                <span>Edit Question Details & Deadline</span>
              </h3>
              <button
                onClick={() => setEditingQuestion(null)}
                className="text-purple-300 hover:text-white"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuestionEdits} className="space-y-4 text-xs">
              <div>
                <label className="block text-purple-200 font-bold mb-1">Title</label>
                <input
                  type="text"
                  value={editingQuestion.title}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, title: e.target.value })}
                  className="w-full bg-[#110125] text-white border border-purple-700/60 rounded-xl px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-purple-200 font-bold mb-1">Subtitle</label>
                <input
                  type="text"
                  value={editingQuestion.subtitle || ''}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, subtitle: e.target.value })}
                  className="w-full bg-[#110125] text-purple-200 border border-purple-700/60 rounded-xl px-3 py-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-purple-200 font-bold mb-1">Category</label>
                  <select
                    value={editingQuestion.category}
                    onChange={(e) => setEditingQuestion({ ...editingQuestion, category: e.target.value as Category })}
                    className="w-full bg-[#110125] text-amber-300 border border-purple-700/60 rounded-xl px-3 py-2 font-bold"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-purple-200 font-bold mb-1">Multiplier</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingQuestion.multiplier}
                    onChange={(e) => setEditingQuestion({ ...editingQuestion, multiplier: parseFloat(e.target.value) || 2.0 })}
                    className="w-full bg-[#110125] text-amber-300 font-black border border-purple-700/60 rounded-xl px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-purple-200 font-bold mb-1">Deadline Display Text</label>
                <input
                  type="text"
                  value={editingQuestion.deadline}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, deadline: e.target.value })}
                  className="w-full bg-[#110125] text-amber-200 border border-purple-700/60 rounded-xl px-3 py-2"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-purple-800/50">
                <button
                  type="button"
                  onClick={() => setEditingQuestion(null)}
                  className="px-4 py-2 bg-purple-900/50 text-purple-200 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-400 text-slate-950 font-black rounded-xl shadow-lg"
                >
                  Save Edits
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 2: USER MANAGEMENT & MODERATION */}
      {activeTab === 'users' && (
        <div className="bg-[#1C023E] border border-purple-800/60 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-800/60 pb-4">
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <UserX className="w-5 h-5 text-amber-400" />
                <span>User Accounts & TOS Moderation</span>
              </h2>
              <p className="text-xs text-purple-300/80">
                Restrict or ban users who violate Terms of Service, or adjust user coin/crown balances.
              </p>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-purple-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={userSearchTerm}
                onChange={(e) => setUserSearchTerm(e.target.value)}
                placeholder="Search username or ID..."
                className="bg-[#110125] text-white pl-9 pr-4 py-2 rounded-xl border border-purple-700/60 text-xs focus:outline-none focus:border-amber-400 w-64"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-purple-800/60 text-purple-300 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-3">User</th>
                  <th className="py-3 px-3">IG Handle</th>
                  <th className="py-3 px-3">Crowns</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-900/40 text-purple-100">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-purple-900/20 transition">
                    <td className="py-3 px-3 font-bold flex items-center gap-2">
                      <span className="text-lg">{u.avatar}</span>
                      <div>
                        <span className="text-white block">{u.username}</span>
                        <span className="text-[10px] text-purple-400 font-mono">{u.id}</span>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-purple-300 font-mono">
                      @thefanmahal_user
                    </td>

                    <td className="py-3 px-3 font-black text-amber-400">
                      👑 {u.crowns.toLocaleString()}
                    </td>

                    <td className="py-3 px-3">
                      {u.isBanned ? (
                        <span className="bg-rose-900/60 text-rose-300 border border-rose-700/50 px-2 py-0.5 rounded-full text-[10px] font-bold">
                          🚫 BANNED
                        </span>
                      ) : (
                        <span className="bg-emerald-900/40 text-emerald-300 border border-emerald-700/50 px-2 py-0.5 rounded-full text-[10px] font-bold">
                          ● ACTIVE
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-3 text-right space-x-2">
                      {u.isBanned ? (
                        <button
                          onClick={() => {
                            unbanUser(u.id);
                            alert(`User ${u.username} unbanned!`);
                          }}
                          className="px-2.5 py-1 bg-emerald-600/30 text-emerald-200 hover:bg-emerald-600/50 border border-emerald-500/40 rounded-lg font-bold"
                        >
                          Restore / Unban
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            const reason = prompt(`Enter Ban Reason for ${u.username}:`, 'Multiple account creation / TOS violation');
                            if (reason) {
                              banUser(u.id, reason);
                              alert(`User ${u.username} account restricted!`);
                            }
                          }}
                          className="px-2.5 py-1 bg-rose-900/50 hover:bg-rose-800 text-rose-200 border border-rose-700/40 rounded-lg font-bold"
                        >
                          Ban User
                        </button>
                      )}

                      <button
                        onClick={() => {
                          adjustUserBalance(u.id, 500, 200);
                          alert(`Granted 500 Fan Coins & 200 Crowns bonus to ${u.username}!`);
                        }}
                        className="px-2.5 py-1 bg-purple-800/50 hover:bg-purple-700 text-amber-300 border border-purple-600/40 rounded-lg font-bold"
                      >
                        +Bonus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: BROADCAST ANNOUNCEMENTS */}
      {activeTab === 'announcements' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-[#1C023E] border border-purple-800/60 rounded-2xl p-5 shadow-xl space-y-4 text-xs">
            <h2 className="text-lg font-black text-white flex items-center gap-2 border-b border-purple-800/60 pb-3">
              <Megaphone className="w-5 h-5 text-amber-400" />
              <span>Publish Top Announcement Banner</span>
            </h2>

            <form onSubmit={handleCreateAnnouncement} className="space-y-3">
              <div>
                <label className="block text-purple-200 font-bold mb-1">Banner Headline</label>
                <input
                  type="text"
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                  placeholder="e.g. ⚡ Midnight Elimination Predictions are LIVE!"
                  className="w-full bg-[#110125] text-white border border-purple-700/60 rounded-xl px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-purple-200 font-bold mb-1">Message Description</label>
                <textarea
                  value={annMsg}
                  onChange={(e) => setAnnMsg(e.target.value)}
                  placeholder="e.g. Stake your Fan Coins now before Friday 10 PM IST broadcast."
                  className="w-full bg-[#110125] text-purple-200 border border-purple-700/60 rounded-xl px-3 py-2 h-20"
                  required
                />
              </div>

              <div>
                <label className="block text-purple-200 font-bold mb-1">Banner Type</label>
                <select
                  value={annType}
                  onChange={(e) => setAnnType(e.target.value as any)}
                  className="w-full bg-[#110125] text-amber-300 font-bold border border-purple-700/60 rounded-xl px-3 py-2"
                >
                  <option value="INFO">INFO (Purple/Pink)</option>
                  <option value="ALERT">ALERT (Amber/Red)</option>
                  <option value="CELEBRATION">CELEBRATION (Pink/Gold)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black py-3 rounded-xl shadow-lg transition uppercase tracking-wide"
              >
                Publish Live Announcement
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 space-y-3">
            <h2 className="text-lg font-black text-white">Active Announcements ({announcements.length})</h2>
            {announcements.map((a) => (
              <div
                key={a.id}
                className="bg-[#1C023E] border border-purple-800/60 rounded-xl p-4 flex items-start justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-900 text-amber-300">
                      {a.type}
                    </span>
                    <h3 className="font-extrabold text-white text-sm">{a.title}</h3>
                  </div>
                  <p className="text-xs text-purple-200/80 mt-1">{a.message}</p>
                </div>

                <button
                  onClick={() => deleteAnnouncement(a.id)}
                  className="p-1.5 text-rose-400 hover:text-rose-300"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: YOUTUBE RAFFLE NOTICE */}
      {activeTab === 'youtube' && (
        <div className="bg-[#1C023E] border border-purple-800/60 rounded-2xl p-6 shadow-xl space-y-4 max-w-2xl">
          <div className="border-b border-purple-800/60 pb-3">
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <Youtube className="w-5 h-5 text-rose-500" />
              <span>YouTube Live Stream Raffle Notice Manager</span>
            </h2>
            <p className="text-xs text-purple-300/80 mt-1">
              Configure the YouTube stream notice for monthly transparent raffle ticket drawings.
            </p>
          </div>

          <form onSubmit={handleSaveYouTubeNotice} className="space-y-4 text-xs">
            <div>
              <label className="block text-purple-200 font-bold mb-1">Raffle Title</label>
              <input
                type="text"
                value={ytTitle}
                onChange={(e) => setYtTitle(e.target.value)}
                className="w-full bg-[#110125] text-white border border-purple-700/60 rounded-xl px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-purple-200 font-bold mb-1">Scheduled Date & Time Text</label>
              <input
                type="text"
                value={ytDate}
                onChange={(e) => setYtDate(e.target.value)}
                className="w-full bg-[#110125] text-amber-300 font-bold border border-purple-700/60 rounded-xl px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-purple-200 font-bold mb-1">YouTube Live Channel / Stream URL</label>
              <input
                type="url"
                value={ytUrl}
                onChange={(e) => setYtUrl(e.target.value)}
                className="w-full bg-[#110125] text-rose-300 font-mono border border-purple-700/60 rounded-xl px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-purple-200 font-bold mb-1">Fairness Note</label>
              <textarea
                value={ytNote}
                onChange={(e) => setYtNote(e.target.value)}
                className="w-full bg-[#110125] text-purple-200 border border-purple-700/60 rounded-xl px-3 py-2 h-20"
              />
            </div>

            <button
              type="submit"
              className="bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 text-white font-black px-6 py-3 rounded-xl shadow-lg transition uppercase tracking-wide flex items-center gap-2"
            >
              <Youtube className="w-4 h-4" />
              <span>Update YouTube Stream Notice</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
