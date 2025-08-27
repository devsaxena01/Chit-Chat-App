import React, { useEffect, useState } from 'react'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Chat from './components/Chat'
import { useSelector } from 'react-redux'
import {io} from 'socket.io-client'

const socket = io('https://chit-chat-app-x9g0.onrender.com' , {
  transports: ["websocket"],
  withCredentials: true
})

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

      socket.on('online-users-updated', onlineusers => {
            setOnlineUser(onlineusers);
      })

    }
  } , [user , onlineUser])
  return (
    <div className=" flex flex-col min-h-screen bg-gradient-to-br from-gray-700 via-black to-gray-800">
      <Header socket={socket}/>
      <div className="flex w-full  flex-1 ">
         {/* <Sidebar socket={socket} onlineUser={onlineUser}/>
        {selectedChat && <Chat socket={socket}/>} */}

        <div className={`${selectedChat ? "hidden md:block" : "block"} w-full md:w-[30%]`}>
          <Sidebar socket={socket} onlineUser={onlineUser} />
        </div>

        {/* Chat (visible only if chat is selected OR always on desktop) */}
        <div className={`${selectedChat ? "block" : "hidden"} w-full md:w-[70%]`}>
          {selectedChat && <Chat socket={socket} />}
        </div>
        
      </div>
   </div>
  )
}

export default Home