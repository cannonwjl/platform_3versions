import {
  random
} from '../../util/common.js'

var util = require('../../util/util.js');
var app = getApp();

Page({
  data: {
    array: [],
    arraytype: false,
    img_url: '',
    img_name: '',
    task: {
      goods_name: '请输入物品名称',
      introdution: '请输入物品介绍',
      fileid: '',
      createdAT: '2016-11-00',
      updatedAT: '2016-11-00',
      price: '请输入物品价格',
      ACL: 0,

    },
    openid: '',
    counterId:'',
    userInfo: {},
    creating: false,
    button: {
      txt: '新建',
      txt1: '更改'
    },

    buttonType: false,
    modalHidden: true
  },
  // 设置物品名称
  bindKeyInput: function(e) {
    this.setData({
      'task.goods_name': e.detail.value
    });
  },
  // 设置物品介绍
  bindKeyInput1: function(e) {
    this.setData({
      'task.introdution': e.detail.value
    });
  },
  //物品价格
  bindKeyInputPrice: function(e) {
    this.setData({
      'task.price': e.detail.value
    })
  },

 

  // 设置开始日期
  startDateChange: function(e) {
    this.setData({
      'task.startDay': e.detail.value
    })
  },

  // 设置结束日期
  endDateChange: function(e) {
    this.setData({
      'task.endDay': e.detail.value
    })
  },


  // 隐藏提示弹层
  modalChange: function(e) {
    this.setData({
      modalHidden: true
    })
  },
  // 添加数据
  onAdd: function() {
    var data = new Date();
    const db = wx.cloud.database()
    db.collection('goods_table').add({
      data: {
        goods_name: this.data.task.goods_name, //物品名称
        introdution: this.data.task.introdution, //物品介绍
        fileid: this.data.task.fileid, //物品照片
        createdAT: this.data.task.createdAT, //发布时间
        updatedAT: this.data.task.updatedAT, //更新时间
        price: this.data.task.price, //物品价格
        ACL: this.data.task.ACL, //物品状态
      },
      success: res => {
        wx.hideToast();
        // 在返回结果中会包含新创建的记录的 _id
        wx.showToast({
          title: '上传成功',
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

  // 提交、检验
  bindSubmit: function(e) {
    var that = this;
    var task = this.data.task;
    var creating = this.data.creating;
    // console.log(this.data);
    if (task.name == '' || task.introdution == '' || !task.price) {
      this.setData({
        modalHidden: false
      });
    } else {
      if (!creating) {
        this.setData({
          'creating': true
        });
        that.createTask();
      }
    }
  },


  // 创建任务
  createTask: function() {
    var that = this;
    var task = this.data.task;
 
    //如arraytype为false则创建否则修改
    if (!this.data.arraytype) {
      wx.showToast({
        title: '新建中',
        icon: 'loading',
        duration: 10000
      });
      this._getUpimage()
        .then(res => {
          that.setData({
            'task.fileid': res
          })
          //this.uploadImg()
          //cretated add database
          this.onAdd();
          wx.hideLoading()
          wx.switchTab({
            url: '/pages/my/my',
          })
        })
      //console.log("this is onAdd()")
      
     
    } else {
      wx.showToast({
        title: '更改中',
        icon: 'loading',
        duration: 10000
      });


      this._getUpimage()
        .then(res => {
          that.setData({
            'task.fileid': res,
            'img_url':res
          })
      this._onCounterInc()
          console.log("this is_onCounterInc")
          wx.hideLoading()
          wx.switchTab({
            url: '/pages/my/my',
          })
        })
      
    }
   
  },

  //获取本地图片信息
  uploadImg: function() {
    // console.log("测试上传代码运行")
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        const tempFilePath = res.tempFilePaths[0]
        console.log('cloudPath')
        const cloudPath = 'goods/' + random(17) + tempFilePath.match(/\.[^.]+?$/)[0]
        console.log(cloudPath)
        this.setData({
          img_url: res.tempFilePaths[0],
          img_name: cloudPath
        })
      },
    })
  },

  //上传获取图片ID
  _getUpimage() {
    return new Promise((resolve, reject) => {
      this.upImage(resolve, reject)
    })
  },

  //上传图片
  upImage(resolve, reject) {
    var that = this;

    const filePath = that.data.img_url
    const cloudPath = that.data.img_name
    console.log('cloudPath', cloudPath)
    console.log('filePath', filePath)
    wx.cloud.uploadFile({
      cloudPath,
      filePath,
      success: res => {
        console.log('[上传文件] 成功：', res)
        app.globalData.fileID = res.fileID
        app.globalData.cloudPath = cloudPath
        app.globalData.imagePath = filePath
        resolve(res.fileID) //promise成功测试
      },
      fail: e => {
        console.error('[上传文件] 失败：', e)
        wx.showToast({
          icon: 'none',
          title: '上传失败',
        })
        reject() //promise失败测试
      },
      complete: () => {
        wx.hideLoading()
      }
    })
  },
  onShow: function() {
    // 恢复新建按钮状态
    this.setData({
      'creating': false
    });
  },
  onHide: function() {},

  // 初始化设置
  onLoad: function(options) {
    var that = this;
    console.log(options)
    // 初始化昵称
    app.getUserInfo(function(userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      });

    });

// 这部分代码判断 options.id无值 说明是新加物品
    if (options.id == 'false') {
      console.log(options.id);
      console.log(options.openid);
      this.setData({
        task:this.data.task
      })
      var now = new Date();
      var openId = wx.getStorageSync('openId');
      // 初始化日期
      that.setData({
        'task.createdAT': util.getYMD(now),
        'task.updatedAT': util.getYMD(now)
      });
      return
    }

// 这部分代码判断 options.id有值 说明从个人物品跳过来的  需要通过options.id查下信息显示到界面
//并且保存下options.id值到counterId以备删除用
    if (options.id != false) {
      this._onQuery('goods_table', options.id)
      this.setData({
        counterId: options.id
      })
      console.log(options.id);
      console.log(options.openid);
      return
    }
   

  },
  //删除函数
  //问题调回个人物品界面无法重新加载数 所以体验不是很好
  //只能调个人界面
  dropSubmit:function()
  {
      this._onRemove()
    wx.switchTab({
      url: '/pages/my/my',
    })
  },

  //删除
  _onRemove: function () {
    if (this.data.counterId) {
      const db = wx.cloud.database()
      db.collection('goods_table').doc(this.data.counterId).remove({
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
  //更新用户表数据
  _onCounterInc: function () {
    const db = wx.cloud.database()
    console.log(this.data)
    db.collection('goods_table').doc(this.data.counterId).update({
      data: {
        goods_name: this.data.task.goods_name, //物品名称
        introdution: this.data.task.introdution, //物品介绍
        fileid: this.data.task.fileid, //物品照片
        createdAT: this.data.task.createdAT, //发布时间
        updatedAT: this.data.task.createdAT, //更新时间
        price: this.data.task.price, //物品价格
        ACL: this.data.task.ACL, //物品状态
      },
      success: res => {
        this.setData({
          goods_name: this.data.task.goods_name, //物品名称
          introdution: this.data.task.introdution, //物品介绍
          fileid: this.data.task.fileid, //物品照片
          createdAT: this.data.task.createdAT, //发布时间
          updatedAT: this.data.task.createdAT, //更新时间
          price: this.data.task.price, //物品价格
          ACL: this.data.task.ACL, //物品状态
        })
      },
      fail: err => {
        icon: 'none',
          console.error('[数据库] [更新记录] 失败：', err)
      }
    })
  },

  //数据查询
  _onQuery: function (DB, where, resolve, reject) {
    const db = wx.cloud.database()
    // 查询当前用户所有的 counters
    db.collection(DB).where({
      _id: where
    }).get({
      success: res => {
        this.setData({
          array: res.data,
          arraytype: true
        })
        console.log('[数据库] [查询记录] 成功: ', res.data)
        // resolve(res.data) //promise成功测试
        console.log(this.data.array)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        //  wx.hideLoading()
        console.error('[数据库] [查询记录] 失败：', err)
        // reject() //promise失败测试
      }
    })
  },
})