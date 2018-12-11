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
    counterId: '',
    counts: null,
    textcontext:'',
    evaluate:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */


  onLoad: function(options) {
    wx.showLoading()
    const id = options.gid
    console.log(options.type)
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
    //y用物品者的id进行查找评论
    const evaluatedata = this._getOnQuery('short_review', openid)
    Promise.all([goodsdata, usersdata, likedata, evaluatedata])
      .then(res => {
        // console.log(res[0].data[0])
        // console.log(res[1].data[0])
        
        this.setData({
          userdatas: res[1].data[0],
          goodsdatas: res[0].data[0],
          
        })
        wx.hideLoading()
      })
  },

  ontel(evemt) {
    console.log("this is ontel")
    wx.makePhoneCall({
      phoneNumber: this.data.userdatas.tel //仅为示例，并非真实的电话号码
    })
  },

  onpay(evemt) {
    console.log("this is onpay")
    //var data=new Date()
    //  console.log(data)
    this._onAdd_pay() //生成交易记录
    this._onCounterInc() //将书下架
    //支付功能 
    // wx.requestPayment({
    //   'timeStamp':data,
    //   'nonceStr': '1234679841564169',
    //   'package': '',
    //   'signType': 'MD5',
    //   'paySign': '',
    //   'success': function (res) {
    //   },
    //   'fail': function (res) {
    //   }
    // })
  },
  onLike(event) {
    const like_or_cancel = event.detail.behavior
    this.setData({
      likestatus: like_or_cancel
    })
    //console.log(like_or_cancel)
    if (like_or_cancel == "true") {
      //likeModel.like(like_or_cancel, this.data.goodsid, 400)
      this._onAdd()
    } else {
      // likeModel.like(like_or_cancel, this.data.goodsid, 400)
      this._onRemove()
    }
  },

  onFakePost(event) {

   //这里用counterID作为判断如何它有值 说明交易完成了，那么可以对用户进行评论
  //给其他用户作为参考
    if (this.data.counterId!='')
    {
      this.setData({
        posting: true
      })
    }
    else
    {
      wx.showToast({
        title: '支付过后才能评论',
        icon: 'none'
      })
      return
    }
  
  },

  onCancel(event) {
     
     if(this.data.textcontext=='')
     {
       this.setData({
         posting: false,
         textcontext: ''
       })
       return
     }
  //console.log("this is onCancel"+this.data.textcontext)
    this._onAdd_evaluate()
    
    this.setData({
      posting: false,
      textcontext:''
    })
  },

  onPost(event) {
    const comment = event.detail.text || event.detail.value
    //console.log(comment)
    if (!comment) {
      return
    }
  this.setData({
    textcontext:comment
  })
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

  viewMoviePostImg: function (e) {
    var src = this.data.goodsdatas.fileid
    console.log(e)
    wx.previewImage({
      urls: [src],//需要预览的图片HTTP连接列表
      current: src,//当前显示图片的hTTP连接
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
          //console.log('[数据库] [查询记录] 成功: ', DB + " " + res)
          resolve(res) //promise成功测试

        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '查询记录失败'
          })
          //  wx.hideLoading()
          //  console.error('[数据库] [查询记录] 失败：', err)
          reject() //promise失败测试
        }
      })

    } else if (DB == "goods_table") {
      //通过 _id查找物品信息
      db.collection(DB).where({
        _id: where
      }).get({
        success: res => {
          // console.log('[数据库] [查询记录] 成功: ', DB + " " + res)
          resolve(res) //promise成功测试

        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '查询记录失败'
          })
          //  wx.hideLoading()
          // console.error('[数据库] [查询记录] 失败：', err)
          reject() //promise失败测试
        }
      })
    } else if (DB == "favorites") {
      resolve("promise运行成功测试") //promise成功测试  没有查到数据也算失败也要返回
      //通过 _id查找物品信息
      var goodsid = this.data.goodsid
      const _ = db.command
      db.collection(DB).where(_.and([{
          goods_id: goodsid
        },
        {
          _openid: where
        }
      ])).get({
        success: res => {

          if (res == null) {
            console.log(res)
            this.setData({
              likestatus: false,
              counterId: ""
            })

          } else {
            // console.log(res.data[0].likestatus)
            this.setData({
              likestatus: res.data[0].likestatus,
              counterId: res.data[0]._id
            })

          }
        }
      })
      //这里再查一遍 查这个表里多少人喜欢这个物品
      db.collection(DB).where({
        goods_id: goodsid
      }).get({
        success: res => {
          if (res == null) {
            this.setData({
              counts: 0
            })

          } else {
            this.setData({
              counts: res.data.length
            })

          }
          //  console.log('[数据库] [查询记录] 成功: ', DB + "喜欢数 " + res.data.length)

          wx.hideLoading()
        },
        fail: err => {
          this.setData({
            counts: 0
          })
          //  wx.hideLoading()

        }
      })
    }
    else if (DB == "short_review") {
      resolve("promise运行成功测试+运行了shortreveiw") //promise成功测试  没有查到数据也算失败也要返回
      //通过 _id查找物品信息
      var goodsid = this.data.goodsid
      const _ = db.command
      db.collection(DB).where(
        {
          _openid: where
        }
      ).get({
        success: res => {

          if (res == null) {
            console.log(res)
            this.setData({
              evaluate: ""
             
            })

          } else {
            console.log("this is short_review!!:")
            console.log(res.data)
            this.setData({
              evaluate:res.data
            })

          }
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
        goods_info: {

          goods_openid: this.data.goodsdatas._openid,
          fileid: this.data.goodsdatas.fileid,
          updatedAT: this.data.goodsdatas.upadatedAT,
          name: this.data.goodsdatas.goods_name,
          introdution: this.data.goodsdatas.introdution,
          price: this.data.goodsdatas.price,
        },
        user_info: {
          usernames: this.data.userdatas.username,
          tel: this.data.userdatas.tel,
          address: this.data.userdatas.address,
          address1: this.data.userdatas.address1
        }
        // 为待办事项添加一个地理位置（113°E，23°N）
        //location: new db.Geo.Point(113, 23),
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
        // console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '上传失败'
        })
        //  console.error('[数据库] [新增记录] 失败：', err)
      }
    })
  },
  //交易记录
  _onAdd_pay: function() {
    var data = new Date();
    const db = wx.cloud.database()
    db.collection('deal_table').add({
      data: {
        goods_id: this.data.goodsdatas._id, //物品ID
        sell_openid: this.data.goodsdatas._openid, //出售者ID
        time: data, //交易时间
        // 为待办事项添加一个地理位置（113°E，23°N）
        //location: new db.Geo.Point(113, 23),
      },
      success: res => {
        this.setData({
          counterId: this.data.goodsdatas._id
        })

        wx.hideToast();
        // 在返回结果中会包含新创建的记录的 _id
        wx.showToast({
          title: '收藏成功',
        })
        // console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '上传失败'
        })
        //  console.error('[数据库] [新增记录] 失败：', err)
      }
    })
  },
  //评论记录
  _onAdd_evaluate: function () {
    var data = new Date();
    const db = wx.cloud.database()
    db.collection('short_review').add({
      data: {
        goods_id: this.data.goodsdatas._id, //物品ID
        sell_openid: this.data.goodsdatas._openid, //出售者ID
        time: data, //交易时间
        content:this.data.textcontext
        // 为待办事项添加一个地理位置（113°E，23°N）
        //location: new db.Geo.Point(113, 23),
      },
      success: res => {
         console.log(res)

        wx.hideToast();
        // 在返回结果中会包含新创建的记录的 _id
        wx.showToast({
          title: '评论成功',
        })
        // console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '上传失败'
        })
        //  console.error('[数据库] [新增记录] 失败：', err)
      }
    })
  },
  //更新用户表数据
  _onCounterInc: function() {
    const db = wx.cloud.database()
     //console.log(this.data)
    db.collection('goods_table').doc(this.data.goodsdatas._id).update({
      data: {
        ACL: '2', //物品状态
      },
      success: res => {
        console.log( res)
      },
      fail: err => {
        icon: 'none',
        console.error('[数据库] [更新记录] 失败：', err)
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
            title: '取消成功',
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