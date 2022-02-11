<template>
  <van-form @submit="onSubmit">
    <img class="logo" src="https://v3.cn.vuejs.org/logo.png">
    <van-cell-group inset>
      <van-field
        v-model="state.username"
        name="用户名"
        label="用户名"
        placeholder="用户名"
        :rules="[{ required: true, message: '请填写用户名' }]"
      />
      <van-field
        v-if="state.isPassword"
        v-model="state.password"
        type="password"
        name="密码"
        label="密码"
        placeholder="密码"
        :rules="[{ required: true, message: '请填写密码' }]"
      />
      <van-field
        v-else
        center
        v-model="state.captcha"
        name="验证码"
        label="短信验证码"
        placeholder="验证码"
        :rules="[{ required: true, message: '请填写验证码' }]"
      >
        <template #button>
          <van-button
            size="small"
            type="primary"
            @click="sendCaptcha"
            :disabled="state.isSending"
          >{{state.captchaText}}</van-button>
        </template>
      </van-field>
    </van-cell-group>
    <div style="margin: 16px;">
      <van-button round block type="primary" native-type="submit">
        登录
      </van-button>
      <div class="quick-submit" @click="changeMode">{{state.currentText}}</div>
    </div>
  </van-form>
</template>

<script setup>
  import { getVerifyCode, getVerify, loginByPassword, loginByCaptcha } from '@/api/user'
  import { computed, reactive } from 'vue'
  import { Toast } from 'vant'
  import { useCountDown } from '@vant/use'
  // import router from '../../router'
  import { useRoute, useRouter } from 'vue-router'
  import { useStore } from 'vuex' 
  const router = useRouter()
  const route = useRoute()
  const store = useStore()
  import { getLogo } from '@/api/index'

  const state = reactive({
    username: '17201234567',
    password: 'qwer1234',
    captcha: '',
    isPassword: true,
    isSending: false,
    currentText: computed(() => state.isPassword ? '快速登录' : '密码登录'),
    captchaText: computed(() => state.isSending ? state.countDown.seconds+' s 后再发送' : '发送验证码'),
    countDown: null,
    logoUrl: ''
  })
  
  function changeMode() {
    state.isPassword = !state.isPassword
    state.password = ''
    state.captcha = ''
  }
  const sendCaptcha = async() => {
    // 手机号规则校验
    if (!/^1\d{10}$/.test(state.username)) {
      return Toast('请检查用户名')
    }
    const { data: getKey } = await getVerifyCode()
    console.log(getKey)
    if (getKey.status != 200){ return }
    const { data: getKey2 } = await getVerify({
      key: getKey.data.key,
      phone: state.username,
      type: 'login'
    })
    if (getKey2.status != 200){
      Toast('网络开小差了，请稍后再试')
      return
    }
    Toast('发送验证码成功')

    const countDown = useCountDown({
      time: 10*1000,
      onFinish () {
        state.isSending = false
      }
    })
    countDown.start()
    state.countDown = countDown.current
    state.isSending = true
  }
  const onSubmit = async(values) => {
    // 用户名检测
    const username = state.username.trim()
    if (username === '') { return Toast('请检测用户名') }

    // console.log('submit', values)
    let data = ''
    if ( state.isPassword ) {
      // const password = state.password.trim()
      ({ data } = await loginByPassword({
        account: state.username,
        password: state.password
      }))
    } else {
      // const captcha = state.captcha.trim()
      ({ data } = await loginByCaptcha({
        phone: state.username,
        captcha: state.captcha
      }))
    }
    if (data.status == 200){
      Toast('登录成功')
      console.log(data)
    } else {
      Toast('账号或密码错误')
    }
    store.commit('setUser',data.data.token)
    router.push(route.query.redirect ?? '/user')
  }

  // 头像处理
  const initLog = async () => {
    const { data } = await getLogo()
    if (data.status != 200){ return }
    state.logoUrl = data.data.logo_url
    console.log(data)
  }
  initLog()
</script>

<style lang="scss" scoped>
.van-form {
  display: flex;
  flex-direction: column;
}
.logo {
  align-self: center;
  width: 150px;
  height: 150px;
  margin: 70px 0 10px;
}
.quick-submit {
  color: #bcbabb;
  font-size: 14px;
  margin-top: 10px;
  text-align: center;
}
</style>