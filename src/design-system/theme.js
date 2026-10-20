import { theme as antdTheme } from 'antd'
import { tokens } from './tokens'

export const antdThemeConfig = {
  algorithm: antdTheme.defaultAlgorithm,
  token: {
    colorPrimary: tokens.colorPrimary,
    colorSuccess: tokens.colorSuccess,
    colorWarning: tokens.colorWarning,
    colorError: tokens.colorDanger,
    colorInfo: tokens.colorInfo,
    colorBgLayout: tokens.colorBg,
    colorBgContainer: tokens.colorSurface,
    colorBgElevated: tokens.colorSurface,
    colorText: tokens.colorText,
    colorTextSecondary: tokens.colorTextSecondary,
    colorTextTertiary: tokens.colorTextMuted,
    colorBorder: tokens.colorBorder,
    colorBorderSecondary: tokens.colorBorder,
    fontFamily: tokens.fontFamily,
    fontSize: Number.parseInt(tokens.fontSizeSm, 10),
    fontSizeHeading1: Number.parseInt(tokens.fontSize2xl, 10),
    fontSizeHeading2: Number.parseInt(tokens.fontSizeXl, 10),
    lineHeight: tokens.lineHeightBody,
    lineHeightHeading1: tokens.lineHeightHeading,
    lineHeightHeading2: tokens.lineHeightHeading,
    borderRadius: Number.parseInt(tokens.radiusMd, 10),
    controlHeight: Number.parseInt(tokens.controlHeightMd, 10),
    boxShadow: tokens.shadowCard,
    boxShadowSecondary: tokens.shadowOverlay,
  },
  components: {
    Button: {
      controlHeight: Number.parseInt(tokens.controlHeightMd, 10),
      borderRadius: Number.parseInt(tokens.radiusMd, 10),
      fontWeight: 500,
    },
    Card: {
      borderRadiusLG: Number.parseInt(tokens.radiusLg, 10),
      paddingLG: Number.parseInt(tokens.space5, 10),
    },
    Input: {
      controlHeight: Number.parseInt(tokens.controlHeightMd, 10),
      borderRadius: Number.parseInt(tokens.radiusMd, 10),
    },
    Modal: {
      borderRadiusLG: Number.parseInt(tokens.radiusLg, 10),
    },
    Select: {
      controlHeight: Number.parseInt(tokens.controlHeightMd, 10),
      borderRadius: Number.parseInt(tokens.radiusMd, 10),
    },
    Table: {
      headerBg: tokens.colorSurfaceMuted,
      headerColor: tokens.colorTextSecondary,
      borderColor: tokens.colorBorder,
    },
  },
}
