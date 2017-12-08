const app = getApp();
const qcloud = require('../vendor/qcloud-weapp-client-sdk/index')
const Promise = require('./es6-promise.js')

var pay = {
    /**
     * 获取prepayid
     * param string code
     * return prepayid
     */
    getPrepayID(code) {
        return new Promise((resolve, reject) => {
        	let codePrepayObj = wx.getStorageSync(code);
        	if (codePrepayObj) {
        		let now = Date.now();
        		if (now - codePrepayObj.timeStamp < 3600 * 1000) {
        			resolve(codePrepayObj.prepayid);
        		}
        	}
            qcloud.request({
                url: app.globalData.baseURL + 'xcx/order/prepayid/' + code,
                method: 'GET',
                login: true,
                success: res => {
                	if (res.data.result) {
                		wx.setStorageSync(code, {
	                		timeStamp: Date.now(),
	                		prepayid: res.data.returnObject
	                	})
	                    resolve(res.data.returnObject)
                	} else {
                		app.showModel('请求失败', res.data.returnMessage);
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
        })
    },
    /**
     * 获取requestpay参数
     * param string prepayid
     * return object requestpay参数
     */
    // async getWxPayArg(code) {
    //     let prepayid = await this.getPrepayID(code);
    //     return new Promise((resolve, reject) => {
    //         qcloud.request({
    //             url: app.globalData.baseURL + 'xcx/order/paySign/' + prepayid,
    //             method: 'GET',
    //             login: true,
    //             success: res => {
    //                 resolve(res.data.returnObject)
    //             },
    //             fail(error) {
    //                 app.showModel('请求失败', error);
    //                 console.log('request fail', error);
    //             },
    //             complete() {
    //                 console.log('request complete');
    //             }
    //         });
    //     });
    // },
    getWxPayArg(code) {
        return new Promise((resolve, reject) => {
            this.getPrepayID(code).then((prepayid) => {
                qcloud.request({
                    url: app.globalData.baseURL + 'xcx/order/paySign/' + prepayid,
                    method: 'GET',
                    login: true,
                    success: res => {
                        resolve(res.data.returnObject)
                    },
                    fail(error) {
                        app.showModel('请求失败', error);
                        console.log('request fail', error);
                    },
                    complete() {
                        console.log('request complete');
                    }
                });
            });
        });
        
    },
    /**
     * 调用小程序支付
     * param code string 订单号
     * param cb funciton 回调
     * return object requestpay参数
     */
    // async wxPay(code, cb) {
    // 	let param = await this.getWxPayArg(code);
    // 	wx.requestPayment({
    //        timeStamp: param.timeStamp,
    //        nonceStr: param.nonceStr,
    //        package: param.package,
    //        signType: param.signType,
    //        paySign: param.paySign,
    //        success: (res) => {
    //             cb && cb(res);
    //        },
    //        fail: (res) => {
    //             cb && cb(res);
    //        }
    //     })
    // }
    wxPay(code, cb) {
        this.getWxPayArg(code).then((param) => {
            wx.requestPayment({
                timeStamp: param.timeStamp,
                nonceStr: param.nonceStr,
                package: param.package,
                signType: param.signType,
                paySign: param.paySign,
                success: (res) => {
                    cb && cb(res);
                },
                fail: (res) => {
                    cb && cb(res);
                }
            })
        });
    }
}

module.exports = pay