Page({
	data: {
		aa: ''
	},
	openAgreement() {
		wx.navigateTo({url: '../../component/agreement/agreement?type=serviceAgreement'})
	}
})