"use client"

import React from 'react'

type Branch = {
  name: string
  address: string
  schedule: { days: string; hours: string }[]
  phone: string
  // Google Maps embed URL (no API key required)
  mapUrl: string
}

const branches: Branch[] = [
  {
    name: 'Sede Poblado',
    address: 'Cra. 43A #7-50, El Poblado, Medellín',
    phone: '+57 4 123 4567',
    schedule: [
      { days: 'Lunes a Viernes', hours: '9:00 AM – 6:00 PM' },
      { days: 'Sábado', hours: '9:00 AM – 2:00 PM' },
      { days: 'Domingo', hours: 'Cerrado' },
    ],
    mapUrl:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.981826995215!2d-75.5718475!3d6.2087994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e4429a40f8fd2a5%3A0x2a4bdbf8e76aab6e!2sEl%20Poblado%2C%20Medell%C3%ADn%2C%20Antioquia!5e0!3m2!1ses!2sco!4v1700000000000!5m2!1ses!2sco',
  },
  {
    name: 'Sede Laureles',
    address: 'Av. Nutibara #76-50, Laureles, Medellín',
    phone: '+57 4 765 4321',
    schedule: [
      { days: 'Lunes a Viernes', hours: '9:00 AM – 6:00 PM' },
      { days: 'Sábado', hours: '10:00 AM – 3:00 PM' },
      { days: 'Domingo', hours: 'Cerrado' },
    ],
    mapUrl:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3977.3346815182486!2d-75.598299!3d6.243288!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e4428f2c5b3b7db%3A0xa2c9b2c58a7e5b8a!2sLaureles%2C%20Medell%C3%ADn%2C%20Antioquia!5e0!3m2!1ses!2sco!4v1700000000001!5m2!1ses!2sco',
  },
  {
    name: 'Sede Centro',
    address: 'Calle 52 #50-10, Centro, Medellín',
    phone: '+57 4 987 6543',
    schedule: [
      { days: 'Lunes a Viernes', hours: '8:30 AM – 5:30 PM' },
      { days: 'Sábado', hours: '9:00 AM – 1:00 PM' },
      { days: 'Domingo', hours: 'Cerrado' },
    ],
    mapUrl:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.9450304815833!2d-75.570776!3d6.205422!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e442854e3b3b7b9%3A0x12a45b5f2d1b6c1d!2sCentro%20de%20Medell%C3%ADn!5e0!3m2!1ses!2sco!4v1700000000002!5m2!1ses!2sco',
  },
]

export default function VisitPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900">Agenda una visita al concesionario</h1>
          <p className="text-gray-600 mt-2">Explora nuestras sedes en Medellín y conoce tu próximo vehículo.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {branches.map((b) => (
            <div key={b.name} className="bg-white rounded-xl shadow p-4">
              <h2 className="text-xl font-semibold text-gray-900">{b.name}</h2>
              <p className="text-gray-700 mt-1">{b.address}</p>
              <p className="text-gray-700">Teléfono: {b.phone}</p>

              <div className="mt-3">
                <h3 className="text-sm font-semibold text-gray-800">Horarios</h3>
                <ul className="text-sm text-gray-600 mt-1 space-y-1">
                  {b.schedule.map((s, idx) => (
                    <li key={idx}>{s.days}: {s.hours}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-4">
                <div className="aspect-video w-full overflow-hidden rounded-lg border">
                  <iframe
                    src={b.mapUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`Mapa ${b.name}`}
                  />
                </div>
              </div>

              <a
                href="https://calendar.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
              >
                Agendar visita
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}