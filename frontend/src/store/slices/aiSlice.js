import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../api/axiosClient";

/* ── Thunks ─────────────────────────────────────────────────────────────── */

export const getAIResponse = createAsyncThunk(
  "ai/respond",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.post("/ai/respond", payload);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "AI response failed");
    }
  },
);

export const getAISuggestion = createAsyncThunk(
  "ai/suggest",
  async ({ ticketId, agentDraft }, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.post(`/ai/suggest/ticket/${ticketId}`, { agentDraft });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "AI suggestion failed");
    }
  },
);

/* ── Slice ──────────────────────────────────────────────────────────────── */

const initialState = {
  response: null,
  suggestion: null,
  loading: false,
  error: null,
};

const aiSlice = createSlice({
  name: "ai",
  initialState,
  reducers: {
    clearAI(state) {
      state.response = null;
      state.suggestion = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAIResponse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAIResponse.fulfilled, (state, action) => {
        state.loading = false;
        state.response = action.payload;
      })
      .addCase(getAIResponse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getAISuggestion.fulfilled, (state, action) => {
        state.suggestion = action.payload;
      });
  },
});

export const { clearAI } = aiSlice.actions;
export default aiSlice.reducer;
