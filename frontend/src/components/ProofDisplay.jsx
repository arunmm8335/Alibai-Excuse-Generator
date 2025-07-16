import React, { useRef, useState } from 'react';
import domtoimage from 'dom-to-image-more';

const platformStyles = {
    whatsapp: {
        background: '#e1ffc7', // WhatsApp greenish
        meBubble: 'bg-green-500 text-white',
        otherBubble: 'bg-white text-gray-900',
    },
    messenger: {
        background: '#e7f3ff', // Messenger light blue
        meBubble: 'bg-blue-500 text-white',
        otherBubble: 'bg-white text-gray-900',
    },
    sms: {
        background: '#f5f5f5', // SMS gray
        meBubble: 'bg-gray-700 text-white',
        otherBubble: 'bg-white text-gray-900',
    },
    telegram: {
        background: '#e3f2fd', // Telegram light blue
        meBubble: 'bg-blue-400 text-white',
        otherBubble: 'bg-white text-gray-900',
    },
    instagram: {
        background: '#fdf6f0', // Instagram DM light
        meBubble: 'bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white',
        otherBubble: 'bg-white text-gray-900',
    },
    default: {
        background: '#f3f4f6', // Default light gray
        meBubble: 'bg-primary text-white',
        otherBubble: 'bg-base-300 text-gray-900',
    }
};

const ProofDisplay = ({ proofText, platform = 'default', senderName = 'Me', receiverName = 'Mom', senderAvatar = '', receiverAvatar = '' }) => {
    const proofRef = useRef(null);
    const [downloading, setDownloading] = useState(false);
    const [editing, setEditing] = useState(false);
    // Parse lines for display and editing
    const parseLines = (text) => text.split('\n').map(line => {
        if (!line.includes(':')) {
            return { speaker: 'Other', text: line.trim(), isMe: false };
        }
        const parts = line.split(':');
        const speaker = parts[0]?.trim();
        const text = parts.slice(1).join(':').trim();
        const isMe = speaker?.toLowerCase() === 'me';
        return { speaker, text, isMe };
    }).filter(line => line.text);
    const [editLines, setEditLines] = useState(parseLines(proofText));
    // Update editLines if proofText changes and not editing
    React.useEffect(() => {
        if (!editing) setEditLines(parseLines(proofText));
        // eslint-disable-next-line
    }, [proofText]);
    const style = platformStyles[platform] || platformStyles.default;
    const handleDownload = async () => {
        if (!proofRef.current) return;
        setDownloading(true);
        setTimeout(() => {
            domtoimage.toPng(proofRef.current)
                .then(function (dataUrl) {
                    const link = document.createElement('a');
                    link.download = `proof-${platform}.png`;
                    link.href = dataUrl;
                    link.click();
                })
                .catch(function (error) {
                    console.error('dom-to-image-more error:', error);
                })
                .finally(() => setDownloading(false));
        }, 100);
    };
    // Editing logic
    const handleLineChange = (idx, field, value) => {
        setEditLines(lines => lines.map((l, i) => i === idx ? { ...l, [field]: value } : l));
    };
    const handleAddLine = () => {
        setEditLines(lines => [...lines, { speaker: 'Me', text: '', isMe: true }]);
    };
    const handleDeleteLine = (idx) => {
        setEditLines(lines => lines.filter((_, i) => i !== idx));
    };
    const handleSave = () => {
        setEditing(false);
    };
    const handleCancel = () => {
        setEditLines(parseLines(proofText));
        setEditing(false);
    };
    // Compose proofText from editLines
    const composedProofText = editLines.map(l => `${l.speaker}: ${l.text}`).join('\n');
    // Helper to get avatar URL or fallback
    const getAvatar = (speaker) => {
        if (speaker?.toLowerCase() === senderName.toLowerCase()) return senderAvatar || 'https://ui-avatars.com/api/?name=Me&background=0D8ABC&color=fff&size=64';
        if (speaker?.toLowerCase() === receiverName.toLowerCase()) return receiverAvatar || 'https://ui-avatars.com/api/?name=Other&background=F59E42&color=fff&size=64';
        // fallback for unknown
        return 'https://ui-avatars.com/api/?name=U&background=888&color=fff&size=64';
    };
    // Render
    return (
        <div
            className={`card w-full rounded-2xl shadow-lg border border-base-300 my-2 px-0 py-0 relative ${downloading ? 'download-mode' : ''}`}
            ref={proofRef}
            style={{ background: style.background }}
        >
            {/* Edit/Download Buttons */}
            {!editing && !downloading && (
                <div className="absolute top-2 right-2 flex gap-2 z-10">
                    <button
                        onClick={() => setEditing(true)}
                        className="btn btn-xs btn-ghost"
                        title="Edit proof chat"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 11l6 6M3 17v4h4l10.293-10.293a1 1 0 000-1.414l-3.586-3.586a1 1 0 00-1.414 0L3 13.586z" /></svg>
                    </button>
                    <button
                        onClick={handleDownload}
                        className="btn btn-xs btn-ghost"
                        title="Download as image"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 4v12" /></svg>
                    </button>
                </div>
            )}
            <div className="flex flex-col w-full p-6 gap-4">
                {editing && (
                    <div className="flex flex-col w-full items-stretch bg-base-200 border border-base-300 rounded-xl p-4">
                        {editLines.map((line, idx) => (
                            <div key={idx} className="flex gap-2 items-center mb-2">
                                <input
                                    className="input input-xs w-20"
                                    value={line.speaker}
                                    onChange={e => handleLineChange(idx, 'speaker', e.target.value)}
                                    placeholder="Speaker"
                                />
                                <input
                                    className="input input-xs flex-1"
                                    value={line.text}
                                    onChange={e => handleLineChange(idx, 'text', e.target.value)}
                                    placeholder="Message"
                                />
                                <button className="btn btn-xs btn-error" onClick={() => handleDeleteLine(idx)} title="Delete line">✕</button>
                            </div>
                        ))}
                        <div className="flex gap-2 mt-2 self-end">
                            <button className="btn btn-xs btn-success" onClick={handleAddLine}>+ Add Line</button>
                            <button className="btn btn-xs btn-primary" onClick={handleSave}>Save</button>
                            <button className="btn btn-xs btn-ghost" onClick={handleCancel}>Cancel</button>
                        </div>
                    </div>
                )}
                <div className="space-y-2 w-full">
                    {editLines.map((line, index) => (
                        <div key={index} className={`chat ${line.speaker?.toLowerCase() === senderName.toLowerCase() ? 'chat-end' : 'chat-start'} flex items-end`}>
                            {/* Avatar */}
                            <img
                                src={getAvatar(line.speaker)}
                                alt={line.speaker}
                                className="w-8 h-8 rounded-full border border-base-300 object-cover mx-2"
                                style={{ order: line.speaker?.toLowerCase() === senderName.toLowerCase() ? 2 : 0 }}
                                onError={e => { e.target.onerror = null; e.target.src = 'https://ui-avatars.com/api/?name=U&background=888&color=fff&size=64'; }}
                            />
                            <div className={`chat-bubble ${line.speaker?.toLowerCase() === senderName.toLowerCase() ? style.meBubble : style.otherBubble} w-full`}>
                                {line.text}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProofDisplay;