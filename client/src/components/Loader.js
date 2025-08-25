import React from 'react'

const Loader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center  backdrop-blur-sm z-50">
      <div className="flex flex-col items-center">
        <div className="relative w-10 h-10">
          <div className="w-full h-full rounded-full border-2 border-t-transparent border-white animate-spin-custom"></div>
        </div>
            <p className="mt-4 text-white text-lg font-medium animate-pulse">Please wait...</p>
     </div>
   </div>

  )
}

export default Loader