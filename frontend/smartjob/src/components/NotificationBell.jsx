import { useEffect, useState } from "react";
import axios from "axios";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  const token = localStorage.getItem("access");

  // ----------------------------
  // FETCH NOTIFICATIONS
  // ----------------------------
  const fetchNotifications = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/api/notifications/",
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

  // ----------------------------
  // MARK AS READ
  // ----------------------------
  const markAsRead = async (id) => {
    try {
      await axios.patch(
        `http://127.0.0.1:8000/api/notifications/${id}/mark_read/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchNotifications();
    } catch (err) {
      console.log("Mark read error:", err.message);
    }
  };

  // ----------------------------
  // LIVE POLLING
  // ----------------------------
  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(fetchNotifications, 5000);

    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  // ----------------------------
  // UI
  // ----------------------------
  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      {/* Bell */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          fontSize: "20px",
          cursor: "pointer",
          position: "relative",
          padding: "5px 10px",
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
            top: "35px",
            width: "300px",
            background: "white",
            border: "1px solid #ddd",
            borderRadius: "6px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            zIndex: 1000,
          }}
        >
          <h4 style={{ padding: "10px", margin: 0 }}>Notifications</h4>

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
                  background: n.is_read ? "#fff" : "#f0f8ff",
                  cursor: "pointer",
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
}