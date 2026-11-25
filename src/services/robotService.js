import { api, unwrap } from './api'

export const getRobots = () =>
  api.get('/admin/robots').then(unwrap)

export const sendRobotCommand = (robotId, payload) =>
  api.post(`/admin/robots/${encodeURIComponent(robotId)}/commands`, payload).then(unwrap)
