import { useState } from 'react';
import AddProductModal from './components/AddProductModal';
import ProductDetailModal from './components/ProductDetailModal';
import SecureImg from './components/SecureImg';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [productoAEditar, setProductoAEditar] = useState(null);
  
  const [textoBusqueda, setTextoBusqueda] = useState('');
  const [criterioBusqueda, setCriterioBusqueda] = useState('sn'); 

  const [productos, setProductos] = useState([
    { 
      id: 1, 
      modelo: 'HP 840 G3', 
      sn: '98H9H034H', 
      estado: 'Óptimo',
      ubicacion: '2F', 
      imagen: '',
      especificaciones: { "Procesador": "i5", "RAM": "16GB" } 
    }
  ]);

  const productosFiltrados = productos.filter((producto) => {
    const texto = textoBusqueda.toLowerCase();
    if (!texto) return true;

    switch (criterioBusqueda) {
      case 'sn':
        return (producto.sn || '').toLowerCase().includes(texto);
      case 'modelo':
        return (producto.modelo || '').toLowerCase().includes(texto);
      case 'ubicacion':
        return (producto.ubicacion || '').toLowerCase().includes(texto);
      default:
        return true;
    }
  });

  const guardarProducto = (productoGuardado) => {
    if (productoGuardado.id) {
      setProductos(productos.map(e => e.id === productoGuardado.id ? productoGuardado : e));
    } else {
      const productoConId = { ...productoGuardado, id: Date.now() };
      setProductos([...productos, productoConId]);
    }
    setIsModalOpen(false); 
    setProductoAEditar(null);
  };

  const borrarProducto = (id) => {
    setProductos(productos.filter(e => e.id !== id));
    setProductoSeleccionado(null);
  };

  const abrirEdicion = (producto) => {
    setProductoSeleccionado(null);
    setProductoAEditar(producto);
    setIsModalOpen(true);
  };

  const abrirCreacion = () => {
    setProductoAEditar(null);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-full">
      <nav className="bg-gray-800/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex shrink-0 items-center">
              <img src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500" alt="Your Company" className="size-8" />
            </div>
            <div className="flex items-center space-x-4">
              <a href="#" className="rounded-md bg-gray-950/50 px-3 py-2 text-sm font-medium text-white">Inventario</a>
              <a href="#" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white">Estadísticas</a>
            </div>
          </div>
        </div>
      </nav>

      {/* CABECERA REDISEÑADA PARA SER 100% RESPONSIVE */}
      <header className="relative bg-gray-800 after:pointer-events-none after:absolute after:inset-x-0 after:inset-y-0 after:border-y after:border-white/10">
        <div className="mx-auto flex max-w-7xl items-center gap-3 sm:gap-6 px-4 py-4 sm:py-6 sm:px-6 lg:px-8">
          
          {/* TÍTULO: Oculto en móviles para dar 100% de prioridad al buscador */}
          <div className="shrink-0 hidden sm:block">
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white truncate">Inventario</h1>
          </div>
          
          {/* BUSCADOR: Se traga todo el espacio libre (flex-1) */}
          <div className="flex-1 flex justify-center sm:justify-start lg:justify-center min-w-0">
            <div className="w-full max-w-2xl flex gap-1.5 sm:gap-2">
              
              <select 
                value={criterioBusqueda}
                onChange={(e) => setCriterioBusqueda(e.target.value)}
                className="block w-24 sm:w-32 shrink-0 rounded-full border-0 bg-gray-900/30 py-1.5 pl-3 sm:pl-4 pr-8 text-xs sm:text-sm font-medium text-gray-300 ring-1 ring-inset ring-white/10 focus:bg-gray-900/60 focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer transition-all appearance-none"
                style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 0.5rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em` }}
              >
                <option value="sn" className="bg-gray-800">S/N</option>
                <option value="modelo" className="bg-gray-800">Nombre</option>
                <option value="ubicacion" className="bg-gray-800">Ubicación</option>
              </select>

              <div className="relative flex-1 min-w-0">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg className="size-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
                </div>
                <input 
                  type="search" 
                  value={textoBusqueda}
                  onChange={(e) => setTextoBusqueda(e.target.value)}
                  placeholder={`Buscar por ${criterioBusqueda === 'sn' ? 'S/N' : criterioBusqueda === 'modelo' ? 'Nombre' : 'Ubicación'}...`} 
                  className="block w-full rounded-full border-0 bg-gray-900/30 py-1.5 pl-9 sm:pl-10 pr-3 text-sm text-gray-300 placeholder:text-gray-500 ring-1 ring-inset ring-white/10 focus:bg-gray-900/60 focus:ring-2 focus:ring-indigo-500 transition-all outline-none truncate" 
                />
              </div>
            </div>
          </div>
          
          {/* BOTÓN: Encoge a un círculo en móvil (size-10) y se expande en pantallas grandes */}
          <div className="shrink-0 flex justify-end">
            <button onClick={abrirCreacion} type="button" className="inline-flex items-center justify-center rounded-full sm:rounded-md bg-indigo-500 size-10 sm:size-auto sm:px-4 sm:py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 transition-all shrink-0">
              <svg className="size-5 sm:size-4 sm:-ml-0.5 sm:mr-1.5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              {/* Este texto desaparece en pantallas pequeñas */}
              <span className="hidden sm:inline">Añadir Producto</span>
            </button>
          </div>
          
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {productosFiltrados.map((producto) => (
            <div key={producto.id} onClick={() => setProductoSeleccionado(producto)} className="group relative flex flex-col bg-white rounded-3xl p-3 sm:p-4 shadow-sm ring-1 ring-slate-200/60 hover:shadow-xl hover:ring-slate-300 transition-all duration-300 cursor-pointer overflow-hidden">
              <div className="relative aspect-[4/3] w-full bg-slate-50 rounded-2xl overflow-hidden mb-4 p-4">
                <div className={`absolute top-3 left-3 flex items-center gap-1.5 bg-white/80 backdrop-blur-sm border text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm z-10 ${producto.estado === 'Óptimo' ? 'border-green-200 text-green-700' : 'border-amber-200 text-amber-700'}`}>
                  {producto.estado}
                </div>
                
                {producto.emoji ? (
                  <div className="w-full h-full flex items-center justify-center text-6xl select-none">
                    {producto.emoji}
                  </div>
                ) : (
                  <SecureImg src={producto.imagen} alt={producto.modelo} className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110" />
                )}
              </div>
              
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
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      {producto.tipo === 'grupo' ? 'LOTE:' : 'S/N:'}
                    </span>
                    <code className="text-xs font-bold text-slate-700">{producto.sn || '-'}</code>
                  </div>
                  
                  <div className="flex gap-3">
                    {producto.tipo === 'grupo' && (
                      <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-2 rounded">x{producto.cantidad}</span>
                    )}
                    {producto.ubicacion && <span className="text-xs font-bold text-red-500">{producto.ubicacion}</span>}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Mensajes de estado vacío inteligentes */}
          {productos.length === 0 ? (
            <div className="col-span-full py-16 flex flex-col items-center justify-center text-center">
              <div className="bg-slate-100 p-4 rounded-full mb-4">
                <svg className="size-8 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">Tu inventario está vacío</h3>
              <p className="text-sm text-slate-500 max-w-sm">Aún no hay productos registrados. Haz clic en el botón para empezar a gestionar tu equipo.</p>
            </div>
          ) : productosFiltrados.length === 0 ? (
            <div className="col-span-full py-16 flex flex-col items-center justify-center text-center">
              <svg className="size-12 text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <p className="text-slate-500 text-lg">
                No se encontraron resultados para "<span className="font-semibold text-slate-800">{textoBusqueda}</span>" 
                en la categoría <span className="font-semibold text-slate-800">{criterioBusqueda === 'sn' ? 'S/N' : criterioBusqueda === 'modelo' ? 'Nombre' : 'Ubicación'}</span>.
              </p>
            </div>
          ) : null}

        </div>
      </main>

      <AddProductModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setProductoAEditar(null); }} 
        onProductoGuardado={guardarProducto} 
        productoAEditar={productoAEditar} 
      />
      <ProductDetailModal 
        isOpen={productoSeleccionado !== null} 
        producto={productoSeleccionado} 
        onClose={() => setProductoSeleccionado(null)} 
        onEdit={abrirEdicion} 
        onDelete={borrarProducto} 
      />
    </div>
  );
}

export default App;