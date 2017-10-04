const app = getApp()
const globalData = app.globalData
const modal = app.modal
const qcloud = require('../../../vendor/qcloud-weapp-client-sdk/index')
Page({
	data: {
		code: '',
		data: {},
        orderStatusMap: {
            "NEW": '已接单',
            "PICKUP": '已揽件',
            "PAID": '已支付',
            "SIGNED": '已签收',
            "CANCELED": '已取消'
        }
	},
	onLoad(options) {
		wx.setNavigationBarTitle({
		  title: '订单详情'
		})
		this.setData({
			code: options.orderID
		})
		this.getOrderData()
	},
	getOrderData() {
        qcloud.request({
            url: globalData.baseURL + 'xcx/order/carry/' + this.data.code,
            login: true,
            success: res => {
                if (res.data.result) {
                    console.log(res.data.returnObject)
                    this.setData({
                        data: res.data.returnObject
                    })
                }
            },
            fail(error) {
                app.showModel('请求失败', error);
                console.log('request fail', error);
            },
            complete() {
                console.log('request complete');
            }
        });
    },
    previewImg() {
    	wx.previewImage({
		  current: this.data.data.trafficVoucher, // 当前显示图片的http链接
		  urls: [this.data.data.trafficVoucher] // 需要预览的图片http链接列表
		})
    },
    operateOrder(orderStatus, cb) {
        qcloud.request({
            url: globalData.baseURL + 'xcx/order/operate/' + this.data.code,
            method: 'POST',
            data: {
                opType: orderStatus
            },
            login: true,
            success: res => {
                if (res.data.result) {
                    cb && cb(res)
                }
            },
            fail(error) {
                app.showModel('请求失败', error);
                console.log('request fail', error);
            },
            complete() {
                console.log('request complete');
            }
        });
    },
    // 取消订单
    cancelOrder() {
        modal('是否确认取消该订单', () => {
            this.operateOrder('CANCEL', res => {
                var status = 'data.orderStatus'
                var statusCn = 'data.orderStatusCn'
                this.setData({
                    [status]: 'CANCELED',
                    [statusCn]: '已取消'
                })
            })
        }, true)
    },
    // 揽件
    pickupGoods() {
        modal('是否确认已揽件', () => {
            this.operateOrder('PICKUP', res => {
                var status = 'data.orderStatus'
                var statusCn = 'data.orderStatusCn'
                this.setData({
                    [status]: 'PICKUP',
                    [statusCn]: '已揽件'
                })
            })
        }, true)
    },
    // 支付订单
    payOrder() {
        console.log('支付')
    },
    // 签收
    signOrder() {
        modal('是否确认签收', () => {
            this.operateOrder('SIGN', res => {
                var status = 'data.orderStatus'
                var statusCn = 'data.orderStatusCn'
                this.setData({
                    [status]: 'SIGNED',
                    [statusCn]: '已签收'
                })
            })
        }, true)
    }
})
