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
    info: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let list = wx.getStorageSync('activityList')
    wx.request({
      url: app.globalData.urlHeaderA+'myGroups/' + options.id,
      success: (res) => {
        let arrEnd = list[0].expireDate.split(/[- : \/]/)
        this.setData({
          info: res.data,
          endDate: new Date(arrEnd[0], arrEnd[1] - 1, arrEnd[2], arrEnd[3], arrEnd[4], arrEnd[5]).getTime()
        })
        this.countTime()
      },
      faile: (res) => {
        wx.showToast({
          title: '服务器错误',
          icon: 'none'
        })
      }
    })
  },
  countTime: function () {
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
    let data
    if(this.info.pid === 0) {
      data = {
        title: '拼啦！5折捡漏就差你',
        // path: 'pages/index/index'
        path: '/pages/friend-group/index?pid=' + this.data.id + '&orderType=1' +
        '&offeringId=' + this.data.offeringId + '&goodsName=' + this.data.goodsName
        + '&openid=' + this.data.openid
      }
    }else{
      data = {
        title: '拼啦！5折捡漏就差你',
        // path: 'pages/index/index'
        path: '/pages/index/index'
      }
    }
    return data;
  }
})