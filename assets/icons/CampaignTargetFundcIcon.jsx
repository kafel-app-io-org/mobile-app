import React from "react";
import Svg, { Path, G, Defs, Rect, ClipPath } from "react-native-svg";

const CampaignTargetFundcIcon = () => {
  return (
    <Svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <G clip-path="url(#clip0_197_429)">
        <Path
          d="M14.5 16.75H4.75C2.68 16.75 1 15.07 1 13V7.75C1 7.3375 1.3375 7 1.75 7C2.1625 7 2.5 7.3375 2.5 7.75V13C2.5 14.2375 3.5125 15.25 4.75 15.25H14.5C14.9125 15.25 15.25 15.5875 15.25 16C15.25 16.4125 14.9125 16.75 14.5 16.75ZM11.5 7.75C11.0875 7.75 10.75 8.0875 10.75 8.5C10.75 8.9125 11.0875 9.25 11.5 9.25C11.9125 9.25 12.25 8.9125 12.25 8.5C12.25 8.0875 11.9125 7.75 11.5 7.75ZM19 6.25V10.75C19 12.4075 17.6575 13.75 16 13.75H7C5.3425 13.75 4 12.4075 4 10.75V6.25C4 4.5925 5.3425 3.25 7 3.25H16C17.6575 3.25 19 4.5925 19 6.25ZM13.75 8.5C13.75 7.2625 12.7375 6.25 11.5 6.25C10.2625 6.25 9.25 7.2625 9.25 8.5C9.25 9.7375 10.2625 10.75 11.5 10.75C12.7375 10.75 13.75 9.7375 13.75 8.5Z"
          fill="#D9DAD9"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_197_429">
          <Rect
            width="18"
            height="18"
            fill="white"
            transform="translate(1 1)"
          />
        </ClipPath>
      </Defs>
    </Svg>
  );
};

export default CampaignTargetFundcIcon;
