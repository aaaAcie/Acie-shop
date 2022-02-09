<template>
<div class="home-main">
  <van-pull-refresh v-model="loadingAll" @refresh="onRefresh">
    <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
      <van-swipe-item
        v-for="(item,index) in swiper"
        :key="index"
      >
        <img :src="item.img">
      </van-swipe-item>
    </van-swipe>
    <van-grid :column-num="4" :icon-size="40">
      <van-grid-item
        v-for="(menu,index) in menus"
        :key="index"
        :icon="menu.img"
        :text="menu.info[0].value"
      />
    </van-grid>
    <van-notice-bar left-icon="fire-o" :scrollable="false">
      <span>热点资讯公告：</span>
      <van-swipe
        vertical
        class="notice-swipe"
        :autoplay="3000"
        :show-indicators="false"
      >
        <van-swipe-item
          v-for="(item,index) in news"
          :key="index"
        >{{item.chiild[0].val}}</van-swipe-item>
      </van-swipe>
    </van-notice-bar>
    
    <van-list
      v-model:loading="state.loading"
      :finished="state.finished"
      finished-text="没有更多了"
      @load="loadProducts"
    >
      <product-list :products-data="productsData"></product-list>
    </van-list>
  </van-pull-refresh>
</div>
</template>

<script setup>
  import { computed, ref, reactive } from 'vue'
  import { getDefaultIndexData } from '@/api/index'
  import { getProductsData } from '@/api/products'
  import ProductList from '@/components/ProductList.vue'

  const indexData = ref({})
  
  const initIndexData = async () => {
    const { data } = await getDefaultIndexData()
    // console.log(data)
    if (data.status!=200) {
      return
    }
    indexData.value = data.data
  }

  initIndexData()

  const swiper = computed(() => {
    return indexData.value.swiperBg?.default.imgList.list
  })
  const menus = computed(() => {
    return indexData.value.menus?.default.imgList.list
  })
  const news = computed(() => {
    return indexData.value.news?.default.newList.list
  })

  let page = 1
  let limit = 6
  // const loading = ref(false)
  const state = reactive({
    loading: false,
    finished: false
  })

  const productsData = ref([])
  const loadProducts = async() => {
    const { data } = await getProductsData({
      page,
      limit
    })
    productsData.value.push(...data.data)

    if(data.status!=200) { return }

    state.loading = false
    // console.log(data.data)
    if (data.data.length < limit) {
      state.finished = true
      console.log('finished')
      return
    }
    page++
  }

  const loadingAll = ref(false)
  const onRefresh = () => {
    loadingAll.value = true
    indexData.value = {}
    productsData.value = []
    page = 1
    state.loading = false
    state.finished = false
    initIndexData()
    loadProducts()
    loadingAll.value = false
  }

</script>

<style lang="scss" scoped>
.my-swipe {
  img {
    height: 170px;
    width: 100%;
  }
}
:deep(.van-notice-bar__content) {
  display: flex;
  align-items: center;
}
.notice-swipe {
  height: 40px;
  line-height: 40px;
}
</style>