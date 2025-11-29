"use client"

import { useState } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@heroui/react'
import { Car } from '@/services/types'

interface Props {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  car: Car | null
  onSave: (update: Partial<Car>) => void | Promise<void>
}

export default function CarsModal({ isOpen, onOpenChange, car, onSave }: Props) {
  // Initialize form from car when component mounts; we will remount content via key when car changes
  const [form, setForm] = useState<Partial<Car>>(() => car ? {
    brand: car.brand,
    model: car.model,
    year: car.year,
    price: car.price,
    currency: car.currency,
    km: car.km,
    condition: car.condition,
    imageUrl: car.imageUrl,
    status: car.status,
    tags: car.tags,
    engine: car.engine,
  } : {})

  const update = <K extends keyof Car>(field: K, value: Car[K]) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const save = async () => {
    await onSave(form)
  }

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      backdrop="blur"
      classNames={{
        base: "bg-white text-gray-900 border border-gray-200",
        header: "border-b border-gray-200",
        footer: "border-t border-gray-200"
      }}
    >
      <ModalContent key={isOpen ? (car?._id ?? 'new') : 'closed'}>
        {() => (
          <>
            <ModalHeader className="text-lg">Editar Vehículo</ModalHeader>
            <ModalBody>
              {!car ? (
                <p className="text-gray-300">Selecciona un vehículo para editar.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-700">Marca</label>
                    <input className="w-full p-2 rounded bg-white border border-gray-300 text-gray-900" value={(form.brand ?? car?.brand ?? '')} onChange={e => update('brand', e.target.value)} />
                  </div>
                  <div>
                    <label className="text-sm text-gray-700">Modelo</label>
                    <input className="w-full p-2 rounded bg-white border border-gray-300 text-gray-900" value={(form.model ?? car?.model ?? '')} onChange={e => update('model', e.target.value)} />
                  </div>
                  <div>
                    <label className="text-sm text-gray-700">Año</label>
                    <input type="number" className="w-full p-2 rounded bg-white border border-gray-300 text-gray-900" value={(form.year ?? car?.year ?? 0)} onChange={e => update('year', Number(e.target.value))} />
                  </div>
                  <div>
                    <label className="text-sm text-gray-700">Precio</label>
                    <input type="number" className="w-full p-2 rounded bg-white border border-gray-300 text-gray-900" value={(form.price ?? car?.price ?? 0)} onChange={e => update('price', Number(e.target.value))} />
                  </div>
                  <div>
                    <label className="text-sm text-gray-700">Moneda</label>
                    <input className="w-full p-2 rounded bg-white border border-gray-300 text-gray-900" value={(form.currency ?? car?.currency ?? '')} onChange={e => update('currency', e.target.value)} />
                  </div>
                  <div>
                    <label className="text-sm text-gray-700">Kilómetros</label>
                    <input type="number" className="w-full p-2 rounded bg-white border border-gray-300 text-gray-900" value={(form.km ?? car?.km ?? 0)} onChange={e => update('km', Number(e.target.value))} />
                  </div>
                  <div>
                    <label className="text-sm text-gray-700">Condición</label>
                    <select className="w-full p-2 rounded bg-white border border-gray-300 text-gray-900" value={(form.condition ?? car?.condition ?? '')} onChange={e => update('condition', e.target.value)}>
                      <option value="">Selecciona</option>
                      <option value="New">Nuevo</option>
                      <option value="Used">Usado</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-gray-700">Estado</label>
                    <select className="w-full p-2 rounded bg-white border border-gray-300 text-gray-900" value={(form.status ?? car?.status ?? '')} onChange={e => update('status', e.target.value)}>
                      <option value="Available">Disponible</option>
                      <option value="Sold">Vendido</option>
                      <option value="Reserved">Reservado</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm text-gray-700">Imagen URL</label>
                    <input className="w-full p-2 rounded bg-white border border-gray-300 text-gray-900" value={(form.imageUrl ?? car?.imageUrl ?? '')} onChange={e => update('imageUrl', e.target.value)} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm text-gray-700">Etiquetas (coma separadas)</label>
                    <input className="w-full p-2 rounded bg-white border border-gray-300 text-gray-900" value={(Array.isArray(form.tags) ? form.tags : (car?.tags ?? []))?.join(', ') || ''} onChange={e => update('tags', e.target.value.split(',').map(t => t.trim()).filter(Boolean))} />
                  </div>
                  <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-700">Motor Tipo</label>
                      <input className="w-full p-2 rounded bg-white border border-gray-300 text-gray-900" value={(form.engine?.type ?? car?.engine?.type ?? '')} onChange={e => update('engine', { ...(form.engine || (car?.engine ?? {}) as Car['engine']), type: e.target.value })} />
                    </div>
                    <div>
                      <label className="text-sm text-gray-700">HP</label>
                      <input type="number" className="w-full p-2 rounded bg-white border border-gray-300 text-gray-900" value={(form.engine?.hp ?? car?.engine?.hp ?? 0)} onChange={e => update('engine', { ...(form.engine || (car?.engine ?? {}) as Car['engine']), hp: Number(e.target.value) })} />
                    </div>
                    <div>
                      <label className="text-sm text-gray-700">Combustible</label>
                      <input className="w-full p-2 rounded bg-white border border-gray-300 text-gray-900" value={(form.engine?.fuel ?? car?.engine?.fuel ?? '')} onChange={e => update('engine', { ...(form.engine || (car?.engine ?? {}) as Car['engine']), fuel: e.target.value })} />
                    </div>
                    <div>
                      <label className="text-sm text-gray-700">Transmisión</label>
                      <input className="w-full p-2 rounded bg-white border border-gray-300 text-gray-900" value={(form.engine?.transmission ?? car?.engine?.transmission ?? '')} onChange={e => update('engine', { ...(form.engine || (car?.engine ?? {}) as Car['engine']), transmission: e.target.value })} />
                    </div>
                  </div>
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={() => onOpenChange(false)} className="text-gray-700">Cancelar</Button>
              <Button color="primary" onPress={save} className="bg-blue-600 text-white">Guardar</Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
