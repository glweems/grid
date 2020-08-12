import Typography, { TypographyOptions } from "typography";
import CodePlugin from "typography-plugin-code";
import { colors, defaultFont } from "./theme";

const theme: TypographyOptions = {
  baseFontSize: "16px",
  scaleRatio: 2,
  baseLineHeight: 1.78,
  headerFontFamily: defaultFont.split(","),
  bodyFontFamily: defaultFont.split(","),
  bodyColor: colors.text,
  headerWeight: 700,
  bodyWeight: 300,
  boldWeight: 700,
  includeNormalize: true,
};

theme.plugins = [new CodePlugin()];
const typography = new Typography(theme);

// Hot reload typography in development.
if (process.env.NODE_ENV !== `production`) {
  typography.injectStyles();
}

export default typography;