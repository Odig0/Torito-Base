"use client";

import { useState, useEffect, useCallback } from "react";

export const useSupplyBalance = () => {
  const [formattedShares, setFormattedShares] = useState<string>("0");
  const [isLoading, setIsLoading] = useState(true);

  const refetch = useCallback(() => {
    setIsLoading(true);
    // Simulación de carga de balance
    setTimeout(() => {
      // Mock: mostrar un balance de ejemplo
      setFormattedShares("0");
      setIsLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return {
    formattedShares,
    isLoading,
    refetch,
  };
};
