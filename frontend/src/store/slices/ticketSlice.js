import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../api/axiosClient";

/* ── Thunks ─────────────────────────────────────────────────────────────── */

export const fetchAllTickets = createAsyncThunk(
  "tickets/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.get("/tickets/getAllTickets");
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch tickets");
    }
  },
);

export const fetchTicketById = createAsyncThunk(
  "tickets/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.get(`/tickets/getTicketById/${id}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch ticket");
    }
  },
);

export const createTicket = createAsyncThunk(
  "tickets/create",
  async (ticketData, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.post("/tickets/createTicket", ticketData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to create ticket");
    }
  },
);

export const updateTicket = createAsyncThunk(
  "tickets/update",
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.put(`/tickets/updateTicket/${id}`, updates);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update ticket");
    }
  },
);

export const deleteTicket = createAsyncThunk(
  "tickets/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axiosClient.delete(`/tickets/deleteTicket/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete ticket");
    }
  },
);

export const assignTicketToAgent = createAsyncThunk(
  "tickets/assignAgent",
  async ({ id, agentId }, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.put(`/tickets/ticketAssginedToAgent/${id}`, { agentId });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to assign ticket");
    }
  },
);

export const updateTicketStatus = createAsyncThunk(
  "tickets/updateStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.put(`/tickets/ticketStatusUpdate/${id}`, { status });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update status");
    }
  },
);

/* ── Slice ──────────────────────────────────────────────────────────────── */

const initialState = {
  tickets: [],
  currentTicket: null,
  loading: false,
  error: null,
};

const ticketSlice = createSlice({
  name: "tickets",
  initialState,
  reducers: {
    clearTicketError(state) {
      state.error = null;
    },
    clearCurrentTicket(state) {
      state.currentTicket = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* Fetch all */
      .addCase(fetchAllTickets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllTickets.fulfilled, (state, action) => {
        state.loading = false;
        state.tickets = action.payload.tickets || action.payload;
      })
      .addCase(fetchAllTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      /* Create */
      .addCase(createTicket.fulfilled, (state, action) => {
        state.tickets.push(action.payload.ticket || action.payload);
      })
      /* Update */
      .addCase(updateTicket.fulfilled, (state, action) => {
        const updated = action.payload.ticket || action.payload;
        const idx = state.tickets.findIndex(t => t._id === updated._id);
        if (idx !== -1) state.tickets[idx] = updated;
      })
      /* Delete */
      .addCase(deleteTicket.fulfilled, (state, action) => {
        state.tickets = state.tickets.filter(t => t._id !== action.payload);
      })
      /* Status/Assign */
      .addMatcher(
        (action) => action.type.endsWith("/assignAgent/fulfilled") || action.type.endsWith("/updateStatus/fulfilled"),
        (state, action) => {
          const updated = action.payload.ticket || action.payload;
          const idx = state.tickets.findIndex(t => t._id === updated._id);
          if (idx !== -1) state.tickets[idx] = updated;
        }
      );
  },
});

export const { clearTicketError, clearCurrentTicket } = ticketSlice.actions;
export default ticketSlice.reducer;
