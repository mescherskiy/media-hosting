import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectNotificationMessage, selectNotify, setNotificationMessage, showNotification } from "../slices/authSlice";

const Notification = () => {
  const dispatch = useDispatch()
  const notify = useSelector(selectNotify)
  const message = useSelector(selectNotificationMessage)

  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(showNotification(false))
      dispatch(setNotificationMessage(""))
    }, 5000);

    return () => clearTimeout(timeout);
  }, [dispatch, notify]);

  const classNames = notify ? "notification visible" : "notification"

  return <div className={classNames}>{message}</div>
};

export default Notification;