import React, { useEffect } from "react";
import ScrollFade from "../../components/home/ScrollFade";

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen pt-40 pb-24 px-6 bg-[#f8fbff]">
      <div className="max-w-4xl mx-auto">
        <ScrollFade delay={0} y={30}>
          <div className="mb-16">
            <h1 className="text-4xl md:text-5xl font-black text-[#0a2a3a] mb-4 tracking-tight" style={{ fontFamily: "'Switzer Extrabold', sans-serif" }}>
              Privacy <span className="text-[#04b8ff]">Policy</span>
            </h1>
            <p className="text-[#7aaabb] font-medium">Last updated: May 4, 2026</p>
          </div>
        </ScrollFade>

        <div className="bg-white p-10 md:p-16 rounded-[3rem] border border-[#04b8ff]/10 shadow-sm legal-content">
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#0a2a3a] mb-6">1. Introduction</h2>
            <p className="text-[#4a6070] leading-relaxed mb-4">
              At SwiftSupport, we respect your privacy and are committed to protecting it. This Privacy Policy describes how SwiftSupport AI Inc. ("we," "us," or "our") collects, uses, and shares information about you when you use our website, mobile app, and platform services.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#0a2a3a] mb-6">2. Information We Collect</h2>
            <p className="text-[#4a6070] leading-relaxed mb-4">We collect information that you provide directly to us, such as when you create an account, communicate with customer support, or integrate your third-party tools.</p>
            <ul className="list-disc pl-6 space-y-3 text-[#4a6070]">
              <li><strong>Account Information:</strong> Name, email address, password, and organization details.</li>
              <li><strong>Customer Support Data:</strong> Transcripts of chats, emails, and tickets processed through our platform.</li>
              <li><strong>Payment Information:</strong> Billing address and payment method (processed through Stripe).</li>
              <li><strong>Technical Data:</strong> IP address, browser type, device information, and usage patterns.</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#0a2a3a] mb-6">3. How We Use Information</h2>
            <p className="text-[#4a6070] leading-relaxed mb-4">We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-3 text-[#4a6070]">
              <li>Provide, maintain, and improve our services.</li>
              <li>Train our AI models to provide more accurate support (anonymized).</li>
              <li>Process transactions and send billing notices.</li>
              <li>Send technical alerts, updates, and administrative messages.</li>
              <li>Detect and prevent fraudulent or unauthorized activity.</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#0a2a3a] mb-6">4. Data Sharing & Disclosure</h2>
            <p className="text-[#4a6070] leading-relaxed mb-4">We do not sell your personal data. We may share information with:</p>
            <ul className="list-disc pl-6 space-y-3 text-[#4a6070]">
              <li>Service providers who perform services on our behalf (e.g., hosting, payment processing).</li>
              <li>Professional advisors, such as lawyers and auditors.</li>
              <li>In response to legal requests or to protect our rights.</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#0a2a3a] mb-6">5. Your Choices</h2>
            <p className="text-[#4a6070] leading-relaxed">
              You can access, update, or delete your account information at any time through your dashboard. You may also opt-out of marketing communications by following the unsubscribe instructions in those emails.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0a2a3a] mb-6">6. Contact Us</h2>
            <p className="text-[#4a6070] leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at privacy@swiftsupport.ai.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
