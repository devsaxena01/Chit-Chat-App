import React, { useEffect } from 'react'
import {useDispatch, useSelector} from 'react-redux'
import toast from 'react-hot-toast'
import { createNewChat } from '../../../apiCalls/chat'
import { hideLoader, showLoader } from "../../../redux/loaderSlice";
import { setAllChats , setSelectedChat } from './../../../redux/usersSlice';
import moment from 'moment';
import store from './../../../redux/store'


const UserList = ({searchKey , socket , onlineUser}) => {
  const {allUsers , allChats , user:currentUser , selectedChat} = useSelector(state => state.userReducer)
  const dispatch = useDispatch()

   const startNewChat = async (searchedUserId) => {
        let response = null;
        try{
            dispatch(showLoader());
            response =await createNewChat([currentUser._id, searchedUserId]);
            dispatch(hideLoader());

            if(response.success){
                toast.success(response.message);
                const newChat = response.data;
                const updatedChat = [...allChats, newChat]
                dispatch(setAllChats(updatedChat));
                dispatch(setSelectedChat(newChat));
            }
        }catch(error){
            toast.error(response.message);
            dispatch(hideLoader());
        }
    }

   const openChat = (selectedUserId) => {
        const chat = allChats.find(chat => 
            chat.members.map(m => m._id).includes(currentUser._id) && 
            chat.members.map(m => m._id).includes(selectedUserId)
        )

        if(chat){
            dispatch(setSelectedChat(chat));
        }
    }

    const IsSelectedChat = (user) => {
      if(selectedChat){
        return selectedChat.members.map(m => m._id).includes(user._id)
      }
      return false;
    }

    const getlastMessage = (userId) => {
        const chat = allChats.find(chat => chat.members.map(m => m._id).includes(userId));

        if(!chat || !chat.lastMessage){
            return "";
        }
        else{
          const msgPrefix = chat?.lastMessage?.sender === currentUser._id ? "You: " : ""
          return msgPrefix + chat?.lastMessage?.text?.substring(0, 25)
        }
    }

    const getLastMessageTimeStamp = (userId) => { 
        const chat = allChats.find(chat => chat.members.map(m => m._id).includes(userId));

        if(!chat || !chat?.lastMessage){
            return "";
        }else{
            return moment(chat?.lastMessage?.createdAt).format('hh:mm A');
        }
    }

    const formatName = (user) => {
        let fname = user.firstname.at(0).toUpperCase() + user.firstname.slice(1).toLowerCase();
        let lname = user.lastname?.at(0).toUpperCase() + user.lastname.slice(1).toLowerCase();
        return fname + ' ' + lname;
    }

    const getUnreadMessageCount = (userId) => {
        const chat = allChats.find(chat => 
            chat.members.map(m => m._id).includes(userId)
        )

        if(chat && chat.unreadMessageCount && chat.lastMessage.sender!==currentUser._id){
            return <div className="text-center float-right text-[13px] pt-[3px] w-[25px] h-[25px] rounded-full bg-[#e74c3c] font-bold text-white"> {chat.unreadMessageCount}</div>;
        }else{
            return "";
        }
    }

    function getData(){
        if(searchKey === ""){
            return allChats;
        }else{
            return allUsers.filter(user => {
                return user.firstname?.toLowerCase().includes(searchKey?.toLowerCase()) ||
                    user.lastname?.toLowerCase().includes(searchKey?.toLowerCase());
            });
        }
    }  
    
    useEffect(() => {
      socket.on('receive-message' , (message) => {
        const selectedChat = store.getState().userReducer.selectedChat
        let allChats = store.getState().userReducer.allChats

        if(selectedChat?._id!==message.chatId){
          const updatedchats = allChats.map(chat => {
            if(chat._id===message.chatId){
              return {
                ...chat,
                unreadMessageCount: (chat?.unreadMessageCount || 0) + 1,
                lastMessage: message
              }
            }
            return chat
          })
          allChats=updatedchats
        }

        // 1. find the latest chat
        const latestChat = allChats.find(chat => chat._id === message.chatId)

        // 2. get all other chat except the latest chat
         const otherChats = allChats.filter(chat => chat._id !== message.chatId)

        // 3. create a new array where latest chat on top and then other chats
        allChats = [latestChat, ...otherChats]

        dispatch(setAllChats(allChats))
      })
    } , [])

  return (
    getData()
    .map(obj => {
      let user = obj
      if(obj.members){
        user = obj.members.find(mem => mem._id!== currentUser._id)
      }
      return <div className="user-search-filter" onClick={() => openChat(user._id)} 
      key={user._id}>

     <div className={ IsSelectedChat(user) ? 
                                         "border-b border-[#ccc] px-2.5 py-2.5 text-white cursor-pointer bg-[#e74c3c]" : 
                                         "border-b border-gray-300 p-3 text-gray-800 cursor-pointer bg-white"
     }>

    <div className="flex flex-wrap items-center">
      {/* Profile Picture */}

      {
        user.profilePic && <img src={user.profilePic} 
        alt="Profile Pic" 
        className="w-12 h-12 rounded-full" 
        style={onlineUser.includes(user._id) ? {border: '#82e0aa 3px solid'} : {}}
       />
      }

      { 
        !user.profilePic &&
        <div className={IsSelectedChat(user) ? "w-[50px] h-[50px] rounded-full text-[22px] font-bold text-center align-middle leading-[50px] bg-white text-[#e74c3c]" : 
        "w-[50px] h-[50px] rounded-full text-[22px] font-bold text-center align-middle leading-[50px] bg-[#e74c3c] text-white"}
        style={onlineUser.includes(user._id) ? {border: '#82e0aa 3px solid'} : {}}
      >
        {
         user.firstname.charAt(0).toUpperCase() +
         user.lastname.charAt(0).toUpperCase()
        }
      </div>
      }

      {/* User Details */}
      <div className="w-3/5 px-5">
        <div className="text-lg font-bold">{formatName(user)}</div>
        <div className="text-xs">{getlastMessage(user._id) || user.email}</div>
      </div>

      <div>
        {getUnreadMessageCount(user._id)}
        <div className='last-message-timestamp text-[12px]'>
           {getLastMessageTimeStamp(user._id)}      
        </div>
      </div>

      {/* Start Chat Button */}
      { !allChats.find(chat => chat.members.map(m => m._id).includes(user._id)) && 
        <div className="py-2">
        <button className="px-3 py-2 rounded bg-red-600 text-white text-sm hover:bg-red-700 transition"
        onClick={() => startNewChat(user._id)}>
          Start Chat
        </button>
      </div>
      }
    </div>
  </div>
</div>
    })

  )
}

export default UserList