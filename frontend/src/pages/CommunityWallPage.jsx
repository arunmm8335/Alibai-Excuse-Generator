import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faFlag, faUser, faClock, faCommentDots, faChevronDown, faChevronUp, faTrash, faFire } from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';

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

const CommunityWallPage = () => {
    const [excuses, setExcuses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [likeLoading, setLikeLoading] = useState({});
    const [reportLoading, setReportLoading] = useState({});
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

    useEffect(() => {
        fetchExcuses(page);
        fetchTrending();
        // eslint-disable-next-line
    }, [page]);

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
            const res = await axios.get(`http://localhost:5000/api/excuses/public?${params.toString()}`);
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
            const res = await axios.get('http://localhost:5000/api/excuses/trending');
            setTrending(res.data.trending);
        } catch {
            setTrending([]);
        }
        setTrendingLoading(false);
    };

    const handleLike = async (id) => {
        setLikeLoading((prev) => ({ ...prev, [id]: true }));
        try {
            await axios.post(`http://localhost:5000/api/excuses/${id}/like`, {}, { headers: { 'x-auth-token': localStorage.getItem('token') } });
            setExcuses((prev) => prev.map(e => e._id === id ? { ...e, likes: (e.likes || 0) + 1 } : e));
        } catch { }
        setLikeLoading((prev) => ({ ...prev, [id]: false }));
    };

    const handleReport = async (id) => {
        if (reportedExcuses[id]) return;
        setReportLoading((prev) => ({ ...prev, [id]: true }));
        try {
            await axios.post(`http://localhost:5000/api/excuses/${id}/report`, {}, { headers: { 'x-auth-token': localStorage.getItem('token') } });
            setReportedExcuses(prev => ({ ...prev, [id]: true }));
            toast.success('Reported for moderation. Thank you!');
        } catch {
            toast.error('Failed to report. Please try again.');
        }
        setReportLoading((prev) => ({ ...prev, [id]: false }));
    };

    const fetchComments = async (excuseId) => {
        setCommentLoading(prev => ({ ...prev, [excuseId]: true }));
        try {
            const res = await axios.get(`http://localhost:5000/api/excuses/${excuseId}/comments`);
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
        if (!text) return;
        setAddCommentLoading(prev => ({ ...prev, [excuseId]: true }));
        try {
            const asAnonymous = window.confirm('Comment anonymously? OK for anonymous, Cancel for your name.');
            const authorName = asAnonymous ? 'anonymous' : (localStorage.getItem('userName') || 'anonymous');
            const res = await axios.post(`http://localhost:5000/api/excuses/${excuseId}/comments`, { text, authorName }, { headers: { 'x-auth-token': localStorage.getItem('token') } });
            setComments(prev => ({ ...prev, [excuseId]: [...(prev[excuseId] || []), res.data.comment] }));
            setCommentInput(prev => ({ ...prev, [excuseId]: '' }));
        } catch { }
        setAddCommentLoading(prev => ({ ...prev, [excuseId]: false }));
    };

    const handleDeleteComment = async (excuseId, commentId) => {
        setDeleteCommentLoading(prev => ({ ...prev, [commentId]: true }));
        try {
            await axios.delete(`http://localhost:5000/api/excuses/${excuseId}/comments/${commentId}`, { headers: { 'x-auth-token': localStorage.getItem('token') } });
            setComments(prev => ({ ...prev, [excuseId]: (prev[excuseId] || []).filter(c => c._id !== commentId) }));
        } catch { }
        setDeleteCommentLoading(prev => ({ ...prev, [commentId]: false }));
    };

    const handleApplyFilters = () => {
        setPage(1);
        fetchExcuses(1);
    };

    return (
        <div className="min-h-screen bg-base-100 flex flex-col items-center p-8">
            <h1 className="text-3xl font-bold mb-8 text-primary">Community Excuse Wall</h1>
            <div className="w-full max-w-3xl mb-8">
                <h2 className="text-xl font-bold mb-2 flex items-center gap-2 text-accent">
                    <FontAwesomeIcon icon={faFire} className="text-error" /> Trending Excuses
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
                                <div className="flex items-center gap-2 text-xs text-base-content/60">
                                    <FontAwesomeIcon icon={faThumbsUp} /> {excuse.likes || 0}
                                    <FontAwesomeIcon icon={faCommentDots} className="ml-2" /> {excuse.comments?.length || 0}
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
                                    <FontAwesomeIcon icon={faClock} />
                                    {new Date(excuse.createdAt).toLocaleString()}
                                </span>
                            </div>
                            <div className="text-base-content/80 text-lg mb-2" style={{ wordBreak: 'break-word' }}>{excuse.excuseText}</div>
                            <div className="flex items-center gap-4 mt-2">
                                <button
                                    className={`btn btn-ghost btn-xs flex items-center gap-1 hover:text-success animated-btn${likeLoading[excuse._id] ? ' animated' : ''} focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary`}
                                    onClick={() => handleLike(excuse._id)}
                                    disabled={likeLoading[excuse._id]}
                                    aria-label="Like excuse"
                                    tabIndex={0}
                                >
                                    <FontAwesomeIcon icon={faThumbsUp} />
                                    {likeLoading[excuse._id] ? <span className="loading loading-spinner loading-xs"></span> : <span>{excuse.likes || 0}</span>}
                                </button>
                                <button
                                    className={`btn btn-ghost btn-xs flex items-center gap-1 hover:text-error animated-btn${reportLoading[excuse._id] ? ' animated' : ''} focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary`}
                                    onClick={() => handleReport(excuse._id)}
                                    disabled={reportLoading[excuse._id] || reportedExcuses[excuse._id]}
                                    aria-label="Report excuse"
                                    tabIndex={0}
                                >
                                    <FontAwesomeIcon icon={faFlag} />
                                    {reportLoading[excuse._id] ? <span className="loading loading-spinner loading-xs"></span> : <span>{reportedExcuses[excuse._id] ? 'Reported' : 'Report'}</span>}
                                </button>
                                <span className="ml-auto text-xs text-base-content/60 flex items-center gap-1">
                                    <FontAwesomeIcon icon={faCommentDots} />
                                    {excuse.scenario}
                                </span>
                            </div>
                            {/* Comments Section */}
                            <div className="mt-4">
                                <button
                                    className="btn btn-xs btn-ghost flex items-center gap-1"
                                    onClick={() => handleToggleComments(excuse._id)}
                                >
                                    <FontAwesomeIcon icon={faCommentDots} />
                                    {commentsOpen[excuse._id] ? 'Hide Comments' : 'Show Comments'}
                                    <FontAwesomeIcon icon={commentsOpen[excuse._id] ? faChevronUp : faChevronDown} />
                                </button>
                                {commentsOpen[excuse._id] && (
                                    <div className="mt-2 bg-base-300 rounded-xl p-4">
                                        {commentLoading[excuse._id] ? (
                                            <span className="loading loading-spinner loading-xs"></span>
                                        ) : (
                                            <>
                                                {(comments[excuse._id] || []).length === 0 ? (
                                                    <div className="text-xs text-base-content/60">No comments yet.</div>
                                                ) : (
                                                    <ul className="space-y-2 mb-2">
                                                        {comments[excuse._id].map(comment => (
                                                            <li key={comment._id} className="flex items-start gap-2 text-sm">
                                                                <span className="font-semibold text-primary">{comment.authorName}</span>
                                                                <span className="text-base-content/70">{comment.text}</span>
                                                                <span className="text-xs text-base-content/40 ml-2">{new Date(comment.createdAt).toLocaleString()}</span>
                                                                {comment.user === localStorage.getItem('userId') && (
                                                                    <button
                                                                        className="btn btn-ghost btn-xs text-error ml-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                                                                        onClick={() => handleDeleteComment(excuse._id, comment._id)}
                                                                        disabled={deleteCommentLoading[comment._id]}
                                                                        aria-label="Delete comment"
                                                                        tabIndex={0}
                                                                    >
                                                                        <FontAwesomeIcon icon={faTrash} />
                                                                    </button>
                                                                )}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                                <div className="flex gap-2 mt-2">
                                                    <input
                                                        className="input input-sm flex-1"
                                                        type="text"
                                                        placeholder="Add a comment..."
                                                        value={commentInput[excuse._id] || ''}
                                                        onChange={e => setCommentInput(prev => ({ ...prev, [excuse._id]: e.target.value }))}
                                                        onKeyDown={e => { if (e.key === 'Enter') handleAddComment(excuse._id); }}
                                                        disabled={addCommentLoading[excuse._id]}
                                                    />
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