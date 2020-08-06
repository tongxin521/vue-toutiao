<template>
  <div class="user-nickname">
    <van-nav-bar
      class="user-title"
      title="昵称"
      left-text="取消"
      right-text="完成"
      @click-left="$emit('close')"
      @click-right="onClickRight"
    />
    <van-field
      class="inputText"
      v-model.trim="useName"
      border
      type="textarea"
      maxlength="7"
      placeholder="请输入昵称"
      show-word-limit
    />
  </div>
</template>
<script>
export default {
  name: 'UserNickname',
  components: {},
  props: {
    value: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      useName: this.value,
    }
  },
  methods: {
    async onClickRight() {
      this.$toast.loading({
        message: '保存中...',
        forbidClick: true,
        duration: 0,
      })
      try {
        if (!this.useName.length) {
          return this.$toast.fail('请正确填写昵称')
        }
        await this.$http.patch('/app/v1_0/user/profile', {
          name: this.useName,
        })
        this.$emit('close')
        this.$emit('input', this.useName)
        this.$toast.success('更新成功')
      } catch (err) {
        if (err.response && err.response.status === 409) {
          return this.$toast.fail('用户名不能重复')
        }
        return this.$toast.fail('更新失败')
      }
    },
  },
}
</script>
<style lang="less" scoped>
.user-nickname {
  background: #f5f7f9;
  .user-title {
    background-color: #fff !important;
  }
  .van-cell {
    margin-top: 20px;
  }
}
</style>
