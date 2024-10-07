import React from 'react';

interface BoxContainerProps {
    background_color?: string;
    border_color?: string;
    children: React.ReactNode; // Define que BoxContainer recibirá children
}

export const BoxContainer: React.FC<BoxContainerProps> = ({ children = null, background_color = 'f8f8f7', border_color = 'd5bdaf' }) => {
    return (
        <div className={`max-h-[100%] p-4 rounded-lg shadow-md`} style={{ backgroundColor: `#${background_color}`, borderColor: `#${border_color}`, borderWidth: '1px', borderStyle: 'solid' }}>
            {children} {/* Renderiza los children aquí */}
        </div>
    );
};
