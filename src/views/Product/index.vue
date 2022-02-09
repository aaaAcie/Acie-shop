<template>
<van-nav-bar
  left-arrow
  @click-left="onClickLeft"
  fixed
/>
<van-tabs scrollspy color="#FBC546" style="background-color: #F2F2F2;">
  <van-tab title="商品">
    <van-swipe :autoplay="3000" indicator-color="#FBC546">
      <van-swipe-item
        v-for="(item,index) in sliderImage"
        :key="index"
      >
        <van-image :src="item"></van-image>
      </van-swipe-item>
    </van-swipe>
    <van-cell :border="false">
      <template #title>
        <div class="price">
          <span>¥ {{storeInfo?.price}}</span>
          <van-icon name="share-o" style="float: right;"></van-icon>
        </div>
        <div class="pd_title">{{storeInfo?.store_name}}</div>
      </template>
      <template #label>
        <span>原价：¥ {{storeInfo?.ot_price}}</span>
        <span>库存：{{storeInfo?.stock}}</span>
        <span>销量：{{storeInfo?.sales}}</span>
      </template>
    </van-cell>
    <van-cell is-link class="sku-window" @click="handleShow">
      <template #title>
        已选择：{{ sku }}
      </template>
    </van-cell>
    <van-popup
      v-model:show="specState.show"
      position="bottom"
    >
     <van-cell-group>
       <van-cell class="popup-header">
         <img :src="specDetail?.image">
         <div class="info">
            <p class="title" v-text="storeInfo?.store_name"></p>
            <p class="price">￥{{ specDetail?.price }}</p>
            <p class="stock">库存：{{ specDetail?.stock }}</p>
         </div>
       </van-cell>
       <van-cell
        v-for="(item,index) in productAttr"
        :key="item.id"
      >
        <template #title>
          <div class="attr_name">{{item.attr_name}}</div>
          <van-tag
            round
            type="primary"
            v-for="attr in item.attr_values"
            :key="index"
            v-text="attr"
            size="large"
            class="attr_tag"
            :class="{ active: specState.sku_choose[index]==attr }"
            @click="handleChoose(attr,index)"
          >
          </van-tag>
        </template>
       </van-cell>
       <van-cell title="数量">
         <van-stepper v-model="specState.productNumb" :max="specDetail?.stock" />
       </van-cell>
     </van-cell-group>
    </van-popup>
  </van-tab>
  <van-tab title="评价">
    <van-cell-group>
      <van-cell
        :title="replyInfo"
        is-link :value="replyRate"
        :to="{
          name: 'comment',
          params: {
            productId: storeInfo?.id
          }}"
      />
      <!-- <van-cell title="单元格"  label="描述信息" /> -->
      <comment-item v-if="replyCount!=0" :reply="reply"></comment-item>
    </van-cell-group>
  </van-tab>
  <van-tab title="推荐">
    <van-grid :column-num="3">
      <van-grid-item
        v-for="(item,index) in goodsList"
        :key="index"
        :to="{
          name: 'product',
          params: {
            productId: item.id
          }
        }"
      >
        <van-image :src="item.image" />
        <div class="store_name">{{item.store_name}}</div>
        <div class="store_price">¥ {{item.price}}</div>
      </van-grid-item>
    </van-grid>
  </van-tab>
  <van-tab title="详情">
    <div class="description" v-html="storeInfo?.description"></div>
  </van-tab>
</van-tabs>

</template>

<script setup>
  import { computed, reactive, ref } from 'vue'
  import { onBeforeRouteUpdate, useRouter } from 'vue-router'
  const router = useRouter()

  import { getProductsDetail } from '@/api/products'
  import CommentItem from '@/components/CommentItem.vue'
  const { productId } = defineProps({
    productId: {
      type: [Number, String],
      required: true
    }
  })
  const productDetails = ref({})
  const onClickLeft = () => history.back()

  const initProductDetail = async(productId) => {
    const { data } =  await getProductsDetail(productId)
    // console.log(data)
    if(data.status!=200){
      return router.push({
        name: 'home'
      })
    }
    productDetails.value = data.data
    initSku_choose(data.data.productAttr)
  }
  initProductDetail(productId)

  // ---- 商品数据处理 ----
  // 1 商品详细信息
  const storeInfo = computed(() => productDetails.value.storeInfo)
  // 1.1 轮播图数据
  const sliderImage = computed(() => storeInfo.value?.slider_image)
  // 2 评价信息
  // 2.1 好评数
  const replyCount = computed(() => productDetails.value.replyCount || 0)
  const replyInfo = computed(() => `用户评价(${ replyCount.value })`)
  // 2.2 好评率
  const replyChance = computed(() => productDetails.value.replyChance || 0)
  const replyRate = computed(() => replyChance.value + '%好评率')
  // 2.3 好评信息
  const reply = computed(() => productDetails.value.reply)
  // 3 推荐商品信息
  const goodsList = computed(() => productDetails.value.good_list)

  onBeforeRouteUpdate((to) => {
    productDetails.value = {}
    // 回到顶部
    document.body.scrollTop = 0
    document.documentElement.scrollTop = 0
    initProductDetail(to.params.productId)
  })

  // popup
  const specState = reactive({
    show: false,
    sku_choose: [],
    productNumb: 1
  })
  const handleShow = () => {
    specState.show = true
  }

  const productAttr = computed(() => productDetails.value?.productAttr)
  const productValue = computed(() => productDetails.value?.productValue)
  
  const sku = computed(() => specState.sku_choose.toString())
  const specDetail = computed(() => productValue.value?.[sku.value])

  const initSku_choose = (productAttr) => {
    // for (let index = 0; index < productAttr.length; index++) {
    //   specState.sku_choose[index] = productAttr[index].attr_values[0]
    // }
    specState.sku_choose = productAttr.map(item => item.attr_values[0])
    // console.log('初始化成功=== ',specState.sku_choose)
  }
  const handleChoose = (attr,index) => {
    specState.sku_choose[index] = attr
    console.log(sku.value)
  }
</script>

<style lang="scss" scoped>

.van-nav-bar {
  position: fixed !important;
}
:deep(.van-tabs__wrap) {
  width: 80%;
  position: fixed;
  top: 0;
  z-index: 999;
  left: 50%;
  transform: translateX(-50%);
}
:deep(.van-tabs__content) {
  padding-top: 44px;
}
.van-swipe-item {
  height: 375px;
  .van-image {
    height: 100%;
  }
}

:deep(.van-cell){
  margin-bottom: 10px;
  .van-cell__title {
    .price {
      font-size: 24px;
      font-weight: 700;
    }
    .pd_title {
      font-size: 16px;
      font-weight: 700;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      margin: 5px 0 10px;
    }
    .van-cell__label {
      display: flex;
      justify-content: space-between;
    }
  }
}
.sku_window {
  margin-bottom: 10px;
}
.van-grid {
  :deep(.van-grid-item__content) {
    padding: 4px;
    .van-image {
      width: 100px;
      height: 100px;
    }
    .store_name {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      overflow: hidden;
      -webkit-box-orient: vertical;
      font-size: 14px;
      margin: 6px 0;
    }
    .store_price {
      color: red;
      font-size: 16px;
      font-weight: 700;
      align-self: flex-start;
    }
  }
}
.description {
  width: 100%;
  :deep(img) {
    width: 100%;
  }
}
:deep(.van-popup) {
  border-radius: 10px 10px 0 0;
  .popup-header {
    margin: 0;
    .van-cell__value {
      display: flex;
      img {
        width: 75px;
        height: 75px;
      }
      .info {
        padding: 8px;
        .title {
          font-size: 16px;
          font-weight: 700;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          overflow: hidden;
          -webkit-line-clamp: 1;
          margin-bottom: 5px;
        }
        .price {
          color: #f2270c;
          font-size: 16px;
        }
        .stock {
          font-size: 12px;
          color: #999;
        }
      }
    }
  }
}
.van-cell__title{
  .attr_name {
    margin-bottom: 5px;
  }
  .attr_tag {
    background-color: #f2f2f2;
    color: #000;
    margin-right: 6px;
    border-color: #ebebeb;
  }
  .attr_tag.active {
    background-color: #ffefee;
    color: #be674e;
    border-color: #be674e;
  }
}

</style>