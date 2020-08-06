module.exports = {
  // 配置要使用的 PostCSS 插件
  plugins: {
    // 配置使用 autoprefixer 插件
    // 作用：生成浏览器 css 样式规则的前缀
    // VueCLI 内部已经配置了 autoprefixer 插件
    // 所以又配置了一次产生了冲突
    // autoprefixer: { // autoprefixer 插件的配置项
    // 配置要兼容到的环境信息
    //   browsers: ['Android >= 4.0', 'iOS >= 8'],
    // },
    // 配置使用 postcss-pxtorem 插件
    // 作用：把 px 转为 rem
    'postcss-pxtorem': {
      // lib-flexible 的 REM 适配方案 ： 把一行分为10份 ， 每份就是十分之一
      // 所以 rootValue 应该设置为你的设计稿宽度的十分之一
      // 我们的设计稿是750，所以应该设置为 750 / 10 = 75
      // 但是Vant 建议设置为37.5 因为 Vant 是基于37.5 写的
      // 所以必须设置为37.5
      // 唯一的缺点就是使用我们设计稿的尺寸都必须 / 2

      // rootValue 支持两种类型
      // 数字： 固定的数值
      // 函数： 可以动态处理返回
      // postcss-pxtorem 处理每个 CSS 文件的时候都会调用这个函数
      // 他会把被处理的 CSS 文件相关的信息通过参数传递给该函数
      rootValue({ file }) {
        // 如果是Vant的样式 按照 37.5 来转换
        // 如果是自己的样式 按照 75 来转换

        return file.indexOf('vant') !== -1 ? 37.5 : 75
      },
      // 配置要转换的 css 属性
      // * 表示所有
      propList: ['*'],
      exclude: 'github-markdown'
    }
  }
}
