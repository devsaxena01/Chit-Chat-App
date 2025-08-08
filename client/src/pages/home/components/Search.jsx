import React from 'react'

const Search = ({searchKey , setSearchKey}) => {
  return (
    <div className="mb-5 relative">
      <input
        type="text"
        className="w-full h-10 px-5 py-2 border border-[#ddd] rounded-full text-[#28282B] outline-none"
        value={searchKey}
        onChange={(e) => setSearchKey(e.target.value)}
      />
       <i className="fa fa-search absolute right-2.5 top-1/2 -translate-y-1/2 text-[25px] text-[#e74c3c]" aria-hidden="true"></i>
  </div>

  )
}

export default Search