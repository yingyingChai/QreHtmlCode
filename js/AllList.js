angular.module("KendoDemos", ["kendo.directives"])
    .controller("ListAllCtrl", function ($scope, $filter, $http, $compile) {

        var Department = '', caseOwner = '',ListLoginUse = '';
        $().SPServices({
            operation: "GetUserProfileByName",
            async: false,
            AccountName: selectDepartName,
            completefunc: function (xData, Status) {
                /**
                 * xml 解析
                 * */
                if (window.ActiveXObject) {
                    var xmlobject = new ActiveXObject("Microsoft.XMLDOM");
                    xmlobject.async = "false";
                    xmlobject.loadXML(xData.responseText);
                }
                else {
                    var parser = new DOMParser();
                    var xmlobject = parser.parseFromString(xData.responseText, "text/xml");
                }
                /*
                 * 当前登陆人Department
                 * 非QRE部门传名字
                 * */
                Department = getUPValue(xmlobject, "Department");
                ListLoginUse = loginName;
                if (Department == "Customer Quality" || loginName.indexOf("Yingying Chai") >= 0) {
                    caseOwner = "QRE";
                } else {
                    caseOwner = loginName;
                }
                /*
                 * 根据登录人获取Case
                 * */
                $http.get("http://10.0.3.52:8060/QREService.svc/GetQRECaseList?", { params: { caseOwner: caseOwner } })
                    .success(function (data) {
                        var dataSource = new kendo.data.DataSource({
                            type: "odata",
                            data: JSON.parse(data),
                            schema: {
                                model: {
                                    fields: {
                                        CaseNumber: { type: "string" },
                                        Complexity: { type: "string" },
                                        CaseStatus: { type: "string" },
                                        CreatedBy: { type: "string" },
                                        CreatedDate: { type: "date" },
                                        MPN: { type: "string" },
                                        Priority: { type: "string" },
                                        ProductLine: { type: "string" },
                                        QREOwner: { type: "string" },
                                        RootCauseLv1: { type: "string" },
                                        RootCauseLv2: { type: "string" },
                                        Stage3CRCT: { type: "string" },
                                        Stage3Item: { type: "string" },
                                        Stage4CRCT: { type: "string" },
                                        Stage5CRCT: { type: "string" },
                                        Type: { type: "string" },
                                    }
                                },
                            },
                            pageSize: 10,
                        });
                        $("#grid").kendoGrid({
                            dataSource: dataSource,
                            filterable: true,
                            pageable: true,
                            columns: [{
                                field: "CaseNumber",
                                width:150
                            }, {
                                field: "Complexity",
                            }, {
                                field: "CaseStatus",
                            }, {
                                field: "CreatedBy",
                            }, {
                                field: "CreatedDate",
                                format: "{0: yyyy-MM-dd}"
                            }, {
                                field: "MPN",
                            }, {
                                field: "Priority",
                            }, {
                                field: "ProductLine",
                            }, {
                                field: "QREOwner",
                            }, {
                                field: "RootCauseLv1",
                            }, {
                                field: "RootCauseLv2",
                            }, {
                                field: "Stage3CRCT",
                            }, {
                                field: "Stage3Item",
                            }, {
                                field: "Stage4CRCT",
                            }, {
                                field: "Stage5CRCT",
                            }, {
                                field: "Type",
                            }, {
                                command: [
                                    //{ name: "View", click: EditCase },
                                    { name: "Edit", click: EditCase },
                                    { name: "Delete", click: Delete }
                                ],
                                //width: 230
                                width: 180
                            }]
                        });
                    });
            }
        });
        function Delete(e) {
            e.preventDefault();
            var tr = $(e.target).closest("tr"); // get the current table row (tr)
            // get the data bound to the current table row
            var data = this.dataItem(tr);
            var Id = data.CaseNumber;
            //根据Id 删除
        }
        function EditCase(e) {
            e.preventDefault();
            var tr = $(e.target).closest("tr");
            var data = this.dataItem(tr);
            var Id = data.CaseNumber;
            if (caseOwner == "QRE") {
                url = "../SitePages/EditCase.aspx?CaseNumber=" + Id;
                window.location.href = url;
            } else if (ListLoginUse == data.CreatedBy) {
                url = "../SitePages/EditOwnerCase.aspx?CaseNumber=" + Id;
                window.location.href = url;
            } else {
                alertMessage("您无权修改！")
            }
        }
        function alertMessage(message) {
            layer.alert(message, {
                icon: 7,
                skin: 'layer-ext-moon'
            })
        }
    })