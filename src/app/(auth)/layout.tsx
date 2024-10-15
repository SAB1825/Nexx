import React from 'react'
interface authLayoutProps {
    children: React.ReactNode
}
const layout = ({children} : authLayoutProps) => {
  return (
    <main className='bg-black  min-h-screen'>
        <div className='mx-auto max-w-screen-2xl p-4'>
            {children}
        </div>
    </main>
  )
}

export default layout