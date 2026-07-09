import React, { useEffect, useState } from "react";
import axios from "axios";

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  const token = localStorage.getItem("access"); // IMPORTANT (same as login token)

  // -----------------------------
  // FETCH NOTIFICATIONS
  // -----------------------------
  const fetchNotifications = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/api/notifications/notifications/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotifications(res.data);
    } catch (err) {
      console.log("Notification error:", err.message);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // LIVE polling (every 5 sec)
    const interval = setInterval(fetchNotifications, 5000);

    return () => clearInterval(interval);
  }, []);

  // -----------------------------
  // MARK AS READ
  // -----------------------------
  const markAsRead = async (id) => {
    try {
      await axios.patch(
        `http://127.0.0.1:8000/api/notifications/notifications/${id}/mark_read/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchNotifications(); // refresh UI
    } catch (err) {
      console.log("Mark read error:", err.message);
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      {/* Bell Icon */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          fontSize: "20px",
          cursor: "pointer",
          position: "relative",
          padding: "6px 10px",
        }}
      >
        🔔

        {unreadCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: "-5px",
              right: "-5px",
              background: "red",
              color: "white",
              borderRadius: "50%",
              fontSize: "12px",
              padding: "2px 6px",
            }}
          >
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: "40px",
            width: "320px",
            background: "#fff",
            border: "1px solid #ddd",
            borderRadius: "8px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            zIndex: 999,
          }}
        >
          <h4 style={{ margin: 0, padding: "10px", borderBottom: "1px solid #eee" }}>
            Notifications
          </h4>

          {notifications.length === 0 ? (
            <p style={{ padding: "10px" }}>No notifications</p>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => markAsRead(n.id)}
                style={{
                  padding: "10px",
                  borderBottom: "1px solid #eee",
                  cursor: "pointer",
                  background: n.is_read ? "#fff" : "#f0f8ff",
                }}
              >
                {n.message}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;