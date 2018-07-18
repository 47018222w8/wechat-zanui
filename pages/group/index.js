// pages/index/index.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    app:app,
    hasUserInfo: false,
    timer: null,
    // 0:团购未开始,1:团购进行中,2:团购已结束
    activeState: 0,
    endDate: null,
    offeringId: null,
    activityList: null,
    groupList: null,
    allCount: 0,
    detail: '',
    h: '00',
    m: '00',
    s: '00'
  },
  toGroupBuy: function(e) {
    wx.navigateTo({
      url: '/pages/order/index?orderType=1&offeringId=' + this.data.offeringId + '&pid=' + e.target.dataset.pid + '&memberNum=' + this.data.numB + '&goodsName=' + this.data.detail.goodsName + '&groupBuyingId=' + this.data.groupBuyingId + '&qrCode=' + this.data.qrCode + '&endDate=' + this.data.endDate + '&goodsType=' + this.data.detail.goodsType
    })
  },
  openOrder1: function() {
    wx.navigateTo({
      url: '/pages/order/index?pid=0&orderType=1&offeringId=' + this.data.offeringId + '&memberNum=' + this.data.numB + '&goodsName=' + this.data.detail.goodsName + '&groupBuyingId=' + this.data.groupBuyingId + '&qrCode=' + this.data.qrCode + '&endDate=' + this.data.endDate + '&goodsType=' + this.data.detail.goodsType
    })
  },
  openOrder0: function() {
    wx.navigateTo({
      url: '/pages/order/index?pid=0&orderType=0&offeringId=' + this.data.offeringId + '&memberNum=' + this.data.numB + '&goodsName=' + this.data.detail.goodsName + '&groupBuyingId=' + this.data.groupBuyingId + '&qrCode=' + this.data.qrCode + '&endDate=' + this.data.endDate + '&goodsType=' + this.data.detail.goodsType
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      offeringId: options.offeringId,
      groupBuyingId: options.groupBuyingId,
      numB:options.numB,
      qrCode:options.qrCode
    })
    this.getGoodsInfo()
    this.getGroupInfo()
    
  },
  imgHA: function (e) {
    var imgh = e.detail.height;　
    var imgw = e.detail.width;
    var h = 750 * imgh / imgw + 'rpx'
    this.setData({
      hA: h //设置高度
    })
  },
  imgHB: function (e) {
    var imgh = e.detail.height;
    var imgw = e.detail.width;
    var h = 750 * imgh / imgw + 'rpx'
    this.setData({
      hB: h //设置高度
    })
  },
  getGoodsInfo() {
    wx.request({
      url: app.globalData.urlHeaderB+'product/v1/offering/getOffer',
      data: {
        offeringId: this.data.offeringId,
        eparchyCode: 431
      },
      success: (res) => {
        let titleImg = ''
        let infoImg = ''
        let goodsImg = ''
        res.data.offeringDetail.picList.forEach(item=>{
          if (item.picUseType === "3" ) {
            if (item.picUrl.indexOf('http')===-1) {
              infoImg = app.globalData.urlHeaderC + item.picUrl
            }else {
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
        this.setData({
          detail: res.data.offeringDetail,
          infoImg: infoImg,
          titleImg: titleImg
        })

        let arrBegin = this.data.detail.effectiveDate.split(/[- : \/]/)
        let arrEnd = this.data.detail.expireDate.split(/[- : \/]/)
        let beginDate = new Date(arrBegin[0], arrBegin[1] - 1, arrBegin[2], arrBegin[3], arrBegin[4], arrBegin[5]).getTime()
        let endDate = new Date(arrEnd[0], arrEnd[1] - 1, arrEnd[2], arrEnd[3], arrEnd[4], arrEnd[5]).getTime()
        let now = new Date().getTime()
        if (beginDate < now < endDate) {
          this.setData({
            activeState: 1,
            endDate: endDate
          })
          this.countTime()
        }
        if (now > endDate) {
          this.setData({
            activeState: 2
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
  getGroupInfo() {
    wx.request({
      url: app.globalData.urlHeaderA + 'orderNums',
      data: {
        groupBuyingId: this.data.offeringId
      },
      success: (resA) => {
        this.setData({
          numA: resA.data
        })
      }
    })
    wx.login({
      success: (data) => {
        wx.request({
          url: app.globalData.urlHeaderA + 'openid',
          data: {
            code: data.code
          },
          success: (res) => {
            wx.setStorageSync('openid', res.data)
            wx.request({
              url: app.globalData.urlHeaderA + 'groups',
              data: {
                offeringId: this.data.offeringId,
                openid: res.data
              },
              success: (res) => {
                let groupList = []
                let i = 0
                while (i < res.data.list.length) {
                  let arry = [res.data.list[i], res.data.list[i + 1]]
                  groupList.push(arry)
                  i += 2;
                }
                this.setData({
                  allCount: res.data.allCount,
                  groupList: groupList
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
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '拼啦！5折捡漏就差你',
      // path: 'pages/index/index'
      path: '/pages/group/index?offeringId=' + this.data.offeringId +
      '&groupBuyingId=' + this.data.groupBuyingId + '&numA=' + this.data.numA + '&numB=' + this.data.numB
    }
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