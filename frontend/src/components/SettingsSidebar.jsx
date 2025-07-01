import React from 'react';
import { useTranslation } from 'react-i18next'; // Import the hook

const SettingsSidebar = ({ settings, onSettingsChange }) => {
  const { context, urgency, language } = settings;

   const { t } = useTranslation(); // Use the hook
  const handleChange = (e) => {
    onSettingsChange({
      ...settings,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="card bg-base-200 shadow-xl" style={{ height: 'calc(80vh)' }}>
      <h2 className="card-title p-4 border-b border-base-300">Run Settings</h2>
      <div className="p-4 space-y-4">
        <div>
          <label className="label">
            <span className="label-text text-neutral/70">Context</span>
          </label>
          <select name="context" value={context} onChange={handleChange} className="select select-bordered w-full bg-base-300">
            <option value="social">Social</option>
            <option value="work">Work</option>
            <option value="school">School</option>
            <option value="family">Family</option>
          </select>
        </div>
        <div>
          <label className="label">
            <span className="label-text text-neutral/70">Urgency</span>
          </label>
          <select name="urgency" value={urgency} onChange={handleChange} className="select select-bordered w-full bg-base-300">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div>
          <label className="label">
            <span className="label-text text-neutral/70">Language</span>
          </label>
          <select name="language" value={language} onChange={handleChange} className="select select-bordered w-full bg-base-300">
            <option value="English">English</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default SettingsSidebar;