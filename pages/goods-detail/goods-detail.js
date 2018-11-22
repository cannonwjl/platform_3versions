
import {
  ClassicModel
} from '../../models/classic.js'
import {
  BookModel
} from '../../models/book.js'

import {
  promisic
} from '../../util/common.js'

//index.js
const app = getApp()

const classicModel = new ClassicModel()
const bookModel = new BookModel()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    img_url: '',
    img_name: '',
    task: {
      goods_name: '',
      introdution: '',
      fileid: '',
      createdAT: '2016-11-00',
      updatedAT: '2016-11-00',
      price: Number,
      ACL: 0,
    },
    user_goods:[],
    openid: '',
    userInfo: {},
    creating: false,
    modalHidden: true,
    classics: null,
    todos_user: [],
  },

  _getOnQuery(DB, where) {
    return new Promise((resolve, reject) => {
      this._onQuery(DB, where, resolve, reject)
    })
  },


  // 初始化设置
  onLoad: function () {
    
    var that=this
    wx.showLoading() //加载loading
    var appopenid = getApp().globalData.openid;
      this.setData({
        openid: getApp().globalData.openid
      })
    // 初始化昵称
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })
   console.log(this.data)
    that._getOnQuery('goods_table', '')
      .then(res => {

        if (res == "") {
           res=""
        }
        else {
          console.log('data:->', this.data)
          console.log('获取', res[0]._openid)
          console.log('用户', this.data.openid)

          if (res[0]._openid == this.data.openid) {
         
          }
          wx.hideLoading()
        }

      })

  },

  onShow(options) {
    console.log("this is show function:"+this.data.user_goods.data)
  },



  onJumpToAbout(event) {
    wx.navigateTo({
      url: '/pages/about/about',
    })
  },

  onStudy(event) {
    wx.navigateTo({
      url: '/pages/course/course',
    })
  },

  onJumpToDetail(event) {
    const cid = event.detail.cid
    const type = event.detail.type
    wx.navigateTo({
      url: `/pages/classic-detail/classic-detail?cid=${cid}&type=${type}`
    })
  },

 

  //数据查询
  _onQuery: function (DB, where, resolve, reject) {
    const db = wx.cloud.database()
    // 查询当前用户所有的 counters
    db.collection(DB).where({
      _openid: this.data.openid
    }).get({
      success: res => {
        this.setData({
          queryResult: JSON.stringify(res.data, null, 2),
          user_goods:res.data
          
        })
        console.log('[数据库] [查询记录] 成功: ', res.data)
        resolve(res.data) //promise成功测试
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
        reject() //promise失败测试
      }
    })
  },
})
