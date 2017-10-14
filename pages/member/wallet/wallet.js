// wallet.js
const app = getApp()
const modal = app.modal
const qcloud = require('../../../vendor/qcloud-weapp-client-sdk/index')

Page({

    /**
     * 页面的初始数据
     */
    data: {
        cash: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad() {
        wx.setNavigationBarTitle({
            title: '我的钱包'
        })
    },

    onShow() {
        this.wallet();
    },

    wallet() {
        app.showSuccess('加载中...', 'loading');
        qcloud.request({
            // 要请求的地址
            url: app.globalData.baseURL + 'xcx/member/wallet',
            // 请求之前是否登陆，如果该项指定为 true，会在请求之前进行登录
            login: true,
            success: res => {
                if (res.data.result) {
                    this.setData({
                        cash: res.data.returnObject
                    })
                    wx.hideLoading();
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

    navigatoCash() {
        wx.redirectTo({url: './withdraw-cash/withdraw-cash?cash=' + this.data.cash})

        // if (this.data.cash > 0) {
        //     wx.redirectTo({url: './withdraw-cash/withdraw-cash?cash=' + this.data.cash})
        // } else {
        //     app.showModel('提示', '没有可提现金额');
        // }
    }

})