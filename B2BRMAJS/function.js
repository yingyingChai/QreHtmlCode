function getItem(id) {
    var dataItem = {};
    $.ajax({
        url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getByTitle('RMA')/items?$select=Handler,Handler/Id,Handler/Title,Notification_x0020_List,Notification_x0020_List/Id,Notification_x0020_List/Title,CreatedAuthor,CreatedAuthor/Id,CreatedAuthor/Title,CaseStatus&$expand=CreatedAuthor/Id,Notification_x0020_List/Id,Handler/Id&$filter=ID eq '" + id + "'",
        contentType: "application/json;odata=verbose",
        headers: { "accept": "application/json;odata=verbose" },
        async: false,
        success: function (data) {
            if (data.d.results) {
                dataItem = data.d.results[0];
            }
        },
        error: function (xhr) {
        }
    });
    return dataItem;
}
function getUserInformation() {
    var User = {}
    $.ajax({
        url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/getuserbyid(" + _spPageContextInfo.userId + ")",
        contentType: "application/json;odata=verbose",
        headers: { "accept": "application/json;odata=verbose" },
        async: false,
        success: function (data) {
            User.loginName = data.d.Title;
            User.selectDepartName = data.d.LoginName;
            User.CreatorEmail = data.d.Email;
        },
        error: function (data) {
        }
    });
    return User;
}
function getDepartment(loginName) {
    var Department = "";
    $().SPServices({
        operation: "GetUserProfileByName",
        async: false,
        AccountName: loginName,
        completefunc: function (xData, Status) {
            if (window.ActiveXObject) {
                var xmlobject = new ActiveXObject("Microsoft.XMLDOM");
                xmlobject.async = "false";
                xmlobject.loadXML(xData.responseText);
            }
            else {
                var parser = new DOMParser();
                var xmlobject = parser.parseFromString(xData.responseText, "text/xml");
            }
            Department = getUPValue(xmlobject, "Department");
        }
    });
    return Department
}
Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1,                 //月份
        "d+": this.getDate(),                    //日
        "h+": this.getHours(),                   //小时
        "m+": this.getMinutes(),                 //分
        "s+": this.getSeconds(),                 //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
function getUPValue(x, p) {
    var thisValue = $(x).SPFilterNode("PropertyData").filter(function () {
        return $(this).find("Name").text() == p;
    }).find("Values").text();
    return thisValue;
}
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}
var userList = [];
var DepartmentList = ["System Support"];
var ViewList = ["Bo Qi (祁波)", "Jerry Gong (龚洁)", "Chunzhou Zhao (赵春周)"];
var HomeHTML = "https://sdx.unisoc.com/SitePages/RMA%20Add.aspx";
var EditUrl = "https://sdx.unisoc.com/Lists/RMA/EditForm.aspx?ID=";
var ViewUrl = "https://sdx.unisoc.com/Lists/RMA/DispForm.aspx?ID=";