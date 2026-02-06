import React, { useEffect } from "react";
import { X, AlertCircle, CheckCircle, Info } from "lucide-react";

const Toast = ({ id, message, type = "info", duration = 4000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const getStyles = () => {
    switch (type) {
      case "error":
        return {
          bg: "bg-red-900/90",
          border: "border-red-700",
          icon: <AlertCircle size={20} className="text-red-400" />,
        };
      case "success":
        return {
          bg: "bg-green-900/90",
          border: "border-green-700",
          icon: <CheckCircle size={20} className="text-green-400" />,
        };
      case "warning":
        return {
          bg: "bg-yellow-900/90",
          border: "border-yellow-700",
          icon: <AlertCircle size={20} className="text-yellow-400" />,
        };
      default:
        return {
          bg: "bg-blue-900/90",
          border: "border-blue-700",
          icon: <Info size={20} className="text-blue-400" />,
        };
    }
  };

  const styles = getStyles();

  return (
    <div
      className={`${styles.bg} border ${styles.border} backdrop-blur-sm rounded-lg p-4 flex items-center gap-3 text-white max-w-md animate-in fade-in slide-in-from-top-2 duration-300`}
    >
      {styles.icon}
      <p className="flex-1 text-sm font-medium">{message}</p>
      <button
        onClick={() => onClose(id)}
        className="text-gray-300 hover:text-white transition-colors"
      >
        <X size={18} />
      </button>
    </div>
  );
};

export default Toast;
