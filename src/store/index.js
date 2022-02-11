import { createStore } from 'vuex'
import { changeCartItemNum } from '@/api/cart'
export default createStore({
  state () {
    return {
      user: window.localStorage.getItem('UESR_TOKEN') || null,
      // 用于存储购物车的数据（sku 的 id，checked，count，image,title，price，stock，productId）
      cartList: []
    }
  },
  getters: {
    checkedItems: state => {
      return state.cartList.filter(item => item.checked===true)
    },
    totalPrice (state, getters) {
      return getters.checkedItems.reduce((sum,item) => sum + item.count * item.price, 0)
    },
    checkedAll (state, getters) {
      return state.cartList.length == getters.checkedItems.length
    }
  },
  mutations: {
    setUser (state, payload) {
      state.user = payload
      window.localStorage.setItem('USER_TOKEN', payload)
    },
    addToCart (state, payload) {
      state.cartList.push(payload)
    },
    clearCart (state) {
      state.cartList = []
    },
    changeChecked (state, {checked, id}) {
      state.cartList.find(item => item.id === id).checked = checked
    },
    changeCount (state, {count, id}) {
      state.cartList.find(item => item.id === id).count = count
    },
    checkedAll (state, newChecked) {
      state.cartList.forEach(item => {
        item.checked = newChecked
      })
    }
  },
  actions: {
    async changeCount ({ commit }, payload) {
      commit('changeCount', payload)
      const { data } = await changeCartItemNum({
        id: payload.id,
        number: payload.count
      })
      console.log(data)
    }
  }
})
