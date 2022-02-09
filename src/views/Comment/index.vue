<template>
<van-cell-group>
  <van-cell
    title="商品评价"
    :value="replyRate"
  />
  <van-cell class="count">
    <van-tag round size="large" :class="{active: type===0}" @click="handleTag(0)">全部({{sum_count}})</van-tag>
    <van-tag round size="large" :class="{active: type===1}" @click="handleTag(1)">好评({{good_count}})</van-tag>
    <van-tag round size="large" :class="{active: type===2}" @click="handleTag(2)">中评({{in_count}})</van-tag>
    <van-tag round size="large" :class="{active: type===3}" @click="handleTag(3)">差评({{poor_count}})</van-tag>
  </van-cell>
  <!-- <van-cell title="单元格"  label="描述信息" /> -->
  <div v-if="sum_count!=0">
    <comment-item
      v-for="item in replys"
      :key="item.id"
      :reply="item"
    ></comment-item>
  </div>
  <van-empty
    v-else
    description="暂时还没有评价哦~"
  ></van-empty>
</van-cell-group>
</template>

<script setup>
  import CommentItem from '@/components/CommentItem.vue'
  import { getReplyCount, getReplyDetail } from '@/api/products'
  import { computed, ref } from 'vue'
  const { productId } = defineProps({
    productId: {
      type: [String, Number],
      required: true
    }
  })

  const replyDetail = ref({})
  const initReplyCount = async() => {
    const { data } = await getReplyCount(productId)
    console.log(data.data)
    if (data.status == 200 ){
      replyDetail.value = data.data
    }
  }
  initReplyCount()

  const replyRate = computed(() => `好评率${replyDetail.value?.reply_chance}%`)
  const sum_count = computed(() => replyDetail.value?.sum_count)
  const good_count = computed(() => replyDetail.value?.good_count)
  const in_count = computed(() => replyDetail.value?.in_count)
  const poor_count = computed(() => replyDetail.value?.poor_count)

  let type = ref(0)
  let replys = ref({})
  const getReply = async(type) => {
    const { data } = await getReplyDetail(productId,{type})
    console.log(type,data.data)
    if (data.status == 200 ){
      replys.value = data.data
    }
  }
  getReply(type.value)
  
  const handleTag = (num) => {
    type.value = num
    getReply(type.value)
  }
</script>

<style lang="scss" scoped>
.count .van-cell__value {
  .van-tag {
    margin-right: 8px;
    background-color: #fff;
    color: #000;
    line-height: 24px;
  }
  .active {
    background-color: #ffc43b;
  }
}
</style>