angular.module("KendoDemos", ["kendo.directives"])
    .controller("SaveDetailCtrl", function ($scope, $filter, $compile, $http) {
        $http.get("http://localhost:63232/QREService.svc/GetQRESystemData?")
            .success(function (data) {
                // 数据
                var data = JSON.parse(data)
                $scope.MPNList = data.MPNs;
                $scope.tempdatas = $scope.MPNList;
                $scope.FailuresFounds = data.FailuresFound;
                $scope.Types = data.RootCauses;
            });
        $scope.isSaveFAR = true;
        $scope.result = {
            CreatedBy: 'Yingying Chai (柴莹莹)',
            Type: 'RMA',
            CreatedDate: $filter('date')(new Date(), 'yyyy-MM-dd'),
            Priority: '',
            CaseStatus: '',
            MPN: '',
            ProductLine: '',
            QREOwner: 'Yingying Chai (柴莹莹)',
            Other: '',
            DPPM: '',
            customer: '',
            FailuresFound: '',
            LinkName: "<a class=\"ms-listlink ms-draggable\" href=\"http://eip.unisoc.com/opsweb/qa/FAR/Failure Analysis Request/20180503_7834.xml\" target='_blank' >20180503_7834.xmll</a>",
            AssyData: [],
            ProblemDescription: '',
            StatisticAnalysis: '',
            NonDestructiveAnalysis: '',
            DestructiveAnalysis: '',
            NeedStatisticAnalysis: 'Yes',
            Stage3AssiggnTo: '',
            Stage3CompleteDate: '',
            Stage3ReceiveDate: '',
            Stage3Item: '',
            Stage3Summary: '',
            Stage3CRCT: '',
            Stage3ContinueAnalysis: 'Yes',
            //InstallAttachmentStage3: [],
            Stage3Attachment: [],
            Stage4ReceiveDate: '',
            Stage4CompleteDate: '',
            Stage4ItemOne: '',
            Stage4ItemTwo: '',
            Stage4Summary: '',
            Stage4CRCT: '',
            //InstallAttachmentStage4: [],
            Stage4Attachment: [],
            RootCauseLv1: '',
            RootCauseLv2: '',
            Stage5Summary: '',
            Stage5CRCT: ''
        }
        //初始化数据
        //后期需调用接口
        $scope.Prioritys = ['Excursion', 'Near Miss', 'Critical ', 'Major', 'Minor'];
        $scope.CaseStatus = ['Receive', 'Statistic Analysis', 'Nondestructive Analysis', 'Descructive Analysis', 'Conclusion', 'Close'];
        $scope.StatisticAnalysis = ['WAT data', 'CP data', 'FT data', 'Correlation', 'Others(请写在问题描述中）'];
        $scope.NonDestructiveAnalysis = ['IV-Curve', 'X-Ray', '3D X-Ray', 'SAT', 'TDR', 'TLP', 'CFT', 'SLT', 'ATE', 'WAT data', 'CP data', 'FT data', 'Others(请写在问题描述中）'];
        $scope.DestructiveAnalysis = ['De-cap', 'Delayer', 'Cross-Section', 'EMMI', 'InGaAs', 'OBIRCH', 'Thermal EMMI', 'OM', 'SEM', 'TEM', 'FIB', 'Nano-Probe', 'Circuit Repair', 'EDS', 'VI', 'VC', 'AFM', 'AES', '成本分析', '结构分析', 'Others(请写在问题描述中）'];
        $scope.stageItemOne = ["IV - Curve", "X - Ray"];
        $scope.stageItemTwo = ["IV - Curve", "X - Ray"];
        $scope.RootCauseLv1 = [];
        /**
         *监控数据变化 针对不同表单
         */
        $scope.$watch('Type', function (value, oldValue) {
            if (value != oldValue) {
                $scope.result.Type = value.CaseType;
                if (value.CaseType == "RMA") {
                    $scope.customer = "Customer";
                    $scope.LinkName = "FAR No.";
                    $scope.result.LinkName = "";
                    $scope.isSaveFAR = false;
                } else {
                    $scope.customer = "Internal Department";
                    $scope.LinkName = "Yield";
                    $scope.result.LinkName = "";
                    $scope.isSaveFAR = false;
                }
                $scope.RootCauseLv1 = $scope.Type.Levels
            } else {
                if (value) {
                    if (value.CaseType == "RMA") {
                        $scope.customer = "Customer";
                        $scope.LinkName = "FAR No.";
                    } else {
                        $scope.customer = "Internal Department";
                        $scope.LinkName = "Yield";
                    }
                }
            }
        });
        $scope.$watch('RootCauseLv1', function (value, oldValue) {
            if (value != oldValue) {
                $scope.result.RootCauseLv1 = value.Level1;
                $scope.RootCauseLv2 = $scope.RootCauseLv1.Level2
            }
        });

        $scope.IsShowStage4 = true;
        $scope.$watch('result.NeedStatisticAnalysis', function (value) {
            if (value == "Yes") {
                $scope.IsShowStage3 = true;
            } else {
                $scope.IsShowStage3 = false

            }
        });
        $scope.$watch('result.Stage3ContinueAnalysis', function (value) {
            if (value == "Yes") {
                $scope.IsShowStage4 = true
            } else {
                $scope.IsShowStage4 = false
            }
        });
        $.ajax({
            url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/getuserbyid(" + _spPageContextInfo.userId + ")",
            contentType: "application/json;odata=verbose",
            headers: { "accept": "application/json;odata=verbose" },
            success: function (data) {
                var loginName = data.d.Title;
                if (loginName == $scope.result.QREOwner) {
                    console.log(loginName)
                } else if (loginName == "") {
                    $("#wrapper")[0].style.display = "none";
                    alertMessage("登录过期，请刷新页面")
                } else {
                    $("#wrapper")[0].style.display = "none";
                    alertMessage("您无权编辑此订单")
                }
            },
            error: function (data) {
            }
        });
        $("#linkName").html($scope.result.LinkName)

        /**
         *提交申请记录
         * @param {any} event
         */
        $scope.saveChanges = function (event) {
            var st = event;
            $scope.AssyData = event.sender.options.dataSource.view();
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
                        //$scope.result.LinkName = "http://eip.unisoc.com/opsweb/qa/FAR/Failure Analysis Request/" + $scope.result.LinkName;
                        $scope.result.LinkName = '<a class="ms-listlink ms-draggable" target="_blank" href="http://eip.unisoc.com/opsweb/qa/FAR/Failure Analysis Request/' + $scope.result.LinkName + '">' + $scope.result.LinkName + '</a>';
                    }
                }
                $scope.result.AssyData = [];
                $(".k-button.k-button-icontext.k-grid-save-changes").click();
                angular.forEach($scope.AssyData, function (data, index, array) {
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
                    $scope.result.AssyData.push(dIndex);
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
                $scope.result.InstallAttachmentStage3 = [];
                $scope.result.InstallAttachmentStage4 = [];
                //angular.forEach($scope.result.Stage3Attachment, function (data, index, array) {
                //    var FileUrl = "<a href='http://eip.unisoc.com/sites/app/MeetingTracking/ASICONE/JSdocs/" + data + "'>" + data + "</a>" + ';';
                //    $scope.result.InstallAttachmentStage3.push(FileUrl);
                //});
                //angular.forEach($scope.result.Stage4Attachment, function (data, index, array) {
                //    var FileUrl = "<a href='http://eip.unisoc.com/sites/app/MeetingTracking/ASICONE/JSdocs/" + data + "'>" + data + "</a>" + ';';
                //    $scope.result.InstallAttachmentStage4.push(FileUrl);
                //});
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
            //data: wafer,
            schema: {
                model: {
                    id: "id",
                    fields: {
                        id: { editable: false, nullable: true },
                        Number: { type: "string", validation: { required: true } },
                        LotIDOrDateCode: { type: "string", validation: { required: true } },
                        Fab: { type: "string", validation: { required: true } },
                        Assembly: { type: "string", validation: { required: true } }
                    }
                },
                parse: function (data, options, operation) {
                    if (!data.length && !data.id) {
                        data.id = generateUUID()
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
            { field: "Assembly", title: "Assembly", values: AssyCode, width: "120px" },
            { command: [{ name: "edit", text: "修改" }, { name: "destroy", text: "删除" }], title: "&nbsp;", width: "120px" },
        ];
        $scope.assignments.edit = function (e) {
            var editWindow = e.container.data("kendoWindow");
            if (e.model.isNew()) {
                editWindow.title('新增');
            }
            else {
                editWindow.title('编辑');
            }
        }
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
            if ($scope.result.customer == null || $scope.result.customer == '') {
                alertMessage("请输入" + $scope.customer);
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
            fileName = $scope.result.CaseNo + '-' + $scope.result.CreatedBy + new Date().getTime() + file.name;
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