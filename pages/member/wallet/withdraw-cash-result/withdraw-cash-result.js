const app = getApp()
Page({
    data: {
        phoneNumber: wx.getStorageSync('phoneNumber')
    },
    makePhone() {
        app.makePhone()
    },
    onLoad() {
    	wx.setNavigationBarTitle({
	      title: '提现'
	    })
    },
    openAgreement() {
        wx.navigateTo({url: '../../../component/agreement/agreement?type=aboutUs'})
    }
})