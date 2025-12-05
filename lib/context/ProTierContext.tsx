'use client';

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface ProTierContextType {
  isPro: boolean;
  upgradeToPro: () => void;
  downgradeToFree: () => void;
  showUpgradeModal: boolean;
  setShowUpgradeModal: (show: boolean) => void;
  showConfetti: boolean;
}

const ProTierContext = createContext<ProTierContextType | undefined>(undefined);

interface ProTierProviderProps {
  children: ReactNode;
}

export function ProTierProvider({ children }: ProTierProviderProps) {
  const [isPro, setIsPro] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const upgradeToPro = useCallback(() => {
    setIsPro(true);
    setShowUpgradeModal(false);
    setShowConfetti(true);

    // Hide confetti after animation
    setTimeout(() => {
      setShowConfetti(false);
    }, 3000);
  }, []);

  const downgradeToFree = useCallback(() => {
    setIsPro(false);
  }, []);

  return (
    <ProTierContext.Provider
      value={{
        isPro,
        upgradeToPro,
        downgradeToFree,
        showUpgradeModal,
        setShowUpgradeModal,
        showConfetti,
      }}
    >
      {children}
    </ProTierContext.Provider>
  );
}

export function useProTier() {
  const context = useContext(ProTierContext);
  if (context === undefined) {
    throw new Error('useProTier must be used within a ProTierProvider');
  }
  return context;
}
