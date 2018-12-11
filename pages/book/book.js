
import {
  random
} from '../../util/common.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
   
    searching:false,
    more:'',
    users_goods:[],
    usersGoodsType:false
  },

  /**
   * 生命周期函数--监听页面加
   */
  onLoad: function (optins) {

    this._onQuery('goods_table')
    // id
  },
  onPullDownRefresh(){
    this._onQuery('goods_table')
  },

  onSearching(event){
    this.setData({
      searching:true
    })
  },

  onCancel(event){
    this.setData({
      searching:false
    }) 
  },

  onReachBottom(){
    this.setData({
      more:random(16)
    })
  },
//云函数的查询
_onqurydata(){
  wx.cloud.callFunction({
    name: 'counterdata',
    data: {
      a: 1,
      b: 2
    },
    success: res => {
      wx.showToast({
        title: '加载成功',
      })
      console.log(res.result)
      this.setData({
        users_goods: res.result.data,
          usersGoodsType: true
       })
    },
    fail: err => {
      wx.showToast({
        icon: 'none',
        title: '调用失败',
      })
      console.error('[云函数] [sum] 调用失败：', err)
    }
  })
},
 

  //数据查询
  _onQuery: function (DB) {
    this._onqurydata()
  //    const db = wx.cloud.database()
  //   db.collection('goods_table').orderBy('createdAT', 'desc').get({
  //     success: res => {
  //       console.log(res)
  //       this.setData({
  //         users_goods: res.data,
  //         usersGoodsType: true
  //       })
  //      // console.log('[数据库] [查询记录] 成功: ', res.data)
      
        
  //     },
  //     fail: err => {
  //       wx.showToast({
  //         icon: 'none',
  //         title: '查询记录失败'
  //       })
  //       //  wx.hideLoading()
  //     //  console.error('[数据库] [查询记录] 失败：', err)
 
  //     }
  //  })
  }

})