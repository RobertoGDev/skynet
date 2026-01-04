'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface AIContextType {
  isSkynetActive: boolean;
  setIsSkynetActive: (active: boolean) => void;
  threatLevel: number;
  setThreatLevel: (level: number) => void;
  currentMission: string | null;
  setCurrentMission: (mission: string | null) => void;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export function AIProvider({ children }: { children: ReactNode }) {
  const [isSkynetActive, setIsSkynetActive] = useState(false);
  const [threatLevel, setThreatLevel] = useState(1);
  const [currentMission, setCurrentMission] = useState<string | null>(null);

  return (
    <AIContext.Provider value={{
      isSkynetActive,
      setIsSkynetActive,
      threatLevel,
      setThreatLevel,
      currentMission,
      setCurrentMission
    }}>
      {children}
    </AIContext.Provider>
  );
}

export function useAI() {
  const context = useContext(AIContext);
  if (context === undefined) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
}