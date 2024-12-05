import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notifications: [
    {
      notification_id: 1,
      user_id: 101,
      content: "Your contract has been updated.",
      type: "contract_update",
      is_read: false,
      created_at: "2024-12-04T10:15:23",
      profile_picture: "https://res.cloudinary.com/dl6g2mzft/image/upload/v1729970538/samples/smile.jpg",
    },
  
    {
      notification_id: 2,
      user_id: 102,
      content: "You received a new review!",
      type: "review",
      is_read: true,
      created_at: "2024-12-04T09:45:10",
      profile_picture: "https://res.cloudinary.com/dl6g2mzft/image/upload/v1729970538/samples/smile.jpg",
    },
    {
      notification_id: 3,
      user_id: 103,
      content: "Welcome to our platform!",
      type: "general",
      is_read: false,
      created_at: "2024-12-03T14:32:00",
      profile_picture: "https://res.cloudinary.com/dl6g2mzft/image/upload/v1729970538/samples/smile.jpg",
    },
    {
      notification_id: 4,
      user_id: 104,
      content: "Your review has been approved.",
      type: "review",
      is_read: true,
      created_at: "2024-12-02T18:20:45",
      profile_picture: "https://res.cloudinary.com/dl6g2mzft/image/upload/v1729970538/samples/smile.jpg",
    },
    {
      notification_id: 5,
      user_id: 101,
      content: "Your subscription has been renewed.",
      type: "general",
      is_read: false,
      created_at: "2024-12-04T08:10:15",
      profile_picture: "https://res.cloudinary.com/dl6g2mzft/image/upload/v1729970538/samples/smile.jpg",
    }
  ]
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    markAsRead: (state, action) => {
      const { notification_id } = action.payload;
      const notification = state.notifications.find(n => n.notification_id === notification_id);
      if (notification) {
        notification.is_read = true;
      }
    },
    addNotification: (state, action) => {
      const newNotification = action.payload;
      state.notifications.push(newNotification);
    },
    deleteNotification: (state, action) => {
      const { notification_id } = action.payload;
      state.notifications = state.notifications.filter(n => n.notification_id !== notification_id);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    }
  }
});

export const { markAsRead, addNotification, deleteNotification, clearNotifications } = notificationsSlice.actions;

export default notificationsSlice.reducer;
