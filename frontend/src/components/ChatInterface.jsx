import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import ProofDisplay from './ProofDisplay';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWandMagicSparkles, faFileShield, faPhone, faMicrophone, faPaperPlane, faCommentDots, faBolt, faGlobe, faCog, faStar, faVolumeUp, faThumbsUp, faThumbsDown, faDownload, faShareNodes, faEnvelope, faSms, faInfoCircle, faCopy } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import html2canvas from 'html2canvas';
import imageCompression from 'browser-image-compression';
import api, { baseURL } from '../api';
import Modal from 'react-modal';
// import ExcuseChoices from './ExcuseChoices';



// Speech Recognition Setup
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;
if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
}

const urgencyOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
];
const languageOptions = [
    { value: 'English', label: 'English' },
    { value: 'Hindi', label: 'Hindi' },
    { value: 'Spanish', label: 'Spanish' },
    { value: 'French', label: 'French' },
];

const languageToSpeechCode = {
    English: 'en-US',
    Hindi: 'hi-IN',
    Spanish: 'es-ES',
    French: 'fr-FR',
};

const toneOptions = [
    { value: 'neutral', label: 'Neutral' },
    { value: 'formal', label: 'Formal' },
    { value: 'casual', label: 'Casual' },
    { value: 'humorous', label: 'Humorous' },
    { value: 'apologetic', label: 'Apologetic' },
    { value: 'assertive', label: 'Assertive' },
];

const ChatInterface = ({ settings, fetchHistory, lastExcuse, setLastExcuse, messages, addMessageToChat, updateMessages, ...rest }) => {
    // All component state, including for editing

    const { context, urgency, language } = settings;
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [excuseChoices, setExcuseChoices] = useState([]);
    const [currentScenario, setCurrentScenario] = useState('');
    const [isListening, setIsListening] = useState(false);
    const inputRef = useRef(null); // Ref to focus the input bar
    const chatContainerRef = useRef(null); // Ref to scroll to bottom
    const [runSettings, setRunSettings] = useState({
        context: settings.context || '',
        urgency: settings.urgency || 'medium',
        language: settings.language || 'en',
        tone: settings.tone || 'neutral',
    });
    // Keep runSettings in sync with settings prop
    useEffect(() => {
        setRunSettings({
            context: settings.context || '',
            urgency: settings.urgency || 'medium',
            language: settings.language || 'en',
            tone: settings.tone || 'neutral',
        });
    }, [settings.context, settings.urgency, settings.language, settings.tone]);
    const chatCardRef = useRef(null);
    const [inputError, setInputError] = useState('');
    // Remove local history state; use only props

    useEffect(() => {
        // Automatically scroll to the bottom when messages or choices change
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [settings]);

    // All handler functions are complete and correct
    const speak = (text) => {
        if (text?.startsWith("Sorry")) { toast.error("Nothing to read."); return; }
        const langCode = languageToSpeechCode[runSettings.language] || 'en-US';
        const utterance = new window.SpeechSynthesisUtterance(text);
        utterance.lang = langCode;
        // Try to select a matching voice
        const voices = window.speechSynthesis.getVoices();
        const match = voices.find(v => v.lang === langCode);
        if (match) utterance.voice = match;
        window.speechSynthesis.speak(utterance);
    };
    const handleGenerateApology = () => {
        if (!lastExcuse) {
            toast.error("Please generate an excuse first.");
            return;
        }

        // Get the scenario and excuse text from the last excuse
        const scenario = lastExcuse.scenario || currentScenario;
        const excuseText = lastExcuse.excuseText || lastExcuse.text;

        if (!scenario || !excuseText) {
            toast.error("Missing scenario or excuse text. Please generate an excuse first.");
            return;
        }

        setIsLoading(true);
        const promise = api.post('/excuses/apology',
            { scenario, excuseText, language: runSettings.language },
            { headers: { 'x-auth-token': localStorage.getItem('token') } }
        );

        toast.promise(promise, {
            loading: 'Crafting apology...',
            success: (res) => {
                addMessageToChat({ sender: 'ai', text: res.data.apologyText });
                return 'Apology generated!';
            },
            error: 'Failed to create apology.'
        }).finally(() => setIsLoading(false));
    };
    const [selectedPlatform, setSelectedPlatform] = useState('random');
    const platformOptions = [
        { value: 'random', label: 'Random' },
        { value: 'whatsapp', label: 'WhatsApp' },
        { value: 'messenger', label: 'Messenger' },
        { value: 'sms', label: 'SMS' },
        { value: 'telegram', label: 'Telegram' },
        { value: 'instagram', label: 'Instagram DM' },
    ];
    const [senderName, setSenderName] = useState('Me');
    const [receiverName, setReceiverName] = useState('Mom');
    const [senderAvatar, setSenderAvatar] = useState('');
    const [receiverAvatar, setReceiverAvatar] = useState('');
    // Add state for uploaded avatar images (data URLs)
    const [senderAvatarFile, setSenderAvatarFile] = useState('');
    const [receiverAvatarFile, setReceiverAvatarFile] = useState('');
    const [proofModalOpen, setProofModalOpen] = useState(false);

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
    const handleGenerateProof = () => {
        if (!lastExcuse) {
            toast.error("Please generate an excuse first.");
            return;
        }
        // Get the scenario and excuse text from the last excuse
        const scenario = lastExcuse.scenario || currentScenario;
        const excuseText = lastExcuse.excuseText || lastExcuse.text;
        console.log('Proof generation debug:', { lastExcuse, scenario, excuseText, currentScenario });
        if (!scenario || !excuseText) {
            toast.error("Missing scenario or excuse text. Please generate an excuse first.");
            return;
        }
        setIsLoading(true);
        // Pick a random platform if 'random' is selected
        let platform = selectedPlatform;
        if (platform === 'random') {
            const choices = ['whatsapp', 'messenger', 'sms', 'telegram', 'instagram'];
            platform = choices[Math.floor(Math.random() * choices.length)];
        }
        const avatarToSend = senderAvatarFile || senderAvatar;
        const receiverAvatarToSend = receiverAvatarFile || receiverAvatar;
        const promise = api.post('/excuses/proof',
            { scenario, excuseText, language: runSettings.language, platform, senderName, receiverName, senderAvatar: avatarToSend, receiverAvatar: receiverAvatarToSend },
            { headers: { 'x-auth-token': localStorage.getItem('token') } }
        );
        toast.promise(promise, {
            loading: 'Generating proof...',
            success: (res) => {
                console.log('Proof generation success:', res.data);
                addMessageToChat({ sender: 'ai', type: 'proof', text: res.data.proofText, platform, senderName, receiverName, senderAvatar: avatarToSend, receiverAvatar: receiverAvatarToSend });
                return 'Proof created!';
            },
            error: (err) => {
                console.error('Proof generation error:', err);
                return 'Failed to generate proof.';
            }
        }).finally(() => setIsLoading(false));
    };
    const handleRealCall = async () => {
        if (!lastExcuse) {
            toast.error("Please generate an excuse first.");
            return;
        }

        // Get the excuse text from the last excuse
        const excuseText = lastExcuse.excuseText || lastExcuse.text;

        if (!excuseText) {
            toast.error("Missing excuse text. Please generate an excuse first.");
            return;
        }

        const userPhoneNumber = prompt("Enter your VERIFIED phone number (E.164 format, e.g., +14155552671):");
        if (!userPhoneNumber) return;

        setIsLoading(true);
        const promise = api.post('/calls/trigger',
            { userPhoneNumber, excuseText },
            { headers: { 'x-auth-token': localStorage.getItem('token') } }
        );

        toast.promise(promise, {
            loading: 'Initiating call...',
            success: 'Call sent! Check your phone.',
            error: (err) => err.response?.data?.msg || "Failed to initiate call."
        }).finally(() => setIsLoading(false));
    };
    const handleFavorite = (excuseId) => { const promise = api.patch(`/excuses/${excuseId}/favorite`, null, { headers: { 'x-auth-token': localStorage.getItem('token') } }); toast.promise(promise, { loading: 'Updating...', success: (res) => { updateMessages(prev => prev.map(msg => msg._id === excuseId ? { ...msg, ...res.data } : msg)); return res.data.isFavorite ? 'Added to favorites!' : 'Removed from favorites.'; }, error: 'Could not update favorite status.', }); };
    const handleRateExcuse = (excuseId, rating) => { const promise = api.patch(`/excuses/${excuseId}/rate`, { rating }, { headers: { 'x-auth-token': localStorage.getItem('token') } }); toast.promise(promise, { loading: 'Saving rating...', success: (res) => { updateMessages(prev => prev.map(msg => msg._id === excuseId ? { ...msg, ...res.data } : msg)); return 'Rating saved! The AI will learn from this.'; }, error: 'Failed to submit rating.', }); };

    // Centralized function to call the generation API

    // Fuzzy duplicate detection helpers
    const stopwords = ['i', 'to', 'for', 'the', 'a', 'an', 'of', 'on', 'in', 'at', 'and', 'or', 'is', 'am', 'are', 'was', 'were', 'be', 'been', 'being', 'with', 'by', 'as', 'it', 'that', 'this', 'so', 'but', 'if', 'then', 'than', 'from', 'do', 'does', 'did', 'not', 'no', 'yes', 'my', 'your', 'our', 'their', 'his', 'her', 'its', 'me', 'you', 'we', 'they', 'he', 'she', 'will', 'would', 'can', 'could', 'should', 'shall', 'may', 'might', 'must'];
    function preprocess(text) {
        return text
            .toLowerCase()
            .split(/\s+/)
            .filter(word => !stopwords.includes(word))
            .join(' ');
    }
    function simpleSimilarity(a, b) {
        if (!a || !b) return 0;
        const aWords = new Set(a.split(' '));
        const bWords = new Set(b.split(' '));
        const intersection = new Set([...aWords].filter(x => bWords.has(x)));
        return intersection.size / Math.max(aWords.size, bWords.size);
    }

    const [effectiveExcuses, setEffectiveExcuses] = useState([]);
    useEffect(() => {
        // Fetch user's most effective excuses
        const fetchEffective = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;
            try {
                const res = await api.get('/users/profile/effective', { headers: { 'x-auth-token': token } });
                setEffectiveExcuses(res.data.effective || []);
            } catch { }
        };
        fetchEffective();
    }, []);

    // --- NEW: Streaming Send Handler ---
    const handleSend = async () => {
        const token = localStorage.getItem('token');
        if (!token) { toast.error('You must be logged in.'); navigate('/login'); return; }
        if (!input.trim()) {
            setInputError('Please enter a scenario.');
            return;
        }
        if (input.trim().length < 10 || input.trim().length > 500) {
            setInputError('Scenario must be between 10 and 500 characters.');
            return;
        } else {
            setInputError('');
        }

        // Fuzzy duplicate check (using history from settings prop)
        if (settings.history && Array.isArray(settings.history)) {
            const processedInput = preprocess(input.trim());
            const historyScenarios = settings.history.map(h => preprocess(h.scenario || ''));
            let bestMatch = { score: 0, index: -1 };
            historyScenarios.forEach((scenario, idx) => {
                const score = simpleSimilarity(processedInput, scenario);
                if (score > bestMatch.score) {
                    bestMatch = { score, index: idx };
                }
            });
            if (bestMatch.score > 0.6) {
                toast('A similar scenario already exists in your history.');
                return;
            }
        }

        const userMessage = { sender: 'user', text: input };
        const aiPlaceholderMessage = { sender: 'ai', text: '', isStreaming: true }; // Placeholder for the streaming response

        addMessageToChat(userMessage);
        addMessageToChat(aiPlaceholderMessage);
        const scenarioToSave = input;
        setCurrentScenario(scenarioToSave);
        setInput('');
        setIsLoading(true);

        // --- AI prompt with effectiveness influence ---
        let examplesPrompt = '';
        if (effectiveExcuses.length > 0) {
            examplesPrompt = '\n\nLEARNING: The user has previously had success with excuses like these. Generate a new excuse in a similar style:\n' + effectiveExcuses.map(e => `- "${e.excuseText}"`).join('\n');
        }
        try {
            const response = await fetch(`${baseURL}/excuses/generate-stream`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
                body: JSON.stringify({ scenario: input, context: runSettings.context, urgency: runSettings.urgency, language: runSettings.language, tone: runSettings.tone, examplesPrompt })
            });

            if (!response.body) throw new Error("Response body is empty.");
            const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
            let finalResponseText = '';

            // Read the stream chunk by chunk
            while (true) {
                const { value, done } = await reader.read();
                if (done) break;

                const lines = value.split('\n\n').filter(line => line.startsWith('data:'));
                for (const line of lines) {
                    const data = line.substring(5).trim();
                    if (data === '[DONE]') continue; // Stream completion signal
                    try {
                        const parsed = JSON.parse(data);
                        finalResponseText += parsed.content;
                        updateMessages(prev => prev.map((msg, index) =>
                            index === prev.length - 1 ? { ...msg, text: finalResponseText } : msg
                        ));
                    } catch (e) { console.error("Error parsing stream data:", data); }
                }
            }

            setIsLoading(false);

            // Once streaming is complete, save the final excuse
            console.log('Saving excuse data:', { scenario: scenarioToSave, excuseText: finalResponseText, context: runSettings.context });

            // Validate the final response text
            if (!finalResponseText || finalResponseText.trim() === '') {
                toast.error("No excuse text generated. Please try again.");
                updateMessages(prev => prev.filter(msg => !msg.isStreaming));
                setIsLoading(false);
                return;
            }

            const savePromise = api.post('/excuses/save', {
                scenario: scenarioToSave,
                excuseText: finalResponseText.trim(),
                context: runSettings.context
            }, { headers: { 'x-auth-token': token } });

            toast.promise(savePromise, {
                loading: 'Saving to history...',
                success: async (res) => {
                    console.log('Save success:', res.data);
                    const savedExcuse = res.data;
                    updateMessages(prev => prev.map((msg, index) => index === prev.length - 1 ? { ...msg, ...savedExcuse, isStreaming: false } : msg));
                    if (typeof setLastExcuse === 'function') setLastExcuse({ ...savedExcuse, isStreaming: false });
                    if (typeof fetchHistory === 'function') await fetchHistory(); // Refresh history from backend
                    return "Saved to history!";
                },
                error: (err) => {
                    console.error('Save error:', err.response?.data || err);
                    return err.response?.data?.msg || "Failed to save excuse.";
                }
            });

        } catch (error) {
            toast.error("Failed to get response from AI.");
            updateMessages(prev => prev.filter(msg => !msg.isStreaming));
            setIsLoading(false);
        }
    };
    const generateExcuseChoices = async (scenarioText) => {
        setIsLoading(true); setExcuseChoices([]);
        try {
            const res = await api.post('/excuses/generate', { scenario: scenarioText, context: runSettings.context, urgency: runSettings.urgency, language: runSettings.language, tone: runSettings.tone }, { headers: { 'x-auth-token': localStorage.getItem('token') } });
            if (res.data.choices && res.data.choices.length > 0) {
                setExcuseChoices(res.data.choices);
            } else { throw new Error("AI did not return any choices."); }
        } catch (error) {
            toast.error(error.response?.data?.msg || 'Error generating choices.');
        } finally { setIsLoading(false); }
    };



    const handleSelectExcuse = (excuseText) => { setIsLoading(true); setExcuseChoices([]); const promise = api.post('/excuses/save', { scenario: currentScenario, excuseText, context: runSettings.context }, { headers: { 'x-auth-token': localStorage.getItem('token') } }); toast.promise(promise, { loading: 'Saving your choice...', success: (res) => { const savedExcuseMessage = { sender: 'ai', ...res.data }; addMessageToChat(savedExcuseMessage); if (typeof setLastExcuse === 'function') setLastExcuse(savedExcuseMessage); return 'Excuse saved!'; }, error: 'Could not save excuse.' }).finally(() => setIsLoading(false)); };
    const handleVoiceInput = () => { if (!recognition) { return toast.error("Voice recognition is not supported in your browser."); } if (isListening) { recognition.stop(); return; } recognition.start(); recognition.onstart = () => setIsListening(true); recognition.onend = () => setIsListening(false); recognition.onerror = () => { toast.error("Voice recognition failed. Please try again."); setIsListening(false); }; recognition.onresult = (event) => { setInput(event.results[0][0].transcript); }; };

    // --- NEW: Simplified Edit Handler ---
    const handleEditClick = (message) => {
        setInput(message.text); // Load the text into the main input
        inputRef.current?.focus(); // Focus the main input
        toast.success("Prompt loaded for editing!");
    };

    const handleRunSettingChange = (field, value) => {
        setRunSettings(prev => {
            const updated = { ...prev, [field]: value };
            if (typeof settings.onSettingsChange === 'function') settings.onSettingsChange(updated);
            return updated;
        });
    };

    const handleDownloadScreenshot = async () => {
        if (!chatCardRef.current) return;
        const canvas = await html2canvas(chatCardRef.current, { backgroundColor: null });
        const link = document.createElement('a');
        link.download = 'excuseme-chat-screenshot.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    };

    // Share handlers
    const handleShareWhatsApp = (excuseText) => {
        const url = `https://wa.me/?text=${encodeURIComponent(excuseText)}`;
        window.open(url, '_blank');
    };
    const handleShareSMS = (excuseText) => {
        const url = `sms:?body=${encodeURIComponent(excuseText)}`;
        window.open(url, '_blank');
    };
    const handleShareEmail = (excuseText) => {
        const url = `mailto:?subject=${encodeURIComponent('Check out this excuse!')}&body=${encodeURIComponent(excuseText)}`;
        window.open(url, '_blank');
    };

    // Replace the copy button handler with a function that shows a toast
    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard!');
    };

    const [showTooltip, setShowTooltip] = useState(false);

    return (
        <div className="relative h-full w-full max-w-full px-2 md:px-6 flex flex-col justify-between items-stretch min-h-0">
            {/* History Sidebar (left) */}
            {/* Run Settings Sidebar (right) */}
            {/* Chat Card (center) */}
            <div className="h-full w-full flex flex-col min-h-0">
                <div ref={chatCardRef} className="card bg-base-100 rounded-2xl flex flex-col relative h-full min-h-0 w-full p-4" style={{ border: '2px solid #a3a3a3', boxShadow: '0 4px 24px 0 rgba(0,0,0,0.18)' }}>
                    <h2 className="card-title p-4 border-b border-base-300 text-base-content gradient-text">ExcuseMe Chat</h2>
                    {/* Only chat messages scroll */}
                    <div ref={chatContainerRef} className="flex-1 min-h-0 p-6 overflow-y-auto overflow-x-hidden w-full max-w-full">
                        {messages.map((msg, index) => (
                            <div key={index} className={`chat ${msg.sender === 'user' ? 'chat-end' : 'chat-start'} mb-4`}>
                                {msg.type === 'proof' ? (
                                    <ProofDisplay proofText={msg.text} platform={msg.platform} senderName={msg.senderName} receiverName={msg.receiverName} senderAvatar={msg.senderAvatar} receiverAvatar={msg.receiverAvatar} />
                                ) : (
                                    <div className={`chat-bubble max-w-md group relative px-6 py-4 whitespace-pre-line break-words transition-all duration-200
                                        ${msg.sender === 'user'
                                            ? 'bg-gray-900 text-white shadow-xl rounded-3xl text-lg font-semibold hover:bg-gray-800 hover:shadow-2xl ml-auto'
                                            : 'bg-black text-white shadow-2xl rounded-3xl text-lg font-bold border-0 hover:bg-gray-900 hover:shadow-2xl mr-auto'
                                        }`}>
                                        {msg.sender === 'user' ? msg.text : (msg.text || msg.excuseText)}
                                        {msg.sender === 'user' && !isLoading && (
                                            <button onClick={() => handleEditClick(msg)} className="btn btn-ghost btn-circle btn-xs absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
                                            </button>
                                        )}
                                        {msg.sender === 'ai' && msg._id && !msg.text?.startsWith("Sorry") && (
                                            (() => {
                                                const isApology = ((msg.text && msg.text.toLowerCase().includes('apology')) || (msg.excuseText && msg.excuseText.toLowerCase().includes('apology')));
                                                return (
                                                    <div className="flex gap-3 mt-2 items-center">
                                                        {/* Copy Button for both excuses and apologies */}
                                                        <button onClick={() => handleCopy(msg.text || msg.excuseText)} className="hover:text-primary hover:scale-110 transition-transform" title="Copy to clipboard">
                                                            <FontAwesomeIcon icon={faCopy} />
                                                        </button>
                                                        {/* Share buttons for both excuses and apologies */}
                                                        <button onClick={() => handleShareWhatsApp(msg.text || msg.excuseText)} className="hover:text-green-500 transition-transform" title="Share via WhatsApp">
                                                            <FontAwesomeIcon icon={faWhatsapp} />
                                                        </button>
                                                        <button onClick={() => handleShareSMS(msg.text || msg.excuseText)} className="hover:text-blue-400 transition-transform" title="Share via SMS">
                                                            <FontAwesomeIcon icon={faSms} />
                                                        </button>
                                                        <button onClick={() => handleShareEmail(msg.text || msg.excuseText)} className="hover:text-rose-500 transition-transform" title="Share via Email">
                                                            <FontAwesomeIcon icon={faEnvelope} />
                                                        </button>
                                                        {/* Only show favorite and worked buttons for excuses, not apologies */}
                                                        {!isApology && (
                                                            <>
                                                                <button onClick={() => handleFavorite(msg._id)} className={`hover:scale-110 transition-transform ${msg.isFavorite ? 'text-yellow-400' : 'hover:text-yellow-400'}`} title="Favorite">
                                                                    <FontAwesomeIcon icon={faStar} />
                                                                </button>
                                                                <div className="flex gap-2 items-center border-l border-base-content/20 pl-3 ml-2">
                                                                    <span className="text-xs">Worked?</span>
                                                                    <button onClick={() => handleRateExcuse(msg._id, 1)} disabled={msg.effectiveness !== 0} className={`hover:scale-110 transition-transform ${msg.effectiveness === 1 ? 'text-success' : 'hover:text-success'}`}> <FontAwesomeIcon icon={faThumbsUp} /> </button>
                                                                    <button onClick={() => handleRateExcuse(msg._id, -1)} disabled={msg.effectiveness !== 0} className={`hover:scale-110 transition-transform ${msg.effectiveness === -1 ? 'text-error' : 'hover:text-error'}`}> <FontAwesomeIcon icon={faThumbsDown} /> </button>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                );
                                            })()
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                        {isLoading && !excuseChoices.length && <span className="loading loading-dots loading-md text-primary self-start ml-4"></span>}
                        {excuseChoices.length > 0 && !isLoading && (<ExcuseChoices choices={excuseChoices} onSelect={handleSelectExcuse} />)}
                    </div>
                    {/* Input Bar (stick to bottom of chat card) */}
                    <div className="px-6 py-3 bg-base-200/30 mt-auto">
                        <div className="relative">
                            <div className="flex items-center gap-3 p-4 rounded-2xl bg-base-200/90 backdrop-blur-sm shadow-lg ring-2 ring-primary/30 relative">
                                {/* Voice Input Button */}
                                <button
                                    onClick={handleVoiceInput}
                                    className={`btn btn-circle btn-sm transition-all duration-300 ${isListening ? 'btn-error animate-pulse' : 'btn-ghost hover:bg-primary/10 hover:text-primary'}`}
                                    title={isListening ? "Stop recording" : "Start voice input"}
                                >
                                    <FontAwesomeIcon icon={faMicrophone} />
                                </button>
                                {/* Text Input */}
                                <div className="flex-1 relative">
                                    <div className="rounded-xl bg-base-100/90 ring-2 ring-primary/40 shadow focus-within:ring-primary/80 transition-all">
                                        <textarea
                                            ref={inputRef}
                                            className="textarea bg-transparent w-full resize-none border-none focus:outline-none focus:ring-0 p-2 text-base-content placeholder-base-content/60 text-base"
                                            placeholder="Describe your situation and I'll help you craft the perfect excuse..."
                                            rows="1"
                                            value={input}
                                            onChange={(e) => {
                                                setInput(e.target.value);
                                                // Auto-resize textarea
                                                e.target.style.height = 'auto';
                                                e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                                                if (e.target.value.length < 10 || e.target.value.length > 500) {
                                                    setInputError('Scenario must be between 10 and 500 characters.');
                                                } else {
                                                    setInputError('');
                                                }
                                            }}
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    handleSend();
                                                }
                                            }}
                                            disabled={isLoading}
                                            style={{ minHeight: '44px', maxHeight: '120px' }}
                                        />
                                    </div>
                                    {inputError && <div className="text-error text-xs mt-1">{inputError}</div>}
                                </div>
                                {/* Send Button */}
                                <button
                                    onClick={handleSend}
                                    className={`btn btn-circle btn-sm transition-all duration-300 ${isLoading || !input.trim() ? 'btn-disabled opacity-50' : 'btn-primary hover:scale-110'}`}
                                    disabled={isLoading || !input.trim()}
                                    title="Send message"
                                >
                                    {isLoading ? (
                                        <span className="loading loading-spinner loading-sm"></span>
                                    ) : (
                                        <FontAwesomeIcon icon={faPaperPlane} />
                                    )}
                                </button>
                                {/* Apology Button */}
                                <button
                                    onClick={handleGenerateApology}
                                    className="btn btn-circle btn-sm btn-accent ml-1"
                                    title="Generate Apology"
                                    disabled={isLoading}
                                >
                                    <FontAwesomeIcon icon={faWandMagicSparkles} />
                                </button>
                                {/* Proof Button */}
                                <button
                                    onClick={() => setProofModalOpen(true)}
                                    className="btn btn-circle btn-sm btn-info ml-1"
                                    title="Generate Proof"
                                    disabled={isLoading}
                                >
                                    <FontAwesomeIcon icon={faFileShield} />
                                </button>
                                {/* Call Button */}
                                <button
                                    onClick={handleRealCall}
                                    className="btn btn-circle btn-sm btn-warning ml-1"
                                    title="Trigger Real Call"
                                    disabled={isLoading}
                                >
                                    <FontAwesomeIcon icon={faPhone} />
                                </button>
                                {/* Subtle info icon triggers tooltip */}
                                {effectiveExcuses.length > 0 && (
                                    <div className="ml-1 flex items-center">
                                        <FontAwesomeIcon
                                            icon={faInfoCircle}
                                            className="text-info cursor-pointer"
                                            onMouseEnter={() => setShowTooltip(true)}
                                            onMouseLeave={() => setShowTooltip(false)}
                                            onFocus={() => setShowTooltip(true)}
                                            onBlur={() => setShowTooltip(false)}
                                            tabIndex={0}
                                        />
                                    </div>
                                )}
                            </div>
                            {/* Tooltip absolutely positioned above the input bar, full width */}
                            {effectiveExcuses.length > 0 && showTooltip && (
                                <div className="absolute left-0 right-0 bottom-full mb-2 px-4 py-3 rounded-lg bg-base-200 border border-info text-info text-xs z-50 shadow-lg" style={{ minWidth: '220px' }}>
                                    <strong>Personalized AI:</strong><br />
                                    <ul className="list-disc ml-5 mt-1">
                                        {effectiveExcuses.slice(0, 3).map((e, i) => (
                                            <li key={i} className="truncate">{e.excuseText}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {/* Character Count */}
                            {input.length > 0 && (
                                <div className="absolute -bottom-6 right-0 text-xs text-base-content/50">
                                    {input.length} characters
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                {/* Proof Generation Modal */}
                <Modal
                    isOpen={proofModalOpen}
                    onRequestClose={() => setProofModalOpen(false)}
                    contentLabel="Generate Proof"
                    className="modal-content"
                    overlayClassName="modal-overlay"
                    ariaHideApp={false}
                >
                    <div className="p-6 bg-base-100 rounded-xl shadow-xl max-w-md mx-auto">
                        <h3 className="text-lg font-bold mb-4">Generate Proof</h3>
                        <div className="mb-3">
                            <label className="block text-sm font-medium mb-1">Platform</label>
                            <select
                                className="select select-sm w-full"
                                value={selectedPlatform}
                                onChange={e => setSelectedPlatform(e.target.value)}
                            >
                                {platformOptions.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3 flex gap-2">
                            <div className="flex-1">
                                <label className="block text-sm font-medium mb-1">Sender Name</label>
                                <input
                                    className="input input-sm w-full"
                                    value={senderName}
                                    onChange={e => setSenderName(e.target.value)}
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium mb-1">Receiver Name</label>
                                <input
                                    className="input input-sm w-full"
                                    value={receiverName}
                                    onChange={e => setReceiverName(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="mb-3 flex gap-2 items-center">
                            <div className="flex-1">
                                <label className="block text-sm font-medium mb-1">Sender Avatar</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="file-input file-input-sm w-full"
                                    onChange={e => handleAvatarFile(e, setSenderAvatarFile, setSenderAvatar)}
                                />
                                {senderAvatarFile && <img src={senderAvatarFile} alt="Sender Avatar" className="w-10 h-10 rounded-full mt-1" />}
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium mb-1">Receiver Avatar</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="file-input file-input-sm w-full"
                                    onChange={e => handleAvatarFile(e, setReceiverAvatarFile, setReceiverAvatar)}
                                />
                                {receiverAvatarFile && <img src={receiverAvatarFile} alt="Receiver Avatar" className="w-10 h-10 rounded-full mt-1" />}
                            </div>
                        </div>
                        <div className="flex gap-2 mt-4 justify-end">
                            <button className="btn btn-ghost btn-sm" onClick={() => setProofModalOpen(false)}>Cancel</button>
                            <button
                                className="btn btn-info btn-sm"
                                onClick={() => { setProofModalOpen(false); handleGenerateProof(); }}
                                disabled={isLoading}
                            >
                                Generate Proof
                            </button>
                        </div>
                    </div>
                </Modal>
            </div>
        </div>
    );
};

export default ChatInterface;