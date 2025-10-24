"use client";

import { useBalance, useAccount } from "wagmi";

export const useUSDTBalance = () => {
  const { address } = useAccount();

  // Por ahora usamos el balance nativo de ETH
  // TODO: Cambiar a token USDT cuando esté disponible
  const { data, isLoading } = useBalance({
    address: address,
  });

  // ETH tiene 18 decimales, lo convertimos a número
  // Mostraremos el balance en ETH como si fuera USDT por ahora
  const balance = data ? parseFloat(data.formatted) : 0;

  return {
    balance,
    isLoading,
  };
};
