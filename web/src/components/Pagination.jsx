import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ page, totalPages, totalElements, size, onPageChange }) {
  if (totalPages <= 1) return null;

  const from = page * size + 1;
  const to = Math.min((page + 1) * size, totalElements);

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t bg-gray-50 rounded-b-lg">
      <span className="text-sm text-gray-600">
        Mostrando {from}–{to} de {totalElements} registros
      </span>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 0}
          className="flex items-center gap-1 px-3 py-1.5 text-sm border rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={16} />
          Anterior
        </button>
        <span className="text-sm text-gray-700 px-2">
          Página {page + 1} de {totalPages}
        </span>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages - 1}
          className="flex items-center gap-1 px-3 py-1.5 text-sm border rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Siguiente
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
