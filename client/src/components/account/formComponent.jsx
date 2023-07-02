import React from "react";
import { BiLogoGmail, BiLogoFacebook } from "react-icons/bi";
import { FaFacebook, FaGithub } from "react-icons/fa6";
import LC_WHITE from "../../assets/LC_white.png";
import LOGO from "../../assets/aayushlogo.png";

export const InputField = (props) => {
  return (
    <input
      type={props.type}
      placeholder={props.placeholder}
      value={props.value}
      onChange={props.onChange}
      name={props.name}
      className="block w-full rounded-[15px] p-2 mb-4 bg-transparent border-0 border-b-2 border-transparent shadow-[#4af5ef71] focus:outline-0 shadow-md hover:border-b-2 hover:border-b-[#39b2ad] hover:bg-[#141414ad] focus:border-b-[#39b2ad] focus:bg-[#141414ad]"
    />
  );
};

export const ButtonElement = (props) => {
  return (
    <button className="border-2 border-[#39b2ad] text-[#f5fbfc] text-2xl block w-[150px] rounded-[25px] p-2 mt-2 shadow-md shadow-[#39b2ad] hover:bg-[#39b2ad] hover:border-transparent hover:shadow-none font-bold tracking-wide">
      {props.name}
    </button>
  );
};

export const IconField = (props) => {
  return (
    <div className="w-[50px] h-[50px] m-2 rounded-[50%] flex justify-center items-center  text-[#eee] text-3xl border-[1px] cursor-pointer  hover:bg-[#33303077] hover:border-transparent">
      {props.name}
    </div>
  );
};


const mail = <BiLogoGmail />;
const facebook = <FaFacebook />;
const github = <FaGithub />;

export const SocialIcon = () => {
  return (
    <div className="flex justify-around">
      <IconField name={mail} />
      <IconField name={facebook} />
      <IconField name={github} />
    </div>
  );
}

export const LogoBar = () => {
  return (
    <div className="w-full h-[70px] px-4 flex justify-between absolute top-3">
      <img src={LC_WHITE} className="w-[70px] h-[50px] rounded-md" />
      <img src={LOGO} className="w-[50px] h-[30px] rounded-md" />
    </div>
  );
}