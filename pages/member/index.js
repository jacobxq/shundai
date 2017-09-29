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
                app.showModel('登录失败', '你已经拒绝了授权顺带速运登录，请删掉顺带速运小程序，再搜索输入顺带速运，进入小程序重新授权');
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