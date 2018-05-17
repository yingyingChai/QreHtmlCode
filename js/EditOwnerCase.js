angular.module("KendoDemos", ["kendo.directives"])
    .controller("SaveDetailCtrl", function ($scope, $filter, $compile, $http) {
        //初始化数据
        if (selectDepartName == "") {
            getLogin();
        }
        $scope.Prioritys = ['Excursion', 'Near Miss', 'Critical', 'Major', 'Minor'];
        $scope.CaseStatus = ['Receive', 'Statistic Analysis', 'Nondestructive Analysis', 'Descructive Analysis', 'Conclusion', 'Close'];
        var StatisticAnalysisList = [], NonDestructiveAnalysisList = [], DestructiveAnalysisList = [], Stage3Attachment = [], Stage4Attachment = [], Stage3ItemList = [], itemOneList = [], itemTwoList = [];
        $scope.Stage3ReceiveDate = "";
        $scope.assignments = {}; $scope.RootCauseLv1 = [];
        /*
         * 表中表
         **/
        $scope.assignments.dataSource = new kendo.data.DataSource({
            data: LotList,
            schema: {
                model: {
                    id: "ID",
                    fields: {
                        ID: { editable: false, nullable: true },
                        Number: { type: "string", validation: { required: true } },
                        LotIDOrDateCode: { type: "string", validation: { required: true } },
                        Fab: { type: "string", validation: { required: true } },
                        AssemblyData: { type: "string", validation: { required: true } }
                    }
                },
                parse: function (data, options, operation) {
                    if (!data.length && !data.id) {
                        data.ID = generateUUID()
                    }
                    return data;
                }
            },
            pageSize: 5,
        });
        $scope.assignments.columns = [
            { field: "Number", title: "No.", width: "120px" },
            { field: "LotIDOrDateCode", title: "Lot ID&Date Code", width: "120px" },
            { field: "Fab", title: "Fab", values: FabCode, width: "120px" },
            { field: "AssemblyData", title: "Assembly", values: AssyCode, width: "120px" },
            { command: [{ name: "edit", text: "修改" }, { name: "destroy", text: "删除" }], title: "&nbsp;", width: "120px" },
        ];
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
                            AccountName: selectDepartName,
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
                                if (departmentList.indexOf(Department) >= 0 || authorityUserList.indexOf(loginName) >= 0) {
                                    url = "../SitePages/EditCase.aspx?CaseNumber=" + CaseNumber;
                                    window.location.href = url;
                                } else if (loginName == dataList.CreatedBy) {
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
                            Complexity: dataList.Complexity
                        }
                        $("#Stage3Summary").html($scope.result.Stage3Summary);
                        $("#Stage4Summary").html($scope.result.Stage4Summary);
                        $("#Stage5Summary").html($scope.result.Stage5Summary);
                        //判断选择的Type
                        if ($scope.result.Type) {
                            angular.forEach($scope.Types, function (data, index, array) {
                                if (data.CaseType == $scope.result.Type) {
                                    $scope.Type = data;
                                    $scope.RootCauseLv1 = data.Levels;
                                }
                            });
                        }
                        if ($scope.result.RootCauseLv1 != "" || $scope.result.RootCauseLv2 != "") {
                            $("#Type")[0].disabled = true;
                        }
                        $scope.MPN = $scope.result.MPN;
                        //第一次进入页面如果为FAR,显示链接
                        if ($scope.isSaveFAR) {
                            $("#linkName").html($scope.result.LinkName)
                        }
                        /*
                         * 初始化页面选择多选按钮 
                         **/
                        if (dataList.StatisticAnalysis != "") {
                            StatisticAnalysisList = JSON.parse(dataList.StatisticAnalysis);
                            SelectMulity(StatisticAnalysisList, 11);
                        }
                        if (dataList.NonDestructiveAnalysis != "") {
                            NonDestructiveAnalysisList = JSON.parse(dataList.NonDestructiveAnalysis);
                            SelectMulity(NonDestructiveAnalysisList, 12);
                        }
                        if (dataList.DestructiveAnalysis != "") {
                            DestructiveAnalysisList = JSON.parse(dataList.DestructiveAnalysis);
                            SelectMulity(DestructiveAnalysisList, 13);
                        }
                        if (dataList.Stage3Item != "") {
                            Stage3ItemList = JSON.parse(dataList.Stage3Item);
                            SelectMulity(Stage3ItemList, 3);
                        }
                        if (dataList.Stage4ItemOne != "") {
                            itemOneList = JSON.parse(dataList.Stage4ItemOne);
                            SelectMulity(itemOneList, 41);
                        }
                        if (dataList.Stage4ItemTwo != "") {
                            itemTwoList = JSON.parse(dataList.Stage4ItemTwo);
                            SelectMulity(itemTwoList, 42);
                        }
                        /*
                         * 初始化页面显示附件链接
                         * **/

                        if (dataList.Stage3ContinueAnalysis == "Yes") {
                            $scope.IsShowStage3
                            if (dataList.Stage3Attachment != "") {
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
                        }
                        if (dataList.Stage4ContinueAnalysis == "Yes") {
                            $scope.IsShowStage4 = true;
                            if (dataList.Stage4Attachment != "") {
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
                        }
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
        /*
         * 动态获取RootCauseLv1 和 RootCaseLv2
         **/
        $scope.$watch('RootCauseLv1Select', function (value, oldValue) {
            if (value != oldValue) {
                $scope.result.RootCauseLv1 = value.Level1;
                $scope.RootCauseLv2 = value.Level2
            } else {
                if ($scope.result)
                    $scope.result.RootCauseLv1 = '';
                $scope.RootCauseLv2 = ['Level2'];
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
            if (verifyNewCase()) {
                if ($scope.result.Type == 'RMA') {
                    if ($scope.result.LinkName.indexOf("http:") < 0) {
                        $scope.result.LinkName = '<a class="ms-listlink ms-draggable" target="_blank" href="http://eip.unisoc.com/opsweb/qa/FAR/Failure Analysis Request/' + $scope.result.LinkName + '">' + $scope.result.LinkName + '</a>';
                    }
                }
                $scope.result.LotList = [];
                $(".k-button.k-button-icontext.k-grid-save-changes").click();
                angular.forEach($scope.LotList, function (data, index, array) {
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
                        window.location.href = "../SitePages/Home.aspx";
                        //发送邮件
                    },
                    error: function (a, b, c) {
                        alert("保存失败")
                    }
                });
            }
        }
        $scope.SaveDetail = function () {
            if (GetC5Date()) {
                $scope.save();
            }
        }
        function GetC5Date() {
            if ($scope.result.CaseStatus == "Close") {
                GetComplexityScore();
                if ($scope.result.RootCauseLv1 && $scope.result.RootCauseLv2) {
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
                    alertMessage("若要关闭case,请选择level1 和 level2");
                    return false;
                }
            } else {
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
            initialFrameHeight: 150
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
            if ($scope.result.Priority == "Excursion" || $scope.result.Priority == "Near Miss") {
                stage1Score = 3;
            } else if ($scope.result.Priority == "Critical") {
                stage1Score = 2;
            } else if ($scope.result.Priority == "Major" || $scope.result.Priority == "Minor") {
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
