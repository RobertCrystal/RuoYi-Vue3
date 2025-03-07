import request from '@/utils/request'

// 查询知识专家列表
export function listExpert(query) {
  return request({
    url: '/farm/expert/list',
    method: 'get',
    params: query
  })
}

// 查询知识专家详细
export function getExpert(id) {
  return request({
    url: '/farm/expert/' + id,
    method: 'get'
  })
}

// 新增知识专家
export function addExpert(data) {
  return request({
    url: '/farm/expert',
    method: 'post',
    data: data
  })
}

// 修改知识专家
export function updateExpert(data) {
  return request({
    url: '/farm/expert',
    method: 'put',
    data: data
  })
}

// 删除知识专家
export function delExpert(id) {
  return request({
    url: '/farm/expert/' + id,
    method: 'delete'
  })
}
