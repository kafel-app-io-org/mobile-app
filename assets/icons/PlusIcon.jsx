import React from "react";
import Svg, { Path, Rect } from "react-native-svg";

export const PlusIcon = () => {
  return (
    <Svg
      width="48"
      height="37"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Rect width="48" height="48" rx="24" fill="#E8F9FC" />
      <Path
        d="M29.5 25.4993H18.5C17.68 25.4993 17 24.8193 17 23.9993C17 23.1793 17.68 22.4993 18.5 22.4993H29.5C30.32 22.4993 31 23.1793 31 23.9993C31 24.8193 30.32 25.4993 29.5 25.4993Z"
        fill="#171717"
      />
      <Path
        d="M24 31C23.18 31 22.5 30.32 22.5 29.5V18.5C22.5 17.68 23.18 17 24 17C24.82 17 25.5 17.68 25.5 18.5V29.5C25.5 30.32 24.82 31 24 31Z"
        fill="#171717"
      />
    </Svg>
  );
};

