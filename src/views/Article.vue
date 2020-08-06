<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" left-arrow title="黑马头条" @click-left="$router.back()"></van-nav-bar>
    <!-- /导航栏 -->

    <div class="main-wrap">
      <!-- 加载中 -->
      <div class="loading-wrap" v-if="isLoding">
        <van-loading color="#3296fa" vertical>加载中</van-loading>
      </div>
      <!-- /加载中 -->

      <!-- 加载完成-文章详情 -->
      <div class="article-detail markdown-body" v-else-if="article.title">
        <!-- 文章标题 -->
        <h1 class="article-title">{{ article.title }}</h1>
        <!-- /文章标题 -->

        <!-- 用户信息 -->
        <van-cell class="user-info" center :border="false">
          <van-image class="avatar" slot="icon" round fit="cover" :src="article.aut_photo" />
          <div slot="title" class="user-name">{{ article.aut_name }}</div>
          <div slot="label" class="publish-date">{{ article.pubdate | relativeTime }}</div>

          <follow class="follow-btn" :useId="article.aut_id" v-model="article.is_followed"></follow>
        </van-cell>
        <!-- /用户信息 -->
        <!-- 文章内容 -->
        <div ref="contentRef" class="article-content" v-html="article.content"></div>
        <van-divider>正文结束</van-divider>
        <comment-list
          :list="commentLists"
          :articleId="articleId"
          @commentNumber="commentNum=$event"
          @onreplypopup="onreplypopup"
        ></comment-list>

        <!-- 底部区域 -->
        <div class="article-bottom">
          <van-button
            class="comment-btn"
            type="default"
            round
            size="small"
            @click="isPostShow=true"
          >写评论</van-button>
          <van-icon name="comment-o" :info="commentNum" color="#777" />
          <collect :arrtId="article.art_id" v-model="article.is_collected"></collect>
          <like :arrtId="article.art_id" v-model="article.attitude"></like>
          <van-icon name="share" color="#777777"></van-icon>
        </div>
        <!-- /底部区域 -->

        <!-- 发表评论弹出层 -->
        <van-popup v-model="isPostShow" position="bottom">
          <comment-post :articleId="articleId" @postComment="addPostComment"></comment-post>
        </van-popup>
        <!-- /发表评论弹出层 -->
      </div>
      <!-- /加载完成-文章详情 -->

      <!-- 加载失败：404 -->
      <div class="error-wrap" v-else-if="errStatus === 404">
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除！</p>
      </div>
      <!-- /加载失败：404 -->

      <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
      <div class="error-wrap" v-else>
        <van-icon name="failure" />
        <p class="text">内容加载失败！</p>
        <van-button class="retry-btn">点击重试</van-button>
      </div>
      <!-- /加载失败：其它未知错误（例如网络原因或服务端异常） -->
      <!-- 回复评论弹出层 -->
      <van-popup v-model="isReplyshow" position="bottom" :style="{ height: '100%' }">
        <comment-reply
          v-if="isReplyshow"
          @close="isReplyshow=false"
          :comment="commentObj"
          :articleId="articleId"
        ></comment-reply>
      </van-popup>
      <!-- /回复评论弹出层 -->
    </div>
  </div>
</template>

<script>
import '@/style/github-markdown.css'
import { ImagePreview } from 'vant'
import Follow from '@/components/follow/Follow.vue'
import Collect from '@/components/collect/Collect.vue'
import Like from '@/components/like/Like.vue'
import CommentList from '@/components/comment/CommentList.vue'
import CommentPost from '@/components/comment/CommentPost.vue'
import CommentReply from '@/components/comment/CommentReply.vue'
export default {
  name: 'Article',
  components: {
    Follow,
    Collect,
    Like,
    CommentList,
    CommentPost,
    CommentReply,
  },
  props: {
    articleId: {
      type: [Number, String, Object],
      required: true,
    },
  },
  data() {
    return {
      // 文章详情数据
      article: {},
      // 显示或隐藏 loding 动画
      isLoding: true,
      // 根据状态码来显示不同的错误内容
      errStatus: 0,
      // 评论的总数
      commentNum: 0,
      // 显示隐藏弹出层
      isPostShow: false,
      // 评论列表
      commentLists: [],
      // 显示隐藏回复评论弹出层
      isReplyshow: false,
      // 回复评论用户数据
      commentObj: {},
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getArticleDetails()
  },
  mounted() {},
  methods: {
    async getArticleDetails() {
      try {
        const { data } = await this.$http.get(
          `/app/v1_0/articles/${this.articleId}`
        )
        this.article = data.data
        setTimeout(() => {
          this.previewImages()
        }, 0)
      } catch (err) {
        if (err.response && err.response.status === 400) {
          this.errStatus = 404
        }
        return this.$toast.fail('获取文章详细失败', err)
      }
      this.isLoding = false
    },
    previewImages() {
      const contentDom = this.$refs.contentRef
      const imgs = contentDom.querySelectorAll('img')
      const images = []
      imgs.forEach((item, index) => {
        images.push(item.src)
        item.onclick = () => {
          ImagePreview({
            images,
            startPosition: index,
          })
        }
      })
    },
    addPostComment(e) {
      // 关闭弹出层
      this.isPostShow = false
      // 将发布文章渲染到页面
      this.commentLists.unshift(e)
      this.commentNum++
    },
    onreplypopup(data) {
      this.isReplyshow = true
      this.commentObj = data
    },
  },
}
</script>

<style scoped lang="less">
.article-container {
  .main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 92px;
    bottom: 88px;
    overflow-y: scroll;
    background-color: #fff;
  }
  .article-detail {
    .article-title {
      font-size: 40px;
      padding: 50px 32px;
      margin: 0;
      color: #3a3a3a;
    }

    .user-info {
      padding: 0 32px;
      .avatar {
        width: 70px;
        height: 70px;
        margin-right: 17px;
      }
      .van-cell__label {
        margin-top: 0;
      }
      .user-name {
        font-size: 24px;
        color: #3a3a3a;
      }
      .publish-date {
        font-size: 23px;
        color: #b7b7b7;
      }
      .follow-btn {
        width: 170px;
        height: 58px;
      }
    }

    .article-content {
      padding: 55px 32px;
      /deep/ p {
        text-align: justify;
      }
    }
  }

  .loading-wrap {
    padding: 200px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  .error-wrap {
    padding: 200px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    .van-icon {
      font-size: 122px;
      color: #b4b4b4;
    }
    .text {
      font-size: 30px;
      color: #666666;
      margin: 33px 0 46px;
    }
    .retry-btn {
      width: 280px;
      height: 70px;
      line-height: 70px;
      border: 1px solid #c3c3c3;
      font-size: 30px;
      color: #666666;
    }
  }

  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 88px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
      width: 282px;
      height: 46px;
      border: 2px solid #eeeeee;
      font-size: 30px;
      line-height: 46px;
      color: #a7a7a7;
    }
    .van-icon {
      font-size: 40px;
      .van-info {
        font-size: 16px;
        background-color: #e22829;
      }
    }
  }
  .van-nav-bar {
    z-index: unset;
  }
}
</style>
