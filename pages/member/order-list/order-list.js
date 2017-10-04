// pages/list/index.js
var globalData = getApp().globalData;
const qcloud = require('../../../vendor/qcloud-weapp-client-sdk/index')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageNo: 1,
        list: [],
        loading: false,
        showLoading: false,
        orderStatusMap: {
            "NEW": '已接单',
            "PICKUP": '已揽件',
            "PAID": '已支付',
            "SIGNED": '已签收',
            "CANCELED": '已取消'
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({ showLoading: true })
        wx.showLoading({
            title: '加载中...',
            mask: true
        })
        this.getDataList()
        wx.setNavigationBarTitle({
            title: '我的订单'
        })
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {
        this.setData({
            pageNo: this.data.pageNo + 1
        })
        this.setData({ loading: true });
        this.getDataList()
    },

    getDataList() {
        var that = this;
        qcloud.request({
            url: globalData.baseURL + 'xcx/order/list',
            method: 'POST',
            data: {
                pageNo: this.data.pageNo,
                pageSize: 10
            },
            login: true,
            success: function (res) {
                var newList = that.data.list
                res.data.resultList.forEach(function (item, index) {
                    item.arrivalTime = item.arrivalTime.slice(0, 11);
                    newList.push(item)
                })
                wx.hideLoading()
                that.setData({
                    loading: false,
                    showLoading: false,
                    list: newList
                })
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
    goToOrderDetail(e) {
        var type = e.currentTarget.dataset.type
        var code = e.currentTarget.dataset.code
        if (type == '寄') {
            wx.redirectTo({ url: '../../order/send-order-detail/send-order-detail?orderID=' + code })
        } else {
            wx.redirectTo({ url: '../../order/travel-order-detail/travel-order-detail?orderID=' + code })
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