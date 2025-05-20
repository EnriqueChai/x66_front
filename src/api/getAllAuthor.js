// import request from '@/utils/request'
import request_temp from '@/utils/request_temp'


// 获取作者信息
export const getAllAuthor = (name) => {
  // return request.get('book/findByAuthorName', {
  return request_temp.get('api/author/findByName', {
    params: {
      name
    }
  })
}