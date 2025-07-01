import React from 'react';

const ExcuseChoices = ({ choices, onSelect }) => {
    return (
        <div className="p-4 bg-base-200 rounded-lg my-2 animate-fade-in">
            <h3 className="font-bold mb-3 text-center">Here are a few options. Pick the best one:</h3>
            <div className="flex flex-col gap-3">
                {choices.map((choice, index) => (
                    <div 
                        key={index} 
                        className="p-3 bg-base-100 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer flex justify-between items-center"
                        onClick={() => onSelect(choice)}
                    >
                        <span className="flex-1 pr-4">{index + 1}. {choice}</span>
                        <button className="btn btn-sm btn-primary">Select</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ExcuseChoices;