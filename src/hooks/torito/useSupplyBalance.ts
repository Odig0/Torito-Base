"use client";

import { useState, useEffect } from "react";

export const useSupplyBalance = () => {
  const [formattedShares, setFormattedShares] = useState<string>("0");
  const [isLoading, setIsLoading] = useState(true);

  const refetch = () => {
    setIsLoading(true);
    // Simulación de carga de balance
    setTimeout(() => {
      // Mock: mostrar un balance de ejemplo
      setFormattedShares("0");
      setIsLoading(false);
    }, 500);
  };

  useEffect(() => {
    refetch();
  }, []);

  return {
    formattedShares,
    isLoading,
    refetch,
  };
};
