import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-l from-[#0d1f4a] via-[#0e2a67] to-[#0a1b3c] text-white pt-12 pb-6 mt- border-t border-white/10">
      
      {/* CONTENEDOR */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* LOGO + DESCRIPCIÓN */}
        <div>
          <img
            src="/icon-gt.png"
            alt="GT AutoMarket"
            className="h-25 mb-4 drop-shadow-lg"
          />
          <p className="text-gray-300 text-sm leading-relaxed">
            GT AutoMarket — Concesionario oficial con la mejor selección de vehículos nuevos y usados.
          </p>
        </div>

        {/* SECCIÓN ENLACES */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Enlaces</h3>
          <ul className="space-y-2 text-gray-300">
            <Link href="/">
              <li className="hover:text-white cursor-pointer">Inicio</li>
            </Link>
            <ul className="space-y-2 text-gray-300"></ul>
            <Link href="/cars">
              <li className="hover:text-white cursor-pointer">Vehículos</li>
            </Link>
          </ul>
        </div>

        {/* SOPORTE */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Soporte</h3>
          <ul className="space-y-2 text-gray-300">
            <li className="hover:text-white cursor-pointer">Contacto</li>
            <li className="hover:text-white cursor-pointer">Preguntas frecuentes</li>
          </ul>
        </div>

        {/* NEWSLETTER */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Recibe ofertas</h3>
          <p className="text-gray-300 text-sm mb-3">
            Sé el primero en recibir información de promociones y nuevos modelos.
          </p>

          <div className="flex items-center bg-white/10 border border-white/20 rounded-lg overflow-hidden">
            <input
              type="email"
              placeholder="Tu correo electrónico"
              className="w-full px-4 py-2 bg-transparent text-gray-200 placeholder-gray-400 focus:outline-none"
            />
            <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium">
              Enviar
            </button>
          </div>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="text-center text-gray-400 text-sm mt-10 border-t border-white/10 pt-4">
        © {new Date().getFullYear()} GT AutoMarket — Todos los derechos reservados.
      </div>
    </footer>
  );
}
