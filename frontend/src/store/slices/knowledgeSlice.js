import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../api/axiosClient";

export const fetchAllFAQ = createAsyncThunk(
  "knowledge/fetchAllFAQ",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get("/knowledge/getAllFAQ");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch FAQs");
    }
  }
);

export const createFAQ = createAsyncThunk(
  "knowledge/createFAQ",
  async (faqData, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post("/knowledge/createFAQ", faqData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to create FAQ");
    }
  }
);

export const updateFAQ = createAsyncThunk(
  "knowledge/updateFAQ",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axiosClient.put(`/knowledge/updateFAQ/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update FAQ");
    }
  }
);

export const deleteFAQ = createAsyncThunk(
  "knowledge/deleteFAQ",
  async (id, { rejectWithValue }) => {
    try {
      await axiosClient.delete(`/knowledge/deleteFAQ/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete FAQ");
    }
  }
);

const knowledgeSlice = createSlice({
  name: "knowledge",
  initialState: {
    faqs: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchAllFAQ
      .addCase(fetchAllFAQ.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllFAQ.fulfilled, (state, action) => {
        state.loading = false;
        state.faqs = action.payload.faqs || action.payload; // depending on backend response shape
      })
      .addCase(fetchAllFAQ.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // createFAQ
      .addCase(createFAQ.pending, (state) => {
        state.loading = true;
      })
      .addCase(createFAQ.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.faq) {
            state.faqs.push(action.payload.faq);
        } else {
            state.faqs.push(action.payload);
        }
      })
      .addCase(createFAQ.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // updateFAQ
      .addCase(updateFAQ.fulfilled, (state, action) => {
        const updatedFaq = action.payload.faq || action.payload;
        const index = state.faqs.findIndex(f => f._id === updatedFaq._id);
        if (index !== -1) {
          state.faqs[index] = updatedFaq;
        }
      })
      // deleteFAQ
      .addCase(deleteFAQ.fulfilled, (state, action) => {
        state.faqs = state.faqs.filter(f => f._id !== action.payload);
      });
  },
});

export default knowledgeSlice.reducer;
