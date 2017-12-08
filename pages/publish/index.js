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
        swiperData: []
    },
    makePhone: function () {
        app.makePhone()
    },
    onLoad: function () {
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
        this.getRollDate()
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
    realNameAuth(cb) {
        qcloud.request({
            // 要请求的地址
            url: globalData.baseURL + 'xcx/member/center',
            // 请求之前是否登陆，如果该项指定为 true，会在请求之前进行登录
            login: true,
            success: res => {
                if (res.data.result) {
                    wx.setStorageSync('realNameAuth', res.data.returnObject.realNameAuth);
                    this.setData({
                        getingRealName: false
                    })
                    if (!this.getingNumber && !this.getingRealName) {
                        wx.hideLoading()
                    }
                    cb && cb();
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
    // 获取轮播数据
    getRollDate() {
        qcloud.request({
            // 要请求的地址
            url: globalData.baseURL + 'xcx/order/roll-msg',
            // 请求之前是否登陆，如果该项指定为 true，会在请求之前进行登录
            login: true,
            success: res => {
                if (res.data.result) {
                    this.setData({
                      swiperData: res.data.returnObject
                    })
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
        if (wx.getStorageSync('userInfo') && wx.getStorageSync('realNameAuth') == 'ADUITED_SUCCESS') {
            wx.navigateTo({ url: 'bring-good/bring-good' })
        } else {
            this.realNameAuth(() => {
                if (wx.getStorageSync('realNameAuth') == 'ADUITING') {
                    modal('实名认证审核中，审核通过后才可以发起顺带需求');
                } else {
                    modal('登陆后且实名认证的用户才能发起顺带需求', (res) => {
                        wx.navigateTo({ url: '../member/real-name/real-name' })
                    })
                }
            })
        }
    },
    openAgreement() {
        wx.navigateTo({url: '../component/agreement/agreement?type=aboutUs'})
    }
})