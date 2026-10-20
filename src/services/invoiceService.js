import { api, unwrap } from './api'

export const getInvoices = (limit = 100) =>
  api.get('/invoices', { params: { limit } }).then(unwrap)

export const getSalesReport = (params) =>
  api.get('/admin/reports/sales', { params }).then(unwrap)

export const getReportStaff = () =>
  api.get('/admin/reports/staff').then(unwrap)
