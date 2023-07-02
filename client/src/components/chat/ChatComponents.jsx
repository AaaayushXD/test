import React, { useEffect, useRef, useState } from "react";
import { BsTelephone, BsCameraVideo, BsSend } from "react-icons/bs";
import { BiLink, BiSolidMessageAdd } from "react-icons/bi";
import { HiOutlineLogout } from "react-icons/hi";
import AVATAR1 from "../../assets/avatar1.png";
import AVATAR2 from "../../assets/avatar2.png";
import NYARI from "../../assets/nyari.jpg";
import LOGO from "../../assets/LC_white.png";
import axios from "axios";

/////////////////////////// Avatar ////////////////////////////////////
export const Avatar = (props) => {
  const img = [AVATAR1, NYARI];
  const bg = [
    "bg-red-200",
    "bg-green-200",
    "bg-blue-200",
    "bg-orange-200",
    "bg-purple-200",
    "bg-teal-200",
    "bg-pink-200",
    "bg-yellow-200",
    "bg-cyan-200",
    "bg-gray-200",
  ];
  const userIdBase10 = parseInt(props.userId, 16);
  const colorIndex = userIdBase10 % bg.length;
  const color = bg[colorIndex];
  const username = props.username;

  if (!username) return;
  const dpPic = username.toLowerCase().split(" ")[0];
  const dpName = username[0].toUpperCase();
  let dpBg;
  if (dpPic === "aayush") {
    dpBg = (
      <img
        src={img[0]}
        className="rounded-full w-full h-full flex items-center justify-center bg-slate-200 "
      />
    );
  } else if (dpPic === "niharika") {
    dpBg = (
      <img
        src={img[1]}
        className="rounded-full w-full h-full flex items-center justify-center bg-slate-50 "
      />
    );
  } else {
    dpBg = <div>{dpName}</div>;
  }

  return (
    <div
      className={
        "rounded-full text-[#5f5f5c] text-2xl font-bold flex  justify-center items-center" +
        " " +
        "w-[" +
        props.size +
        "px] " +
        "h-[" +
        props.size +
        "px] " +
        color
      }
    >
      {dpBg}
    </div>
  );
};

/////////////////////////////////////////////// Right side /////////////////////////////////////////////////////

/////////////////////////////////////////// Default chat area ////////////////////////////////////////
export const DefaultChatArea = () => {
  return (
    <div className="h-full w-full flex justify-center items-center text-[#eee]">
      <div>
        {/* Icon */}
        <div className="text-[80px] md:text-[100px] flex items-center justify-center mb-3">
          <BiSolidMessageAdd />
        </div>
        {/* Text */}
        <div className="flex flex-col justify-center items-center m-2 p-2 text-center">
          <p className="text-[#3e3e3e] text-xl">No message Selected.</p>
          <p className="text-[#3e3e3e]">
            Please select a message from the chat section. Keep Chating.
          </p>
        </div>
      </div>
    </div>
  );
};

/////////////////////////////////////// User selected chat area //////////////////////////////
export const ChatArea = (props) => {
  return (
    <div className="w-full h-full flex flex-col">
      <UserNav
        selectedUserName={props.selectedUserName}
        mid={props.selectedUser}
      />
      <MessageArea
        messages={props.messages}
        mid={props.mid}
        username={props.username}
        selectedUserName={props.selectedUserName}
      />
      <SendMessage
        submitMessage={props.onSubmit}
        value={props.value}
        changedValue={props.changedValue}
        sendFile={props.sendFile}
      />
    </div>
  );
};

export const UserNav = (props) => {
  return (
    <div className=" border-b border-b-[#272726] w-full">
      <div className=" flex justify-between items-center px-4 h-[80px] text-2xl ">
        <div className="flex justify-center items-center text-[#eee] gap-2 text-xl md:text-2xl">
          <Avatar
            size={50}
            username={props.selectedUserName}
            userId={props.mid}
          />
        </div>
        <div className="flex justify-center items-center gap-4 text-[#eee]">
          <BsTelephone />
          <BsCameraVideo />
        </div>
      </div>
    </div>
  );
};

export const MessageArea = (props) => {
  const lastMsg = useRef(null);

  useEffect(() => {
    lastMsg.current?.scrollIntoView();
  }, [props.messages]);

  const messages = props.messages;
  return (
    <div className="flex-grow text-[#eee] overflow-y-scroll">
      {messages.map((message) => {
        const senderOrRecieverBg =
          message.sender === props.mid
            ? "border border-[#272726] bg-[#272726]"
            : "border border-[#272726] ";
        const messagePosition =
          message.sender === props.mid ? "text-right  " : "text-left ";
        const dPImage =
          message.sender === props.mid
            ? props.username
            : props.selectedUserName;
        const dPId = message.sender === props.mid ? props.mid : message.sender;

        return (
          <div
            className={
              "flex mb-2 flex-row" +
              " " +
              (message.sender === props.mid
                ? "justify-end mr-2"
                : "justify-start ml-2")
            }
          >
            <div
              className={
                " flex items-end gap-1" +
                (message.sender === props.mid ? " flex-row-reverse " : "")
              }
            >
              <div className="h-[30px] w-[30px]">
                <Avatar size={30} username={dPImage} userId={dPId} />
              </div>

              <UserMessageBox
                senderId={message.sender}
                id={props.mid}
                text={message.text}
                checkBg={senderOrRecieverBg}
                position={messagePosition}
                file={message.file}
              />
            </div>
          </div>
        );
      })}
      <div ref={lastMsg}></div>
    </div>
  );
};

export const UserMessageBox = (props) => {
  const checked = props.checkBg;
  const msgPosition = props.position;

  return (
    <div className={" " + msgPosition}>
      <div
        className={
          "text-left inline-block m-1 py-3 px-4 rounded-[50px]" +
          " " +
          checked +
          " " +
          (props.senderId === props.id
            ? "rounded-br-[20px] "
            : "rounded-bl-[20px] ")
        }
      >
        {" "}
        {props.text}
        {props.file && (
          <div>
            <a
              target="_blank"
              className="underline flex items-center gap-1"
              href={axios.defaults.baseURL + "/uploads/" + props.file}
            >
              <BiLink />
              {props.file}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export const SendMessage = (props) => {
  return (
    <div className="flex w-full border-t border-t-[#272726]">
      <form onSubmit={props.submitMessage} className=" flex-grow">
        <div className="flex md:gap-3 w-full px-2 md:px-4 py-2">
          <label className=" p-1 md:p-3 text-xl md:text-2xl text-[#eee] cursor-pointer flex items-center justify-center">
            <input type="file" className="hidden" onChange={props.sendFile} />
            <BiLink />
          </label>
          <input
            onChange={props.changedValue}
            value={props.value}
            type="text"
            placeholder="Type a messages..."
            className=" bg-inherit w-[150px] border border-[#272726] rounded-[50px] flex-grow text-[#eee] px-3 py-2 md:w-full  focus:outline-none"
          />
          <button
            type="submit"
            className=" p-1 md:p-3 text-xl flex items-center justify-center md:text-2xl text-[#eee]"
          >
            <BsSend />
          </button>
        </div>
      </form>
    </div>
  );
};

/////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////// Left sideee ////////////////////////////////////////////////

export const UserTextPreview = ({
  id,
  username,
  onClick,
  selectedUser,
  online,
}) => {
  return (
    <div onClick={() => onClick(id)} key={id} className="w-[70px] md:w-full">
      <div
        className={
          "rounded-lg px-2 py-3 flex justify-center md:justify-start items-center gap-3 cursor-pointer hover:bg-[#2c2c2bb9] " +
          (selectedUser ? " bg-[#272726]" : "")
        }
      >
        <div>
          <Avatar
            online={online}
            size={50}
            img={AVATAR1}
            username={username}
            userId={id}
          />
        </div>
        <div className=" flex-col hidden md:flex">
          <span className=" text-[#eee] md:text-2xl">
            {username && username[0].toUpperCase() + username.slice(1)}
          </span>
        </div>
      </div>
    </div>
  );
};

export const LogoutBtn = (props) => {
  return (
    <div className="p-2 text-center">
      <button
        className="text-xl font-bold py-2 px-2 text-[#eee] rounded-lg  border border-[#39b2ad] hover:bg-[#39b2ad] hover:text-[#3e3e3e] hover:scale-105 "
        onClick={props.onClick}
      >
        <div className="flex justify-center items-center gap-2">
          <HiOutlineLogout />
          <p className="hidden md:block">Logout</p>
        </div>
      </button>
    </div>
  );
};

export const LeftNav = (props) => {
  return (
    <div className="mb-4 px-2 flex items-center justify-between">
      <img src={LOGO} className="w-[40px] h-[30px] md:w-[50px] md:h-[40px]" />
      <div className="hidden md:block">
        <Avatar
          img={AVATAR2}
          size={50}
          username={props.username}
          userId={props.id}
        />
      </div>
    </div>
  );
};

// user2 - #272726
// onhiver - #2c2c2bb9
// button - #39b2ad
