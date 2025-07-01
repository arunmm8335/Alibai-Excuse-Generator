import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import ProofDisplay from './ProofDisplay';
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

const ChatInterface = ({ settings }) => {
    // All component state, including for editing

    const { context, urgency, language } = settings;
    const [messages, setMessages] = useState([{ sender: 'ai', text: "How can I help you get out of something today? Describe the situation." }]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [lastExcuse, setLastExcuse] = useState(null);
    const [excuseChoices, setExcuseChoices] = useState([]);
    const [currentScenario, setCurrentScenario] = useState('');
    const [isListening, setIsListening] = useState(false);
    const inputRef = useRef(null); // Ref to focus the input bar
    const chatContainerRef = useRef(null); // Ref to scroll to bottom

    useEffect(() => {
        // Automatically scroll to the bottom when messages or choices change
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages, excuseChoices]);

    // All handler functions are complete and correct
    const speak = (text) => { if (text?.startsWith("Sorry")) { toast.error("Nothing to read."); return; } const utterance = new SpeechSynthesisUtterance(text); window.speechSynthesis.speak(utterance); };
    const handleGenerateApology = () => { if (!lastExcuse) { toast.error("Please generate an excuse first."); return; } setIsLoading(true); const promise = axios.post('http://localhost:5000/api/excuses/apology', { scenario: lastExcuse.scenario, excuseText: lastExcuse.excuseText, language }, { headers: { 'x-auth-token': localStorage.getItem('token') } }); toast.promise(promise, { loading: 'Crafting apology...', success: (res) => { setMessages(prev => [...prev, { sender: 'ai', text: res.data.apologyText }]); return 'Apology generated!'; }, error: 'Failed to create apology.', }).finally(() => setIsLoading(false)); };
    const handleGenerateProof = () => { if (!lastExcuse) { toast.error("Please generate an excuse first."); return; } setIsLoading(true); const promise = axios.post('http://localhost:5000/api/excuses/proof', { scenario: lastExcuse.scenario, excuseText: lastExcuse.excuseText, language }, { headers: { 'x-auth-token': localStorage.getItem('token') } }); toast.promise(promise, { loading: 'Generating proof...', success: (res) => { setMessages(prev => [...prev, { sender: 'ai', type: 'proof', text: res.data.proofText }]); return 'Proof created!'; }, error: 'Failed to generate proof.', }).finally(() => setIsLoading(false)); };
    const handleRealCall = async () => { if (!lastExcuse) { toast.error("Please generate an excuse first."); return; } const userPhoneNumber = prompt("Enter your VERIFIED phone number (E.164 format, e.g., +14155552671):"); if (!userPhoneNumber) return; setIsLoading(true); const promise = axios.post('http://localhost:5000/api/calls/trigger', { userPhoneNumber, excuseText: lastExcuse.excuseText }, { headers: { 'x-auth-token': localStorage.getItem('token') } }); toast.promise(promise, { loading: 'Initiating call...', success: 'Call sent! Check your phone.', error: (err) => err.response?.data?.msg || "Failed to initiate call.", }).finally(() => setIsLoading(false)); };
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
                body: JSON.stringify({ scenario: scenarioToSave, context, urgency, language })
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
            const savePromise = axios.post('http://localhost:5000/api/excuses/save', {
                scenario: scenarioToSave,
                excuseText: finalResponseText,
                context
            }, { headers: { 'x-auth-token': token } });
            
            toast.promise(savePromise, {
                loading: 'Saving to history...',
                success: (res) => {
                    const savedExcuse = res.data;
                    setMessages(prev => prev.map((msg, index) => index === prev.length - 1 ? { ...msg, ...savedExcuse, isStreaming: false } : msg));
                    setLastExcuse({ ...savedExcuse, isStreaming: false });
                    return "Saved to history!";
                },
                error: "Failed to save excuse."
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
            const res = await axios.post('http://localhost:5000/api/excuses/generate', { scenario: scenarioText, context, urgency, language }, { headers: { 'x-auth-token': localStorage.getItem('token') } });
            if (res.data.choices && res.data.choices.length > 0) {
                setExcuseChoices(res.data.choices);
            } else { throw new Error("AI did not return any choices."); }
        } catch (error) {
            toast.error(error.response?.data?.msg || 'Error generating choices.');
        } finally { setIsLoading(false); }
    };

   

    const handleSelectExcuse = (excuseText) => { setIsLoading(true); setExcuseChoices([]); const promise = axios.post('http://localhost:5000/api/excuses/save', { scenario: currentScenario, excuseText, context }, { headers: { 'x-auth-token': localStorage.getItem('token') } }); toast.promise(promise, { loading: 'Saving your choice...', success: (res) => { const savedExcuseMessage = { sender: 'ai', ...res.data }; setMessages(prev => [...prev, savedExcuseMessage]); setLastExcuse(savedExcuseMessage); return 'Excuse saved!'; }, error: 'Could not save excuse.' }).finally(() => setIsLoading(false)); };
    const handleVoiceInput = () => { if (!recognition) { return toast.error("Voice recognition is not supported in your browser."); } if (isListening) { recognition.stop(); return; } recognition.start(); recognition.onstart = () => setIsListening(true); recognition.onend = () => setIsListening(false); recognition.onerror = () => { toast.error("Voice recognition failed. Please try again."); setIsListening(false); }; recognition.onresult = (event) => { setInput(event.results[0][0].transcript); }; };

    // --- NEW: Simplified Edit Handler ---
    const handleEditClick = (message) => {
        setInput(message.text); // Load the text into the main input
        inputRef.current?.focus(); // Focus the main input
        toast.success("Prompt loaded for editing!");
    };

    return (
        <div className="card bg-base-100 shadow-xl flex flex-col relative border border-base-300" style={{ height: 'calc(80vh)' }}>
            <h2 className="card-title p-4 border-b border-base-300 text-base-content">Alibai Chat</h2>
            <div ref={chatContainerRef} className="flex-1 p-6 overflow-y-auto">
                {messages.map((msg, index) => (
                    <div key={index} className={`chat ${msg.sender === 'user' ? 'chat-end' : 'chat-start'} animate-slide-in-bottom`}>
                        {msg.type === 'proof' ? ( <ProofDisplay proofText={msg.text} /> ) : (
                            <div className={`chat-bubble max-w-md group relative ${msg.sender === 'user' ? 'chat-bubble-primary' : 'bg-base-300'}`}>
                                {msg.sender === 'user' ? msg.text : (msg.text || msg.excuseText)}
                                {msg.sender === 'user' && !isLoading && (
                                    <button onClick={() => handleEditClick(msg)} className="btn btn-ghost btn-circle btn-xs absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
                                    </button>
                                )}
                                {msg.sender === 'ai' && msg._id && !msg.text?.startsWith("Sorry") && (
                                    <div className="flex gap-3 mt-3 justify-start items-center text-base-content/70">
                                        <button onClick={() => handleFavorite(msg._id)} className={`hover:scale-125 transition-transform ${msg.isFavorite ? 'text-yellow-400' : 'hover:text-yellow-400'}`} title="Favorite"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.007z" clipRule="evenodd" /></svg></button>
                                        <button onClick={() => speak(msg.excuseText)} className="hover:text-base-content hover:scale-125 transition-transform" title="Read Aloud"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.66 1.905H6.44l4.5 4.5c.945.945 2.56.276 2.56-1.06V4.06ZM18.584 14.828a1.5 1.5 0 0 0 0-2.121 5.25 5.25 0 0 0-7.424 0 1.5 1.5 0 0 0 0 2.121 5.25 5.25 0 0 0 7.424 0ZM21.706 18.01a1.5 1.5 0 0 0 0-2.121 9 9 0 0 0-12.728 0 1.5 1.5 0 0 0 0 2.121 9 9 0 0 0 12.728 0Z" /></svg></button>
                                        <div className="flex gap-2 items-center border-l border-base-content/20 pl-3 ml-2"><span className="text-xs">Worked?</span><button onClick={() => handleRateExcuse(msg._id, 1)} disabled={msg.effectiveness !== 0} className={`hover:scale-125 transition-transform ${msg.effectiveness === 1 ? 'text-success' : 'hover:text-success'}`}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="m15 11.25-3-3m0 0-3 3m3-3v7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg></button><button onClick={() => handleRateExcuse(msg._id, -1)} disabled={msg.effectiveness !== 0} className={`hover:scale-125 transition-transform ${msg.effectiveness === -1 ? 'text-error' : 'hover:text-error'}`}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="m9 12.75 3 3m0 0 3-3m-3 3v-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg></button></div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
                {isLoading && !excuseChoices.length && <span className="loading loading-dots loading-md text-primary self-start ml-4"></span>}
                {excuseChoices.length > 0 && !isLoading && ( <ExcuseChoices choices={excuseChoices} onSelect={handleSelectExcuse} /> )}
            </div>
            
            <div className="p-4 border-t border-base-300 space-y-2">
                <div className="flex justify-center gap-2">
                    <button onClick={handleGenerateApology} className="btn btn-secondary btn-xs" disabled={!lastExcuse || isLoading}>Apology</button>
                    <button onClick={handleGenerateProof} className="btn btn-accent btn-xs" disabled={!lastExcuse || isLoading}>Proof</button>
                    <button onClick={handleRealCall} className="btn btn-warning btn-xs" disabled={!lastExcuse || isLoading}>Call</button>
                </div>

                <div className="flex items-center gap-2 p-2 rounded-full bg-base-300">
                    <textarea ref={inputRef} className="textarea bg-transparent w-full flex-grow resize-none border-none focus:outline-none focus:ring-0 p-1 pl-4 text-base-content placeholder-base-content/60" placeholder="Start typing or click the mic to speak..." rows="1" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }} disabled={isLoading}/>
                    <div className="flex items-center">
                        <button onClick={handleVoiceInput} className={`btn btn-ghost btn-circle btn-sm ${isListening ? 'text-error' : 'text-base-content/70'}`} title="Speak prompt"><svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line></svg></button>
                        <button onClick={handleSend} className="btn btn-primary btn-circle" disabled={isLoading || !input} title="Run">{isLoading ? <span className="loading loading-spinner loading-sm"></span> : <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path></svg>}</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatInterface;