﻿angular.module("KendoDemos", ["kendo.directives"])
    .controller("ListAllCtrl", function ($scope, $filter, $http, $compile) {
        if (IEVersion() != -1) {
            alertMessage("IE 浏览器存在兼容性问题，请用chrome 浏览器打开！")
        }
        var user = getUser();
        var Department = '', caseOwner = '', ListLoginUse = '';
        $().SPServices({
            operation: "GetUserProfileByName",
            async: false,
            AccountName: user.selectDepartName,
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
                ListLoginUse = user.loginName;
                if (departmentList.indexOf(Department) >= 0 || authorityUserList.indexOf(user.loginName) >= 0) {
                    caseOwner = "QRE";
                } else {
                    caseOwner = user.loginName;
                }
                loadKendoUi();
            }
        });
        function loadKendoUi() {
            /*
            * 根据登录人获取Case
            * */
            $http.get("http://10.0.3.52:8060/QREService.svc/GetQRECaseList?", { params: { caseOwner: caseOwner } })
                .success(function (data) {
                    var dataSource = new kendo.data.DataSource({
                        data: JSON.parse(data),
                        schema: {
                            model: {
                                fields: {
                                    CaseNumber: { type: "string" },
                                    CaseTitle: { type: "string" },
                                    CaseStatus: { type: "string" },
                                    Complexity: { type: "number" },
                                    CreatedBy: { type: "string" },
                                    CreatedDate: { type: "date" },
                                    CreatedYearMonth: { type: "string"},
                                    MPN: { type: "string" },
                                    Priority: { type: "string" },
                                    ProductLine: { type: "string" },
                                    QREOwner: { type: "string" },
                                    RootCauseLv1: { type: "string" },
                                    RootCauseLv2: { type: "string" },
                                    Stage5CRCT: { type: "number" },
                                    Type: { type: "string" },
                                }
                            },
                        },
                        sort: {
                            field: "CaseNumber",
                            dir: "desc"
                        },
                        pageSize: 10,
                    });
                    $("#grid").kendoGrid({
                        dataSource: dataSource,
                        filterable: true,
                        pageable: true,
                        sortable: true,
                        //columnMenu: true,
                        columns: [{
                            field: "CaseNumber",
                            title: "CaseNumber",
                        }, {
                            field: "CaseTitle",
                            title: "Title",
                        }, {
                            field: "MPN",
                            title: "Product",
                            width: 90
                        }, {
                            field: "ProductLine",
                        }, {
                            field: "CreatedDate",
                            format: "{0: yyyy-MM-dd}",
                            title: "CreatedDate",
                        }, {
                            field: "Stage5CRCT",
                            title: "CRCT",
                            width: 65
                        }, {
                            field: "Priority",
                            width: 77
                        }, {
                            field: "QREOwner",
                            title: "Owner",
                        }, {
                            field: "Type",
                            width: 90,
                        }, {
                            field: "CaseStatus",
                            title: "CaseStatus",
                        },
                        {
                            command: [
                                { name: "Edit", text: "Edit", click: EditCase },
                                { name: "Delete", text: "Delete", click: Delete }
                            ],
                            width: 115,
                        }]
                    });
                });
        }
        function Delete(e) {
            e.preventDefault();
            var tr = $(e.target).closest("tr");
            var data = this.dataItem(tr);
            var Id = data.CaseNumber;
            var casedata = {
                "CurrentUser": ListLoginUse,
                "CaseNumber": Id
            }
            //根据Id 删除
            var url = "http://10.0.3.52:8060/QREService.svc/DeleteCase";
            $.ajax({
                type: "POST",
                url: url,
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(casedata),
                dataType: "json",
                success: function (data) {
                    alertMessage(data.replace("\"", "").replace("\"", ""));
                    if (data.replace("\"", "").replace("\"", "") == "Success") {
                        loadKendoUi();
                    }
                },
                error: function (a, b, c) {
                    console.log(a);
                }
            });
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