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
    showLoading(text = '加载中...', icon = 'loading') {
        wx.showToast({
            title: text,
            icon: icon,
            duration: 2000
        });
    },
    showSuccess(text = '加载中...', icon = 'success') {
        wx.showToast({
            title: text,
            icon: icon
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
        baseURL: 'https://admin.shundai66.com/'
    }
})