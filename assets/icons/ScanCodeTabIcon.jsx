import React from "react";
import Svg, { Path, Rect } from "react-native-svg";

const ScanCodeTabIcon = ({ stroke = "#9DB2CE", fill = "none" }) => {
  return (
    <Svg
      width="80"
      height="80"
      viewBox="0 0 50 50"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: [{ translateY: -5 }] }} // move up by 30px
    >
      <Rect
        x="0.669922"
        y="0.165039"
        width="48.9897"
        height="48.9897"
        rx="24.4948"
        fill="#202226"
      />
      <Path
        d="M14.9587 21.5979V19.0464C14.9587 16.5051 17.0102 14.4536 19.5515 14.4536H22.1031"
        stroke="white"
        strokeWidth="1.53093"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M28.2266 14.4536H30.7781C33.3194 14.4536 35.3709 16.5051 35.3709 19.0464V21.5979"
        stroke="white"
        strokeWidth="1.53093"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M35.371 28.7422V30.2731C35.371 32.8145 33.3196 34.8659 30.7782 34.8659H29.2473"
        stroke="white"
        strokeWidth="1.53093"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M22.1031 34.866H19.5515C17.0102 34.866 14.9587 32.8146 14.9587 30.2732V27.7217"
        stroke="white"
        strokeWidth="1.53093"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M30.268 22.1082V27.2113C30.268 29.2526 29.2473 30.2732 27.2061 30.2732H23.1236C21.0824 30.2732 20.0618 29.2526 20.0618 27.2113V22.1082C20.0618 20.067 21.0824 19.0464 23.1236 19.0464H27.2061C29.2473 19.0464 30.268 20.067 30.268 22.1082Z"
        stroke="white"
        strokeWidth="1.53093"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M32.3092 24.6599H18.0205"
        stroke="white"
        strokeWidth="1.53093"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default ScanCodeTabIcon;
