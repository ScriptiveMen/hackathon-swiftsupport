import React, { useEffect } from "react";
import ScrollFade from "../../components/home/ScrollFade";
import ScrollReveal from "../../components/home/ScrollReveal";

const Security = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const features = [
    {
      title: "Data Encryption",
      desc: "All data is encrypted at rest using AES-256 and in transit using TLS 1.2+ with Perfect Forward Secrecy.",
      icon: "ri-lock-password-line"
    },
    {
      title: "Compliance",
      desc: "We maintain SOC 2 Type II compliance and are fully GDPR and HIPAA ready for enterprise requirements.",
      icon: "ri-shield-check-line"
    },
    {
      title: "Identity Protection",
      desc: "Enforce multi-factor authentication (MFA) and single sign-on (SSO) via SAML 2.0, Okta, or Google.",
      icon: "ri-fingerprint-line"
    },
    {
      title: "Infrastructure",
      desc: "Hosted on AWS in multi-region, high-availability zones with real-time DDoS protection and monitoring.",
      icon: "ri-server-line"
    }
  ];

  return (
    <div className="min-h-screen pt-40 pb-24 px-6 bg-[#f8fbff]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center flex flex-col items-center justify-center mb-24">
          <ScrollFade delay={0} y={30}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-[12px] font-bold mb-6">
              <i className="ri-shield-flash-line"></i>
              ENTERPRISE-GRADE SECURITY
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-[#0a2a3a] mb-6 tracking-tight" style={{ fontFamily: "'Switzer Extrabold', sans-serif" }}>
              Secure by <span className="text-[#04b8ff]">Design</span>
            </h1>
          </ScrollFade>
          <ScrollReveal
            baseOpacity={0}
            enableBlur={true}
            blurStrength={8}
            containerClassName="text-lg text-[#4a6070] max-w-2xl mx-auto leading-relaxed"
          >
            Trust is the foundation of our platform. We implement the highest industry standards to ensure your customer data remains safe and private.
          </ScrollReveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          {features.map((f, i) => (
            <ScrollFade key={i} delay={0.1 * i} y={30}>
              <div className="bg-white p-10 rounded-[2.5rem] border border-[#04b8ff]/10 shadow-sm hover:shadow-md transition-shadow h-full">
                <div className="w-14 h-14 rounded-2xl bg-[#04b8ff]/10 text-[#04b8ff] flex items-center justify-center mb-8">
                  <i className={`${f.icon} text-3xl`}></i>
                </div>
                <h3 className="text-2xl font-bold text-[#0a2a3a] mb-4">{f.title}</h3>
                <p className="text-[#4a6070] leading-relaxed">{f.desc}</p>
              </div>
            </ScrollFade>
          ))}
        </div>

        <ScrollFade delay={0.4} y={30}>
          <div className="bg-white rounded-[3rem] p-12 border border-[#04b8ff]/10 shadow-sm">
            <h2 className="text-3xl font-bold text-[#0a2a3a] mb-10 text-center">Frequently Asked Security Questions</h2>
            <div className="space-y-8">
              {[
                { q: "Where is my data stored?", a: "By default, all data is stored in the US-East (Northern Virginia) region. For enterprise customers, we offer regional data residency in Europe and Asia-Pacific." },
                { q: "How often do you perform security audits?", a: "We conduct internal audits monthly and hire independent third-party security firms for full penetration testing every six months." },
                { q: "Do you offer Bug Bounty programs?", a: "Yes! We believe in a collaborative security approach. If you find a vulnerability, please report it to security@swiftsupport.ai for a reward." }
              ].map((faq, idx) => (
                <div key={idx} className="border-b border-gray-100 pb-8 last:border-0 last:pb-0">
                  <h4 className="text-xl font-bold text-[#0a2a3a] mb-3">{faq.q}</h4>
                  <p className="text-[#5a7a8a] leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </ScrollFade>

        <div className="mt-20 text-center">
            <p className="text-[#5a7a8a] mb-6">Need more details or a compliance report?</p>
            <button className="px-10 py-4 bg-[#0a2a3a] text-white rounded-full font-bold hover:bg-[#04b8ff] transition-colors">
                Contact Security Team
            </button>
        </div>
      </div>
    </div>
  );
};

export default Security;
