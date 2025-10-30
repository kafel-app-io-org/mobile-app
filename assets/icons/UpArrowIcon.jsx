import React from "react";
import Svg, { Rect, Path } from "react-native-svg";

export const UpArrowIcon = () => {
  return (
    <Svg
      width="48"
      height="37"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Rect width="48" height="48" rx="24" fill="#FCE8EA" />
      <Path
        d="M24 17L30 23M24 17L18 23M24 17V31"
        stroke="#171717"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
