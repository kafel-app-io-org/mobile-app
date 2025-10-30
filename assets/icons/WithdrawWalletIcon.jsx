import React from "react";
import Svg, { Rect, Path } from "react-native-svg";

const WithdrawWalletIcon = () => {
  return (
    <Svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M10 19.25C12.0416 19.25 13.6312 19.1395 14.874 18.8633C16.1083 18.589 16.9542 18.1611 17.5576 17.5576C18.1611 16.9542 18.589 16.1083 18.8633 14.874C19.1395 13.6312 19.25 12.0416 19.25 10C19.25 7.95837 19.1395 6.36884 18.8633 5.12598C18.589 3.89169 18.1611 3.04583 17.5576 2.44238C16.9542 1.83894 16.1083 1.41104 14.874 1.13672C13.6312 0.860502 12.0416 0.75 10 0.75C7.95837 0.75 6.36884 0.860502 5.12598 1.13672C3.89169 1.41104 3.04583 1.83894 2.44238 2.44238C1.83894 3.04583 1.41104 3.89169 1.13672 5.12598C0.860502 6.36884 0.75 7.95837 0.75 10C0.75 12.0416 0.860502 13.6312 1.13672 14.874C1.41104 16.1083 1.83894 16.9542 2.44238 17.5576C3.04583 18.1611 3.89169 18.589 5.12598 18.8633C6.36884 19.1395 7.95837 19.25 10 19.25Z"
        stroke="#202226"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M2.08301 6.66675L17.9163 6.66675"
        stroke="#202226"
        stroke-width="2"
        stroke-linecap="square"
        stroke-linejoin="round"
      />
      <Path
        d="M11.667 15H15.0003"
        stroke="#202226"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  );
};

export default WithdrawWalletIcon;
