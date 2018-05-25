angular.module("KendoDemos", ["kendo.directives"])
    .controller("SaveDetailCtrl", function ($scope, $filter, $compile, $http) {
        //初始化数据
        var user = getUser();
        $scope.Prioritys = ['High', 'Middle', 'Low'];
        $scope.CaseStatus = ['Receive', 'Statistics Analysis', 'Failure Analysis', 'Close'];
        var StatisticAnalysisList = [], NonDestructiveAnalysisList = [], DestructiveAnalysisList = [], Stage3Attachment = [], Stage4Attachment = [], Stage3ItemList = [], itemOneList = [], itemTwoList = [];
        $scope.Stage3ReceiveDate = "";
        $scope.assignments = {}; $scope.RootCauseLv1 = [];
        /*
         * 表中表
         **/
        var AssyCode = [], FabCode = [], LotList = [];
        var AssyCodeXml = "", FabCodeXml = "";
        $http.get("http://eip.unisoc.com/opsweb/QA/FAR/_api/web/lists/getByTitle('Assy%20Code')/items?$select=Title&$orderby=Created%20desc&$Top=99999999")
            .success(function (AssyCodeXmlData) {
                AssyCodeXml = AssyCodeXmlData;
                $http.get("http://eip.unisoc.com/opsweb/QA/FAR/_api/web/lists/getByTitle('Fab%20Code')/items?$select=Title&$orderby=Created%20desc&$Top=99999999")
                    .success(function (FabCodeXmlData) {
                        FabCodeXml = FabCodeXmlData;
                        AssyCode = getValue(AssyCodeXml, 'AssyCode');
                        FabCode = getValue(FabCodeXml, 'FabCode');
                        /*
                         * 获取下拉列表数据
                         * **/
                        $http.get("http://10.0.3.52:8060/QREService.svc/GetQRESystemData?")
                            .success(function (data) {
                                // 数据
                                var data = JSON.parse(data)
                                $scope.StatisticAnalysis = data.StatisticAnalysis;
                                $scope.NonDestructiveAnalysis = data.NonDestructiveAnalysis;
                                $scope.DestructiveAnalysis = data.DestructiveAnalysis;
                                $scope.MPNList = data.MPNs;
                                $scope.tempdatas = $scope.MPNList;
                                $scope.FailuresFounds = data.FailuresFound;
                                $scope.Types = data.RootCauses;
                                /*
                                 *根据CaseNumber 获取Case详情 
                                 **/
                                $http.get("http://10.0.3.52:8060/QREService.svc/GetQRECaseInfoByCaseNumber?", { params: { caseNumber: CaseNumber } })
                                    .success(function (data) {
                                        // 数据
                                        var dataList = JSON.parse(data);
                                        $().SPServices({
                                            operation: "GetUserProfileByName",
                                            async: false,
                                            AccountName: user.selectDepartName,
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
                                                if (departmentList.indexOf(Department) >= 0 || authorityUserList.indexOf(user.loginName) >= 0) {
                                                } else if (user.loginName == dataList.CreatedBy) {
                                                    url = "../SitePages/EditOwnerCase.aspx?CaseNumber=" + CaseNumber;
                                                    window.location.href = url;
                                                } else {
                                                    $("#example")[0].style.display = "none";
                                                    alertMessage("您无权修改！")
                                                }
                                            }
                                        });
                                        $scope.result = {
                                            CaseNumber: dataList.CaseNumber,
                                            CreatedBy: dataList.CreatedBy,
                                            CreatorEmail: dataList.CreatorEmail ? dataList.CreatorEmail : "",
                                            Type: dataList.Type,
                                            CreatedDate: dataList.CreatedDate,
                                            Priority: dataList.Priority,
                                            CaseStatus: dataList.CaseStatus,
                                            MPN: dataList.MPN,
                                            ProductLine: dataList.ProductLine,
                                            QREOwner: dataList.QREOwner,
                                            QREOwnerEmail: dataList.QREOwnerEmail ? dataList.QREOwnerEmail : "",
                                            Other: dataList.Other,
                                            Dppm: dataList.Dppm,
                                            Customer: dataList.Customer,
                                            FailuresFound: dataList.FailuresFound,
                                            LinkName: dataList.LinkName,
                                            LotList: dataList.LotList,
                                            ProblemDescription: dataList.ProblemDescription,
                                            StatisticAnalysis: dataList.StatisticAnalysis,
                                            NonDestructiveAnalysis: dataList.NonDestructiveAnalysis,
                                            DestructiveAnalysis: dataList.DestructiveAnalysis,
                                            Stage3ContinueAnalysis: dataList.Stage3ContinueAnalysis,
                                            Stage3AssiggnTo: dataList.Stage3AssiggnTo,
                                            Stage3CompleteDate: dataList.Stage3CompleteDate,
                                            Stage3ReceiveDate: dataList.Stage3ReceiveDate,
                                            Stage3Item: dataList.Stage3Item,
                                            Stage3Summary: dataList.Stage3Summary,
                                            Stage3CRCT: dataList.Stage3CRCT,
                                            Stage4ContinueAnalysis: dataList.Stage4ContinueAnalysis,
                                            Stage3Attachment: dataList.Stage3Attachment,
                                            Stage4ReceiveDate: dataList.Stage4ReceiveDate,
                                            Stage4CompleteDate: dataList.Stage4CompleteDate,
                                            Stage4ItemOne: dataList.Stage4ItemOne,
                                            Stage4ItemTwo: dataList.Stage4ItemTwo,
                                            Stage4Summary: dataList.Stage4Summary,
                                            Stage4CRCT: dataList.Stage4CRCT,
                                            Stage4Attachment: dataList.Stage4Attachment,
                                            RootCauseLv1: dataList.RootCauseLv1,
                                            RootCauseLv2: dataList.RootCauseLv2,
                                            Stage5Summary: dataList.Stage5Summary,
                                            Stage5CRCT: dataList.Stage5CRCT,
                                            Complexity: dataList.Complexity,
                                            CurrentUser: user.loginName
                                        }
                                        LotList = dataList.LotList;
                                        length = LotList.length;
                                        var dataSource = new kendo.data.DataSource({
                                            data: LotList,
                                            batch: true,
                                            schema: {
                                                model: {
                                                    id: "ID",
                                                    fields: {
                                                        ID: { editable: false, nullable: true },
                                                        Number: { type: "string", validation: { required: true } },
                                                        LotIDOrDateCode: { type: "string", validation: { required: true } },
                                                        Fab: { type: "string", validation: { required: true } },
                                                        AssemblyData: { type: "string", validation: { required: true } },
                                                        createTime: { editable: false, nullable: true },
                                                    }
                                                },
                                                parse: function (data, options, operation) {
                                                    if (data.models) {
                                                        if (!data.models[0].ID) {
                                                            length = length + 1;
                                                            data.models[0].ID = parseInt(length);
                                                            data.models[0].createTime = new Date();
                                                            data.models[0].QRECaseNumber = CaseNumber;
                                                            LotList.push(data.models[0])
                                                        } else {
                                                            angular.forEach(LotList, function (LList, Index) {
                                                                if (LList.ID == data.models[0].ID) {
                                                                    LotList[Index] = data.models[0];
                                                                }
                                                            })
                                                        }
                                                        return data.models[0];
                                                    } else {
                                                        for (var i = 0; i < data.length; i++) {
                                                            if (data[i].createTime == undefined) {
                                                                data[i].createTime = new Date();
                                                            }
                                                        }
                                                        return data;
                                                    }

                                                }
                                            },
                                            sort: {
                                                field: "createTime",
                                                dir: "asc"
                                            },
                                            pageSize: 5,
                                        });
                                        $("#grid").kendoGrid({
                                            dataSource: dataSource,
                                            pageable: {
                                                refresh: true,
                                                pageSizes: true,
                                                buttonCount: 5
                                            },
                                            toolbar: ["create"],
                                            columns: [{ field: "Number", title: "No.", width: "120px" },
                                            { field: "LotIDOrDateCode", title: "Lot ID&Date Code", width: "120px" },
                                            { field: "Fab", title: "Fab", values: FabCode, width: "120px" },
                                            { field: "AssemblyData", title: "Assembly", values: AssyCode, width: "120px" },
                                            { command: [{ name: "edit", text: "修改" }, { name: "Delete", text: "删除", click: Delete }], title: "&nbsp;", width: "120px" }],
                                            editable: "popup"
                                        });
                                        //格式化时间
                                        if (dataList.Stage3CompleteDate == "0001-01-01") {
                                            dataList.Stage3CompleteDate = $filter('date')(new Date(), 'yyyy-MM-dd')
                                        }
                                        $scope.Stage3CompleteDate = new Date(dataList.Stage3CompleteDate);
                                        if (dataList.Stage3ReceiveDate == "0001-01-01") {
                                            dataList.Stage3ReceiveDate = $filter('date')(new Date(), 'yyyy-MM-dd')
                                        }
                                        $scope.Stage3ReceiveDate = new Date(dataList.Stage3ReceiveDate);
                                        if (dataList.Stage4ReceiveDate == "0001-01-01") {
                                            dataList.Stage4ReceiveDate = $filter('date')(new Date(), 'yyyy-MM-dd')
                                        }
                                        $scope.Stage4ReceiveDate = new Date(dataList.Stage4ReceiveDate);
                                        if (dataList.Stage4CompleteDate == "0001-01-01") {
                                            dataList.Stage4CompleteDate = $filter('date')(new Date(), 'yyyy-MM-dd')
                                        }
                                        $scope.Stage4CompleteDate = new Date(dataList.Stage4CompleteDate);
                                        //判断选择的Type
                                        if ($scope.result.Type) {
                                            angular.forEach($scope.Types, function (data, index, array) {
                                                if (data.CaseType == $scope.result.Type) {
                                                    $scope.Type = data;
                                                    $scope.RootCauseLv1 = data.Levels;
                                                }
                                            });
                                        }
                                        $scope.MPN = $scope.result.MPN;
                                        //第一次进入页面如果为FAR,显示链接
                                        if ($scope.isSaveFAR) {
                                            $("#linkName").html($scope.result.LinkName)
                                        }
                                        /*
                                         * 初始化页面选择多选按钮 
                                         **/
                                        if (dataList.StatisticAnalysis) {
                                            StatisticAnalysisList = JSON.parse(dataList.StatisticAnalysis);
                                            SelectMulity(StatisticAnalysisList, 11);
                                        }
                                        if (dataList.NonDestructiveAnalysis) {
                                            NonDestructiveAnalysisList = JSON.parse(dataList.NonDestructiveAnalysis);
                                            SelectMulity(NonDestructiveAnalysisList, 12);
                                        }
                                        if (dataList.DestructiveAnalysis) {
                                            DestructiveAnalysisList = JSON.parse(dataList.DestructiveAnalysis);
                                            SelectMulity(DestructiveAnalysisList, 13);
                                        }
                                        if (dataList.Stage3Item) {
                                            Stage3ItemList = JSON.parse(dataList.Stage3Item);
                                            SelectMulity(Stage3ItemList, 3);
                                        }
                                        if (dataList.Stage4ItemOne) {
                                            itemOneList = JSON.parse(dataList.Stage4ItemOne);
                                            SelectMulity(itemOneList, 41);
                                        }
                                        if (dataList.Stage4ItemTwo) {
                                            itemTwoList = JSON.parse(dataList.Stage4ItemTwo);
                                            SelectMulity(itemTwoList, 42);
                                        }
                                        /*
                                         * 初始化页面显示附件链接
                                         * **/

                                        if (dataList.Stage3ContinueAnalysis == "Yes" && dataList.Stage3Attachment) {
                                            Stage3Attachment = JSON.parse(dataList.Stage3Attachment);
                                            angular.forEach(Stage3Attachment, function (data, index, array) {
                                                var id = data.split('.')[0];
                                                var NewPath = _spPageContextInfo.webAbsoluteUrl;
                                                var PathType = data.substring(data.indexOf('.') + 1, data.length).toUpperCase();
                                                if (PathType == "DOCX" || PathType == "DOC" || PathType == "XLSX" || PathType == "XLS") {
                                                    NewPath += "/_layouts/15/WopiFrame.aspx?sourcedoc=/opsweb/qa/QRE/Shared Documents/";
                                                    NewPath = encodeURI(NewPath);
                                                } else {
                                                    NewPath += '/Shared%20Documents/';
                                                }
                                                var fileName = "<a target='_blank' href='" + NewPath + data + "'>" + data + "</a>";
                                                var $htmlButton = $compile('<li id=\'' + id + '\' class="liStyle">' + fileName + '<button id="close" type="button" class="close buttonStyle" data-dismiss="alert" ng-click="deleteFile(\'Stage3\',\'' + data + '\',\'' + id + '\')">×</button></li>')($scope);
                                                $("#InstallAttachmentStage3").append($htmlButton)
                                            });
                                        }
                                        if (dataList.Stage4ContinueAnalysis == "Yes" && dataList.Stage4Attachment) {
                                            Stage4Attachment = JSON.parse(dataList.Stage4Attachment);
                                            angular.forEach(Stage4Attachment, function (data, index, array) {
                                                var id = data.split('.')[0];
                                                var NewPath = _spPageContextInfo.webAbsoluteUrl;
                                                var PathType = data.substring(data.indexOf('.') + 1, data.length).toUpperCase();
                                                if (PathType == "DOCX" || PathType == "DOC" || PathType == "XLSX" || PathType == "XLS") {
                                                    NewPath += "/_layouts/15/WopiFrame.aspx?sourcedoc=/opsweb/qa/QRE/Shared Documents/";
                                                    NewPath = encodeURI(NewPath);
                                                } else {
                                                    NewPath += '/Shared%20Documents/';
                                                }
                                                var fileName = "<a target='_blank' href='" + NewPath + data + "'>" + data + "</a>";
                                                var $htmlButton = $compile('<li id=\'' + id + '\' class="liStyle">' + fileName + '<button id="close" type="button" class="close buttonStyle" data-dismiss="alert" ng-click="deleteFile(\'Stage4\',\'' + data + '\',\'' + id + '\')">×</button></li>')($scope);
                                                $("#InstallAttachmentStage4").append($htmlButton)
                                            });
                                        }
                                    });
                            });

                    });
            });

        /*
         * 
         * 
         **/
        /**
         *监控数据变化 针对不同表单
         */
        function SelectMulity(List, index) {
            angular.forEach(List, function (data) {
                var id = getId(data, index);
                $("#" + id).attr("checked", true)
            })
        }
        function NoSelectMulity(List, index) {
            angular.forEach(List, function (data) {
                var id = getId(data, index);
                $("#" + id).attr("checked", false);
            })
        }
        $scope.isSaveFAR = true;
        /*
         * 监控Type显示不同页面
         * 清空Customer 和 LinkName
         **/
        $scope.$watch('Type', function (value, oldValue) {
            if (value != oldValue) {
                if (value && oldValue != undefined) {
                    $scope.isSaveFAR = false;
                    $("#showFAR")[0].style.display = "none";
                    $scope.result.LinkName = "";
                    $scope.result.Customer = "";
                    $scope.result.Type = value.CaseType;
                    if (value.CaseType == "RMA") {
                        $scope.Customer = "Customer";
                        $scope.LinkName = "FAR No.";
                    } else {
                        $scope.Customer = "Internal Department";
                        $scope.LinkName = "Yield";
                    }
                } else if (value.CaseType != "RMA") {
                    $scope.isSaveFAR = false;
                    $("#showFAR")[0].style.display = "none";
                    $scope.Customer = "Internal Department";
                    $scope.LinkName = "Yield";
                } else {
                    $scope.Customer = "Customer";
                    $scope.LinkName = "FAR No.";
                }
                if ($scope.Types) {
                    angular.forEach($scope.Types, function (data, index, array) {
                        if (data.CaseType == $scope.result.Type) {
                            $scope.RootCauseLv1 = data.Levels;
                        }
                    });
                }
            }
        });
        /*
         * 动态获取RootCauseLv1 和 RootCaseLv2
         **/
        $scope.$watch('RootCauseLv1Select', function (value, oldValue) {
            if (value != oldValue) {
                if (value) {
                    $scope.result.RootCauseLv1 = value.Level1;
                    $scope.RootCauseLv2 = value.Level2
                } else {
                    $scope.result.RootCauseLv1 = null;
                    $scope.result.RootCauseLv2 = null;
                    $scope.RootCauseLv2 = null;
                }
            }
        });
        $scope.$watch('result.RootCauseLv1', function (value, oldValue) {
            if (value != oldValue) {
                angular.forEach($scope.RootCauseLv1, function (data) {
                    if ($scope.result.RootCauseLv1 == data.Level1) {
                        $scope.RootCauseLv1Select = data;
                    }
                })
            }
        });
        $scope.$watch('result.Stage3ContinueAnalysis', function (value) {
            if (value == "Yes") {
                $scope.IsShowStage3 = true;
                $("#showStage3Summary")[0].style.display = "";
            } else {
                //清空stage3 中数据
                if ($scope.result) {
                    $scope.result.Stage3AssiggnTo = "";
                    $scope.Stage3ReceiveDate = new Date();
                    $scope.Stage3CompleteDate = new Date();
                    if (I3 != 0) {
                        leipiEditorStage3Summary.sync();
                        leipiEditorStage3Summary.execCommand('cleardoc');
                    }
                    NoSelectMulity(Stage3ItemList, 3);
                    Stage3ItemList = [];
                    $scope.result.Stage3Item = "";
                    $scope.result.Stage3CRCT = "";
                    $scope.result.Stage3Attachment = "";
                    $scope.result.Stage3Summary = "";
                    $("#InstallAttachmentStage3").html("");
                    Stage3Attachment = [];
                    $scope.result.Stage4ContinueAnalysis = "Yes";
                }
                $scope.IsShowStage3 = false;
                $("#showStage3Summary")[0].style.display = "none";
            }
        });
        $scope.$watch('result.Stage4ContinueAnalysis', function (value) {
            if (value == "Yes") {
                $scope.IsShowStage4 = true;
                $("#stage4ShowSummary")[0].style.display = "";
            } else {
                //清空stage4 中数据
                if ($scope.result) {
                    $scope.Stage4ReceiveDate = new Date();
                    $scope.Stage4CompleteDate = new Date();
                    $scope.result.Stage4ItemOne = "";
                    NoSelectMulity(itemOneList, 41);
                    $scope.result.Stage4ItemTwo = "";
                    NoSelectMulity(itemTwoList, 42);
                    leipiEditorStage4Summary.sync();
                    leipiEditorStage4Summary.execCommand('cleardoc');
                    $scope.result.Stage4Summary = "";
                    $scope.result.Stage4CRCT = "";
                    $scope.result.Stage4Attachment = "";
                    $("#InstallAttachmentStage4").html("");
                    Stage4Attachment = [];
                }
                $scope.IsShowStage4 = false;
                $("#stage4ShowSummary")[0].style.display = "none";
            }
        });

        /**
         *提交申请记录
         * @param {any} event
         */
        $scope.saveChanges = function (event) {
            var st = event;
            $scope.LotList = event.sender.options.dataSource.view();
        }
        $scope.save = function () {
            //更新不需要发送邮件
            //保存信息
            if (II != 0) {
                leipiEditor.sync(); //同步内容
                var html = leipiEditor.getContent();
                var str = "<p><br/></p>"
                if (html.substring(html.length - str.length, html.length) == str) {
                    html = html.substring(0, html.length - str.length);
                }
                $scope.result.ProblemDescription = html;
            }
            if ($scope.result.ProblemDescription.length >= 20000) {
                alertMessage("Problem Description 内容过长,请重新输入")
            } else if ($scope.result.Stage3Summary.length >= 20000) {
                alertMessage("Stage3 Summary 内容过长,请重新输入")
            } else if ($scope.result.Stage3Summary.length >= 20000) {
                alertMessage("Stage4 Summary 内容过长,请重新输入")
            } else if ($scope.result.Stage3Summary.length >= 20000) {
                alertMessage("CA&PA&Conclusion 内容过长,请重新输入")
            } else {
                if (verifyNewCase()) {
                    if ($scope.result.Type == 'RMA') {
                        if ($scope.result.LinkName.indexOf("http:") < 0) {
                            $scope.result.LinkName = '<a class="ms-listlink ms-draggable" target="_blank" href="http://eip.unisoc.com/opsweb/qa/FAR/Failure Analysis Request/' + $scope.result.LinkName + '">' + $scope.result.LinkName + '</a>';
                        }
                    }
                    $scope.result.LotList = [];
                    angular.forEach(LotList, function (data, index, array) {
                        var dIndex = {
                            'Number': '',
                            'LotIDOrDateCode': '',
                            'Fab': '',
                            'AssemblyData': '',
                        }
                        dIndex.Number = data.Number;
                        dIndex.LotIDOrDateCode = data.LotIDOrDateCode;
                        dIndex.Fab = data.Fab;
                        dIndex.AssemblyData = data.AssemblyData;
                        $scope.result.LotList.push(dIndex);
                    });
                    $scope.result.Stage3CompleteDate = $filter('date')($scope.Stage3CompleteDate, 'yyyy-MM-dd');
                    $scope.result.Stage3ReceiveDate = $filter('date')($scope.Stage3ReceiveDate, 'yyyy-MM-dd');
                    $scope.result.Stage4ReceiveDate = $filter('date')($scope.Stage4ReceiveDate, 'yyyy-MM-dd');
                    $scope.result.Stage4CompleteDate = $filter('date')($scope.Stage4CompleteDate, 'yyyy-MM-dd');
                    var url = "http://10.0.3.52:8060/QREService.svc/SaveData?";
                    $.ajax({
                        type: "POST",
                        url: url,
                        contentType: "application/json; charset=utf-8",
                        data: JSON.stringify($scope.result),
                        dataType: "json",
                        success: function (data) {
                            window.location.href = "../SitePages/Home.aspx";
                            //发送邮件
                        },
                        error: function (a, b, c) {
                            alert("保存失败")
                        }
                    });
                }
            }
        }
        $scope.SaveDetail = function () {
            if (GetC3Date() && GetC4Date() && GetC5Date()) {
                if (I3 != 0) {
                    leipiEditorStage3Summary.sync(); //同步内容
                    var htmlStage3 = leipiEditorStage3Summary.getContent();
                    var str = "<p><br/></p>"
                    if (htmlStage3.substring(htmlStage3.length - str.length, htmlStage3.length) == str) {
                        htmlStage3 = htmlStage3.substring(0, htmlStage3.length - str.length);
                    }
                    $scope.result.Stage3Summary = htmlStage3;
                }
                if (I4 != 0) {
                    leipiEditorStage4Summary.sync(); //同步内容
                    var htmlStage4 = leipiEditorStage4Summary.getContent();
                    var str = "<p><br/></p>"
                    if (htmlStage4.substring(htmlStage4.length - str.length, htmlStage4.length) == str) {
                        htmlStage4 = htmlStage4.substring(0, htmlStage4.length - str.length);
                    }
                    $scope.result.Stage4Summary = htmlStage4;
                }
                if (I5 != 0) {
                    leipiEditorStage5Summary.sync();
                    var htmlStage5 = leipiEditorStage5Summary.getContent();
                    var str = "<p><br/></p>";
                    if (htmlStage5.substring(htmlStage5.length - str.length, htmlStage5.length) == str) {
                        htmlStage5 = htmlStage5.substring(0, htmlStage5.length - str.length);
                    }
                    $scope.result.Stage5Summary = htmlStage5;
                }
                if ($scope.IsShowStage3 || !$scope.IsShowStage4) {
                    $scope.result.CaseStatus = 'Statistic Analysis'
                }
                if ($scope.result.Stage4ItemOne != null || $scope.result.Stage4ItemTwo != null || $scope.result.Stage4Summary != null || $scope.result.Stage4Attachment != null) {
                    $scope.result.CaseStatus = 'Failure Analysis'
                }
                $scope.save();
            }
        }
        function GetC3Date() {
            if ($scope.IsShowStage3) {
                if ($scope.Stage3CompleteDate != '' && $scope.Stage3ReceiveDate != '') {
                    var days = $scope.Stage3CompleteDate.getTime() - $scope.Stage3ReceiveDate.getTime();
                    var time = parseInt(days / (1000 * 60 * 60 * 24));
                    if (time < 0) {
                        alertMessage("请正确填写Stage3:Complete Date 和 Receive Date")
                        return false;
                    } else {
                        $scope.result.Stage3CRCT = time;
                        return true;
                    }
                } else {
                    $scope.result.Stage4CRCT = null;
                    return true;
                }
            } else {
                $scope.result.Stage4CRCT = null;
                return true;
            }
        }
        function GetC4Date() {
            if ($scope.IsShowStage4) {
                if ($scope.Stage4CompleteDate != '' && $scope.Stage4ReceiveDate != '') {
                    var days = $scope.Stage4CompleteDate.getTime() - $scope.Stage4ReceiveDate.getTime();
                    var time = parseInt(days / (1000 * 60 * 60 * 24));
                    if (time < 0) {
                        alertMessage("请正确填写Stage4:Complete Date 和 Receive Date")
                        return false;
                    } else {
                        $scope.result.Stage4CRCT = time;
                        return true;
                    }
                } else {
                    $scope.result.Stage4CRCT = null;
                    return true;
                }
            } else {
                $scope.result.Stage4CRCT = null;
                return true;
            }
        }
        function GetC5Date() {
            if ($scope.result.CaseStatus == "Close") {
                GetComplexityScore();
                //if ($scope.result.RootCauseLv1 && $scope.result.RootCauseLv2) {
                if ($scope.result.RootCauseLv1) {
                    var days = "";
                    if (typeof $scope.result.CreatedDate == "string") {
                        days = new Date().getTime() - new Date($scope.result.CreatedDate).getTime();
                    } else {
                        days = new Date().getTime() - $scope.result.CreatedDate.getTime();
                    }
                    var time = parseInt(days / (1000 * 60 * 60 * 24));
                    $scope.result.Stage5CRCT = time;

                    return true
                } else {
                    //alertMessage("若要关闭case,请选择level1 和 level2");
                    alertMessage("若要关闭case,请选择level1");
                    return false;
                }
            } else {
                $scope.result.Complexity = 0;
                $scope.result.Stage5CRCT = null;
                return true;
            }
        }
        /**
         * 表中表
         * 超过高度需回滚页面顶部
         */
        $(document).ready(function () {
            $(".k-grid-add").click(function () {
                document.body.scrollTop = document.documentElement.scrollTop = 0;
            })
        })
        function generateUUID() {
            var d = new Date().getTime();
            var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = (d + Math.random() * 16) % 16 | 0;
                d = Math.floor(d / 16);
                return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
            });
            return uuid;
        };

        /**
         * 控制多选json
         */
        $scope.StatisticAnalysisClick = function (z) {
            if (StatisticAnalysisList.indexOf(z) >= 0) {
                StatisticAnalysisList.splice(StatisticAnalysisList.indexOf(z), 1);
            } else {
                StatisticAnalysisList.push(z);
            }
            $scope.result.StatisticAnalysis = JSON.stringify(StatisticAnalysisList);
        }
        $scope.NonDestructiveAnalysisClick = function (z) {
            if (NonDestructiveAnalysisList.indexOf(z) >= 0) {
                NonDestructiveAnalysisList.splice(NonDestructiveAnalysisList.indexOf(z), 1);
            } else {
                NonDestructiveAnalysisList.push(z);
            }
            $scope.result.NonDestructiveAnalysis = JSON.stringify(NonDestructiveAnalysisList);
        }
        $scope.DestructiveAnalysisClick = function (z) {
            if (DestructiveAnalysisList.indexOf(z) >= 0) {
                DestructiveAnalysisList.splice(DestructiveAnalysisList.indexOf(z), 1);
            } else {
                DestructiveAnalysisList.push(z);
            }
            $scope.result.DestructiveAnalysis = JSON.stringify(DestructiveAnalysisList);

        }
        $scope.Stage3ItemClick = function (z) {
            if (Stage3ItemList.indexOf(z) >= 0) {
                Stage3ItemList.splice(Stage3ItemList.indexOf(z), 1);
            } else {
                Stage3ItemList.push(z);
            }
            $scope.result.Stage3Item = JSON.stringify(Stage3ItemList);
        }
        $scope.itemOneClick = function (z) {
            if (itemOneList.indexOf(z) >= 0) {
                itemOneList.splice(itemOneList.indexOf(z), 1);
            } else {
                itemOneList.push(z);
            }
            $scope.result.Stage4ItemOne = JSON.stringify(itemOneList);
        }
        $scope.itemTwoClick = function (z) {
            if (itemTwoList.indexOf(z) >= 0) {
                itemTwoList.splice(itemTwoList.indexOf(z), 1);
            } else {
                itemTwoList.push(z);
            }
            $scope.result.Stage4ItemTwo = JSON.stringify(itemTwoList);
        }
        /**
         * 
         * 跳转页面
         */
        $scope.StateLink = function (nId) {
            $(nId).click()
        }
        /**
         * 模糊搜索
         */
        $scope.hidden = true;
        $scope.change = function (x) {
            angular.forEach($scope.MPNList, function (data, index, array) {
                if (data.MPN == x[0]) {
                    $scope.MPN = x;
                    $scope.result.MPN = data.MPN;
                    $scope.result.ProductLine = data.ProductLine;
                    $scope.result.QREOwner = data.QREOwner;
                }
            });
            $scope.hidden = true;
        }
        $scope.changeKeyValue = function (v) {
            var newDate = [];
            angular.forEach($scope.tempdatas, function (data, index, array) {
                if (data.MPN.indexOf(v) >= 0) {
                    newDate.unshift(data);
                }
            });
            $scope.MPNList = newDate;
            $scope.hidden = false;
        }
        /**
         * 校验数据
         */
        function verifyNewCase() {
            if ($scope.result.CreatedBy == null || $scope.result.CreatedBy == '') {
                alertMessage('页面加载失败或服务器端代码被修改，请刷新页面');
                return false;
            }
            if ($scope.result.Type == null || $scope.result.Type == '') {
                alertMessage('请选择Type');
                return false;
            }
            if ($scope.result.Priority == null || $scope.result.Priority == '') {
                alertMessage("请选择Priority");
                return false;
            }
            if ($scope.result.CaseStatus == null || $scope.result.CaseStatus == '') {
                alertMessage("请选择CaseStatus");
                return false;
            }
            if ($scope.result.MPN == null || $scope.result.MPN == '') {
                alertMessage("请选择MPN");
                return false;
            }
            if ($scope.result.Dppm == null || $scope.result.Dppm == '') {
                alertMessage("请输入Dppm");
                return false;
            }
            if ($scope.result.Customer == null || $scope.result.Customer == '') {
                alertMessage("请输入" + $scope.Customer);
                return false;
            }
            if ($scope.result.FailuresFound == null || $scope.result.FailuresFound == '') {
                alertMessage("请输入FailuresFound");
                return false;
            }
            if ($scope.result.LinkName == null || $scope.result.LinkName == '') {
                alertMessage("请输入" + $scope.LinkName);
                return false;
            }
            if ($scope.result.ProblemDescription == null || $scope.result.ProblemDescription == '') {
                alertMessage("请输入ProblemDescription");
                return false;
            }
            if (StatisticAnalysisList.length == 0 && NonDestructiveAnalysisList.length == 0 && DestructiveAnalysisList.length == 0) {
                alertMessage("请选择Analysis Request");
                return false;
            }
            return true;
        }
        function alertMessage(message) {
            layer.alert(message, {
                icon: 7,
                skin: 'layer-ext-moon'
            })
        }
        // Stage2 ProblemDescription
        var leipiEditor = UE.getEditor('ProblemDescription', {
            toolleipi: true,//是否显示，设计器的 toolbars
            textarea: 'design_content',
            toolbars: [[
                'source', '|', 'undo', 'redo', '|', 'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'removeformat', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', '|', 'fontfamily', 'fontsize', '|', 'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', 'horizontal', '|', 'inserttable', 'deletetable', 'mergecells', 'splittocells', '|',]],
            wordCount: false,
            elementPathEnabled: false,
            initialFrameHeight: 80
        });
        var leipiEditorStage3Summary = UE.getEditor('Stage3Summary', {
            toolleipi: true,//是否显示，设计器的 toolbars
            textarea: 'design_content',
            toolbars: [[
                'source', '|', 'undo', 'redo', '|', 'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'removeformat', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', '|', 'fontfamily', 'fontsize', '|', 'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', 'horizontal', '|', 'inserttable', 'deletetable', 'mergecells', 'splittocells', '|',]],
            wordCount: false,
            elementPathEnabled: false,
            initialFrameHeight: 80
        });
        var leipiEditorStage4Summary = UE.getEditor('Stage4Summary', {
            toolleipi: true,//是否显示，设计器的 toolbars
            textarea: 'design_content',
            toolbars: [[
                'source', '|', 'undo', 'redo', '|', 'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'removeformat', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', '|', 'fontfamily', 'fontsize', '|', 'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', 'horizontal', '|', 'inserttable', 'deletetable', 'mergecells', 'splittocells', '|',]],
            wordCount: false,
            elementPathEnabled: false,
            initialFrameHeight: 80
        });
        var leipiEditorStage5Summary = UE.getEditor('Stag5Summary', {
            toolleipi: true,//是否显示，设计器的 toolbars
            textarea: 'design_content',
            toolbars: [[
                'source', '|', 'undo', 'redo', '|', 'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'removeformat', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', '|', 'fontfamily', 'fontsize', '|', 'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', 'horizontal', '|', 'inserttable', 'deletetable', 'mergecells', 'splittocells', '|',]],
            wordCount: false,
            elementPathEnabled: false,
            initialFrameHeight: 80
        });
        //Upload File
        var StageType = '', DocumentLibraryName = '', fileName = '';
        $scope.upload = function (el, id, type, DocumentLibrary) {
            DocumentLibraryName = DocumentLibrary;
            StageType = type;
            /*
             *判断是否是IE 
             **/
            if (IEVersion() <= 9 && IEVersion() != -1 && IEVersion() != 'edge') {
                el.select();
                el.blur();
                var path = document.selection.createRange().text;
                var fos = new ActiveXObject("Scripting.FileSystemObject");
                file = fos.GetFile(path);
                alertMessage("您的IE浏览器版本不支持上传功能，请使用IE高级版本或Chrome浏览器");
            } else {
                file = el.files[0];
                fr = new FileReader();
                fr.onload = receivedBinary;
                fr.readAsDataURL(file);
            }
        };
        function receivedBinary() {
            clientContext = new SP.ClientContext.get_current();
            oWebsite = clientContext.get_web();
            parentList = oWebsite.get_lists().getByTitle(DocumentLibraryName);
            fileCreateInfo = new SP.FileCreationInformation();
            var fileType = file.name.split('.')[1];
            fileName = $scope.result.CaseNumber + '-' + new Date().getTime() + '.' + fileType;
            fileCreateInfo.set_url(fileName);
            fileCreateInfo.set_overwrite(true);
            fileCreateInfo.set_content(new SP.Base64EncodedByteArray());
            var arr = convertDataURIToBinary(this.result);
            for (var i = 0; i < arr.length; ++i) {
                fileCreateInfo.get_content().append(arr[i]);
            }
            this.newFile = parentList.get_rootFolder().get_files().add(fileCreateInfo);
            clientContext.load(this.newFile);
            clientContext.executeQueryAsync(onSuccess, onFailure);
        }
        function onSuccess() {
            if (StageType == "Stage3") {
                Stage3Attachment.push(fileName);
                var id = new Date().getTime();
                var $htmlButton = $compile('<li id=\'' + id + '\' class="liStyle">' + fileName + '<button id="close" type="button" class="close buttonStyle" data-dismiss="alert" ng-click="deleteFile(\'Stage3\',\'' + fileName + '\',' + id + ')">×</button></li>')($scope);
                $("#InstallAttachmentStage3").append($htmlButton)
                $scope.result.Stage3Attachment = JSON.stringify(Stage3Attachment);
            } else {
                Stage4Attachment.push(fileName);
                var id = new Date().getTime();
                var $htmlButton = $compile('<li id=\'' + id + '\' class="liStyle">' + fileName + '<button id="close" type="button" class="close buttonStyle" data-dismiss="alert" ng-click="deleteFile(\'Stage4\',\'' + fileName + '\',' + id + ')">×</button></li>')($scope);
                $("#InstallAttachmentStage4").append($htmlButton);
                $scope.result.Stage4Attachment = JSON.stringify(Stage4Attachment);
            }
        }
        function onFailure() {
            alertMessage("文件上传失败")
        }

        $scope.deleteFile = function (type, name, id) {
            if (type == "Stage3") {
                if (Stage3Attachment.indexOf(name) >= 0) {
                    Stage3Attachment.splice(Stage3Attachment.indexOf(name), 1);
                    $scope.result.Stage3Attachment = JSON.stringify(Stage3Attachment);
                    if ($('#' + id).length > 0) {
                        $('#' + id)[0].style.display = 'none';
                    }
                }
            } else {
                if (Stage4Attachment.indexOf(name) >= 0) {
                    Stage4Attachment.splice(Stage4Attachment.indexOf(name), 1);
                    $scope.result.Stage4Attachment = JSON.stringify(Stage4Attachment);
                    if ($('#' + id).length > 0) {
                        $('#' + id)[0].style.display = 'none';
                    }
                }
            }
        }
        function convertDataURIToBinary(dataURI) {
            var BASE64_MARKER = ';base64,';
            var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
            var base64 = dataURI.substring(base64Index);
            var raw = window.atob(base64);
            var rawLength = raw.length;
            var array = new Uint8Array(new ArrayBuffer(rawLength));

            for (i = 0; i < rawLength; i++) {
                array[i] = raw.charCodeAt(i);
            }
            return array;
        }
        //初始化更新Ueditor中内容
        var II = 0, I3 = 0, I4 = 0, I5 = 0;
        $scope.InserLeipiEditor = function () {
            $("#tab1").click();
            $($("#tab-Title-2").parent()).attr("class", "active")
            if (II == 0) {
                leipiEditor.execCommand('insertHtml', $scope.result.ProblemDescription);
                II = 2;
            }
        }
        $scope.Inser3LeipiEditor = function () {
            $("#tab2").click();
            $($("#tab-Title-3").parent()).attr("class", "active")
            if (I3 == 0) {
                if ($scope.IsShowStage3) {
                    leipiEditorStage3Summary.execCommand('insertHtml', $scope.result.Stage3Summary);
                } else {
                    leipiEditorStage3Summary.execCommand('cleardoc');
                }
                I3 = 2;
            }
        }
        $scope.Inser4LeipiEditor = function () {
            $("#tab3").click();
            $($("#tab-Title-4").parent()).attr("class", "active")
            if (I4 == 0) {
                if ($scope.IsShowStage4) {
                    leipiEditorStage4Summary.execCommand('insertHtml', $scope.result.Stage4Summary);
                } else {
                    leipiEditorStage4Summary.execCommand('cleardoc');
                }
                I4 = 2;
            }
        }
        $scope.Inser5LeipiEditor = function () {
            $("#tab4").click();
            $($("#tab-Title-5").parent()).attr("class", "active")
            if (I5 == 0) {
                leipiEditorStage5Summary.execCommand('insertHtml', $scope.result.Stage5Summary);
                I5 = 2;
            }
        }
        $scope.changeDate = function (id) {
            var val = $("#" + id).val();
            if (id == "Stage3ReceiveDate") {
                $scope.Stage3ReceiveDate = new Date(val);
            } else if (id == "Stage3CompleteDate") {
                $scope.Stage3CompleteDate = new Date(val);
            } else if (id == "Stage4ReceiveDate") {
                $scope.Stage4ReceiveDate = new Date(val);
            } else if (id == "Stage4CompleteDate") {
                $scope.Stage4CompleteDate = new Date(val);
            }
        }
        function GetComplexityScore() {
            var Score = 0, stage1Score = 0, stage3Score = 0, stage4Score = 0, stage5Score = 0;
            if ($scope.result.Priority == "High") {
                stage1Score = 3;
            } else if ($scope.result.Priority == "Middle") {
                stage1Score = 2;
            } else if ($scope.result.Priority == "Low") {
                stage1Score = 1;
            }
            if ($scope.IsShowStage3 && Stage3ItemList.length > 0) {
                stage3Score = 1;
            }
            if ($scope.IsShowStage4) {
                if (itemOneList.length > 0) {
                    stage4Score += 1;
                }
                if (itemTwoList.length > 0) {
                    stage4Score += 2;
                }
            }
            if (stage4Score >= 0 && stage4Score <= 2) {
                if ($scope.result.Stage5CRCT <= 5) {
                    stage5Score = 2;
                } else if ($scope.result.Stage5CRCT > 5) {
                    stage5Score = 1;
                }
            } else {
                if ($scope.result.Stage5CRCT <= 5) {
                    stage5Score = 3;
                } else if ($scope.result.Stage5CRCT >= 0 && $scope.result.Stage5CRCT <= 10) {
                    stage5Score = 2;
                } else if ($scope.Stage5CRCT > 10) {
                    stage5Score = 1;
                }
            }
            Score = stage1Score + stage3Score + stage4Score + stage5Score;
            $scope.result.Complexity = Score;
        }
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
            var List = [];
            angular.forEach(list, function (data) {
                if (val == 'AssyCode') {
                    if (data.text) {
                        List.push(data.text);
                    } else {
                        List.push(data.textContent);
                    }
                } else {
                    if (data.text) {
                        List.push(data.text);
                    } else {
                        List.push(data.textContent);
                    }
                }
            })
            return List;
        }
        function Delete(e) {
            e.preventDefault();
            var tr = $(e.target).closest("tr");
            var data = this.dataItem(tr);
            var Id = data.ID;
            angular.forEach(LotList, function (LList, Index) {
                if (LList.ID == Id) {
                    LotList.splice(Index, 1);
                    $(".k-pager-refresh.k-link").click();
                }
            })

        }
    })
    .filter('ValueString', function () {
        return function (value) {
            if (value.indexOf("Others") >= 0 || value.indexOf("0thers") >= 0) {
                value = "Other";
                return value;
            }
            value = value.split(" ").join("");
            value = value.split("(").join("");
            value = value.split(")").join("")
            return value;
        }
    }); 
