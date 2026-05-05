import React, { useEffect } from "react";
import ScrollFade from "../../components/home/ScrollFade";

const GDPR = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen pt-40 pb-24 px-6 bg-[#f8fbff]">
      <div className="max-w-4xl mx-auto">
        <ScrollFade delay={0} y={30}>
          <div className="mb-16">
            <h1 className="text-4xl md:text-5xl font-black text-[#0a2a3a] mb-4 tracking-tight" style={{ fontFamily: "'Switzer Extrabold', sans-serif" }}>
              GDPR <span className="text-[#04b8ff]">Compliance</span>
            </h1>
            <p className="text-[#7aaabb] font-medium">Commitment to Data Protection</p>
          </div>
        </ScrollFade>

        <div className="bg-white p-10 md:p-16 rounded-[3rem] border border-[#04b8ff]/10 shadow-sm legal-content">
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#0a2a3a] mb-6">Our Commitment</h2>
            <p className="text-[#4a6070] leading-relaxed mb-4">
              The General Data Protection Regulation (GDPR) is a comprehensive data protection law that came into effect on May 25, 2018. SwiftSupport is fully committed to GDPR compliance across all our services.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#0a2a3a] mb-6">Your Rights under GDPR</h2>
            <p className="text-[#4a6070] leading-relaxed mb-4">Under the GDPR, individuals have several rights regarding their personal data:</p>
            <ul className="list-disc pl-6 space-y-4 text-[#4a6070]">
              <li><strong>Right to Access:</strong> You can request a copy of the personal data we hold about you.</li>
              <li><strong>Right to Rectification:</strong> You can request that we correct any inaccurate personal data.</li>
              <li><strong>Right to Erasure ("Right to be Forgotten"):</strong> You can request that we delete your personal data.</li>
              <li><strong>Right to Portability:</strong> You can request that we transfer your data to another service provider.</li>
              <li><strong>Right to Object:</strong> You can object to the processing of your personal data for certain purposes.</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#0a2a3a] mb-6">How we protect your data</h2>
            <p className="text-[#4a6070] leading-relaxed mb-4">
              We implement technical and organizational measures to ensure a level of security appropriate to the risk, including encryption, access controls, and regular security assessments.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0a2a3a] mb-6">Data Protection Officer</h2>
            <p className="text-[#4a6070] leading-relaxed">
              We have appointed a Data Protection Officer (DPO) to oversee our data protection strategy. You can reach our DPO at dpo@swiftsupport.ai.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default GDPR;
