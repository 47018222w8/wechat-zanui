// pages/index/index.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls:[
      'http://58.87.98.173:9008/img/index-c.png'
    ],
    goodsImgs:[
      'http://58.87.98.173:9008/img/index-b.png',
      'http://58.87.98.173:9008/img/index-c.png',
      'http://58.87.98.173:9008/img/index-b.png',
      'http://58.87.98.173:9008/img/index-c.png',
      'http://58.87.98.173:9008/img/index-b.png',
      'http://58.87.98.173:9008/img/index-c.png',
    ],
    hei:'',
    activityList:[],
    goodsList: []
  },
  imgH: function (e) {
    var winWid = wx.getSystemInfoSync().windowWidth;         //获取当前屏幕的宽度
    var imgh = e.detail.height;　　　　　　　　　　　　　　　　//图片高度
    var imgw = e.detail.width;
    var swiperH = winWid * imgh / imgw + "px"　　　　　　　　　　//等比设置swiper的高度。  即 屏幕宽度 / swiper高度 = 图片宽度 / 图片高度    ==》swiper高度 = 屏幕宽度 * 图片高度 / 图片宽度
    this.setData({
      hei: swiperH　　　　　　　　//设置高度
    })
  },
  toGroupBuy: function(e) {
    wx.navigateTo({ url: '/pages/group/index?offeringId=' + e.target.dataset.id + '&beginDate=' + this.data.activityList[0].effectiveDate + '&endDate=' + this.data.activityList[0].expireDate})
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getGroupActivites()
    this.getOpenId()
  },

  getOpenId(){
    wx.login({
      success: (data) => {
        wx.request({
          url: app.globalData.urlHeaderA+'openid',
          data: {
            code: data.code
          },
          success: (res) => {
            wx.setStorageSync('openid', res.data)
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
  getGroupActivites() {
    wx.request({
      url: app.globalData.urlHeaderB+'product/v1/activity/queryGroupActivities',
      data: {
        pageNumber: 1,
        pageSize: 10,
        activityName: '团购',
        touchId: '',//正式需要获取
        activityType: '2'
      },
      method: 'POST',
      success: (res) => {
        if (res.data.code === 0) {
          this.setData({
            activityList: res.data.activityList,
            goodsList: res.data.activityList[0].offeringList
          })
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
  
  }
})