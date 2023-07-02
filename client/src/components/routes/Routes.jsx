import React, { useContext } from "react";
import { UserContext } from "../login/UserContext";
import { Form } from "../account/Form";
import { Chat } from "../chat/Chat";

export default function Routes() {
  const { username, id } = useContext(UserContext);
  if (username) {
    return <Chat />
  }
  return <Form />;
}
