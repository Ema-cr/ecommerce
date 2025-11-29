"use client"

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@heroui/react'
import Image from 'next/image'
import { Car } from '@/services/types'

interface Props {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  car: Car | null
}

export default function DetailsModal({ isOpen, onOpenChange, car }: Props) {
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
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="text-lg">Detalles del Vehículo</ModalHeader>
            <ModalBody>
              {!car ? (
                <p className="text-gray-600">Sin vehículo seleccionado.</p>
              ) : (
                <div className="space-y-4">
                  <div className="relative w-full h-56 bg-gray-100 rounded">
                    <Image src={car.imageUrl} alt={`${car.brand} ${car.model}`} fill className="object-cover rounded" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Marca</p>
                      <p className="font-semibold">{car.brand}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Modelo</p>
                      <p className="font-semibold">{car.model}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Año</p>
                      <p className="font-semibold">{car.year}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Condición</p>
                      <p className="font-semibold">{car.condition}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Estado</p>
                      <p className="font-semibold">{car.status}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Kilómetros</p>
                      <p className="font-semibold">{car.km} km</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Precio</p>
                      <p className="font-semibold">${car.price.toLocaleString()} {car.currency}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Motor</p>
                      <p className="font-semibold">{car.engine.type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">HP</p>
                      <p className="font-semibold">{car.engine.hp}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Combustible</p>
                      <p className="font-semibold">{car.engine.fuel}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Transmisión</p>
                      <p className="font-semibold">{car.engine.transmission}</p>
                    </div>
                  </div>

                  {car.tags && car.tags.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-500">Etiquetas</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {car.tags.map((tag, idx) => (
                          <span key={idx} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={() => onOpenChange(false)} className="text-gray-700">Cerrar</Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
