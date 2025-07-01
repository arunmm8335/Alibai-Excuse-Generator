import React, { useState, useEffect } from 'react';

const FakeCallScreen = ({ onClose }) => {
    const [caller, setCaller] = useState("Mom"); // Default caller

    // You can expand this later to let the user choose the caller
    const callers = ["Mom", "Dad", "Boss", "Dr. Smith", "Unknown Number"];

    useEffect(() => {
        // Optional: Randomly pick a caller when the component mounts
        setCaller(callers[Math.floor(Math.random() * callers.length)]);
    }, []);


    return (
        // Full screen overlay with a high z-index to appear on top of everything
        <div className="fixed inset-0 bg-gray-900 bg-opacity-90 flex flex-col items-center justify-center z-50 animate-fade-in">
            
            {/* Caller Info */}
            <div className="text-center text-white mb-24">
                <div className="w-24 h-24 bg-gray-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    {/* Simple person icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                </div>
                <h1 className="text-4xl font-bold">{caller}</h1>
                <p className="text-lg text-gray-300 mt-2">iPhone</p>
            </div>

            {/* Action Buttons */}
            <div className="absolute bottom-16 flex justify-around w-full max-w-xs">
                {/* Decline Button */}
                <div className="text-center text-white">
                    <button 
                        onClick={onClose} 
                        className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition"
                    >
                        {/* Decline Icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l-8 8M8 8l8 8" />
                        </svg>
                    </button>
                    <p className="mt-2">Decline</p>
                </div>

                {/* Accept Button */}
                <div className="text-center text-white">
                    <button 
                        onClick={() => alert("Call accepted! (This is just a demo)")}
                        className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center hover:bg-green-700 transition"
                    >
                        {/* Accept Icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                    </button>
                    <p className="mt-2">Accept</p>
                </div>
            </div>
        </div>
    );
};

export default FakeCallScreen;