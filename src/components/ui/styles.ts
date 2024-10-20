import { TextStyles } from "./Text/styles";
import { Background01Styles } from "./Background";

// рекомендация по быстрой смене стиле - редактировать main
// оставляя копии в других названиях

const PaddingStyles = {
  window: {
    main: 15,
  },
  progressBar: {
    main: 5,
  },
};

const WindowStyles = {
  padding: PaddingStyles.window,
};

const ProgressBarStyles = {
  height: {
    main: 50,
  },
  padding: PaddingStyles.progressBar,
  color: {
    bar: {
      main: "#839f1f",
    },
    bg: {
      main: "#704c4c",
    },
  },
};

export const UiStyles = {
  padding: PaddingStyles,
  window: WindowStyles,
  progressBar: ProgressBarStyles,
  text: TextStyles,
  background: Background01Styles,
};
