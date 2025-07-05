import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faEyeSlash, faUndo, faUser, faThumbsUp, faCommentDots } from '@fortawesome/free-solid-svg-icons';

// Helper to get avatar URL or initials
function getAvatar(user, publicAuthor) {
    if (user && user.profilePic) return user.profilePic;
    const name = publicAuthor || user?.name || 'A';
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=0D8ABC&color=fff&size=64`;
}

const ModeratorPanel = () => {
    const [reported, setReported] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState({});

    useEffect(() => {
        fetchReported();
    }, []);

    const fetchReported = async () => {
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:5000/api/excuses/reported', {
                headers: { 'x-auth-token': localStorage.getItem('token') }
            });
            setReported(res.data.reported);
        } catch {
            setReported([]);
        }
        setLoading(false);
    };

    const handleHide = async (id) => {
        setActionLoading(prev => ({ ...prev, [id]: 'hide' }));
        try {
            await axios.patch(`http://localhost:5000/api/excuses/${id}/hide`, {}, {
                headers: { 'x-auth-token': localStorage.getItem('token') }
            });
            fetchReported();
        } catch { }
        setActionLoading(prev => ({ ...prev, [id]: null }));
    };

    const handleRestore = async (id) => {
        setActionLoading(prev => ({ ...prev, [id]: 'restore' }));
        try {
            await axios.patch(`http://localhost:5000/api/excuses/${id}/restore`, {}, {
                headers: { 'x-auth-token': localStorage.getItem('token') }
            });
            fetchReported();
        } catch { }
        setActionLoading(prev => ({ ...prev, [id]: null }));
    };

    return (
        <div className="min-h-screen bg-base-100 flex flex-col items-center p-8">
            <h1 className="text-3xl font-bold mb-8 text-error flex items-center gap-2">
                <FontAwesomeIcon icon={faExclamationTriangle} /> Moderator Panel
            </h1>
            {loading ? (
                <div className="text-center mt-20"><span className="loading loading-spinner loading-lg"></span></div>
            ) : reported.length === 0 ? (
                <div className="text-center text-base-content/60">No reported excuses.</div>
            ) : (
                <div className="w-full max-w-3xl space-y-6">
                    {reported.map(excuse => (
                        <div key={excuse._id} className="bg-gradient-to-br from-base-200 via-base-100 to-base-300 rounded-2xl p-6 shadow border border-error flex flex-col gap-2 hover:shadow-xl transition-shadow duration-200">
                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                                <img src={getAvatar(excuse.user, excuse.publicAuthor)} alt="avatar" className="w-10 h-10 rounded-full border border-primary/30" />
                                <span className="font-semibold text-base-content">{excuse.publicAuthor || excuse.user?.name || 'Anonymous'}</span>
                                {excuse.context && (
                                    <span className="ml-2 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">{excuse.context}</span>
                                )}
                                {excuse.user?.isModerator && (
                                    <span className="ml-2 px-2 py-0.5 rounded-full bg-error/10 text-error text-xs font-semibold">MOD</span>
                                )}
                                <span className="ml-4 text-xs text-error flex items-center gap-1">
                                    <FontAwesomeIcon icon={faExclamationTriangle} /> {excuse.reports} reports
                                </span>
                                <span className="ml-auto text-xs text-base-content/60 flex items-center gap-1">
                                    <FontAwesomeIcon icon={faThumbsUp} /> {excuse.likes || 0}
                                    <FontAwesomeIcon icon={faCommentDots} className="ml-2" /> {excuse.comments?.length || 0}
                                </span>
                            </div>
                            <div className="text-base-content/80 text-lg mb-2" style={{ wordBreak: 'break-word' }}>{excuse.excuseText}</div>
                            <div className="flex gap-3 mt-2">
                                {excuse.status === 'active' ? (
                                    <button
                                        className="btn btn-xs btn-error flex items-center gap-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                                        onClick={() => handleHide(excuse._id)}
                                        disabled={actionLoading[excuse._id] === 'hide'}
                                        aria-label="Hide excuse"
                                        tabIndex={0}
                                    >
                                        <FontAwesomeIcon icon={faEyeSlash} />
                                        {actionLoading[excuse._id] === 'hide' ? <span className="loading loading-spinner loading-xs"></span> : 'Hide'}
                                    </button>
                                ) : (
                                    <button
                                        className="btn btn-xs btn-success flex items-center gap-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                                        onClick={() => handleRestore(excuse._id)}
                                        disabled={actionLoading[excuse._id] === 'restore'}
                                        aria-label="Restore excuse"
                                        tabIndex={0}
                                    >
                                        <FontAwesomeIcon icon={faUndo} />
                                        {actionLoading[excuse._id] === 'restore' ? <span className="loading loading-spinner loading-xs"></span> : 'Restore'}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ModeratorPanel; 