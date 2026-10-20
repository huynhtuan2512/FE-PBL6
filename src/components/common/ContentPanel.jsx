import { Card } from 'antd'

export default function ContentPanel({ children, className = '' }) {
  return <Card className={`ds-content-panel ${className}`.trim()}>{children}</Card>
}
