import React from "react";
import Svg, { Path } from "react-native-svg";

const UserProfileTabIcon = ({ stroke = "#9DB2CE", fill = "none" }) => {
  return (
    <Svg width="26" height="25" viewBox="0 0 26 25" fill={fill} xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M13.0001 12.6598C15.8184 12.6598 18.1032 10.3751 18.1032 7.55671C18.1032 4.73835 15.8184 2.45361 13.0001 2.45361C10.1817 2.45361 7.89697 4.73835 7.89697 7.55671C7.89697 10.3751 10.1817 12.6598 13.0001 12.6598Z"
        stroke={stroke}
        strokeWidth="1.53093"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M21.7671 22.866C21.7671 18.9162 17.8378 15.7217 13 15.7217C8.16229 15.7217 4.23291 18.9162 4.23291 22.866"
        stroke={stroke}
        strokeWidth="1.53093"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default UserProfileTabIcon;