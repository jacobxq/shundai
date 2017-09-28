const app = getApp()
const userInfo = wx.getStorageSync('userInfo')
const modal = app.modal
Page({
	data: {
		nickName: userInfo.nickName,
		price: 0,
		maxPrice: 120.45

	},
	onLoad() {
		wx.setNavigationBarTitle({
	      title: '提现'
	    })
	},
	priceChange(e) {
		this.setData({
			price: e.detail.value
		})
	},
	submit() {
		if (!this.data.price) {
			modal('请输入提现金额')
			return;
		}
		if (this.data.price > this.data.maxPrice) {
			modal('提现金额不得大于最大可提现金额')
			return;
		}
		wx.redirectTo({url: '../withdraw-cash-result/withdraw-cash-result'})
	}

})