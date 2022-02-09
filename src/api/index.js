import request from '@/utils/request'

export const getDefaultIndexData = () => {
  return request({
    method: 'GET',
    url: '/v2/diy/get_diy/moren'
  })
}
