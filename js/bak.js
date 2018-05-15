        /**
         * 获取sharepoint当前登录用户名及用户组
         */
        //var clientContext = new SP.ClientContext.get_current();
        //var oWeb = clientContext.get_web();
        //var User = oWeb.get_currentUser();
        //var allGroups = User.get_groups();
        //clientContext.load(allGroups);
        //clientContext.executeQueryAsync(OnSuccess, OnFailure);
        //function OnSuccess(sender, args) {
        //    var grpsEnumerator = allGroups.getEnumerator();
        //    while (grpsEnumerator.moveNext()) {
        //        var group = grpsEnumerator.get_current();
        //        $scope.result.stage1.groups.push(group.get_title());
        //    }
        //}
        //function OnFailure(sender, args) {
        //    console.log(args.get_message());
        //}