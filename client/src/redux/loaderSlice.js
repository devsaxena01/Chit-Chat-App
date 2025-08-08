import {createSlice} from "@reduxjs/toolkit"

const loaderSlice = createSlice({
    name:'loader',
    initialState:{loader:false},
    reducers:{
        showLoader:(state) => {state.loader = true},
        hideLoader:(state) => {state.loader = false}
    }
})

export const {showLoader , hideLoader} = loaderSlice.actions // it will return us the reducers properties

export default loaderSlice.reducer