import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import ticketReducer from "./slices/ticketSlice";
import aiReducer from "./slices/aiSlice";
import chatReducer from "./slices/chatSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    tickets: ticketReducer,
    ai: aiReducer,
    chat: chatReducer,
  },
});

export default store;
