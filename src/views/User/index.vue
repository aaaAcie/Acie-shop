<template>
  <div class="container">
    <div class="header">
      <img :src="userAvatar">
      <div class="user-info">
        <span class="user-name">{{username}}</span>
        <span class="user-id">{{userID}}</span>
      </div>
      <van-icon name="setting-o" />
    </div>
    <div class="main">
      <van-cell-group inset class="user-detail">
        <van-cell>
          <van-grid :border="false">
            <van-grid-item>
              <div class="text">收藏</div>
              <div class="num">{{collectCount}}</div>
            </van-grid-item>
            <van-grid-item>
              <div class="text">积分</div>
              <div class="num">{{integral}}</div>
            </van-grid-item>
            <van-grid-item>
              <div class="text">收藏夹</div>
              <div class="num">{{couponCount}}</div>
            </van-grid-item>
            <van-grid-item>
              <div class="text">余额</div>
              <div class="num">{{now_money}}</div>
            </van-grid-item>
          </van-grid>
        </van-cell>
      </van-cell-group>
      <van-cell-group inset>
        <van-cell title="订单中心" value="查看全部" is-link to="/order" />
        <van-grid column-num="5" :border="false">
          <van-grid-item icon="bill-o" text="待付款" />
          <van-grid-item icon="tosend" text="待发货" />
          <van-grid-item icon="logistics" text="待收货" />
          <van-grid-item icon="comment-o" text="待评价" />
          <van-grid-item icon="sign" text="已完成" />
        </van-grid>
      </van-cell-group>
    </div>
  </div>
  <layout-footer></layout-footer>
</template>

<script setup>
  // import {  } from 'vue'
import LayoutFooter from '@/components/LayoutFooter.vue'
import { getUserInfo } from '@/api/user'
import { ref,computed } from 'vue'

// 数据处理
const userData = ref({})
// 用户头像
const userAvatar = computed(() => userData.value?.switchUserInfo?.[0].avatar || 'https://shop.fed.lagou.com/uploads/attach/2021/06/20210611/abe8989da91300ab559ddf619597e258.png')
// 用户昵称
const username = computed(() => userData.value?.nickname || '')
// 用户 ID
const userID = computed(() => 'ID：' + (userData.value?.uid || ''))

// 用户详情信息
const collectCount = computed(() => userData.value?.collectCount?.toString() || '')
const integral = computed(() => userData.value?.integral?.toString() || '')
const couponCount = computed(() => userData.value?.couponCount?.toString() || '')
const now_money = computed(() => userData.value?.now_money?.toString() || '')

async function initUserInfo() {
  const { data } = await getUserInfo()
  // console.log(data)
  userData.value = data.data
}
initUserInfo()

</script>

<style lang="scss" scoped>
.container {
  // background-color: #f5f7f9;
  height: 600px;
  padding: 15px 0;
  background: radial-gradient(circle at 50% -10%, #FBC546 72%, #F6F7F9 72%) #F6F7F9 0 -300px no-repeat;
}
.header {
  display: flex;
  padding: 0 15px 15px;
  align-items: center;
  img {
    height: 60px;
    width: 60px;
    border-radius: 50%;
    margin-right: 10px;
  }
  .user-info {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 1;
    .user-name {
      font-size: 14px;
      font-weight: 700;
      padding-bottom: 10px;
    }
    .user-id {
      font-size: 12px;
    }
  }
}
.user-detail {
  margin-bottom: 10px;
  .van-grid {
    flex-wrap: nowrap;
    height: 60px;
  }
}
</style>
