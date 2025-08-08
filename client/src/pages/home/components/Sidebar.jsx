import React, { useState } from 'react'
import Search from './Search'
import UserList from './UserList'

const Sidebar = () => {
    const [searchKey , setSearchKey] = useState('')
  return (
    <div className="w-[30%] px-5">
        <Search
            searchKey = {searchKey}
            setSearchKey = {setSearchKey}
        />
        <UserList searchKey = {searchKey}/>
    </div>
  )
}

export default Sidebar