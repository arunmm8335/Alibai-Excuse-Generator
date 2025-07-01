import React from 'react';

const ProofDisplay = ({ proofText }) => {
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
        <div className="p-4 bg-gray-200 dark:bg-gray-700 rounded-lg my-2">
            <p className="text-center font-bold text-sm mb-3">Fake Chat Log</p>
            <div className="flex flex-col gap-2">
                {lines.map((line, index) => (
                    <div key={index} className={`chat ${line.isMe ? 'chat-end' : 'chat-start'}`}>
                        <div className={`chat-bubble ${line.isMe ? 'chat-bubble-primary' : ''}`}>
                            {line.text}
                        </div>
                    </div>
                ))}
            </div>
            <p className="text-center text-xs opacity-50 mt-3">You can screenshot this as "proof".</p>
        </div>
    );
};

export default ProofDisplay;