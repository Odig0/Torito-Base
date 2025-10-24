"use client";

import { useEffect, useState } from "react";
import { CheckCircleIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import Footer from "src/components/Footer";
import { ONCHAINKIT_LINK } from "src/links";
import OnchainkitSvg from "src/svg/OnchainkitSvg";
import { useAccount } from "wagmi";
import LoginButton from "../components/LoginButton";
import SignupButton from "../components/SignupButton";
import { DepositBorrowCalculator } from "../components/torito/AmountRow";
import { BalancePill } from "../components/torito/BalancePill";
import { BorrowModal } from "../components/torito/BorrowModal";
import { CountrySelect } from "../components/torito/CountrySelect";
import { useDeposit } from "../hooks/torito/useDeposit";
import { useSupply } from "../hooks/torito/useSupply";
import { useSupplyBalance } from "../hooks/torito/useSupplyBalance";
import { useUSDTBalance } from "../hooks/torito/useUSDTBalance";
import { fmt } from "../utils/number";

export default function Page() {
  const { address } = useAccount();
  const { countryId, setCountryId, country, usdt, setUsdt, usdtNum, localAmount, loanAmount } = useDeposit();
  const { supply, approve, needsApproval, isSupplying, isConfirmed, error: supplyError } = useSupply();
  const { formattedShares, isLoading: isLoadingBalance, refetch: refetchBalance } = useSupplyBalance();
  const { balance: walletUsdtBalance, isLoading: isLoadingUsdtBalance } = useUSDTBalance();

  const [alert, setAlert] = useState<null | { type: "success" | "error"; text: string }>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Validation logic
  const validateUSDTInput = (value: string): string | null => {
    if (!value || value.trim() === "") {
      return "Ingresa un monto de USDT";
    }

    const numValue = Number(value);

    if (isNaN(numValue)) {
      return "Debe ser un número válido";
    }

    if (numValue <= 0) {
      return "El monto debe ser mayor a 0";
    }

    if (numValue > walletUsdtBalance && walletUsdtBalance > 0) {
      return `No tienes suficiente USDT (tienes ${fmt(walletUsdtBalance)})`;
    }

    // Check for too many decimal places (USDT has 6 decimals max)
    const decimalParts = value.split(".");
    if (decimalParts.length > 1 && decimalParts[1].length > 6) {
      return "Máximo 6 decimales permitidos";
    }

    return null;
  };

  // Validate on USDT change
  useEffect(() => {
    if (usdt) {
      const error = validateUSDTInput(usdt);
      setValidationError(error);
    } else {
      setValidationError(null);
    }
  }, [usdt, walletUsdtBalance]);

  const isValidInput = !validationError && usdt && usdtNum > 0;

  // Efecto para manejar confirmaciones de transacción
  useEffect(() => {
    if (isConfirmed) {
      setAlert({
        type: "success",
        text: "¡Depósito confirmado exitosamente en la blockchain!",
      });
      refetchBalance();
      setTimeout(() => setAlert(null), 5000);
    }
  }, [isConfirmed, refetchBalance]);

  // Efecto para manejar errores de transacción
  useEffect(() => {
    if (supplyError) {
      setAlert({
        type: "error",
        text: "Error en la transacción. Verifica tu saldo de USDT y allowance.",
      });
    }
  }, [supplyError]);

  const onSend = async () => {
    const validationErr = validateUSDTInput(usdt);
    if (validationErr || !isValidInput || isSupplying) {
      if (validationErr) {
        setAlert({
          type: "error",
          text: validationErr,
        });
      }
      return;
    }

    try {
      setAlert(null);
      setValidationError(null);

      if (needsApproval(usdt)) {
        await approve(usdt);
        setAlert(null);
      }
      await supply(usdt);
      setUsdt("");
    } catch (error) {
      console.error("Error en supply:", error);
      setAlert({
        type: "error",
        text: "No se pudo enviar la transacción. Verifica tu conexión y saldo.",
      });
    }
  };

  return (
    <div className="flex h-full w-full max-w-full flex-col px-1">
      {/* Header - mantener el original */}
      <section className="mt-6 mb-6 flex w-full flex-col md:flex-row max-w-4xl mx-auto">
        <div className="flex w-full flex-row items-center justify-between gap-2 md:gap-0">
          <a href={ONCHAINKIT_LINK} title="onchainkit" target="_blank" rel="noreferrer">
            <OnchainkitSvg />
          </a>
          <div className="flex items-center gap-3">
            <SignupButton />
            {!address && <LoginButton />}
          </div>
        </div>
      </section>

      {/* Contenido principal de Torito */}
      <section className="flex items-center flex-col flex-grow pt-10 w-full min-h-screen bg-gray-50">
        <div className="px-5 flex flex-col gap-6 items-center w-full">
          <h1 className="text-center max-w-4xl leading-tight">
            <span className="block text-5xl md:text-6xl font-extrabold text-gray-800">
              Deposita dólares,
              <br className="hidden md:block" /> préstate el 50%
              <br />
              en moneda local
            </span>
          </h1>

          <div className="flex gap-4 flex-wrap justify-center">
            <BalancePill
              label={<>💰 Tu USDT:</>}
              value={isLoadingUsdtBalance ? undefined : `${fmt(walletUsdtBalance)} USDT`}
              skeleton={isLoadingUsdtBalance}
            />
            <BalancePill
              label={
                <>
                  <span style={{ display: "inline-block", transform: "scaleX(-1)" }}>🐂</span> En Torito:
                </>
              }
              value={isLoadingBalance ? undefined : `${fmt(parseFloat(formattedShares), "es-BO", 6)} USDT`}
              skeleton={isLoadingBalance}
            />
          </div>
        </div>

        <div className="w-full max-w-4xl mt-8 px-5">
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10 border-2 border-gray-100">
            {alert && (
              <div
                className={`mb-6 rounded-2xl border-2 px-5 py-4 flex items-center gap-3 ${
                  alert.type === "success"
                    ? "bg-green-50 border-green-200 text-green-800"
                    : "bg-red-50 border-red-200 text-red-800"
                }`}
              >
                {alert.type === "success" ? (
                  <CheckCircleIcon className="h-6 w-6 flex-shrink-0" />
                ) : (
                  <ExclamationTriangleIcon className="h-6 w-6 flex-shrink-0" />
                )}
                <span className="text-sm font-medium">{alert.text}</span>
                <button
                  type="button"
                  onClick={() => setAlert(null)}
                  className="ml-auto text-xl hover:opacity-70 transition-opacity"
                >
                  ✕
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-3">🌍 Tu País</label>
                <CountrySelect countryId={countryId} onSelect={setCountryId} formatRate={n => fmt(n)} />
              </div>
              <div className="flex flex-col justify-end">
                <label className="block text-sm font-bold text-gray-800 mb-3">💱 Tipo de Cambio</label>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl px-5 py-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-800">
                      1 USDT = {country.symbol} {fmt(country.rate)}
                    </div>
                    <div className="text-sm text-blue-600 mt-1">{country.code} • Actualizado al instante</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <DepositBorrowCalculator
                usdt={usdt}
                setUsdt={setUsdt}
                country={country}
                formattedLocal={fmt(localAmount)}
                loanAmount={loanAmount}
                fmt={fmt}
                validationError={validationError}
              />
            </div>

            <div className="flex flex-col items-center space-y-4">
              <button
                type="button"
                onClick={onSend}
                disabled={!isValidInput || isSupplying}
                className={`w-full max-w-md rounded-2xl px-8 py-4 font-bold text-lg shadow-lg transition-all duration-200 transform ${
                  isValidInput && !isSupplying
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-green-200 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed shadow-gray-100"
                }`}
              >
                {isSupplying ? (
                  <div className="flex items-center justify-center">
                    <span className="loading loading-spinner loading-md mr-3" />
                    Procesando...
                  </div>
                ) : isValidInput && needsApproval(usdt) ? (
                  "🔐 Aprobar y Depositar USDT"
                ) : isValidInput ? (
                  "💰 Depositar USDT"
                ) : validationError ? (
                  "Corrige los errores"
                ) : (
                  "Ingresa un monto para continuar"
                )}
              </button>

              {isValidInput && !isSupplying && (
                <div className="text-center space-y-1">
                  <div className="text-sm text-gray-600">⚡ Depósito rápido y seguro</div>
                  <div className="text-xs text-gray-500">Tu transacción será confirmada en la blockchain</div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="h-10" />
      </section>

      {/* Botón flotante de préstamo en la esquina inferior izquierda */}
      <div className="fixed bottom-8 left-8 z-40">
        <BorrowModal />
      </div>

      <Footer />
    </div>
  );
}
