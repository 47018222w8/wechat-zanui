// pages/order-success/index.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab1: {
      list: [{
        id: 0,
        title: '全部'
      }, {
        id: 1,
        title: '已受理'
      }, {
        id: 2,
        title: '准备上门'
      }, {
        id: 3,
        title: '受理完成'
      }, {
        id: 4,
        title: '已退单'
      }],
      selectedId: 0
    },
    selectedId: 0,
    list: []
  },
  changeTab(e){
    this.setData({
        selectedId: e.detail
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList()
  },
  getList() {
    wx.showLoading({
      title: '加载中'
    })
    wx.request({
      url: app.globalData.urlHeaderA+'orders',
      data: {
        openid: wx.getStorageSync('openid')
      },
      success: (res) => {
        this.setData({
          list: res.data
        })
        wx.hideLoading()
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
  toInfo(e){
    if (!e.target.dataset.id){
      return;
    }
    wx.navigateTo({
      url: '/pages/my-order-info/index?id=' + e.target.dataset.id + '&orderNum=' + e.target.dataset.ordernum
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  }
})