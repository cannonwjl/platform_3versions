
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

    this._onQuery('goods_table', '')
    // id
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


  //数据查询
  _onQuery: function (DB, where) {
    const db = wx.cloud.database()
    // 查询当前用户所有的 counters
    db.collection(DB).get({
      success: res => {
        this.setData({
          users_goods: res.data,
          usersGoodsType: true
        })
        console.log('[数据库] [查询记录] 成功: ', res.data)
      
        
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        //  wx.hideLoading()
        console.error('[数据库] [查询记录] 失败：', err)
 
      }
    })
  }

})