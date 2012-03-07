/**
 * @author uocnb
 */
function UIMailDragDrop() {
  this.scKey = 'border' ;
  this.scValue = 'solid 1px #000' ;
  this.DOMUtil = eXo.core.DOMUtil ;
  this.DragDrop = eXo.core.DragDrop ;
  this.dropableSets = [] ;
  this.msgItemClass = 'MessageItem' ;
} ;

UIMailDragDrop.prototype.onLoad = function() {
  eXo.mail.UIMailDragDrop.init() ;
} ;

UIMailDragDrop.prototype.init = function() {
  this.dropableSets = [] ;
  var uiMailPortletNode = eXo.core.DOMUtil.findDescendantsByClass(document.body,"div","UIMailPortlet") ;
  var i = uiMailPortletNode.length ;
  while(i--){  	
	//this.getAllDropableSets(uiMailPortletNode[i]) ;
	this.regDnDItem(uiMailPortletNode[i]) ;
  }
} ;

UIMailDragDrop.prototype.getAllDropableSets = function(uiMailPortletNode) {
  var uiFolderContainerNode = this.DOMUtil.findDescendantById(uiMailPortletNode,'UIFolderContainer') ;
  var folderList = this.DOMUtil.findDescendantsByClass(uiFolderContainerNode, 'a', 'Folder') ;
  for (var i=0; i<folderList.length; i++) {
    this.dropableSets[this.dropableSets.length] = folderList[i] ;
  }
  folderList = this.DOMUtil.findDescendantsByClass(uiFolderContainerNode, 'div', 'Folder') ;
  for (var i=0; i<folderList.length; i++) {
    this.dropableSets[this.dropableSets.length] = folderList[i] ;
  }
  var uiTagContainerNode = this.DOMUtil.findDescendantById(uiMailPortletNode,'UITagContainer') ;
  var tagLists = this.DOMUtil.findDescendantsByClass(uiTagContainerNode, 'a', 'IconTagHolder') ;
  for (var i=0; i<tagLists.length; i++) {
    this.dropableSets[this.dropableSets.length] = tagLists[i] ;
  }
  //var tagContainer = document.getElementById('UITagContainer') ;
  var tagContainer = this.DOMUtil.findDescendantById(uiMailPortletNode,'UITagContainer') ;
//  if (tagContainer &&  tagLists.length <= 0) {
  if (tagContainer) {
  	var uiTagContainer = this.DOMUtil.findFirstDescendantByClass(tagContainer, "div","UITagContainer") ;
    this.dropableSets[this.dropableSets.length] = uiTagContainer ;
  }
} ;

UIMailDragDrop.prototype.regDnDItem = function(rootNode) {
  var uiListUsersNode = eXo.core.DOMUtil.findDescendantById(rootNode,'UIListUsers') ;
  if(!uiListUsersNode) return ;
  var mailList = this.DOMUtil.findDescendantsByClass(uiListUsersNode, 'tr', this.msgItemClass) ;
  for (var i=0; i<mailList.length; i++) {
    mailList[i].onmousedown = this.mailMDTrigger ;
  }
} ;

/**
 * 
 * @param {Event} e
 */
UIMailDragDrop.prototype.mailMDTrigger = function(e) {
  e = e ? e : window.event ;
  if (e.button == 1 || e.which == 1) {
  	var elem = eXo.cs.EventManager.getEventTarget(e);
  	var uiMailPortletNode = eXo.core.DOMUtil.findAncestorByClass(elem,"UIMailPortlet");
  	eXo.mail.UIMailDragDrop.getAllDropableSets(uiMailPortletNode);
    return eXo.mail.UIMailDragDrop.initDnD(eXo.mail.UIMailDragDrop.dropableSets, this, this, e) ;
  }
  return true ;
} ;

UIMailDragDrop.prototype.initDnD = function(dropableObjs, clickObj, dragObj, e) {
  var clickBlock = (clickObj && clickObj.tagName) ? clickObj : document.getElementById(clickObj) ;
  var dragBlock = (dragObj && dragObj.tagName) ? dragObj : document.getElementById(dragObj) ;
  
  var blockWidth = clickBlock.offsetWidth ;
  var blockHeight = clickBlock.offsetHeight ;
  
  var tmpNode = document.createElement('div') ;
  var uiGridNode = document.createElement('table') ;
  var messageContainerNode = document.createElement('tbody') ;
  messageContainerNode.className = 'MessageContainer';
  uiGridNode.className = 'UIGrid' ;
  with(tmpNode.style) {
    background = '#ffe98f' ;
    border = 'solid 1px #A5A5A5' ;
    position = 'absolute' ;
    width = blockWidth + 'px' ;
    display = 'none' ;
  }
  eXo.core.Browser.setOpacity(tmpNode, 80) ;
  var selectedItems = eXo.cs.FormHelper.getSelectedElementByClass(eXo.core.DOMUtil.findAncestorById(clickObj,"UIListUsers"), this.msgItemClass, dragBlock) ;
  var cnt = 0;
  if (selectedItems.length > 0) {
    for (var i=0; i<selectedItems.length; i++) {
      if (selectedItems[i] && selectedItems[i].cloneNode) {
        messageContainerNode.appendChild(selectedItems[i].cloneNode(true)) ;
        cnt ++;
      }
    }
  } else {
    messageContainerNode.appendChild(dragBlock.cloneNode(true)) ;
    cnt ++;
  }
  uiGridNode.appendChild(messageContainerNode);
  tmpNode.appendChild(uiGridNode) ;
  document.body.appendChild(tmpNode) ;
  this.DragDrop.initCallback = this.initCallback ;
  this.DragDrop.dragCallback = this.dragCallback ;
  this.DragDrop.dropCallback = this.dropCallback ;
  this.DragDrop.init(dropableObjs, clickBlock, tmpNode, e) ;
  return false ;
} ;

UIMailDragDrop.prototype.synDragObjectPos = function(dndEvent) {
  if (!dndEvent.backupMouseEvent) {
    dndEvent.backupMouseEvent = window.event ;
    if (!dndEvent.backupMouseEvent) {
      return ;
    }
  }
  var dragObject = dndEvent.dragObject ;
  var mouseX = eXo.core.Browser.findMouseXInPage(dndEvent.backupMouseEvent) ;
  var mouseY = eXo.core.Browser.findMouseYInPage(dndEvent.backupMouseEvent)
  dragObject.style.top = mouseY + 'px' ;
  dragObject.style.left = mouseX + 'px' ;
	if (eXo.core.I18n.isRT()) {
		if(eXo.core.Browser.browserType == "ie") mouseX -= eXo.cs.Utils.getScrollbarWidth();
		dragObject.style.right = (eXo.core.Browser.getBrowserWidth() - mouseX) + "px" ;
		dragObject.style.left = '' ;
  }
} ;

UIMailDragDrop.prototype.initCallback = function(dndEvent) {
  eXo.mail.UIMailDragDrop.synDragObjectPos(dndEvent) ;
} ;

UIMailDragDrop.prototype.dragCallback = function(dndEvent) {
  var dragObject = dndEvent.dragObject ;
  if (!dragObject.style.display ||
      dragObject.style.display == 'none') {
    dragObject.style.display = 'block' ;
  }
  eXo.mail.UIMailDragDrop.synDragObjectPos(dndEvent) ;
  try{
		
  if (dndEvent.foundTargetObject) {
    if (this.foundTargetObjectCatch != dndEvent.foundTargetObject) {
      if(this.foundTargetObjectCatch) {
				if(this.foundTargetObjectCatch.getAttribute("style")) this.foundTargetObjectCatch.removeAttribute("style") ;
        //this.foundTargetObjectCatch.style[eXo.mail.UIMailDragDrop.scKey] = this.foundTargetObjectCatchStyle ;
      }
      this.foundTargetObjectCatch = dndEvent.foundTargetObject ;
      //this.foundTargetObjectCatchStyle = this.foundTargetObjectCatch.style[eXo.mail.UIMailDragDrop.scKey] ;
      this.foundTargetObjectCatch.style[eXo.mail.UIMailDragDrop.scKey] = eXo.mail.UIMailDragDrop.scValue ;
    }
  } else {
    if (this.foundTargetObjectCatch) {
			if(this.foundTargetObjectCatch.getAttribute("style")) this.foundTargetObjectCatch.removeAttribute("style") ;
      //this.foundTargetObjectCatch.style[eXo.mail.UIMailDragDrop.scKey] = this.foundTargetObjectCatchStyle ;
    }
    this.foundTargetObjectCatch = null ;
  }
	}catch(e) {window.document.title = e.message} ;
} ;

UIMailDragDrop.prototype.dropCallback = function(dndEvent) {
  document.body.removeChild(dndEvent.dragObject) ;
  if (this.foundTargetObjectCatch) {
		if(this.foundTargetObjectCatch.getAttribute("style")) this.foundTargetObjectCatch.removeAttribute("style") ;
    //this.foundTargetObjectCatch.style[eXo.mail.UIMailDragDrop.scKey] = this.foundTargetObjectCatchStyle ;
  }
  this.foundTargetObjectCatch = dndEvent.foundTargetObject ;
  if (this.foundTargetObjectCatch) {
    eXo.core.DOMUtil.findFirstDescendantByClass(dndEvent.clickObject, 'input', 'checkbox').checked = true ;
    var place2MoveId = false ;
    var formOp = false ;
    if (eXo.core.DOMUtil.hasClass(this.foundTargetObjectCatch,'UITagContainer')) {
      eXo.webui.UIForm.submitForm('UIMessageList','AddTag', true) ;
      return ;
    } else if (eXo.core.DOMUtil.findAncestorByClass(this.foundTargetObjectCatch, 'UITagContainer')) {
      place2MoveId = this.foundTargetObjectCatch.getAttribute('tagid') ;
      formOp = 'AddTagDnD' ;
    } else {
      place2MoveId = this.foundTargetObjectCatch.getAttribute('folder') ;
      formOp = 'MoveDirectMessages' ;
    }
    var uiMailPortletNode = eXo.core.DOMUtil.findAncestorByClass(this.foundTargetObjectCatch,"UIMailPortlet");
    var uiMsgList = eXo.core.DOMUtil.findDescendantById(uiMailPortletNode,'UIMessageList') ;
	if ((uiMsgList.action).indexOf("objectId")>=0) {
		var pattern = /objectId=.*/ ;
		uiMsgList.action = (uiMsgList.action).replace(pattern,'objectId=' + place2MoveId) ;
	} else
    uiMsgList.action = uiMsgList.action + '&objectId=' + place2MoveId ;
	uiMailPortletNode = eXo.core.DOMUtil.findAncestorByClass(uiMailPortletNode,"PORTLET-FRAGMENT");
    eXo.webui.UIForm.submitForm(uiMailPortletNode.parentNode.id + '#UIMessageList', formOp, true) ;
  }
} ;

eXo.mail.UIMailDragDrop = new UIMailDragDrop();