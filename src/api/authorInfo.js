import request from '@/utils/request'

// 获取作者信息
export const getAuthorInfo = (id) => {
  return request.get('book/findByName', {
    params: {
      id
    }
  })
}