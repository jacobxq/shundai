// pages/member/index.js
var app = getApp();
var qcloud = require('../../vendor/qcloud-weapp-client-sdk/index');
var config = require('../../config');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: wx.getStorageSync('userInfo'),
        realNameAuth: wx.getStorageSync('realNameAuth')
    },

    onLoad() {
        wx.setNavigationBarTitle({
            title: '个人中心'
        })
        console.log(wx.getStorageSync('userInfo'))
        this.setData({
            userInfo: wx.getStorageSync('userInfo')
        })
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        if (wx.getStorageSync('realNameAuth')) {
            this.setData({
                realNameAuth: wx.getStorageSync('realNameAuth')
            })
        }
        this.realNameAuth();
    },

    // 获取实名认证
    realNameAuth() {
        qcloud.request({
            // 要请求的地址
            url: app.globalData.baseURL + 'xcx/member/center',
            // 请求之前是否登陆，如果该项指定为 true，会在请求之前进行登录
            login: true,
            success: res => {
                if (res.data.result) {
                    wx.setStorageSync('realNameAuth', res.data.returnObject.realNameAuth);
                    this.setData({
                        realNameAuth: res.data.returnObject.realNameAuth
                    })
                }
            },
            fail(error) {
                app.showModel('请求失败', error);
                console.log('request fail', error);
            },
            complete: () => {
                console.log('request complete');
            }
        });
    },

    makePhone: function () {
        app.makePhone();
    },

    login() {
        var that = this;
        app.showLoading('正在登录');

        // 登录之前需要调用 qcloud.setLoginUrl() 设置登录地址，不过我们在 app.js 的入口里面已经调用过了，后面就不用再调用了
        qcloud.login({
            success(result) {
                wx.hideToast();
                wx.setStorageSync('userInfo', result);
                that.setData({
                    userInfo: result
                })
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
                            wx.hideToast();
                        }
                    }
                })
            }
        });
    },

    sign_out: function () {
        wx.showActionSheet({
            itemList: ['退出登录'],
            success: res => {
                wx.removeStorageSync('userInfo');
                // 清除保存在 storage 的会话信息
                qcloud.clearSession();
                app.showSuccess('退出登录');
                this.setData({
                    userInfo: null
                })
            },
            fail: res => {
                console.log(res.errMsg)
            }
        })
    }
})