var modal = getApp().modal
var address = {
    data: {
        name: '',
        region: [],
        phone: '',
        location: '',
        type: ''
    },
    onLoad: function (options) {
        var that = this;
        wx.getStorage({
            key: options.type,
            success: function (res) {
                console.log(res)
                that.setData({
                    name: res.data.name,
                    region: res.data.region,
                    phone: res.data.phone,
                    location: res.data.location
                })
            }
        })
        this.setData({
            type: options.type
        })
        wx.setNavigationBarTitle({
          title: '添加地址'
        })
    },
    nameChange: function (e) {
        this.setData({
            name: e.detail.value
        })
    },
    phoneChange: function (e) {
        this.setData({
            phone: e.detail.value
        })
    },
    // 地区选择
    regionChange: function (e) {
        this.setData({
            region: e.detail.value
        })
    },
    addressChange: function (e) {
        this.setData({
            location: e.detail.value
        })
    },
    verify: function (data) {
        if (!data.name) {
            modal('请输入姓名')
            return false
        }
        if (!data.phone || !(/^1([3-8])\d{9}$/.test(data.phone))) {
          modal('请输入正确的中国大陆地区手机号')
          return false
        }
        if (data.region.length == 0) {
            modal('请选择地区')
            return false
        }
        if (!data.location) {
            modal('请输入具体到街道、门牌号等信息')
            return false
        }
        return true;
    },
    submitFn: function () {
        var data = this.data;
        if (address.verify(data)) {
            try {
                wx.setStorageSync(this.data.type, data)
                wx.redirectTo({
                    url: '../send-good/send-good',
                })
            } catch (e) {
                console.log(e)
            }
        }

    }
}
Page(address)