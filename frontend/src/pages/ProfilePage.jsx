import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Key, RocketLaunch, Trash } from 'phosphor-react';
import myProfilePic from '../assets/profile-arun.jpg'; // RESTORED LOCAL IMAGE IMPORT

// A helper component for displaying stats
const StatCard = ({ label, value }) => (
    <div className="stat bg-base-200/50 rounded-lg">
        <div className="stat-title">{label}</div>
        <div className="stat-value text-primary">{value}</div>
    </div>
);

const ProfilePage = () => {
    const [profileData, setProfileData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [apiKeyInput, setApiKeyInput] = useState('');

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

    // Fetch data on component mount
    useEffect(() => {
        fetchProfile();
    }, []);
    
    // --- Handlers for Pro Tier and API Key ---
    const handleUpgrade = async () => {
        const promise = axios.post('http://localhost:5000/api/users/upgrade', {}, { headers: { 'x-auth-token': localStorage.getItem('token') } });
        toast.promise(promise, {
            loading: 'Upgrading your account...',
            success: 'Successfully upgraded to Pro!',
            error: 'Upgrade failed.'
        }).then(() => fetchProfile()); // Refresh data after action
    };

    const handleSaveKey = async () => {
        if (!apiKeyInput.startsWith("sk-")) {
            return toast.error("Invalid API Key format. It must start with 'sk-'.");
        }
        const promise = axios.post('http://localhost:5000/api/users/api-key', { apiKey: apiKeyInput }, { headers: { 'x-auth-token': localStorage.getItem('token') } });
        toast.promise(promise, {
            loading: 'Saving API Key...',
            success: 'API Key saved successfully!',
            error: (err) => err.response?.data?.msg || 'Failed to save key.'
        }).then(() => { setApiKeyInput(''); fetchProfile(); });
    };

    const handleDeleteKey = async () => {
        if (!window.confirm("Are you sure you want to remove your API key? This will revert you to the free tier limits.")) return;
        const promise = axios.delete('http://localhost:5000/api/users/api-key', { headers: { 'x-auth-token': localStorage.getItem('token') } });
        toast.promise(promise, {
            loading: 'Removing API Key...',
            success: 'API Key removed.',
            error: 'Failed to remove key.'
        }).then(() => fetchProfile());
    };


    if (isLoading) {
        return <div className="text-center mt-20"><span className="loading loading-spinner loading-lg"></span></div>;
    }

    if (!profileData) {
        return <div className="text-center text-error mt-20">Could not load profile. Please try logging in again.</div>;
    }

    const { user, stats, favoriteExcuses } = profileData;

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-12 animate-fade-in">
            {/* --- User Header --- */}
            <div className="flex items-center gap-6 p-6 bg-base-200/50 rounded-box shadow-lg">
                <div className="avatar placeholder">
                     <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                        {/* --- RESTORED PROFILE PICTURE --- */}
                        <img src={myProfilePic} alt="Arun M" />
                    </div>
                </div>
                <div>
                    <h1 className="text-4xl font-bold">{user.name}</h1>
                    <p className="text-base-content/70">{user.email}</p>
                    <p className="text-xs text-base-content/50 mt-2">Member since {new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
            </div>

            {/* --- Statistics Section --- */}
            <div>
                <h2 className="text-2xl font-bold mb-4">Your Alibai Stats</h2>
                <div className="stats shadow w-full">
                    <StatCard label="Total Excuses Generated" value={stats.totalExcuses} />
                    <StatCard label="Total Favorites" value={stats.favoritesCount} />
                    <StatCard label="Successful Excuses (👍)" value={stats.successfulCount} />
                    <StatCard label="Failed Excuses (👎)" value={stats.failedCount} />
                </div>
            </div>

            {/* --- Tier Management Section --- */}
            <div>
                <h2 className="text-2xl font-bold mb-4">Account Tier</h2>
                {user.userTier === 'free' ? (
                    // FREE TIER VIEW
                    <div className="card bg-base-200/50 p-6 text-center shadow-lg">
                        <h3 className="text-xl font-bold">You are on the <span className="text-secondary">Free Tier</span></h3>
                        <p className="py-4">You have used {user.apiCallCount} / 20 of your daily generations.</p>
                        <button className="btn btn-primary" onClick={handleUpgrade}><RocketLaunch size={20} className="mr-2"/>Upgrade to Pro</button>
                        <p className="text-xs text-base-content/60 mt-4">Upgrade to Pro to add your own API key for unlimited generations.</p>
                    </div>
                ) : (
                    // PRO TIER VIEW
                    <div className="card bg-base-200/50 p-6 shadow-lg">
                        <h3 className="text-xl font-bold">You are a <span className="text-primary">Pro Member</span></h3>
                        <p className="py-4 text-base-content/80">You can add your own OpenAI-compatible API key for unlimited excuse generations. Your key is encrypted and stored securely.</p>
                        <div className="form-control">
                            <label className="label"><span className="label-text flex items-center gap-2"><Key size={16}/> Your API Key</span></label>
                            <div className="input-group">
                                <input 
                                    type="password"
                                    placeholder={user.userApiKey ? "●●●●●●●●●●●●●●●●●●●●●●●" : "Enter your API key (e.g., sk-...)"}
                                    className="input input-bordered w-full"
                                    value={apiKeyInput}
                                    onChange={(e) => setApiKeyInput(e.target.value)}
                                />
                                {user.userApiKey && <button className="btn btn-square btn-error" onClick={handleDeleteKey} title="Remove API Key"><Trash size={20}/></button>}
                                <button className="btn btn-primary" onClick={handleSaveKey}>Save Key</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* --- Favorite Excuses Section --- */}
            <div>
                <h2 className="text-2xl font-bold mb-4">Your Favorite Excuses</h2>
                <div className="space-y-3">
                    {favoriteExcuses.length > 0 ? (
                        favoriteExcuses.map(excuse => (
                            <div key={excuse._id} className="p-4 bg-base-200/50 rounded-lg shadow">
                                <p className="font-semibold text-base-content">{excuse.scenario}</p>
                                <p className="text-base-content/70 italic">"{excuse.excuseText}"</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-base-content/60 italic">You haven't favorited any excuses yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;