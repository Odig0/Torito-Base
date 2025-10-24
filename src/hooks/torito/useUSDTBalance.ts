"use client";

import { useState, useEffect } from "react";

export const useUSDTBalance = () => {
  const [balance, setBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulación de carga de balance
    setTimeout(() => {
      // Mock: mostrar un balance de ejemplo (1000 USDT)
      setBalance(1000);
      setIsLoading(false);
    }, 500);
  }, []);

  return {
    balance,
    isLoading,
  };
};
