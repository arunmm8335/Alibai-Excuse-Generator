import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import ProofDisplay from './ProofDisplay';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWandMagicSparkles, faFileShield, faPhone, faMicrophone, faPaperPlane, faCommentDots, faBolt, faGlobe, faCog, faStar, faVolumeUp, faThumbsUp, faThumbsDown, faDownload } from '@fortawesome/free-solid-svg-icons';
import html2canvas from 'html2canvas';
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

const ChatInterface = ({ settings }) => {
    // All component state, including for editing

    const { context, urgency, language } = settings;
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [lastExcuse, setLastExcuse] = useState(null);
    const [excuseChoices, setExcuseChoices] = useState([]);
    const [currentScenario, setCurrentScenario] = useState('');
    const [isListening, setIsListening] = useState(false);
    const inputRef = useRef(null); // Ref to focus the input bar
    const chatContainerRef = useRef(null); // Ref to scroll to bottom
    const [runSettings, setRunSettings] = useState({
        context: settings.context || '',
        urgency: settings.urgency || 'medium',
        language: settings.language || 'en',
    });
    const chatCardRef = useRef(null);

    useEffect(() => {
        // Automatically scroll to the bottom when messages or choices change
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages, excuseChoices]);

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
        const promise = axios.post('http://localhost:5000/api/excuses/apology',
            { scenario, excuseText, language: runSettings.language },
            { headers: { 'x-auth-token': localStorage.getItem('token') } }
        );

        toast.promise(promise, {
            loading: 'Crafting apology...',
            success: (res) => {
                setMessages(prev => [...prev, { sender: 'ai', text: res.data.apologyText }]);
                return 'Apology generated!';
            },
            error: 'Failed to create apology.'
        }).finally(() => setIsLoading(false));
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
        const promise = axios.post('http://localhost:5000/api/excuses/proof',
            { scenario, excuseText, language: runSettings.language },
            { headers: { 'x-auth-token': localStorage.getItem('token') } }
        );

        toast.promise(promise, {
            loading: 'Generating proof...',
            success: (res) => {
                console.log('Proof generation success:', res.data);
                setMessages(prev => [...prev, { sender: 'ai', type: 'proof', text: res.data.proofText }]);
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
        const promise = axios.post('http://localhost:5000/api/calls/trigger',
            { userPhoneNumber, excuseText },
            { headers: { 'x-auth-token': localStorage.getItem('token') } }
        );

        toast.promise(promise, {
            loading: 'Initiating call...',
            success: 'Call sent! Check your phone.',
            error: (err) => err.response?.data?.msg || "Failed to initiate call."
        }).finally(() => setIsLoading(false));
    };
    const handleFavorite = (excuseId) => { const promise = axios.patch(`http://localhost:5000/api/excuses/${excuseId}/favorite`, null, { headers: { 'x-auth-token': localStorage.getItem('token') } }); toast.promise(promise, { loading: 'Updating...', success: (res) => { setMessages(prev => prev.map(msg => msg._id === excuseId ? { ...msg, ...res.data } : msg)); return res.data.isFavorite ? 'Added to favorites!' : 'Removed from favorites.'; }, error: 'Could not update favorite status.', }); };
    const handleRateExcuse = (excuseId, rating) => { const promise = axios.patch(`http://localhost:5000/api/excuses/${excuseId}/rate`, { rating }, { headers: { 'x-auth-token': localStorage.getItem('token') } }); toast.promise(promise, { loading: 'Saving rating...', success: (res) => { setMessages(prev => prev.map(msg => msg._id === excuseId ? { ...msg, ...res.data } : msg)); return 'Rating saved! The AI will learn from this.'; }, error: 'Failed to submit rating.', }); };

    // Centralized function to call the generation API

    // --- NEW: Streaming Send Handler ---
    const handleSend = async () => {
        const token = localStorage.getItem('token');
        if (!token) { toast.error('You must be logged in.'); navigate('/login'); return; }
        if (!input.trim()) return;

        const userMessage = { sender: 'user', text: input };
        const aiPlaceholderMessage = { sender: 'ai', text: '', isStreaming: true }; // Placeholder for the streaming response

        setMessages(prev => [...prev, userMessage, aiPlaceholderMessage]);
        const scenarioToSave = input;
        setCurrentScenario(scenarioToSave);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:5000/api/excuses/generate-stream', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
                body: JSON.stringify({ scenario: scenarioToSave, context: runSettings.context, urgency: runSettings.urgency, language: runSettings.language })
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
                        setMessages(prev => prev.map((msg, index) =>
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
                setMessages(prev => prev.filter(msg => !msg.isStreaming));
                setIsLoading(false);
                return;
            }

            const savePromise = axios.post('http://localhost:5000/api/excuses/save', {
                scenario: scenarioToSave,
                excuseText: finalResponseText.trim(),
                context: runSettings.context
            }, { headers: { 'x-auth-token': token } });

            toast.promise(savePromise, {
                loading: 'Saving to history...',
                success: (res) => {
                    console.log('Save success:', res.data);
                    const savedExcuse = res.data;
                    setMessages(prev => prev.map((msg, index) => index === prev.length - 1 ? { ...msg, ...savedExcuse, isStreaming: false } : msg));
                    setLastExcuse({ ...savedExcuse, isStreaming: false });
                    return "Saved to history!";
                },
                error: (err) => {
                    console.error('Save error:', err.response?.data || err);
                    return err.response?.data?.msg || "Failed to save excuse.";
                }
            });

        } catch (error) {
            toast.error("Failed to get response from AI.");
            setMessages(prev => prev.filter(msg => !msg.isStreaming));
            setIsLoading(false);
        }
    };
    const generateExcuseChoices = async (scenarioText) => {
        setIsLoading(true); setExcuseChoices([]);
        try {
            const res = await axios.post('http://localhost:5000/api/excuses/generate', { scenario: scenarioText, context: runSettings.context, urgency: runSettings.urgency, language: runSettings.language }, { headers: { 'x-auth-token': localStorage.getItem('token') } });
            if (res.data.choices && res.data.choices.length > 0) {
                setExcuseChoices(res.data.choices);
            } else { throw new Error("AI did not return any choices."); }
        } catch (error) {
            toast.error(error.response?.data?.msg || 'Error generating choices.');
        } finally { setIsLoading(false); }
    };



    const handleSelectExcuse = (excuseText) => { setIsLoading(true); setExcuseChoices([]); const promise = axios.post('http://localhost:5000/api/excuses/save', { scenario: currentScenario, excuseText, context: runSettings.context }, { headers: { 'x-auth-token': localStorage.getItem('token') } }); toast.promise(promise, { loading: 'Saving your choice...', success: (res) => { const savedExcuseMessage = { sender: 'ai', ...res.data }; setMessages(prev => [...prev, savedExcuseMessage]); setLastExcuse(savedExcuseMessage); return 'Excuse saved!'; }, error: 'Could not save excuse.' }).finally(() => setIsLoading(false)); };
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
        link.download = 'alibai-chat-screenshot.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    };

    return (
        <div className="relative h-[80vh] w-full">
            <div ref={chatCardRef} className="card bg-base-100/80 backdrop-blur-sm shadow-xl flex flex-col relative border border-base-300 h-full">
                <h2 className="card-title p-4 border-b border-base-300 text-base-content gradient-text">Alibai Chat</h2>
                <div ref={chatContainerRef} className="flex-1 p-6 overflow-y-auto">
                    {messages.map((msg, index) => (
                        <div key={index} className={`chat ${msg.sender === 'user' ? 'chat-end' : 'chat-start'} animate-slide-in-bottom`}>
                            {msg.type === 'proof' ? (<ProofDisplay proofText={msg.text} />) : (
                                <div className={`chat-bubble max-w-md group relative backdrop-blur-sm px-5 py-3
                                    whitespace-pre-line break-words
                                    ${msg.sender === 'user'
                                        ? 'chat-bubble-primary shadow-lg rounded-2xl'
                                        : 'bg-base-300/80 border border-base-300 shadow rounded-2xl'
                                    }`}>
                                    {msg.sender === 'user' ? msg.text : (msg.text || msg.excuseText)}
                                    {msg.sender === 'user' && !isLoading && (
                                        <button onClick={() => handleEditClick(msg)} className="btn btn-ghost btn-circle btn-xs absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
                                        </button>
                                    )}
                                    {msg.sender === 'ai' && msg._id && !msg.text?.startsWith("Sorry") && (
                                        <div className="flex gap-3 mt-3 justify-start items-center text-base-content/70">
                                            <button onClick={() => handleFavorite(msg._id)} className={`hover:scale-125 transition-transform ${msg.isFavorite ? 'text-yellow-400' : 'hover:text-yellow-400'}`} title="Favorite">
                                                <FontAwesomeIcon icon={faStar} />
                                            </button>
                                            <button onClick={() => speak(msg.excuseText)} className="hover:text-base-content hover:scale-125 transition-transform" title="Read Aloud">
                                                <FontAwesomeIcon icon={faVolumeUp} />
                                            </button>
                                            <div className="flex gap-2 items-center border-l border-base-content/20 pl-3 ml-2">
                                                <span className="text-xs">Worked?</span>
                                                <button onClick={() => handleRateExcuse(msg._id, 1)} disabled={msg.effectiveness !== 0} className={`hover:scale-125 transition-transform ${msg.effectiveness === 1 ? 'text-success' : 'hover:text-success'}`}>
                                                    <FontAwesomeIcon icon={faThumbsUp} />
                                                </button>
                                                <button onClick={() => handleRateExcuse(msg._id, -1)} disabled={msg.effectiveness !== 0} className={`hover:scale-125 transition-transform ${msg.effectiveness === -1 ? 'text-error' : 'hover:text-error'}`}>
                                                    <FontAwesomeIcon icon={faThumbsDown} />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                    {isLoading && !excuseChoices.length && <span className="loading loading-dots loading-md text-primary self-start ml-4"></span>}
                    {excuseChoices.length > 0 && !isLoading && (<ExcuseChoices choices={excuseChoices} onSelect={handleSelectExcuse} />)}
                </div>
                {/* Action Buttons */}
                <div className="px-6 py-3 border-t border-base-300/50 bg-base-200/30">
                    <div className="flex justify-center gap-3 mb-4">
                        <button
                            onClick={handleGenerateApology}
                            className="btn btn-secondary btn-sm gap-2 hover:scale-105 transition-transform"
                            disabled={!lastExcuse || isLoading}
                            title="Generate Apology"
                        >
                            <FontAwesomeIcon icon={faWandMagicSparkles} />
                            Apology
                        </button>
                        <button
                            onClick={handleGenerateProof}
                            className="btn btn-accent btn-sm gap-2 hover:scale-105 transition-transform"
                            disabled={!lastExcuse || isLoading}
                            title="Generate Proof"
                        >
                            <FontAwesomeIcon icon={faFileShield} />
                            Proof
                        </button>
                        <button
                            onClick={handleRealCall}
                            className="btn btn-warning btn-sm gap-2 hover:scale-105 transition-transform"
                            disabled={!lastExcuse || isLoading}
                            title="Trigger Real Call"
                        >
                            <FontAwesomeIcon icon={faPhone} />
                            Call
                        </button>
                    </div>

                    {/* Input Bar */}
                    <div className="relative">
                        <div className="flex items-center gap-3 p-4 rounded-2xl bg-base-200/80 backdrop-blur-sm border border-base-300/50 shadow-lg">
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
                        </div>

                        {/* Character Count */}
                        {input.length > 0 && (
                            <div className="absolute -bottom-6 right-0 text-xs text-base-content/50">
                                {input.length} characters
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {/* Only the vertical Run Settings Panel at right corner remains */}
            <div className="hidden md:flex flex-col gap-4 fixed right-8 top-72 z-30 bg-base-200/90 border border-base-300 rounded-xl shadow-lg p-4 w-60">
                <h3 className="font-bold text-base-content mb-2 text-lg flex items-center gap-2">
                    <FontAwesomeIcon icon={faCog} className="text-primary" />
                    Run Settings
                </h3>
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                        <FontAwesomeIcon icon={faCommentDots} className="text-primary" />
                        <input
                            type="text"
                            className="input input-bordered input-sm w-full"
                            placeholder="Context (optional)"
                            value={runSettings.context}
                            onChange={e => handleRunSettingChange('context', e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <FontAwesomeIcon icon={faBolt} className="text-warning" />
                        <select
                            className="select select-bordered select-sm w-full"
                            value={runSettings.urgency}
                            onChange={e => handleRunSettingChange('urgency', e.target.value)}
                        >
                            {urgencyOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </select>
                    </div>
                    <div className="flex items-center gap-3">
                        <FontAwesomeIcon icon={faGlobe} className="text-accent" />
                        <select
                            className="select select-bordered select-sm w-full"
                            value={runSettings.language}
                            onChange={e => handleRunSettingChange('language', e.target.value)}
                        >
                            {languageOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatInterface;