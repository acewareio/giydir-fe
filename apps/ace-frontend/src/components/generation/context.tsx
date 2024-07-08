"use client"
import { Models } from '@/constants/seed';
import React, { createContext, Dispatch, SetStateAction, useContext, useState } from 'react';

interface StepsContextType {
    currentStep: number;
    setCurrentStep: Dispatch<SetStateAction<number>>;
    setData: Dispatch<SetStateAction<StepsContextType['data'] | undefined>>
    data: {
        photoImage?: string,
        product?: Models['product'][],
    } | undefined
}

type StepsProviderProps = {
    children: React.ReactNode;
};


const StepsContext = createContext<StepsContextType | undefined>(undefined);

export const useSteps = () => {
    const context = useContext(StepsContext);
    if (!context) {
        throw new Error('useSteps hook must be used within a StepsProvider');
    }
    return context;
};

export const StepsProvider: React.FC<StepsProviderProps> = ({ children }) => {
    const [currentStep, setCurrentStep ] = useState<StepsContextType['currentStep']>(1)
    const [ data, setData ] = useState<StepsContextType['data']>()

    const stepsContextValue: StepsContextType = {
        currentStep,
        setCurrentStep,
        data,
        setData
    };

    return (
        <StepsContext.Provider value={stepsContextValue}>
            {children}
        </StepsContext.Provider>
    );
};
