const app = getApp()
const util = require('../../../utils/util.js');
const days = util.getDate(); // 获取日期
const time = util.getTime(); // 获取时间
const modal = app.modal
const globalData = app.globalData
const qcloud = require('../../../vendor/qcloud-weapp-client-sdk/index');
var send = {
    data: {
        send: '',
        receiver: '',
        type: ['文件', '证件', '小件'],
        typeIndex: 0,
        isSelectType: false,
        endTime: [days, time],
        endTimeIndex: [0, 0],
        noEndTime: true,
        readDeal: [
            { name: '1', value: '' }
        ],
        remark: '',
        price: 0,
        code: '',
        disabled: true
    },
    onLoad: function (options) {
        if (options.type == 'new') return
        if (options.code) {
            app.showLoading();
            qcloud.request({
                url: globalData.baseURL + 'xcx/send/' + options.code,
                login: true,
                success: res => {
                    if (res.data.result) {
                        var data = res.data.returnObject
                        var send = {
                            name: data.sender.name,
                            region: [data.sender.province, data.sender.city, data.sender.area],
                            phone: data.sender.mobile,
                            location: data.sender.location,
                            type: 'send'
                        }
                        var receiver = {
                            name: data.receiver.name,
                            region: [data.receiver.province, data.receiver.city, data.receiver.area],
                            phone: data.receiver.mobile,
                            location: data.receiver.location,
                            type: 'receiver'
                        }
                        this.setData({
                            code: data.code,
                            typeIndex: data.fIndex.typeIndex,
                            endTimeIndex: data.fIndex.endTimeIndex,
                            send: send,
                            receiver: receiver,
                            noEndTime: false,
                            isSelectType: true,
                            price: data.price,
                            remark: data.remark,
                            code: data.code
                        })
                        wx.setStorageSync('send', send)
                        wx.setStorageSync('receiver', receiver)
                        wx.hideLoading()
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
            return
        }
        var that = this;
        wx.getStorage({
            key: 'send',
            success: function (res) {
                that.setData({
                    send: res.data,
                })
            }
        })
        wx.getStorage({
            key: 'receiver',
            success: function (res) {
                that.setData({
                    receiver: res.data,
                })
            }
        })
        wx.setNavigationBarTitle({
            title: '我要托付'
        })
    },
    typeChange: function (e) {
        // console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            typeIndex: e.detail.value,
            isSelectType: true
        })
    },
    // 到达时间选择确定
    endTimeSureChange: function (e) {
        // console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            endTimeIndex: e.detail.value,
            noEndTime: false
        })
        this.getPrice()
    },
    // 筛选到达时间
    endTimeChange: function (e) {
        // console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
        // var data = {
        //   endTime: this.data.endTime,
        //   endTimeIndex: this.data.endTimeIndex
        // };
        // data.endTimeIndex[e.detail.column] = e.detail.value;
        // this.setData(data);
    },

    remarkChange: function (e) {
        this.setData({
            remark: e.detail.value
        })
    },
    priceChange: function (e) {
        this.setData({
            price: e.detail.value
        })
    },
    getTime() {
        var date = new Date();
        var data = {};

        function format(data) {
            return data > 9 ? data : '0' + data
        }

        data.y = date.getFullYear();
        data.m = format(date.getMonth() + 1);
        data.d = format(date.getDate());
        data.h = format(date.getHours());
        data.min = format(date.getMinutes());
        data.s = format(date.getSeconds());
        return data;
        
    },
    getPrice() {
        var date = this.getTime();
        var data = {
            departureTime: date.y + '-' + date.m + '-' + date.d + ' ' + date.h + ':' + date.min,
            arrivalTime: this.data.endTime[0][this.data.endTimeIndex[0]].id + ' ' + this.data.endTime[1][this.data.endTimeIndex[1]].name
        }
        qcloud.request({
            url: globalData.baseURL + 'xcx/price/calc',
            method: 'GET',
            data: data,
            login: true,
            success: res => {
                if (res.data.result) {
                    this.setData({
                        price: res.data.returnObject
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
    checkboxChange: function (e) {
        // console.log('checkbox发生change事件，携带value值为：', e.detail.value)
        var flag = false;
        if (e.detail.value[0] == '1') {
            flag = true
        }
        this.setData({
            disabled: !flag
        })
    },
    verify() {
        var data = this.data
        if (!data.send) {
            modal('请填写寄件人信息')
            return false
        }
        if (!data.receiver) {
            modal('请填写收件人信息')
            return false
        }
        if (!data.isSelectType) {
            modal('请选择物品类型')
            return false
        }
        if (data.noEndTime) {
            modal('请选择到达时间')
            return false
        }
        return true
    },
    openAgreement() {
        wx.navigateTo({ url: '../../component/agreement/agreement?type=waybill' })
    },
    submit() {
        if (!this.verify()) return
        var date = this.getTime();
        var data = {
            sender: {
                name: this.data.send.name,
                mobile: this.data.send.phone,
                province: this.data.send.region[0],
                city: this.data.send.region[1],
                area: this.data.send.region[2],
                location: this.data.send.location
            },
            receiver: {
                name: this.data.receiver.name,
                mobile: this.data.receiver.phone,
                province: this.data.receiver.region[0],
                city: this.data.receiver.region[1],
                area: this.data.receiver.region[2],
                location: this.data.receiver.location
            },
            goodsType: this.data.type[this.data.typeIndex],
            departureTime: date.y + '-' + date.m + '-' + date.d + ' ' + date.h + ':' + date.min,
            arrivalTime: this.data.endTime[0][this.data.endTimeIndex[0]].id + ' ' + this.data.endTime[1][this.data.endTimeIndex[1]].name,
            fIndex: {
                "endTimeIndex": this.data.endTimeIndex,
                "typeIndex": this.data.typeIndex,
            },
            price: this.data.price,
            remark: this.data.remark,
            code: this.data.code
        }
        qcloud.request({
            url: globalData.baseURL + 'xcx/send/edit',
            method: 'POST',
            data: data,
            login: true,
            success: res => {
                if (res.data.result) {
                    wx.redirectTo({ url: '../order-result/order-result?type=send&code=' + res.data.returnObject.code })
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
}
Page(send)