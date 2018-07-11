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
    h: '00',
    m: '00',
    s: '00'
  },
  toGroupBuy: function (e) {
    wx.navigateTo({ url: '/pages/group/index' })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.countTime()
    this.getUserInfo()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getUserInfo: function () {
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
        success: function (res) {
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
    this.timer = setTimeout((e) => {
      //获取当前时间
      let date = new Date();
      let now = date.getTime();
      //设置截止时间
      let endDate = new Date("2018-07-05 16:23:23");
      let end = endDate.getTime();
      //时间差
      let leftTime = end - now;
      if (leftTime >= 0) {
        // d = Math.floor(leftTime / 1000 / 60 / 60 / 24);
        this.setData({
          h: ('0' + Math.floor(leftTime / 1000 / 60 / 60)).slice(-2),
          m: ('0' + Math.floor(leftTime / 1000 / 60 % 60)).slice(-2),
          s: ('0' + Math.floor(leftTime / 1000 % 60)).slice(-2)
        })
        this.countTime()
      } else {
        clearTimeout(this.timer)
      }
      
    },1000)
  }
})