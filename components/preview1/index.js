// components/preview/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    usergoods:{
    type: [],
    
      observer: function (usergoods) {
      this.setData({
        usergoods,
      })
      console.log(usergoods)
    }
    }
   
    
    

    
  },

  /**
   * 组件的初始数据
   */
  data: {
    usergoods:''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onTap:function(event){
     // console.log(event)
      console.log("this is preveiw!:" + this.properties.usergoods.ACL)
      this.triggerEvent('tapping',{
        usergooodsArray: this.properties.usergoods,
        id: this.properties.usergoods._id,
        openid: this.properties.usergoods._openid
      },{})
    }
  }
})