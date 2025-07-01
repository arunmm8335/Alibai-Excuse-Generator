import React from 'react';

const SkeletonCard = () => {
    return (
        <li className="p-3 bg-base-300 rounded-lg flex justify-between items-center animate-pulse">
            <div className="flex-grow space-y-2">
                {/* Placeholder for the main title line */}
                <div className="h-4 bg-base-content/10 rounded w-3/4"></div>
                {/* Placeholder for the description line */}
                <div className="h-3 bg-base-content/10 rounded w-full"></div>
            </div>
            {/* Placeholder for the delete button */}
            <div className="w-6 h-6 bg-base-content/10 rounded-full ml-2"></div>
        </li>
    );
};

export default SkeletonCard;