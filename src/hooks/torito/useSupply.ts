"use client";

import { useState } from "react";

export const useSupply = () => {
  const [isSupplying, setIsSupplying] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const needsApproval = (amount: string): boolean => {
    // Mock: para propósitos visuales, simular que siempre se necesita aprobación
    return parseFloat(amount) > 0;
  };

  const approve = async (amount: string): Promise<void> => {
    setIsSupplying(true);
    setError(null);
    try {
      // Simulación de aprobación
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Aprobación mock completada para:", amount);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsSupplying(false);
    }
  };

  const supply = async (amount: string): Promise<void> => {
    setIsSupplying(true);
    setError(null);
    setIsConfirmed(false);
    try {
      // Simulación de suministro
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log("Suministro mock completado para:", amount);
      setIsConfirmed(true);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsSupplying(false);
    }
  };

  return {
    supply,
    approve,
    needsApproval,
    isSupplying,
    isConfirmed,
    error,
  };
};
