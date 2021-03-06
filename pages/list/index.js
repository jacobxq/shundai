// pages/list/index.js
const app = getApp()
const globalData = app.globalData;
const modal = app.modal
const qcloud = require('../../vendor/qcloud-weapp-client-sdk/index')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        startCity: [],
        endCity: [],
        type: ['全部', '顺带', '寄件'],
        selectedStartCity: false,
        selectedEndCity: false,
        typeCode: ['', 'CARRY', 'SEND'],
        typeIndex: 0,
        pageNo: 1,
        list: [],
        loading: false,
        showLoading: false,
        total: 0,
        noMoreList: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function () {
        
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {
        if (this.data.list.length < this.data.total) {
            this.setData({
                pageNo: this.data.pageNo + 1
            })
            this.setData({ loading: true });
            this.getDataList()
        } else {
            this.setData({ noMoreList: true })
        }
    },

    startCityChange(e) {
        this.setData({
            list: [],
            pageNo: 1,
            startCity: e.detail.value,
            selectedStartCity: true
        })
        this.getDataList()
    },
    endCityChange(e) {
        this.setData({
            list: [],
            pageNo: 1,
            endCity: e.detail.value,
            selectedEndCity: true
        })
        this.getDataList()
    },
    typeChange(e) {
        // console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            list: [],
            pageNo: 1,
            typeIndex: e.detail.value
        })
        this.getDataList()
    },
    getDataList() {
        var that = this;
        qcloud.request({
            url: globalData.baseURL + 'xcx/demand/list',
            method: 'POST',
            data: {
                pd: {
                    departureCity: !this.data.selectedStartCity ? '' :this.data.startCity[1],
                    arrivalCity: !this.data.selectedEndCity ? '' : this.data.endCity[1],
                    demandType: this.data.typeCode[this.data.typeIndex],
                },
                currentPage: this.data.pageNo,
                showCount: 10
            },
            login: true,
            success: function (res) {
                wx.hideLoading()
                var newList = that.data.list
                res.data.resultList.forEach(function (item, index) {
                    newList.push(item)
                })
                that.setData({
                    loading: false,
                    showLoading: false,
                    list: newList
                })
                console.log(that.data.list)
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
    gotoMatch(e) {
        var type = e.currentTarget.dataset.type
        var isSelf = e.currentTarget.dataset.self
        var id = e.currentTarget.id
        console.log(type, isSelf, id)
        if (type == '寄') {
            if (!isSelf) {
                wx.navigateTo({ url: './traveler-match-demand/traveler-match-demand?code=' + id })
            } else {
                wx.navigateTo({ url: './sender-demand-detail/sender-demand-detail?code=' + id })
            }
        } else {
            if (!isSelf) {
                wx.navigateTo({ url: './sender-match-demand/sender-match-demand?code=' + id })
            } else {
                wx.navigateTo({ url: './traveler-demand-detail/traveler-demand-detail?code=' + id })
            }
        }
    },


    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.setData({ showLoading: true })
        if (wx.getStorageSync('userInfo')) {
            wx.showLoading({
                title: '加载中...',
                mask: true
            })
            this.setData({
                list: []
            })
            this.getDataList()
        } else {
            modal('请先登录', () => {
                wx.switchTab({ url: '../member/index' })
            }, false)
        }
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },



    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})