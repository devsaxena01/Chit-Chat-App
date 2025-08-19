import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const Header = ({socket}) => {
    const { user } = useSelector(state => state.userReducer)
    const navigate = useNavigate()
    
    const getFullname = () => {
        let fname = user?.firstname.at(0).toUpperCase() + user?.firstname.slice(1).toLowerCase();
        let lname = user?.lastname?.at(0).toUpperCase() + user?.lastname.slice(1).toLowerCase();
        return fname + ' ' + lname;

    }

    const getInitials = () => {
        let f = user?.firstname.toUpperCase()[0];
        let l = user?.lastname.toUpperCase()[0];
        return f + l;
    }

    const logout = () => {
      localStorage.removeItem('token')
      navigate('/login')
      socket.emit('user-offline' , user._id)
    }

  return (
  <div className="flex flex-wrap w-full px-8 py-2.5 justify-between border-b border-[#bbb]">

  <div className="flex flex-nowrap text-[#28282B] text-[25px] font-bold">
    <i className="fa fa-comments mx-2.5 my-1.5" aria-hidden="true"></i>
          Chit Chat
  </div>

  <div className="flex">

    {
      user?.profilePic && 
      <img src={user.profilePic} 
      alt='profile-pic' 
      className="w-10 h-10 rounded-full bg-[#e74c3c] text-white text-[20px] font-bold text-center leading-[40px] cursor-pointer"
      onClick={ () => navigate('/profile')}>
      </img>
    }

    {
      !user?.profilePic && 
      <div className="w-10 h-10 rounded-full bg-[#e74c3c] text-white text-[20px] font-bold text-center leading-[40px]"
      onClick={() => navigate('/profile')}>
      {getInitials()}
      </div>
    }

    <div className="text-[#28282B] font-bold pt-2.5 pr-5 ml-[15px]">
      {getFullname()}
    </div>

    <button 
        className="logout-button bg-transparent text-[#100d0d] border-none text-[18px] cursor-pointer"
        onClick={logout} >
        <i className="fa fa-power-off"></i>
    </button>


  </div>
</div>

  )
}

export default Header