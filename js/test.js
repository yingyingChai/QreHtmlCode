angular.module("KendoDemos", ["kendo.directives"])
    .controller("SaveDetailCtrl", function ($scope, $filter, $compile, $http) {
        //初始化数据
        $scope.Prioritys = ['Excursion', 'Near Miss', 'Critical ', 'Major', 'Minor'];
        $scope.CaseStatus = ['Receive', 'Statistic Analysis', 'Nondestructive Analysis', 'Descructive Analysis', 'Conclusion', 'Close'];
        //获取CaseNumber
        function getQueryString(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]);
            return null;
        }
        var CaseNumber = getQueryString("CaseNumber");
        $scope.LotList = [];
        //$scope.assignments = {};
        //$scope.assignments.dataSource = new kendo.data.DataSource({
        //    data: $scope.LotList,
        //    schema: {
        //        model: {
        //            id: "ID",
        //            fields: {
        //                ID: { editable: false, nullable: true },
        //                Number: { type: "string", validation: { required: true } },
        //                LotIDOrDateCode: { type: "string", validation: { required: true } },
        //                Fab: { type: "string", validation: { required: true } },
        //                AssemblyData: { type: "string", validation: { required: true } }
        //            }
        //        },
        //        parse: function (data, options, operation) {
        //            if (!data.length && !data.id) {
        //                data.id = generateUUID()
        //            }
        //            return data;
        //        }
        //    },
        //    pageSize: 5,
        //});
        //$scope.assignments.columns = [
        //    { field: "Number", title: "No.", width: "120px" },
        //    { field: "LotIDOrDateCode", title: "Lot ID&Date Code", width: "120px" },
        //    { field: "Fab", title: "Fab", values: FabCode, width: "120px" },
        //    { field: "AssemblyData", title: "Assembly", values: AssyCode, width: "120px" },
        //    { command: [{ name: "edit", text: "修改" }, { name: "destroy", text: "删除" }], title: "&nbsp;", width: "120px" },
        //];
        //$scope.assignments.edit = function (e) {
        //    var editWindow = e.container.data("kendoWindow");
        //    if (e.model.isNew()) {
        //        editWindow.title('新增');
        //    }
        //    else {
        //        editWindow.title('编辑');
        //    }
        //}
        //$scope.assignments.pageable = {
        //    refresh: true,
        //}
        //获取数据
        var gridColumns =
            [
                { field: "Number", title: "No.", width: "120px" },
                { field: "LotIDOrDateCode", title: "Lot ID&Date Code", width: "120px" },
                { field: "Fab", title: "Fab", values: FabCode, width: "120px" },
                { field: "AssemblyData", title: "Assembly", values: AssyCode, width: "120px" },
                { command: [{ name: "edit", text: "修改" }, { name: "destroy", text: "删除" }], title: "&nbsp;", width: "120px" },
            ];
        var grid;
        $.getJSON("http://10.0.3.52:8060/QREService.svc/GetQRECaseInfoByCaseNumber?", { caseNumber: CaseNumber },
            function (data) {
                var dataList = JSON.parse(data);
                $scope.result = {
                    CaseNumber: dataList.CaseNumber,
                    CreatedBy: dataList.CreatedBy,
                    Type: dataList.Type,
                    CreatedDate: dataList.CreatedDate,
                    Priority: dataList.Priority,
                    CaseStatus: dataList.CaseStatus,
                    MPN: dataList.MPN,
                    ProductLine: dataList.ProductLine,
                    QREOwner: dataList.QREOwner,
                    Other: dataList.Other,
                    DPPM: dataList.Dppm,
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
                    Stage5CRCT: dataList.Stage5CRCT
                }
                if ($scope.IsShowStage3) {
                    angular.forEach($scope.result.Stage3Attachment, function (data, index, array) {
                        var id = data.split('.')[0];
                        var fileName = "<a target='_blank' href='http://eip.unisoc.com/opsweb/qa/QRE/Shared%20Documents/" + data + "'>" + data + "</a>";
                        var $htmlButton = $compile('<li id=\'' + id + '\' class="liStyle">' + fileName + '<button id="close" type="button" class="close buttonStyle" data-dismiss="alert" ng-click="deleteFile(\'Stage3\',\'' + data + '\',' + id + ')">×</button></li>')($scope);
                        $("#InstallAttachmentStage3").append($htmlButton)
                    });
                }
                if ($scope.IsShowStage4) {
                    angular.forEach($scope.result.Stage4Attachment, function (data, index, array) {
                        var id = data.split('.')[0];
                        var fileName = "<a target='_blank' href='http://eip.unisoc.com/opsweb/qa/QRE/Shared%20Documents/" + data + "'>" + data + "</a>";
                        var $htmlButton = $compile('<li id=\'' + id + '\' class="liStyle">' + fileName + '<button id="close" type="button" class="close buttonStyle" data-dismiss="alert" ng-click="deleteFile(\'Stage3\',\'' + data + '\',' + id + ')">×</button></li>')($scope);
                        $("#InstallAttachmentStage3").append($htmlButton)
                    });
                }
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
                        if ($scope.result.Type) {
                            angular.forEach($scope.Types, function (data, index, array) {
                                if (data.CaseType == $scope.result.Type) {
                                    $scope.Type = data;
                                }
                            });
                        }
                        $scope.MPN = $scope.result.MPN;
                    });


            });

        //$(function () {
        //    $scope.LotList.push([]);
        //})
        $scope.RootCauseLv1 = [];
        /**
         *监控数据变化 针对不同表单
         */
        $scope.isSaveFAR = true;
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
                }
            }
        });
        //if($scope.isSaveFAR) {
        //    $("#linkName").html($scope.result.LinkName)
        //}
        $scope.$watch('RootCauseLv1Select', function (value, oldValue) {
            if (value != oldValue) {
                $scope.result.RootCauseLv1 = value.Level1;
                $scope.RootCauseLv2 = $scope.RootCauseLv1.Level2
            }
        });

        $scope.IsShowStage4 = true;
        $scope.$watch('result.Stage3ContinueAnalysis', function (value) {
            if (value == "Yes") {
                $scope.IsShowStage3 = true;
                $("#showStage3Summary")[0].style.display = "";
            } else {
                $scope.IsShowStage3 = false
                $("#showStage3Summary")[0].style.display = "none";
            }
        });
        $scope.$watch('result.Stage4ContinueAnalysis', function (value) {
            if (value == "Yes") {
                $scope.IsShowStage4 = true;
                $("#stage4ShowSummary")[0].style.display = "";
            } else {
                $scope.IsShowStage4 = false;
                $("#stage4ShowSummary")[0].style.display = "none";
            }
        });
        //$.ajax({
        //    url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/getuserbyid(" + _spPageContextInfo.userId + ")",
        //    contentType: "application/json;odata=verbose",
        //    headers: { "accept": "application/json;odata=verbose" },
        //    success: function (data) {
        //        var loginName = data.d.Title;
        //        if (loginName == $scope.result.QREOwner) {
        //            console.log(loginName)
        //        } else if (loginName == "") {
        //            $("#wrapper")[0].style.display = "none";
        //            alertMessage("登录过期，请刷新页面")
        //        } else {
        //            $("#wrapper")[0].style.display = "none";
        //            alertMessage("您无权编辑此订单")
        //        }
        //    },
        //    error: function (data) {
        //    }
        //});
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
            leipiEditor.sync(); //同步内容
            var html = leipiEditor.getContent();
            $scope.result.ProblemDescription = html;
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
                        'id': '',
                        'NumberNo': '',
                        'LotIDOrDateCode': '',
                        'Fab': '',
                        'Assembly': '',
                    }
                    if (typeof data.id == "string") {
                        dIndex.id = '0';
                    } else {
                        dIndex.id = data.id;
                    }
                    dIndex.Number = data.Number;
                    dIndex.LotIDOrDateCode = data.LotIDOrDateCode;
                    dIndex.Fab = data.Fab;
                    dIndex.Assembly = data.Assembly;
                    $scope.result.LotList.push(dIndex);
                });
                console.log(JSON.stringify($scope.result))
                //jsonp 传递$scope.result
            } else {
            }
        }
        $scope.SaveDetail = function () {
            if (GetC3Date() && GetC4Date() && GetC5Date()) {
                $scope.save();
                leipiEditorStage3Summary.sync(); //同步内容
                var htmlStage3 = leipiEditorStage3Summary.getContent();
                $scope.result.Stage3Summary = htmlStage3;
                leipiEditorStage4Summary.sync(); //同步内容
                var htmlStage4 = leipiEditorStage4Summary.getContent();
                $scope.result.Stage4Summary = htmlStage4;
                leipiEditorStage5Summary.sync();
                var htmlStage5 = leipiEditorStage5Summary.getContent();
                $scope.result.Stage5Summary = htmlStage5;
                console.log(JSON.stringify($scope.result))
            } else {

            }

        }
        function GetC3Date() {
            if ($scope.IsShowStage3) {
                if ($scope.result.Stage3CompleteDate != '' && $scope.result.Stage3ReceiveDate != '') {
                    var days = $scope.result.Stage3ReceiveDate.getTime() - $scope.result.Stage3CompleteDate.getTime();
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
            }
        }
        function GetC4Date() {
            if ($scope.IsShowStage4) {
                if ($scope.result.Stage4CompleteDate != '' && $scope.result.Stage4ReceiveDate != '') {
                    var days = $scope.result.Stage4ReceiveDate.getTime() - $scope.result.Stage4CompleteDate.getTime();
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
            }
        }
        function GetC5Date() {
            if ($scope.result.CaseStatus == "Close") {
                if ($scope.result.RootCauseLv1 != '' && $scope.result.RootCauseLv2 != '') {
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
        var StatisticAnalysisList = []
        $scope.StatisticAnalysisClick = function (z) {
            if (StatisticAnalysisList.indexOf(z) >= 0) {
                StatisticAnalysisList.splice(StatisticAnalysisList.indexOf(z), 1);
            } else {
                StatisticAnalysisList.push(z);
            }
            $scope.result.StatisticAnalysis = StatisticAnalysisList;
        }
        var NonDestructiveAnalysisList = [];
        $scope.NonDestructiveAnalysisClick = function (z) {
            if (NonDestructiveAnalysisList.indexOf(z) >= 0) {
                NonDestructiveAnalysisList.splice(NonDestructiveAnalysisList.indexOf(z), 1);
            } else {
                NonDestructiveAnalysisList.push(z);
            }
            $scope.result.NonDestructiveAnalysis = NonDestructiveAnalysisList;
        }
        var DestructiveAnalysisList = [];
        $scope.DestructiveAnalysisClick = function (z) {
            if (DestructiveAnalysisList.indexOf(z) >= 0) {
                DestructiveAnalysisList.splice(DestructiveAnalysisList.indexOf(z), 1);
            } else {
                DestructiveAnalysisList.push(z);
            }
            $scope.result.DestructiveAnalysis = DestructiveAnalysisList;

        }
        var Stage3ItemList = [];
        $scope.Stage3ItemClick = function (z) {
            if (Stage3ItemList.indexOf(z) >= 0) {
                Stage3ItemList.splice(Stage3ItemList.indexOf(z), 1);
            } else {
                Stage3ItemList.push(z);
            }
            $scope.result.Stage3Item = Stage3ItemList;
        }
        var itemOneList = [];
        $scope.itemOneClick = function (z) {
            if (itemOneList.indexOf(z) >= 0) {
                itemOneList.splice(itemOneList.indexOf(z), 1);
            } else {
                itemOneList.push(z);
            }
            $scope.result.Stage4ItemOne = itemOneList;
        }
        var itemTwoList = [];
        $scope.itemTwoClick = function (z) {
            if (itemTwoList.indexOf(z) >= 0) {
                itemTwoList.splice(itemTwoList.indexOf(z), 1);
            } else {
                itemTwoList.push(z);
            }
            $scope.result.Stage4ItemTwo = itemTwoList;
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
            if ($scope.result.DPPM == null || $scope.result.DPPM == '') {
                alertMessage("请输入DPPM");
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
            initialFrameHeight: 300
        });
        var leipiEditorStage3Summary = UE.getEditor('Stage3Summary', {
            toolleipi: true,//是否显示，设计器的 toolbars
            textarea: 'design_content',
            toolbars: [[
                'source', '|', 'undo', 'redo', '|', 'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'removeformat', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', '|', 'fontfamily', 'fontsize', '|', 'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', 'horizontal', '|', 'inserttable', 'deletetable', 'mergecells', 'splittocells', '|',]],
            wordCount: false,
            elementPathEnabled: false,
            initialFrameHeight: 300
        });
        var leipiEditorStage4Summary = UE.getEditor('Stage4Summary', {
            toolleipi: true,//是否显示，设计器的 toolbars
            textarea: 'design_content',
            toolbars: [[
                'source', '|', 'undo', 'redo', '|', 'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'removeformat', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', '|', 'fontfamily', 'fontsize', '|', 'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', 'horizontal', '|', 'inserttable', 'deletetable', 'mergecells', 'splittocells', '|',]],
            wordCount: false,
            elementPathEnabled: false,
            initialFrameHeight: 300
        });
        var leipiEditorStage5Summary = UE.getEditor('Stag5Summary', {
            toolleipi: true,//是否显示，设计器的 toolbars
            textarea: 'design_content',
            toolbars: [[
                'source', '|', 'undo', 'redo', '|', 'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'removeformat', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', '|', 'fontfamily', 'fontsize', '|', 'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', 'horizontal', '|', 'inserttable', 'deletetable', 'mergecells', 'splittocells', '|',]],
            wordCount: false,
            elementPathEnabled: false,
            initialFrameHeight: 300
        });
        //Upload File
        var StageType = '', DocumentLibraryName = '', fileName = '';
        $scope.upload = function (el, id, type, DocumentLibrary) {
            DocumentLibraryName = DocumentLibrary;
            StageType = type;
            file = el.files[0];
            fr = new FileReader();
            fr.onload = receivedBinary;
            fr.readAsDataURL(file);
        };
        function receivedBinary() {
            clientContext = new SP.ClientContext.get_current();
            oWebsite = clientContext.get_web();
            parentList = oWebsite.get_lists().getByTitle(DocumentLibraryName);
            fileCreateInfo = new SP.FileCreationInformation();
            var fileType = file.name.split('.')[1];
            fileName = $scope.result.CaseNumber + '-' + $scope.result.CreatedBy + new Date().getTime() + '.' + fileType;
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
                $scope.result.Stage3Attachment.push(fileName);
                var id = new Date().getTime();
                var $htmlButton = $compile('<li id=\'' + id + '\' class="liStyle">' + fileName + '<button id="close" type="button" class="close buttonStyle" data-dismiss="alert" ng-click="deleteFile(\'Stage3\',\'' + fileName + '\',' + id + ')">×</button></li>')($scope);
                $("#InstallAttachmentStage3").append($htmlButton)
            } else {
                $scope.result.Stage4Attachment.push(fileName);
                var id = new Date().getTime();
                var $htmlButton = $compile('<li id=\'' + id + '\' class="liStyle">' + fileName + '<button id="close" type="button" class="close buttonStyle" data-dismiss="alert" ng-click="deleteFile(\'Stage4\',\'' + fileName + '\',' + id + ')">×</button></li>')($scope);
                $("#InstallAttachmentStage4").append($htmlButton)
            }
        }
        function onFailure() {
            alertMessage("文件上传失败")
        }

        $scope.deleteFile = function (type, name, id) {
            if (type == "Stage3") {
                if ($scope.result.Stage3Attachment.indexOf(name) >= 0) {
                    $scope.result.Stage3Attachment.splice($scope.result.Stage3Attachment.indexOf(name), 1);
                    if ($('#' + id).length > 0) {
                        $('#' + id)[0].style.display = 'none';
                    }
                }
            } else {
                if ($scope.result.Stage4Attachment.indexOf(name) >= 0) {
                    $scope.result.Stage4Attachment.splice($scope.result.Stage4Attachment.indexOf(name), 1);
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
    })
