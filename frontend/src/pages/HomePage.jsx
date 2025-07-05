import React, { useState } from 'react';
import ChatInterface from '../components/ChatInterface';
import HistorySidebar from '../components/HistorySidebar';
// import SettingsSidebar from '../components/SettingsSidebar';

const HomePage = () => {
    // State is "lifted up" to this parent component to be shared
    const [settings, setSettings] = useState({
        context: 'social',
        urgency: 'medium',
        language: 'English',
    });

    const handleSettingsChange = (newSettings) => {
        setSettings(newSettings);
    };

    return (
        // The new 3-column grid layout
        <div className="space-y-8">
            {/* Hero Section */}
            <section className="card bg-base-200/80 shadow-xl p-8 mb-2 text-center max-w-3xl mx-auto animate-fade-in">
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-4">
                    Welcome to Alibai
                </h1>
                <p className="text-lg text-neutral/80 mb-6">Your AI-powered excuse generator for any situation. Generate, customize, and download proof in seconds!</p>
                <a href="#main-chat" className="btn btn-primary btn-wide focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary" aria-label="Start Generating Excuses" tabIndex={0}>
                    Start Generating
                </a>
            </section>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Left Sidebar (History) - Spans 3 of 12 columns on large screens */}
                <div className="lg:col-span-3 order-1 lg:order-1">
                    <HistorySidebar />
                </div>
                {/* Center Content (Chat) - Spans 6 of 12 columns */}
                <div className="lg:col-span-6 order-3 lg:order-2" id="main-chat">
                    {/* Pass settings down as props */}
                    <ChatInterface settings={settings} />
                </div>
                {/* Right Sidebar (Settings) - Spans 3 of 12 columns */}
                {/* <div className="lg:col-span-3 order-2 lg:order-3">
                    <SettingsSidebar settings={settings} onSettingsChange={handleSettingsChange} />
                </div> */}
            </div>
        </div>
    );
};

export default HomePage;