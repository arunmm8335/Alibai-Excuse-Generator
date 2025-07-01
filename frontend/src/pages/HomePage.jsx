import React, { useState } from 'react';
import ChatInterface from '../components/ChatInterface';
import HistorySidebar from '../components/HistorySidebar';
import SettingsSidebar from '../components/SettingsSidebar';

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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            
            {/* Left Sidebar (History) - Spans 3 of 12 columns on large screens */}
            <div className="lg:col-span-3 order-1 lg:order-1">
                <HistorySidebar />
            </div>

            {/* Center Content (Chat) - Spans 6 of 12 columns */}
            <div className="lg:col-span-6 order-3 lg:order-2">
                {/* Pass settings down as props */}
                <ChatInterface settings={settings} />
            </div>

            {/* Right Sidebar (Settings) - Spans 3 of 12 columns */}
            <div className="lg:col-span-3 order-2 lg:order-3">
                {/* Pass settings and the handler down as props */}
                <SettingsSidebar settings={settings} onSettingsChange={handleSettingsChange} />
            </div>

        </div>
    );
};

export default HomePage;