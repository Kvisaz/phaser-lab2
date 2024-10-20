import { cssColorToInt } from "@kvisaz/phaser-sugar";

export interface IStyle {
    bgColor: number;
    bgBorderColor: number;
    bgBorderSize: number;
}

export const Background01Styles = {
  grayDark: {
    bgColor: cssColorToInt("#3b3838"),
    bgBorderColor: cssColorToInt("#4b4949"),
    bgBorderSize: 2,
  },
  grayLight: {
    bgColor: cssColorToInt("#504c4c"),
    bgBorderColor: cssColorToInt("#383636"),
    bgBorderSize: 2,
  },
  grayContrastBorder: {
    bgColor: cssColorToInt("#3b3838"),
    bgBorderColor: cssColorToInt("#696767"),
    bgBorderSize: 2,
  },
};
