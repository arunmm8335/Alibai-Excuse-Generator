import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { FaFire, FaRegCommentAlt, FaClock, FaUser, FaFlag, FaShare, FaChevronDown, FaChevronUp, FaTrash, FaThumbsUp, FaThumbsDown, FaEye } from 'react-icons/fa';
import toast from 'react-hot-toast';
import api from '../api';

const scenarioOptions = [
    '', 'work', 'school', 'social', 'family'
];

// Helper to get avatar URL or initials
function getAvatar(user, publicAuthor) {
    if (user && user.profilePic) return user.profilePic;
    const name = publicAuthor || user?.name || 'A';
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=0D8ABC&color=fff&size=64`;
}

// Helper to check if excuse is trending (in trending list)
function isTrending(excuse, trending) {
    return trending.some(e => e._id === excuse._id);
}

// Helper functions for session-based view tracking
function getViewedExcusesSet() {
    const raw = sessionStorage.getItem('viewedExcuses');
    return new Set(raw ? JSON.parse(raw) : []);
}
function saveViewedExcusesSet(set) {
    sessionStorage.setItem('viewedExcuses', JSON.stringify(Array.from(set)));
}

const CommunityWallPage = () => {
    const [excuses, setExcuses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [likeLoading, setLikeLoading] = useState({});
    const [dislikeLoading, setDislikeLoading] = useState({});
    const [commentsOpen, setCommentsOpen] = useState({});
    const [comments, setComments] = useState({});
    const [commentInput, setCommentInput] = useState({});
    const [commentLoading, setCommentLoading] = useState({});
    const [addCommentLoading, setAddCommentLoading] = useState({});
    const [deleteCommentLoading, setDeleteCommentLoading] = useState({});
    const [search, setSearch] = useState('');
    const [scenario, setScenario] = useState('');
    const [author, setAuthor] = useState('');
    const [minLikes, setMinLikes] = useState('');
    const [trending, setTrending] = useState([]);
    const [trendingLoading, setTrendingLoading] = useState(true);
    const [reportedExcuses, setReportedExcuses] = useState({});
    const [commentError, setCommentError] = useState({});
    // Add state for votes
    // const [votes, setVotes] = useState({}); // { [excuseId]: { totalVotes, userVote, loading } }

    const viewedExcuses = useRef(getViewedExcusesSet());

    useEffect(() => {
        fetchExcuses(page);
        fetchTrending();
        // eslint-disable-next-line
    }, [page]);

    // Increment views for main list
    useEffect(() => {
        excuses.forEach(excuse => {
            if (excuse._id && !viewedExcuses.current.has(excuse._id)) {
                viewedExcuses.current.add(excuse._id);
                saveViewedExcusesSet(viewedExcuses.current);
                api.patch(`/excuses/${excuse._id}/view`)
                    .then(res => {
                        setExcuses(prev =>
                            prev.map(e =>
                                e._id === excuse._id ? { ...e, views: res.data.views } : e
                            )
                        );
                    })
                    .catch(() => { });
            }
        });
    }, [excuses]);

    // Increment views for trending
    useEffect(() => {
        trending.forEach(excuse => {
            if (excuse._id && !viewedExcuses.current.has(excuse._id)) {
                viewedExcuses.current.add(excuse._id);
                saveViewedExcusesSet(viewedExcuses.current);
                api.patch(`/excuses/${excuse._id}/view`)
                    .then(res => {
                        setTrending(prev =>
                            prev.map(e =>
                                e._id === excuse._id ? { ...e, views: res.data.views } : e
                            )
                        );
                    })
                    .catch(() => { });
            }
        });
    }, [trending]);

    // On logout, call: sessionStorage.removeItem('viewedExcuses');

    // Fetch votes for all excuses after fetching excuses
    // useEffect(() => {
    //     if (excuses.length > 0) {
    //         const fetchVotes = async () => {
    //             const token = localStorage.getItem('token');
    //             const newVotes = {};
    //             await Promise.all(excuses.map(async (excuse) => {
    //                 try {
    //                     const res = await axios.post(`http://localhost:5000/api/excuses/${excuse._id}/vote`, { value: 0 }, { headers: { 'x-auth-token': token } });
    //                     newVotes[excuse._id] = { totalVotes: res.data.totalVotes, userVote: res.data.userVote, loading: false };
    //                 } catch {
    //                     newVotes[excuse._id] = { totalVotes: excuse.likes || 0, userVote: 0, loading: false };
    //                 }
    //             }));
    //             setVotes(newVotes);
    //         };
    //         fetchVotes();
    //     }
    // }, [excuses]);

    const handleLike = async (excuseId) => {
        setLikeLoading(prev => ({ ...prev, [excuseId]: true }));
        try {
            const token = localStorage.getItem('token');
            const res = await api.post(`/excuses/${excuseId}/like`, {}, { headers: { 'x-auth-token': token } });
            setExcuses(prev => prev.map(e =>
                e._id === excuseId
                    ? { ...e, likes: res.data.likes, dislikes: res.data.dislikes, userLike: res.data.userLike, userDislike: res.data.userDislike }
                    : e
            ));
        } catch {
            toast.error('Failed to like. Please try again.');
        }
        setLikeLoading(prev => ({ ...prev, [excuseId]: false }));
    };

    const handleDislike = async (excuseId) => {
        setDislikeLoading(prev => ({ ...prev, [excuseId]: true }));
        try {
            const token = localStorage.getItem('token');
            const res = await api.post(`/excuses/${excuseId}/dislike`, {}, { headers: { 'x-auth-token': token } });
            setExcuses(prev => prev.map(e =>
                e._id === excuseId
                    ? { ...e, likes: res.data.likes, dislikes: res.data.dislikes, userLike: res.data.userLike, userDislike: res.data.userDislike }
                    : e
            ));
        } catch {
            toast.error('Failed to dislike. Please try again.');
        }
        setDislikeLoading(prev => ({ ...prev, [excuseId]: false }));
    };

    const fetchExcuses = async (pageNum = 1, filters = {}) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: pageNum,
                limit: 20,
                ...(search && { search }),
                ...(scenario && { scenario }),
                ...(author && { author }),
                ...(minLikes && { minLikes })
            });
            const res = await api.get(`/excuses/public?${params.toString()}`);
            setExcuses(res.data.excuses);
            setTotalPages(res.data.totalPages);
        } catch (err) {
            setExcuses([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchTrending = async () => {
        setTrendingLoading(true);
        try {
            const res = await api.get('/excuses/trending');
            setTrending(res.data.trending);
        } catch {
            setTrending([]);
        }
        setTrendingLoading(false);
    };

    const handleReport = async (id) => {
        if (reportedExcuses[id]) return;
        // setReportLoading((prev) => ({ ...prev, [id]: true })); // This state was removed
        try {
            await api.post(`/excuses/${id}/report`, {}, { headers: { 'x-auth-token': localStorage.getItem('token') } });
            setReportedExcuses(prev => ({ ...prev, [id]: true }));
            toast.success('Reported for moderation. Thank you!');
        } catch {
            toast.error('Failed to report. Please try again.');
        }
        // setReportLoading((prev) => ({ ...prev, [id]: false })); // This state was removed
    };

    const fetchComments = async (excuseId) => {
        setCommentLoading(prev => ({ ...prev, [excuseId]: true }));
        try {
            const res = await api.get(`/excuses/${excuseId}/comments`);
            setComments(prev => ({ ...prev, [excuseId]: res.data.comments }));
        } catch {
            setComments(prev => ({ ...prev, [excuseId]: [] }));
        }
        setCommentLoading(prev => ({ ...prev, [excuseId]: false }));
    };

    const handleToggleComments = (excuseId) => {
        setCommentsOpen(prev => ({ ...prev, [excuseId]: !prev[excuseId] }));
        if (!comments[excuseId]) fetchComments(excuseId);
    };

    const handleAddComment = async (excuseId) => {
        const text = (commentInput[excuseId] || '').trim();
        if (text.length < 2 || text.length > 300) {
            setCommentError(prev => ({ ...prev, [excuseId]: 'Comment must be between 2 and 300 characters.' }));
            return;
        } else {
            setCommentError(prev => ({ ...prev, [excuseId]: '' }));
        }
        setAddCommentLoading(prev => ({ ...prev, [excuseId]: true }));
        try {
            const asAnonymous = window.confirm('Comment anonymously? OK for anonymous, Cancel for your name.');
            const authorName = asAnonymous ? 'anonymous' : (localStorage.getItem('userName') || 'anonymous');
            const res = await api.post(`/excuses/${excuseId}/comments`, { text, authorName }, { headers: { 'x-auth-token': localStorage.getItem('token') } });
            setComments(prev => ({ ...prev, [excuseId]: [...(prev[excuseId] || []), res.data.comment] }));
            setCommentInput(prev => ({ ...prev, [excuseId]: '' }));
        } catch { }
        setAddCommentLoading(prev => ({ ...prev, [excuseId]: false }));
    };

    const handleDeleteComment = async (excuseId, commentId) => {
        setDeleteCommentLoading(prev => ({ ...prev, [commentId]: true }));
        try {
            await api.delete(`/excuses/${excuseId}/comments/${commentId}`, { headers: { 'x-auth-token': localStorage.getItem('token') } });
            setComments(prev => ({ ...prev, [excuseId]: (prev[excuseId] || []).filter(c => c._id !== commentId) }));
        } catch { }
        setDeleteCommentLoading(prev => ({ ...prev, [commentId]: false }));
    };

    const handleApplyFilters = () => {
        setPage(1);
        fetchExcuses(1);
    };

    return (
        <div className="min-h-screen bg-base-100 flex flex-col items-center p-8 pt-[64px]">
            <h1 className="text-3xl font-bold mb-8 text-primary">Community Excuse Wall</h1>
            <div className="w-full max-w-3xl mb-8">
                <h2 className="text-xl font-bold mb-2 flex items-center gap-2 text-accent">
                    <FaFire className="text-error" /> Trending Excuses
                </h2>
                {trendingLoading ? (
                    <span className="loading loading-spinner loading-xs"></span>
                ) : trending.length === 0 ? (
                    <div className="text-xs text-base-content/60">No trending excuses yet.</div>
                ) : (
                    <div className="flex gap-4 overflow-x-auto pb-2">
                        {trending.map(excuse => (
                            <div key={excuse._id} className={`min-w-[260px] bg-gradient-to-br from-base-200 via-base-100 to-base-300 rounded-xl p-4 border border-base-300 shadow flex-shrink-0 hover:shadow-lg transition-shadow duration-200 animate-fade-in`}>
                                <div className="flex items-center gap-2 mb-1">
                                    <img src={getAvatar(excuse.user, excuse.publicAuthor)} alt="avatar" className="w-8 h-8 rounded-full border border-primary/30" />
                                    <span className="font-semibold text-base-content text-xs">{excuse.publicAuthor || excuse.user?.name || 'Anonymous'}</span>
                                    {excuse.context && (
                                        <span className="ml-2 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">{excuse.context}</span>
                                    )}
                                    {excuse.user?.isModerator && (
                                        <span className="ml-2 px-2 py-0.5 rounded-full bg-error/10 text-error text-xs font-semibold">MOD</span>
                                    )}
                                    <span className="ml-2 px-2 py-0.5 rounded-full bg-accent/10 text-accent text-xs font-semibold">Trending</span>
                                </div>
                                <div className="text-base-content/80 text-sm mb-2 line-clamp-3">{excuse.excuseText}</div>
                                {/* Trending section action row: */}
                                <div className="flex items-center gap-4 text-xs text-base-content/60">
                                    <button
                                        onClick={() => handleLike(excuse._id)}
                                        disabled={likeLoading[excuse._id]}
                                        aria-label="Like"
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 4,
                                            color: excuse.userLike ? '#2563eb' : '#888'
                                        }}
                                    >
                                        <FaThumbsUp size={18} />
                                        <span>{excuse.likes || 0}</span>
                                    </button>
                                    <button
                                        onClick={() => handleDislike(excuse._id)}
                                        disabled={dislikeLoading[excuse._id]}
                                        aria-label="Dislike"
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 4,
                                            color: excuse.userDislike ? '#dc2626' : '#888'
                                        }}
                                    >
                                        <FaThumbsDown size={18} />
                                        <span>{excuse.dislikes || 0}</span>
                                    </button>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                        <FaRegCommentAlt color="#888" size={18} />
                                        {excuse.comments?.length || 0}
                                    </span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                        <FaEye color="#888" size={16} />
                                        {excuse.views || 0}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className="w-full max-w-3xl mb-8 flex flex-wrap gap-4 items-end">
                <input
                    className="input input-sm flex-1"
                    type="text"
                    placeholder="Search excuses or scenarios..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <select
                    className="select select-sm"
                    value={scenario}
                    onChange={e => setScenario(e.target.value)}
                >
                    <option value="">All Scenarios</option>
                    {scenarioOptions.filter(opt => opt).map(opt => (
                        <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                    ))}
                </select>
                <input
                    className="input input-sm"
                    type="text"
                    placeholder="Author"
                    value={author}
                    onChange={e => setAuthor(e.target.value)}
                />
                <input
                    className="input input-sm w-24"
                    type="number"
                    min="0"
                    placeholder="Min Likes"
                    value={minLikes}
                    onChange={e => setMinLikes(e.target.value)}
                />
                <button className="btn btn-sm btn-primary" onClick={handleApplyFilters}>Apply</button>
            </div>
            {loading ? (
                <div className="text-center mt-20"><span className="loading loading-spinner loading-lg"></span></div>
            ) : excuses.length === 0 ? (
                <div className="text-center text-base-content/60">No public excuses yet.</div>
            ) : (
                <div className="w-full max-w-3xl space-y-6">
                    {excuses.map(excuse => (
                        <div key={excuse._id} className={`bg-gradient-to-br from-base-200 via-base-100 to-base-300 rounded-2xl p-6 shadow border border-base-300 flex flex-col gap-2 hover:shadow-xl transition-shadow duration-200 animate-slide-in`}>
                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                                <img src={getAvatar(excuse.user, excuse.publicAuthor)} alt="avatar" className="w-10 h-10 rounded-full border border-primary/30" />
                                <span className="font-semibold text-base-content">{excuse.publicAuthor || excuse.user?.name || 'Anonymous'}</span>
                                {excuse.context && (
                                    <span className="ml-2 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">{excuse.context}</span>
                                )}
                                {excuse.user?.isModerator && (
                                    <span className="ml-2 px-2 py-0.5 rounded-full bg-error/10 text-error text-xs font-semibold">MOD</span>
                                )}
                                {isTrending(excuse, trending) && (
                                    <span className="ml-2 px-2 py-0.5 rounded-full bg-accent/10 text-accent text-xs font-semibold">Trending</span>
                                )}
                                <span className="text-xs text-base-content/50 ml-2 flex items-center gap-1">
                                    <FaClock />
                                    {new Date(excuse.createdAt).toLocaleString()}
                                </span>
                            </div>
                            <div className="text-base-content/80 text-lg mb-2" style={{ wordBreak: 'break-word' }}>{excuse.excuseText}</div>
                            {/* Pill-shaped action bar for each excuse (replace the old action row) */}
                            <div className="flex gap-4 mt-2 flex-wrap items-center">
                                <button
                                    onClick={() => handleLike(excuse._id)}
                                    disabled={likeLoading[excuse._id]}
                                    aria-label="Like"
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 4,
                                        color: excuse.userLike ? '#2563eb' : '#888'
                                    }}
                                >
                                    <FaThumbsUp size={20} />
                                    <span>{excuse.likes || 0}</span>
                                </button>
                                <button
                                    onClick={() => handleDislike(excuse._id)}
                                    disabled={dislikeLoading[excuse._id]}
                                    aria-label="Dislike"
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 4,
                                        color: excuse.userDislike ? '#dc2626' : '#888'
                                    }}
                                >
                                    <FaThumbsDown size={20} />
                                    <span>{excuse.dislikes || 0}</span>
                                </button>
                                <button
                                    onClick={() => handleToggleComments(excuse._id)}
                                    aria-label="Comments"
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                                >
                                    <FaRegCommentAlt color="#888" size={18} />
                                    <span>{comments[excuse._id]?.length || excuse.comments?.length || 0}</span>
                                </button>
                                <button
                                    onClick={() => navigator.share ? navigator.share({ title: 'Excuse', text: excuse.excuseText }) : navigator.clipboard.writeText(excuse.excuseText)}
                                    aria-label="Share"
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                                >
                                    <FaShare color="#888" size={18} />
                                </button>
                                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <FaEye color="#888" size={16} />
                                    {excuse.views || 0}
                                </span>
                            </div>
                            {/* Comments Section */}
                            <div className="mt-4">
                                <button
                                    className="btn btn-xs btn-ghost flex items-center gap-1"
                                    onClick={() => handleToggleComments(excuse._id)}
                                >
                                    <FaRegCommentAlt />
                                    {commentsOpen[excuse._id] ? 'Hide Comments' : 'Show Comments'}
                                    {commentsOpen[excuse._id] ? <FaChevronUp /> : <FaChevronDown />}
                                </button>
                                {commentsOpen[excuse._id] && (
                                    <div className="mt-2 bg-base-300 rounded-xl p-4">
                                        {commentLoading[excuse._id] ? (
                                            <span className="loading loading-spinner loading-xs"></span>
                                        ) : (
                                            <>
                                                {(comments[excuse._id] || []).length === 0 ? (
                                                    <div className="text-xs text-base-content/60 italic text-center py-4">No comments yet. Be the first to comment!</div>
                                                ) : (
                                                    <ul className="divide-y divide-base-200 mb-4">
                                                        {comments[excuse._id].map(comment => (
                                                            <li key={comment._id} className={`flex gap-3 py-3 group items-start ${comment.user === localStorage.getItem('userId') ? 'bg-primary/5' : ''}`.trim()}>
                                                                <img
                                                                    src={getAvatar(comment.userObj, comment.authorName)}
                                                                    alt={comment.authorName}
                                                                    className="w-7 h-7 rounded-full object-cover border border-base-200 flex-shrink-0 mt-1"
                                                                    onError={e => { e.target.onerror = null; e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.authorName || 'A')}&background=0D8ABC&color=fff&size=64`; }}
                                                                />
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="font-semibold text-base-content text-sm truncate">{comment.authorName}</span>
                                                                        <span className="text-xs text-base-content/40 truncate">{new Date(comment.createdAt).toLocaleString()}</span>
                                                                    </div>
                                                                    <div className="text-base-content/80 text-sm mt-1 break-words whitespace-pre-line">{comment.text}</div>
                                                                </div>
                                                                {/* For each top-level comment, add a similar action bar below the comment text (reply, like, share, report if needed) */}
                                                                <div className="flex gap-3 mt-2 flex-wrap">
                                                                    <button
                                                                        className="flex items-center gap-2 px-4 py-1 rounded-full bg-base-200 hover:bg-accent/10 text-base-content/80 transition-colors text-sm font-medium"
                                                                        onClick={() => handleToggleComments(excuse._id)}
                                                                        aria-label="Show comments"
                                                                        tabIndex={0}
                                                                    >
                                                                        <FaRegCommentAlt />
                                                                        {comments[excuse._id]?.length || excuse.comments?.length || 0}
                                                                    </button>
                                                                    <button
                                                                        className="flex items-center gap-2 px-4 py-1 rounded-full bg-base-200 hover:bg-error/10 text-base-content/80 transition-colors text-sm font-medium"
                                                                        onClick={() => handleReport(excuse._id)}
                                                                        // disabled={reportLoading[excuse._id] || reportedExcuses[excuse._id]} // This state was removed
                                                                        aria-label="Report excuse"
                                                                        tabIndex={0}
                                                                    >
                                                                        <FaFlag />
                                                                        {/* {reportedExcuses[excuse._id] ? 'Reported' : 'Report'} */}
                                                                    </button>
                                                                    <button
                                                                        className="flex items-center gap-2 px-4 py-1 rounded-full bg-base-200 hover:bg-info/10 text-base-content/80 transition-colors text-sm font-medium"
                                                                        onClick={() => navigator.share ? navigator.share({ title: 'Excuse', text: excuse.excuseText }) : navigator.clipboard.writeText(excuse.excuseText)}
                                                                        aria-label="Share excuse"
                                                                        tabIndex={0}
                                                                    >
                                                                        <FaUser />
                                                                        Share
                                                                    </button>
                                                                </div>
                                                                {comment.user === localStorage.getItem('userId') && (
                                                                    <button
                                                                        className="btn btn-ghost btn-xs text-error ml-2 opacity-0 group-hover:opacity-100 transition-opacity focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                                                                        onClick={() => handleDeleteComment(excuse._id, comment._id)}
                                                                        disabled={deleteCommentLoading[comment._id]}
                                                                        aria-label="Delete comment"
                                                                        tabIndex={0}
                                                                    >
                                                                        <FaTrash />
                                                                    </button>
                                                                )}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                                <div className="flex gap-2 pt-4 mt-2 border-t border-base-200 items-start bg-transparent">
                                                    <img
                                                        src={getAvatar(localStorage.getItem('userId'), localStorage.getItem('userName'))}
                                                        alt="You"
                                                        className="w-7 h-7 rounded-full object-cover border border-base-200 flex-shrink-0 mt-1"
                                                        onError={e => { e.target.onerror = null; e.target.src = `https://ui-avatars.com/api/?name=You&background=0D8ABC&color=fff&size=64`; }}
                                                    />
                                                    <input
                                                        className="input input-sm flex-1"
                                                        type="text"
                                                        placeholder="Add a comment..."
                                                        value={commentInput[excuse._id] || ''}
                                                        onChange={e => {
                                                            setCommentInput(prev => ({ ...prev, [excuse._id]: e.target.value }));
                                                            if (e.target.value.length < 2 || e.target.value.length > 300) {
                                                                setCommentError(prev => ({ ...prev, [excuse._id]: 'Comment must be between 2 and 300 characters.' }));
                                                            } else {
                                                                setCommentError(prev => ({ ...prev, [excuse._id]: '' }));
                                                            }
                                                        }}
                                                        onKeyDown={e => { if (e.key === 'Enter') handleAddComment(excuse._id); }}
                                                        disabled={addCommentLoading[excuse._id]}
                                                        ref={el => {
                                                            if (commentsOpen[excuse._id] && el) el.focus();
                                                        }}
                                                    />
                                                    {commentError[excuse._id] && <div className="text-error text-xs mt-1">{commentError[excuse._id]}</div>}
                                                    <button
                                                        className="btn btn-sm btn-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                                                        onClick={() => handleAddComment(excuse._id)}
                                                        disabled={addCommentLoading[excuse._id] || !(commentInput[excuse._id] || '').trim()}
                                                        aria-label="Post comment"
                                                        tabIndex={0}
                                                    >
                                                        {addCommentLoading[excuse._id] ? <span className="loading loading-spinner loading-xs"></span> : 'Post'}
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {/* Pagination */}
            <div className="flex gap-2 mt-8">
                <button className="btn btn-sm" disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
                <span className="text-base-content/70 text-sm">Page {page} of {totalPages}</span>
                <button className="btn btn-sm" disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
            </div>
        </div>
    );
};

export default CommunityWallPage; 
