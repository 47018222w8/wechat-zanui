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
    info: null,
    allCount: 0,
    countArry: [],
    goodsImgs: [
      'http://58.87.98.173:9008/img/index-b.png',
      'http://58.87.98.173:9008/img/index-c.png',
      'http://58.87.98.173:9008/img/index-b.png',
      'http://58.87.98.173:9008/img/index-c.png',
      'http://58.87.98.173:9008/img/index-b.png',
      'http://58.87.98.173:9008/img/index-c.png',
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getGroupActivites()
    this.setData({
      orderType: +options.orderType,
      pid: +options.pid,
      offeringId: options.offeringId,
      goodsName: options.goodsName,
      pOpenid: options.openid,
      memberNum: options.memberNum,
      qrCode: options.qrCode
      
    })
    this.countTime()
    this.getOpenId()

    this.getOrder()

    this.getGoodsInfo()
    this.getGroupActivites()
  },
  toHome() {
    wx.reLaunch({
      url: '/pages/index/index'
    })
  },
  toGroupBuy: function (e) {
    let u = '/pages/group/index?offeringId=' + e.currentTarget.dataset.goodsid +
      '&groupBuyingId=' + e.currentTarget.dataset.groupid + '&numA=' + e.currentTarget.dataset.numa + '&numB=' + e.currentTarget.dataset.numb + '&qrCode=' + this.data.qrCode + '&goodsType=' + this.data.goodsType
    wx.navigateTo({
      url: u
    })
  },
  getGoodsInfo() {
    wx.request({
      url: app.globalData.urlHeaderB + 'product/v1/offering/getOffer',
      data: {
        offeringId: this.data.offeringId,
        eparchyCode: 431
      },
      success: (res) => {
        let titleImg = ''
        let infoImg = ''
        let goodsImg = ''
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
          if (item.picUseType === "1") {
            if (item.picUrl.indexOf('http') === -1) {
              goodsImg = app.globalData.urlHeaderC + item.picUrl
            } else {
              goodsImg = item.picUrl
            }
            wx.setStorageSync('goodsImg', goodsImg)
          }
        })
        let arrEnd = res.data.offeringDetail.expireDate.split(/[- : \/]/)
        let endDate = new Date(arrEnd[0], arrEnd[1] - 1, arrEnd[2], arrEnd[3], arrEnd[4], arrEnd[5]).getTime()
        this.setData({
          endDate: endDate,
          goodsType: res.data.offeringDetail.goodsType,
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
  getOrder() {
    wx.request({
      url: app.globalData.urlHeaderA + 'myGroups/' + this.data.pid,
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
  },
 
  getGroupActivites() {
    wx.request({
      url: app.globalData.urlHeaderB + 'product/v1/activity/queryGroupActivities',
      data: {},
      method: 'POST',
      success: (res) => {
        if (res.data.code === 0) {
          res.data.activityList.forEach(item => {
            wx.request({
              url: app.globalData.urlHeaderA + 'orderNums',
              data: {
                groupBuyingId: item.offeringId
              },
              success: (resA) => {
                let arry = this.data.countArry
                arry.push(resA.data)
                this.setData({
                  countArry: arry
                })
              }
            })
          })
          this.setData({
            activityList: res.data.activityList
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
  getOpenId() {
    wx.login({
      success: (data) => {
        wx.request({
          url: app.globalData.urlHeaderA + 'openid',
          data: {
            code: data.code
          },
          success: (res) => {
            wx.setStorageSync('openid', res.data)
            if (res.data === this.data.pOpenid) {
              wx.reLaunch({
                url: '/pages/index/index'
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
      }
    });

  },
  toOrder: function(e) {
    wx.navigateTo({
      url: '/pages/order/index?pid='+ this.data.pid +'&orderType=1&offeringId=' + this.data.offeringId + '&memberNum=' + this.data.memberNum + '&goodsName=' + this.data.goodsName + '&groupBuyingId=' + this.data.groupBuyingId + '&qrCode=' + this.data.qrCode + '&goodsType=' + this.data.goodsType
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    console.log(111111)
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