import { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

export default function Toast({ message, onClose }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onClose, 3500);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  const isSuccess = message.type === 'success';

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium ${
      isSuccess ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
    }`}>
      {isSuccess ? <CheckCircle size={18} /> : <XCircle size={18} />}
      <span>{message.text}</span>
      <button onClick={onClose} className="ml-1 opacity-80 hover:opacity-100">
        <X size={16} />
      </button>
    </div>
  );
}
