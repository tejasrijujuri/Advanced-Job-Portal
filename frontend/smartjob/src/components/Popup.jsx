import "../css/Popup.css";

export default function Popup({ show, message, type }) {
  if (!show) return null;

  return (
    <div className={`popup ${type}`}>
      {message}
    </div>
  );
}