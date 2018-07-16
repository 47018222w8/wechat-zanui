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
    num: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let list = wx.getStorageSync('activityList')
    let arrEnd = list[0].expireDate.split(/[- : \/]/)
    this.setData({
      orderType: +options.orderType,
      pid: +options.pid,
      offeringId: options.offeringId,
      goodsName: options.goodsName,
      openid: options.openid,
      num: list[0].upGroupRule.gpMembersNum - 1,
      endDate: new Date(arrEnd[0], arrEnd[1] - 1, arrEnd[2], arrEnd[3], arrEnd[4], arrEnd[5]).getTime()
    })
    this.countTime()
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
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    console.log(this.data)
    return {
      title: '拼啦！5折捡漏就差你',
      // path: 'pages/index/index'
      path: '/pages/friend-group/index?pid=' + this.data.pid + '&orderType=1' +
      '&offeringId=' + this.data.offeringId + '&goodsName=' + this.data.goodsName
      + '&openid=' + this.data.openid
    }
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
  }
})