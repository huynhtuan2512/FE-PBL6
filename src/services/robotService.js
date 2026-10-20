import { api, unwrap } from './api'
export const getRobotStatuses = () => api.get('/robot/status').then(unwrap)