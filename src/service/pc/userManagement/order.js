import { doPost, doGet, doDelete, doPut } from '../../../axiosconfig/index.js'
let orderService = {
  // 查询账户详情
  getAccount: params => doGet('/app/accounts', {}),
  // 查询订单列表
  getOrderList: params => doGet('/app/orders', params),
  // 提交订单
  submitOrder: params => doPost('/app/orders', params),
  // 上传凭证
  submitVoucher: (id, params) => doPut(`/app/orders/${id}/voucher`, params),
  // 删除订单
  deleteOrder: id => doDelete(`/app/orders/${id}`),
  // 取消订单
  cancelOrder: (id, params) => doPut(`/app/orders/${id}/cancelled`, params),
  // 获取所有价格列表
  getPriceList: params => doGet('/app/price/orders', params),
  // 开发票
  setInvoices: params => doPost('/app/invoices', params),
  // 提交联系
  potentialCustomer: params => doPost('/app/customers/potentialCustomer', params)
}
export default orderService
