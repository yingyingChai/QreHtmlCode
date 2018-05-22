﻿angular.module("KendoDemos", ["kendo.directives"])
    .controller("MyCtrl", function ($scope, $filter, $http) {
        $scope.result = {
            CaseNumber: null,
            CreatedBy: null,
            CreatorEmail: null,
            Type: null,
            CreatedDate: $filter('date')(new Date(), 'yyyy-MM-dd'),
            Priority: null,
            CaseStatus: null,
            MPN: null,
            ProductLine: null,
            QREOwner: null,
            QREOwnerEmail: null,
            Other: null,
            Dppm: null,
            Customer: null,
            FailuresFound: null,
            LinkName: null,
            ProblemDescription: null,
            StatisticAnalysis: null,
            NonDestructiveAnalysis: null,
            DestructiveAnalysis: null,
            Stage3ContinueAnalysis: "NO",
            Stage3AssiggnTo: null,
            Stage3CompleteDate: null,
            Stage3ReceiveDate: null,
            Stage3Item: null,
            Stage3Summary: null,
            Stage3CRCT: null,
            Stage3Attachment: null,
            Stage4ContinueAnalysis: "Yes",
            Stage4ReceiveDate: null,
            Stage4CompleteDate: null,
            Stage4ItemOne: null,
            Stage4ItemTwo: null,
            Stage4Summary: null,
            Stage4CRCT: null,
            Stage4Attachment: null,
            RootCauseLv1: null,
            RootCauseLv2: null,
            Stage5Summary: null,
            Stage5CRCT: null,
            LotList: [],
            Complexity: 0,
        }
        if (loginName == "") {
            $scope.result.CreatedBy = $(".ms-core-menu-root")[0].innerHTML.split('<')[0];
            var name = $scope.result.CreatedBy.split("(");
            var name0 = name[0].substring(0, name[0].length - 1, );
            var email = name0.replace(' ', '.') + "@unisoc.com";
            $scope.result.CreatorEmail = email;
        } else {
            $scope.result.CreatedBy = loginName;
            $scope.result.CreatorEmail = CreatorEmail;
        }
        //初始化数据
        $http.get("http://10.0.3.52:8060/QREService.svc/GetQRESystemData?")
            .success(function (data) {
                // 数据
                var dataList = JSON.parse(data)
                $scope.MPNList = dataList.MPNs;
                $scope.tempdatas = $scope.MPNList;
                $scope.FailuresFounds = dataList.FailuresFound;
                $scope.Types = dataList.RootCauses;
                $scope.StatisticAnalysis = dataList.StatisticAnalysis;
                $scope.NonDestructiveAnalysis = dataList.NonDestructiveAnalysis;
                $scope.DestructiveAnalysis = dataList.DestructiveAnalysis;
            });
        $scope.Prioritys = ['High', 'Middle', 'Low'];
        $scope.CaseStatus = ['Receive', 'Statistic Analysis', 'Nondestructive Analysis', 'Descructive Analysis', 'Conclusion'];
        /**
         *监控数据变化 针对不同表单
         */
        $scope.$watch('Type', function (value) {
            if (value) {
                $scope.result.Type = value.CaseType;
                if (value.CaseType == "RMA") {
                    $scope.Customer = "Customer";
                    $scope.LinkName = "FAR No.";
                } else {
                    $scope.Customer = "Internal Department";
                    $scope.LinkName = "Yield";
                }
            }

        });
        /**
         * 表中表
         */
        $scope.assignments = {};
        function generateUUID() {
            var d = new Date().getTime();
            var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = (d + Math.random() * 16) % 16 | 0;
                d = Math.floor(d / 16);
                return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
            });
            return uuid;
        };
        $scope.assignments.dataSource = new kendo.data.DataSource({
            schema: {
                model: {
                    id: "id",
                    fields: {
                        id: { editable: false, nullable: true },
                        Number: { type: "string", validation: { required: true } },
                        LotIDOrDateCode: { type: "string", validation: { required: true } },
                        Fab: { type: "string", validation: { required: true } },
                        Assembly: { type: "string", validation: { required: true } },
                        createTime: { editable: false, nullable: true },
                    }
                },
                parse: function (data, options, operation) {
                    if (!data.length && !data.id) {
                        data.id = generateUUID()
                        data.createTime = new Date();
                    }
                    return data;
                }
            },
            sort: {
                field: "createTime",
                dir: "asc"
            },
            pageSize: 5,
        });
        $scope.assignments.columns = [
            {
                field: "Number", title: "No.", width: "120px", sortable: {
                    initialDirection: "desc"
                },
            },
            { field: "LotIDOrDateCode", title: "Lot ID&Date Code", width: "120px" },
            { field: "Fab", title: "Fab", values: FabCode, width: "120px" },
            { field: "Assembly", title: "Assembly", values: AssyCode, width: "120px" },
            { command: [{ name: "edit", text: "修改" }, { name: "destroy", text: "删除" }], title: "&nbsp;", width: "120px" },
        ];
        /**
         * 控制多选json
         */
        var StatisticAnalysisList = []
        $scope.StatisticAnalysisClick = function (z) {
            if (StatisticAnalysisList.indexOf(z) >= 0) {
                StatisticAnalysisList.splice(StatisticAnalysisList.indexOf(z), 1);
            } else {
                StatisticAnalysisList.push(z);
            }
            $scope.result.StatisticAnalysis = JSON.stringify(StatisticAnalysisList);
        }
        var NonDestructiveAnalysisList = [];
        $scope.NonDestructiveAnalysisClick = function (z) {
            if (NonDestructiveAnalysisList.indexOf(z) >= 0) {
                NonDestructiveAnalysisList.splice(NonDestructiveAnalysisList.indexOf(z), 1);
            } else {
                NonDestructiveAnalysisList.push(z);
            }
            $scope.result.NonDestructiveAnalysis = JSON.stringify(NonDestructiveAnalysisList);
        }
        var DestructiveAnalysisList = [];
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
                    $scope.result.QREOwnerEmail = data.Email;
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
        function verigyRMA() {
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
        function alertMessage(message) {
            layer.alert(message, {
                icon: 7,
                skin: 'layer-ext-moon'
            })
        }

        /**
         *提交申请记录
         * @param {any} event
         */
        $scope.saveChanges = function (event) {
            var st = event;
            $scope.LotList = event.sender.options.dataSource.view();
        }
        $scope.save = function () {
            leipiEditor.sync(); //同步内容
            var html = leipiEditor.getContent();
            $scope.result.ProblemDescription = html;
            if (verifyNewCase()) {
                if (verigyRMA()) {
                    $scope.result.LotList = [];
                    $(".k-button.k-button-icontext.k-grid-save-changes").click();
                    $scope.result.LotList = [];
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
                        dIndex.AssemblyData = data.Assembly;
                        $scope.result.LotList.push(dIndex);
                    });
                    var url = "http://localhost:63232/QREService.svc/SaveData?";
                    $.ajax({
                        type: "POST",
                        url: url,
                        contentType: "application/json; charset=utf-8",
                        data: JSON.stringify($scope.result),
                        dataType: "json",
                        success: function (data) {
                            window.location.href = "../SitePages/Home.aspx";
                            //发送邮件 $scope.MpnOwnerEmail
                        },
                        error: function (a, b, c) {
                            alert("保存失败")
                        }
                    });
                }
            }
        }
        // Stage2 ProblemDescription
        var leipiEditor = UE.getEditor('ProblemDescription', {
            toolleipi: false,//是否显示，设计器的 toolbars
            textarea: 'design_content',
            toolbars: [[
                'source', '|', 'undo', 'redo', '|', 'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'removeformat', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', '|', 'fontfamily', 'fontsize', '|', 'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', 'horizontal', '|', 'inserttable', 'deletetable', 'mergecells', 'splittocells', '|',]],
            wordCount: false,
            elementPathEnabled: false,
            initialFrameHeight: 150
        });
    })