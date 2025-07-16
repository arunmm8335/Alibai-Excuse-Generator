import React from 'react';
import { useNavigate } from 'react-router-dom';

const WelcomePage = () => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 px-2 md:px-4 py-2">
            <div className="card bg-base-100 shadow-2xl p-8 md:p-16 text-center max-w-3xl w-full max-w-full animate-fade-in border border-base-300">
                <h1 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-4 md:mb-6">
                    Welcome to Alibai
                </h1>
                <p className="text-base md:text-2xl text-neutral/80 mb-6 md:mb-10">
                    Your AI-powered excuse generator for any situation.<br />
                    Generate, customize, and download proof in seconds!
                </p>
                <button
                    className="btn btn-primary btn-lg btn-wide text-base md:text-xl font-semibold w-full md:w-auto"
                    onClick={() => navigate('/')}
                >
                    Continue
                </button>
            </div>
        </div>
    );
};

export default WelcomePage; 