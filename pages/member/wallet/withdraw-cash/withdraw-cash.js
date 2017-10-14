const app = getApp()
const userInfo = wx.getStorageSync('userInfo')
const modal = app.modal
const qcloud = require('../../../../vendor/qcloud-weapp-client-sdk/index')
Page({
	data: {
		nickName: userInfo.nickName,
		cash: 0,
		maxCash: 120.45

	},
	onLoad(options) {
		wx.setNavigationBarTitle({
	      title: '提现'
	    })
	    this.setData({
	    	maxCash: options.cash
	    })
	},
	cashChange(e) {
		this.setData({
			cash: e.detail.value
		})
	},
	submit() {
		if (!this.data.cash) {
			modal('请输入提现金额')
			return;
		}
		if (this.data.cash > this.data.maxcash) {
			modal('提现金额不得大于最大可提现金额')
			return;
		}
		app.showSuccess('加载中', 'loading');
		qcloud.request({
            // 要请求的地址
            url: app.globalData.baseURL + 'xcx/member/getcash',
            // 请求之前是否登陆，如果该项指定为 true，会在请求之前进行登录
            login: true,
            method: 'POST',
            data: {
            	amount: this.data.cash - 0
            },
            success: res => {
                if (res.data.result) {
                    wx.redirectTo({url: '../withdraw-cash-result/withdraw-cash-result'})
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
		
	}

})