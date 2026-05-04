import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../api/axiosClient";

/* ── Thunks ─────────────────────────────────────────────────────────────── */

export const getAllChats = createAsyncThunk(
  "chat/getAllChats",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.get("/chat/getAllChats");
      // The backend returns { status: true, message: "...", data: chats }
      return data.data; 
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch chats");
    }
  },
);

export const getChatById = createAsyncThunk(
  "chat/getChatById",
  async (chatId, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.get(`/chat/getChatById/${chatId}`);
      // The backend returns { status: true, message: "...", data: messages }
      return { chatId, messages: data.data };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch chat details");
    }
  },
);

export const startChat = createAsyncThunk(
  "chat/startChat",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.post("/chat/startChat");
      // The backend returns { success: true, chatId: "..." }
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to start chat");
    }
  },
);

export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async ({ chatId, message, sender }, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.post(`/chat/sendMsg/${chatId}`, { message, sender });
      return data.data; // The new message object
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to send message");
    }
  },
);


/* ── Slice ──────────────────────────────────────────────────────────────── */

const initialState = {
  chats: [],
  activeChatMessages: [],
  activeChatId: null,
  loading: false,
  error: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    clearChatState(state) {
      state.chats = [];
      state.activeChatMessages = [];
      state.activeChatId = null;
      state.error = null;
    },
    setActiveChat(state, action) {
      state.activeChatId = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      /* Get All Chats */
      .addCase(getAllChats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllChats.fulfilled, (state, action) => {
        state.loading = false;
        state.chats = action.payload || [];
      })
      .addCase(getAllChats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      /* Get Chat By ID */
      .addCase(getChatById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getChatById.fulfilled, (state, action) => {
        state.loading = false;
        state.activeChatId = action.payload.chatId;
        state.activeChatMessages = action.payload.messages || [];
      })
      .addCase(getChatById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      /* Start Chat */
      .addCase(startChat.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(startChat.fulfilled, (state, action) => {
        state.loading = false;
        state.activeChatId = action.payload.chatId;
        // Optionally, one could trigger fetching the chat list again, 
        // but typically the app navigates or dispatches it.
      })
      .addCase(startChat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      /* Send Message */
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.activeChatMessages.push(action.payload);
      });

  },
});

export const { clearChatState, setActiveChat } = chatSlice.actions;
export default chatSlice.reducer;
