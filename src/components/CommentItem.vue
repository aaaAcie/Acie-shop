<template>
<van-cell>
  <div class="user-info">
    <van-image :src="reply?.avatar"></van-image>
    <span class="nick-name">{{reply?.nickname}}</span>
    <van-rate readonly v-model="star" size="12"></van-rate>
  </div>
  <div class="add-time">{{reply?.add_time}}</div>
  <div class="comment">{{reply?.comment}}</div>
  <ul class="picture">
    <li
      v-for="item in pics"
    ><img :src="item"></li>
  </ul>
</van-cell>
</template>

<script setup>
  import { computed } from 'vue'

  // import {  } from 'vue'
  const { reply } = defineProps({
    reply: {
      type: Object,
      required: true
    }
  })
  const star = computed(() => Number(reply?.star))
  const pics = computed(() => reply?.pics)
</script>

<style lang="scss" scoped>
.van-cell {
  padding-top: 0;
  .user-info{
    display: flex;
    align-items: center;
    .van-image {
      width: 28px;
      height: 28px;
      margin-right: 6px;
    }
    span {
      margin-right: 6px;
    }
  }
  .add-time {
    color: #82848f;
    font-size: 12px;
  }
  .comment {
    font-size: 14px;
  }
  .picture {
    li {
      float: left;
      padding-right: 7px;
      img {
        width: 78px;
        height: 78px;
      }
    }
  }
}
</style>