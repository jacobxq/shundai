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
        price: ''
    },
    onLoad(options) {
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
                        startCity: data.arrival.city + data.arrival.area,
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
        })
    },
    openAgreement() {
        wx.navigateTo({ url: '../../component/agreement/agreement?type=waybill' })
    },
    previewImage: function () {
        wx.previewImage({
            current: this.data.image, // 当前显示图片的http链接
            urls: [this.data.image] // 需要预览的图片http链接列表
        })
    },
    editDemand() {
        wx.redirectTo({ url: '../../publish/bring-good/bring-good?code=' + this.data.code })
    },
    deleteDemand() {
        qcloud.request({
            url: globalData.baseURL + 'xcx/carry/delete/' + this.data.code,
            login: true,
            success: res => {
                if (res.data.result) {
                    modal(res.data.returnMessage, function () {
                        wx.switchTab({ url: '../../publish/index' })
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
        })
    }
})