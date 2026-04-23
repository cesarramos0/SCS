import SecureImg from './SecureImg';

export default function ProductDetailModal({ isOpen, producto, onClose, onEdit, onDelete }) {
  if (!isOpen || !producto) return null;

  return (
    <div className="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-gray-900/75 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
          
          <div className="relative transform overflow-hidden rounded-3xl bg-white text-left shadow-2xl transition-all sm:my-8 w-full max-w-3xl border border-slate-100 flex flex-col md:flex-row">
            
            <button onClick={onClose} className="absolute top-4 right-4 z-20 rounded-full bg-white/80 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all backdrop-blur-md">
              <svg className="size-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            {/* COLUMNA IZQUIERDA: Imagen y Botones */}
            <div className="md:w-2/5 bg-slate-50 p-6 flex flex-col items-center border-b md:border-b-0 md:border-r border-slate-100">
              <div className="relative w-full aspect-square rounded-2xl bg-white shadow-sm ring-1 ring-slate-900/5 flex items-center justify-center p-4 mb-6">
                 
                {producto.emoji ? (
                  <div className="w-full h-full flex items-center justify-center text-9xl select-none">
                    {producto.emoji}
                  </div>
                ) : (
                  <SecureImg src={producto.imagen} alt={producto.modelo} className="w-full h-full object-contain" />
                )}

              </div>
              
              <div className="flex w-full gap-3 mt-auto">
                <button onClick={() => onDelete(producto.id)} className="flex-1 rounded-lg border border-red-200 bg-red-50 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-100 transition-colors shadow-sm">
                  Borrar
                </button>
                <button onClick={() => onEdit(producto)} className="flex-1 rounded-lg border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
                  Editar
                </button>
              </div>
            </div>

            {/* COLUMNA DERECHA: Información */}
            <div className="md:w-3/5 p-6 sm:p-8 flex flex-col">
              
              <div className="mb-8 pr-8">
                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-3
                  ${producto.estado === 'Óptimo' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                  <span className={`size-1.5 rounded-full ${producto.estado === 'Óptimo' ? 'bg-green-500' : 'bg-amber-500'} animate-pulse`}></span>
                  {producto.estado}
                </div>
                <h2 className="text-3xl font-black text-slate-900 leading-tight">{producto.modelo}</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <div className="flex flex-col border-b sm:border-b-0 border-slate-100 pb-3 sm:pb-0">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nombre / Modelo</span>
                  <span className="text-base font-medium text-slate-800 mt-1">{producto.modelo}</span>
                </div>
                
                <div className="flex flex-col border-b sm:border-b-0 border-slate-100 pb-3 sm:pb-0">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Identificador (S/N)</span>
                  <code className="text-base font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md self-start mt-1">{producto.sn}</code>
                </div>

                {producto.ubicacion && (
                  <div className="flex flex-col border-b sm:border-b-0 border-slate-100 pb-3 sm:pb-0 sm:col-span-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ubicación</span>
                    <span className="text-lg font-bold text-red-500 mt-1">{producto.ubicacion}</span>
                  </div>
                )}
              </div>

              <div className="mt-auto">
                <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <svg className="size-4 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" /></svg>
                  Características
                </h3>
                
                {producto.especificaciones && Object.keys(producto.especificaciones).length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl ring-1 ring-slate-100">
                    {Object.entries(producto.especificaciones).map(([clave, valor]) => (
                      <div key={clave} className="flex flex-col bg-white p-2.5 rounded-lg shadow-sm border border-slate-100">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{clave}</span>
                        <span className="text-sm font-semibold text-slate-700">{valor}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-slate-500 italic bg-slate-50 p-4 rounded-xl border border-dashed border-slate-200 text-center">
                    No hay características adicionales registradas.
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}