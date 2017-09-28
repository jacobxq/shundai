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
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        if (wx.getStorageSync('realNameAuth')) {
            this.setData({
                realNameAuth: true
            })
        }
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
                app.showModel('登录失败', error);
                console.log('登录失败', error);
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
                app.showSuccess('会话已清除');
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