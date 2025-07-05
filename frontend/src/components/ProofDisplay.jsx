import React, { useRef } from 'react';

const ProofDisplay = ({ proofText }) => {
    const proofRef = useRef(null);
    // Split the text into lines and parse them
    const lines = proofText.split('\n').map(line => {
        const parts = line.split(':');
        const speaker = parts[0]?.trim();
        const text = parts.slice(1).join(':').trim();
        // Determine if the speaker is 'Me' to align the bubble correctly
        const isMe = speaker?.toLowerCase() === 'me';
        return { speaker, text, isMe };
    }).filter(line => line.speaker && line.text); // Filter out any empty lines

    return (
        <div className="card bg-base-100 p-6 rounded-2xl shadow-lg border border-base-300 w-full my-2 px-6" ref={proofRef}>
            <div className="space-y-2">
                {lines.map((line, index) => (
                    <div key={index} className={`chat ${line.isMe ? 'chat-end' : 'chat-start'}`}>
                        <div className={`chat-bubble ${line.isMe ? 'chat-bubble-primary' : 'bg-base-300'} w-full`}>
                            {line.text}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProofDisplay;