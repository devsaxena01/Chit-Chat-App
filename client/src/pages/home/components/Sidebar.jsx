import React, { useState } from "react";
import Search from "./Search";
import UserList from "./UserList";

const Sidebar = ({ socket, onlineUser }) => {
  const [searchKey, setSearchKey] = useState("");

  return (
    <div className=" flex flex-col h-[92vh] overflow-hidden border-r border-gray-500    bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a]
 p-3 shadow-lg  mr-">
      
      {/* Sidebar Header */}
      <h2 className="text-2xl sm:text-3xl lg:text-3xl font-bold mb-4 text-cyan-400">
        Chit Chat
      </h2>

      {/* Search Component */}
      <div className="mb-">
        <Search searchKey={searchKey} setSearchKey={setSearchKey} />
      </div>

      {/* User List */}
      <div className="flex-1 h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-slate-800">
        <UserList
          searchKey={searchKey}
          socket={socket}
          onlineUser={onlineUser}
        />
      </div>
    </div>
  );
};

export default Sidebar;




// ORIGINAL CODE //

// import React, { useState } from 'react'
// import Search from './Search'
// import UserList from './UserList'

// const Sidebar = ({socket , onlineUser}) => {
//     const [searchKey , setSearchKey] = useState('')
//   return (
//     <div className="w-[30%] px-5">
//         <Search
//             searchKey = {searchKey}
//             setSearchKey = {setSearchKey}
//         />
//         <UserList 
//         searchKey = {searchKey} 
//         socket={socket}
//         onlineUser={onlineUser}
//         />
//     </div>
//   )
// }

// export default Sidebar