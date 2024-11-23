import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: [{lat:24.927735, lon: 84.190984}],  // this is default dehri on sone lat and lon
  city_and_near_loction_name:["DEHRI"]
}





export const counterSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    // increment: (state) => {
    //   // Redux Toolkit allows us to write "mutating" logic in reducers. It
    //   // doesn't actually mutate the state because it uses the Immer library,
    //   // which detects changes to a "draft state" and produces a brand new
    //   // immutable state based off those changes
    //   state.value += 1
      // },
      

  

    
      // this is taking loction from search compoennt and set it
      
    loction_taking_rudux: (state, action) => {
      // state.value = action.payload
      
      state.value = action.payload;
  
    },
    city_name_set: (state, action) => {
      state.city_and_near_loction_name = action.payload.loc_name;
    }
    
  },
})

// Action creators are generated for each case reducer function
export const { loction_taking_rudux ,city_name_set} = counterSlice.actions

export default counterSlice.reducer