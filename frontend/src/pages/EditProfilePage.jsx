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
    const [formError, setFormError] = useState({});
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
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
        let error = '';
        if (name === 'name' && (value.length < 2 || value.length > 50)) error = 'Name must be 2-50 characters.';
        if (name === 'bio' && value.length > 300) error = 'Bio must be at most 300 characters.';
        if (name === 'mobile' && value && !/^\+[1-9]\d{1,14}$/.test(value)) error = 'Mobile must be in E.164 format.';
        if ((name === 'github' || name === 'linkedin' || name === 'twitter') && value && !/^https?:\/\//.test(value)) error = 'Must be a valid URL.';
        setFormError(prev => ({ ...prev, [name]: error }));
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
            setPreview(res.data.secure_url); // Ensure preview uses Cloudinary URL
            toast.success('Profile photo uploaded!');
        } catch (err) {
            toast.error('Failed to upload image.');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Check for errors before submit
        if (form.name.length < 2 || form.name.length > 50) { setFormError(prev => ({ ...prev, name: 'Name must be 2-50 characters.' })); return; }
        if (form.bio.length > 300) { setFormError(prev => ({ ...prev, bio: 'Bio must be at most 300 characters.' })); return; }
        if (form.mobile && !/^\+[1-9]\d{1,14}$/.test(form.mobile)) { setFormError(prev => ({ ...prev, mobile: 'Mobile must be in E.164 format.' })); return; }
        if (form.github && !/^https?:\/\//.test(form.github)) { setFormError(prev => ({ ...prev, github: 'Must be a valid URL.' })); return; }
        if (form.linkedin && !/^https?:\/\//.test(form.linkedin)) { setFormError(prev => ({ ...prev, linkedin: 'Must be a valid URL.' })); return; }
        if (form.twitter && !/^https?:\/\//.test(form.twitter)) { setFormError(prev => ({ ...prev, twitter: 'Must be a valid URL.' })); return; }
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            // Omit empty social fields
            const dataToSend = { ...form };
            ['github', 'linkedin', 'twitter'].forEach(key => {
                if (!dataToSend[key]) delete dataToSend[key];
            });
            await axios.put('http://localhost:5000/api/users/profile', dataToSend, { headers: { 'x-auth-token': token } });
            toast.success('Profile updated successfully!');
            navigate('/profile');
        } catch (err) {
            toast.error(err.response?.data?.msg || 'Failed to update profile.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-base-200 via-base-100 to-base-300 px-4 py-12 pt-[64px]">
            <div className="w-full max-w-3xl bg-base-100/80 backdrop-blur-lg shadow-2xl border border-base-300/40 p-8 md:p-12 flex flex-col md:flex-row gap-10 items-center rounded-2xl animate-fade-in">
                {/* Avatar and Upload */}
                <div className="flex flex-col items-center gap-6 w-full md:w-1/3 bg-base-200/80 rounded-2xl p-6">
                    <div className="w-40 h-40 bg-base-200 border-4 border-primary/30 shadow-xl flex items-center justify-center rounded-2xl overflow-hidden">
                        <img
                            src={preview || form.profilePic || DEFAULT_AVATAR}
                            alt="Profile Preview"
                            className="object-cover w-full h-full rounded-2xl"
                        />
                    </div>
                    <label className="btn btn-outline btn-sm w-full flex items-center gap-2 rounded-2xl" htmlFor="profilePicInput">
                        <UploadSimple size={18} />
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
                    <button type="button" className="btn btn-ghost w-full mt-2 rounded-2xl" onClick={() => navigate('/profile')}>
                        ← Back to Profile
                    </button>
                </div>
                {/* Form */}
                <form onSubmit={handleSubmit} className="flex-1 space-y-6 w-full md:w-2/3 bg-base-200/80 rounded-2xl p-6">
                    <h2 className="text-3xl font-bold mb-6 text-center md:text-left">Edit Profile</h2>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text flex items-center gap-2"><User size={18} /> Name</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            className="input input-bordered w-full rounded-2xl"
                            value={form.name}
                            onChange={handleChange}
                            required
                        />
                        {formError.name && <div className="text-error text-xs mt-1">{formError.name}</div>}
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text flex items-center gap-2"><EnvelopeSimple size={18} /> Email</span>
                        </label>
                        <input
                            type="email"
                            name="email"
                            className="input input-bordered w-full rounded-2xl"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text flex items-center gap-2"><Info size={18} /> Bio</span>
                        </label>
                        <textarea
                            name="bio"
                            className="textarea textarea-bordered w-full min-h-[64px] rounded-2xl"
                            value={form.bio}
                            onChange={handleChange}
                            placeholder="Tell us a little about yourself..."
                        />
                        {formError.bio && <div className="text-error text-xs mt-1">{formError.bio}</div>}
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text flex items-center gap-2"><Phone size={18} /> Mobile Number</span>
                        </label>
                        <input
                            type="tel"
                            name="mobile"
                            className="input input-bordered w-full rounded-2xl"
                            value={form.mobile}
                            onChange={handleChange}
                            placeholder="e.g. +1234567890"
                        />
                        {formError.mobile && <div className="text-error text-xs mt-1">{formError.mobile}</div>}
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text flex items-center gap-2"><LinkSimple size={18} /> Social Links</span>
                        </label>
                        <div className="flex flex-col gap-2">
                            <input
                                type="url"
                                name="github"
                                className="input input-bordered w-full rounded-2xl"
                                value={form.github}
                                onChange={handleChange}
                                placeholder="GitHub URL"
                            />
                            <input
                                type="url"
                                name="linkedin"
                                className="input input-bordered w-full rounded-2xl"
                                value={form.linkedin}
                                onChange={handleChange}
                                placeholder="LinkedIn URL"
                            />
                            <input
                                type="url"
                                name="twitter"
                                className="input input-bordered w-full rounded-2xl"
                                value={form.twitter}
                                onChange={handleChange}
                                placeholder="Twitter URL"
                            />
                        </div>
                        {formError.github && <div className="text-error text-xs mt-1">{formError.github}</div>}
                        {formError.linkedin && <div className="text-error text-xs mt-1">{formError.linkedin}</div>}
                        {formError.twitter && <div className="text-error text-xs mt-1">{formError.twitter}</div>}
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text flex items-center gap-2"><Sparkle size={18} /> Smart Preferences</span>
                        </label>
                        <div className="flex flex-col md:flex-row gap-4">
                            <select
                                name="tone"
                                className="select select-bordered w-full md:w-1/3 rounded-2xl"
                                value={form.smartPreferences.tone}
                                onChange={handleSmartPrefChange}
                            >
                                <option value="friendly">Friendly</option>
                                <option value="formal">Formal</option>
                                <option value="casual">Casual</option>
                                <option value="humorous">Humorous</option>
                                <option value="apologetic">Apologetic</option>
                                <option value="assertive">Assertive</option>
                            </select>
                            <select
                                name="length"
                                className="select select-bordered w-full md:w-1/3 rounded-2xl"
                                value={form.smartPreferences.length}
                                onChange={handleSmartPrefChange}
                            >
                                <option value="short">Short</option>
                                <option value="medium">Medium</option>
                                <option value="long">Long</option>
                            </select>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="humor"
                                    checked={form.smartPreferences.humor}
                                    onChange={handleSmartPrefChange}
                                    className="checkbox checkbox-primary rounded-2xl"
                                />
                                <span>Humor</span>
                            </label>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary w-full mt-4 text-lg rounded-2xl flex items-center gap-2" disabled={loading}>
                        <FloppyDisk size={20} />
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditProfilePage; 