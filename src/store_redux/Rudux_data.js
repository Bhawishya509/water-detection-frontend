import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: [24.9142734,84.1862208],
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
      state.value = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { loction_taking_rudux } = counterSlice.actions

export default counterSlice.reducer