/**
 * Copyright (C) 2009 eXo Platform SAS.
 * 
 * This is free software; you can redistribute it and/or modify it under the
 * terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 * 
 * This software is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 * 
 * You should have received a copy of the GNU Lesser General Public License
 * along with this software; if not, write to the Free Software Foundation,
 * along with this software; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA, or see the FSF
 * site: http://www.fsf.org.
 */

if(!eXo.commons) eXo.commons = {};

function UIDSUpload() {
  this.listUpload = new Array();
  this.isAutoUpload = true;
 
  // this.listLimitMB = new Array();
};
/**
 * Initialize upload and create a upload request to server
 * 
 * @param {String}
 *          uploadId identifier upload
 * @param {boolean}
 *          isAutoUpload auto upload or none
 */
UIDSUpload.prototype.initUploadEntry = function(uploadId, isAutoUpload) {  
  UIDSUpload.isAutoUpload = isAutoUpload;
  this.restContext = eXo.env.portal.context+ "/" + eXo.env.portal.rest+ "/managedocument/uploadFile" ;
  this.createUploadEntry(uploadId, isAutoUpload);
};


UIDSUpload.prototype.createUploadEntry = function(uploadId, isAutoUpload) {
  var me = eXo.commons.UIDSUpload;
  var iframe = document.getElementById(uploadId+'uploadFrame');
  var idoc = iframe.contentWindow.document ;
  if (eXo.core.Browser.gecko) {
    idoc.open();
    idoc.close();
    me.createUploadEntryForFF(idoc, uploadId, isAutoUpload);
    return;
  }
  var uploadAction = me.restContext + "/upload?" ;
  uploadAction += "uploadId=" + uploadId ;
  
  var uploadHTML = "";
  uploadHTML += "<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Strict//EN' 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd'>";
  uploadHTML += "<html xmlns='http://www.w3.org/1999/xhtml' xml:lang='en' lang='" +eXo.core.I18n.lang+ "' dir='" +eXo.core.I18n.dir+ "'>";
  uploadHTML += "<head>";
  uploadHTML += "<style type='text/css'>";
  uploadHTML += this.getStyleSheetContent();
  uploadHTML += "</style>";
  uploadHTML += "<script type='text/javascript'>var eXo = parent.eXo</script>";
  uploadHTML += "</head>";
  uploadHTML += "<body style='margin: 0px; border: 0px;'>";
  uploadHTML += this.getUploadContent(uploadId, uploadAction, isAutoUpload);
  uploadHTML += "</body>";
  uploadHTML += "</html>";

  if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
    // workaround for Chrome
    // When submit in iframe with Chrome, the iframe.contentWindow.document
    // seems not be reconstructed correctly
    idoc.open();
    idoc.close();
    idoc.documentElement.innerHTML = uploadHTML;      
  } else {
    idoc.open();
    idoc.write(uploadHTML);
    idoc.close();
  }
};

UIDSUpload.prototype.createUploadEntryForFF = function(idoc, uploadId, isAutoUpload){
  var uploadAction = eXo.env.server.context + "/upload?" ;
  uploadAction += "uploadId=" + uploadId+"&action=upload" ; 
    
  var newDoctype = document.implementation.createDocumentType('html','-//W3C//DTD XHTML 1.0 Transitional//EN','http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd'); 
  if (idoc.doctype) {
    idoc.replaceChild(newDoctype, idoc.doctype);
  }
  idoc.lang = eXo.core.I18n.lang;
  idoc.xmlns = 'http://www.w3.org/1999/xhtml';
  idoc.dir = eXo.core.I18n.dir;
   
  idoc.head = idoc.head || idoc.getElementsByTagName('head')[0];
  var script = document.createElement('script');
  script.type = "text/javascript";
  script.text = "var eXo = parent.eXo";
  idoc.head = idoc.head || idoc.getElementsByTagName('head')[0];
  idoc.head.appendChild(script);

  var style = document.createElement('style');
  style.type = "text/css"; 
  var styleText = this.getStyleSheetContent();
  var cssText = document.createTextNode(styleText);
  style.appendChild(cssText);
  idoc.head.appendChild(style);
  
  idoc.body.innerHTML= this.getUploadContent(uploadId, uploadAction, isAutoUpload);
}

UIDSUpload.prototype.getUploadContent = function(uploadId, uploadAction, isAutoUpload) {
  var container = parent.document.getElementById(uploadId);
  var uploadIframe = eXo.core.DOMUtil.findDescendantById(container, uploadId + "UploadIframe");
  var uploadText = uploadIframe.title;
  
  var uploadHTML = "";  
  uploadHTML += "  <form id='"+uploadId+"' class='UIDSUploadForm' style='margin: 0px; padding: 0px' action='"+uploadAction+"' enctype='multipart/form-data' method='post'>";
  uploadHTML += "    <div class='BrowseDiv'>";
  uploadHTML += "      <a class='BrowseLink'>";
  uploadHTML += "        <input type='file' name='file' size='1' id='file' class='FileHidden' value='' onchange='parent.eXo.commons.UIDSUpload.upload(this, " + uploadId + ")'/>";
  uploadHTML += "     &nbsp;</a>";
  uploadHTML += "    </div>";
  uploadHTML += "  </form>";
  return uploadHTML;
}

UIDSUpload.prototype.getStyleSheetContent = function(){
  var styleText = "";
  styleText += "body { margin:0; padding:0}";
  styleText += ".UIDSUploadForm {position: relative; }";
  styleText += ".FileHidden { opacity: 0; overflow: hidden; position: absolute; height: 32px; top: 0px; left: 0px; width: 100%; -moz-opacity:0 ; filter:alpha(opacity: 0); z-index: 1;} ";  
  styleText += ".BrowseLink { position: relative; font-family: Arial, Helvetica, sans-serif; text-align: left; top:5px;padding: 3px 10px 3px 11px;";
  styleText += "     text-decoration: none;";
  styleText += "    background: url('/ecmexplorer/skin/icons/24x24/DefaultSkin/UploadFile.png') no-repeat 2px center;}";
  styleText += ".UIDSUploadForm a:hover {text-decoration: underline;}";
  return styleText;
}

/**
 * Refresh progress bar to update state of upload progress
 * 
 * @param {String}
 *          elementId identifier of upload bar frame
 */
UIDSUpload.prototype.refeshProgress = function(elementId) {
  var me = eXo.commons.UIDSUpload;
  var documentSelector = eXo.commons.DocumentSelector;
  var list =  me.listUpload;
  var selectedItem = documentSelector.selectedItem;
  if(!selectedItem) return;
  if(list.length < 1) return;
  var currentFolder = selectedItem.currentFolder;
  if (!currentFolder) currentFolder ='';
  var url = me.restContext + "/control?" ;  
  url += "action=progress" + "&workspaceName=" + selectedItem.workspaceName
  + "&driveName=" + selectedItem.driveName + "&currentFolder="
  + currentFolder + "&currentPortal=" + eXo.env.portal.portalName + "&language="
  + eXo.env.portal.language +"&uploadId=" + elementId;  
  var data = null; 
  if(list.length > 0) {
    var data = documentSelector.request(url);
    setTimeout("eXo.commons.UIDSUpload.refeshProgress('" + elementId + "');", 1000); 
  } 
  else {
  return;
  }
    var container = parent.document.getElementById(elementId);
    if (!data) {
      this.abortUpload(elementId);
      var message = eXo.core.DOMUtil.findFirstChildByClass(container, "div", "LimitMessage").innerHTML ;
      alert(message.replace("{0}", response.upload[id].size)) ;
      return;
    } else {
    var element = document.getElementById(elementId+"ProgressIframe");
    var nodeList = data.getElementsByTagName("UploadProgress");
    if(!nodeList) return;
    var oProgress;
    if(nodeList.length > 0) oProgress = nodeList[0];
    var percent = oProgress.getAttribute("percent");
    var fileName = oProgress.getAttribute("fileName");
    var progressBarLabel = eXo.core.DOMUtil.findFirstDescendantByClass(container, "div", "ProgressBarLabel") ;
    progressBarLabel.innerHTML = percent + "%" ;
    
    if(percent == 100) {
      me.listUpload.remove(elementId);
      if (!fileName || fileName=="") {
        alert(container.getAttribute("upload_failed"));
      }
      me.saveUploaded(elementId, fileName);
      documentSelector.renderDetails(selectedItem);
      documentSelector.selectUploadedFile(fileName);
      var refreshUpload = eXo.core.DOMUtil.findFirstDescendantByClass(container, "a", "RefreshUpload") ; 
      if (refreshUpload){
        eval(refreshUpload.href);
      }      
    }
   }
};

/**
 * Send request to save uploaded file
 * 
 * @param {String}
 *          uploadId identifier of uploaded file
 */
UIDSUpload.prototype.saveUploaded = function(uploadId, fileName) {
  var me = eXo.commons.UIDSUpload;
  var selectedItem = eXo.commons.DocumentSelector.selectedItem;
  var url = me.restContext + "/control?" ;  
  url += "action=save" + "&workspaceName=" + selectedItem.workspaceName
  + "&driveName=" + selectedItem.driveName + "&currentFolder="
  + selectedItem.currentFolder + "&currentPortal=" + eXo.env.portal.portalName + "&language="
  + eXo.env.portal.language +"&uploadId=" + uploadId + "&fileName=" +fileName;
  var responseText = ajaxAsyncGetRequest(url, false);
};


/**
 * Show uploaded state when upload has just finished a file
 * 
 * @param {String}
 *          id uploaded identifier
 * @param {String}
 *          fileName uploaded file name
 */
UIDSUpload.prototype.showUploaded = function(id) {
  eXo.commons.UIDSUpload.listUpload.remove(id);
  var container = parent.document.getElementById(id);
  var element = document.getElementById(id+"ProgressIframe");
  element.innerHTML =  "<span></span>";
  
  var uploadIframe = eXo.core.DOMUtil.findDescendantById(container, id+"UploadIframe");
  uploadIframe.style.display = "block";
  var progressIframe = eXo.core.DOMUtil.findDescendantById(container, id+"ProgressIframe");
  progressIframe.style.display = "none";
  
  var progressBarFrame = eXo.core.DOMUtil.findFirstDescendantByClass(container, "div", "ProgressBarFrame") ;
  progressBarFrame.style.display = "none" ;
  var tmp = element.parentNode;
  var temp = tmp.parentNode;
  // TODO: dang.tung - always return true even we reload browser
  var  input = parent.document.getElementById('input' + id);
  input.value = "true" ;  
};
/**
 * Abort upload process
 * 
 * @param {String}
 *          id upload identifier
 */
UIDSUpload.prototype.abortUpload = function(id) {
  var me = eXo.commons.UIDSUpload;
  me.listUpload.remove(id);
  var url = me.restContext + "/control?" ;
  url += "uploadId=" +id+"&action=abort" ;
// var url = eXo.env.server.context + "/upload?uploadId=" +id+"&action=abort" ;
  var request =  eXo.core.Browser.createHttpRequest();
  request.open('GET', url, false);
  request.setRequestHeader("Cache-Control", "max-age=86400");
  request.send(null);
  
  var container = parent.document.getElementById(id);
  var uploadIframe =  eXo.core.DOMUtil.findDescendantById(container, id+"UploadIframe");
  uploadIframe.style.display = "block";
  me.createUploadEntry(id, UIDSUpload.isAutoUpload);
  var progressIframe = eXo.core.DOMUtil.findDescendantById(container, id+"ProgressIframe");
  progressIframe.style.display = "none";

  var tmp = progressIframe.parentNode;
  var temp = tmp.parentNode;
// var child = eXo.core.DOMUtil.getChildrenByTagName(temp,"label");
// child[0].style.visibility = "visible" ;
  var progressBarFrame = eXo.core.DOMUtil.findFirstDescendantByClass(container, "div", "ProgressBarFrame") ;
  progressBarFrame.style.display = "none" ;
  var selectFileFrame = eXo.core.DOMUtil.findFirstDescendantByClass(container, "div", "SelectFileFrame") ;
  selectFileFrame.style.display = "none" ;
   
  var  input = parent.document.getElementById('input' + id);
  input.value = "false";
};

/**
 * Start upload file
 * 
 * @param {Object}
 *          clickEle
 * @param {String}
 *          id
 */
UIDSUpload.prototype.upload = function(clickEle, id) {
  var DOMUtil = eXo.core.DOMUtil;
  var me = eXo.commons.UIDSUpload;

  var selectedItem = eXo.commons.DocumentSelector.selectedItem;
  var container = parent.document.getElementById(id);
  var uploadIFrame = parent.document.getElementById(id+"UploadIframe");
  var uploadFrame = parent.document.getElementById(id+"uploadFrame");
  if (!selectedItem || !selectedItem.driveName) {
    alert(uploadIFrame.getAttribute("select_drive"));
    file.value == '';
    return;
  }

  var canAddChild = selectedItem.canAddChild;
  if (canAddChild == "false") {
    alert(uploadIFrame.getAttribute("permission_required"));
    file.value == '';
    return;
  }

  var form = uploadFrame.contentWindow.document.getElementById(id);

  var file  = DOMUtil.findDescendantById(form, "file");
  if(file.value == null || file.value == '') return;  

  var progressBarFrame = DOMUtil.findFirstDescendantByClass(container, "div", "ProgressBarFrame") ;
  progressBarFrame.style.display = "block" ;  
  
  var progressBarLabel = DOMUtil.findFirstChildByClass(progressBarFrame, "div", "ProgressBarLabel") ;
  progressBarLabel.innerHTML = "0%" ;
  
  var  input = parent.document.getElementById('input' + id);
  input.value = "true";
  
  var uploadIframe = DOMUtil.findDescendantById(container, id+"UploadIframe");
  uploadIframe.style.display = "none";
  var progressIframe = DOMUtil.findDescendantById(container, id+"ProgressIframe");
  progressIframe.style.display = "none";

  var tmp = progressIframe.parentNode;
  var temp = tmp.parentNode;
  
  form.submit() ;
  
  var list = me.listUpload;
  if(list.length == 0) {
    me.listUpload.push(form.id);
    setTimeout("eXo.commons.UIDSUpload.refeshProgress('" + id + "');", 1000);
  } else {
    me.listUpload.push(form.id);  
  }
};

UIDSUpload.prototype.validate = function(name) {
  if(name.indexOf(':')>=0 || name.indexOf('/')>=0 || name.indexOf('\\')>=0 || name.indexOf('|')>=0 || name.indexOf('^')>=0 || name.indexOf('#')>=0 ||
    name.indexOf(';')>=0 || name.indexOf('[')>=0 || name.indexOf(']')>=0 || name.indexOf('{')>=0 || name.indexOf('}')>=0 || name.indexOf('<')>=0 || name.indexOf('>')>=0 || name.indexOf('*')>=0 ||
    name.indexOf('\'')>=0 || name.indexOf('\"')>=0 || name.indexOf('+')>=0) {
    return false;
  } else {
    return true;
  }
}

eXo.commons.UIDSUpload = new UIDSUpload();
