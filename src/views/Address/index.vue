<template>
  <!-- 导航 -->
  <van-nav-bar
    title="新增收货地址"
    left-text="返回"
    left-arrow
    @click-left="onClickLeft"
  />
  <!-- 表单 -->
  <van-form @submit="onSubmit">
    <van-cell-group inset>
      <!-- 1 姓名 -->
      <van-field
        v-model="real_name"
        name="姓名"
        label="姓名"
        placeholder="收货人姓名"
      />
      <!-- 2 手机号 -->
      <van-field
        v-model="phone"
        name="电话"
        label="电话"
        placeholder="收货人手机号"
      />
      <!-- 3 地区 -->
      <van-field
        v-model="fieldValue"
        is-link
        readonly
        label="地区"
        placeholder="请选择所在地区"
        @click="show = true"
      />
      <van-popup v-model:show="show" round position="bottom">
        <van-cascader
          v-model="area"
          title="请选择所在地区"
          :options="options"
          :field-names="fieldNames"
          @close="show = false"
          @finish="onFinish"
        />
      </van-popup>
      <!-- 4 详细地址 -->
      <van-field
        v-model="detail"
        name="详细地址"
        label="详细地址"
        placeholder="详细地址信息"
      />
    </van-cell-group>
    <van-cell-group inset>
      <van-field name="switch" label="设置默认地址" input-align="right">
        <template #input>
          <van-switch v-model="is_default" size="20" />
        </template>
      </van-field>
    </van-cell-group>
    <div style="margin: 16px;">
      <van-button
        round
        block
        type="primary"
        native-type="submit"
        @click="handleAdd"
      >
        提交
      </van-button>
    </div>
  </van-form>
</template>

<script setup>
  import { ref } from 'vue'
  import { getCityList, addAddress } from '@/api/address'
  
  const real_name = ref('')
  const phone = ref('')
  const area = ref('')
  const detail = ref('')
  const is_default = ref(false)
  // 地区菜单显示状态
  const show = ref(false)
  // 地区选择后，输入框显示的内容
  const fieldValue = ref('')
  let address = {}
  // 选项列表，children 代表子选项，支持多级嵌套
  const options = ref([])
  const fieldNames = {
    text: 'n',
    value: 'v',
    children: 'c',
  }
  const initCityList = async () => {
    const { data } = await getCityList()
    console.log(data)
    options.value = processData(data.data)
  }
  initCityList()

  const processData = (data) => {
    data.forEach(item => {
      if(item.c.length === 0) {
        delete item.c
      } else {
        processData(item.c)
      }
    })
    return data
  }

  const onFinish = ({ selectedOptions }) => {
    show.value = false
    fieldValue.value = selectedOptions.map((option) => option.n).join('/')
    console.log(selectedOptions)
    address = {
      province: selectedOptions[0].n,
      city: selectedOptions[1].n,
      city_id: selectedOptions[1].v,
      district: selectedOptions[2].n
    }
  }

  const { cardId } = defineProps({
    cardId: {
      type: String,
      required: true
    }
  })

  const handleAdd = async () => {
    const { data } = await addAddress({
      id: 0,
      real_name: real_name.value,
      phone: phone.value,
      is_default: is_default.value,
      detail: detail.value,
      address
    })
    if (data.status !== 200) return
    // 成功时检测是否要跳回到订单确认页
    if (cardId) {
      router.push({
        name: 'order-confirm',
        params: {
          cardId
        }
      })
    } else {
      router.push('/user')
    }
  }
  const onSubmit = () => console.log('submit')

  const onClickLeft = () => history.back()
</script>

<style lang="scss" scoped></style>