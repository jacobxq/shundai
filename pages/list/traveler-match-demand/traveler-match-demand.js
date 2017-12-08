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
                    console.log(data)
                    this.setData({
                        code: data.code,
                        type: data.goodsType,
                        wishArriveTime: data.arrivalTime,
                        sender: {
                            name: data.sender.name.substr(0, 1),
                            mobile: data.sender.mobile,
                            address: data.sender.province + data.sender.city + data.sender.area + '*******'
                        },
                        recipients: {
                            name: data.receiver.name.substr(0, 1),
                            mobile: data.receiver.mobile,
                            address: data.receiver.province + data.receiver.city + data.receiver.area + '*******'
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
        })
    },
    openAgreement() {
        wx.navigateTo({ url: '../../component/agreement/agreement?type=waybill' })
    },
    makePhone() {
        wx.makePhoneCall({
            phoneNumber: this.data.sender.mobile
        })
    },
    iWantBring() {
        if (wx.getStorageSync('userInfo') && wx.getStorageSync('realNameAuth') == 'ADUITED_SUCCESS') {
            wx.showActionSheet({
                itemList: ['确认匹配并接单'],
                success: res => {
                    if (res.tapIndex == 0) {
                        this.matchSend()
                    }
                },
                fail: res => {
                    console.log(res.errMsg)
                }
            })
        } else {
            modal('实名认证审核中，审核通过后才可以匹配顺带需求');
        }
        
    },
    matchSend() {
        qcloud.request({
            url: globalData.baseURL + 'xcx/send/match/' + this.data.code,
            method: "POST",
            login: true,
            success: res => {
                if (res.data.result) {
                    wx.redirectTo({ url: '../match-result/match-result?type=bring&orderId=' + res.data.returnObject })
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