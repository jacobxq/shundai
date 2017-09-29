const app = getApp()
const modal = app.modal
const globalData = app.globalData
const qcloud = require('../../vendor/qcloud-weapp-client-sdk/index');
// pages/publish/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        phoneNumber: wx.getStorageSync('phoneNumber'),
        getingNumber: false,
        getingRealName: false,
        swiperData: [
          {
            recipients: '黄xx',
            sender: '林xx',
            goodsType: '电脑',
            startCity: '广州',
            arrivalCity: '北京'
          },
          {
            recipients: '林xx',
            sender: '黄xx',
            goodsType: '花',
            startCity: '冰岛',
            arrivalCity: 'USA'
          }
        ]
    },
    makePhone: function () {
        app.makePhone()
    },
    onLoad: function () {
        var newSwiperData = [];
        this.data.swiperData.forEach(function (item, index) {
          var data = item;
          data.recipients = data.recipients.substring(0,1);
          data.sender = data.sender.substring(0,1);
          newSwiperData.push(data)
        })
        this.setData({
          swiperData: newSwiperData
        })
        // 判断是否已经获取电话号码
        if (wx.getStorageSync('phoneNumber')) {
            this.setData({
                phoneNumber: wx.getStorageSync('phoneNumber')
            })
        } else {
            this.setData({
                getingNumber: true
            })
            this.getPhoneNum()
            app.showLoading()
        }
        // 判断是否已经获取实名认证
        if (!wx.getStorageSync('realNameAuth')) {
            this.setData({
                getingRealName: true
            })
            this.login()
            app.showLoading()
        }
    },
    // 获取手机号
    getPhoneNum(cb) {
        // qcloud.request() 方法和 wx.request() 方法使用是一致的，不过如果用户已经登录的情况下，会把用户的会话信息带给服务器，服务器可以跟踪用户
        qcloud.request({
            // 要请求的地址
            url: globalData.baseURL + 'xcx/get-config',
            // 请求之前是否登陆，如果该项指定为 true，会在请求之前进行登录
            success: res => {
                if (res.data.result) {
                    wx.setStorageSync('phoneNumber', res.data.returnObject.tel)
                    // console.log(res.data.returnObject.tel)
                    this.setData({
                        phoneNumber: res.data.returnObject.tel,
                        getingNumber: false
                    })
                    if (!this.getingNumber && !this.getingRealName) {
                        wx.hideLoading()
                    }
                }
            },
            fail(error) {
                app.showModel('请求失败', error);
                console.log('request fail', error);
            },
            complete() {
                console.log('request complete');
            }
        });
    },
    // 获取实名认证
    realNameAuth() {
        qcloud.request({
            // 要请求的地址
            url: globalData.baseURL + 'xcx/member/center',
            // 请求之前是否登陆，如果该项指定为 true，会在请求之前进行登录
            login: true,
            success: res => {
                if (res.data.result) {
                    wx.setStorageSync('realNameAuth', res.data.result)
                    this.setData({
                        getingRealName: false
                    })
                    if (!this.getingNumber && !this.getingRealName) {
                        wx.hideLoading()
                    }
                }
            },
            fail(error) {
                app.showModel('请求失败', error);
                console.log('request fail', error);
            },
            complete: () => {
                if (!this.getingNumber && !this.getingRealName) {
                    wx.hideLoading()
                }
                console.log('request complete');
            }
        });
    },
    login() {
        var that = this;
        qcloud.login({
            success(result) {
                wx.setStorageSync('userInfo', result);
                that.setData({
                    userInfo: result
                })
                that.realNameAuth()
            },

            fail(error) {
                // app.showModel('登录失败', '你已经拒绝了授权顺带速运登录，请删掉顺带速运小程序，再搜索输入顺带速运，进入小程序重新授权');
                // console.log('登录失败', error);
                wx.showModal({
                    title: '温馨提示',
                    content: '若不授权微信登录，则无法正常使用顺带速运的功能；点击授权可重新使用；如点击不授权，后期使用需要在小程序设置界面（右上角 - 关于顺带速运官方服务平台 - 右上角 - 设置）中开启对该小程序的授权。',
                    cancelText: '不授权',
                    confirmText: '授权',
                    showCancel: true,
                    success: function (res) {
                        if (res.confirm) {
                            wx.openSetting({
                              success: (res) => {
                                that.login()
                              }
                            })
                        } else if (res.cancel) {
                            console.log('用户不授权')
                        }
                    }
                })
            }
        });
    },
    // 我要托付
    iWandtSend() {
        if (wx.getStorageSync('userInfo')) {
            wx.removeStorageSync('send')
            wx.removeStorageSync('receiver')
            wx.navigateTo({ url: 'send-good/send-good' })
        } else {
            modal('请先登录再操作', (res) => {
                wx.switchTab({ url: '../member/index' })
            })
        }

    },
    // 我要顺带
    iWandtBring() {
        if (wx.getStorageSync('userInfo') && wx.getStorageSync('realNameAuth')) {
            wx.navigateTo({ url: 'bring-good/bring-good' })
        } else {
            modal('登陆后且实名认证的用户才能发起顺带需求', (res) => {
                wx.switchTab({ url: '../member/index' })
            })
        }
    },
    openAgreement() {
        wx.navigateTo({url: '../component/agreement/agreement?type=aboutUs'})
    }
})