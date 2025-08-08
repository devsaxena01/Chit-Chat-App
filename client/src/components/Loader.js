import React from 'react'

const Loader = () => {
  return (
    <div class="fixed inset-0 flex items-center justify-center bg-red-500/40 backdrop-blur-sm z-50">
      <div class="flex flex-col items-center">
        <div class="relative w-16 h-16">
          <div class="w-full h-full rounded-full border-4 border-t-transparent border-white animate-spin-custom"></div>
        </div>
            <p class="mt-4 text-white text-lg font-medium animate-pulse">Loading...</p>
     </div>
   </div>

  )
}

export default Loader