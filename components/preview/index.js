// components/preview/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    

    classic: {
      type: Object,
      observer: function (classic) {
       // console.log("this is preview " + classic)
        this.setData({
          classic: classic,
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    classic:''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onTap:function(event){
      console.log("this is preiew")
      this.triggerEvent('tapping',{
        gid:this.properties.classic.goods_id,
        
      },{})
    }
  }
})