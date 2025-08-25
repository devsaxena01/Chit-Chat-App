import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Header = ({ socket }) => {
  const { user } = useSelector((state) => state.userReducer);
  const navigate = useNavigate();

  const getFullname = () => {
    let fname =
      user?.firstname.at(0).toUpperCase() +
      user?.firstname.slice(1).toLowerCase();
    let lname =
      user?.lastname?.at(0).toUpperCase() +
      user?.lastname.slice(1).toLowerCase();
    return fname + " " + lname;
  };

  const getInitials = () => {
    let f = user?.firstname?.toUpperCase()[0];
    let l = user?.lastname?.toUpperCase()[0];
    return f + l;
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    socket.emit("user-offline", user._id);
  };

  return (
    <header className="w-full bg-gradient-to-r from-[#060910] via-[#1e293b] to-[#0f172a] shadow-md px-6 py-2 flex items-center justify-between">
      {/* Logo Section */}
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <i className="fa fa-comments text-[#38bdf8] text-2xl"></i>
        <h1 className="text-cyan-400 text-xl sm:text-2xl font-bold tracking-wide">
          Chit Chat
        </h1>
      </div>

      {/* User Section */}
      <div className="flex items-center gap-4">
        {/* Profile Avatar */}
        {user?.profilePic ? (
          <img
            src={user.profilePic}
            alt="profile"
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover cursor-pointer border-2 border-[#38bdf8] shadow-md hover:scale-105 transition"
            onClick={() => navigate("/profile")}
          />
        ) : (
          <div
            className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-full bg-[#e74c3c] text-white font-bold cursor-pointer shadow-md hover:scale-105 transition"
            onClick={() => navigate("/profile")}
          >
            {getInitials()}
          </div>
        )}

        {/* User Info */}
        <div className="hidden sm:flex flex-col">
          <span className="text-white font-semibold text-sm sm:text-base">
            {getFullname()}
          </span>
          <span className="text-[#94a3b8] text-xs">Online</span>
        </div>

        {/* Logout Button */}
        <button
          className="flex items-center justify-center w-10 h-10 rounded-full bg-[#1e293b] hover:bg-[#334155] text-green-400 hover:text-red-500 transition shadow-md"
          onClick={logout}
        >
          <i className="fa fa-power-off text-lg"></i>
        </button>
      </div>
    </header>
  );
};

export default Header;






// ORIGINAL CODE// 

// import React from 'react'
// import { useSelector } from 'react-redux'
// import { useNavigate } from 'react-router-dom'

// const Header = ({socket}) => {
//     const { user } = useSelector(state => state.userReducer)
//     const navigate = useNavigate()
    
//     const getFullname = () => {
//         let fname = user?.firstname.at(0).toUpperCase() + user?.firstname.slice(1).toLowerCase();
//         let lname = user?.lastname?.at(0).toUpperCase() + user?.lastname.slice(1).toLowerCase();
//         return fname + ' ' + lname;

//     }

//     const getInitials = () => {
//         let f = user?.firstname.toUpperCase()[0];
//         let l = user?.lastname.toUpperCase()[0];
//         return f + l;
//     }

//     const logout = () => {
//       localStorage.removeItem('token')
//       navigate('/login')
//       socket.emit('user-offline' , user._id)
//     }

//   return (
//   <div className="flex flex-wrap w-full px-8 py-2.5 justify-between border-b border-[#bbb]">

//   <div className="flex flex-nowrap text-[#28282B] text-[25px] font-bold">
//     <i className="fa fa-comments mx-2.5 my-1.5" aria-hidden="true"></i>
//           Chit Chat
//   </div>

//   <div className="flex">

//     {
//       user?.profilePic && 
//       <img src={user.profilePic} 
//       alt='profile-pic' 
//       className="w-10 h-10 rounded-full bg-[#e74c3c] text-white text-[20px] font-bold text-center leading-[40px] cursor-pointer"
//       onClick={ () => navigate('/profile')}>
//       </img>
//     }

//     {
//       !user?.profilePic && 
//       <div className="w-10 h-10 rounded-full bg-[#e74c3c] text-white text-[20px] font-bold text-center leading-[40px]"
//       onClick={() => navigate('/profile')}>
//       {getInitials()}
//       </div>
//     }

//     <div className="text-[#28282B] font-bold pt-2.5 pr-5 ml-[15px]">
//       {getFullname()}
//     </div>

//     <button 
//         className="logout-button bg-transparent text-[#100d0d] border-none text-[18px] cursor-pointer"
//         onClick={logout} >
//         <i className="fa fa-power-off"></i>
//     </button>


//   </div>
// </div>

//   )
// }

// export default Header