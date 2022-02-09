<template>
<van-grid :column-num="2" class="product-list" gutter="10" :center="false" :border="false">
  <van-grid-item
    v-for="item in productsData"
    :key="item.id"
    :to="{
      name: 'product',
      params: {
        productId: item.id
      }
    }"
  >
    <van-image
      :src="item.image"
    ></van-image>
    <p class="title">{{item.store_name}}</p>
    <p class="price">¥ {{item.price}}</p>
    <p class="sales">已售 {{item.sales}} 件</p>
  </van-grid-item>
</van-grid>
</template>

<script setup>
  const { productsData } = defineProps({
    productsData: {
      type: Array,
      required: true
    }
  })
</script>

<style lang="scss" scoped>
.product-list {
  margin: 10px 0;
  // .van-grid-item {
  //   border: none;
  // }
  :deep(.van-grid-item__content) {
    border-radius: 10px;
    overflow: hidden;
    padding: 0;
    margin-bottom: 10px;
    .title {
      font-size: 16px;
      padding: 5px 8px 0;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box; //作为弹性伸缩盒子模型显示。
      -webkit-box-orient: vertical; //设置伸缩盒子的子元素排列方式--从上到下垂直排列
      -webkit-line-clamp: 2; //设置显示的行数，多出的部分会显示为...
    }
    .price {
      color: #ee3e3e;
      font-size: 22px;
      font-weight: 700;
      padding-left: 8px;
    }
    .sales {
      color: #ccc;
      font-size: 14px;
      padding-left: 8px;
    }
  }
}
</style>