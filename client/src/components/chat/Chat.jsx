import React, { useContext, useEffect, useState, useRef } from "react";
import LOGO from "../../assets/LC_black.png";
import {
  ChatArea,
  DefaultChatArea,
  LeftNav,
  LogoutBtn,
  UserTextPreview,
} from "./ChatComponents";
import { UserContext } from "../login/UserContext";
import { uniqBy } from "lodash";
import axios from "axios";

export const Chat = () => {
  const [ws, setWs] = useState(null);
  const [onlineUser, setOnlineUser] = useState({});
  const [offlineUser, setOfflineUser] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const { username, id, setId, setUsername } = useContext(UserContext);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    connectToWs();
  }, [selectedUser]);

  function connectToWs() {
    const ws = new WebSocket("ws:////localhost:3001");
    setWs(ws);
    ws.addEventListener("message", handleMessage);
    ws.addEventListener("close", () => {
      setTimeout(() => {
        console.log("Trying to reconnect");
        connectToWs();
      }, 1000);
    });
  }

  function showOnlinePeople(peopleArray) {
    const people = {};
    peopleArray.forEach(({ userId, username }) => {
      people[userId] = username;
    });
    setOnlineUser(people);
  }

  function handleMessage(ev) {
    const messageData = JSON.parse(ev.data);
    if ("online" in messageData) {
      showOnlinePeople(messageData.online);
    } else if ("text" in messageData) {
      if (messageData.sender === selectedUser) {
        setMessages((prev) => [...prev, { ...messageData }]);
      }
    }
  }

  function submitMessage(ev, file = null) {
    if (ev) ev.preventDefault();

    ws.send(
      JSON.stringify({
        recipient: selectedUser,
        text: newMessage,
        file,
      })
    );

    if (file) {
      axios.get("/messages/" + selectedUser).then((res) => {
        setMessages(res.data);
      });
    } else {
      setNewMessage(" ");
      setMessages((prev) => [
        ...prev,
        {
          text: newMessage,
          sender: id,
          recipient: selectedUser,
          _id: Date.now(),
        },
      ]);
    }
  }
  useEffect(() => {
    if (selectedUser) {
      axios.get(`/messages/${selectedUser}`).then((res) => {
        setMessages(res.data);
      });
    }
  }, [selectedUser]);

  useEffect(() => {
    axios.get("/people").then((res) => {
      const offlineUserArray = res.data
        .filter((p) => p._id !== id)
        .filter((p) => !Object.keys(onlineUser).includes(p._id));

      const offlineUser = {};
      offlineUserArray.forEach((p) => {
        offlineUser[p._id] = p;
      });
      setOfflineUser(offlineUser);
    });
  }, [onlineUser]);

  function messageChangedValue(ev) {
    setNewMessage(ev.target.value);
  }

  function handleLogout() {
    axios.post("/logout").then(() => {
      setWs(null);
      setId(null);
      setUsername(null);
    });
  }

  function sendFile(ev) {
    const reader = new FileReader();
    reader.readAsDataURL(ev.target.files[0]);
    reader.onload = () => {
      submitMessage(null, {
        info: ev.target.files[0].name,
        data: reader.result,
      });
    };
  }

  const otherContact = { ...onlineUser };
  delete otherContact[id];

  const filteredMessage = uniqBy(messages, "_id");

  return (
    <div className="flex h-screen w-full">
      {/* Left Container */}
      <div className="bg-[#010001] flex flex-col w-[100px]  md:w-1/3 text-[#dedede] px-2 pt-4 ">
        <div className="flex-grow">
          {/* Logo and Avatar */}
          <LeftNav username={username} id={id} />
          {/* Online users */}

          {Object.keys(otherContact).map((userId) => {
            return (
              <UserTextPreview
                key={userId}
                id={userId}
                username={onlineUser[userId]}
                onClick={() => setSelectedUser(userId)}
                online={true}
                selectedUser={userId === selectedUser}
              />
            );
          })}
          {/* Offline User */}
          {Object.keys(offlineUser).map((userId) => {
            return (
              <UserTextPreview
                key={userId}
                id={userId}
                username={offlineUser[userId].username}
                onClick={() => setSelectedUser(userId)}
                online={false}
                selectedUser={userId === selectedUser}
              />
            );
          })}
        </div>
        {/* Logout Btn */}
        <LogoutBtn onClick={handleLogout} />
      </div>
      {/* Right Container */}
      <div className="bg-[#010001] w-full overflow-x-hidden md:w-2/3 flex flex-col border-l border-[#272726]">
        {selectedUser ? (
          <ChatArea
            value={newMessage}
            username={username}
            mid={id}
            messages={filteredMessage}
            onSubmit={submitMessage}
            changedValue={messageChangedValue}
            sendFile={sendFile}
            selectedUser={selectedUser}
            selectedUserName={onlineUser[selectedUser]}
          />
        ) : (
          <DefaultChatArea />
        )}
      </div>
    </div>
  );
};
