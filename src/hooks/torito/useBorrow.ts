"use client";

import { useState } from "react";

export const useBorrow = () => {
  const [isBorrowing, setIsBorrowing] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const borrow = async (
    collateralToken: string,
    borrowFiat: string,
    fiatCurrency: string
  ): Promise<void> => {
    setIsBorrowing(true);
    setError(null);
    setIsConfirmed(false);
    
    try {
      // Simulación de préstamo
      console.log("Solicitud de préstamo:", {
        collateralToken,
        borrowFiat,
        fiatCurrency,
      });
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsConfirmed(true);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsBorrowing(false);
    }
  };

  return {
    borrow,
    isBorrowing,
    isConfirmed,
    error,
  };
};
