"use client";

import React, { useState, useCallback } from "react";
import { Check, X, AlertTriangle, HelpCircle, Info } from "lucide-react";

type ModalType = "success" | "error" | "warning" | "info" | "confirm";

interface ModalState {
  show: boolean;
  type: ModalType;
  title: string;
  message: string;
  onConfirm?: () => void;
}

const INITIAL: ModalState = { show: false, type: "info", title: "", message: "" };

export function useModal() {
  const [modal, setModal] = useState<ModalState>(INITIAL);

  const showAlert = useCallback((type: "success" | "error" | "warning" | "info", title: string, message: string) => {
    setModal({ show: true, type, title, message });
  }, []);

  const showConfirm = useCallback((title: string, message: string, onConfirm: () => void) => {
    setModal({ show: true, type: "confirm", title, message, onConfirm });
  }, []);

  const close = useCallback(() => setModal(INITIAL), []);

  return { modal, showAlert, showConfirm, closeModal: close };
}

interface CustomModalProps {
  show: boolean;
  type: ModalType;
  title: string;
  message: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  onClose: () => void;
}

export default function CustomModal({ show, type, title, message, onConfirm, onCancel, onClose }: CustomModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200] flex items-center justify-center p-4" onClick={type !== "confirm" ? onClose : undefined}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="pt-8 pb-2 px-6 flex flex-col items-center">
          <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${
            type === "success" ? "bg-green-50" :
            type === "error" ? "bg-red-50" :
            type === "warning" ? "bg-amber-50" :
            type === "confirm" ? "bg-blue-50" :
            "bg-gray-50"
          }`}>
            {type === "success" && <Check size={28} className="text-green-600" />}
            {type === "error" && <X size={28} className="text-red-600" />}
            {type === "warning" && <AlertTriangle size={28} className="text-amber-600" />}
            {type === "confirm" && <HelpCircle size={28} className="text-blue-600" />}
            {type === "info" && <Info size={28} className="text-gray-600" />}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 text-center">{title}</h3>
        </div>
        <div className="px-6 pb-6 pt-2">
          <p className="text-sm text-gray-600 text-center leading-relaxed whitespace-pre-line">{message}</p>
        </div>
        <div className={`px-6 pb-6 ${type === "confirm" ? "grid grid-cols-2 gap-3" : "flex justify-center"}`}>
          {type === "confirm" ? (
            <>
              <button onClick={onCancel || onClose} className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors">
                Cancelar
              </button>
              <button onClick={onConfirm} className="px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors">
                Confirmar
              </button>
            </>
          ) : (
            <button onClick={onClose} className={`px-6 py-2.5 rounded-xl text-sm font-medium text-white transition-colors ${
              type === "success" ? "bg-green-600 hover:bg-green-700" :
              type === "error" ? "bg-red-600 hover:bg-red-700" :
              type === "warning" ? "bg-amber-600 hover:bg-amber-700" :
              "bg-gray-600 hover:bg-gray-700"
            }`}>
              OK
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
