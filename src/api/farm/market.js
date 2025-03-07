import request from '@/utils/request'

// 查询农贸市场列表
export function listMarket(query) {
  return request({
    url: '/farm/market/list',
    method: 'get',
    params: query
  })
}

// 查询农贸市场详细
export function getMarket(id) {
  return request({
    url: '/farm/market/' + id,
    method: 'get'
  })
}

// 新增农贸市场
export function addMarket(data) {
  return request({
    url: '/farm/market',
    method: 'post',
    data: data
  })
}

// 修改农贸市场
export function updateMarket(data) {
  return request({
    url: '/farm/market',
    method: 'put',
    data: data
  })
}

// 删除农贸市场
export function delMarket(id) {
  return request({
    url: '/farm/market/' + id,
    method: 'delete'
  })
}
