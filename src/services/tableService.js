import { api, unwrap } from './api'

export const getTables = () => api.get('/tables').then(unwrap)
