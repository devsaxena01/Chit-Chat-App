import {createSlice} from "@reduxjs/toolkit"

const usersSlice = createSlice({
    name:'user',
    initialState:{
        user:null ,
         allUsers:[] ,
          allChats:[] ,
          selectedChat:null ,

        },
    reducers:{
        setUser:(state , action) => {state.user = action.payload},
        setAllUsers:(state , action) => {state.allUsers = action.payload},
        setAllChats:(state , action) => {state.allChats = action.payload},
        selectedChat:(state , action) => {state.selectedChat = action.payload},
    }
})

export const {setUser , setAllUsers , setAllChats , selectedChat} = usersSlice.actions // it will return us the reducers properties

export default usersSlice.reducer