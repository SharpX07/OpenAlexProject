import React from 'react';

interface BoxContainerProps {
    children: React.ReactNode; // Define que BoxContainer recibirá children
}

export const BoxContainer: React.FC<BoxContainerProps> = ({ children }) => {
    return (
        <div className="bg-[#f8f8f7] border border-[#d5bdaf] p-4 rounded-lg ">
            {children} {/* Renderiza los children aquí */}
        </div>
    );
};
