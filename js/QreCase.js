angular.module("KendoDemos", ["kendo.directives"])
    .controller("MyCtrl", function ($scope, $filter, $http) {
        /**
         * 初始化$scope.result 对象，stage3 ，stage4 没有值默认为null
         */
        if (IEVersion() != -1) {
            alertMessage("IE 浏览器存在兼容性问题，请用chrome 浏览器打开！")
        }
        var user = getUser();
        $scope.result = {
            CaseNumber: null,
            CaseTitle: null,
            CreatedBy: user.loginName,
            CreatorEmail: user.CreatorEmail,
            Department: getDepartment(user.selectDepartName),
            CaseTitle:"",
            Type: null,
            CreatedDate: $filter('date')(new Date(), 'yyyy-MM-dd'),
            Priority: null,
            CaseStatus: 'Receive',
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
            Lab:null,
            Stage4Summary: null,
            Stage4CRCT: null,
            Stage4Attachment: null,
            RootCauseLv1: null,
            RootCauseLv2: null,
            Stage5Summary: null,
            Stage5CRCT: 1,
            LotList: [],
            Complexity: 0,
            CurrentUser: user.loginName
        }
        //初始化数据
        $http.get("http://10.0.3.52:8060/QREService.svc/GetQRESystemData?")
            .success(function (data) {
                var dataList = JSON.parse(data)
                $scope.MPNList = dataList.MPNs;
                $scope.tempdatas = $scope.MPNList;
                $scope.FailuresFounds = dataList.FailuresFound;
                $scope.Types = dataList.RootCauses;
                $scope.StatisticAnalysis = dataList.StatisticAnalysis;
                $scope.NonDestructiveAnalysis = dataList.NonDestructiveAnalysis;
                $scope.DestructiveAnalysis = dataList.DestructiveAnalysis;
            });
        $scope.Prioritys = Prioritys;
        /**
         *监控数据变化 针对不同表单
         * Type 更改，对应字段名称修改
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
         * LotList 唯一Id,若不纯在Id，修改功能失效
         */
        var AssyCode = [], FabCode = [], LotList = [];
        var AssyCodeXml = "", FabCodeXml = "",length = 0;
        $http.get("http://eip.unisoc.com/opsweb/QA/FAR/_api/web/lists/getByTitle('Assy%20Code')/items?$select=Title&$orderby=Created%20desc&$Top=99999999")
            .success(function (AssyCodeXmlData) {
                AssyCodeXml = AssyCodeXmlData;
                $http.get("http://eip.unisoc.com/opsweb/QA/FAR/_api/web/lists/getByTitle('Fab%20Code')/items?$select=Title&$orderby=Created%20desc&$Top=99999999")
                    .success(function (FabCodeXmlData) {
                        FabCodeXml = FabCodeXmlData;
                        AssyCode = getValue(AssyCodeXml, 'AssyCode');
                        FabCode = getValue(FabCodeXml, 'FabCode');
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
                                //pageSizes: true,
                                //buttonCount: 5
                            },
                            toolbar: ["create"],
                            columns: [{ field: "Number", title: "No.", width: "120px" },
                            { field: "LotIDOrDateCode", title: "Lot ID&Date Code", width: "120px" },
                            { field: "Fab", title: "Fab", values: FabCode, width: "120px" },
                            { field: "AssemblyData", title: "Assembly", values: AssyCode, width: "120px" },
                            { command: [{ name: "edit", text: "修改" }, { name: "Delete", text: "删除", click: Delete }], title: "&nbsp;", width: "120px" }],
                            editable: "popup"
                        });
                    });
            });
        /**
         * 控制多选json
         */
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
            if ($scope.result.MPN == null || $scope.result.MPN == '') {
                alertMessage("请选择Product");
                return false;
            }
            if ($scope.result.Dppm == null || $scope.result.Dppm == '') {
                alertMessage("请输入Dppm");
                return false;
            }
            if ($scope.result.Type == "RMA") {
                if ($scope.result.Customer == null || $scope.result.Customer == '') {
                    alertMessage("请输入" + $scope.Customer);
                    return false;
                }
            }
            if ($scope.result.FailuresFound == null || $scope.result.FailuresFound == '') {
                alertMessage("请输入Issue From");
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
        function verifyRMA() {
            if ($scope.result.Type == 'RMA') {
                if ($scope.result.LinkName.indexOf("http:") >= 0) {
                    alertMessage("请输入正确的FAR No.");
                    return false;
                } else {
                    if ($scope.result.LinkName.indexOf("xml") > 0) {
                        $scope.result.LinkName = '<a class="ms-listlink ms-draggable" target="_blank" href="http://eip.unisoc.com/opsweb/qa/FAR/Failure Analysis Request/' + $scope.result.LinkName + '">' + $scope.result.LinkName + '</a>';
                        return true
                    } else {
                        $scope.result.LinkName = '<a class="ms-listlink ms-draggable" target="_blank" href="http://eip.unisoc.com/opsweb/qa/FAR/Failure Analysis Request/' + $scope.result.LinkName + '.xml">' + $scope.result.LinkName + '</a>';
                        return true
                    }
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
        $scope.save = function () {
            var index = layer.load(1, {
                shade: [0.1, '#fff'] //0.1透明度的白色背景
            });
            leipiEditor.sync(); //同步内容
            var html = leipiEditor.getContent();
            $scope.result.ProblemDescription = html;
            if (verifyNewCase()) {
                if (verifyRMA()) {
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
                        },
                        error: function (a, b, c) {
                            layer.close(index);
                            alertMessage("保存失败")
                        }
                    });
                } else {
                    layer.close(index);
                }
            } else {
                layer.close(index);
            }
        }
        var leipiEditor = UE.getEditor('ProblemDescription', {
            toolleipi: false,//是否显示，设计器的 toolbars
            textarea: 'design_content',
            toolbars: [[
                'source', '|', 'undo', 'redo', '|', 'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'removeformat', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', '|', 'fontfamily', 'fontsize', '|', 'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', 'horizontal', '|', 'inserttable', 'deletetable', 'mergecells', 'splittocells', '|',]],
            wordCount: false,
            elementPathEnabled: false,
            initialFrameHeight: 80
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