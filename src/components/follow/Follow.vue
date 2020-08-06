<template>
  <van-button
    v-if="!value"
    class="follow-btn"
    type="info"
    color="#3296fa"
    round
    :loading="isLoading"
    size="small"
    icon="plus"
    @click="onFollow"
  >关注</van-button>
  <van-button
    v-else
    class="follow-btn"
    round
    size="small"
    :loading="isLoading"
    @click="onFollow"
  >已关注</van-button>
</template>
<script>
export default {
  name: 'Follow',
  props: {
    value: {
      type: Boolean,
      required: true,
    },
    useId: {
      type: [String, Number, Object],
      required: true,
    },
  },
  data() {
    return {
      isLoading: false,
    }
  },
  created() {},
  methods: {
    async onFollow() {
      this.isLoading = true
      try {
        if (this.value) {
          // 已关注，取消关注用户
          await this.$http.delete(`/app/v1_0/user/followings/${this.useId}`)
          this.$toast.success('取消关注用户成功')
          this.$emit('input', !this.value)
        } else {
          // 未关注,关注用户
          await this.$http.post('/app/v1_0/user/followings', {
            target: this.useId,
          })
          this.$emit('input', !this.value)
          this.$toast.success('关注用户成功')
        }
      } catch (err) {
        if (err.response && err.response.status === 400) {
          return this.$toast.fail('不能关注自己')
        }
        return this.$toast.fail('操作失败，请重试', err)
      }
      this.isLoading = false
    },
  },
}
</script>
