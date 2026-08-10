import React from 'react';
import { ShieldCheck, ArrowLeft, ExternalLink } from 'lucide-react';

interface PrivacyViewProps {
  onNavigateBack?: () => void;
}

export const PrivacyView: React.FC<PrivacyViewProps> = ({ onNavigateBack }) => {
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
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-900/80 border border-purple-500/40 rounded-full text-xs font-bold text-emerald-400 mb-3">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Official Legal Document</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-serif text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400">
            Privacy Policy — Fanmahal
          </h1>
          <p className="text-sm text-purple-300/80 mt-2 leading-relaxed">
            Fanmahal ("we," "us," "our," "the Platform") operates fanmahal.com, a free-to-play reality TV fantasy prediction platform. This Privacy Policy explains what information we collect, how we use it, and your rights regarding that information. By creating an account or using Fanmahal, you agree to the practices described in this Privacy Policy.
          </p>
        </div>

        {/* Section 1 */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-amber-300 flex items-center gap-2">
            1. Information We Collect
          </h2>
          <div className="space-y-3 text-sm text-purple-200/90 leading-relaxed pl-2 border-l-2 border-[#FF1E94]/40">
            <div>
              <p className="font-bold text-purple-100">Account Information</p>
              <ul className="list-disc list-inside space-y-1 text-purple-300/80 text-xs mt-1">
                <li>Email address (required, via Google Sign-In, email magic link, or email/password)</li>
                <li>Public display handle / username (chosen by you)</li>
                <li>Instagram handle (mandatory — used only for public display in raffle results and winner announcements; see Section 4)</li>
                <li>Phone number (currently optional; will become mandatory for all users in a future phase, announced in advance — see Section 8)</li>
                <li>Profile avatar selection</li>
              </ul>
            </div>

            <div>
              <p className="font-bold text-purple-100">Usage Information</p>
              <ul className="list-disc list-inside space-y-1 text-purple-300/80 text-xs mt-1">
                <li>Predictions made, coins staked, Crowns earned</li>
                <li>Ad-viewing activity (for reward tracking and daily/weekly limits)</li>
                <li>Referral activity</li>
                <li>Login timestamps and general app usage patterns</li>
              </ul>
            </div>

            <div>
              <p className="font-bold text-purple-100">Technical Information</p>
              <ul className="list-disc list-inside space-y-1 text-purple-300/80 text-xs mt-1">
                <li>IP address and device/browser information (used solely for fraud prevention — see Section 5)</li>
              </ul>
            </div>

            <div className="p-3 bg-rose-950/40 border border-rose-500/30 rounded-xl text-xs text-rose-200 mt-2">
              <strong>We do NOT collect or require:</strong> Payment card details, bank information, or any financial data (Fanmahal never processes real-money transactions); Government ID numbers; Precise real-time location data.
            </div>
          </div>
        </div>

        {/* Section 2 */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-amber-300">
            2. How We Use Your Information
          </h2>
          <ul className="list-disc list-inside space-y-1.5 text-sm text-purple-200/90 leading-relaxed pl-2 border-l-2 border-[#FF1E94]/40">
            <li>To create and maintain your account</li>
            <li>To operate the core prediction/leaderboard game mechanics</li>
            <li>To determine raffle and leaderboard prize eligibility</li>
            <li>To deliver prizes (hampers, vouchers) to verified winners</li>
            <li>To detect and prevent fraud, duplicate accounts, and abuse (see Section 5)</li>
            <li>To send you service-related communications (e.g., about your account, prize wins, or important platform changes)</li>
            <li>To improve the Platform based on aggregated, anonymized usage patterns</li>
          </ul>
          <p className="text-xs font-bold text-amber-300 mt-2">
            We do not sell your personal information to third parties.
          </p>
        </div>

        {/* Section 3 */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-amber-300">
            3. Third-Party Services
          </h2>
          <p className="text-sm text-purple-200/90 leading-relaxed">
            Fanmahal uses the following third-party services to operate:
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm text-purple-200/90 leading-relaxed pl-2 border-l-2 border-[#FF1E94]/40">
            <li>
              <strong>Firebase (Google)</strong> — authentication and database infrastructure. Google's own privacy practices apply to data processed through Firebase. See{' '}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#FF1E94] hover:underline inline-flex items-center gap-1 font-bold"
              >
                Google's Privacy Policy <ExternalLink className="w-3 h-3" />
              </a>
            </li>
            <li>
              <strong>Google Sign-In</strong> — if you choose to sign in with Google, we receive your name, email, and profile picture as authorized by you during sign-in.
            </li>
            <li>
              <strong>IPQualityScore (IPQS)</strong> — used solely for fraud/duplicate-account detection (IP and device reputation scoring). We do not use this data for any other purpose.
            </li>
            <li>
              <strong>Random.org</strong> — used to conduct the monthly raffle draw publicly and verifiably. Only your Instagram handle (not your email, phone, or real name) is used in this process.
            </li>
          </ul>
        </div>

        {/* Section 4 */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-amber-300">
            4. Public Information
          </h2>
          <p className="text-sm text-purple-200/90 leading-relaxed">
            Your <strong>Instagram handle</strong> — not your email, phone number, or real name — is the only identifying information shown publicly on:
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm text-purple-200/90 leading-relaxed pl-2 border-l-2 border-[#FF1E94]/40">
            <li>The season leaderboard</li>
            <li>Monthly raffle eligible-participant lists</li>
            <li>Winner announcements (in-app and on our official YouTube channel/Instagram)</li>
          </ul>
          <p className="text-xs text-purple-300/80">
            If you do not wish to have your Instagram handle displayed publicly, please contact us — however, please note that per our Terms of Service, an Instagram handle is currently required to be eligible for physical prizes.
          </p>
        </div>

        {/* Section 5 */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-amber-300">
            5. Fraud Prevention
          </h2>
          <p className="text-sm text-purple-200/90 leading-relaxed">
            To keep the platform fair for everyone, we use automated systems to detect signals associated with duplicate accounts or abuse, including:
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm text-purple-200/90 leading-relaxed pl-2 border-l-2 border-[#FF1E94]/40">
            <li>IP address and device pattern analysis</li>
            <li>Signup velocity monitoring</li>
            <li>Disposable/temporary email detection</li>
          </ul>
          <p className="text-xs text-purple-300/80">
            Accounts flagged by these systems are not blocked from playing, but may be excluded from leaderboard ranking and prize eligibility pending review. We do not use this data to build advertising profiles or share it with advertisers.
          </p>
        </div>

        {/* Section 6 */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-amber-300">
            6. Data Retention
          </h2>
          <p className="text-sm text-purple-200/90 leading-relaxed">
            We retain your account information for as long as your account remains active. If you request account deletion, we will delete your personal information within a reasonable timeframe, except where we are required to retain certain records for legal, tax, or fraud-prevention purposes.
          </p>
        </div>

        {/* Section 7 */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-amber-300">
            7. Your Rights
          </h2>
          <p className="text-sm text-purple-200/90 leading-relaxed">You may:</p>
          <ul className="list-disc list-inside space-y-1 text-sm text-purple-200/90 leading-relaxed pl-2 border-l-2 border-[#FF1E94]/40">
            <li>Request a copy of the personal information we hold about you</li>
            <li>Request correction of inaccurate information</li>
            <li>Request deletion of your account and associated personal data</li>
            <li>Withdraw consent for optional data collection (e.g., phone number, while it remains optional)</li>
          </ul>
        </div>

        {/* Section 8 */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-amber-300">
            8. Phone Number — Phased Requirement
          </h2>
          <p className="text-sm text-purple-200/90 leading-relaxed">
            Phone number collection is currently <strong>optional</strong>. In a future phase, announced in advance with a clear deadline, phone verification will become <strong>mandatory platform-wide</strong> to strengthen prize-delivery accuracy and identity verification. Users who do not verify their phone number by the announced deadline will have their accounts temporarily frozen (existing Coins, Crowns, and data fully preserved) until they verify — no data is deleted.
          </p>
        </div>

        {/* Section 9 */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-amber-300">
            9. Children's Privacy
          </h2>
          <p className="text-sm text-purple-200/90 leading-relaxed">
            Fanmahal is intended for users aged 18 and above. We do not knowingly collect personal information from anyone under 18. If we become aware that a user under 18 has created an account, we will take steps to remove the account and associated data.
          </p>
        </div>

        {/* Section 10 */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-amber-300">
            10. Contact Us
          </h2>
          <p className="text-sm text-purple-200/90 leading-relaxed">
            For questions about this Privacy Policy or your personal data, contact us at:{' '}
            <a href="mailto:privacy@fanmahal.com" className="text-[#FF1E94] hover:underline font-bold">
              privacy@fanmahal.com
            </a>
          </p>
        </div>

        {/* Section 11 */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-amber-300">
            11. Changes to This Policy
          </h2>
          <p className="text-sm text-purple-200/90 leading-relaxed">
            We may update this Privacy Policy from time to time. Material changes will be announced on the Platform. Continued use of Fanmahal after changes take effect constitutes acceptance of the revised policy.
          </p>
        </div>
      </div>
    </div>
  );
};
