import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUser, faChartBar, faBookmark, faCog, faSignOutAlt, faStar, faHeart, faCheckCircle, faTimesCircle, faMagicWandSparkles, faCrown, faMapMarkerAlt, faCalendar, faKey, faLink, faThumbsUp, faThumbsDown, faChartLine, faPercent
} from '@fortawesome/free-solid-svg-icons';
import { faGithub, faLinkedin, faTwitter } from '@fortawesome/free-brands-svg-icons';

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

    const fetchProfile = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error("You must be logged in to view your profile.");
            setIsLoading(false);
            return;
        }
        try {
            const config = { headers: { 'x-auth-token': token } };
            const res = await axios.get('http://localhost:5000/api/users/profile', config);
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
            await axios.patch(`http://localhost:5000/api/excuses/${excuseId}/public`, { publicAuthor }, { headers: { 'x-auth-token': localStorage.getItem('token') } });
            toast.success('Excuse published to Community Wall!');
            // Refresh profile data to update UI
            fetchProfile();
        } catch (err) {
            toast.error('Failed to make excuse public.');
        }
        setPublishing(prev => ({ ...prev, [excuseId]: false }));
    };

    return (
        <div className="min-h-screen flex flex-col items-center bg-base-100">
            {/* Main Content */}
            <main className="flex-1 flex flex-col gap-8 p-8 overflow-y-auto bg-base-100">
                {/* Top Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    {/* Profile Card */}
                    <div className="col-span-2 bg-base-200 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 shadow-lg border border-base-300">
                        <img
                            src={getAvatar(user)}
                            alt={user.name}
                            className="w-40 h-40 rounded-3xl object-cover border-4 border-primary/30 shadow-2xl"
                        />
                        <div className="flex-1 flex flex-col gap-3 items-center md:items-start">
                            <h1 className="text-3xl font-bold text-base-content flex items-center gap-2">
                                {user.name}
                                {user.userTier === 'pro' && <span className="ml-2 px-3 py-1 rounded-full bg-warning/20 text-warning text-xs font-semibold flex items-center gap-1"><FontAwesomeIcon icon={faCrown} size="sm" />Pro</span>}
                                {user.smartRank && <span className="ml-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-semibold flex items-center gap-1">{user.smartRank}</span>}
                            </h1>
                            <span className="text-base-content/70">{user.email}</span>
                            {user.bio && (
                                <div className="text-base-content/80 text-sm mt-1">
                                    <FontAwesomeIcon icon={faUser} className="mr-2 text-primary/80" />
                                    {user.bio}
                                </div>
                            )}
                            {user.mobile && (
                                <div className="text-base-content/80 text-sm flex items-center gap-2 mt-1">
                                    <FontAwesomeIcon icon={faKey} className="text-primary/80" />
                                    {user.mobile}
                                </div>
                            )}
                            {/* Smart Preferences Display */}
                            {user.smartPreferences && (
                                <div className="flex flex-col gap-1 mt-2 bg-base-300/60 rounded-lg px-4 py-2">
                                    <div className="font-semibold text-primary text-xs mb-1">Smart Preferences</div>
                                    <div className="flex gap-4 text-xs">
                                        <span><b>Tone:</b> {user.smartPreferences.tone}</span>
                                        <span><b>Length:</b> {user.smartPreferences.length}</span>
                                        <span><b>Humor:</b> {user.smartPreferences.humor ? 'On' : 'Off'}</span>
                                    </div>
                                </div>
                            )}
                            <div className="flex items-center gap-3 text-base-content/60 text-sm">
                                <FontAwesomeIcon icon={faCalendar} size="sm" />
                                <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex gap-2 mt-2">
                                {user.github && (
                                    <a href={user.github} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-circle btn-sm text-base-content/60 hover:text-primary" title="GitHub">
                                        <FontAwesomeIcon icon={faGithub} size="lg" />
                                    </a>
                                )}
                                {user.linkedin && (
                                    <a href={user.linkedin} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-circle btn-sm text-base-content/60 hover:text-primary" title="LinkedIn">
                                        <FontAwesomeIcon icon={faLinkedin} size="lg" />
                                    </a>
                                )}
                                {user.twitter && (
                                    <a href={user.twitter} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-circle btn-sm text-base-content/60 hover:text-primary" title="Twitter">
                                        <FontAwesomeIcon icon={faTwitter} size="lg" />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* Stats Card */}
                    <div className="bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 rounded-3xl p-8 flex flex-col items-center justify-center shadow-lg border border-base-300">
                        <div className="text-4xl font-bold text-base-content mb-2">{user.userTier === 'pro' ? 'Pro' : 'Free'} Tier</div>
                        <div className="w-24 h-24 rounded-full bg-base-300 flex items-center justify-center mb-4">
                            <FontAwesomeIcon icon={faStar} size="2x" className="text-primary" />
                        </div>
                        <div className="text-base-content/80 text-center">
                            {user.userTier === 'pro' ? (
                                <>
                                    <div className="font-semibold mb-2">Unlimited generations</div>
                                    <div className="text-xs">API Key: {user.userApiKey ? '●●●●●●●●●●●●●●●●●●●●●●●' : 'Not set'}</div>
                                </>
                            ) : (
                                <>
                                    <div className="font-semibold mb-2">{user.apiCallCount} / 20 daily generations</div>
                                    <div className="text-xs">Upgrade to Pro for unlimited access</div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Stat Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                    {statCards.map(card => (
                        <div key={card.label} className="rounded-2xl p-6 flex flex-col items-center bg-gradient-to-br from-base-200 via-base-100 to-base-300 shadow border border-base-300 hover:shadow-lg transition-shadow duration-200">
                            <div className="mb-2"><FontAwesomeIcon icon={card.icon} color="#444" size="lg" /></div>
                            <div className="text-2xl font-bold text-base-content">{stats[card.key]}</div>
                            <div className="text-base-content/70 text-sm">{card.label}</div>
                        </div>
                    ))}
                </div>

                {/* Effectiveness Analytics Section */}
                <div className="bg-base-200 rounded-3xl p-8 shadow-lg border border-base-300">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-base-content">
                        <FontAwesomeIcon icon={faChartLine} size="lg" />
                        Effectiveness Analytics
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        {/* Success Rate Card */}
                        <div className="bg-gradient-to-br from-success/20 to-success/10 rounded-2xl p-6 border border-success/30">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <FontAwesomeIcon icon={faPercent} className="text-success" />
                                    <span className="font-semibold text-base-content">Success Rate</span>
                                </div>
                                <div className="text-3xl font-bold text-success">{successRate}%</div>
                            </div>
                            <div className="w-full bg-base-300 rounded-full h-3">
                                <div
                                    className="bg-success h-3 rounded-full transition-all duration-500"
                                    style={{ width: `${successRate}%` }}
                                ></div>
                            </div>
                            <div className="text-xs text-base-content/70 mt-2">
                                {stats.successfulCount} successful out of {totalRated} rated excuses
                            </div>
                        </div>

                        {/* Effectiveness Breakdown */}
                        <div className="bg-base-300/60 rounded-2xl p-6">
                            <h3 className="font-semibold text-base-content mb-4">Effectiveness Breakdown</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <FontAwesomeIcon icon={faThumbsUp} className="text-success" />
                                        <span className="text-sm">Successful</span>
                                    </div>
                                    <span className="font-semibold text-success">{stats.successfulCount}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <FontAwesomeIcon icon={faThumbsDown} className="text-error" />
                                        <span className="text-sm">Failed</span>
                                    </div>
                                    <span className="font-semibold text-error">{stats.failedCount}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <FontAwesomeIcon icon={faChartBar} className="text-base-content/60" />
                                        <span className="text-sm">Unrated</span>
                                    </div>
                                    <span className="font-semibold text-base-content/60">{unratedCount}</span>
                                </div>
                            </div>
                        </div>

                        {/* AI Learning Progress */}
                        <div className="bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl p-6 border border-primary/30">
                            <div className="flex items-center gap-2 mb-4">
                                <FontAwesomeIcon icon={faChartLine} className="text-primary" />
                                <span className="font-semibold text-base-content">AI Learning</span>
                            </div>
                            <div className="text-2xl font-bold text-primary mb-2">
                                {totalRated > 0 ? Math.min(Math.round((totalRated / stats.totalExcuses) * 100), 100) : 0}%
                            </div>
                            <div className="text-xs text-base-content/70">
                                {totalRated} excuses rated for AI improvement
                            </div>
                            <div className="mt-3 text-xs text-base-content/60">
                                Rate your excuses to help AI learn your preferences
                            </div>
                        </div>
                    </div>

                    {/* Detailed Analytics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Performance Trends */}
                        <div className="bg-base-300/40 rounded-2xl p-6">
                            <h3 className="font-semibold text-base-content mb-4">Performance Insights</h3>
                            <div className="space-y-3 text-sm">
                                {totalRated > 0 ? (
                                    <>
                                        <div className="flex justify-between">
                                            <span>Success Rate:</span>
                                            <span className={`font-semibold ${successRate >= 70 ? 'text-success' : successRate >= 50 ? 'text-warning' : 'text-error'}`}>
                                                {successRate}%
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Total Rated:</span>
                                            <span className="font-semibold">{totalRated} excuses</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Rating Coverage:</span>
                                            <span className="font-semibold">
                                                {Math.round((totalRated / stats.totalExcuses) * 100)}%
                                            </span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center text-base-content/60 py-4">
                                        <FontAwesomeIcon icon={faChartBar} size="lg" className="mx-auto mb-2 opacity-50" />
                                        <p>No ratings yet</p>
                                        <p className="text-xs">Start rating your excuses to see analytics</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Recommendations */}
                        <div className="bg-base-300/40 rounded-2xl p-6">
                            <h3 className="font-semibold text-base-content mb-4">Recommendations</h3>
                            <div className="space-y-3 text-sm">
                                {totalRated === 0 && (
                                    <div className="text-warning">
                                        <FontAwesomeIcon icon={faThumbsUp} className="mr-2" />
                                        Start rating excuses to get personalized insights
                                    </div>
                                )}
                                {totalRated > 0 && successRate < 50 && (
                                    <div className="text-error">
                                        <FontAwesomeIcon icon={faChartLine} className="mr-2" />
                                        Try adjusting your Smart Preferences for better results
                                    </div>
                                )}
                                {totalRated > 0 && successRate >= 70 && (
                                    <div className="text-success">
                                        <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                                        Excellent success rate! Keep up the good work
                                    </div>
                                )}
                                {unratedCount > stats.totalExcuses * 0.3 && (
                                    <div className="text-info">
                                        <FontAwesomeIcon icon={faChartBar} className="mr-2" />
                                        Rate more excuses to improve AI learning
                                    </div>
                                )}
                                {stats.totalExcuses === 0 && (
                                    <div className="text-base-content/60">
                                        <FontAwesomeIcon icon={faMagicWandSparkles} className="mr-2" />
                                        Generate your first excuse to start tracking
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Favorite Excuses Section */}
                <div className="bg-base-200 rounded-3xl p-8 shadow-lg border border-base-300">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-base-content"><FontAwesomeIcon icon={faBookmark} size="lg" /> Favorite Excuses</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {favoriteExcuses.length > 0 ? (
                            favoriteExcuses.map(excuse => (
                                <div key={excuse._id} className="p-4 bg-gradient-to-br from-base-200 via-base-100 to-base-300 rounded-xl border border-base-300 hover:bg-base-300/60 transition-colors shadow flex flex-col gap-2">
                                    <div className="flex items-center gap-2 mb-1">
                                        <img src={getAvatar(user)} alt="avatar" className="w-8 h-8 rounded-full border border-primary/30" />
                                        <span className="font-semibold text-base-content text-xs">{user.name || 'Anonymous'}</span>
                                    </div>
                                    <div className="font-semibold text-base-content mb-2">{excuse.scenario}</div>
                                    <div className="text-base-content/70 italic">"{excuse.excuseText}"</div>
                                    {excuse.effectiveness !== undefined && (
                                        <div className="flex items-center gap-2 mt-2">
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
                                    <div className="flex items-center gap-2 mt-4">
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
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center text-base-content/60 py-8">
                                <FontAwesomeIcon icon={faHeart} size="2x" className="mx-auto mb-2 opacity-50" />
                                <p>No favorite excuses yet</p>
                                <p className="text-xs">Start generating excuses to see them here</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProfilePage;