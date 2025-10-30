import React from "react";
import Svg, { Path, Rect } from "react-native-svg";

export const MinusIcon = () => {
  return (
    <Svg
      width="48"
      height="37"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Rect width="48" height="48" rx="24" fill="#F9EED7" />
      <Path
        d="M29.5 25.5H18.5C17.68 25.5 17 24.82 17 24C17 23.18 17.68 22.5 18.5 22.5H29.5C30.32 22.5 31 23.18 31 24C31 24.82 30.32 25.5 29.5 25.5Z"
        fill="#252425"
      />
    </Svg>
  );
};

