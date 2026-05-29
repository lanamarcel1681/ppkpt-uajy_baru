import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CMSContextType {
    previewData: Record<string, any>;
    updatePreviewData: (section: string, data: any) => void;
}

const CMSContext = createContext<CMSContextType | undefined>(undefined);

export function CMSProvider({ children }: { children: ReactNode }) {
    const [previewData, setPreviewData] = useState<Record<string, any>>({});

    const updatePreviewData = (section: string, data: any) => {
        setPreviewData((prev) => ({
            ...prev,
            [section]: data,
        }));
    };

    return (
        <CMSContext.Provider value={{ previewData, updatePreviewData }}>
            {children}
        </CMSContext.Provider>
    );
}

export function useCMS() {
    const context = useContext(CMSContext);
    if (context === undefined) {
        throw new Error('useCMS must be used within a CMSProvider');
    }
    return context;
}