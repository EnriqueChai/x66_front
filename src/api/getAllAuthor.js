import request from '@/utils/request'

// 获取作者信息
export const getAllAuthor = (name) => {
  return request.get('book/findByAuthorName', {
    params: {
      name
    }
  })
}