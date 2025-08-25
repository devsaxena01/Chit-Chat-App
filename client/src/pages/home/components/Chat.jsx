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
import { Smile , Send , Paperclip , ArrowLeft} from "lucide-react";
import { setSelectedChat } from "../../../redux/usersSlice"

const Chat = ({socket}) => {
    const {selectedChat , user , allChats} = useSelector(state => state.userReducer)
     const selectedUser = selectedChat.members.find(u => u._id !== user._id)
     const dispatch = useDispatch()
     const [message , setMessage] = useState('')
     const [allMessages , setAllMessages] = useState([])
     const [isTyping , setIsTyping] = useState(false)
     const [showEmojiPicker, setShowEmojiPicker] = useState(false)
     const [data , setData] = useState(null)

     const sendMessage = async (image) => {
      try {
        const newMessage = {
            chatId:selectedChat._id,
            sender:user._id,
            text:message,
            image:image
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

    const sendImage = async (e) => {
        const file = e.target.files[0];
        const reader = new FileReader(file);
        reader.readAsDataURL(file);

        reader.onloadend = async () => {
            sendMessage(reader.result);
        }
    }


     useEffect(() => {
      getMessages();
      if(selectedChat?.lastMessage?.sender!==user._id){
        clearUnreadMessages();
      }

      socket.off('receive-message').on('receive-message' , (message) => {
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
            setData(data);
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
            <div className="app-chat-area bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a] p-[2px_3px]  flex flex-col h-[92vh] overflow-hidden">
              
            <div className=" app-chat-area-header flex items-center gap-3 px-[10px] py-[10px] mb-[20px] border-b border-gray-500  text-left text-2xl font-bold text-cyan-400">
              
              <button className='md:hidden  rounded-full hover:bg-gray-700 transition'
              onClick={() => dispatch(setSelectedChat(null))}>
                <ArrowLeft className='w-7 h-7 text-cyan-400'/>
              </button>
              
                 {formatName(selectedUser)}
                 
           </div>

           <div className="main-chat-area flex-1 h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-slate-800 py-[10px] px-[20px] overflow-hidden" id='main-chat-area'>
                {allMessages.map(msg => {
                  const isCurrentUserSender = msg.sender === user._id
                  return <div class="flex" style={isCurrentUserSender ? {justifyContent:'end'} : {justifyContent:'start'}}>
                    <div>
                     <div class={isCurrentUserSender ? 
                      "bg-gray-900 mb-1  text-white px-5 py-2 mt-4 rounded-[10px] text-sm w-fit ml-[100px] rounded-tr-[0px]" : 
                      "px-5 py-2 mt-4  mb-1 rounded-[10px] text-sm w-fit bg-gray-800 text-white mr-[100px] rounded-bl-[0px]"}>
                                 <div>{msg.text}</div>
                                 <div>{msg.image && <img src={msg.image} alt="image" height="120" width="120"></img>}</div>
                    </div>
                    <div className='w-fit text-[10px] text-gray-400'
                        style={isCurrentUserSender ? {float:'right'} : {float:'left'}}>
                          {formatTime(msg.createdAt)}
                          {isCurrentUserSender && msg.read && <i className='fa fa-check-circle' aria-hidden="true" style={{color
                            :'#34B7F1'
                          }}></i>}
                    </div>
                    </div>
                </div>
                })}

                <div className='text-30px text-gray-400'>{isTyping && selectedChat?.members.map(m => m._id).includes(data?.sender) && <i>typing...</i>}</div>
          </div>

          {showEmojiPicker && <div style={{width:'100%' , display:'flex' , padding:'0px 20px' , justifyContent:'left'}}>
            <EmojiPicker style={{width:'300px' , height:'400px'}}  onEmojiClick={(e) => setMessage(message + e.emoji)}></EmojiPicker>
          </div>}

    <div class="relative mt-[16px]">

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
            className="w-full h-12 px-5 pr-12 rounded-[4px] text-gray-200 border-none bg-gray-800"
        />

        <label for="file" className='absolute right-[80px] text-[25px] text-[#e74c3c] cursor-pointer mt-2 border-none bg-transparent p-1 rounded-full hover:bg-[#1e293b] transition'>
            <Paperclip className="h-6 w-6 text-cyan-400" />
            <input type="file" 
               id="file"
               style={{display: 'none'}}
               accept="image/jpg,image/png,image/jpeg,image/gif"
               onChange={sendImage}>
            </input>

        </label>

        <button className=" absolute right-[45px] text-[25px] text-[#e74c3c] cursor-pointer mt-2 border-none bg-transparent p-1 rounded-full hover:bg-[#1e293b] transition"
        onClick={() => {setShowEmojiPicker(!showEmojiPicker)}}
        >
        <Smile className="text-cyan-400 w-6 h-6" />
      </button>

        <button className="absolute right-[10px] text-[25px] cursor-pointer mt-2 border-none bg-transparent p-1 rounded-full hover:bg-[#1e293b] transition" 
            aria-hidden="true"
            onClick={() => sendMessage('')}>
              <Send className="h-6 w-6 text-cyan-400" />
        </button>

    </div>
</div>
        }
    </>
  )
}

export default Chat