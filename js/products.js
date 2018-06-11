var departmentList = ["Quality & Reliability", "Business Solutions"];
var authorityUserList = ["Jerry Gong (π®Ω‡)", "Zhanwu Yang (—Ó’ΩŒ‰)"];
var Prioritys = ['High', 'Middle', 'Low'];
var CaseStatus = ['Receive', 'Statistics Analysis', 'Failure Analysis', 'Close'];
var Lab = ["IST(SH)", "IST(TW)", "IST(BJ)", "MAT(SH)", "MAT(TW)"];
function getUser() {
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
//ªÒ»°CaseNumber
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}
//var CaseNumber = getQueryString("CaseNumber");
function getId(value, index) {
    var id = "";
    if (value.indexOf("Others") >= 0 || value.indexOf("0thers") >= 0) {
        id = "Other";
        return id + index;
    } else if (value.indexOf("≥…±æ/Ω·ππ∑÷Œˆ") >= 0) {
        id = "costStructure";
        return id + index;
    } else if (value.indexOf("/") >= 0) {
        id = value.split("/").join("");
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

