
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    authorized: false,
    userInfo: null,
    bookCount: 0,
    classics: null,
    todos_user: [],
    usergoods:[],
    _openid:''
  },
  //查询个人物品
  _onQuery: function (DB, where) {
    const db = wx.cloud.database()
    // 查询当前用户所有的 counters
    db.collection(DB).where({
      _openid: getApp().globalData.openid
    }).get({
      success: res => {
        this.setData({
          usergoods: res

        })
        console.log('[数据库] [查询记录] 成功: ', res.data)
        
        // wx.hideLoading()
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
  },

  onShow(options) {
  
    this._onQuery('goods_table', '')
  },

  getMyFavor() {
    classicModel.getMyFavor(res => {
      console.log(res)
      this.setData({
        classics: res
      })
    })
  },

  onGetUserInfo(event) {
    const userInfo = event.detail.userInfo
    if (userInfo) {
      this.setData({
        userInfo,
        authorized: true
      })
    }
  },

  onJumpToAbout(event) {
    wx.navigateTo({
      url: '/pages/about/about',
    }) 
  },

  onStudy(event) {
    wx.navigateTo({
      url: `/pages/course/course?id=${false}&openid=${false}`
    })
  },

  onJumpToDetail(event) {
    const cid = event.detail.cid
    const type = event.detail.type
    wx.navigateTo({
      url: `/pages/classic-detail/classic-detail?cid=${cid}&type=${type}`
    })
  },

  onJumpToMyGoods(){
    var usergoods=this.data.usergoods.data
    console.log("this is onJumpTo mygoods functhoi"+usergoods)
    wx.navigateTo({
      url: `/pages/goods-detail/goods-detail?usergoods=${usergoods}`,
    })
  }
})
