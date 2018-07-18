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
    wx.request({
      url: app.globalData.urlHeaderA+'myGroups/' + options.id,
      success: (resA) => {
        wx.request({
          url: app.globalData.urlHeaderB + 'product/v1/offering/getOffer',
          data: {
            offeringId: options.offeringId,
            eparchyCode: 431
          },
          success: (res) => {
            let titleImg = ''
            let infoImg = ''
            res.data.offeringDetail.picList.forEach(item => {
              if (item.picUseType === "3") {
                if (item.picUrl.indexOf('http') === -1) {
                  infoImg = app.globalData.urlHeaderC + item.picUrl
                } else {
                  infoImg = item.picUrl
                }

              }
              if (item.picUseType === "2") {
                if (item.picUrl.indexOf('http') === -1) {
                  titleImg = app.globalData.urlHeaderC + item.picUrl
                } else {
                  titleImg = item.picUrl
                }
                wx.setStorageSync('titleImg', titleImg)
              }
            })
            let arrEnd = res.data.offeringDetail.expireDate.split(/[- : \/]/)
            this.setData({
              detail: res.data.offeringDetail,
              infoImg: infoImg,
              titleImg: titleImg,
              info: resA.data,
              endDate: new Date(arrEnd[0], arrEnd[1] - 1, arrEnd[2], arrEnd[3], arrEnd[4], arrEnd[5]).getTime(),
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
      faile: (resA) => {
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
        path: '/pages/friend-group/index?pid=' + res.target.dataset.id + '&orderType=1' +
          '&offeringId=' + res.target.dataset.offid + '&goodsName=' + res.target.dataset.name +
        '&openid=' + res.target.dataset.openid + '&qrCode=' + wx.getStorageSync('qrCode') + '&memberNum=' + res.target.dataset.mm
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