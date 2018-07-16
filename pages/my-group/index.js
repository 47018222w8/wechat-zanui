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
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.request({
      url: app.globalData.urlHeaderA+'myGroups',
      data: {
        openid: wx.getStorageSync('openid')
      },
      success: (res) => {
        this.setData({
          list: res.data
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
  toInfo:function(e) {
    console.log(e)
    wx.navigateTo({
      url: '/pages/my-group-info/index?id=' + e.target.dataset.id
    })
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      return {
        title: '拼啦！5折捡漏就差你',
        // path: 'pages/index/index'
        path: '/pages/friend-group/index?pid=' + res.target.dataset.id + '&orderType=1' +
        '&offeringId=' + res.target.dataset.offid + '&goodsName=' + res.target.dataset.name
        + '&openid=' + res.target.dataset.openid
      }
    }
    return {
      title: '拼啦！5折捡漏就差你',
      // path: 'pages/index/index'
      path: '/pages/index/index'
    }
  }
})