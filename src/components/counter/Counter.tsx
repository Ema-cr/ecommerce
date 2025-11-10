import React from 'react'



function Counter() {

    const [count, setCount] = React.useState(0)
    const increment = () => setCount(count + 1)
    const decrement = () => setCount(count - 1)
    const reset = () => setCount(0)

  return (
    <div>Counter
    <button className='w-2.0 bg-blue-500 text-white p-2 rounded-md m-2
    ' onClick={increment}>+</button>
    <button className='w-2.0 bg-red-500 text-white p-2 rounded-md m-2
    ' onClick={decrement}>-</button>
    <span>{count}</span>
    <button className='w-2.0 bg-yellow-500 text-white p-2 rounded-md m-2
    ' onClick={reset}>Reset</button>
    
    </div>
  )
}

export default Counter