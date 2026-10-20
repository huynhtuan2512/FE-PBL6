import { useState } from 'react'
import { Alert, Button, Card, Form, Input, Typography } from 'antd'
import { ArrowRight, Eye, EyeSlash, LockKey, ShieldCheck, User } from '@phosphor-icons/react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const submit = async ({ username, password }) => {
    setSubmitting(true)
    const result = await login(username.trim(), password)
    setSubmitting(false)
    if (!result.ok) {
      setError(result.message)
      return
    }

    const destination = location.state?.from || (result.user.role_name === 'ADMIN' ? '/admin' : '/staff')
    navigate(destination, { replace: true })
  }

  return (
    <main className="login-page">
      <Card className="login-card">
        <header className="login-brand">
          <div className="brand-mark" aria-hidden="true">
            <ShieldCheck size={23} weight="fill" />
          </div>
          <div>
            <strong>ROBO/OPS</strong>
            <small>Vận hành nhà hàng</small>
          </div>
        </header>

        <div className="login-heading">
          <Typography.Title level={1}>Đăng nhập</Typography.Title>
          <Typography.Text type="secondary">
            Đăng nhập để điều hành sảnh, bếp và đội robot.
          </Typography.Text>
        </div>

        <Form
          className="login-form"
          layout="vertical"
          initialValues={{ username: '', password: '' }}
          onFinish={submit}
          onValuesChange={() => setError('')}
        >
          <Form.Item
            name="username"
            label="Tên đăng nhập"
            rules={[{ required: true, whitespace: true, message: 'Nhập tên đăng nhập.' }]}
          >
            <Input
              prefix={<User size={18} aria-hidden="true" />}
              placeholder="Nhập tên đăng nhập"
              autoComplete="username"
            />
          </Form.Item>
          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[{ required: true, message: 'Nhập mật khẩu.' }]}
          >
            <Input
              prefix={<LockKey size={18} aria-hidden="true" />}
              type={showPassword ? 'text' : 'password'}
              placeholder="Nhập mật khẩu"
              autoComplete="current-password"
              suffix={(
                <Button
                  className="login-password-toggle"
                  type="text"
                  htmlType="button"
                  icon={showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
                  aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  onClick={() => setShowPassword((visible) => !visible)}
                />
              )}
            />
          </Form.Item>
          {error && (
            <Alert
              className="login-error"
              type="error"
              showIcon
              role="alert"
              title={error}
            />
          )}
          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            loading={submitting}
            icon={!submitting && <ArrowRight size={18} />}
          >
            Đăng nhập
          </Button>
        </Form>
      </Card>
    </main>
  )
}
