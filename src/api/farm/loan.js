import request from '@/utils/request'

// 查询信贷信息列表
export function listLoan(query) {
  return request({
    url: '/farm/loan/list',
    method: 'get',
    params: query
  })
}

// 查询信贷信息详细
export function getLoan(id) {
  return request({
    url: '/farm/loan/' + id,
    method: 'get'
  })
}

// 新增信贷信息
export function addLoan(data) {
  return request({
    url: '/farm/loan',
    method: 'post',
    data: data
  })
}

// 修改信贷信息
export function updateLoan(data) {
  return request({
    url: '/farm/loan',
    method: 'put',
    data: data
  })
}

// 删除信贷信息
export function delLoan(id) {
  return request({
    url: '/farm/loan/' + id,
    method: 'delete'
  })
}
