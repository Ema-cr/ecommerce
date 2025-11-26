'use client'
import CarCard from '@/components/card/CarCard'
import Hero from '@/components/hero/Hero'
import ContactForm from '@/components/registerform/RegisterForm'
import React from 'react'

function HomePage() {

  return (
    <main>
     <div>
      <Hero/>
      <CarCard/>
     </div>
    </main>
  )
}


export default HomePage
