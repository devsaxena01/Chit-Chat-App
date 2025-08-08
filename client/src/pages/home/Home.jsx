import React from 'react'
import Header from './components/Header'
import Sidebar from './components/Sidebar'

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#fdedec]">
      <Header/>
      <div className="flex w-[90%] mx-auto my-2.5 p-2.5 flex-1">
         <Sidebar/>
         {/* chat area layout */}
      </div>
   </div>
  )
}

export default Home