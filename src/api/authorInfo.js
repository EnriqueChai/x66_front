import request from '@/utils/request'

// 获取作者信息
export const getAuthorInfo = (id) => {
  return request.get('book/findAuthorById', {
    params: {
      id
    }
  })
}

export const getAuthorPaper = (id) => {
  return request.get('book/findPapersById', {
    params: {
      id
    }
  })
}

// export const getAuthorPaper = (authorId, modelId = null) => {
//   // 构建请求参数
//   const params = { id: authorId };

//   if (modelId) {
//     params.modelId = modelId;
//   }

//   return request.get('book/findPapersById', {
//     params
//   });
// }

export const getSimAuthor = (id) => {
  return request.get('book/findSimilarAuthorsById', {
    params: {
      id
    }
  })
}

// export const getSimAuthor = (authorId, modelId = null) => {
//   // 构建请求参数
//   const params = { id: authorId };

//   if (modelId) {
//     params.modelId = modelId;
//   }

//   return request.get('book/findSimilarAuthorsById', {
//     params
//   });
// }