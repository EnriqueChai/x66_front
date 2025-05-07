import request from '@/utils/request'
import request_temp from '@/utils/request_temp'

// 获取作者信息
export const getAuthorInfo = (id) => {
  return request.get('book/findAuthorById', {
    params: {
      id
    }
  })
}

export const getAuthorPaper = (authorId, modelId = null) => {
  // 构建请求参数
  const params = { id: authorId };

  if (modelId) {
    params.modelId = modelId;
  }

  return request.get('book/findPapersById', {
    params
  });
}

export const getSimAuthor = (authorId, modelId = null) => {
  // 构建请求参数
  const params = { id: authorId };

  if (modelId) {
    params.modelId = modelId;
  }

  return request.get('book/findSimilarAuthorsById', {
    params
  });
}

export const getRecommendVenue = (authorId) => {
  return request_temp.get('api/author/recommend_venues', {
    params: {
      authorId
    }
  })
}
