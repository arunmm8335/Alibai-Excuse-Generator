import React from 'react';
import { useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti';

const WelcomePage = () => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 px-2 md:px-4 py-2 relative overflow-x-hidden">
            <Confetti width={window.innerWidth - 2} height={window.innerHeight} numberOfPieces={120} recycle={false} />
            <div className="card bg-base-100 shadow-2xl p-8 md:p-16 text-center max-w-3xl w-full max-w-full animate-fade-in border border-base-300 relative">
                <h1 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-4 md:mb-6 flex items-center justify-center gap-2">
                    Welcome to ExcuseMe
                    <span className="animate-bounce text-4xl md:text-5xl">🎉</span>
                </h1>
                <p className="text-base md:text-2xl text-neutral/80 mb-6 md:mb-10">
                    Your AI-powered excuse generator for any situation.<br />
                    Generate, customize, and download proof in seconds!
                </p>
                <div className="mb-8 text-lg md:text-2xl font-semibold text-primary flex flex-col items-center gap-2 animate-fade-in">
                    <span>We're thrilled to have you here! 🚀</span>
                    <span className="text-base-content/70 text-base md:text-lg">Let your creativity flow and never run out of clever excuses again.</span>
                </div>
                <button
                    className="btn btn-primary btn-lg btn-wide text-base md:text-xl font-semibold w-full md:w-auto rounded-2xl"
                    onClick={() => navigate('/')}
                >
                    Continue
                </button>
            </div>
        </div>
    );
};

export default WelcomePage; 