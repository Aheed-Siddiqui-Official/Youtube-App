import React, { useState, useCallback } from "react";
import Toast from "./Toast";

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback(
    (message, type = "info", duration = 4000) => {
      const id = Date.now();
      setToasts((prev) => [...prev, { id, message, type, duration }]);
      return id;
    },
    []
  );

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return { toasts, showToast, removeToast };
};

const ToastContainer = ({ toasts, onRemoveToast }) => {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast
            id={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={onRemoveToast}
          />
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
