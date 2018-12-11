// components/book/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    icons: {
      type: [],
      observer: function (icons) {
        console.log(icons)
        this.setData({
          icons,
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onTap(event) {
      const iid = this.properties.icons.id
      // const gopenid = this.properties.book._openid
      // const type = 50 //用来确定是哪个界面传的参数
      wx.navigateTo({
        url: `/pages/small-function/small-function?iid=${iid}`
      })
      // 降低了组件的通用性
      // 非常方便
      // 服务于当前的项目 项目组件
      // 
    }
  }
})
