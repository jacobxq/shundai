const app = getApp()
Page({
	data: {
		type: '',
		phoneNumber: '',
		orderId: ''
	},
	onLoad(options) {
		wx.setNavigationBarTitle({
	      title: '匹配成功'
	    })
		console.log(options.type, options.orderId)
		this.setData({
			type: options.type,
			orderId: options.orderId,
			phoneNumber: wx.getStorageSync('phoneNumber')
		})
	},
	makePhone() {
		app.makePhone()
	},
	chatOrder() {
		console.log(this.data)
		if (this.data.type == 'bring') {
			wx.redirectTo({url: '../../order/send-order-detail/send-order-detail?orderID=' + this.data.orderId})
		} else {
			wx.redirectTo({url: '../../order/travel-order-detail/travel-order-detail?orderID=' + this.data.orderId})
		}
	},
	openAgreement() {
		wx.navigateTo({url: '../../component/agreement/agreement?type=serviceAgreement'})
	}
})