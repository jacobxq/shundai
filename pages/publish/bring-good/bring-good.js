const app = getApp()
const util = require('../../../utils/util.js');
const days = util.getDate(); // 获取日期
const time = util.getTime(); // 获取时间
const modal = app.modal
const globalData = app.globalData
const qcloud = require('../../../vendor/qcloud-weapp-client-sdk/index');
var bring = {
    data: {
        startCity: [],
        endCity: [],
        startTime: [days, time],
        startTimeIndex: [0, 0],
        endTime: [days, time],
        endTimeIndex: [0, 0],
        noStartTime: true,
        noEndTime: true,
        phone: '',
        image: '',
        remark: '',
        price: 0,
        readDeal: [
            { name: '1', value: '' }
        ],
        disabled: true,
        code: ''
    },
    onLoad(options) {
        wx.setNavigationBarTitle({
            title: '我要顺带'
        })
        if (options.code) {
            app.showLoading();
            qcloud.request({
                url: globalData.baseURL + 'xcx/carry/' + options.code,
                login: true,
                success: res => {
                    if (res.data.result) {
                        var data = res.data.returnObject
                        this.setData({
                            startCity: [data.departure.province, data.departure.city, data.departure.area],
                            endCity: [data.arrival.province, data.arrival.city, data.arrival.area],
                            startTimeIndex: data.fIndex.startTimeIndex,
                            endTimeIndex: data.fIndex.endTimeIndex,
                            noStartTime: false,
                            noEndTime: false,
                            phone: data.mobile,
                            image: data.trafficVoucher,
                            remark: data.remark,
                            price: data.price,
                            code: data.code
                        })
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
    },
    // 出发地城市选择
    startCityChange: function (e) {
        this.setData({
            startCity: e.detail.value
        })
    },
    // 目的地城市选择
    endCityChange: function (e) {
        this.setData({
            endCity: e.detail.value
        })
    },
    // 出发时间选择确定
    startTimeSureChange: function (e) {
        // console.log('picker发送选择改变，携带值为', e.detail.value)
        // 出发时间和到达时间处理
        var index = this.data.endTimeIndex
        if (e.detail.value[0] >= index[0]) {
            index[0] = e.detail.value[0]
            if (e.detail.value[1] > index[1]) {
                index[1] = e.detail.value[1]
            }
        }
        this.setData({
            startTimeIndex: e.detail.value,
            noStartTime: false,
            endTimeIndex: index
        })
        this.getPrice()
    },
    // 筛选出发时间
    startTimeChange: function (e) {
        // todo
    },
    // 到达时间选择确定
    endTimeSureChange: function (e) {
        // console.log('picker发送选择改变，携带值为', e.detail.value)
        if (e.detail.value[0] <= this.data.startTimeIndex[0]) {
            e.detail.value[0] = this.data.startTimeIndex[0]
            if (e.detail.value[1] < this.data.startTimeIndex[1]) {
                e.detail.value[1] = this.data.startTimeIndex[1]
            }
        }
        this.setData({
            endTimeIndex: e.detail.value,
            noEndTime: false
        })
        this.getPrice()
    },
    // 筛选到达时间
    endTimeChange: function (e) {
        // todo
    },
    getPrice() {
        if (this.data.noStartTime || this.data.noStartTime) return
        var data = {
            departureTime: this.data.startTime[0][this.data.startTimeIndex[0]].id + ' ' + this.data.startTime[1][this.data.startTimeIndex[1]].name,
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
    phoneChange: function (e) {
        this.setData({
            phone: e.detail.value
        })
    },
    uploadImage: function () {
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: res => {
                app.showLoading('上传中...');
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                wx.uploadFile({
                    url: globalData.baseURL + 'xcx/upload',
                    filePath: res.tempFilePaths[0],
                    name: 'file',
                    success: respond => {
                        if (JSON.parse(respond.data).result) {
                            this.setData({
                                image: globalData.baseURL + JSON.parse(respond.data).returnObject
                            })
                        }
                        wx.hideLoading()
                    },
                    fail(error) {
                        wx.hideLoading()
                        app.showModel('请求失败', error);
                        console.log('request fail', error);
                    },
                    complete() {
                        console.log('request complete');
                    }
                });
            }
        })
    },
    previewImage: function () {
        wx.previewImage({
            current: this.data.image, // 当前显示图片的http链接
            urls: [this.data.image] // 需要预览的图片http链接列表
        })
    },
    remarkChange: function (e) {
        this.setData({
            remark: e.detail.value
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
        if (data.startCity.length == 0) {
            modal('请选择出发城市')
            return false
        }
        if (data.endCity.length == 0) {
            modal('请选择目的城市')
            return false
        }
        if (data.noStartTime) {
            modal('请选择出发时间')
            return false
        }
        if (data.noEndTime) {
            modal('请选择到达时间')
            return false
        }
        if (!data.phone || !(/^1([3-8])\d{9}$/.test(data.phone))) {
            modal('请输入正确的中国大陆地区手机号')
            return false
        }
        if (!data.image) {
            modal('请上传机票、车票等凭证')
            return false
        }
        return true
    },
    openAgreement() {
        wx.navigateTo({ url: '../../component/agreement/agreement?type=waybill' })
    },
    submit() {
        if (!this.verify()) return
        var data = {
            departure: {
                province: this.data.startCity[0],
                city: this.data.startCity[1],
                area: this.data.startCity[2]
            },
            arrival: {
                province: this.data.endCity[0],
                city: this.data.endCity[1],
                area: this.data.endCity[2]
            },
            departureTime: this.data.startTime[0][this.data.startTimeIndex[0]].id + ' ' + this.data.startTime[1][this.data.startTimeIndex[1]].name,
            arrivalTime: this.data.endTime[0][this.data.endTimeIndex[0]].id + ' ' + this.data.endTime[1][this.data.endTimeIndex[1]].name,
            mobile: this.data.phone,
            trafficVoucher: this.data.image,
            remark: this.data.remark,
            code: this.data.code,
            fIndex: {
                startTimeIndex: this.data.startTimeIndex,
                endTimeIndex: this.data.endTimeIndex
            }
        }
        qcloud.request({
            url: globalData.baseURL + 'xcx/carry/edit',
            method: 'POST',
            data: data,
            login: true,
            success: res => {
                if (res.data.result) {
                    wx.redirectTo({ url: '../order-result/order-result?type=bring&code=' + res.data.returnObject.code })
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
}
Page(bring)