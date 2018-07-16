var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    disabled: false,
    code: '',
    pid: 0, // 团长id,团长本身或者非团购为0
    offeringId: null,
    orderType: null, //是否是单独购买
    phoneCity: '',
    memberNum: 0,
    addressCity: '',
    readDone: true,
    phoneNumberList: [],
    phoneNumberListTen: [],
    showNumberPopup: false,
    phoneNumberListIndex: 0,
    accountNumber: null,
    cityCode: '',
    address: '',
    number: '',
    customerName: '',
    mobile: '',
    addressCityCode: '',
    city: '',
    regions: [{
        name: '长春市',
        id: '431'
      },
      {
        name: '吉林市',
        id: '432'
      },
      {
        name: '延边州',
        id: '433'
      },
      {
        name: '四平市',
        id: '434'
      },
      {
        name: '通化市',
        id: '435'
      },
      {
        name: '白城市',
        id: '436'
      },
      {
        name: '辽源市',
        id: '437'
      },
      {
        name: '松原市',
        id: '438'
      },
      {
        name: '白山市',
        id: '439'
      }
    ]
  },
  customerNameInput(e) {
    this.setData({
      customerName: e.detail.value
    })
  },
  numberInput(e) {
    this.setData({
      number: e.detail.value
    })
  },
  mobileInput(e) {
    this.setData({
      mobile: e.detail.value
    })
  },
  addressInput(e) {
    this.setData({
      address: e.detail.value
    })
  },
  phoneNumberPopup() {
    this.setData({
      showNumberPopup: !this.data.showNumberPopup
    });
  },
  choosePhoneCity: function(e) {
    this.setData({
      phoneCity: this.data.regions[e.detail.value].name,
      cityCode: this.data.regions[e.detail.value].id
    })
  },
  chooseAddressCity: function(e) {
    this.setData({
      addressCity: this.data.regions[e.detail.value].name,
      addressCityCode: this.data.regions[e.detail.value].id
    })
  },
  changePhoneNumberList: function() {
    let arry = []
    let j = this.data.phoneNumberListIndex
    let n = 0
    while (n < 10 && j <= this.data.phoneNumberList.length) {
      arry.push(this.data.phoneNumberList[j++]);
      n++;
    }
    if (j > this.data.phoneNumberList.length) {
      this.setData({
        showNumberPopup: false
      });
      wx.showToast({
        title: '没有更多号码了',
        icon: 'none'
      })
    }
    this.setData({
      phoneNumberListTen: arry,
      phoneNumberListIndex: j
    })
  },
  /**
   * 最终号码
   */
  chooseAccountNumber: function(e) {
    this.setData({
      accountNumber: e.target.dataset.phone,
      showNumberPopup: false
    })
  },
  /**
   * 弹出选择号码弹出框
   */
  chooseNumber: function(e) {
    if (!this.data.cityCode) {
      wx.showToast({
        title: '请选择号码归属地',
        icon: 'none'
      })
      return
    }
    wx.showLoading({
      title: '加载中'
    })
    wx.request({
      url: app.globalData.urlHeaderB + 'v1/mobile/getNumberListTg',
      data: {
        cityId: this.data.cityCode
      },
      success: (res) => {

        if (res.code === -1) {
          this.setData({
            phoneNumberList: []
          })
        } else {
          let arry = []
          let n = 0
          if (res.data.data.length > 10) {
            while (n < 10) {
              arry.push(res.data.data[n++]);
            }
          } else {
            arry = res.data.data
          }
          wx.hideLoading()
          this.setData({
            phoneNumberList: res.data.data,
            phoneNumberListTen: arry,
            phoneNumberListIndex: n,
            showNumberPopup: true
          })
        }
      },
      faile: (res) => {
        wx.hideLoading()
        wx.showToast({
          title: '服务器错误',
          icon: 'none'
        })
      },
      complete: () => {
        wx.hideLoading()
      }
    })
  },
  readTap: function() {
    if (this.data.readDone) {
      this.setData({
        readDone: false
      })
    } else {
      this.setData({
        readDone: true
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      orderType: +options.orderType,
      pid: +options.pid,
      offeringId: options.offeringId,
      goodsName: options.goodsName
    })
  },
  subOrder: function(e) {
    const RE_PHONE = /1[3|4|5|7|8|][0-9]{9}/
    if (!RE_PHONE.test(this.data.mobile)) {
      wx.showToast({
        title: '请输入正确的联系电话',
        icon: 'none'
      })
      return
    }
    if (!this.data.addressCityCode) {
      wx.showToast({
        title: '请选择所在地',
        icon: 'none'
      })
      return
    }
    if (!this.data.address) {
      wx.showToast({
        title: '请输入详细地址',
        icon: 'none'
      })
      return
    }
    wx.showLoading({
      title: '加载中'
    })
    wx.request({
      url: app.globalData.urlHeaderB + 'v1/checkService/idCardCheck',
      data: {
        name: this.data.customerName,
        idCard: this.data.number
      },
      success: (res) => {
        if (res.data.code === 0) {
          wx.request({
            url: app.globalData.urlHeaderB + 'v1/mobile/numChooseholdTg',
            data: {
              cityId: this.data.cityCode,
              mobile: this.data.mobile,
              idNum: this.data.number
            },
            success: (result) => {
              // 测试用
              if (true || result.data.code === 0) {
                let jo = null
                let nickName = ''
                let avatarUrl = ''
                if (e.detail.rawData) {
                  jo = JSON.parse(e.detail.rawData)
                  nickName = jo.nickName
                  avatarUrl = jo.avatarUrl
                }

                let data = {
                  address: this.data.addressCity + this.data.address,
                  cityCode: this.data.cityCode,
                  accountNumber: this.data.accountNumber,
                  number: this.data.number,
                  customerName: this.data.customerName,
                  orderType: +this.data.orderType,
                  done: 0,
                  pid: this.data.pid,
                  addressCityCode: this.data.addressCityCode,
                  openid: wx.getStorageSync('openid'),
                  memberNum: wx.getStorageSync('activityList')[0].upGroupRule.gpMembersNum,
                  offeringId: this.data.offeringId,
                  mobile: this.data.mobile,
                  goodsName: this.data.goodsName,
                  nickName: nickName,
                  avatarUrl: avatarUrl
                }
                this.setData({
                  disabled: true
                })
                //发起网络请求
                wx.request({
                  url: app.globalData.urlHeaderA + 'orders',
                  data: data,
                  method: 'POST',
                  success: (resA) => {
                    wx.hideLoading()
                    if (data.pid === 0 && data.orderType === 0) {

                      wx.reLaunch({
                        url: '/pages/success/index'
                      })

                    } else if (data.pid === 0 && data.orderType === 1) {
                      wx.navigateTo({
                        url: '/pages/order-success/index?pid=' + resA.data + '&orderType=1' +
                          '&offeringId=' + this.data.offeringId + '&goodsName=' + this.data.goodsName +
                          '&openid=' + data.openid
                      })
                    } else {
                      wx.reLaunch({
                        url: '/pages/success/index'
                      })
                    }

                  }
                })
              } else {
                wx.hideLoading()
                wx.showToast({
                  title: result.data.msg,
                  icon: 'none'
                })
              }

            },
            fail: () => {
              this.setData({
                disabled: false
              })
              wx.hideLoading()
              wx.showToast({
                title: '未知错误',
                icon: 'none'
              })
            }
          })
        } else {
          wx.hideLoading()
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }

      },
      fail: () => {
        wx.hideLoading()
        wx.showToast({
          title: '未知错误',
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