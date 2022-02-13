<template>
  <!-- 导航 -->
  <van-nav-bar
    title="订单确认"
    left-text="返回"
    left-arrow
    @click-left="onClickLeft"
  />
    <!-- 主体内容 -->
  <div class="container">
    <!-- 1 地址区域 -->
    <div class="address-card" @click="triggerPopup">
      <p class="info">
        <span class="username" v-text="currentAddress.name"></span>
        <span v-text="currentAddress.tel"></span>
      </p>
      <p class="detail">
        <span class="default" v-if="currentAddress.isDefault">[默认]</span>
        <span v-text="currentAddress.address"></span>
      </p>
    </div>
    <!-- 2 弹出层 -->
    <van-popup
      v-model:show="popupStatus"
      position="bottom"
    >
      <van-address-list
        v-model="chosenAddressId"
        :list="addressList"
        default-tag-text="默认"
        @click-item="changeAddress"
        @add="onAdd"
        @edit="onEdit"
      >
        <!-- 地址为空时显示 -->
        <template #top v-if="isEmpty">
          <van-empty description="还没有地址哦~" />
        </template>
      </van-address-list>
    </van-popup>
    <!-- 3 商品列表 -->
    <div class="product-list">
      <van-cell-group>
        <van-cell :title="cartItemCount" />
      </van-cell-group>
      <van-cell-group>
        <van-cell
          class="product"
          v-for="item in cartInfo"
          :key="item.id"
        >
          <img :src="item.productInfo.image" alt="">
          <div class="info">
            <p class="title" v-text="item.productInfo.store_name"></p>
            <p class="price">￥{{ item.truePrice }}</p>
          </div>
          <span class="count">x{{ item.cart_num }}</span>
        </van-cell>
      </van-cell-group>
    </div>
  </div>
    <!-- 提交订单区域 -->
  <van-submit-bar
    :price="totalPrice"
    label="订单总结："
    button-text="立即付款"
    @submit="showPayPanel = true"
  />
  <van-action-sheet v-model:show="showPayPanel" title="请选择支付方式" cancel-text="取消">
    <template #default>
      <van-radio-group v-model="paymentMethod">
        <van-cell-group inset>
          <van-cell title="微信支付" label="微信快捷支付" clickable @click="paymentMethod = 'wechat'" size="large" center>
            <template #icon>
              <van-icon
                name="http://www.lgstatic.com/lg-app-fed/pay/images/wechat_b787e2f4.png"
                size="30"
                :style="{ marginRight: '12px' }"
              ></van-icon>
            </template>
            <template #right-icon>
              <van-radio name="wechat" checked-color="#ee0a24" />
            </template>
          </van-cell>
          <van-cell title="支付宝" label="支付宝快捷支付" clickable @click="paymentMethod = 'alipay'" size="large" center>
            <template #icon>
              <van-icon
                name="http://www.lgstatic.com/lg-app-fed/pay/images/ali_ed78fdae.png"
                size="30"
                :style="{ marginRight: '12px' }"
              ></van-icon>
            </template>
            <template #right-icon>
              <van-radio name="alipay" checked-color="#ee0a24" />
            </template>
          </van-cell>
          <van-cell title="余额支付" :label="`可用余额为：${yue}`" clickable @click="paymentMethod = 'yue'" size="large" center>
            <template #icon>
              <van-icon
                name="gold-coin"
                color="#FF9900"
                size="30"
                :style="{ marginRight: '12px' }"
              ></van-icon>
            </template>
            <template #right-icon>
              <van-radio name="yue" checked-color="#ee0a24" />
            </template>
          </van-cell>
          <van-cell>
            <van-button
              round
              type="danger"
              block
              @click="handlePay"
            >去支付</van-button>
          </van-cell>
        </van-cell-group>
      </van-radio-group>
    </template>
  </van-action-sheet>

</template>

<script setup>
  import { getAddressList } from '@/api/order'
  import { ref, computed, reactive } from 'vue'
  const { cardId } = defineProps({
    cardId: {
      type: String,
      required: true
    }
  })
  const addressList = ref([])
  const currentAddress = ref({})
  const chosenAddressId = ref(1)
  const popupStatus = ref(false)
  const initAddress = async () => {
    const { data } = await getAddressList({
      page: 1,
      limit: 5
    })
    if ( data.status != 200 ) { return }
    addressList.value = convertData(data.data)
    // currentAddress.value = addressList.value.find(item => item.is_default==1)
    // console.log(currentAddress.value)
    // console.log(data)
  }
  initAddress()
  const convertData = (data) => {
    return data.map(item => {
      const temp = {
        id: item.id,
        name: item.real_name,
        tel: item.phone,
        address: item.province + item.city + item.district + item.detail,
        isDefault: item.is_default,
      }
      if (temp.isDefault == 1) {
        chosenAddressId.value = temp.id
        currentAddress.value = temp
      }
      return temp
    })
  }
  const triggerPopup = () => {
    popupStatus.value = true
  }
  const isEmpty = computed(() => addressList.value?.length==0)
  const changeAddress = (item) => {
    popupStatus.value = false
    currentAddress.value = item
  }
  import { useRouter } from 'vue-router'
  const router = useRouter()
  const onAdd = () => {
  // 因为新增地址后还要回到订单确认页，这时需要传递 cartId
    router.push({
      name: 'address',
      params: {
        cardId
      }
    })
}
const onEdit = (item, index) => Toast('编辑地址:' + index)
const onClickLeft = () => history.back()

import { confirmOrder, createOrder } from '@/api/order'

// 存储数据
const orderConfirmData = ref({})
// 计算属性处理数据
const cartInfo = computed(() => orderConfirmData.value?.cartInfo)
const cartItemCount = computed(() => `共${cartInfo.value?.length || 0}件`)
const totalPrice = computed(() => (orderConfirmData.value?.priceGroup?.totalPrice || 0) * 100)

const handleOrder = async() => {
  const { data } = await confirmOrder({
    cartId : cardId,
    new: 0
  })
  console.log(data)
  orderConfirmData.value = data.data
}
handleOrder()

// ---- 3 订单确认区域 ----
import { Toast } from 'vant'
const showPayPanel = ref(false)
const paymentMethod = ref('yue')

const yue = computed(() => orderConfirmData.value?.userInfo.now_money || 0)

const handlePay = async () => {
  const { data } = await createOrder(orderConfirmData.value.orderKey, {
    addressId: currentAddress.value.id,
    payType: paymentMethod.value
  })
  if (data.status !== 200) { return }
  // 提示并跳转
  Toast.success('支付成功，自动跳转登录页...')
  router.push({
    name: 'order'
  })
}
</script>

<style lang="scss" scoped>
.container {
  // padding: 50px 0;
  .address-card {
    padding: 20px 25px;
    font-size: 16px;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 2px;
      background: repeating-linear-gradient(90deg, #ff6c6c 0, #ff6c6c 20%, transparent 20%,
        transparent 25%, #0084ff 25%, #0084ff 45%, transparent 45%, transparent 50%);
      background-size: 80px;
    }
    .info {
      .username {
        padding-right: 10px;
      }
    }
    .detail {
      padding-top: 5px;

      .default {
        margin-right: 10px;
        background-color: #D6251F;
        color: #fff;
        font-size: 12px;
        padding: 2px 3px;
        border-radius: 3px;
      }
    }
  }
  .product-list {
    :deep(.van-cell__value) {
      display: flex;
      align-items: center;
      img {
        width: 70px;
        height: 70px;
      }
      .info {
        .title {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          overflow: hidden;
          -webkit-line-clamp: 1;
          padding: 0 15px 5px 0;
        }
        .price {
          color: #F2270C;
        }
      }
      .count {
        color: #aaa;
      }
    }
  }
}
</style>