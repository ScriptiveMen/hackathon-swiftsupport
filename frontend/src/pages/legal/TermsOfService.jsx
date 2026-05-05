import React, { useEffect } from "react";
import ScrollFade from "../../components/home/ScrollFade";

const TermsOfService = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen pt-40 pb-24 px-6 bg-[#f8fbff]">
      <div className="max-w-4xl mx-auto">
        <ScrollFade delay={0} y={30}>
          <div className="mb-16">
            <h1 className="text-4xl md:text-5xl font-black text-[#0a2a3a] mb-4 tracking-tight" style={{ fontFamily: "'Switzer Extrabold', sans-serif" }}>
              Terms of <span className="text-[#04b8ff]">Service</span>
            </h1>
            <p className="text-[#7aaabb] font-medium">Effective Date: May 4, 2026</p>
          </div>
        </ScrollFade>

        <div className="bg-white p-10 md:p-16 rounded-[3rem] border border-[#04b8ff]/10 shadow-sm legal-content">
          <p className="text-[#4a6070] italic mb-10 leading-relaxed">
            Please read these Terms of Service ("Terms") carefully before using the SwiftSupport platform. By accessing or using our services, you agree to be bound by these Terms.
          </p>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#0a2a3a] mb-6">1. Use of Services</h2>
            <p className="text-[#4a6070] leading-relaxed mb-4">
              You must be at least 18 years old to use our services. You are responsible for maintaining the security of your account and password. SwiftSupport cannot and will not be liable for any loss or damage from your failure to comply with this security obligation.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#0a2a3a] mb-6">2. Subscription & Payments</h2>
            <p className="text-[#4a6070] leading-relaxed mb-4">
              Some parts of the Service are billed on a subscription basis. You will be billed in advance on a recurring and periodic basis. Billing cycles are set either on a monthly or annual basis, depending on the type of subscription plan you select.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#0a2a3a] mb-6">3. Content & AI Usage</h2>
            <p className="text-[#4a6070] leading-relaxed mb-4">
              You retain all ownership rights to the content you upload to the platform. By using our services, you grant us a license to process your data for the purpose of providing support and improving our AI models. 
            </p>
            <p className="text-[#4a6070] leading-relaxed">
              We do not guarantee the 100% accuracy of AI-generated responses. It is the user's responsibility to review and verify critical information provided by the AI.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#0a2a3a] mb-6">4. Termination</h2>
            <p className="text-[#4a6070] leading-relaxed">
              We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#0a2a3a] mb-6">5. Limitation of Liability</h2>
            <p className="text-[#4a6070] leading-relaxed">
              In no event shall SwiftSupport AI Inc. be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0a2a3a] mb-6">6. Governing Law</h2>
            <p className="text-[#4a6070] leading-relaxed">
              These Terms shall be governed and construed in accordance with the laws of the State of Delaware, United States, without regard to its conflict of law provisions.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
