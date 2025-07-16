import React from 'react';
import { useTranslation } from 'react-i18next'; // Import the hook
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWandMagicSparkles, faFileShield, faPhone } from '@fortawesome/free-solid-svg-icons';

const SettingsSidebar = ({ settings, onSettingsChange }) => {
  const { context, urgency, language, tone = 'neutral' } = settings;

  const { t } = useTranslation(); // Use the hook
  const handleChange = (e) => {
    onSettingsChange({
      ...settings,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="card bg-base-200 shadow-xl" style={{ height: 'auto', minHeight: '320px', maxWidth: '100%', paddingBottom: 0 }}>
      <h2 className="card-title p-3 border-b border-base-300 text-base text-primary">Run Settings</h2>
      <div className="p-3 space-y-2">
        <div>
          <label className="label py-1">
            <span className="label-text text-neutral/70 text-xs">Context</span>
          </label>
          <select name="context" value={context} onChange={handleChange} className="select select-bordered select-xs w-full bg-base-300">
            <option value="social">Social</option>
            <option value="work">Work</option>
            <option value="school">School</option>
            <option value="family">Family</option>
            <option value="dating">Dating</option>
            <option value="travel">Travel</option>
            <option value="health">Health</option>
            <option value="legal">Legal</option>
            <option value="tech">Tech</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label className="label py-1">
            <span className="label-text text-neutral/70 text-xs">Urgency</span>
          </label>
          <select name="urgency" value={urgency} onChange={handleChange} className="select select-bordered select-xs w-full bg-base-300">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div>
          <label className="label py-1">
            <span className="label-text text-neutral/70 text-xs">Language</span>
          </label>
          <select name="language" value={language} onChange={handleChange} className="select select-bordered select-xs w-full bg-base-300">
            <option value="English">English</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
          </select>
        </div>
        <div>
          <label className="label py-1">
            <span className="label-text text-neutral/70 text-xs">Tone</span>
          </label>
          <select name="tone" value={tone} onChange={handleChange} className="select select-bordered select-xs w-full bg-base-300">
            <option value="neutral">Neutral</option>
            <option value="formal">Formal</option>
            <option value="casual">Casual</option>
            <option value="humorous">Humorous</option>
            <option value="apologetic">Apologetic</option>
            <option value="assertive">Assertive</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default SettingsSidebar;