const app = getApp()
Page({
	data: {
		phoneNumber: '',
		code: '',
		type: ''
	},
	onLoad(options) {
		var title = '';
		if (options.type == 'bring') {
			title = '我要顺带'
		} else {
			title = '我要托付'
		}
		wx.setNavigationBarTitle({
	      title: title
	    })
	    this.setData({
	    	code: options.code,
	    	type: options.type,
	    	phoneNumber: wx.getStorageSync('phoneNumber')
	    })
	},
	makePhone() {
        app.makePhone()
    },
    chatDemand() {
    	if (this.data.type == 'bring') {
    		wx.redirectTo({url:'../../list/traveler-demand-detail/traveler-demand-detail?type=bring&code=' + this.data.code})
    	} else {
    		wx.redirectTo({url:'../../list/sender-demand-detail/sender-demand-detail?type=send&code=' + this.data.code})
    	}
    	
    },
	openAgreement() {
		wx.navigateTo({url: '../../component/agreement/agreement?type=aboutUs'})
	}
})