import { useState } from 'react';
import AddProductModal from './components/AddProductModal';
import ProductDetailModal from './components/ProductDetailModal';
import SecureImg from './components/SecureImg'; // <-- Importamos nuestro escudo

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [equipoSeleccionado, setEquipoSeleccionado] = useState(null);
  const [equipoAEditar, setEquipoAEditar] = useState(null);
  
  // NUEVO: Estado para el buscador
  const [busquedaSN, setBusquedaSN] = useState('');

  const [equipos, setEquipos] = useState([
    { 
      id: 1, 
      modelo: 'HP 840 G3', 
      sn: '98H9H034H', 
      estado: 'Óptimo',
      ubicacion: '2F', 
      imagen: '', // Ahora los equipos tienen campo imagen
      especificaciones: { "Procesador": "i5", "RAM": "16GB" } 
    }
  ]);

  // NUEVO: Filtramos la lista de equipos en vivo según lo que se escriba en el buscador
  const equiposFiltrados = equipos.filter((producto) => 
    producto.sn.toLowerCase().includes(busquedaSN.toLowerCase())
  );

  const guardarEquipo = (equipoGuardado) => {
    if (equipoGuardado.id) {
      setEquipos(equipos.map(e => e.id === equipoGuardado.id ? equipoGuardado : e));
    } else {
      const equipoConId = { ...equipoGuardado, id: Date.now() };
      setEquipos([...equipos, equipoConId]);
    }
    setIsModalOpen(false); 
    setEquipoAEditar(null);
  };

  const borrarEquipo = (id) => {
    setEquipos(equipos.filter(e => e.id !== id));
    setEquipoSeleccionado(null);
  };

  const abrirEdicion = (producto) => {
    setEquipoSeleccionado(null);
    setEquipoAEditar(producto);
    setIsModalOpen(true);
  };

  const abrirCreacion = () => {
    setEquipoAEditar(null);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-full">
      <nav className="bg-gray-800/50">{/* ... Navbar se queda igual ... */}</nav>

      <header className="relative bg-gray-800 after:pointer-events-none after:absolute after:inset-x-0 after:inset-y-0 after:border-y after:border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-bold tracking-tight text-white truncate">Inventario</h1>
          </div>
          
          <div className="flex-1 flex justify-center px-4">
            <div className="w-full max-w-md relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg className="size-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
              </div>
              {/* NUEVO: Conectamos el input al estado de busqueda */}
              <input 
                type="search" 
                value={busquedaSN}
                onChange={(e) => setBusquedaSN(e.target.value)}
                placeholder="Buscar por S/N..." 
                className="block w-full rounded-full border-0 bg-gray-900/30 py-1.5 pl-10 pr-3 text-gray-300 placeholder:text-gray-500 ring-1 ring-inset ring-white/10 focus:bg-gray-900/60 focus:ring-2 focus:ring-indigo-500 sm:text-sm/6 transition-all outline-none" 
              />
            </div>
          </div>
          
          <div className="flex-1 flex justify-end">
            <button onClick={abrirCreacion} type="button" className="inline-flex items-center gap-1.5 rounded-md bg-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 transition-all shrink-0">
              Añadir Producto
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* NUEVO: Dibujamos 'equiposFiltrados' en lugar de todos los 'equipos' */}
          {equiposFiltrados.map((producto) => (
            <div key={producto.id} onClick={() => setEquipoSeleccionado(producto)} className="group relative flex flex-col bg-white rounded-3xl p-3 sm:p-4 shadow-sm ring-1 ring-slate-200/60 hover:shadow-xl hover:ring-slate-300 transition-all duration-300 cursor-pointer overflow-hidden">
              <div className="relative aspect-[4/3] w-full bg-slate-50 rounded-2xl overflow-hidden mb-4 p-4">
                {/* ... Badge de estado ... */}
                <div className={`absolute top-3 left-3 flex items-center gap-1.5 bg-white/80 backdrop-blur-sm border text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm z-10 ${producto.estado === 'Óptimo' ? 'border-green-200 text-green-700' : 'border-amber-200 text-amber-700'}`}>
                  {producto.estado}
                </div>
                
                {/* NUEVO: Usamos SecureImg */}
                <SecureImg src={producto.imagen} alt={producto.modelo} className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110" />
              </div>
              
              {/* ... Resto de la info de la tarjeta (se queda igual) ... */}
              <div className="flex flex-col flex-1 px-2 pb-1">
                <h3 className="text-lg font-bold text-slate-900 mb-2 leading-tight group-hover:text-indigo-600 transition-colors">{producto.modelo}</h3>
                {producto.especificaciones && Object.keys(producto.especificaciones).length > 0 && (
                  <div className="mb-4 space-y-1.5">
                    {Object.entries(producto.especificaciones).map(([clave, valor]) => (
                      <div key={clave} className="flex justify-between items-center text-xs">
                        <span className="text-slate-500 font-medium">{clave}</span>
                        <span className="text-slate-700 font-semibold truncate ml-2 bg-slate-100 px-2 py-0.5 rounded-md">{valor}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="mt-auto flex items-center justify-between pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-1.5 rounded-md">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">S/N:</span>
                    <code className="text-xs font-bold text-slate-700">{producto.sn}</code>
                  </div>
                  {producto.ubicacion && <span className="text-xs font-bold text-red-500">{producto.ubicacion}</span>}
                </div>
              </div>
            </div>
          ))}

          {/* Mensaje por si la búsqueda no encuentra nada */}
          {equiposFiltrados.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-500">
              No se encontraron equipos con ese S/N.
            </div>
          )}
        </div>
      </main>

      <AddProductModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEquipoAEditar(null); }} onEquipoGuardado={guardarEquipo} equipoAEditar={equipoAEditar} />
      <ProductDetailModal isOpen={equipoSeleccionado !== null} producto={equipoSeleccionado} onClose={() => setEquipoSeleccionado(null)} onEdit={abrirEdicion} onDelete={borrarEquipo} />
    </div>
  );
}

export default App;