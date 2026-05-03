import ScrollReveal from './ScrollReveal';
import ScrollFade from './ScrollFade';

const testimonials = [
  { name: "James R.", role: "CX Director, Apex Retail", avatar: "JR", avatarColor: "#04b8ff", rating: 5, text: "Deploying SwiftSupport was the best decision we made this year. Our support volume doubled, but our team size stayed the same — AI handled the rest flawlessly." },
  { name: "Priya M.", role: "Operations Lead, FinEdge", avatar: "PM", avatarColor: "#8b5cf6", rating: 5, text: "The onboarding took less than an hour and we had our first AI agent running before lunch. The quality of automated responses genuinely surprised our entire team." },
  { name: "Carlos T.", role: "Founder, ShopFlow", avatar: "CT", avatarColor: "#22c55e", rating: 5, text: "We reduced our average response time from 4 hours to 90 seconds. Customers are happier, our agents are less stressed, and our CSAT jumped from 3.8 to 4.9." },
  { name: "Anika S.", role: "Support Manager, CloudBase", avatar: "AS", avatarColor: "#f59e0b", rating: 5, text: "The analytics dashboard alone is worth it. I can see exactly where bottlenecks happen and fix them in real time. Game changer for our growing support team." },
  { name: "David L.", role: "VP Product, NeuralStack", avatar: "DL", avatarColor: "#e11d48", rating: 5, text: "Integration was seamless — connected to Slack, Salesforce, and our custom API in under 30 minutes. The AI routing is scarily accurate about ticket assignment." },
  { name: "Yemi O.", role: "Head of Success, Luminary", avatar: "YO", avatarColor: "#0891b2", rating: 5, text: "What sets SwiftSupport apart is how natural the AI responses feel. Our customers rarely realize they're talking to a bot — and when they do, they're still impressed." },
];

function StarRating({ count = 5 }) {
  return (
    <div className="flex gap-0.5">
      {Array(count).fill(0).map((_, i) => (
        <svg key={i} className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  return (
    <section
      className="py-24"
      style={{ background: "linear-gradient(180deg, #f7fbff 0%, #e8f6ff 100%)" }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <ScrollFade delay={0} blur={4}>
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[12px] font-semibold mb-5"
              style={{
                background: "rgba(4,184,255,0.10)",
                border: "1px solid rgba(4,184,255,0.25)",
                color: "#04b8ff",
              }}
            >
              ✦ Customer Reviews
            </div>
          </ScrollFade>

          <ScrollFade delay={0.1} y={24} blur={3}>
            <h2
              className="text-[36px] lg:text-[46px] font-black text-[#0a2a3a] leading-[1.1]"
              style={{ fontFamily: "'Switzer Extrabold', 'Inter', sans-serif", letterSpacing: "-0.02em" }}
            >
              What They Say{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #04b8ff 0%, #0055aa 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                About Us
              </span>
            </h2>
          </ScrollFade>

          <ScrollReveal baseOpacity={0} enableBlur={true} baseRotation={3} blurStrength={6} containerClassName="text-[15px] text-[#4a6070] mt-3">
            Join thousands of teams who have transformed their support operations.
          </ScrollReveal>

          <ScrollFade delay={0.2} y={16}>
            <div className="flex items-center justify-center gap-3 mt-5">
              <StarRating count={5} />
              <span className="text-[14px] font-semibold text-[#1e3a4a]">4.9 / 5</span>
              <span className="text-[13px] text-[#7aaabb]">from 2,400+ reviews</span>
            </div>
          </ScrollFade>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map(({ name, role, avatar, avatarColor, rating, text }, i) => (
            <ScrollFade key={name} delay={i * 0.08} y={30} blur={3}>
              <div
                className="flex flex-col gap-4 p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 h-full"
                style={{
                  background: "rgba(255,255,255,0.85)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(4,184,255,0.14)",
                  boxShadow: "0 4px 20px rgba(4,184,255,0.07)",
                }}
              >
                <StarRating count={rating} />
                <p className="text-[14px] text-[#3a5a6a] leading-relaxed flex-1">"{text}"</p>
                <div className="flex items-center gap-3 pt-2 border-t border-[#0bbaff]/10">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, ${avatarColor}, ${avatarColor}aa)` }}
                  >
                    {avatar}
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-[#0a2a3a]">{name}</div>
                    <div className="text-[11px] text-[#7aaabb]">{role}</div>
                  </div>
                </div>
              </div>
            </ScrollFade>
          ))}
        </div>
      </div>
    </section>
  );
}
