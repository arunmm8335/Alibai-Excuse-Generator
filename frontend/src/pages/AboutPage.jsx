import React from 'react';
import { Link } from 'react-router-dom';
import Slider from "react-slick"; // Import the slider component

// Import the required CSS for the slider
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// A helper component for feature cards to keep the main code clean
const FeatureCard = ({ icon, title, children }) => (
  <div className="card bg-base-300/50 hover:bg-base-300/70 transition-all duration-300 ease-in-out shadow-lg h-full">
    <div className="card-body">
      <div className="flex items-center gap-4 mb-3">
        <div className="text-primary">{icon}</div>
        <h3 className="card-title text-lg font-semibold">{title}</h3>
      </div>
      <p className="text-neutral/80 text-sm">{children}</p>
    </div>
  </div>
);

// A helper component for objective items with corrected text color
const ObjectiveItem = ({ children }) => (
  <li className="flex items-start gap-3">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-success flex-shrink-0 mt-1"><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" /></svg>
    {/* --- FIXED: Explicitly set text color for visibility --- */}
    <span className="text-neutral/90">{children}</span>
  </li>
);

// A helper component for custom slider arrows
const CustomArrow = ({ className, style, onClick, direction }) => (
  <div
    className={`${className} before:text-primary !w-12 !h-12`}
    style={{ ...style, display: "block" }}
    onClick={onClick}
  />
);


const AboutPage = () => {
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    nextArrow: <CustomArrow />,
    prevArrow: <CustomArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  };

  return (
    <div className="animate-fade-in space-y-24 py-10 pt-[64px]">

      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent pb-4">
          Intelligent Excuse Generator
        </h1>
        <p className="text-lg md:text-xl text-neutral/80 mt-4 leading-relaxed">
          An AI-driven system designed to provide context-aware, highly customizable excuses for any scenario, enhancing user credibility with automated reasoning and supportive proof generation.
        </p>
        <Link to="/" className="btn btn-primary btn-wide mt-12 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary" aria-label="Try the Generator" tabIndex={0}>
          Try the Generator
        </Link>
      </section>

      {/* Project Overview & Objectives Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        {/* --- FIXED: Added matching card style to this section --- */}
        <div className="card bg-base-200 p-8 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-4">Project Overview</h2>
          <p className="text-neutral/80">
            The LaunchEd AI team was assigned the development of this platform to push the boundaries of creative AI. The system leverages advanced language models to generate natural, believable, and adaptable excuses, complete with proof and automated messaging capabilities.
          </p>
        </div>
        <div className="card bg-base-200 p-8">
          <h2 className="text-2xl font-bold mb-6">Key Objectives</h2>
          <ul className="space-y-4">
            <ObjectiveItem>Develop an AI-powered excuse generator with contextual awareness.</ObjectiveItem>
            <ObjectiveItem>Enable users to generate proof-backed excuses for various situations.</ObjectiveItem>
            <ObjectiveItem>Integrate automated messaging and emergency alert systems via Twilio.</ObjectiveItem>
            <ObjectiveItem>Ensure all AI outputs sound natural, believable, and adaptive.</ObjectiveItem>
          </ul>
        </div>
      </section>

      {/* --- FIXED: Core Features Section with Carousel --- */}
      <section className="py-12">
        <h2 className="text-4xl font-bold mb-12 text-center">Core Features at a Glance</h2>
        <Slider {...sliderSettings}>
          <div className="p-3">
            <FeatureCard title="AI-Generated Excuses" icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" /></svg>}>
              Context-based suggestions (work, school, social, family) with smart ranking.
            </FeatureCard>
          </div>
          <div className="p-3">
            <FeatureCard title="Scenario Customization" icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.39.44 1.022.12 1.45l-.527.737c-.25.35-.272.806-.108 1.204.165.397.505.71.93.78l.894.149c.542.09.94.56.94 1.11v1.093c0 .55-.398 1.02-.94 1.11l-.894.149c-.425.07-.765.383-.93.78-.165.398-.142.854.108 1.204l.527.738c.32.427.27 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.93l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527a1.125 1.125 0 0 1-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.149c-.542-.09-.94-.56-.94-1.11v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.142-.854-.108-1.204l-.527-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.93l.15-.894Z" /></svg>}>
              Refine excuses based on urgency and believability through simple dropdown controls.
            </FeatureCard>
          </div>
          <div className="p-3">
            <FeatureCard title="Proof Generator" icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>}>
              AI-generated chat screenshots and documents to support your alibi.
            </FeatureCard>
          </div>
          <div className="p-3">
            <FeatureCard title="Twilio Call System" icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" /></svg>}>
              Triggers a real, automated phone call to your device, reading the excuse aloud.
            </FeatureCard>
          </div>
          <div className="p-3">
            <FeatureCard title="Voice & Text Integration" icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 0 1 6 0v7.5a3 3 0 0 1-3 3Z" /></svg>}>
              Generate excuses using both written and speech-to-text input for added convenience.
            </FeatureCard>
          </div>
          <div className="p-3">
            <FeatureCard title="Excuse History & Favorites" icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>}>
              Save frequently used excuses for quick access and view your entire generation history.
            </FeatureCard>
          </div>
        </Slider>
      </section>

    </div>
  );
};

export default AboutPage;