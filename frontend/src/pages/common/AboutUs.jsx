import React, { useEffect } from "react";
import ScrollFade from "../../components/home/ScrollFade";
import ScrollReveal from "../../components/home/ScrollReveal";

const AboutUs = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen pt-40 pb-24 px-6 bg-[#f8fbff]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center flex flex-col items-center justify-center mb-20">
          <ScrollFade delay={0} y={30}>
            <h1 className="text-4xl md:text-6xl font-black text-[#0a2a3a] mb-6 tracking-tight" style={{ fontFamily: "'Switzer Extrabold', sans-serif" }}>
              Our <span className="text-[#04b8ff]">Story</span>
            </h1>
          </ScrollFade>
          <ScrollReveal
            baseOpacity={0}
            enableBlur={true}
            blurStrength={8}
            containerClassName="text-lg text-[#4a6070] max-w-2xl mx-auto leading-relaxed"
          >
            We're on a mission to humanize customer support through the power of artificial intelligence.
          </ScrollReveal>
        </div>

        <div className="space-y-16">
          <ScrollFade delay={0.2} y={20}>
            <section>
              <h2 className="text-3xl font-bold text-[#0a2a3a] mb-6">The Problem</h2>
              <p className="text-[#4a6070] text-lg leading-relaxed mb-4">
                Customer support is often broken. Long wait times, repetitive questions, and overwhelmed agents lead to frustrated customers and burnout. We saw a world where technology was making things more complex, not simpler.
              </p>
              <p className="text-[#4a6070] text-lg leading-relaxed">
                Traditional help desks were built as filing systems for tickets, not as conversation engines for people. We knew there was a better way.
              </p>
            </section>
          </ScrollFade>

          <ScrollFade delay={0.3} y={20}>
            <section className="bg-white p-10 rounded-[2.5rem] border border-[#04b8ff]/10 shadow-sm">
              <h2 className="text-3xl font-bold text-[#0a2a3a] mb-6">The SwiftSupport Vision</h2>
              <p className="text-[#4a6070] text-lg leading-relaxed mb-4">
                Founded in 2024, SwiftSupport was built with a simple goal: to make customer support effortless for both sides of the conversation. 
              </p>
              <p className="text-[#4a6070] text-lg leading-relaxed">
                By combining state-of-the-art Large Language Models (LLMs) with a beautiful, intuitive interface, we've created a platform that doesn't just manage tickets—it solves problems. Our AI doesn't replace humans; it empowers them to do their best work.
              </p>
            </section>
          </ScrollFade>

          <ScrollFade delay={0.4} y={20}>
            <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: "AI-First", desc: "Built from the ground up to leverage the latest in machine learning." },
                { title: "User-Centric", desc: "Every feature is designed with the agent and customer in mind." },
                { title: "Scalable", desc: "From startups to enterprises, we grow with your volume seamlessly." }
              ].map((item, i) => (
                <div key={i} className="bg-[#04b8ff]/5 p-8 rounded-3xl border border-[#04b8ff]/10">
                  <h3 className="text-xl font-bold text-[#0a2a3a] mb-3">{item.title}</h3>
                  <p className="text-[#5a7a8a] text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </section>
          </ScrollFade>

          <ScrollFade delay={0.5} y={20}>
            <div className="text-center pt-10">
              <h2 className="text-2xl font-bold text-[#0a2a3a] mb-4">Join us on our journey</h2>
              <p className="text-[#5a7a8a] mb-8">We're just getting started. Help us redefine the future of support.</p>
              <button className="px-8 py-4 bg-[#0a2a3a] text-white rounded-full font-bold hover:bg-[#04b8ff] transition-colors duration-300 shadow-lg">
                View Careers
              </button>
            </div>
          </ScrollFade>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
