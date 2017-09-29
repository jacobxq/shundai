const app = getApp()
Page({
    data: {
        phoneNumber: ''
    },
    makePhone() {
        app.makePhone()
    },
    onLoad() {
        wx.setNavigationBarTitle({
            title: '实名认证'
        })
        this.setData({
            phoneNumber: wx.getStorageSync('phoneNumber')
        })
    },
    openAgreement() {
        wx.navigateTo({url: '../../component/agreement/agreement?type=aboutUs'})
    }
})