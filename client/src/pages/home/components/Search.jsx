import React from "react";

const Search = ({ searchKey, setSearchKey }) => {
  return (
    <div className=" border-b border-gray-500 relative">
      <input
        type="text"
        placeholder="Search users or chats..."
        className="w-full h-12 px-5 pr-12 rounded-t-[7px] text-gray-200 border-none  bg-transparent bg-gray-700"
        value={searchKey}
        onChange={(e) => setSearchKey(e.target.value)}
      />
      <i
        className="fa fa-search absolute right-4 top-1/2 -translate-y-1/2 text-sm text-purple-300"
        aria-hidden="true"
      ></i>
    </div>
  );
};

export default Search;
