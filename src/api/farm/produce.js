import request from '@/utils/request'

// 查询农产品列表
export function listProduce(query) {
  return request({
    url: '/farm/produce/list',
    method: 'get',
    params: query
  })
}

// 查询农产品详细
export function getProduce(id) {
  return request({
    url: '/farm/produce/' + id,
    method: 'get'
  })
}

// 新增农产品
export function addProduce(data) {
  return request({
    url: '/farm/produce',
    method: 'post',
    data: data
  })
}

// 修改农产品
export function updateProduce(data) {
  return request({
    url: '/farm/produce',
    method: 'put',
    data: data
  })
}

// 删除农产品
export function delProduce(id) {
  return request({
    url: '/farm/produce/' + id,
    method: 'delete'
  })
}

// 推荐
export function recommendProduce(id) {
  return request({
    url: '/farm/produce/recommend/' + id,
    method: 'put'
  })
}

// 取消推荐
export function notRecommendProduce(id) {
  return request({
    url: '/farm/produce/not-recommend/' + id,
    method: 'put'
  })
}