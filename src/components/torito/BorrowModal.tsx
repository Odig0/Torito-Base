"use client";

import { useEffect, useState } from "react";
import { useChainId } from "wagmi";
import { ArrowUpTrayIcon, BanknotesIcon, BuildingLibraryIcon, QrCodeIcon } from "@heroicons/react/24/outline";
import { COUNTRIES, DEFAULT_COUNTRY_ID } from "../../constants/countries";
import { useBorrow } from "../../hooks/torito/useBorrow";
import { useSupplyBalance } from "../../hooks/torito/useSupplyBalance";
import { getUSDTAddress } from "../../utils/networkConfig";

type DestType = "bank" | "qr";

const BOLIVIAN_BANKS = [
  "Banco Mercantil Santa Cruz",
  "Banco Ganadero",
  "Banco Nacional de Bolivia",
  "Banco Bisa",
  "Banco Sol",
  "Banco Unión",
  "Banco Económico",
  "Banco Fassil",
  "Banco Fortaleza",
  "Banco FIE",
  "Banco Pyme",
  "Banco de Crédito de Bolivia",
] as const;

export const BorrowModal = () => {
  return <BorrowModalInner />;
};

const BorrowModalInner = () => {
  const [loanOpen, setLoanOpen] = useState(false);
  const [resultOpen, setResultOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [amountBs, setAmountBs] = useState<string>("");
  const [destType, setDestType] = useState<DestType>("bank");

  const [bankName, setBankName] = useState("");
  const [bankAccount, setBankAccount] = useState("");

  const [qrFile, setQrFile] = useState<File | null>(null);
  const [qrText, setQrText] = useState("");

  // Hooks para blockchain
  const chainId = useChainId();
  const { borrow, isBorrowing, isConfirmed, error: borrowError } = useBorrow();
  const usdtAddress = getUSDTAddress(chainId);

  // Obtener el balance del usuario de Torito
  const { formattedShares, isLoading: isLoadingBalance } = useSupplyBalance();

  // Obtener información del país para el cálculo
  const country = COUNTRIES.find(c => c.id === DEFAULT_COUNTRY_ID)!;

  // Calcular el préstamo máximo basado en el saldo de Torito
  const usdtBalance = parseFloat(formattedShares || "0");
  const localBalance = usdtBalance * country.rate;
  const maxLoanAmount = usdtBalance > 0 ? localBalance * 0.5 : 0;

  const available = maxLoanAmount;
  const amountNum = Number(amountBs || 0);

  const canSubmit =
    amountNum > 0 &&
    amountNum <= maxLoanAmount &&
    (destType === "bank"
      ? bankName.trim().length > 0 && bankAccount.trim().length > 0
      : qrFile !== null || qrText.trim().length > 0);

  const fmt = (n: number) => new Intl.NumberFormat("es-BO", { maximumFractionDigits: 2 }).format(n);

  useEffect(() => {
    if (isConfirmed && !loading) {
      openResultAndReset();
      setAmountBs("");
      setBankName("");
      setBankAccount("");
      setQrFile(null);
      setQrText("");
    }
  }, [isConfirmed, loading]);

  useEffect(() => {
    if (borrowError) {
      setLoading(false);
    }
  }, [borrowError]);

  const openResultAndReset = () => {
    setLoanOpen(false);
    setTimeout(() => setResultOpen(true), 150);
  };

  const solicitarPrestamo = async () => {
    if (!canSubmit || isBorrowing) return;

    try {
      setLoading(true);
      const amountFiat = parseFloat(amountBs);

      await borrow(usdtAddress, amountFiat.toString(), country.code);
    } catch (e) {
      setLoading(false);
      console.error("Error al solicitar préstamo:", e);
    }
  };

  const onChangeAmount = (v: string) => {
    let clean = v.replace(/[^0-9.]/g, "");
    const parts = clean.split(".");
    if (parts.length > 2) {
      clean = parts[0] + "." + parts.slice(1).join("");
    }

    if (clean === "" || clean === ".") {
      setAmountBs(clean);
      return;
    }

    const n = Number(clean);
    if (n >= maxLoanAmount) {
      setAmountBs(String(maxLoanAmount));
    } else {
      setAmountBs(clean);
    }
  };

  return (
    <>
      <button
        onClick={() => setLoanOpen(true)}
        className="group relative bg-blue-500 hover:bg-blue-600 active:bg-blue-800 text-white px-6 py-2 rounded-2xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 min-w-[140px] justify-center"
      >
        <BanknotesIcon className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
        <span className="text-base">Prestarme</span>
      </button>

      {/* Modal de préstamo */}
      {loanOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 relative">
              <button
                onClick={() => setLoanOpen(false)}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
              >
                ✕
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                  <BanknotesIcon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold m-0">Préstamo</h3>
              </div>

              <p className="text-gray-600 mb-4">
                {isLoadingBalance ? (
                  "Cargando tu saldo..."
                ) : usdtBalance > 0 ? (
                  <>
                    Puedes prestarte hasta{" "}
                    <strong>
                      {fmt(maxLoanAmount)} {country.symbol}
                    </strong>{" "}
                    con tu saldo actual.
                  </>
                ) : (
                  "Deposita USDT en Torito para poder solicitar préstamos."
                )}
              </p>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">¿Cuánto quieres solicitar?</label>
                <div className="relative">
                  <input
                    inputMode="decimal"
                    value={amountBs}
                    onChange={e => onChangeAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-4 pr-20 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-600 font-medium">
                    {country.symbol}
                  </div>
                </div>
                <div className="mt-1 text-sm text-gray-500">
                  {isLoadingBalance ? (
                    "Cargando..."
                  ) : (
                    <>
                      Disponible:{" "}
                      <strong>
                        {fmt(available)} {country.symbol}
                      </strong>
                    </>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ¿Dónde quieres recibir el dinero?
                </label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => setDestType("bank")}
                    className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-left transition-colors ${
                      destType === "bank"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <BuildingLibraryIcon className="h-5 w-5" />
                    <div className="leading-tight">
                      <div className="font-medium text-sm">Cuenta bancaria</div>
                      <div className="text-xs text-gray-500">Depósito a tu cuenta local</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDestType("qr")}
                    className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-left transition-colors ${
                      destType === "qr"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <QrCodeIcon className="h-5 w-5" />
                    <div className="leading-tight">
                      <div className="font-medium text-sm">Importar QR</div>
                      <div className="text-xs text-gray-500">Envía a una cuenta por QR</div>
                    </div>
                  </button>
                </div>

                {destType === "bank" ? (
                  <div className="space-y-3">
                    <select
                      value={bankName}
                      onChange={e => setBankName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Selecciona tu banco</option>
                      {BOLIVIAN_BANKS.map(bank => (
                        <option key={bank} value={bank}>
                          {bank}
                        </option>
                      ))}
                    </select>
                    <input
                      value={bankAccount}
                      onChange={e => setBankAccount(e.target.value.replace(/[^\d\-]/g, ""))}
                      placeholder="Número de cuenta"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <label className="flex items-center justify-between rounded-xl border border-dashed border-gray-300 px-4 py-3 bg-gray-50 cursor-pointer hover:bg-gray-100">
                      <span className="flex items-center gap-2 text-gray-700 text-sm">
                        <ArrowUpTrayIcon className="h-5 w-5" />
                        {qrFile ? (
                          <span className="truncate max-w-[220px]">{qrFile.name}</span>
                        ) : (
                          <span>Subir imagen del QR (PNG/JPG)</span>
                        )}
                      </span>
                      <input
                        type="file"
                        accept="image/png, image/jpeg"
                        className="hidden"
                        onChange={e => setQrFile(e.target.files?.[0] ?? null)}
                      />
                    </label>

                    <textarea
                      value={qrText}
                      onChange={e => setQrText(e.target.value)}
                      placeholder="Pega aquí los datos del QR (opcional)"
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                    <p className="text-xs text-gray-500">
                      Puedes subir el QR o pegar sus datos. Con uno de los dos es suficiente.
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-5">
                <button
                  onClick={solicitarPrestamo}
                  disabled={!canSubmit || loading || isBorrowing}
                  className={`w-full px-8 py-4 rounded-2xl font-bold text-lg shadow-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                    canSubmit && !loading && !isBorrowing
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {loading || isBorrowing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Procesando...</span>
                    </>
                  ) : (
                    <>
                      <BanknotesIcon className="h-5 w-5" />
                      <span>Solicitar préstamo</span>
                    </>
                  )}
                </button>
                {!canSubmit && (
                  <p className="mt-2 text-xs text-gray-500 text-center">
                    Ingresa un monto válido y el destino para continuar.
                  </p>
                )}
                {borrowError && <p className="mt-2 text-xs text-red-500 text-center">Error: {borrowError.message}</p>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de resultado */}
      {resultOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4">
            <div className="p-6 relative">
              <button
                onClick={() => setResultOpen(false)}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
              >
                ✕
              </button>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                    <BanknotesIcon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold m-0">Solicitud en proceso</h3>
                </div>

                <p className="text-gray-600">
                  Tu solicitud está en proceso. Te notificaremos a tu correo cuando el dinero haya sido enviado.
                </p>

                <button
                  onClick={() => setResultOpen(false)}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg transition-all duration-200"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
