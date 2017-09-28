const app = getApp()
const globalData = app.globalData
const modal = app.modal
const qcloud = require('../../../vendor/qcloud-weapp-client-sdk/index')
Page({
    data: {
        code: '',
        type: '',
        wishArriveTime: '',
        sender: {
            name: '',
            mobile: '',
            address: ''
        },
        recipients: {
            name: '',
            mobile: '',
            address: ''
        },
        price: '',
        remark: ''
    },
    onLoad(options) {
        this.setData({
            code: options.code || 'c1'
        })
        qcloud.request({
            url: globalData.baseURL + 'xcx/send/' + this.data.code,
            login: true,
            success: res => {
                if (res.data.result) {
                    var data = res.data.returnObject
                    this.setData({
                        code: data.code,
                        type: data.goodsType,
                        wishArriveTime: data.arrivalTime,
                        sender: {
                            name: data.sender.name,
                            mobile: data.sender.mobile,
                            address: data.sender.province + data.sender.city + data.sender.area + data.sender.address
                        },
                        recipients: {
                            name: data.recipients.name,
                            mobile: data.recipients.mobile,
                            address: data.recipients.province + data.recipients.city + data.recipients.area + data.recipients.address
                        },
                        price: data.price,
                        remark: data.remark
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
    editDemand() {
        wx.redirectTo({ url: '../../publish/send-good/send-good?code=' + this.data.code })
    },
    deleteDemand() {
        qcloud.request({
            url: globalData.baseURL + 'xcx/send/delete/' + this.data.code,
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
        });
    }
})