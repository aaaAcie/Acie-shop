import request from '@/utils/request'

export const getProductsData = params => {
  return request({
    method: 'GET',
    url: '/products',
    params
  })
}

export const getProductsDetail = params => {
  return request({
    method: 'GET',
    url: `/product/detail/${params}`
  })
}

export const getReplyCount = params => {
  return request({
    method: 'GET',
    url: `/reply/config/${params}`
  })
}

export const getReplyDetail = (productId,params) => {
  return request({
    method: 'GET',
    url: `/reply/list/${productId}`,
    params
  })
}

