import { Alert, Button, Empty, Spin } from 'antd'

export default function DataState({
  status,
  message,
  error,
  onRetry,
  retryDisabled = false,
}) {
  if (status === 'loading') {
    return (
      <div className="ds-data-state ds-data-state-loading" role="status" aria-live="polite" aria-busy="true">
        <Spin size="small" />
        <span>{message ?? 'Đang tải dữ liệu...'}</span>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <Alert
        className="ds-data-state"
        type="error"
        showIcon
        role="alert"
        title={message ?? 'Không thể tải dữ liệu'}
        description={error}
        action={onRetry && (
          <Button size="small" onClick={onRetry} disabled={retryDisabled}>
            Thử lại
          </Button>
        )}
      />
    )
  }

  if (status === 'empty') {
    return (
      <div className="ds-data-state ds-data-state-empty">
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={message ?? 'Chưa có dữ liệu.'} />
      </div>
    )
  }

  return null
}
