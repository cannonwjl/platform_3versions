// components/book/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    book:{
      type:[],
   
      observer: function (book) {
        
      this.setData({
        book,
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
    onTap(event){
      const gid = this.properties.book._id
      const gopenid=this.properties.book._openid
      wx.navigateTo({
        url: `/pages/book-detail/book-detail?gid=${gid}&gopenid=${gopenid}`
      })
      // 降低了组件的通用性
      // 非常方便
      // 服务于当前的项目 项目组件
      // 
    }
  }
})
