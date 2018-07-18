// pages/index/index.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
      
    ],
    goodsImgs: [
      'http://58.87.98.173:9008/img/index-b.png',
      'http://58.87.98.173:9008/img/index-c.png',
      'http://58.87.98.173:9008/img/index-b.png',
      'http://58.87.98.173:9008/img/index-c.png',
      'http://58.87.98.173:9008/img/index-b.png',
      'http://58.87.98.173:9008/img/index-c.png',
    ],
    hei: '',
    activityList: [],
    countArry: []
  },
  imgH: function(e) {
    var winWid = wx.getSystemInfoSync().windowWidth; //获取当前屏幕的宽度
    var imgh = e.detail.height;　　　　　　　　　　　　　　　　 //图片高度
    var imgw = e.detail.width;
    var swiperH = winWid * imgh / imgw + "px"　　　　　　　　　　 //等比设置swiper的高度。  即 屏幕宽度 / swiper高度 = 图片宽度 / 图片高度    ==》swiper高度 = 屏幕宽度 * 图片高度 / 图片宽度
    this.setData({
      hei: swiperH　　　　　　　　 //设置高度
    })
  },
  imgHA: function (e) {
    var imgh = e.detail.height;
    var imgw = e.detail.width;
    var h = 750 * imgh / imgw + 'rpx'
    this.setData({
      hA: h //设置高度
    })
  },
  toGroupBuy: function(e) {
    let u = '/pages/group/index?offeringId=' + e.currentTarget.dataset.goodsid +
      '&groupBuyingId=' + e.currentTarget.dataset.groupid + '&numB=' + e.currentTarget.dataset.numb + '&qrCode=' + this.data.qrCode
    wx.navigateTo({
      url: u
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      qrCode: decodeURIComponent(options.scene)
    })
    wx.setStorageSync('qrCode', this.data.qrCode)
    this.getGroupActivites()
  },
  getGroupActivites() {
    wx.request({
      url: app.globalData.urlHeaderB + 'product/v1/activity/queryGroupActivities',
      data: {},
      method: 'POST',
      success: (res) => {
        if (res.data.code === 0) {
          let arry = []
          let idArry = []
          res.data.activityList.forEach(item => {
            item.picList.forEach(itemA => {
              
              if (itemA.picUseType === "2") {
                let titleImg
                if (itemA.picUrl.indexOf('http') === -1) {
                  titleImg = app.globalData.urlHeaderC + itemA.picUrl
                } else {
                  titleImg = itemA.picUrl
                }
                arry.push(titleImg)
              }
              
            })
            idArry.push(item.offeringId)
          })
          var str = idArry.join(',')
          wx.request({
            url: app.globalData.urlHeaderA + 'orderArryNums',
            data: {
              ids: str
            },
            success: (resA) => {
              this.setData({
                countArry: resA.data
              })
            }
          })
          this.setData({
            activityList: res.data.activityList,
            imgUrls: arry
          })
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

  }
})