import React from "react";
import Svg, { Rect, Path } from "react-native-svg";

export const DownArrowIcon = () => {
  return (
    <Svg
      width="48"
      height="37"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Rect width="48" height="48" rx="24" fill="#E9FCE8" />
      <Path
        d="M24 31L30 25M24 31L18 25M24 31V17"
        stroke="#171717"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

