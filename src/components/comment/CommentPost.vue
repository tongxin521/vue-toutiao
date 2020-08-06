<template>
  <div class="comment-post">
    <van-field
      class="post-field"
      v-model.trim="message"
      rows="2"
      autosize
      type="textarea"
      maxlength="50"
      placeholder="请输入留言"
      show-word-limit
    />
    <van-button class="post-btn" @click="postComment" :disabled="!message.length">发布</van-button>
  </div>
</template>

<script>
export default {
  name: 'CommentPost',
  components: {},
  props: {
    articleId: {
      type: [String, Number, Object],
      required: true,
    },
    artId: {
      type: [String, Number, Object],
      default: null,
    },
  },
  data() {
    return {
      message: '',
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async postComment() {
      try {
        const { data } = await this.$http.post('/app/v1_0/comments', {
          target: this.articleId.toString(),
          content: this.message,
          art_id: this.artId ? this.artId.toString() : this.artId,
        })
        this.$emit('postComment', data.data.new_obj)
        this.message = ''
      } catch (err) {
        this.$toast.fail('操作失败，请稍后重试')
      }
    },
  },
}
</script>

<style scoped lang="less">
.comment-post {
  display: flex;
  align-items: center;
  padding: 32px 0 32px 32px;
  .post-field {
    background-color: #f5f7f9;
  }
  .post-btn {
    width: 150px;
    border: none;
    padding: 0;
    color: #6ba3d8;
    &::before {
      display: none;
    }
  }
}
</style>
