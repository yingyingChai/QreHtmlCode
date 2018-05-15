//var DocumentLibraryName, ItemId, ItemOwner, ItemDate, itemDomId, Msuccess, MerrorMesage,Murl;
//function CreateFile(DomId, LibraryName, Date, Owner, id) {
//    DocumentLibraryName = LibraryName;
//    ItemId = id;
//    ItemOwner = Owner;
//    ItemDate = Date;
//    itemDomId = DomId;
//    if (window.FileReader) {
//        input = document.getElementById(DomId);
//        if (input) {
//            if (input.files.length > 0) {
//                file = input.files[0];
//                fr = new FileReader();
//                fr.onload = receivedBinary;
//                fr.readAsDataURL(file);
//                var UploadFileResult = {
//                    Success: Msuccess,
//                    errorMesage: MerrorMesage,
//                    url: Murl
//                }
//                return UploadFileResult
//            } else {
//                var UploadFileResult = {
//                    Success: false,
//                    errorMesage: "No Have File",
//                    url: ''
//                }
//                return UploadFileResult
//            }
//        } else {
//            var UploadFileResult = {
//                Success: false,
//                errorMesage: "No Have File",
//                url: ''
//            }
//            return UploadFileResult
//        }
//    }
//    else {
//        alertMessage("The HTML5 FileSystem APIs are not fully supported in this browser.");
//        var UploadFileResult = {
//            Success: false,
//            errorMesage: "The HTML5 FileSystem APIs are not fully supported in this browser.",
//            url:''
//        }
//        return UploadFileResult
//    }
//}
//function receivedBinary() {
//    clientContext = new SP.ClientContext.get_current();
//    oWebsite = clientContext.get_web();
//    parentList = oWebsite.get_lists().getByTitle(DocumentLibraryName);
//    fileCreateInfo = new SP.FileCreationInformation();
//    fileCreateInfo.set_url(ItemId + '-' + itemDomId+'-'+ ItemOwner + '-' + ItemDate + '-' + file.name);
//    fileCreateInfo.set_overwrite(true);
//    fileCreateInfo.set_content(new SP.Base64EncodedByteArray());
//    var arr = convertDataURIToBinary(this.result);
//    for (var i = 0; i < arr.length; ++i) {
//        fileCreateInfo.get_content().append(arr[i]);
//    }
//    this.newFile = parentList.get_rootFolder().get_files().add(fileCreateInfo);
//    clientContext.load(this.newFile);
//    clientContext.executeQueryAsync(onSuccess, onFailure);
//}

//function onSuccess() {
//    Msuccess = true;
//    MerrorMesage = "";
//    Murl = "http://eip.unisoc.com/sites/app/MeetingTracking/ASICONE/JSdocs/" + ItemId + '-' + itemDomId + '-' + ItemOwner + '-' + ItemDate + '-' + file.name
//}

//function onFailure() {
//    Msuccess = true;
//    MerrorMesage = "Request failed: " + arguments[1].get_message();
//    Murl = ""
//}
//function convertDataURIToBinary(dataURI) {
//    var BASE64_MARKER = ';base64,';
//    var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
//    var base64 = dataURI.substring(base64Index);
//    var raw = window.atob(base64);
//    var rawLength = raw.length;
//    var array = new Uint8Array(new ArrayBuffer(rawLength));

//    for (i = 0; i < rawLength; i++) {
//        array[i] = raw.charCodeAt(i);
//    }
//    return array;
//}

        /**
         * 表中表
         * 超过高度需回滚页面顶部
         */
        //$(document).ready(function () {
        //    $(".k-grid-add").click(function () {
        //        document.body.scrollTop = document.documentElement.scrollTop = 0;
        //    })
        //})