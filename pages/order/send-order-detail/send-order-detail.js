const app = getApp()
const globalData = app.globalData
const modal = app.modal
const qcloud = require('../../../vendor/qcloud-weapp-client-sdk/index')
const pay = require('../../../utils/pay.js')
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
            url: globalData.baseURL + 'xcx/order/send/' + this.data.code,
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
    operateOrder(orderStatus, cb) {
        qcloud.request({
            url: globalData.baseURL + 'xcx/order/operate/' + this.data.code,
            method: 'POST',
            login: true,
            data: {
                opType: orderStatus
            },
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
        console.log('send支付')
        pay.wxPay(this.data.code, (res) => {
            if (res.errMsg == 'requestPayment:ok') {
                let status = 'data.orderStatus'
                let statusCn = 'data.orderStatusCn'
                this.setData({
                    [status]: 'PAID',
                    [statusCn]: '已支付'
                })
                app.showLoading('支付成功');
            } else if (res.errMsg == 'requestPayment:fail cancel') {
                app.showLoading('取消支付');
            } else {
                app.showModel('支付失败', res);
            }
        })
        // qcloud.request({
        //     url: globalData.baseURL + 'xcx/order/prepay',
        //     method: 'GET',
        //     login: true,
        //     data: {
        //         orderCode: this.data.code
        //     },
        //     success: res => {
        //         if (res.data.result) {
        //             console.log(res.data);
        //             wx.requestPayment({
        //                timeStamp: res.data.returnObject.timeStamp,
        //                nonceStr: res.data.returnObject.nonceStr,
        //                package: res.data.returnObject.package,
        //                signType: res.data.returnObject.signType,
        //                paySign: res.data.returnObject.paySign,
        //                success: (res) => {
                            
        //                },
        //                fail: (res) => {
        //                     app.showModel('支付失败', res);
        //                     console.log('request fail', error);
        //                }
        //             })
        //         } else {
        //             app.showModel('请求失败', res.data.returnMessage);
        //         }
        //     },
        //     fail(error) {
        //         app.showModel('请求失败', error);
        //         console.log('request fail', error);
        //     },
        //     complete() {
        //         console.log('request complete');
        //     }
        // });
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