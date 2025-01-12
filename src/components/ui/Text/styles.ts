import { INiceTextStyle } from "../../../common";

const main: INiceTextStyle = {
  fontFamily: 'Title, Verdana, Roboto, sans-serif',
  fontSize: '20px',
  lineHeight: 1.3,
  align: 'center'
};

const mainLight: INiceTextStyle = {
  ...main,
  color: "#dedede",
};

export const TextStyles = {
  main,
  mainLight,
};
