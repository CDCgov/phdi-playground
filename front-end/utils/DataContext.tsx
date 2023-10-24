'use client'
import { createContext, useContext, ReactNode, useState } from 'react';

interface DataContextValue {
    data: any; // You can define a specific data type here
    setData: (data: any) => void;
}

const DataContext = createContext<DataContextValue | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
    const [data, setData] = useState<any | null>(null);

    return (
        <DataContext.Provider value={{ data, setData }}>
            {children}
        </DataContext.Provider>
    );
}

export function useData() {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
}
