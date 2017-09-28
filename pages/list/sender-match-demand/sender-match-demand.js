const app = getApp()
const globalData = app.globalData
const modal = app.modal
const qcloud = require('../../../vendor/qcloud-weapp-client-sdk/index')
Page({
    data: {
        code: '',
        name: wx.getStorageSync('userInfo').nickName,
        startCity: '',
        startTime: '',
        endCity: '',
        endTime: '',
        phone: '',
        image: '',
        remark: '',
        price: '',
        realNameAuth: false
    },
    onLoad(options) {
        if (wx.getStorageSync('realNameAuth')) {
            this.setData({
                realNameAuth: true
            })
        }
        this.setData({
            code: options.code || 's1'
        })
        qcloud.request({
            url: globalData.baseURL + 'xcx/carry/' + this.data.code,
            login: true,
            success: res => {
                if (res.data.result) {
                    var data = res.data.returnObject
                    this.setData({
                        code: data.code,
                        startCity: data.departure.city + data.departure.area,
                        startTime: data.departureTime,
                        endCity: data.arrival.city + data.arrival.area,
                        endTime: data.arrivalTime,
                        phone: data.mobile,
                        image: data.trafficVoucher,
                        remark: data.remark,
                        price: data.price
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
    openAgreement() {
        wx.navigateTo({ url: '../../component/agreement/agreement?type=waybill' })
    },
    previewImage() {
        wx.previewImage({
            current: this.data.image, // 当前显示图片的http链接
            urls: [this.data.image] // 需要预览的图片http链接列表
        })
    },
    makePhone() {
        app.makePhone()
    },
    iWantSend() {
        wx.showActionSheet({
            itemList: ['确认匹配并接单'],
            success: res => {
                console.log(res.tapIndex)
                if (res.tapIndex == 0) {
                    this.matchSend()
                }
            },
            fail: res => {
                console.log(res.errMsg)
            }
        })
    },
    matchSend() {
        qcloud.request({
            url: globalData.baseURL + 'xcx/carry/match/' + this.data.code,
            method: "POST",
            login: true,
            success: res => {
                if (res.data.result) {
                    wx.redirectTo({ url: '../match-result/match-result?type=send&orderId=' + res.data.returnObject })
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
    }
})