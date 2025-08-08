import React from 'react'
import { useSelector } from 'react-redux'

const Header = () => {
    const { user } = useSelector(state => state.userReducer)
    //console.log(user);
    
    const getFullname = () => {
        let fname = user?.firstname.toUpperCase()
        let lname = user?.lastname.toUpperCase()
        return fname+' '+lname

    }

    const getInitials = () => {
        let f = user?.firstname.toUpperCase()[0];
        let l = user?.lastname.toUpperCase()[0];
        return f + l;
    }

  return (
  <div className="flex flex-wrap w-full px-8 py-2.5 justify-between border-b border-[#bbb]">
  <div className="flex flex-nowrap text-[#28282B] text-[25px] font-bold">
    <i className="fa fa-comments mx-2.5 my-1.5" aria-hidden="true"></i>
    Chit Chat
  </div>

  <div className="flex">
    <div className="text-[#28282B] font-bold pt-2.5 pr-5">{getFullname()}</div>
    <div className="w-10 h-10 rounded-full bg-[#e74c3c] text-white text-[20px] font-bold text-center leading-[40px]">
      {getInitials()}
    </div>
  </div>
</div>

  )
}

export default Header