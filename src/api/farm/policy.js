import request from '@/utils/request'

// 查询补贴政策列表
export function listPolicy(query) {
  return request({
    url: '/farm/policy/list',
    method: 'get',
    params: query
  })
}

// 查询补贴政策详细
export function getPolicy(id) {
  return request({
    url: '/farm/policy/' + id,
    method: 'get'
  })
}

// 新增补贴政策
export function addPolicy(data) {
  return request({
    url: '/farm/policy',
    method: 'post',
    data: data
  })
}

// 修改补贴政策
export function updatePolicy(data) {
  return request({
    url: '/farm/policy',
    method: 'put',
    data: data
  })
}

// 删除补贴政策
export function delPolicy(id) {
  return request({
    url: '/farm/policy/' + id,
    method: 'delete'
  })
}
