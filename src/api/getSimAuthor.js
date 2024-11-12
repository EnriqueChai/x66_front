import request from '@/utils/request'

// 获取作者信息
export const getSimAuthor = (name) => {
  return request.get('book/findAll')
}