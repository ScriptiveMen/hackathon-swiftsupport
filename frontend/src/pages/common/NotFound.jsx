import React from "react";
import { useNavigate } from "react-router-dom";
import FuzzyText from "../../components/common/FuzzyText";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#000000] flex flex-col items-center justify-center p-4 overflow-hidden select-none">
      <div className="flex flex-col items-center justify-center">
        <FuzzyText 
          fontSize="clamp(6rem, 25vw, 15rem)" 
          color="#ffffff"
          baseIntensity={0.25}
          hoverIntensity={0.5}
          fuzzRange={25}
          fontWeight={900}
        >
          404
        </FuzzyText>
        <div className="mt-4 md:mt-6">
          <FuzzyText 
            fontSize="clamp(1.5rem, 6vw, 4rem)" 
            color="#ffffff"
            baseIntensity={0.25}
            hoverIntensity={0.5}
            fuzzRange={20}
            fontWeight={700}
          >
            not found
          </FuzzyText>
        </div>
      </div>
      
      <button
        onClick={() => navigate("/")}
        className="mt-20 px-8 py-2.5 border border-white/30 text-white/50 text-[11px] font-bold uppercase tracking-[0.3em] hover:text-white hover:border-white transition-all duration-500"
      >
        Return to Safety
      </button>
    </div>
  );
};

export default NotFound;
