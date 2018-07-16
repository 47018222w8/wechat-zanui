// pages/index/index.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasUserInfo: false,
    imgUrls: [
      'http://58.87.98.173:9008/img/1.jpg', 'http://58.87.98.173:9008/img/2.jpg'
    ],
    timer: null,
    // 0:团购未开始,1:团购进行中,2:团购已结束
    activeState: 0,
    endDate: null,
    offeringId: null,
    activityList: null,
    groupList: null,
    allCount: 0,
    detail: '',
    h: '00',
    m: '00',
    s: '00'
  },
  toGroupBuy: function(e) {
    wx.navigateTo({
      url: '/pages/order/index?orderType=1&offeringId=' + this.data.offeringId + '&pid=' + e.target.dataset.pid + '&memberNum=' + this.data.activityList[0].upGroupRule.gpMembersNum + '&goodsName=' + this.data.detail.goodsName
    })
  },
  openOrder1: function() {
    wx.navigateTo({
      url: '/pages/order/index?pid=0&orderType=1&offeringId=' + this.data.offeringId + '&memberNum=' + this.data.activityList[0].upGroupRule.gpMembersNum + '&goodsName=' + this.data.detail.goodsName
    })
  },
  openOrder0: function() {
    wx.navigateTo({
      url: '/pages/order/index?pid=0&orderType=0&offeringId=' + this.data.offeringId + '&memberNum=' + this.data.activityList[0].upGroupRule.gpMembersNum + '&goodsName=' + this.data.detail.goodsName
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
    this.setData({
      offeringId: options.offeringId
    })
    this.getGoodsInfo()
    this.getGroupInfo()
    let arrBegin = options.beginDate.split(/[- : \/]/)
    let arrEnd = options.endDate.split(/[- : \/]/)
    let beginDate = new Date(arrBegin[0], arrBegin[1] - 1, arrBegin[2], arrBegin[3], arrBegin[4], arrBegin[5]).getTime()
    let endDate = new Date(arrEnd[0], arrEnd[1]-1, arrEnd[2], arrEnd[3], arrEnd[4], arrEnd[5]).getTime()
    let now = new Date().getTime()
    if (beginDate < now < endDate) {
      this.setData({
        activeState: 1,
        endDate: endDate,
        activityList: wx.getStorageSync('activityList')
      })
      this.countTime()
    }
    if (now > endDate) {
      this.setData({
        activeState: 2
      })
    }
  },
  getGoodsInfo() {
    wx.request({
      url: app.globalData.urlHeaderB+'product/v1/offering/getOffer',
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
      url: app.globalData.urlHeaderA+'groups',
      data: {
        offeringId: this.data.offeringId,
        openid: wx.getStorageSync('openid')
      },
      success: (res) => {
        let groupList = []
        let i = 0
        while (i < res.data.list.length) {
          let arry = [res.data.list[i], res.data.list[i + 1]]
          groupList.push(arry)
          i += 2;
        }
        this.setData({
          allCount: res.data.allCount,
          groupList: groupList
        })
        console.log(groupList)
      },
      faile: (res) => {
        wx.showToast({
          title: '服务器错误',
          icon: 'none'
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  getUserInfo: function() {
    var that = this

    if (app.globalData.hasLogin === false) {
      // wx.login({
      //   success: _getUserInfo
      // })
      _getUserInfo()
    } else {
      _getUserInfo()
    }

    function _getUserInfo() {
      wx.getUserInfo({
        success: function(res) {
          that.setData({
            hasUserInfo: true,
            userInfo: res.userInfo
          })
          that.update()
        }
      })
    }
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