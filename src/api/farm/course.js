import request from '@/utils/request'

// 查询知识课程列表
export function listCourse(query) {
  return request({
    url: '/farm/course/list',
    method: 'get',
    params: query
  })
}

// 查询知识课程详细
export function getCourse(id) {
  return request({
    url: '/farm/course/' + id,
    method: 'get'
  })
}

// 新增知识课程
export function addCourse(data) {
  return request({
    url: '/farm/course',
    method: 'post',
    data: data
  })
}

// 修改知识课程
export function updateCourse(data) {
  return request({
    url: '/farm/course',
    method: 'put',
    data: data
  })
}

// 删除知识课程
export function delCourse(id) {
  return request({
    url: '/farm/course/' + id,
    method: 'delete'
  })
}
