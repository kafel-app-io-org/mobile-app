import React from "react"; 
import Svg, { Path } from "react-native-svg";

const HomeTabIcon = ({stroke = "#9DB2CE", fill="none"}) => {
  return (
    <Svg
      width="26"
      height="25"
      viewBox="0 0 26 25"
      fill={fill}
      style={{ transform: [{ translateY: 5 }] }} // move down
    >
      <Path
        d="M9.78291 3.31074L4.28177 7.59733C3.36322 8.31177 2.61816 9.83249 2.61816 10.9858V18.5486C2.61816 20.9164 4.54713 22.8556 6.91497 22.8556H18.7337C21.1016 22.8556 23.0305 20.9164 23.0305 18.5588V11.1287C23.0305 9.89373 22.2038 8.31177 21.1934 7.60754L14.886 3.18826C13.4571 2.18806 11.1607 2.23909 9.78291 3.31074Z"
        fill={"#fff"}
        stroke={stroke}
        strokeWidth={1.53093}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M12.8247 18.7733V15.7114Z" fill="white" />
      <Path
        d="M12.8247 18.7733V15.7114"
        stroke={stroke}
        strokeWidth={1.53093}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default HomeTabIcon;
