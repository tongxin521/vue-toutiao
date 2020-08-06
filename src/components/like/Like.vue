<template>
  <van-icon
    @click="onLike"
    :color="value === 1 ? 'red' : '#777'"
    :name="value===1?'good-job':'good-job-o'"
  />
</template>
<script>
export default {
  name: 'Like',
  props: {
    value: {
      type: Number,
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
    async onLike() {
      this.$toast.loading({
        duration: 0, // 持续展示 toast
        message: '操作中...',
        forbidClick: true, // 是否禁止背景点击
      })
      try {
        if (this.value === 1) {
          // 已点赞，取消点赞文章
          await this.$http.delete(`/app/v1_0/article/likings/${this.arrtId}`)
          this.$toast.success('取消点赞')
          this.$emit('input', -1)
        } else {
          // 未点赞，点赞文章
          await this.$http.post('/app/v1_0/article/likings', {
            target: this.arrtId,
          })
          this.$toast.success('点赞成功')

          this.$emit('input', 1)
        }
      } catch (err) {
        return this.$toast.fail('操作失败，请重试', err)
      }
    },
  },
}
</script>
<style lang="less" scoped>
</style>
