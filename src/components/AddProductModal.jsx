import { useState, useEffect } from 'react';

export default function AddProductModal({ isOpen, onClose, onEquipoGuardado, equipoAEditar }) {

  const initialState = {
    modelo: '',
    sn: '',
    ubicacion: '',
    estado: 'Óptimo',
    especificaciones: {},
    imagen:''
  };

  const [formData, setFormData] = useState(initialState);
  const [nuevaCarac, setNuevaCarac] = useState({ clave: '', valor: '' });

  useEffect(() => {
    if (equipoAEditar) {
      setFormData(equipoAEditar);
    } else {
      setFormData(initialState);
    }
  }, [equipoAEditar, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAñadirEspecificacion = () => {
    if (!nuevaCarac.clave.trim() || !nuevaCarac.valor.trim()) return;
    setFormData({
      ...formData,
      especificaciones: {
        ...formData.especificaciones,
        [nuevaCarac.clave]: nuevaCarac.valor 
      }
    });
    setNuevaCarac({ clave: '', valor: '' });
  };

  const handleBorrarEspecificacion = (claveAborrar) => {
    const nuevasEspecificaciones = { ...formData.especificaciones };
    delete nuevasEspecificaciones[claveAborrar]; 
    setFormData({ ...formData, especificaciones: nuevasEspecificaciones });
  };

  const handleSubmit = (e) => {
    e.preventDefault(); 
    onEquipoGuardado(formData);
    setNuevaCarac({ clave: '', valor: '' });
  };

  return (
    <div className="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-gray-900/75 backdrop-blur-sm transition-opacity"></div>
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform flex flex-col max-h-[90vh] overflow-hidden rounded-3xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg border border-slate-100">
            
            <div className="shrink-0 bg-slate-50 px-4 py-4 sm:px-6 border-b border-slate-100 flex items-center justify-between">

              <h3 className="text-lg font-bold leading-6 text-slate-900">
                {equipoAEditar ? 'Editar Equipo' : 'Registrar Nuevo Producto'}
              </h3>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-500 transition-colors">
                 <svg className="size-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto px-4 py-5 sm:p-6 space-y-5">
                
                {/* CAMPOS FIJOS */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700">Modelo del Producto</label>
                  <input type="text" name="modelo" value={formData.modelo} onChange={handleChange} required className="mt-1 w-full rounded-lg border-0 py-2 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm outline-none" placeholder="Ej: HP 840 G3" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700">URL de la Imagen (Opcional)</label>
                  <input 
                    type="url" 
                    name="imagen" 
                    value={formData.imagen} 
                    onChange={handleChange} 
                    className="mt-1 w-full rounded-lg border-0 py-2 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm outline-none placeholder:text-slate-400" 
                    placeholder="https://ejemplo.com/foto.jpg" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700">S/N</label>
                    <input type="text" name="sn" value={formData.sn} onChange={handleChange} required className="mt-1 w-full rounded-lg border-0 py-2 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm outline-none" placeholder="Ej: 98H9H034H" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700">Ubicación</label>
                    <input type="text" name="ubicacion" value={formData.ubicacion} onChange={handleChange} className="mt-1 w-full rounded-lg border-0 py-2 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm outline-none" placeholder="Ej: 2F, Armario B" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700">Estado</label>
                  <select name="estado" value={formData.estado} onChange={handleChange} className="mt-1 w-full rounded-lg border-0 py-2 pl-3 pr-10 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm outline-none">
                    <option value="Óptimo">Óptimo</option>
                    <option value="En reparación">En reparación</option>
                    <option value="Asignado">Asignado</option>
                    <option value="De baja">De baja</option>
                  </select>
                </div>

                <hr className="border-slate-100" />

                {/* CAMPOS DINÁMICOS */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Especificaciones Extra (Opcional)</label>
                  
                  {Object.keys(formData.especificaciones).length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {Object.entries(formData.especificaciones).map(([clave, valor]) => (
                        <span key={clave} className="inline-flex items-center gap-1.5 rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
                          <span className="font-bold">{clave}:</span> {valor}
                          <button type="button" onClick={() => handleBorrarEspecificacion(clave)} className="hover:text-indigo-900 ml-1">
                            <svg className="size-3" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-end gap-2">
                    <div className="flex-1">
                      <input type="text" placeholder="Atributo (Ej: CPU)" value={nuevaCarac.clave} onChange={(e) => setNuevaCarac({ ...nuevaCarac, clave: e.target.value })} className="w-full rounded-lg border-0 py-2 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm outline-none" />
                    </div>
                    <div className="flex-1">
                      <input type="text" placeholder="Valor (Ej: i5 8th Gen)" value={nuevaCarac.valor} onChange={(e) => setNuevaCarac({ ...nuevaCarac, valor: e.target.value })} className="w-full rounded-lg border-0 py-2 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm outline-none" />
                    </div>
                    <button type="button" onClick={handleAñadirEspecificacion} className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-200 transition-colors">
                      Añadir
                    </button>
                  </div>
                </div>

              </div>

              <div className="shrink-0 bg-slate-50 px-4 py-4 sm:flex sm:flex-row-reverse sm:px-6 border-t border-slate-100">
                <button type="submit" className="inline-flex w-full justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto transition-all">
                  Guardar Producto
                </button>
                <button onClick={onClose} type="button" className="mt-3 inline-flex w-full justify-center rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 sm:mt-0 sm:w-auto transition-all">
                  Cancelar
                </button>
              </div>
            </form>
            
          </div>
        </div>
      </div>
    </div>
  );
}