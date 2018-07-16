// pages/order-success/index.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:null,
    infoA: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let list = wx.getStorageSync('activityList')
    wx.request({
      url: app.globalData.urlHeaderA+'myGroups/' + options.id,
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
    wx.request({
      url: app.globalData.urlHeaderB+'order/search/detail?orderNum=' + options.orderNum,
      success: (res) => {
        if(res.data.code === '0') {
          this.setData({
            infoA: res.data.data
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


  }
})