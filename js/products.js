var FabCode = []; var AssyCode = [];
$.ajax({
    url: "http://eip.unisoc.com/opsweb/QA/FAR/_api/web/lists/getByTitle('Fab%20Code')/items?$select=Title&$orderby=Created%20desc&$Top=99999999",
    method: "GET",
    headers: { "Accept": "application/json; odata=verbose" },
    success: function (data) {
        var restData = data.d.results;
        if (restData) {
            for (var i = 0; i < restData.length; i++) {
                if (restData[i]["Title"] != null) {
                    FabCode.push(restData[i]["Title"]);
                }
            }
        }
    },
    error: function (data) {
    }
});
$.ajax({
    url: "http://eip.unisoc.com/opsweb/QA/FAR/_api/web/lists/getByTitle('Assy%20Code')/items?$select=Title&$orderby=Created%20desc&$Top=99999999",
    method: "GET",
    headers: { "Accept": "application/json; odata=verbose" },
    success: function (data) {
        var restData = data.d.results;
        if (restData) {
            for (var i = 0; i < restData.length; i++) {
                if (restData[i]["Title"] != null) {
                    AssyCode.push(restData[i]["Title"]);
                }
            }
        }
    },
    error: function (data) {
    }
});
var selectDepartName = '', loginName = '', CreatorEmail = '';
$.ajax({
    url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/getuserbyid(" + _spPageContextInfo.userId + ")",
    contentType: "application/json;odata=verbose",
    headers: { "accept": "application/json;odata=verbose" },
    success: function (data) {
        loginName = data.d.Title;
        selectDepartName = data.d.LoginName;
        CreatorEmail = data.d.Email;
    },
    error: function (data) {
    }
});
$(function () {
    $("#LoginUser").html(loginName);
})
//ªÒ»°CaseNumber
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}
var CaseNumber = getQueryString("CaseNumber");
var LotList = [], CreatedBy = "", QREOwner;
var dataList = [];
if (CaseNumber) {
    $.getJSON("http://10.0.3.52:8060/QREService.svc/GetQRECaseInfoByCaseNumber?", { caseNumber: CaseNumber },
        function (data) {
            dataList = JSON.parse(data);
            LotList = dataList.LotList;
            CreatedBy = dataList.CreatedBy;
            QREOwner = dataList.QREOwner;

        })
}
function getId(value, index) {
    var id = "";
    if (value.indexOf("Others") >= 0 || value.indexOf("0thers") >= 0) {
        id = "Other";
        return id + index;
    }
    id = value.split(" ").join("");
    id = id.split("(").join("");
    id = id.split(")").join("");
    return id + index;
}
function IEVersion() {
    var userAgent = navigator.userAgent; //»°µ√‰Ø¿¿∆˜µƒuserAgent◊÷∑˚¥Æ  
    var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //≈–∂œ «∑ÒIE<11‰Ø¿¿∆˜  
    var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //≈–∂œ «∑ÒIEµƒEdge‰Ø¿¿∆˜  
    var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
    if (isIE) {
        var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
        reIE.test(userAgent);
        var fIEVersion = parseFloat(RegExp["$1"]);
        if (fIEVersion == 7) {
            return 7;
        } else if (fIEVersion == 8) {
            return 8;
        } else if (fIEVersion == 9) {
            return 9;
        } else if (fIEVersion == 10) {
            return 10;
        } else {
            return 6;//IE∞Ê±æ<=7
        }
    } else if (isEdge) {
        return 'edge';//edge
    } else if (isIE11) {
        return 11; //IE11  
    } else {
        return -1;//≤ª «ie‰Ø¿¿∆˜
    }
}
function getUPValue(x, p) {
    var thisValue = $(x).SPFilterNode("PropertyData").filter(function () {
        return $(this).find("Name").text() == p;
    }).find("Values").text();
    return thisValue;
}
