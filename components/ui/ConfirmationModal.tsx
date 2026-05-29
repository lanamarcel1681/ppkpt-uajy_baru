import React from "react";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isDestructive?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Hapus",
    cancelText = "Batal",
    isDestructive = true,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md relative animate-in fade-in zoom-in duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X size={24} />
                </button>

                <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className={`p-3 rounded-full ${isDestructive ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                            <AlertTriangle size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                    </div>

                    <p className="text-gray-600 mb-6">{message}</p>

                    <div className="flex justify-end gap-3 font-semibold">
                        <button
                            onClick={onClose}
                            className="px-5 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                            className={`px-5 py-2.5 text-white rounded-xl transition-colors shadow-sm ${isDestructive
                                    ? 'bg-red-600 hover:bg-red-700 shadow-red-200'
                                    : 'bg-[#245399] hover:bg-[#1a3d73] shadow-blue-200'
                                }`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
