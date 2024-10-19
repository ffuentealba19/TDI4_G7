
import React from 'react';

interface PopupProps {
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

const Popup: React.FC<PopupProps> = ({ onClose, title, children }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-4">
                <h2 className="font-bold text-lg">{title}</h2>
                <div>{children}</div>
                <button onClick={onClose} className="mt-4 bg-red-500 text-white rounded px-4 py-2">Cerrar</button>
            </div>
        </div>
    );
};

export default Popup;
