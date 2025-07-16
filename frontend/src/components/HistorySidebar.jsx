import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import SkeletonCard from './SkeletonCard'; // Import the new component
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faSms } from '@fortawesome/free-solid-svg-icons';

const HistorySidebar = () => {
    const { t } = useTranslation();
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [suggestion, setSuggestion] = useState(null);

    useEffect(() => {
        // We add a slight delay to make the skeleton visible for demonstration
        const timer = setTimeout(() => {
            fetchHistory();
        }, 500); // 0.5 second delay

        return () => clearTimeout(timer); // Cleanup timer on unmount
    }, []);

    const fetchHistory = async () => {
        const token = localStorage.getItem('token');
        if (!token) { setIsLoading(false); return; }
        const config = { headers: { 'x-auth-token': token } };
        try {
            const [historyRes, patternRes] = await Promise.all([
                axios.get('http://localhost:5000/api/excuses/history', config),
                axios.get('http://localhost:5000/api/excuses/pattern', config)
            ]);
            setHistory(historyRes.data);
            if (patternRes.data.suggestion) { setSuggestion(patternRes.data.suggestion); }
            setError(null);
        } catch (err) { setError("Could not load history."); }
        finally { setIsLoading(false); }
    };

    const handleDelete = async (excuseId) => {
        const originalHistory = [...history];
        setHistory(currentHistory => currentHistory.filter(item => item._id !== excuseId));
        const promise = axios.delete(`http://localhost:5000/api/excuses/${excuseId}`, { headers: { 'x-auth-token': localStorage.getItem('token') } });
        toast.promise(promise, {
            loading: 'Deleting...',
            success: 'Excuse deleted!',
            error: () => { setHistory(originalHistory); return 'Could not delete excuse.'; }
        });
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

    return (
        <div className="bg-base-200 flex flex-col" style={{ height: 'calc(80vh)' }}>
            <h2 className="card-title p-4 border-b border-base-300 text-base-content">History</h2>

            {suggestion && (
                <div role="alert" className="alert alert-info shadow-lg m-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <div><h3 className="font-bold">Proactive Suggestion!</h3><div className="text-xs">{suggestion}</div></div>
                    <button onClick={() => setSuggestion(null)} className="btn btn-sm btn-ghost">Dismiss</button>
                </div>
            )}

            <div className="flex-1 p-4 overflow-y-auto">
                {error && <p className="text-error p-4">{error}</p>}

                {/* --- DEFINITIVE SKELETON LOADING --- */}
                {isLoading ? (
                    <ul className="space-y-3">
                        {[...Array(5)].map((_, i) => <SkeletonCard key={i} />)}
                    </ul>
                ) : (
                    <>
                        {!error && history.length === 0 && <p className="text-base-content/60 p-4">{t('noHistory')}</p>}
                        <ul className="space-y-3">
                            {history.map((item) => (
                                <li key={item._id} className="group p-3 bg-base-300 rounded-lg flex justify-between items-center transition-all hover:bg-base-content/10">
                                    <div className="flex-grow truncate">
                                        <p className="font-bold truncate text-base-content" title={item.scenario}>
                                            {item.isFavorite && <span className="text-yellow-400 mr-2">⭐</span>}
                                            {item.effectiveness === 1 && <span className="text-green-500 mr-2">👍</span>}
                                            {item.effectiveness === -1 && <span className="text-red-500 mr-2">👎</span>}
                                            {item.scenario}
                                        </p>
                                        <p className="text-sm text-base-content/70 truncate" title={item.excuseText}>
                                            {item.excuseText}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 ml-2">
                                        <button onClick={() => handleShareWhatsApp(item.excuseText)} className="hover:text-green-500 hover:scale-125 transition-transform" title="Share via WhatsApp">
                                            <FontAwesomeIcon icon={faWhatsapp} />
                                        </button>
                                        <button onClick={() => handleShareSMS(item.excuseText)} className="hover:text-blue-400 hover:scale-125 transition-transform" title="Share via SMS">
                                            <FontAwesomeIcon icon={faSms} />
                                        </button>
                                        <button onClick={() => handleShareEmail(item.excuseText)} className="hover:text-rose-500 hover:scale-125 transition-transform" title="Share via Email">
                                            <FontAwesomeIcon icon={faEnvelope} />
                                        </button>
                                        <button onClick={() => handleDelete(item._id)} className="btn btn-ghost btn-circle btn-xs opacity-0 group-hover:opacity-100 transition-opacity text-error" title="Delete Excuse">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </div>
        </div>
    );
};

export default HistorySidebar;