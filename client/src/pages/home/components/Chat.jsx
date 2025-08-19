import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createNewMessage, getAllMessages } from '../../../apiCalls/message'
import { hideLoader, showLoader } from '../../../redux/loaderSlice'
import toast from 'react-hot-toast'
import moment from 'moment'
import { clearUnreadMessageCount } from './../../../apiCalls/chat'
import store from './../../../redux/store'
import { setAllChats } from '../../../redux/usersSlice'
import EmojiPicker from "emoji-picker-react"

const Chat = ({socket}) => {
    const {selectedChat , user , allChats} = useSelector(state => state.userReducer)
     const selectedUser = selectedChat.members.find(u => u._id !== user._id)
     const dispatch = useDispatch()
     const [message , setMessage] = useState('')
     const [allMessages , setAllMessages] = useState([])
     const [isTyping , setIsTyping] = useState(false)
     const [showEmojiPicker, setShowEmojiPicker] = useState(false)

     const sendMessage = async () => {
      try {
        const newMessage = {
            chatId:selectedChat._id,
            sender:user._id,
            text:message
        }

        socket.emit('send-message' , {
          ...newMessage,
          members:selectedChat.members.map(m => m._id),
          read:false,
          createdAt:moment().format("YYYY-MM-DD HH:mm:ss")
        })

        const response = await createNewMessage(newMessage)

        if(response.success){
          setMessage('')
          setShowEmojiPicker(false)
        }
      } 
      catch (error) {
        toast.error(error.message)
      }
     }

     const getMessages = async () => {
      try {
       
        dispatch(showLoader())
        const response = await getAllMessages(selectedChat._id)
        dispatch(hideLoader())

        if(response.success){
          setAllMessages(response.data)
        }
      } 
      catch (error) {
        dispatch(hideLoader())
        toast.error(error.message)
      }
     }

     const clearUnreadMessages = async () => {
      try {
       
        socket.emit('clear-unread-messages', {
                chatId: selectedChat._id,
                members: selectedChat.members.map(m => m._id)
        })

        const response = await clearUnreadMessageCount(selectedChat._id)

        if(response.success){
          allChats.map(chat => {
            if(chat._id===selectedChat._id){
              return response.data
            }
            return chat
          })
        }
      } 
      catch (error) {
        toast.error(error.message)
      }
     }

    const formatTime = (timestamp) => {
        const now = moment();
        const diff = now.diff(moment(timestamp), 'days')

        if(diff < 1){
            return `Today ${moment(timestamp).format('hh:mm A')}`;
        }else if(diff === 1){
            return `Yesterday ${moment(timestamp).format('hh:mm A')}`;
        }else {
            return moment(timestamp).format('MMM D, hh:mm A');
        }
    }

    const formatName = (user) => {
        let fname = user.firstname.at(0).toUpperCase() + user.firstname.slice(1).toLowerCase();
        let lname = user.lastname?.at(0).toUpperCase() + user.lastname.slice(1).toLowerCase();
        return fname + ' ' + lname;
    }


     useEffect(() => {
      getMessages();
      if(selectedChat?.lastMessage?.sender!==user._id){
        clearUnreadMessages();
      }

      socket.on('receive-message' , (message) => {
        const selectedChat = store.getState().userReducer.selectedChat;
        if(selectedChat._id === message.chatId){
                setAllMessages(prevmsg => [...prevmsg, message]);
        }

        if(selectedChat._id === message.chatId && message.sender !== user._id){
                clearUnreadMessages();
            }
        })

      socket.on('message-count-cleared', data => {
            const selectedChat = store.getState().userReducer.selectedChat;
            const allChats = store.getState().userReducer.allChats;

            if(selectedChat._id === data.chatId){
                //UPDATING UNREAD MESSAGE COUNT IN CHAT OBJECT
                const updatedChats = allChats.map(chat => {
                    if(chat._id === data.chatId){
                        return { ...chat, unreadMessageCount: 0}
                    }
                    return chat;
                })
                dispatch(setAllChats(updatedChats));

                //UPDATING READ PROPRTY IN MESSAGE OBJECT
                setAllMessages(prevMsgs => {
                    return prevMsgs.map(msg => {
                        return {...msg, read: true}
                    })
                })
            }
        })

        socket.on('started-typing', (data) => {
            //setData(data);
            if(selectedChat._id === data.chatId && data.sender !== user._id){
                setIsTyping(true);
                setTimeout(() => {
                    setIsTyping(false);
                }, 2000)
            }
        })

     } , [selectedChat])

     useEffect(() => {
        const msgContainer = document.getElementById('main-chat-area')
        msgContainer.scrollTop = msgContainer.scrollHeight
     } , [allMessages , isTyping])

  return (
    <>
        {selectedChat && 
            <div className="app-chat-area bg-white w-[70%] p-[20px_30px] rounded-[10px] flex flex-col h-[85vh]">
            <div className="app-chat-area-header px-[30px] py-[10px] mb-[20px] border-b border-[#bbb] text-right font-bold text-[#e74c3c]">
                 {formatName(selectedUser)}
           </div>

           <div className="main-chat-area flex-1 overflow-y-scroll py-  [10px] px-[20px]" id='main-chat-area'>
                {allMessages.map(msg => {
                  const isCurrentUserSender = msg.sender === user._id
                  return <div class="flex" style={isCurrentUserSender ? {justifyContent:'end'} : {justifyContent:'start'}}>
                    <div>
                     <div class={isCurrentUserSender ? 
                      "bg-red-600 text-white px-5 py-2 mt-1 rounded-[10px] text-sm w-fit ml-[100px] rounded-tr-[0px]" : 
                      "px-5 py-2 mt-1 rounded-[10px] text-sm w-fit bg-[#ddd] text-[#28282B] mr-[100px] rounded-bl-[0px]"}>
                                 {msg.text}
                    </div>
                    <div className='w-fit text-[13px]'
                        style={isCurrentUserSender ? {float:'right'} : {float:'left'}}>
                          {formatTime(msg.createdAt)}
                          {isCurrentUserSender && msg.read && <i className='fa fa-check-circle' aria-hidden="true" style={{color
                            :'#e74c3c'
                          }}></i>}
                    </div>
                    </div>
                </div>
                })}

                <div className='text-13px text-gray-400'>{isTyping && <i>typing...</i>}</div>
          </div>

          {showEmojiPicker && <div>
            <EmojiPicker onEmojiClick={(e) => setMessage(message + e.emoji)}></EmojiPicker>
          </div>}

    <div class="relative mt-[20px]">
        <input 
            type="text" 
            placeholder="Type a message" 
            value={message}
            onChange={(e) => {
              setMessage(e.target.value)
              socket.emit('user-typing' , {
                chatId:selectedChat._id,
                members:selectedChat.members.map(m => m._id),
                sender:user._id
              })
            }}
            className="w-full h-[40px] px-[20px] py-[10px] border border-[#ddd] rounded-[5px] text-[#28282B] outline-none"
        />

        <button className=" absolute right-[50px] text-[25px] text-[#e74c3c] cursor-pointer mt-2 border-none bg-transparent" 
            aria-hidden="true"
            onClick={() => {setShowEmojiPicker(!showEmojiPicker)}}>btn
        </button>

        <button className="fa fa-paper-plane absolute right-[10px] text-[25px] text-[#e74c3c] cursor-pointer mt-2 border-none bg-transparent" 
            aria-hidden="true"
            onClick={sendMessage}>
        </button>
    </div>
</div>
        }
    </>
  )
}

export default Chat