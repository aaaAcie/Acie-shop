import request from '@/utils/request'

export const getDefaultIndexData = () => {
  return request({
    method: 'GET',
    url: '/v2/diy/get_diy/moren'
  })
}

export const getLogo = () => {
  return request({
    method: 'GET',
    url: '/wechat/get_logo'
  })
}
