<template>
<div class="container">
  <van-nav-bar
    title="购物车"
    left-arrow
    @click-left="onClickLeft"
  />
  <div class="cards">
    <cart-item
      v-for="item in cartData.cartDetails"
      :key="item.id"
      :cartDetails="item"
    ></cart-item>
  </div>
</div>
<van-submit-bar :price="store.getters.totalPrice*100" button-text="提交订单" @submit="onSubmit">
  <van-checkbox v-model="checkedAll" checked-color="#ee0a24">全选</van-checkbox>
</van-submit-bar>
<layout-footer></layout-footer>
</template>

<script setup>
  // import {  } from 'vue'
import LayoutFooter from '@/components/LayoutFooter.vue'
import { getCartList } from '@/api/cart'
import { computed, nextTick, reactive } from 'vue'
import { useStore } from 'vuex'
import router from '../../router';
const store = useStore()
import cartItem from './components/cartItem.vue'
import CartItem from './components/cartItem.vue';

const cartData = reactive({
  page: 1,
  limit: 8,
  cartDetails: {}
})
cartData.cartDetails = computed(() => store.state.cartList)
const initCart = async () => {
  const { data } = await getCartList({
    page: cartData.page,
    limit: cartData.limit
  })
  // console.log(data)

  store.commit('clearCart')
  await nextTick()
  data.data.valid.forEach(item => {
    // 用于存储购物车的数据
    // sku 的 id，checked，count，image,title，price，stock，productId）
    store.commit('addToCart',{
      id: item.id,
      checked: true,
      count: item.cart_num,
      desc: item.productInfo.attrInfo.sku,
      image: item.productInfo.image,
      title: item.productInfo.store_name,
      price: item.truePrice,
      stock: item.trueStock,
      productId: item.product_id
    })
    
  });
}
initCart()

// const title = computed(() => cartData.cartDetails?.productInfo.store_name)
// const img = computed(() => cartData.cartDetails?.productInfo.image)
// const price = computed(() => cartData.cartDetails?.truePrice)
// const num = computed(() => cartData.cartDetails?.cart_num)
const onClickLeft = () => history.back()

// const checked = ref('')
const onSubmit = () => {
  return router.push({
    name: 'order-confirm',
    params: {
      cardId: store.getters.checkedItems.map(item => item.id).toString()
    }
  })
}
const checkedAll = computed({
  get: () => store.getters.checkedAll,
  set (newChecked) {
    store.commit('checkedAll', newChecked)
  }
})
</script>

<style lang="scss" scoped>
.container {
  margin-bottom: 100px;
  :deep(.van-nav-bar) {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
  }
  .cards {
    margin-top: 50px;
  }
}
:deep(.van-submit-bar__bar) {
  margin-bottom: 48px;
}
</style>
