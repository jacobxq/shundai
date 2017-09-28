const app = getApp()
const modal = app.modal
const globalData = app.globalData
const qcloud = require('../../../vendor/qcloud-weapp-client-sdk/index')

Page({
    data: {
        attestationInfo: {
            image_front: '',
            image_verso: '',
            name: '',
            phone: '',
            id: ''
        },
        code: '',
        counting: false,
        second: 60,
        vCode: ''
    },
    onLoad() {
        wx.setNavigationBarTitle({
            title: '实名认证'
        })
    },
    nameChange: function (e) {
        var name = 'attestationInfo.name'
        this.setData({
            [name]: e.detail.value
        })
    },
    phoneChange: function (e) {
        var phone = 'attestationInfo.phone'
        this.setData({
            [phone]: e.detail.value
        })
    },
    idChange: function (e) {
        var id = 'attestationInfo.id'
        this.setData({
            [id]: e.detail.value
        })
    },
    codeChange: function (e) {
        this.setData({
            code: e.detail.value
        })
    },
    uploadImage: function (e) {
        var type = e.target.dataset.type;
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: res => {
                var tempFilePaths = ''
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                wx.uploadFile({
                    url: globalData.baseURL + 'xcx/upload',
                    filePath: res.tempFilePaths[0],
                    name: 'file',
                    success: respond => {
                        if (respond.data.result) {
                            if (type == 'front') {
                                tempFilePaths = 'attestationInfo.image_front'

                            } else {
                                tempFilePaths = 'attestationInfo.image_verso'
                            }
                            this.setData({
                                [tempFilePaths]: respond.data.returnObject.path
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
    },
    getCode() {
        if (!this.data.attestationInfo.phone || !(/^1([3-8])\d{9}$/.test(this.data.attestationInfo.phone))) {
            modal('请输入正确的中国大陆地区手机号')
            return
        }
        this.setData({
            counting: true
        })
        var count = 60;
        var timer = setInterval(() => {
            if (count === '00') {
                clearInterval(timer);
                this.setData({
                    counting: false
                })
                return;
            }
            count = count - 1;
            count = count > 9 ? count : '0' + count;
            this.setData({
                second: count
            })
        }, 1 * 1000);
        qcloud.request({
            url: globalData.baseURL + 'xcx/send-sms-code',
            method: 'GET',
            data: {
                mobile: this.data.attestationInfo.phone
            },
            login: true,
            success: res => {
                if (res.data.result) {
                    this.setData({
                        vCode: res.data.returnObject.smsCode
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
    verfiy(data, code) {
        if (!data.name) {
            modal('请输入真实姓名')
            return false
        }
        if (!data.id) {
            modal('请输入中国大陆公民身份证号')
            return false
        }
        if (!data.phone || !(/^1([3-8])\d{9}$/.test(data.phone))) {
            modal('请输入正确的中国大陆地区手机号')
            return false
        }
        if (!data.image_front) {
            modal('请输入上传身份证正面照')
            return false
        }
        if (!data.image_verso) {
            modal('请输入上传身份证反面照')
            return false
        }
        if (!code || code != this.data.vCode) {
            modal('请输入正确短信验证码')
            return false
        }
        return true
    },
    submit() {
        if (!this.verfiy(this.data.attestationInfo, this.data.code)) return
        var data = {
            name: this.data.attestationInfo.name,
            idCard: this.data.attestationInfo.id,
            mobile: this.data.attestationInfo.phone,
            smsCode: this.data.code,
            cardFront: this.data.attestationInfo.image_front,
            cardBack: this.data.attestationInfo.image_verso
        }

        qcloud.request({
            url: globalData.baseURL + 'xcx/real-name-auth',
            method: 'POST',
            data: data,
            login: true,
            success: res => {
                if (res.data.result) {
                    wx.setStorageSync('realNameAuth', true)
                    wx.redirectTo({ url: '../real-name-result/real-name-result' })
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