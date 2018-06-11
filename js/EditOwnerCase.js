﻿angular.module("KendoDemos", ["kendo.directives"])
    .controller("EditOwnerCaseCtrl", function ($scope, $filter, $compile, $http) {
        //初始化数据
        var loadingIndex = layer.load(2, {
            shade: [0.1, '#fff'] //0.1透明度的白色背景
        });
        if (IEVersion() != -1) {
            alertMessage("IE 浏览器存在兼容性问题，请用chrome 浏览器打开！")
        }
        var user = getUser();
        $scope.Prioritys = Prioritys;
        $scope.CaseStatus = CaseStatus;
        var NonDestructiveAnalysisList = [], DestructiveAnalysisList = [], Stage3Attachment = [], Stage4Attachment = [], Stage3ItemList = [], itemOneList = [], itemTwoList = [], LabLists = [];
        $scope.Stage3ReceiveDate = "";
        $scope.assignments = {}; $scope.RootCauseLv1 = [];
        var changeClose = true;
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
                                $scope.LabList = Lab;
                                $scope.tempdatas = $scope.MPNList;
                                $scope.FailuresFounds = data.FailuresFound;
                                $scope.Types = data.RootCauses;
                                /*
                                 *根据CaseNumber 获取Case详情 
                                 **/
                                var CaseNumber = getQueryString("CaseNumber");
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
                                                //Department = getUPValue(xmlobject, "Department");
                                                //if (departmentList.indexOf(Department) >= 0 || authorityUserList.indexOf(user.loginName) >= 0) {
                                                //    url = "../SitePages/EditCase.aspx?CaseNumber=" + CaseNumber;
                                                //    window.location.href = url;
                                                //} else if (user.loginName == dataList.CreatedBy) {
                                                //} else {
                                                //    $("#example")[0].style.display = "none";
                                                //    alertMessage("您无权修改！")
                                                //}
                                            }
                                        });
                                        $scope.result = {
                                            CaseNumber: dataList.CaseNumber,
                                            CaseTitle: dataList.CaseTitle,
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
                                            Lab: dataList.Lab,
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
                                        if ($scope.result.Stage3ReceiveDate == "0001-01-01") {
                                            $scope.result.Stage3ReceiveDate = null;
                                        }
                                        if ($scope.result.Stage3CompleteDate == "0001-01-01") {
                                            $scope.result.Stage3CompleteDate = null;
                                        }
                                        if ($scope.result.Stage4ReceiveDate == "0001-01-01") {
                                            $scope.result.Stage4ReceiveDate = null;
                                        }
                                        if ($scope.result.Stage4CompleteDate == "0001-01-01") {
                                            $scope.result.Stage4CompleteDate = null;
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
                                            },
                                            toolbar: ["create"],
                                            columns: [{ field: "Number", title: "No.", width: "120px" },
                                            { field: "LotIDOrDateCode", title: "Lot ID&Date Code", width: "120px" },
                                            { field: "Fab", title: "Fab", values: FabCode, width: "120px" },
                                            { field: "AssemblyData", title: "Assembly", values: AssyCode, width: "120px" },
                                            { command: [{ name: "edit", text: "修改" }, { name: "Delete", text: "删除", click: Delete }], title: "&nbsp;", width: "120px" }],
                                            editable: "popup"
                                        });
                                        $("#Stage3Summary").html($scope.result.Stage3Summary);
                                        $("#Stage4Summary").html($scope.result.Stage4Summary);
                                        $("#Stage5Summary").html($scope.result.Stage5Summary);
                                        //判断选择的Type
                                        if ($scope.result.Type) {
                                            angular.forEach($scope.Types, function (data, index, array) {
                                                if (data.CaseType == $scope.result.Type) {
                                                    $scope.Type = data;
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
                                        if (dataList.Lab) {
                                            LabLists = JSON.parse(dataList.Lab);
                                            SelectMulity(LabLists, 'Lab');
                                        }
                                        /*
                                         * 初始化页面显示附件链接
                                         * **/

                                        if (dataList.Stage3ContinueAnalysis == "Yes") {
                                            $scope.IsShowStage3 = true;
                                            if (dataList.Stage3Attachment) {
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
                                                    var $htmlButton = $compile('<li id=\'' + id + '\' class="liStyle">' + fileName + '</li>')($scope);
                                                    $("#InstallAttachmentStage3").append($htmlButton)
                                                });
                                            }
                                        } else {
                                            $("#stage3Detail")[0].style.display = "none";
                                            $scope.IsShowStage3 = false;
                                        }
                                        if (dataList.Stage4ContinueAnalysis == "Yes") {
                                            $scope.IsShowStage4 = true;
                                            if (dataList.Stage4Attachment) {
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
                                                    var $htmlButton = $compile('<li id=\'' + id + '\' class="liStyle">' + fileName + '</li>')($scope);
                                                    $("#InstallAttachmentStage4").append($htmlButton)
                                                });
                                            }
                                        } else {
                                            $scope.IsShowStage4 = false;
                                            $("#stage4ShowSummary")[0].style.display = "none";
                                        }
                                        if (dataList.CaseStatus == "Close") {
                                            $("#CaseStatus").attr("disabled", true);
                                            changeClose = false;
                                        }
                                        if ($scope.result.RootCauseLv1) {
                                            $("#Type").attr("disabled", true);
                                        }
                                        layer.close(loadingIndex);
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
            }
        });
        /**
         *提交申请记录
         * @param {any} event
         */
        var index = 0;
        $scope.SaveDetail = function () {
            index = layer.load(1, {
                shade: [0.1, '#fff'] //0.1透明度的白色背景
            });
            if (verifyNewCase()) {
                if (verifyRMA()) {
                    if ($scope.result.CaseStatus == "Close") {
                        GetComplexityScore()
                    } else {
                        var days = new Date().getTime() - new Date($scope.result.CreatedDate).getTime();
                        var time = parseInt(days / (1000 * 60 * 60 * 24));
                        $scope.result.Stage5CRCT = time;
                    }
                    $scope.save();
                } else {
                    layer.close(index);
                }
            } else {
                layer.close(index);
            }
        }
        $scope.save = function () {
            if (II != 0) {
                leipiEditor.sync(); //同步内容
                var html = leipiEditor.getContent();
                var str = "<p><br/></p>"
                if (html.substring(html.length - str.length, html.length) == str) {
                    html = html.substring(0, html.length - str.length);
                }
                $scope.result.ProblemDescription = html;
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
            var url = "http://10.0.3.52:8060/QREService.svc/SaveData?";
            $.ajax({
                type: "POST",
                url: url,
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify($scope.result),
                dataType: "json",
                success: function (data) {
                    layer.close(index);
                    window.location.href = "../SitePages/Home.aspx";
                    //发送邮件
                },
                error: function (a, b, c) {
                    layer.close(index);
                    alertMessage("保存失败")
                }
            });
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
            if ($scope.result.CaseTitle == null || $scope.result.CaseTitle == '') {
                alertMessage('请输入Title');
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
            if (NonDestructiveAnalysisList.length == 0 && DestructiveAnalysisList.length == 0) {
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
        function verifyRMA() {
            if (!$scope.isSaveFAR) {
                if ($scope.result.Type == 'RMA') {
                    if ($scope.result.LinkName.indexOf("http:") < 0 && $scope.result.LinkName.indexOf("xml") > 0) {
                        $scope.result.LinkName = '<a class="ms-listlink ms-draggable" target="_blank" href="http://eip.unisoc.com/opsweb/qa/FAR/Failure Analysis Request/' + $scope.result.LinkName + '">' + $scope.result.LinkName + '</a>';
                        return true
                    } else {
                        alertMessage("请输入正确的FAR No.");
                        return false;
                    }
                }
                return true;
            }
            return true;
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
        //初始化更新Ueditor中内容
        var II = 0;
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
        }
        $scope.Inser4LeipiEditor = function () {
            $("#tab3").click();
            $($("#tab-Title-4").parent()).attr("class", "active")
        }
        $scope.Inser5LeipiEditor = function () {
            $("#tab4").click();
            $($("#tab-Title-5").parent()).attr("class", "active")
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
            } else if (value.indexOf("成本/结构分析") >= 0) {
                value = "costStructure";
                return value;
            } else if (value.indexOf("/") >= 0) {
                value = value.split("/").join("");
                return value;
            }
            value = value.split(" ").join("");
            value = value.split("(").join("");
            value = value.split(")").join("")
            return value;
        }
    }); 
