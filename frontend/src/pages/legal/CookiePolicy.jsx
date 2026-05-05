import React, { useEffect } from "react";
import ScrollFade from "../../components/home/ScrollFade";

const CookiePolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen pt-40 pb-24 px-6 bg-[#f8fbff]">
      <div className="max-w-4xl mx-auto">
        <ScrollFade delay={0} y={30}>
          <div className="mb-16">
            <h1 className="text-4xl md:text-5xl font-black text-[#0a2a3a] mb-4 tracking-tight" style={{ fontFamily: "'Switzer Extrabold', sans-serif" }}>
              Cookie <span className="text-[#04b8ff]">Policy</span>
            </h1>
            <p className="text-[#7aaabb] font-medium">Last updated: May 4, 2026</p>
          </div>
        </ScrollFade>

        <div className="bg-white p-10 md:p-16 rounded-[3rem] border border-[#04b8ff]/10 shadow-sm legal-content">
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#0a2a3a] mb-6">What are cookies?</h2>
            <p className="text-[#4a6070] leading-relaxed mb-4">
              Cookies are small text files that are stored on your device when you visit a website. They are widely used to make websites work more efficiently and provide information to the owners of the site.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#0a2a3a] mb-6">How we use cookies</h2>
            <p className="text-[#4a6070] leading-relaxed mb-4">We use cookies for the following purposes:</p>
            <ul className="list-disc pl-6 space-y-4 text-[#4a6070]">
              <li><strong>Essential Cookies:</strong> Necessary for the website to function properly, such as keeping you logged in.</li>
              <li><strong>Performance Cookies:</strong> Help us understand how visitors interact with our website by collecting and reporting information anonymously.</li>
              <li><strong>Functionality Cookies:</strong> Allow the website to remember choices you make (such as your language preference).</li>
              <li><strong>Targeting Cookies:</strong> Used to deliver advertisements more relevant to you and your interests.</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#0a2a3a] mb-6">Your choices</h2>
            <p className="text-[#4a6070] leading-relaxed mb-4">
              Most web browsers allow you to control cookies through their settings. However, if you limit the ability of websites to set cookies, you may worsen your overall user experience.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0a2a3a] mb-6">Changes to this policy</h2>
            <p className="text-[#4a6070] leading-relaxed">
              We may update our Cookie Policy from time to time. We will notify you of any changes by posting the new Cookie Policy on this page.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;
