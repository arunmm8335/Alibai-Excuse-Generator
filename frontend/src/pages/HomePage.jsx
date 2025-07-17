import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ChatInterface from '../components/ChatInterface';
import HistorySidebar from '../components/HistorySidebar';
import SettingsSidebar from '../components/SettingsSidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWandMagicSparkles, faFileShield, faPhone } from '@fortawesome/free-solid-svg-icons';
import imageCompression from 'browser-image-compression';
import toast from 'react-hot-toast';
import api from '../api';

const HomePage = () => {
    // State is "lifted up" to this parent component to be shared
    const [settings, setSettings] = useState({
        context: 'social',
        urgency: 'medium',
        language: 'English',
    });

    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    // Fetch history function
    const fetchHistory = async () => {
        const token = localStorage.getItem('token');
        if (!token) { setIsLoading(false); return; }
        try {
            const res = await api.get('/excuses/history', { headers: { 'x-auth-token': token } });
            setHistory(res.data);
        } catch { }
        setIsLoading(false);
    };
    useEffect(() => {
        fetchHistory();
        // Predictive notification
        const fetchPatterns = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;
            try {
                const res = await api.get('/users/profile/patterns', { headers: { 'x-auth-token': token } });
                if (res.data.patterns) {
                    const now = new Date();
                    const hour = now.getHours();
                    const day = now.getDay();
                    const toastKey = `pattern-toast-${hour}-${day}`;
                    if ((hour === res.data.patterns.hour || day === res.data.patterns.day) && !sessionStorage.getItem(toastKey)) {
                        toast('You often need an excuse around this time. Need one now?');
                        sessionStorage.setItem(toastKey, 'shown');
                    }
                }
            } catch { }
        };
        fetchPatterns();
    }, []);

    const handleSettingsChange = (newSettings) => {
        setSettings(newSettings);
    };

    // Add state and handlers for action buttons here
    // We'll move the logic from ChatInterface to here and pass as props
    // For now, just pass placeholders
    // Existing for history loading
    const [sidebarLoading, setSidebarLoading] = useState(false);
    const [lastExcuse, setLastExcuse] = useState(null);
    const [currentScenario, setCurrentScenario] = useState('');
    const [runSettings, setRunSettings] = useState({
        context: settings.context || '',
        urgency: settings.urgency || 'medium',
        language: settings.language || 'en',
        tone: settings.tone || 'neutral',
    });
    const [selectedPlatform, setSelectedPlatform] = useState('random');
    const [senderName, setSenderName] = useState('Me');
    const [receiverName, setReceiverName] = useState('Mom');
    const [senderAvatar, setSenderAvatar] = useState('');
    const [receiverAvatar, setReceiverAvatar] = useState('');
    const [senderAvatarFile, setSenderAvatarFile] = useState('');
    const [receiverAvatarFile, setReceiverAvatarFile] = useState('');
    const platformOptions = [
        { value: 'random', label: 'Random' },
        { value: 'whatsapp', label: 'WhatsApp' },
        { value: 'messenger', label: 'Messenger' },
        { value: 'sms', label: 'SMS' },
        { value: 'telegram', label: 'Telegram' },
        { value: 'instagram', label: 'Instagram DM' },
    ];
    // Helper to handle file upload, compress, and convert to data URL
    const handleAvatarFile = async (e, setAvatarFile, setAvatarUrl) => {
        const file = e.target.files[0];
        if (file) {
            const options = {
                maxSizeMB: 0.3, // 0.3 MB = 300 KB
                maxWidthOrHeight: 256, // Optional: resize to max 256px
                useWebWorker: true
            };
            try {
                const compressedFile = await imageCompression(file, options);
                if (compressedFile.size > 350 * 1024) {
                    toast.error('Avatar image is too large after compression. Please choose a smaller image.');
                    return;
                }
                const reader = new FileReader();
                reader.onload = (ev) => {
                    setAvatarFile(ev.target.result);
                    setAvatarUrl(''); // Clear URL input if file is uploaded
                };
                reader.readAsDataURL(compressedFile);
            } catch (err) {
                toast.error('Failed to compress image.');
            }
        }
    };
    const [messages, setMessages] = useState([]);
    const addMessageToChat = (msg) => setMessages(prev => [...prev, msg]);
    const updateMessages = (updater) => setMessages(updater);

    const handleGenerateApology = () => {
        if (!lastExcuse) {
            toast.error("Please generate an excuse first.");
            return;
        }
        const scenario = lastExcuse.scenario || currentScenario;
        const excuseText = lastExcuse.excuseText || lastExcuse.text;
        if (!scenario || !excuseText) {
            toast.error("Missing scenario or excuse text. Please generate an excuse first.");
            return;
        }
        setSidebarLoading(true);
        const promise = api.post('/excuses/apology',
            { scenario, excuseText, ...runSettings },
            { headers: { 'x-auth-token': localStorage.getItem('token') } }
        );
        toast.promise(promise, {
            loading: 'Crafting apology...',
            success: (res) => {
                addMessageToChat({ sender: 'ai', text: res.data.apologyText });
                return 'Apology generated!';
            },
            error: 'Failed to create apology.'
        }).finally(() => setSidebarLoading(false));
    };
    const handleGenerateProof = () => {
        if (!lastExcuse) {
            toast.error("Please generate an excuse first.");
            return;
        }
        const scenario = lastExcuse.scenario || currentScenario;
        const excuseText = lastExcuse.excuseText || lastExcuse.text;
        if (!scenario || !excuseText) {
            toast.error("Missing scenario or excuse text. Please generate an excuse first.");
            return;
        }
        setSidebarLoading(true);
        let platform = selectedPlatform;
        if (platform === 'random') {
            const choices = ['whatsapp', 'messenger', 'sms', 'telegram', 'instagram'];
            platform = choices[Math.floor(Math.random() * choices.length)];
        }
        const avatarToSend = senderAvatarFile || senderAvatar;
        const receiverAvatarToSend = receiverAvatarFile || receiverAvatar;
        const promise = api.post('/excuses/proof',
            { scenario, excuseText, ...runSettings, platform, senderName, receiverName, senderAvatar: avatarToSend, receiverAvatar: receiverAvatarToSend },
            { headers: { 'x-auth-token': localStorage.getItem('token') } }
        );
        toast.promise(promise, {
            loading: 'Generating proof...',
            success: (res) => {
                addMessageToChat({ sender: 'ai', type: 'proof', text: res.data.proofText, platform, senderName, receiverName, senderAvatar: avatarToSend, receiverAvatar: receiverAvatarToSend });
                return 'Proof created!';
            },
            error: (err) => {
                return 'Failed to generate proof.';
            }
        }).finally(() => setSidebarLoading(false));
    };
    const handleRealCall = async () => {
        if (!lastExcuse) {
            toast.error("Please generate an excuse first.");
            return;
        }
        const excuseText = lastExcuse.excuseText || lastExcuse.text;
        if (!excuseText) {
            toast.error("Missing excuse text. Please generate an excuse first.");
            return;
        }
        const userPhoneNumber = prompt("Enter your VERIFIED phone number (E.164 format, e.g., +14155552671):");
        if (!userPhoneNumber) return;
        setSidebarLoading(true);
        const promise = api.post('/calls/trigger',
            { userPhoneNumber, excuseText },
            { headers: { 'x-auth-token': localStorage.getItem('token') } }
        );
        toast.promise(promise, {
            loading: 'Initiating call...',
            success: 'Call sent! Check your phone.',
            error: (err) => err.response?.data?.msg || "Failed to initiate call."
        }).finally(() => setSidebarLoading(false));
    };

    // Keep runSettings in sync with settings prop
    React.useEffect(() => {
        setRunSettings({
            context: settings.context || '',
            urgency: settings.urgency || 'medium',
            language: settings.language || 'English',
            tone: settings.tone || 'neutral',
        });
    }, [settings.context, settings.urgency, settings.language, settings.tone]);

    return (
        <div className="min-h-screen flex flex-col">
            {/* Top padding for fixed navbar */}
            <div className="flex-1 flex flex-col pt-[64px]">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch justify-center min-h-[80vh] w-full px-2 md:px-8 mt-6">
                    {/* Left Sidebar (History) */}
                    <div className="lg:col-span-3 order-1 lg:order-1 min-h-[500px] max-h-[80vh] rounded-2xl shadow border border-base-300 p-4 flex flex-col">
                        <HistorySidebar />
                    </div>
                    {/* Center Content (Chat) */}
                    <div className="lg:col-span-6 order-3 lg:order-2 flex flex-col min-h-[500px] max-h-[80vh] h-full min-h-0">
                        <ChatInterface
                            settings={settings}
                            fetchHistory={fetchHistory}
                            lastExcuse={lastExcuse}
                            setLastExcuse={setLastExcuse}
                            messages={messages}
                            addMessageToChat={addMessageToChat}
                            updateMessages={updateMessages}
                            currentScenario={currentScenario}
                            setCurrentScenario={setCurrentScenario}
                            runSettings={runSettings}
                            setRunSettings={setRunSettings}
                            selectedPlatform={selectedPlatform}
                            setSelectedPlatform={setSelectedPlatform}
                            senderName={senderName}
                            setSenderName={setSenderName}
                            receiverName={receiverName}
                            setReceiverName={setReceiverName}
                            senderAvatar={senderAvatar}
                            setSenderAvatar={setSenderAvatar}
                            receiverAvatar={receiverAvatar}
                            setReceiverAvatar={setReceiverAvatar}
                            senderAvatarFile={senderAvatarFile}
                            setSenderAvatarFile={setSenderAvatarFile}
                            receiverAvatarFile={receiverAvatarFile}
                            setReceiverAvatarFile={setReceiverAvatarFile}
                        />
                    </div>
                    {/* Right Sidebar (Settings) */}
                    <div className="lg:col-span-3 order-2 lg:order-3 min-h-[500px] max-h-[80vh] rounded-2xl shadow border border-base-300 p-4 flex flex-col mt-32">
                        <SettingsSidebar settings={settings} onSettingsChange={handleSettingsChange} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
