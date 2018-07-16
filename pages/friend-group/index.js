// pages/order-success/index.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    timer: null,
    h: '00',
    m: '00',
    s: '00',
    endDate: null,
    num: null,
    info: null,
    allCount: 0,
    goodsImgs: [
      'http://58.87.98.173:9008/img/index-b.png',
      'http://58.87.98.173:9008/img/index-c.png',
      'http://58.87.98.173:9008/img/index-b.png',
      'http://58.87.98.173:9008/img/index-c.png',
      'http://58.87.98.173:9008/img/index-b.png',
      'http://58.87.98.173:9008/img/index-c.png',
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getGroupActivites()
    let list = wx.getStorageSync('activityList')
    let arrEnd = list[0].expireDate.split(/[- : \/]/)
    this.setData({
      orderType: +options.orderType,
      pid: +options.pid,
      offeringId: options.offeringId,
      goodsName: options.goodsName,
      pOpenid: options.openid,
      endDate: new Date(arrEnd[0], arrEnd[1] - 1, arrEnd[2], arrEnd[3], arrEnd[4], arrEnd[5]).getTime(),
      num: list[0].upGroupRule.gpMembersNum - 1,
      goodsList: list[0].offeringList,
      activityList: list
    })
    this.countTime()
    this.getOpenId()

    this.getGoodsInfo()

    this.getOrder()

    this.getGroupInfo()

  },
  toHome() {
    wx.reLaunch({
      url: '/pages/index/index'
    })
  },
  toGroupBuy: function(e) {
    wx.navigateTo({
      url: '/pages/group/index?offeringId=' + e.target.dataset.id + '&beginDate=' + this.data.activityList[0].effectiveDate + '&endDate=' + this.data.activityList[0].expireDate
    })
  },
  getOrder() {
    wx.request({
      url: app.globalData.urlHeaderA + 'myGroups/' + this.data.pid,
      success: (res) => {
        this.setData({
          info: res.data
        })
      },
      faile: (res) => {
        wx.showToast({
          title: '服务器错误',
          icon: 'none'
        })
      }
    })
  },
  getGoodsInfo() {
    wx.request({
      url: app.globalData.urlHeaderB + 'product/v1/offering/getOffer',
      data: {
        offeringId: this.data.offeringId,
        eparchyCode: 431
      },
      success: (res) => {
        this.setData({
          detail: res.data.offeringDetail
        })
      },
      faile: (res) => {
        wx.showToast({
          title: '服务器错误',
          icon: 'none'
        })
      }
    })
  },
  getGroupInfo() {
    wx.request({
      url: app.globalData.urlHeaderA + 'groups',
      data: {
        offeringId: this.data.offeringId,
        openid: wx.getStorageSync('openid')
      },
      success: (res) => {

        this.setData({
          allCount: res.data.allCount
        })
      },
      faile: (res) => {
        wx.showToast({
          title: '服务器错误',
          icon: 'none'
        })
      }
    })
  },
  getGroupActivites() {
    wx.request({
      url: app.globalData.urlHeaderB + 'product/v1/activity/queryGroupActivities',
      data: {
        pageNumber: 1,
        pageSize: 10,
        activityName: '团购',
        touchId: '', //正式需要获取
        activityType: '2'
      },
      method: 'POST',
      success: (res) => {
        if (res.data.code === 0) {
          wx.setStorageSync('activityList', res.data.activityList)
        }
      },
      faile: (res) => {
        wx.hideLoading()
        wx.showToast({
          title: '服务器错误',
          icon: 'none'
        })
      }
    })
  },
  getOpenId() {
    wx.login({
      success: (data) => {
        wx.request({
          url: app.globalData.urlHeaderA + 'openid',
          data: {
            code: data.code
          },
          success: (res) => {
            wx.setStorageSync('openid', res.data)
            if (res.data === this.data.pOpenid) {
              wx.reLaunch({
                url: '/pages/index/index'
              })
            }
          },
          faile: (res) => {
            wx.showToast({
              title: '服务器错误',
              icon: 'none'
            })
          }
        })
      }
    });

  },
  toOrder: function(e) {
    wx.navigateTo({
      url: '/pages/order/index?orderType=1&offeringId=' + this.data.offeringId + '&pid=' + this.data.pid + '&memberNum=' + wx.getStorageSync('activityList')[0].upGroupRule.gpMembersNum + '&goodsName=' + this.data.goodsName
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    console.log(111111)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  countTime: function() {
    this.data.timer = setTimeout((e) => {
      //获取当前时间
      let date = new Date();
      let now = date.getTime();
      //设置截止时间
      let end = this.data.endDate
      //时间差
      let leftTime = end - now;
      if (leftTime >= 0) {
        // d = Math.floor(leftTime / 1000 / 60 / 60 / 24);
        this.setData({
          h: ('0' + Math.floor(leftTime / 1000 / 60 / 60)).slice(-2),
          m: ('0' + Math.floor(leftTime / 1000 / 60 % 60)).slice(-2),
          s: ('0' + Math.floor(leftTime / 1000 % 60)).slice(-2),
          leftTime: leftTime
        })
        this.countTime()
      } else {
        clearTimeout(this.data.timer)
      }

    }, 1000)
  }
})