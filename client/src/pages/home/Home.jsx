import React from 'react'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Chat from './components/Chat'
import { useSelector } from 'react-redux'

const Home = () => {
  const {selectedChat} = useSelector(state => state.userReducer)
  return (
    <div className="flex flex-col min-h-screen bg-[#fdedec]">
      <Header/>
      <div className="flex w-[90%] mx-auto my-2.5 p-2.5 flex-1">
         <Sidebar/>
        {selectedChat && <Chat/>}
      </div>
   </div>
  )
}

export default Home