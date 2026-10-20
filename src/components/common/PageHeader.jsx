import { Space, Typography } from 'antd'

export default function PageHeader({ eyebrow, title, description, extra }) {
  return (
    <header className="ds-page-header">
      <div className="ds-page-header-copy">
        {eyebrow && <Typography.Text className="ds-page-header-eyebrow">{eyebrow}</Typography.Text>}
        <Typography.Title className="ds-page-header-title" level={1}>{title}</Typography.Title>
        {description && <Typography.Paragraph className="ds-page-header-description">{description}</Typography.Paragraph>}
      </div>
      {extra && <Space className="ds-page-header-extra" size="middle" wrap>{extra}</Space>}
    </header>
  )
}
