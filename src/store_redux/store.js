import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./Rudux_data";

export const store = configureStore({
  reducer: {
    location: counterReducer,
  },
});
