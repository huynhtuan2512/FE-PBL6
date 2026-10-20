import { zipSync, strToU8 } from 'fflate'

const columns = [
  ['Mã hóa đơn', 'invoice_id'],
  ['Mã đơn', 'order_id'],
  ['Mã bàn', 'table_id'],
  ['Mã nhân viên', 'user_id'],
  ['Nhân viên', 'staff_name'],
  ['Tổng tiền', 'total_amount'],
  ['Giảm giá', 'discount_amount'],
  ['Thực thu', 'final_amount'],
  ['Trạng thái thanh toán', 'payment_status'],
  ['Phương thức thanh toán', 'payment_method'],
  ['Thời gian', 'created_at'],
]

const escapeXml = (value) => String(value ?? '')
  .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&apos;')

function columnName(index) {
  let name = ''
  let current = index
  while (current > 0) {
    const remainder = (current - 1) % 26
    name = String.fromCharCode(65 + remainder) + name
    current = Math.floor((current - 1) / 26)
  }
  return name
}

function worksheetXml(rows) {
  const content = rows.map((row, rowIndex) => {
    const cells = row.map((value, columnIndex) => {
      const reference = `${columnName(columnIndex + 1)}${rowIndex + 1}`
      if (typeof value === 'number' && Number.isFinite(value)) {
        return `<c r="${reference}" t="n"><v>${value}</v></c>`
      }
      return `<c r="${reference}" t="inlineStr"><is><t xml:space="preserve">${escapeXml(value)}</t></is></c>`
    }).join('')
    return `<row r="${rowIndex + 1}">${cells}</row>`
  }).join('')

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>${content}</sheetData></worksheet>`
}

export function buildSalesWorkbook(report, { period, paymentStatus, staffName }) {
  const summaryRows = [
    ['Báo cáo doanh thu', ''],
    ['Kỳ báo cáo', period],
    ['Trạng thái thanh toán', paymentStatus],
    ['Nhân viên', staffName],
    ['Số hóa đơn', report.invoice_count],
    ['Đã thanh toán', report.paid_count],
    ['Chưa thanh toán', report.unpaid_count],
    ['Đã hoàn tiền', report.refunded_count],
    ['Doanh thu đã thu', report.revenue],
    ['Tổng giảm giá', report.discount_total],
  ]
  const invoiceRows = [
    columns.map(([label]) => label),
    ...report.rows.map((row) => columns.map(([, key]) => {
      const value = row[key]
      return value == null ? '' : value
    })),
  ]
  const files = {
    '[Content_Types].xml': strToU8(
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
      + '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'
      + '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'
      + '<Default Extension="xml" ContentType="application/xml"/>'
      + '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>'
      + '<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>'
      + '<Override PartName="/xl/worksheets/sheet2.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>'
      + '</Types>',
    ),
    '_rels/.rels': strToU8(
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
      + '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
      + '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>'
      + '</Relationships>',
    ),
    'xl/workbook.xml': strToU8(
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
      + '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">'
      + '<sheets><sheet name="Tổng quan" sheetId="1" r:id="rId1"/><sheet name="Hóa đơn" sheetId="2" r:id="rId2"/></sheets>'
      + '</workbook>',
    ),
    'xl/_rels/workbook.xml.rels': strToU8(
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
      + '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
      + '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>'
      + '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet2.xml"/>'
      + '</Relationships>',
    ),
    'xl/worksheets/sheet1.xml': strToU8(worksheetXml(summaryRows)),
    'xl/worksheets/sheet2.xml': strToU8(worksheetXml(invoiceRows)),
  }
  return zipSync(files, { level: 6 })
}

export async function downloadSalesWorkbook(report, filters) {
  const workbook = buildSalesWorkbook(report, filters)
  const url = URL.createObjectURL(new Blob([workbook], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  }))
  const link = document.createElement('a')
  link.href = url
  link.download = `bao-cao-doanh-thu-${filters.period}.xlsx`
  link.click()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}
