import React, { useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../login/UserContext";
import {
  ButtonElement,
  InputField,
  SocialIcon,
  LogoBar,
} from "./formComponent";

export const Form = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setUsername: setLoggedInUsername, setId } = useContext(UserContext);
  const [loggedIn, setLoggedIn] = useState(true);

  const handleUsername = (ev) => {
    const name = ev.target.value;
    setUsername(name);
  };
  const handlePassword = (ev) => {
    const pass = ev.target.value;
    setPassword(pass);
  };

  const handleSubmit = async function (ev) {
    ev.preventDefault();
    const url = loggedIn ? 'register' : 'login';
    const { data } = await axios.post(url, { username, password });
    console.log(data._id + " " + username + "  " + password);
    setLoggedInUsername(username);
    setId(data._id);
  };
  return (
    <div className="bg-[#010001] text-[#dae4e5] w-full h-screen flex flex-col justify-center items-center overflow-x-hidden">
      {/* Nav */}
      <LogoBar />
      {/* Container */}
      <div className=" w-[500px] lg:w-[1000px]  h-[500px] flex flex-col justify-center items-center">
        {/* Header */}
        <div>
          {loggedIn ? (
            <h1 className="mb-6 text-4xl text-center sm:text-5xl font-bold">
              Create an <span className="text-[#39b2ad]">Account</span>
            </h1>
          ) : (
            <h1 className="mb-6 text-4xl text-center sm:text-5xl font-bold">
              Log<span className="text-[#39b2ad]">in</span>
            </h1>
          )}
        </div>

        {/* Form */}
        <div className="m-2">
          <form
            className="flex flex-col justify-center items-center"
            onSubmit={handleSubmit}
          >
            <InputField
              type="text"
              name="username"
              placeholder="Username"
              onChange={handleUsername}
              value={username}
            />
            <InputField
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={handlePassword}
            />
            <ButtonElement name={loggedIn ? "Register" : "Login"} />
          </form>

          {/* social icons */}
          {/* <div className="mt-10 mb-3">
            <p className="text-center text-[#5c5b5b]">
              or {loggedIn ? "Sign" : "Log"} in with
            </p>
          </div>
          <SocialIcon />*/}
          <div className="mt-5">
            <p className="text-center text-[#5c5b5b]">
              {loggedIn ? `Already have account? ` : "Create new Account. "}

              {loggedIn ? (
                <button
                  name="loginBtn"
                  className="hover:underline"
                  onClick={() => setLoggedIn(false)}
                >
                  Login
                </button>
              ) : (
                <button
                  name="registerBtn"
                  className="hover:underline"
                  onClick={() => setLoggedIn(true)}
                >
                  Register
                </button>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

//  <div className="w-full bg-[#010001] text-[#dae4e5] h-screen flex justify-center items-center overflow-x-hidden">
//       <form className="w-64 mx-auto mb-12 text-[#111]" onSubmit={register}>
//         <InputField
//           type="text"
//           placeholder="Username"
//           name="username"
//           value={username}
//           onChange={handleUsername}
//         />
//         <InputField
//           type="password"
//           placeholder="Password"
//           name="password"
//           value={password}
//           onChange={handlePassword}
//         />
//         <ButtonElement name="Register" />
//         <div className="text-center mt-2 text-[#efefef]">
//           Already a member? <a href="">Login here</a>
//         </div>
//       </form>
//     </div>
