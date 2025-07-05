import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { User, EnvelopeSimple, Image, FloppyDisk, Info, LinkSimple, Phone, UploadSimple, GithubLogo, LinkedinLogo, TwitterLogo, Sparkle } from 'phosphor-react';

const DEFAULT_AVATAR = 'https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff&size=128';
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

const EditProfilePage = () => {
    const [form, setForm] = useState({
        name: '', email: '', profilePic: '', bio: '', mobile: '', github: '', linkedin: '', twitter: '',
        smartPreferences: { tone: 'friendly', length: 'medium', humor: false }
    });
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/users/profile', { headers: { 'x-auth-token': token } });
                setForm({
                    name: res.data.user.name || '',
                    email: res.data.user.email || '',
                    profilePic: res.data.user.profilePic || '',
                    bio: res.data.user.bio || '',
                    mobile: res.data.user.mobile || '',
                    github: res.data.user.github || '',
                    linkedin: res.data.user.linkedin || '',
                    twitter: res.data.user.twitter || '',
                    smartPreferences: res.data.user.smartPreferences || { tone: 'friendly', length: 'medium', humor: false }
                });
                setPreview(res.data.user.profilePic || '');
            } catch (err) {
                toast.error('Failed to load profile.');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSmartPrefChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({
            ...form,
            smartPreferences: {
                ...form.smartPreferences,
                [name]: type === 'checkbox' ? checked : value
            }
        });
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        try {
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(file);
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
            const res = await axios.post(
                `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
                formData
            );
            setForm(f => ({ ...f, profilePic: res.data.secure_url }));
            toast.success('Profile photo uploaded!');
        } catch (err) {
            toast.error('Failed to upload image.');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            await axios.put('http://localhost:5000/api/users/profile', {
                name: form.name,
                email: form.email,
                profilePic: form.profilePic,
                bio: form.bio,
                mobile: form.mobile,
                github: form.github,
                linkedin: form.linkedin,
                twitter: form.twitter,
                smartPreferences: form.smartPreferences
            }, { headers: { 'x-auth-token': token } });
            toast.success('Profile updated successfully!');
            navigate('/profile');
        } catch (err) {
            toast.error(err.response?.data?.msg || 'Failed to update profile.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-100 px-4 py-12">
            <div className="w-full max-w-lg bg-base-200/80 rounded-2xl shadow-xl p-8 border border-base-300/40">
                <h2 className="text-3xl font-bold mb-8 text-center">Edit Profile</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex flex-col items-center gap-4 mb-6">
                        <div className="avatar placeholder">
                            <div className="w-24 h-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden">
                                <img
                                    src={preview || form.profilePic || DEFAULT_AVATAR}
                                    alt="Profile Preview"
                                    className="object-cover w-full h-full"
                                />
                            </div>
                        </div>
                        <label className="btn btn-sm btn-outline flex items-center gap-2 cursor-pointer" htmlFor="profilePicInput">
                            <UploadSimple size={16} />
                            {uploading ? 'Uploading...' : 'Change Photo'}
                            <input
                                id="profilePicInput"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageChange}
                                disabled={uploading}
                            />
                        </label>
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text flex items-center gap-2"><User size={16} /> Name</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            className="input input-bordered w-full"
                            value={form.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text flex items-center gap-2"><EnvelopeSimple size={16} /> Email</span>
                        </label>
                        <input
                            type="email"
                            name="email"
                            className="input input-bordered w-full"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text flex items-center gap-2"><Info size={16} /> Bio</span>
                        </label>
                        <textarea
                            name="bio"
                            className="textarea textarea-bordered w-full min-h-[64px]"
                            value={form.bio}
                            onChange={handleChange}
                            placeholder="Tell us a little about yourself..."
                        />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text flex items-center gap-2"><Phone size={16} /> Mobile Number</span>
                        </label>
                        <input
                            type="tel"
                            name="mobile"
                            className="input input-bordered w-full"
                            value={form.mobile}
                            onChange={handleChange}
                            placeholder="e.g. +1234567890"
                        />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text flex items-center gap-2"><GithubLogo size={16} /> GitHub</span>
                        </label>
                        <input
                            type="url"
                            name="github"
                            className="input input-bordered w-full"
                            value={form.github}
                            onChange={handleChange}
                            placeholder="https://github.com/your-username"
                        />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text flex items-center gap-2"><LinkedinLogo size={16} /> LinkedIn</span>
                        </label>
                        <input
                            type="url"
                            name="linkedin"
                            className="input input-bordered w-full"
                            value={form.linkedin}
                            onChange={handleChange}
                            placeholder="https://linkedin.com/in/your-profile"
                        />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text flex items-center gap-2"><TwitterLogo size={16} /> Twitter</span>
                        </label>
                        <input
                            type="url"
                            name="twitter"
                            className="input input-bordered w-full"
                            value={form.twitter}
                            onChange={handleChange}
                            placeholder="https://twitter.com/your-handle"
                        />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text flex items-center gap-2"><Sparkle size={16} /> Smart Preferences</span>
                        </label>
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-3">
                                <span className="w-24">Tone</span>
                                <select
                                    name="tone"
                                    className="select select-bordered select-sm w-full"
                                    value={form.smartPreferences.tone}
                                    onChange={handleSmartPrefChange}
                                >
                                    <option value="friendly">Friendly</option>
                                    <option value="formal">Formal</option>
                                    <option value="witty">Witty</option>
                                    <option value="serious">Serious</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="w-24">Length</span>
                                <select
                                    name="length"
                                    className="select select-bordered select-sm w-full"
                                    value={form.smartPreferences.length}
                                    onChange={handleSmartPrefChange}
                                >
                                    <option value="short">Short</option>
                                    <option value="medium">Medium</option>
                                    <option value="long">Long</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="w-24">Humor</span>
                                <input
                                    type="checkbox"
                                    name="humor"
                                    className="toggle toggle-primary"
                                    checked={form.smartPreferences.humor}
                                    onChange={handleSmartPrefChange}
                                />
                                <span>{form.smartPreferences.humor ? 'Enabled' : 'Disabled'}</span>
                            </div>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary w-full flex items-center gap-2 text-lg font-semibold"
                        disabled={loading}
                    >
                        <FloppyDisk size={18} />
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditProfilePage; 