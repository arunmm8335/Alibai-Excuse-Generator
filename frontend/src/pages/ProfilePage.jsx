import React, { useState, useEffect } from 'react';
import api from '../api';
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUser, faChartBar, faBookmark, faCog, faSignOutAlt, faStar, faHeart, faCheckCircle, faTimesCircle, faMagicWandSparkles, faCrown, faMapMarkerAlt, faCalendar, faKey, faLink, faThumbsUp, faThumbsDown, faChartLine, faPercent, faCopy, faSms, faEnvelope
} from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp, faGithub, faLinkedin, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { useNavigate } from 'react-router-dom';

const DEFAULT_AVATAR = 'https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff&size=128';

const sidebarLinks = [
    { label: 'Profile', icon: faUser },
    { label: 'Stats', icon: faChartBar },
    { label: 'Favorites', icon: faBookmark },
    { label: 'Settings', icon: faCog },
    { label: 'Logout', icon: faSignOutAlt },
];

const socialLinks = [
    { href: 'https://github.com/your-username', icon: faGithub, label: 'GitHub' },
    { href: 'https://linkedin.com/in/your-profile', icon: faLinkedin, label: 'LinkedIn' },
    { href: 'https://twitter.com/your-handle', icon: faTwitter, label: 'Twitter' },
];

const statCards = [
    { label: 'Total Excuses', icon: faMagicWandSparkles, color: 'primary', key: 'totalExcuses' },
    { label: 'Favorites', icon: faHeart, color: 'secondary', key: 'favoritesCount' },
    { label: 'Successful', icon: faCheckCircle, color: 'success', key: 'successfulCount' },
    { label: 'Failed', icon: faTimesCircle, color: 'error', key: 'failedCount' },
];

// Helper to get avatar URL or initials
function getAvatar(user) {
    if (user && user.profilePic) return user.profilePic;
    const name = user?.name || 'A';
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=0D8ABC&color=fff&size=128`;
}

const ProfilePage = () => {
    const [profileData, setProfileData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [apiKeyInput, setApiKeyInput] = useState('');
    const [publishing, setPublishing] = useState({});
    const navigate = useNavigate();

    const fetchProfile = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error("You must be logged in to view your profile.");
            setIsLoading(false);
            return;
        }
        try {
            const config = { headers: { 'x-auth-token': token } };
            const res = await api.get('/users/profile', config);
            setProfileData(res.data);
        } catch (err) {
            toast.error("Could not load profile data.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchProfile(); }, []);

    if (isLoading) {
        return <div className="text-center mt-20"><span className="loading loading-spinner loading-lg"></span></div>;
    }
    if (!profileData) {
        return <div className="text-center text-error mt-20">Could not load profile. Please try logging in again.</div>;
    }
    const { user, stats, favoriteExcuses } = profileData;

    // Calculate effectiveness analytics
    const totalRated = stats.successfulCount + stats.failedCount;
    const successRate = totalRated > 0 ? Math.round((stats.successfulCount / totalRated) * 100) : 0;
    const unratedCount = stats.totalExcuses - totalRated;

    const handleMakePublic = async (excuseId, currentPublic) => {
        if (currentPublic) return;
        setPublishing(prev => ({ ...prev, [excuseId]: true }));
        try {
            // Ask user if they want to post as their name or anonymously
            const asAnonymous = window.confirm('Do you want to post this excuse anonymously? Click OK for anonymous, Cancel for your name.');
            let publicAuthor = 'anonymous';
            if (!asAnonymous) {
                publicAuthor = profileData.user.name || profileData.user.email || 'anonymous';
            }
            console.log('Publishing with publicAuthor:', publicAuthor);
            await api.patch(`/excuses/${excuseId}/public`, { publicAuthor }, { headers: { 'x-auth-token': localStorage.getItem('token') } });
            toast.success('Excuse published to Community Wall!');
            // Refresh profile data to update UI
            fetchProfile();
        } catch (err) {
            toast.error('Failed to make excuse public.');
        }
        setPublishing(prev => ({ ...prev, [excuseId]: false }));
    };

    return (
        <div className="min-h-screen flex flex-col items-center pt-[64px]">
            <main className="flex-1 flex flex-col gap-12 p-4 md:p-12 w-full max-w-7xl mx-auto">
                {/* Modern Glassmorphism Profile Card */}
                <div className="w-full rounded-2xl bg-base-100/70 backdrop-blur-lg flex flex-col md:flex-row items-center gap-6 p-4 md:p-6 mb-6 animate-fade-in" style={{ border: '1.5px solid #a3a3a3', boxShadow: '0 2px 12px 0 rgba(0,0,0,0.10)' }}>
                    <div className="flex flex-col items-center gap-2 md:gap-3">
                        <img
                            src={getAvatar(user)}
                            alt={user.name}
                            className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border-2 border-primary/40 shadow"
                        />
                        <button className="btn btn-primary btn-xs mt-1 w-24 flex items-center gap-2" onClick={() => navigate('/edit-profile')}>
                            <FontAwesomeIcon icon={faCog} />
                            Edit
                        </button>
                    </div>
                    <div className="flex-1 flex flex-col gap-2 items-center md:items-start">
                        <h1 className="text-2xl md:text-3xl font-bold text-base-content flex items-center gap-2">
                            {user.name}
                            {user.userTier === 'pro' && <span className="ml-2 px-2 py-0.5 rounded-full bg-warning/20 text-warning text-xs font-semibold flex items-center gap-1"><FontAwesomeIcon icon={faCrown} size="sm" />Pro</span>}
                            {user.smartRank && <span className="ml-2 px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-semibold flex items-center gap-1">{user.smartRank}</span>}
                        </h1>
                        <span className="text-base-content/70 text-sm">{user.email}</span>
                        {user.bio && (
                            <div className="text-base-content/80 text-sm mt-1 flex items-center gap-2">
                                <FontAwesomeIcon icon={faUser} className="text-primary/80" />
                                {user.bio}
                            </div>
                        )}
                        {user.mobile && (
                            <div className="text-base-content/80 text-sm flex items-center gap-2 mt-1">
                                <FontAwesomeIcon icon={faKey} className="text-primary/80" />
                                {user.mobile}
                            </div>
                        )}
                        {user.smartPreferences && (
                            <div className="flex flex-col gap-1 mt-2 bg-base-300/60 rounded-lg px-3 py-2">
                                <div className="font-semibold text-primary text-xs mb-1">Smart Preferences</div>
                                <div className="flex gap-3 text-xs">
                                    <span><b>Tone:</b> {user.smartPreferences.tone}</span>
                                    <span><b>Length:</b> {user.smartPreferences.length}</span>
                                    <span><b>Humor:</b> {user.smartPreferences.humor ? 'Enabled' : 'Disabled'}</span>
                                </div>
                            </div>
                        )}
                        <div className="flex items-center gap-2 text-base-content/60 text-xs mt-2">
                            <FontAwesomeIcon icon={faCalendar} size="sm" />
                            <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex gap-2 mt-2">
                            {user.github && (
                                <a href={user.github} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-circle btn-sm text-base-content/60 hover:text-primary" title="GitHub">
                                    <FontAwesomeIcon icon={faGithub} size="sm" />
                                </a>
                            )}
                            {user.linkedin && (
                                <a href={user.linkedin} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-circle btn-sm text-base-content/60 hover:text-primary" title="LinkedIn">
                                    <FontAwesomeIcon icon={faLinkedin} size="sm" />
                                </a>
                            )}
                            {user.twitter && (
                                <a href={user.twitter} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-circle btn-sm text-base-content/60 hover:text-primary" title="Twitter">
                                    <FontAwesomeIcon icon={faTwitter} size="sm" />
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                {/* Stat Cards Grid - Modernized */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    {statCards.map(card => (
                        <div key={card.label} className="rounded-2xl p-4 flex flex-col items-center bg-gradient-to-br from-base-200 via-base-100 to-base-300" style={{ border: '1.5px solid #a3a3a3', boxShadow: '0 2px 12px 0 rgba(0,0,0,0.10)' }}>
                            <div className="mb-2"><FontAwesomeIcon icon={card.icon} color="#444" size="lg" /></div>
                            <div className="text-xl font-bold text-base-content">{stats[card.key]}</div>
                            <div className="text-base-content/70 text-xs mt-1">{card.label}</div>
                        </div>
                    ))}
                </div>

                {/* Effectiveness Analytics Section - Modern */}
                <div className="bg-base-100/80 backdrop-blur-lg rounded-2xl p-5 animate-fade-in" style={{ border: '1.5px solid #a3a3a3', boxShadow: '0 2px 12px 0 rgba(0,0,0,0.10)' }}>
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-base-content">
                        <FontAwesomeIcon icon={faChartLine} size="sm" />
                        Effectiveness Analytics
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        {/* Success Rate Card */}
                        <div className="bg-gradient-to-br from-success/20 to-success/10 rounded-xl p-4 border border-success/30 flex flex-col items-center">
                            <div className="flex items-center gap-2 mb-2">
                                <FontAwesomeIcon icon={faPercent} className="text-success text-lg" />
                                <span className="font-semibold text-base-content text-sm">Success Rate</span>
                            </div>
                            <div className="w-full bg-base-300 rounded-full h-2 mb-1">
                                <div
                                    className="bg-success h-2 rounded-full transition-all duration-700"
                                    style={{ width: `${successRate}%` }}
                                ></div>
                            </div>
                            <div className="text-2xl font-bold text-success">{successRate}%</div>
                            <div className="text-base-content/70 mt-1 text-xs">
                                {stats.successfulCount} successful out of {totalRated} rated excuses
                            </div>
                        </div>
                        {/* Effectiveness Breakdown */}
                        <div className="bg-base-300/60 rounded-xl p-4 flex flex-col items-center">
                            <h3 className="font-semibold text-base-content text-sm mb-2">Effectiveness Breakdown</h3>
                            <div className="space-y-2 w-full">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1">
                                        <FontAwesomeIcon icon={faThumbsUp} className="text-success" />
                                        <span className="text-sm">Successful</span>
                                    </div>
                                    <span className="font-semibold text-success text-sm">{stats.successfulCount}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1">
                                        <FontAwesomeIcon icon={faThumbsDown} className="text-error" />
                                        <span className="text-sm">Failed</span>
                                    </div>
                                    <span className="font-semibold text-error text-sm">{stats.failedCount}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1">
                                        <FontAwesomeIcon icon={faChartBar} className="text-base-content/60" />
                                        <span className="text-sm">Unrated</span>
                                    </div>
                                    <span className="font-semibold text-base-content/60 text-sm">{unratedCount}</span>
                                </div>
                            </div>
                        </div>
                        {/* AI Learning Progress */}
                        <div className="bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl p-4 border border-primary/30 flex flex-col items-center">
                            <div className="flex items-center gap-2 mb-2">
                                <FontAwesomeIcon icon={faChartLine} className="text-primary text-lg" />
                                <span className="font-semibold text-base-content text-sm">AI Learning</span>
                            </div>
                            <div className="w-full bg-base-300 rounded-full h-2 mb-1">
                                <div
                                    className="bg-primary h-2 rounded-full transition-all duration-700"
                                    style={{ width: `${totalRated > 0 ? Math.min(Math.round((totalRated / stats.totalExcuses) * 100), 100) : 0}%` }}
                                ></div>
                            </div>
                            <div className="text-2xl font-bold text-primary mb-1">
                                {totalRated > 0 ? Math.min(Math.round((totalRated / stats.totalExcuses) * 100), 100) : 0}%
                            </div>
                            <div className="text-base-content/70 text-xs">
                                {totalRated} excuses rated for AI improvement
                            </div>
                            <div className="mt-2 text-base-content/60 text-xs">
                                Rate your excuses to help AI learn your preferences
                            </div>
                        </div>
                    </div>
                    {/* Detailed Analytics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Performance Trends */}
                        <div className="bg-base-300/40 rounded-xl p-4">
                            <h3 className="font-semibold text-base-content text-sm mb-2">Performance Insights</h3>
                            <div className="space-y-2 text-sm">
                                {totalRated > 0 ? (
                                    <>
                                        <div className="flex justify-between">
                                            <span>Success Rate:</span>
                                            <span className={`font-semibold ${successRate >= 70 ? 'text-success' : successRate >= 50 ? 'text-warning' : 'text-error'}`}>{successRate}%</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Total Rated:</span>
                                            <span className="font-semibold">{totalRated} excuses</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Rating Coverage:</span>
                                            <span className="font-semibold">{Math.round((totalRated / stats.totalExcuses) * 100)}%</span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center text-base-content/60 py-3">
                                        <FontAwesomeIcon icon={faChartBar} size="sm" className="mx-auto mb-1 opacity-50" />
                                        <p>No ratings yet</p>
                                        <p className="text-xs mt-1">Start rating your excuses to see analytics</p>
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* Recommendations */}
                        <div className="bg-base-300/40 rounded-xl p-4">
                            <h3 className="font-semibold text-base-content text-sm mb-2">Recommendations</h3>
                            <div className="space-y-2 text-sm">
                                {totalRated === 0 && (
                                    <div className="text-warning">
                                        <FontAwesomeIcon icon={faThumbsUp} className="mr-1" />
                                        Start rating excuses to get personalized insights
                                    </div>
                                )}
                                {totalRated > 0 && successRate < 50 && (
                                    <div className="text-error">
                                        <FontAwesomeIcon icon={faChartLine} className="mr-1" />
                                        Try adjusting your Smart Preferences for better results
                                    </div>
                                )}
                                {totalRated > 0 && successRate >= 70 && (
                                    <div className="text-success">
                                        <FontAwesomeIcon icon={faCheckCircle} className="mr-1" />
                                        Excellent success rate! Keep up the good work
                                    </div>
                                )}
                                {unratedCount > stats.totalExcuses * 0.3 && (
                                    <div className="text-info">
                                        <FontAwesomeIcon icon={faChartBar} className="mr-1" />
                                        Rate more excuses to improve AI learning
                                    </div>
                                )}
                                {stats.totalExcuses === 0 && (
                                    <div className="text-base-content/60">
                                        <FontAwesomeIcon icon={faMagicWandSparkles} className="mr-1" />
                                        Generate your first excuse to start tracking
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Favorite Excuses Section - Modernized */}
                <div className="bg-base-100/80 backdrop-blur-lg rounded-2xl p-5 animate-fade-in" style={{ border: '1.5px solid #a3a3a3', boxShadow: '0 2px 12px 0 rgba(0,0,0,0.10)' }}>
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-base-content"><FontAwesomeIcon icon={faBookmark} size="sm" /> Favorite Excuses</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {favoriteExcuses.length > 0 ? (
                            favoriteExcuses.map(excuse => (
                                <div key={excuse._id} className="p-3 bg-gradient-to-br from-base-200 via-base-100 to-base-300 rounded-2xl hover:scale-105 hover:shadow-xl transition-all duration-200 flex flex-col gap-2 animate-fade-in" style={{ border: '1.5px solid #a3a3a3', boxShadow: '0 2px 12px 0 rgba(0,0,0,0.10)' }}>
                                    <div className="flex items-center gap-2 mb-1">
                                        <img src={getAvatar(user)} alt="avatar" className="w-8 h-8 rounded-full border border-primary/30" />
                                        <span className="font-semibold text-base-content text-sm">{user.name || 'Anonymous'}</span>
                                    </div>
                                    <div className="font-semibold text-base-content text-base mb-1">{excuse.scenario}</div>
                                    <div className="text-base-content/70 italic text-sm">"{excuse.excuseText}"</div>
                                    {excuse.effectiveness !== undefined && (
                                        <div className="flex items-center gap-1 mt-1">
                                            {excuse.effectiveness === 1 && (
                                                <span className="text-success text-xs flex items-center gap-1">
                                                    <FontAwesomeIcon icon={faThumbsUp} size="xs" />
                                                    Worked
                                                </span>
                                            )}
                                            {excuse.effectiveness === -1 && (
                                                <span className="text-error text-xs flex items-center gap-1">
                                                    <FontAwesomeIcon icon={faThumbsDown} size="xs" />
                                                    Failed
                                                </span>
                                            )}
                                        </div>
                                    )}
                                    <div className="flex items-center gap-1 mt-2">
                                        {excuse.isPublic ? (
                                            <span className="text-xs text-success flex items-center gap-1">
                                                <FontAwesomeIcon icon={faChartLine} size="xs" />
                                                Public
                                            </span>
                                        ) : (
                                            <button
                                                className="btn btn-xs btn-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                                                disabled={publishing[excuse._id]}
                                                onClick={() => handleMakePublic(excuse._id, excuse.isPublic)}
                                                aria-label="Make public"
                                                tabIndex={0}
                                            >
                                                {publishing[excuse._id] ? 'Publishing...' : 'Make Public'}
                                            </button>
                                        )}
                                    </div>
                                    <div className="flex gap-1 mt-1">
                                        <button onClick={() => navigator.clipboard.writeText(excuse.excuseText)} className="hover:text-primary hover:scale-110 transition-transform" title="Copy to clipboard">
                                            <FontAwesomeIcon icon={faCopy} />
                                        </button>
                                        <button onClick={() => handleShareWhatsApp(excuse.excuseText)} className="hover:text-green-500 transition-transform" title="Share via WhatsApp">
                                            <FontAwesomeIcon icon={faWhatsapp} />
                                        </button>
                                        <button onClick={() => handleShareSMS(excuse.excuseText)} className="hover:text-blue-400 transition-transform" title="Share via SMS">
                                            <FontAwesomeIcon icon={faSms} />
                                        </button>
                                        <button onClick={() => handleShareEmail(excuse.excuseText)} className="hover:text-rose-500 transition-transform" title="Share via Email">
                                            <FontAwesomeIcon icon={faEnvelope} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center text-base-content/60 py-8">
                                <FontAwesomeIcon icon={faHeart} size="lg" className="mx-auto mb-2 opacity-50" />
                                <p className="text-base">No favorite excuses yet</p>
                                <p className="text-xs mt-1">Start generating excuses to see them here</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProfilePage;
