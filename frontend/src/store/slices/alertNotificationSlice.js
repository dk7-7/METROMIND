import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import alertNotificationService from '../../services/alertNotificationService';

export const fetchAll = createAsyncThunk(
  'alertNotification/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await alertNotificationService.getAll();
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to fetch alert notifications';
      return rejectWithValue(message);
    }
  }
);

export const markRead = createAsyncThunk(
  'alertNotification/markRead',
  async (id, { rejectWithValue }) => {
    try {
      await alertNotificationService.markRead(id);
      return id;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to mark alert as read';
      return rejectWithValue(message);
    }
  }
);

export const markAsRead = markRead;

export const create = createAsyncThunk(
  'alertNotification/create',
  async (data, { rejectWithValue }) => {
    try {
      return await alertNotificationService.create(data);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to create alert notification';
      return rejectWithValue(message);
    }
  }
);

let nextNotificationId = 1;

const alertNotificationSlice = createSlice({
  name: 'alertNotification',
  initialState: {
    items: [],
    notifications: [],
    selectedItem: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedItem: (state, action) => {
      state.selectedItem = action.payload;
    },
    addNotification: (state, action) => {
      const notification = {
        id: action.payload.id || `notif-${Date.now()}-${nextNotificationId++}`,
        message: typeof action.payload === 'string' ? action.payload : action.payload.message,
        type: (typeof action.payload === 'object' && action.payload.type) || 'info',
        duration: (typeof action.payload === 'object' && action.payload.duration) || 4000,
      };
      state.notifications.push(notification);
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (n) => n.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchAll
      .addCase(fetchAll.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAll.fulfilled, (state, action) => {
        state.loading = false;
        state.items = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchAll.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch alert notifications';
      })
      // markRead
      .addCase(markRead.fulfilled, (state, action) => {
        state.items = state.items.map((item) =>
          (item.alertId || item.id) === action.payload
            ? { ...item, isRead: true, read: true }
            : item
        );
      })
      // create
      .addCase(create.fulfilled, (state, action) => {
        if (action.payload) {
          state.items.unshift(action.payload);
        }
      });
  },
});

export const {
  clearError,
  setSelectedItem,
  addNotification,
  removeNotification,
  clearNotifications,
} = alertNotificationSlice.actions;

export default alertNotificationSlice.reducer;