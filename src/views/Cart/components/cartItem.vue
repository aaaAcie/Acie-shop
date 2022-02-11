<template>
<div class="cart-item">
  <van-checkbox v-model="itemChecked" checked-color="#ee0a24"></van-checkbox>
  <div class="link" @click="handleLink">
    <img :src="cartDetails.image">
    <div class="info">
      <p class="title">{{cartDetails.title}}</p>
      <p class="desc">{{cartDetails.desc}}</p>
      <div class="detail">
        <span class="price">¥ {{cartDetails.price}}</span>
        <van-stepper
          v-model="itemCount"
          :max="cartDetails.stock"
          button-size="26px"
          @click.stop/>
      </div>
      <div class="del">删除</div>
    </div>
  </div>
</div>
</template>

<script setup>
  import { computed } from 'vue'
  import { useStore } from 'vuex'
  import { useRouter } from 'vue-router'
  // import router from '../../../router';
  const store = useStore()
  const router = useRouter()

  const { cartDetails } = defineProps({
    cartDetails: {
      type: Object,
      required: true
    }
  })

  function handleLink () {
    router.push({
      name: 'product',
      params: {
        productId: cartDetails.productId
      }  
    })
  }

  const itemChecked = computed({
    get: () => cartDetails.checked,
    set: newChecked => {
      store.commit('changeChecked',{checked: newChecked, id: cartDetails.id})
    }
  })

  const itemCount = computed({
    get: () => cartDetails.count,
    set: newCount => {
      // console.log(newCount)
      store.dispatch('changeCount',{count: newCount, id: cartDetails.id})
    }
  })
</script>

<style lang="scss" scoped>
.cart-item {
  display: flex;
  // height: 90px;
  padding: 10px 20px;
  :deep(.van-badge__wrapper) {
    margin-left: 0;
    margin-right: 4px;
  }
  .link {
    display: flex;
    width: 100%;

    img {
      width: 88px;
      height: 88px;
      align-self: center;
    }
    .info {
      display: flex;
      flex-direction: column;
      flex: 1;
      .title {
        font-size: 18px;
        font-weight: 700;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
        -webkit-line-clamp: 1;
        margin: 5px 0 8px;
      }
      .desc {
        font-size: 16px;
        margin-bottom: 10px;
      }
      .price {
        font-size: 16px;
        color: #F2270C;
        font-weight: 700;
      }
      .van-stepper {
        float: right;
      }
      .del {
        text-align: right;
        font-size: 14px;
      }
    }
  }
}
</style>