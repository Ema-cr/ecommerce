'use client'
import ContactForm from '@/components/contactform/ContactForm'
import React from 'react'
import Button from '../components/button/Button';
import Counter from '../components/counter/Counter';

function HomePage() {
  const handleClick = () => {
    alert('Button clicked!')
  }

  return (
    <main>
     <div>HomePage</div>
    <ContactForm />
     <Button label="Click me" onClick={handleClick} />
     <Counter/>
    </main>
  )
}


export default HomePage
