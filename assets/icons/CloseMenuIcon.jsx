import React from "react";
import Svg, { Rect } from "react-native-svg";

const CloseMenuIcon = () => {
  return (
    <Svg
      width="29"
      height="29"
      viewBox="0 0 29 29"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Rect
        x="2.86719"
        y="22.6104"
        width="27.6157"
        height="4.14235"
        rx="2.07118"
        transform="rotate(-45 2.86719 22.6104)"
        fill="#808080"
      />
      <Rect
        width="27.6157"
        height="4.14235"
        rx="2.07118"
        transform="matrix(-0.707107 -0.707107 -0.707107 0.707107 25.3232 22.6099)"
        fill="#808080"
      />
    </Svg>
  );
};

export default CloseMenuIcon;
