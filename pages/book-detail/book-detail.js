// pages/book-detail/book-detail.js

import {
  LikeModel
} from '../../models/like.js'

const likeModel = new LikeModel()

Page({

  /**
   * 页面的初始数据
   */
  data: {
  
    userdatas:[],   //用来存用户数据
    goodsdatas:[],  //用来存物品信息
    likeStatus: false,
    likeCount: 0,
    posting: false
  },

  /**
   * 生命周期函数--监听页面加载
   */


  onLoad: function (options) {
    wx.showLoading()
    const id = options.gid
    const openid = options.gopenid
    console.log(id + " " + openid)
    const usersdata = this._getOnQuery('user_table',openid)
    const goodsdata = this._getOnQuery('goods_table',id)
    // const detail = bookModel.getDetail(bid)
    // const comments = bookModel.getComments(bid)
    // const likeStatus = bookModel.getLikeStatus(bid)
    Promise.all([goodsdata,usersdata])
    .then(res=>{
      console.log(res[0].data[0])
      console.log(res[1].data[0])
      this.setData({
        userdatas: res[1].data[0],
        goodsdatas: res[0].data[0]
      })
      wx.hideLoading()
    })

    // Promise.all([detail, comments, likeStatus])
    //   .then(res => {
    //     this.setData({
    //       book: res[0],
    //       comments: res[1].comments,
    //       likeStatus: res[2].like_status,
    //       likeCount: res[2].fav_nums
    //     })
    //     wx.hideLoading()
    //   })

  },

  onLike(event) {
    const like_or_cancel = event.detail.behavior
    likeModel.like(like_or_cancel, this.data.book.id, 400)
  },

  onFakePost(event) {
    this.setData({
      posting: true
    })
  },

  onCancel(event) {
    this.setData({
      posting: false
    })
  },

  onPost(event) {
    const comment = event.detail.text || event.detail.value
    console.log(comment)
    if (!comment) {
      return
    }

    if (comment.length > 12) {
      wx.showToast({
        title: '短评最多12个字',
        icon: 'none'
      })
      return
    }
  },
    _getOnQuery(DB, where) {
      return new Promise((resolve, reject) => {
        this._onQuery(DB, where, resolve, reject)
      })
    },



  //数据查询
  _onQuery: function (DB, where, resolve, reject) {
    const db = wx.cloud.database()
   
    if(DB=="user_table")
    {
      //通过_openid查找作者表
      db.collection(DB).where({
        _openid: where
      }).get({
        success: res => {
          console.log('[数据库] [查询记录] 成功: ', DB + " " + res)
          resolve(res) //promise成功测试

        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '查询记录失败'
          })
          //  wx.hideLoading()
          console.error('[数据库] [查询记录] 失败：', err)
          reject() //promise失败测试
        }
      })

    }else
    {
      //通过 _id查找物品信息
      db.collection(DB).where({
        _id: where
      }).get({
        success: res => {
          console.log('[数据库] [查询记录] 成功: ', DB + " " + res)
          resolve(res) //promise成功测试

        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '查询记录失败'
          })
          //  wx.hideLoading()
          console.error('[数据库] [查询记录] 失败：', err)
          reject() //promise失败测试
        }
      })
    }
    
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})