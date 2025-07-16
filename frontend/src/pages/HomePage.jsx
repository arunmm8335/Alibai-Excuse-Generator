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
            <div className="flex-1 flex flex-col pt-[64px] space-y-2 px-0 md:px-0 py-2 pb-24"> {/* Remove horizontal padding for full width */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 bg-base-200 flex-1 h-full w-full overflow-x-auto"> {/* Add w-full */}
                    {/* Left Sidebar (History) - Spans 3 of 12 columns on large screens */}
                    <div className="lg:col-span-3 order-1 lg:order-1 h-full">
                        <HistorySidebar />
                    </div>
                    {/* Center Content (Chat) - Spans 6 of 12 columns */}
                    <div className="lg:col-span-6 order-2 flex flex-col flex-1 h-full w-full max-w-full" id="main-chat">
                        <ChatInterface
                            settings={settings}
                            history={history}
                            setHistory={setHistory}
                            fetchHistory={fetchHistory}
                            lastExcuse={lastExcuse}
                            setLastExcuse={setLastExcuse}
                            currentScenario={currentScenario}
                            setCurrentScenario={setCurrentScenario}
                            runSettings={runSettings}
                            setRunSettings={setRunSettings}
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
                            messages={messages}
                            addMessageToChat={addMessageToChat}
                            updateMessages={updateMessages}
                        />
                    </div>
                    {/* Right Sidebar (Settings + Actions) - Spans 3 of 12 columns */}
                    <div className="lg:col-span-3 order-2 lg:order-3 flex flex-col gap-4 sticky top-[80px] h-fit">
                        <SettingsSidebar
                            settings={settings}
                            onSettingsChange={handleSettingsChange}
                        />
                        <div className="card bg-base-100 shadow-lg border border-base-300 p-4 flex flex-col gap-3">
                            <div className="flex flex-row gap-4 items-center justify-center mb-2">
                                <div className="flex flex-col items-center gap-1">
                                    <label className="text-xs font-semibold">Me</label>
                                    {senderAvatarFile && (
                                        <img src={senderAvatarFile} alt="Me avatar" className="w-8 h-8 rounded-full object-cover border border-base-300" />
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="file-input file-input-xs w-16"
                                        onChange={e => handleAvatarFile(e, setSenderAvatarFile, setSenderAvatar)}
                                    />
                                    <input
                                        className="input input-xs w-16 mt-1"
                                        value={senderName}
                                        onChange={e => setSenderName(e.target.value)}
                                        placeholder="Me"
                                    />
                                </div>
                                <div className="flex flex-col items-center gap-1">
                                    <label className="text-xs font-semibold">Other</label>
                                    {receiverAvatarFile && (
                                        <img src={receiverAvatarFile} alt="Other avatar" className="w-8 h-8 rounded-full object-cover border border-base-300" />
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="file-input file-input-xs w-16"
                                        onChange={e => handleAvatarFile(e, setReceiverAvatarFile, setReceiverAvatar)}
                                    />
                                    <input
                                        className="input input-xs w-16 mt-1"
                                        value={receiverName}
                                        onChange={e => setReceiverName(e.target.value)}
                                        placeholder="Other"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-row items-center gap-2 mb-2">
                                <span className="font-semibold text-xs whitespace-nowrap">Proof Style</span>
                                <select
                                    id="platform-select"
                                    className="select select-xs w-full"
                                    value={selectedPlatform}
                                    onChange={e => setSelectedPlatform(e.target.value)}
                                >
                                    {platformOptions.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>
                            <button
                                onClick={handleGenerateApology}
                                className="btn btn-secondary btn-xs gap-2 w-full"
                                disabled={!lastExcuse || sidebarLoading}
                                title="Generate Apology"
                            >
                                <FontAwesomeIcon icon={faWandMagicSparkles} />
                                Apology
                            </button>
                            <button
                                onClick={handleGenerateProof}
                                className="btn btn-accent btn-xs gap-2 w-full"
                                disabled={!lastExcuse || sidebarLoading}
                                title="Generate Proof"
                            >
                                <FontAwesomeIcon icon={faFileShield} />
                                Proof
                            </button>
                            <button
                                onClick={handleRealCall}
                                className="btn btn-warning btn-xs gap-2 w-full"
                                disabled={!lastExcuse || sidebarLoading}
                                title="Trigger Real Call"
                            >
                                <FontAwesomeIcon icon={faPhone} />
                                Call
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
