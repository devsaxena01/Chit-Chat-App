import React, { useEffect, useState } from 'react'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Chat from './components/Chat'
import { useSelector } from 'react-redux'
import {io} from 'socket.io-client'
const socket = io('http://localhost:5000')

const Home = () => {
  const {selectedChat , user} = useSelector(state => state.userReducer)
  const [onlineUser, setOnlineUser] = useState([]);

  useEffect(() => {
    if(user){
      socket.emit('join-room' , user._id) // .emit method is used to emit the event
       // .on method is used to handle the event

       socket.emit('user-login' , user._id)
       socket.on('online-users', onlineusers => {
            setOnlineUser(onlineusers);
      })

    }
  } , [user])
  return (
    <div className="flex flex-col min-h-screen bg-[#fdedec]">
      <Header/>
      <div className="flex w-[90%] mx-auto my-2.5 p-2.5 flex-1">
         <Sidebar socket={socket} onlineUser={onlineUser}/>
        {selectedChat && <Chat socket={socket}/>}
      </div>
   </div>
  )
}

export default Home