
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
    favorites_goods:[],
    likegoods:[],
    _openid:'',
    usergoods:[],
    counts:null    //用于计算个人物品数
  },
  //查询个人物品
  _onQuery: function (DB, where) {
    const db = wx.cloud.database()
    // 查询当前用户所有的 counters
    if (DB =="favorites")
    {
      db.collection(DB).where({
        _openid: getApp().globalData.openid
      }).get({
        success: res => {
          this.setData({
            favorites_goods: res.data

          })
         // console.log('[数据库] [查询记录] 成功: ', res.data)

          // wx.hideLoading()
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '查询记录失败'
          })
          //  wx.hideLoading()
        //  console.error('[数据库] [查询记录] 失败：', err)

        }
      })
    }
    else if(DB=="goods_table")
    {
      //console.log(DB)
      const _ = db.command
      db.collection(DB).where(_.and([{
        ACL: _.neq('2')
      },
      {
        _openid: getApp().globalData.openid
      }
      ])).get({
        success: res => {
          this.setData({
            likegoods: res.data,
            counts: res.data.length
          })
        //  console.log('[数据库] [查询记录] 成功 个数是: ', res.data.length)

          // wx.hideLoading()
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '查询记录失败'
          })
          //  wx.hideLoading()
       //   console.error('[数据库] [查询记录] 失败：', err)

        }
      })
    }
    
  },

  onShow(options) {
    this._onQuery('favorites', '')
    this._onQuery('goods_table', '')
  },

  getMyFavor() {
    classicModel.getMyFavor(res => {
      //console.log(res)
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
    const gid = event.detail.gid
    const gopenid = getApp().globalData.openid
    const type=100  //用来区分是从哪里去的详情界面
    wx.navigateTo({
      url: `/pages/book-detail/book-detail?gid=${gid}&gopenid=${gopenid}&type=${type}`
    })
  },

  onJumpToMyGoods(){
   // var usergoods=this.data.usergoods.data
   // console.log("this is onJumpTo mygoods functhoi"+usergoods)
    wx.navigateTo({
      url: `/pages/goods-detail/goods-detail`,
    })
  },
  addTodo: function (data) {
    //console.log(data);
    new Todo({
      nickName: data.userInfo.nickName,
      avatarUrl: data.userInfo.avatarUrl,
      language: data.userInfo.language,
    }).save().then(console.log).catch(console.error);
  },


  userAuthorized1() {
    promisic(wx.getSetting)()
      .then(data => {
        if (data.authSetting['scope.userInfo']) {
          return promisic(wx.getUserInfo)()
        }
        return false
      })
      .then(data => {
        if (!data) return
        this.setData({
          authorized: true,
          userInfo: data.userInfo
        })
        console.log(data);
      })
  },


  userAuthorized() {
    wx.getSetting({
      success: data => {
        if (data.authSetting['scope.userInfo']) {

          wx.getUserInfo({
            success: data => {
              this.setData({
                authorized: true,
                userInfo: data.userInfo
              })
              this.addTodo(data);
            }

          })
        }
      }
    })
  },
})
