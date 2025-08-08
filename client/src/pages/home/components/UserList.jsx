import React from 'react'
import {useDispatch, useSelector} from 'react-redux'
import toast from 'react-hot-toast'
import { createNewChat } from '../../../apiCalls/chat'
import { hideLoader, showLoader } from "../../../redux/loaderSlice";
import { setAllChats } from './../../../redux/usersSlice';

const UserList = ({searchKey}) => {
  const {allUsers , allChats , user:currentUser} = useSelector(state => state.userReducer)
  const dispatch = useDispatch()

  const startNewChat = async (searchedUserId) => {
    let response = null
    try {
      dispatch(showLoader())
      response = await createNewChat([currentUser._id , searchedUserId])
      dispatch(hideLoader())

      if(response.success){
        toast.success(response.message)
        const newChat = response.data
        const updatedChat = [...allChats , newChat]
        dispatch(setAllChats(updatedChat))
      }

    } catch (error) {
        toast.error(response.message)
    }
  }

  return (
    allUsers
    .filter(user => {
      return (
        (
        user.firstname.toLowerCase().includes(searchKey.toLowerCase()) || 
        user.lastname.toLowerCase().includes(searchKey.toLowerCase())) && 
        searchKey
    ) || (allChats.some(chat => chat.members.includes(user._id)))
    })
    .map(user => {
      return <div className="user-search-filter">
  <div className="border-b border-gray-300 p-3 text-gray-800 cursor-pointer bg-white">
    <div className="flex flex-wrap items-center">
      {/* Profile Picture */}
      {user.profilePic && <img src={user.profilePic} alt="Profile Pic" className="w-12 h-12 rounded-full" />}
      {!user.profilePic && <div className="w-12 h-12 rounded-full bg-red-600 text-white text-xl font-bold text-center leading-[50px]">
        {
        user.firstname.charAt(0).toUpperCase() +
        user.lastname.charAt(0).toUpperCase()
        }
      </div>}

      {/* User Details */}
      <div className="w-3/5 px-5">
        <div className="text-lg font-bold">{user.firstname+user.lastname}</div>
        <div className="text-xs">{user.email}</div>
      </div>

      {/* Start Chat Button */}
      { !allChats.find(chat => chat.members.includes(user._id)) && 
        <div className="py-2">
        <button className="px-3 py-2 rounded bg-red-600 text-white text-sm hover:bg-red-700 transition"
        onClick={() => startNewChat(user._id)}>
          Start Chat
        </button>
      </div>}
    </div>
  </div>
</div>
    })

  )
}

export default UserList