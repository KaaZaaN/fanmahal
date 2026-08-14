import React from 'react';
import { ShieldCheck, ArrowLeft } from 'lucide-react';

interface TermsViewProps {
  onNavigateBack?: () => void;
}

export const TermsView: React.FC<TermsViewProps> = ({ onNavigateBack }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6 pb-16 animate-fadeIn">
      {/* Back Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            if (onNavigateBack) {
              onNavigateBack();
            } else {
              window.history.pushState({}, '', '/');
              window.dispatchEvent(new Event('popstate'));
            }
          }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-900/60 hover:bg-purple-800/80 border border-purple-500/40 rounded-xl text-xs font-bold text-amber-300 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Fanmahal Home</span>
        </button>

        <span className="text-xs text-purple-300/60 font-mono">
          Last Updated: August 10, 2026
        </span>
      </div>

      {/* Main Content Card */}
      <div className="bg-[#1A023B]/80 backdrop-blur-md border border-[#FF1E94]/30 rounded-3xl p-6 sm:p-10 shadow-2xl text-purple-100 space-y-8">
        {/* Title */}
        <div className="border-b border-purple-800/50 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-900/80 border border-purple-500/40 rounded-full text-xs font-bold text-amber-300 mb-3">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Official Terms of Service</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-serif text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400">
            Terms of Service — Fanmahal
          </h1>
          <p className="text-sm text-purple-300/80 mt-2 leading-relaxed">
            Welcome to Fanmahal ("we," "us," "our," "the Platform"), operated at fanmahal.com. By creating an account or using Fanmahal, you agree to these Terms of Service ("Terms"). Please read them carefully.
          </p>
        </div>

        {/* Section 1 */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-amber-300">
            1. Eligibility
          </h2>
          <ul className="list-disc list-inside space-y-1 text-sm text-purple-200/90 leading-relaxed pl-2 border-l-2 border-[#FF1E94]/40">
            <li>You must be <strong>18 years of age or older</strong> to create an account or use Fanmahal.</li>
            <li>You must provide accurate information during registration.</li>
            <li>Each individual may hold only one account. Creating multiple accounts to circumvent limits, referral rules, or fair-play mechanics is prohibited and may result in disqualification from leaderboards and prizes (see Section 6).</li>
          </ul>
        </div>

        {/* Section 2 */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-amber-300">
            2. What Fanmahal Is
          </h2>
          <p className="text-sm text-purple-200/90 leading-relaxed">
            Fanmahal is a <strong>100% free-to-play</strong> fantasy prediction platform for Indian reality television shows. Users make predictions about show outcomes using free virtual "Fan Coins," and correct predictions earn virtual "Crowns" that determine leaderboard rank and prize eligibility.
          </p>

          <div className="p-4 bg-amber-400/10 border border-amber-400/30 rounded-2xl text-xs text-amber-200 space-y-1.5">
            <p className="font-bold text-amber-300 uppercase tracking-wider">Fanmahal involves NO real money at any point:</p>
            <ul className="list-disc list-inside space-y-1 text-purple-200">
              <li>Fan Coins and Crowns are virtual, have no monetary value, cannot be purchased with real money, and cannot be exchanged, sold, transferred, or redeemed for cash under any circumstances.</li>
              <li>There is no entry fee to play any part of Fanmahal.</li>
              <li>All prizes awarded (see Section 5) are physical goods, gift vouchers, or similar non-cash rewards — never cash.</li>
            </ul>
          </div>

          <p className="text-xs text-purple-300/80">
            This structure is intentional and is designed so that Fanmahal operates purely as a free entertainment and prediction platform, not a game of chance or skill played for money.
          </p>
        </div>

        {/* Section 3 */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-amber-300">
            3. Account Responsibilities
          </h2>
          <ul className="list-disc list-inside space-y-1 text-sm text-purple-200/90 leading-relaxed pl-2 border-l-2 border-[#FF1E94]/40">
            <li>You are responsible for maintaining the confidentiality of your account access (including your Google Sign-In session or email verification codes).</li>
            <li>You are responsible for all activity that occurs under your account.</li>
            <li>Notify us immediately if you suspect unauthorized access to your account.</li>
          </ul>
        </div>

        {/* Section 4 */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-amber-300">
            4. How the Game Works
          </h2>
          <ul className="list-disc list-inside space-y-1.5 text-sm text-purple-200/90 leading-relaxed pl-2 border-l-2 border-[#FF1E94]/40">
            <li>Every week, prediction questions are published with individual deadlines. Once a question's deadline passes, no further predictions can be made on it.</li>
            <li>You may stake Fan Coins (earned for free via weekly refresh, watching reward ads, or referrals) on your predicted outcome.</li>
            <li>Correct predictions earn Crowns based on the question's difficulty multiplier.</li>
            <li>Season-long Crown totals determine your leaderboard rank.</li>
            <li>Weekly leaderboards and season milestones offer additional prize opportunities via verified scoring and leaderboards (see Section 5).</li>
          </ul>
          <p className="text-xs text-purple-300/80">
            Specific mechanics, multipliers, and thresholds may be adjusted over time to maintain game balance and fairness; material changes will be communicated on the Platform.
          </p>
        </div>

        {/* Section 5 */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-amber-300">
            5. Prizes
          </h2>
          <ul className="list-disc list-inside space-y-1.5 text-sm text-purple-200/90 leading-relaxed pl-2 border-l-2 border-[#FF1E94]/40">
            <li>Top-ranked users on the weekly and season leaderboards are eligible for prizes consisting of physical hampers, gift vouchers, or similar non-cash rewards, subject to availability and sponsor participation.</li>
            <li><strong>Instagram handle is required</strong> to be eligible to receive any prize — this is used for public winner announcement and verification. Real identity/contact information (verified phone number, once mandatory) is used separately and privately for actual prize delivery.</li>
            <li>Fanmahal reserves the right to verify a winner's eligibility (including checking for fraudulent account activity) before delivering any prize.</li>
            <li>Prize delivery timelines may vary; Fanmahal will make reasonable efforts to deliver prizes within a reasonable timeframe of a leaderboard cycle or season ending.</li>
            <li>Winners may be responsible for any applicable taxes on prizes received, in accordance with Indian tax law.</li>
          </ul>
        </div>

        {/* Section 6 */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-amber-300">
            6. Fair Play and Prohibited Conduct
          </h2>
          <p className="text-sm text-purple-200/90 leading-relaxed">You agree not to:</p>
          <ul className="list-disc list-inside space-y-1 text-sm text-purple-200/90 leading-relaxed pl-2 border-l-2 border-[#FF1E94]/40">
            <li>Create or use multiple accounts to gain an unfair advantage</li>
            <li>Use bots, scripts, or automated tools to interact with the Platform</li>
            <li>Attempt to manipulate, exploit, or interfere with the Platform's prediction, coin, or Crown systems</li>
            <li>Impersonate another person or entity, including through a false Instagram handle</li>
            <li>Engage in any activity that disrupts the fair operation of leaderboards or raffles</li>
          </ul>
          <p className="text-xs text-purple-300/80">
            Fanmahal uses automated fraud-detection systems (see our Privacy Policy) to identify suspicious activity. Accounts found in violation of these Terms may be excluded from leaderboard ranking and prize eligibility, and/or suspended/terminated at our discretion. For Squad-based team violations, the entire Squad may be disqualified from that season's rewards if confirmed collusion is found.
          </p>
        </div>

        {/* Section 7 */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-amber-300">
            7. No Gambling
          </h2>
          <p className="text-sm text-purple-200/90 leading-relaxed">
            Fanmahal is deliberately structured to avoid any characteristics of real-money gaming or gambling under Indian law, including the Promotion and Regulation of Online Gaming Act, 2025. Specifically:
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm text-purple-200/90 leading-relaxed pl-2 border-l-2 border-[#FF1E94]/40">
            <li>No cash or real-money value is ever staked, wagered, or exchanged</li>
            <li>No purchase is necessary to participate in any part of the Platform</li>
            <li>All currencies (Fan Coins, Crowns) are earned for free and hold no monetary value</li>
          </ul>
        </div>

        {/* Section 8 */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-amber-300">
            8. Intellectual Property
          </h2>
          <p className="text-sm text-purple-200/90 leading-relaxed">
            All content on Fanmahal, including but not limited to the Fanmahal name, logo, branding, and platform design, is the property of Fanmahal and may not be copied, reproduced, or used without permission. References to third-party reality TV shows are used for descriptive/commentary purposes in connection with our prediction game and do not imply affiliation with or endorsement by the shows' producers or broadcasters unless explicitly stated.
          </p>
        </div>

        {/* Section 9 */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-amber-300">
            9. Disclaimer of Warranties
          </h2>
          <p className="text-sm text-purple-200/90 leading-relaxed">
            Fanmahal is provided "as is." We do not guarantee uninterrupted or error-free operation of the Platform. We are not responsible for outcomes of the reality TV shows featured on the Platform, which are entirely outside our control.
          </p>
        </div>

        {/* Section 10 */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-amber-300">
            10. Limitation of Liability
          </h2>
          <p className="text-sm text-purple-200/90 leading-relaxed">
            To the maximum extent permitted by law, Fanmahal shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Platform. Since no real money is ever at stake on Fanmahal, our maximum liability to any user is limited to the value of any prize they were properly entitled to receive.
          </p>
        </div>

        {/* Section 11 */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-amber-300">
            11. Changes to the Platform and Terms
          </h2>
          <p className="text-sm text-purple-200/90 leading-relaxed">
            We may update these Terms, game mechanics, or reward structures from time to time. Material changes will be communicated on the Platform. Continued use of Fanmahal after changes take effect constitutes acceptance of the revised Terms.
          </p>
        </div>

        {/* Section 12 */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-amber-300">
            12. Governing Law
          </h2>
          <p className="text-sm text-purple-200/90 leading-relaxed">
            These Terms are governed by the laws of India. Any disputes arising from these Terms or your use of Fanmahal shall be subject to the jurisdiction of the courts of India.
          </p>
        </div>

        {/* Section 13 */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-amber-300">
            13. Contact Us
          </h2>
          <p className="text-sm text-purple-200/90 leading-relaxed">
            For questions about these Terms, contact us at:{' '}
            <a href="mailto:support@fanmahal.com" className="text-[#FF1E94] hover:underline font-bold">
              support@fanmahal.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
