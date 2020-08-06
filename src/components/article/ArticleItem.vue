<template>
  <van-cell :to="`/article/${article.art_id}`" class="artile-item">
    <div slot="title" class="title van-multi-ellipsis--l2">{{article.title}}</div>
    <div slot="label">
      <div v-if="article.cover.type===3" class="cover">
        <van-image
          class="cover-imgs"
          v-for="(img,index) in article.cover.images"
          :key="index"
          width="100px"
          height="100px"
          fit="cover"
          :src="img"
        />
      </div>
      <div class="label-useinfo">
        <span class="label-useinfo-item">{{article.aut_name}}</span>
        <span class="label-useinfo-item">{{article.comm_count}}评论</span>
        <span class="label-useinfo-item">{{article.pubdate|relativeTime}}</span>
      </div>
    </div>
    <van-image
      class="cover-right"
      slot="default"
      v-if="article.cover.type===1"
      fit="cover"
      :src="article.cover.images[0]"
    />
  </van-cell>
</template>
<script>
export default {
  name: 'ArtileItem',
  props: {
    article: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {}
  },
}
</script>
<style lang="less" scoped>
.artile-item {
  .title {
    font-size: 24px;
    color: #4f4f4f;
  }
  .label-useinfo {
    font-size: 18px;
    color: #4f4f4f;
    .label-useinfo-item {
      margin-right: 25px;
    }
  }
  .van-cell__value {
    flex: unset;
    width: 232px;
    height: 147px;
    padding-left: 25px;
  }
  .cover-right {
    width: 232px;
    height: 147px;
  }
  .cover {
    display: flex;
    .cover-imgs {
      flex: 1;
    }
    .cover-imgs:nth-child(2) {
      height: 147px;
      margin: 0 8px;
    }
  }
}
</style>
