<template>
  <van-icon @click="onCollect" :color="value?'#ffa500':'#777'" :name="value?'star':'star-o'" />
</template>
<script>
export default {
  name: 'Collect',
  props: {
    value: {
      type: Boolean,
      required: true,
    },
    arrtId: {
      type: [String, Number, Object],
      required: true,
    },
  },
  data() {
    return {}
  },
  created() {},
  methods: {
    async onCollect() {
      this.$toast.loading({
        duration: 0, // 持续展示 toast
        message: '操作中...',
        forbidClick: true, // 是否禁止背景点击
      })
      try {
        if (this.value) {
          // 已收藏文章，取消收藏该文章
          await this.$http.delete(
            `/app/v1_0/article/collections/${this.arrtId}`
          )
          this.$emit('input', !this.value)
          this.$toast.success('取消收藏文章成功！！')
        } else {
          // 未收藏，收藏该文章
          await this.$http.post('/app/v1_0/article/collections', {
            target: this.arrtId,
          })
          this.$emit('input', !this.value)
          this.$toast.success('收藏文章成功！！')
        }
      } catch (err) {
        return this.$toast.fail('操作失败，请重试！')
      }
    },
  },
}
</script>
