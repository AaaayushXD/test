import React from "react";
import "../index.css";

export const About = () => {
  return (
    <div name="about" className="w-full h-screen bg-[#1b202d] text-[#708097]">
      <div className="flex flex-col justify-center items-center w-full h-full">
        <div className="max-w-[1000px] w-full grid grid-cols-2 gap-8">
          <div className="sm:text-right pb-8 pl-4">
            <p className="text-4xl font-bold inline border-b-4 border-[#39b2ad] text-[#edefef]">
              About
            </p>
          </div>
          <div></div>
        </div>
        <div className="max-w-[1000px] w-full grid  sm:grid-cols-2 gap-8 px-4">
          <div>
            <p className="sm:text-right text-4xl font-bold text-[#edefef] ">
              Hi, I'm Aayush. I am a dedicated and passionate full-stack MERN
              developer.
            </p>
          </div>
          <div>
            <p>
              Through extensive research on online resources as well as
              self-guided learning and hands-on projects, I have gained
              proficiency in the MERN stack, encompassing MongoDB, Express.js,
              React.js, and Node.js. My goal is to leverage my skills and
              knowledge to contribute to innovative web applications that solve
              real-world problems.As a new developer, I am excited to embark on
              a career path that aligns with my passion for coding and
              problem-solving. I am open to internships, freelance projects, or
              entry-level positions that offer the opportunity to learn and grow
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
