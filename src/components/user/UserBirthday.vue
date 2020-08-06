<template>
  <van-datetime-picker
    v-model="currentDate"
    type="date"
    title="选择年月日"
    :min-date="minDate"
    :max-date="maxDate"
    @cancel="$emit('close')"
    @confirm="onConfim"
  />
</template>
<script>
import dayjs from 'dayjs'
export default {
  name: 'UserBirthday',
  props: {
    value: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      minDate: new Date(1975, 0, 1),
      maxDate: new Date(),
      currentDate: new Date(this.value),
    }
  },
  methods: {
    async onConfim(value) {
      this.$toast.loading({
        message: '保存中...',
        forbidClick: true,
        duration: 0,
      })
      try {
        await this.$http.patch('/app/v1_0/user/profile', {
          birthday: dayjs(value).format('YYYY-MM-DD'),
        })
        this.$emit('close')
        this.$emit('input', dayjs(value).format('YYYY-MM-DD'))
        this.$toast.success('更新成功')
      } catch (err) {
        return this.$toast.fail('更新失败')
      }
    },
  },
}
</script>
<style lang="stylus" scoped></style>
