"use client"

import React, { useState } from 'react'
import { useI18n } from '../i18n/I18nProvider'

type QA = { q: string; a: string }

const faqs: QA[] = [
  {
    q: '¿Qué documentos necesito para comprar un vehículo?',
    a: 'Cédula de ciudadanía, comprobante de ingresos o certificación laboral, historial crediticio si aplica y un comprobante de dirección. Para empresas, cámara de comercio y RUT.'
  },
  {
    q: '¿Ofrecen financiación y en qué plazos?',
    a: 'Sí, trabajamos con entidades aliadas. Plazos típicos entre 24 y 72 meses, con tasas variables según perfil. Te asesoramos en el mejor plan para tu caso.'
  },
  {
    q: '¿Puedo agendar un test drive?',
    a: 'Claro. Puedes agendar desde la página de “Visita” o contactarnos por WhatsApp. Coordinamos fecha, sede y modelo disponible.'
  },
  {
    q: '¿Los vehículos cuentan con garantía?',
    a: 'Sí. Vehículos nuevos con garantía del fabricante; seminuevos con garantía limitada que cubre componentes mecánicos principales. Consulta términos por modelo.'
  },
  {
    q: '¿Aceptan vehículo usado como parte de pago?',
    a: 'Sí, hacemos tasación profesional y puedes usar tu vehículo como parte del negocio. La oferta depende del estado, historial y mercado.'
  },
  {
    q: '¿Cuál es el proceso de compra?',
    a: 'Selección del vehículo, verificación, separación (opcional), financiación o pago, trámites de matrícula/transferencia y entrega con checklist y documentación.'
  },
  {
    q: '¿Cómo funciona la reserva de un vehículo?',
    a: 'Puedes separar por un depósito reembolsable dentro de plazos definidos si no se concreta la compra. La reserva garantiza disponibilidad temporal.'
  },
  {
    q: '¿Hacen envío a otras ciudades?',
    a: 'Sí. Coordinamos transporte asegurado y trámites. Costos varían según destino y tipo de vehículo.'
  },
  {
    q: '¿Qué métodos de pago aceptan?',
    a: 'Transferencia bancaria, consignación, tarjetas (según monto), pagos mixtos y financiación con bancos aliados.'
  },
  {
    q: '¿Cómo puedo contactar soporte postventa?',
    a: 'Por nuestro formulario de contacto, WhatsApp o línea dedicada. También puedes agendar mantenimiento en nuestras sedes.'
  },
]

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const { t } = useI18n()

  const faqs: QA[] = [
    { q: t('faq.q1'), a: t('faq.a1') },
    { q: t('faq.q2'), a: t('faq.a2') },
    { q: t('faq.q3'), a: t('faq.a3') },
    { q: t('faq.q4'), a: t('faq.a4') },
    { q: t('faq.q5'), a: t('faq.a5') },
    { q: t('faq.q6'), a: t('faq.a6') },
    { q: t('faq.q7'), a: t('faq.a7') },
    { q: t('faq.q8'), a: t('faq.a8') },
    { q: t('faq.q9'), a: t('faq.a9') },
    { q: t('faq.q10'), a: t('faq.a10') },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900">{t('faq.title')}</h1>
          <p className="text-gray-600 mt-2">{t('faq.subtitle')}</p>
        </header>

        <div className="bg-white rounded-2xl shadow divide-y">
          {faqs.map((item, idx) => (
            <div key={idx}>
              <button
                className="w-full text-left px-6 py-4 flex items-center justify-between hover:bg-gray-50"
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              >
                <span className="text-gray-900 font-medium">{item.q}</span>
                <span className="text-gray-500">{openIndex === idx ? '−' : '+'}</span>
              </button>
              {openIndex === idx && (
                <div className="px-6 pb-4 text-gray-700">{item.a}</div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600">{t('faq.notFound')}</p>
          <a href="/contact" className="inline-block mt-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">{t('faq.contactUs')}</a>
        </div>
      </div>
    </div>
  )
}