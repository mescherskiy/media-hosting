import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectGreenNotification, selectNotificationMessage, selectNotify, setGreenNotification, setNotificationMessage, showNotification } from "../slices/authSlice";

const Notification = () => {
  const dispatch = useDispatch()
  const notify = useSelector(selectNotify)
  const message = useSelector(selectNotificationMessage)
  const isGreen = useSelector(selectGreenNotification)

  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(showNotification(false))
      dispatch(setNotificationMessage(""))
      dispatch(setGreenNotification(false))
    }, 5000);

    return () => clearTimeout(timeout);
  }, [dispatch, notify]);

  //const classNames = notify ? "notification visible" : "notification"

  return <div className={`notification ${notify ? "visible" : ""} ${isGreen ? "green" : ""}`} >{message}</div>
};

export default Notification;