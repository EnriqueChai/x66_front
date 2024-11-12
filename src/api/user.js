import request from '@/utils/request'

export const login = (username, password) => {
  return request.post('user/login', null, {
    params: {
      username: username,
      password: password
    }
  });
}

export const signUp = (username, password) => {
  return request.post('user/register', {
    username: username,
    password: password
  })
}

export const interest = (username, hobbies) => {
  return request.post('user/updateHobbies', hobbies, {
    params: {
      username: username
    }
  })
}