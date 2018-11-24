

//index.js
const app = getApp()



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
   
    usergoods:[],
    openid: '',
    userInfo: {},
 
    modalHidden: false,  //如果数据没加载完毕这隐藏界面

  },

  _getOnQuery(DB, where) {
    return new Promise((resolve, reject) => {
      this._onQuery(DB, where, resolve, reject)
    })
  },


  // 初始化设置
  onLoad: function (options) {

    wx.showLoading() //加载loading
    var that=this
 
    var appopenid = getApp().globalData.openid;
      this.setData({
        openid: getApp().globalData.openid
      })
 
    that._getOnQuery('goods_table', '')
      .then(res => {
        if (res == "") {
           res=""
        }
        else {
          if (res[0]._openid == this.data.openid) {
            this.setData({
              modalHidden: true
            })
          }
          wx.hideLoading()
        }

      })

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
    const id = event.detail.id
    const openid = event.detail.openid
    wx.navigateTo({
      url: `/pages/course/course?id=${id}&openid=${openid}`
    })
  },

  onShow() {
    console.log("this is show function:" + this.data.usergoods)

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
          usergoods:res.data,
        })
        console.log('[数据库] [查询记录] 成功: ', this.data.usergoods)
        resolve(res.data) //promise成功测试
       
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
  },
})
