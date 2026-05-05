import React, { useEffect } from "react";
import ScrollFade from "../../components/home/ScrollFade";
import ScrollReveal from "../../components/home/ScrollReveal";

const Integrations = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const integrationGroups = [
    {
      name: "Communication",
      items: [
        { name: "Slack", icon: "ri-slack-line", color: "#4A154B", desc: "Sync chat notifications directly to your Slack channels." },
        { name: "WhatsApp", icon: "ri-whatsapp-line", color: "#25D366", desc: "Support customers on the world's most popular messaging app." },
        { name: "Messenger", icon: "ri-messenger-line", color: "#0084FF", desc: "Connect your Facebook Page and handle messages in SwiftSupport." }
      ]
    },
    {
      name: "E-Commerce",
      items: [
        { name: "Shopify", icon: "ri-shopping-bag-3-line", color: "#96bf48", desc: "View order status and history directly within the support chat." },
        { name: "Stripe", icon: "ri-bank-card-line", color: "#6772e5", desc: "Manage subscriptions and process refunds without leaving the dashboard." },
        { name: "WooCommerce", icon: "ri-store-2-line", color: "#96588a", desc: "Deep integration for order management and customer data." }
      ]
    },
    {
      name: "Productivity",
      items: [
        { name: "Jira", icon: "ri-atlassian-line", color: "#0052CC", desc: "Convert support tickets into engineering tasks with one click." },
        { name: "Notion", icon: "ri-book-read-line", color: "#000000", desc: "Export chat transcripts and customer feedback to your workspace." },
        { name: "Zapier", icon: "ri-flashlight-line", color: "#FF4A00", desc: "Connect SwiftSupport with 5,000+ apps for custom workflows." }
      ]
    }
  ];

  return (
    <div className="min-h-screen pt-40 pb-24 px-6 bg-[#f8fbff]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center flex flex-col items-center justify-center mb-24">
          <ScrollFade delay={0} y={30}>
            <h1 className="text-4xl md:text-6xl font-black text-[#0a2a3a] mb-6 tracking-tight" style={{ fontFamily: "'Switzer Extrabold', sans-serif" }}>
              Connect Your <span className="text-[#04b8ff]">Stack</span>
            </h1>
          </ScrollFade>
          <ScrollReveal
            baseOpacity={0}
            enableBlur={true}
            blurStrength={8}
            containerClassName="text-lg text-[#4a6070] max-w-2xl mx-auto leading-relaxed"
          >
            SwiftSupport integrates seamlessly with the tools you already use, making your workflow faster and more efficient.
          </ScrollReveal>
        </div>

        <div className="space-y-24">
          {integrationGroups.map((group, groupIdx) => (
            <div key={groupIdx}>
              <ScrollFade delay={0.1} y={20}>
                <h2 className="text-2xl font-bold text-[#0a2a3a] mb-10 border-l-4 border-[#04b8ff] pl-4">{group.name}</h2>
              </ScrollFade>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {group.items.map((item, i) => (
                  <ScrollFade key={i} delay={0.1 * i} y={30} blur={4}>
                    <div className="bg-white p-8 rounded-[2.5rem] border border-[#04b8ff]/10 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group cursor-pointer">
                      <div 
                        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6"
                        style={{ background: `${item.color}10`, color: item.color }}
                      >
                        <i className={`${item.icon} text-3xl`}></i>
                      </div>
                      <h3 className="text-xl font-bold text-[#0a2a3a] mb-3">{item.name}</h3>
                      <p className="text-[#5a7a8a] text-sm leading-relaxed">{item.desc}</p>
                      
                      <div className="mt-6 flex items-center gap-2 text-[12px] font-bold text-[#04b8ff] opacity-0 group-hover:opacity-100 transition-opacity">
                        <span>Learn More</span>
                        <i className="ri-arrow-right-line"></i>
                      </div>
                    </div>
                  </ScrollFade>
                ))}
              </div>
            </div>
          ))}
        </div>

        <ScrollFade delay={0.5} y={20}>
          <div className="mt-32 text-center bg-gradient-to-br from-[#0a2a3a] to-[#04b8ff] p-16 rounded-[3rem] text-white">
            <h2 className="text-3xl font-bold mb-6">Need a custom integration?</h2>
            <p className="text-white/80 max-w-2xl mx-auto mb-10 text-lg">Use our robust REST API to build custom connections tailored to your unique business needs.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="px-10 py-4 bg-white text-[#0a2a3a] rounded-full font-bold hover:scale-105 transition-transform shadow-lg">
                View API Docs
              </button>
              <button className="px-10 py-4 bg-transparent border-2 border-white/30 text-white rounded-full font-bold hover:bg-white/10 transition-colors">
                Contact Developer Relations
              </button>
            </div>
          </div>
        </ScrollFade>
      </div>
    </div>
  );
};

export default Integrations;
