// pages/book-detail/book-detail.js

import {
  LikeModel
} from '../../models/like.js'

const app = getApp()
const likeModel = new LikeModel()

Page({

  /**
   * 页面的初始数据
   */
  data: {

    userdatas: [], //用来存用户数据
    goodsdatas: [], //用来存物品信息
    goodsid: '', //查到本物品后存下ID用来查找喜欢ID是否存在
    likestatus: false,
    likeCount: 0,
    posting: false,
    counterId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */


  onLoad: function(options) {
    wx.showLoading()
    const id = options.gid
    //在这里进行setdata 存下id用来查找收藏
    this.setData({
      goodsid: id, //查到本物品后存下ID用来查找喜欢ID是否存在

    })
    const openid = options.gopenid
    const appopenid = app.globalData.openid //调取本机用户opendid 查看是否对此物品收藏
    console.log(id + " " + openid)
    const usersdata = this._getOnQuery('user_table', openid)
    const goodsdata = this._getOnQuery('goods_table', id)
    const likedata = this._getOnQuery('favorites', appopenid)

    Promise.all([goodsdata, usersdata, likedata])
      .then(res => {
        console.log(res[0].data[0])
        console.log(res[1].data[0])
        this.setData({
          userdatas: res[1].data[0],
          goodsdatas: res[0].data[0],

        })
        wx.hideLoading()
      })
  },

  onLike(event) {
    const like_or_cancel = event.detail.behavior
    // this.setData({
    //   likestatus:like_or_cancel
    // })
    console.log(like_or_cancel)
    if (like_or_cancel == "like") {
      //likeModel.like(like_or_cancel, this.data.goodsid, 400)
      this._onAdd()
    } else {
      // likeModel.like(like_or_cancel, this.data.goodsid, 400)
      this._onRemove()
    }
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
  _onQuery: function(DB, where, resolve, reject) {
    const db = wx.cloud.database()

    if (DB == "user_table") {
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

    } else if (DB == "goods_table") {
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
    } else if (DB == "favorites") {
      resolve("promise运行成功测试") //promise成功测试  没有查到数据也算失败也要返回
      //通过 _id查找物品信息
      var goodsid = this.data.goodsid
      const _ = db.command
      db.collection(DB).where(_.and([{
        goods_id:goodsid
      },
       {
          _openid:where
      }])).get({
        success: res => {
          
          if(res==null)
          {
            console.log(res)
            this.setData({
              likestatus: false,
              createId: ""
            })
            
          }else
          {
           // console.log(res.data[0].likestatus)
            this.setData({
              likestatus: res.data[0].likestatus,
              createId: res.data[0]._id
            })
            
          }
         
          console.log('[数据库] [查询记录] 成功: ', DB + " " + res)
          
          wx.hideLoading()
        },
        fail: err => {
          this.setData({
            likestatus: false,
            createId: res._id
          })
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
  onShareAppMessage: function() {

  },
  // 添加数据
  _onAdd: function() {
    var data = new Date();
    const db = wx.cloud.database()
    db.collection('favorites').add({
      data: {
        goods_id: this.data.goodsdatas._id, //物品ID
        likestatus: true, //喜欢状态
      },
      success: res => {
        this.setData({
          counterId: res._id
        })
        wx.hideToast();
        // 在返回结果中会包含新创建的记录的 _id
        wx.showToast({
          title: '收藏成功',
        })
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '上传失败'
        })
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })
  },
  //删除
  _onRemove: function() {
    if (this.data.counterId) {
      const db = wx.cloud.database()
      db.collection('favorites').doc(this.data.counterId).remove({
        success: res => {
          wx.showToast({
            title: '删除成功',
          })
          this.setData({
            counterId: '',

          })
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '删除失败',
          })
          console.error('[数据库] [删除记录] 失败：', err)
        }
      })
    } else {
      wx.showToast({
        title: '无记录可删，请见创建一个记录',
      })
    }
  },

})