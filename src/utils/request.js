import axios from 'axios'

const request = axios.create({
    baseURL: 'https://shop.fed.lagounews.com/api'
    // baseURL: 'https://shop.fed.lagou.com/api'
})

export default request
