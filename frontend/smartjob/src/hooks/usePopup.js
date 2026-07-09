import { useState } from "react";

export default function usePopup() {
  const [popup, setPopup] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const showPopup = (message, type = "success") => {
    setPopup({
      show: true,
      message,
      type,
    });

    setTimeout(() => {
      setPopup({
        show: false,
        message: "",
        type: "success",
      });
    }, 3000);
  };

  return {
    popup,
    showPopup,
  };
}