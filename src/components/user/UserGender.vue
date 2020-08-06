<template>
  <div class="user-gender">
    <van-picker
      title="性别"
      show-toolbar
      :columns="columns"
      :default-index="userGender"
      @confirm="onConfirm"
      @cancel="$emit('close')"
      @change="onChange"
    />
  </div>
</template>
<script>
export default {
  name: 'UserGender',
  props: {
    value: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      columns: ['男', '女'],
      userGender: this.value,
    }
  },
  methods: {
    async onConfirm() {
      this.$toast.loading({
        message: '保存中...',
        forbidClick: true,
        duration: 0,
      })
      try {
        await this.$http.patch('/app/v1_0/user/profile', {
          gender: this.userGender,
        })
        this.$emit('close')
        this.$emit('input', this.userGender)
        this.$toast.success('更新成功')
      } catch (err) {
        return this.$toast.fail('更新失败')
      }
    },
    onChange(picker, value, index) {
      // Toast(`当前值：${value}, 当前索引：${index}`)
      // console.log(picker, value, index)
      this.userGender = index
    },
  },
}
</script>
