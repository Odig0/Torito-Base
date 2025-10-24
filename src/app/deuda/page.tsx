"use client";

import { useState } from "react";
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  BanknotesIcon,
  CreditCardIcon,
  DocumentTextIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import Footer from "src/components/Footer";
import ToritoSvg from "src/svg/ToritoSvg";
import { useAccount } from "wagmi";
import LoginButton from "../../components/LoginButton";
import SignupButton from "../../components/SignupButton";
import { fmt } from "../../utils/number";

export default function DeudaPage() {
  const { address } = useAccount();
  const [alert, setAlert] = useState<null | { type: "success" | "error"; text: string }>(null);
  const [showQRUpload, setShowQRUpload] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock data - reemplazar con hooks reales
  const totalDebt = 500; // USDT
  const debtInLocal = 6000; // Bs
  const totalPaid = 200; // USDT
  const remainingDebt = totalDebt - totalPaid;
  const nextPaymentDate = "15 Nov 2025";
  const interestRate = 5; // %
  const loanHistory = [
    { date: "20 Oct 2025", amount: 100, type: "Pago", status: "Completado" },
    { date: "15 Oct 2025", amount: 100, type: "Pago", status: "Completado" },
    { date: "01 Oct 2025", amount: 500, type: "Préstamo", status: "Aprobado" },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleQRSubmit = async () => {
    if (!selectedFile) {
      setAlert({
        type: "error",
        text: "Por favor selecciona una imagen del comprobante QR",
      });
      return;
    }

    setIsProcessing(true);
    setAlert(null);

    // Simular procesamiento de QR
    setTimeout(() => {
      setIsProcessing(false);
      setShowQRUpload(false);
      setSelectedFile(null);
      setAlert({
        type: "success",
        text: "¡Comprobante enviado! Tu pago será verificado en 24-48 horas.",
      });
    }, 2000);
  };

  return (
    <div className="flex h-full w-full flex-col">
      {/* Header - Torito */}
      <section className="mt-6 mb-6 flex w-full flex-col md:flex-row max-w-7xl mx-auto px-6">
        <div className="flex w-full flex-row items-center justify-between gap-2 md:gap-0">
          <div className="cursor-pointer">
            <ToritoSvg />
          </div>
          <div className="flex items-center gap-3">
            <SignupButton />
            {!address && <LoginButton />}
          </div>
        </div>
      </section>

      {/* Dashboard */}
      <section className="flex items-center flex-col flex-grow w-full min-h-screen bg-gray-50 pb-20">
        <div className="w-full max-w-7xl px-6">
          {/* Botón volver */}
          <div className="flex justify-start mb-6">
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors font-medium"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              Volver al inicio
            </Link>
          </div>

          {/* Título */}
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-2">
            Dashboard de Préstamos
          </h1>
          <p className="text-gray-600 mb-8">Gestiona y paga tu deuda de forma sencilla</p>

          {/* Alertas */}
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

          {/* Cards principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Card 1: Deuda Total */}
            <div className="bg-white rounded-3xl shadow-lg p-6 border-2 border-gray-100 hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-red-100 rounded-full">
                  <BanknotesIcon className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-sm font-bold text-gray-600">Deuda Restante</h3>
              </div>
              <div className="text-3xl font-extrabold text-red-600 mb-1">{fmt(remainingDebt)} USDT</div>
              <div className="text-sm text-gray-500">≈ {fmt(remainingDebt * 12)} Bs</div>
            </div>

            {/* Card 2: Total Pagado */}
            <div className="bg-white rounded-3xl shadow-lg p-6 border-2 border-gray-100 hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <CheckCircleIcon className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-sm font-bold text-gray-600">Total Pagado</h3>
              </div>
              <div className="text-3xl font-extrabold text-green-600 mb-1">{fmt(totalPaid)} USDT</div>
              <div className="text-sm text-gray-500">De {fmt(totalDebt)} USDT</div>
            </div>

            {/* Card 3: Próximo Pago */}
            <div className="bg-white rounded-3xl shadow-lg p-6 border-2 border-gray-100 hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <ClockIcon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-sm font-bold text-gray-600">Próximo Pago</h3>
              </div>
              <div className="text-2xl font-extrabold text-blue-600 mb-1">{nextPaymentDate}</div>
              <div className="text-sm text-gray-500">Fecha límite</div>
            </div>

            {/* Card 4: Tasa de Interés */}
            <div className="bg-white rounded-3xl shadow-lg p-6 border-2 border-gray-100 hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-purple-100 rounded-full">
                  <DocumentTextIcon className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-sm font-bold text-gray-600">Tasa de Interés</h3>
              </div>
              <div className="text-3xl font-extrabold text-purple-600 mb-1">{interestRate}%</div>
              <div className="text-sm text-gray-500">Anual</div>
            </div>
          </div>

          {/* Sección de Pago con QR */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Card: Pagar con QR */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-indigo-100 rounded-full">
                  <PhotoIcon className="h-8 w-8 text-indigo-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Pagar con QR</h2>
              </div>
              <p className="text-gray-600 mb-6">
                Realiza tu pago a través de transferencia bancaria y sube el comprobante QR para verificación.
              </p>

              {!showQRUpload ? (
                <button
                  type="button"
                  onClick={() => setShowQRUpload(true)}
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-4 rounded-2xl shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  📸 Subir comprobante QR
                </button>
              ) : (
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 hover:border-indigo-400 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="qr-upload"
                    />
                    <label
                      htmlFor="qr-upload"
                      className="cursor-pointer flex flex-col items-center justify-center"
                    >
                      <PhotoIcon className="h-16 w-16 text-gray-400 mb-3" />
                      <span className="text-sm font-medium text-gray-600">
                        {selectedFile ? selectedFile.name : "Haz clic para seleccionar imagen"}
                      </span>
                    </label>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowQRUpload(false);
                        setSelectedFile(null);
                      }}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 rounded-2xl transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={handleQRSubmit}
                      disabled={!selectedFile || isProcessing}
                      className={`flex-1 font-bold py-3 rounded-2xl transition-all ${
                        selectedFile && !isProcessing
                          ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      {isProcessing ? "Enviando..." : "Enviar"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Card: Información de pago */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl shadow-xl p-8 border-2 border-blue-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-100 rounded-full">
                  <CreditCardIcon className="h-8 w-8 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-blue-900">Datos para transferencia</h2>
              </div>
              <div className="space-y-4">
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="text-sm text-gray-600 mb-1">Banco</div>
                  <div className="text-lg font-bold text-gray-800">Banco Nacional de Bolivia</div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="text-sm text-gray-600 mb-1">Número de cuenta</div>
                  <div className="text-lg font-bold text-gray-800">1234-5678-9012-3456</div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="text-sm text-gray-600 mb-1">Beneficiario</div>
                  <div className="text-lg font-bold text-gray-800">Torito Finance</div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="text-sm text-gray-600 mb-1">Concepto</div>
                  <div className="text-lg font-bold text-gray-800">Pago préstamo #{address?.slice(0, 8)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Historial de transacciones */}
          <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">📜 Historial de transacciones</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-4 px-4 font-bold text-gray-600">Fecha</th>
                    <th className="text-left py-4 px-4 font-bold text-gray-600">Tipo</th>
                    <th className="text-left py-4 px-4 font-bold text-gray-600">Monto</th>
                    <th className="text-left py-4 px-4 font-bold text-gray-600">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {loanHistory.map((item, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4 text-gray-700">{item.date}</td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            item.type === "Pago"
                              ? "bg-green-100 text-green-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {item.type}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-bold text-gray-800">{fmt(item.amount)} USDT</td>
                      <td className="py-4 px-4">
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
