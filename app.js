//app.js
var qcloud = require('./vendor/qcloud-weapp-client-sdk/index');
var config = require('./config');

App({
    onLaunch() {
        qcloud.setLoginUrl(config.service.loginUrl);
    },
    makePhone() {
        wx.makePhoneCall({
            phoneNumber: wx.getStorageSync('phoneNumber')
        })
    },
    showLoading(text) {
        wx.showToast({
            title: text || '加载中...',
            icon: 'loading',
            duration: 10000
        });
    },
    showSuccess(text) {
        wx.showToast({
            title: text,
            icon: 'success'
        })
    },
    showModel(title, content) {
        wx.hideToast();

        wx.showModal({
            title,
            content: JSON.stringify(content),
            showCancel: false
        });
    },
    modal(text, cb, showCancel) {
        wx.showModal({
            title: '提示',
            content: text,
            showCancel: showCancel || false,
            success: function (res) {
                if (res.confirm) {
                    cb && cb()
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },
    globalData: {
        baseURL: 'https://www.yinyina.com/'
        // baseURL: 'https://easy-mock.com/mock/59a58bb97b7ac306cc2fbfe9/xcx/'
    }
})