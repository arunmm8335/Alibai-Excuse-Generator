import React from 'react';
import { EnvelopeSimple, Phone, GithubLogo, LinkedinLogo, TwitterLogo } from 'phosphor-react';
import myProfilePic from '../assets/profile-arun.jpg'; // --- 1. IMPORT YOUR IMAGE ---

// A helper component for the contact links
const ContactLink = ({ icon, href, children }) => (
    <a href={href} className="flex items-center gap-3 text-base-content/80 hover:text-primary transition-colors">
        <span className="flex-shrink-0">{icon}</span>
        <span>{children}</span>
    </a>
);

// A helper for social media icons
const SocialIcon = ({ href, title, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-base-content/60 hover:text-primary transition-colors" title={title}>
        {children}
    </a>
);

const ContactPage = () => {
    return (
        <div className="max-w-4xl mx-auto py-12 px-4 animate-fade-in">
            <h1 className="text-4xl font-bold text-center mb-16">Contact & About the Creator</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

                {/* --- LEFT SIDE: Meet the Creator --- */}
                <div className="flex flex-col items-center md:items-start text-center md:text-left">
                    <img 
                        // IMPORTANT: Replace this with a URL to your photo
                        // You can upload your photo to a site like Imgur to get a link
                        src={myProfilePic}
                        alt="Arun M" 
                        className="w-40 h-40 rounded-full object-cover shadow-2xl mb-6 border-4 border-base-300"
                    />
                    <h2 className="text-3xl font-bold">Arun M</h2>
                    <p className="text-primary font-semibold mb-4">The Developer of Alibai</p>
                    <p className="text-base-content/80 mb-6">
                        A passionate full-stack developer with a love for creating intelligent, user-friendly applications. Alibai was built as a major project to showcase modern AI integration, robust backend architecture, and a polished frontend user experience.
                    </p>
                    <div className="flex gap-5">
                        <SocialIcon href="https://github.com/your-username" title="GitHub"><GithubLogo size={28} /></SocialIcon>
                        <SocialIcon href="https://linkedin.com/in/your-profile" title="LinkedIn"><LinkedinLogo size={28} /></SocialIcon>
                        <SocialIcon href="https://twitter.com/your-handle" title="Twitter"><TwitterLogo size={28} /></SocialIcon>
                    </div>
                </div>

                {/* --- RIGHT SIDE: Get in Touch --- */}
                <div className="card bg-base-200 p-8 shadow-xl">
                    <h3 className="text-2xl font-bold mb-6">Get In Touch</h3>
                    <div className="space-y-5">
                        <ContactLink href="mailto:arunmyageri1916@gmail.com" icon={<EnvelopeSimple size={24} weight="duotone" />}>
                            arunmyageri1916@gmail.com
                        </ContactLink>
                        <ContactLink href="tel:+918062181856" icon={<Phone size={24} weight="duotone" />}>
                            +91 80621 81856
                        </ContactLink>
                        <div className="divider my-4"></div>
                        <div className="flex items-start gap-3">
                           <span className="flex-shrink-0 text-primary">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                           </span>
                           <div>
                                <p className="font-semibold">Location</p>
                                <p className="text-base-content/70">Raichuru, KA</p>
                           </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;