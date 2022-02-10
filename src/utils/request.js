import axios from 'axios'
import store from '@/store'

const request = axios.create({
    baseURL: 'https://shop.fed.lagounews.com/api'
    // baseURL: 'https://shop.fed.lagou.com/api'
})

request.interceptors.request.use(config => {
    // const { user } = store.state
    const user = store.state.user || window.localStorage.getItem('USER_TOKEN')

    if (user) {
        config.headers.Authorization = 'Bearer ' + user
    }
    return config
})

export default request
