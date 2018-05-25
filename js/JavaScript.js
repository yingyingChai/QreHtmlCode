$scope.AssyCode = [];
$scope.FabCode = [];
$http.get("http://eip.unisoc.com/opsweb/QA/FAR/_api/web/lists/getByTitle('Assy%20Code')/items?$select=Title&$orderby=Created%20desc&$Top=99999999")
    .success(function (data) {
        var value = getValue(data, 'AssyCode');
    });
$http.get("http://eip.unisoc.com/opsweb/QA/FAR/_api/web/lists/getByTitle('Fab%20Code')/items?$select=Title&$orderby=Created%20desc&$Top=99999999")
    .success(function (data) {
        var value = getValue(data, 'FabCode');
    });
function getValue(Dom, val) {
    if (window.ActiveXObject) {
        var xmlobject = new ActiveXObject("Microsoft.XMLDOM");
        xmlobject.async = "false";
        xmlobject.loadXML(Dom);
    }
    else {
        var parser = new DOMParser();
        var xmlobject = parser.parseFromString(Dom, "text/xml");
    }
    var list = $(xmlobject).SPFilterNode("entry").SPFilterNode("content");
    angular.forEach(list, function (data) {
        if (val == 'AssyCode') {
            $scope.AssyCode.push(data.textContent);
        } else {
            $scope.FabCode.push(data.textContent);
        }
    })
}