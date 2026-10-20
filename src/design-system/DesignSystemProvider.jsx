import { ConfigProvider } from 'antd'
import { antdThemeConfig } from './theme'
import { tokenCssVariables } from './tokens'

export default function DesignSystemProvider({ children }) {
  return (
    <ConfigProvider theme={antdThemeConfig}>
      <div className="design-system-root" style={tokenCssVariables}>
        {children}
      </div>
    </ConfigProvider>
  )
}
