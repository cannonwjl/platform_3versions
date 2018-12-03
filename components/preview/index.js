// components/preview/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    

    classic: {
      type: Object,
      observer: function(newVal) {
         console.log( "this is preview "+newVal)
         
       
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    typeText:''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onTap:function(event){
      this.triggerEvent('tapping',{
        cid:this.properties.classic,
        
      },{})
    }
  }
})