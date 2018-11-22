// components/preview/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    user_goods:{
    type: Object,
    
    observer: function (newVal) {
      this.setData({
        user_goods,
      })
    }
    }
   
    
    

    
  },

  /**
   * 组件的初始数据
   */
  data: {
    user_goods:''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onTap:function(event){
      this.triggerEvent('tapping',{
        cid:this.properties.classic.id,
        type:this.properties.classic.type
      },{})
    }
  }
})