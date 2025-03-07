import request from '@/utils/request'

// 查询农事服务列表
export function listWork(query) {
  return request({
    url: '/farm/work/list',
    method: 'get',
    params: query
  })
}

// 查询农事服务详细
export function getWork(id) {
  return request({
    url: '/farm/work/' + id,
    method: 'get'
  })
}

// 新增农事服务
export function addWork(data) {
  return request({
    url: '/farm/work',
    method: 'post',
    data: data
  })
}

// 修改农事服务
export function updateWork(data) {
  return request({
    url: '/farm/work',
    method: 'put',
    data: data
  })
}

// 删除农事服务
export function delWork(id) {
  return request({
    url: '/farm/work/' + id,
    method: 'delete'
  })
}
