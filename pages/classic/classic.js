var icons=require("../../models/index-data.js");

//index.js
const app = getApp()

Page({


data:{
  icons:[],
},
onLoad:function()
{
  this.setData({
    icons:icons.icons
  })
  // 调用云函数
  wx.cloud.callFunction({
    name: 'login',
    data: {},
    success: res => {
      console.log('[云函数] [login] user openid: ', res.result.openid)
      if (res.result.openid=="")
      {
        res.result.openid='没有注册'
      }
      app.globalData.openid = res.result.openid
    },
    fail: err => {

      console.error('[云函数] [login] 调用失败', err)
    }
  })
},
  toNearby:function(event)
  {
    
    
    console.log(event)
  },
  onSwiperItemTap:function(event)
  {
    var postId = event.target.dataset.postid;
    console.log(event);
    // var src = this.data.goodsdatas.fileid
    // console.log(event)
    // wx.previewImage({
    //   urls: [src],//需要预览的图片HTTP连接列表
    //   current: src,//当前显示图片的hTTP连接
    // })
    wx.showToast({
      title: '功能完善中...',
      icon: 'loading',
      duration: 3000
    });
    
  }

  })