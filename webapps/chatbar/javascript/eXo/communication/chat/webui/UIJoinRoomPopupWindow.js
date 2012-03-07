/**
 * @author Uoc Nguyen
 *
 * This is an UI component use to manage join room popup window
 */
function UIJoinRoomPopupWindow() {
  this.MAX_ROOM_NAME_DISPLAY = 12;
  this.MAX_ROOM_DESC_DISPLAY = 55;
  this.CSS_CLASS = {
    uiPageIterator   : 'UIPageIterator'
  };
}

/**
 * Extends from JSUIBean
 */
UIJoinRoomPopupWindow.prototype = new eXo.communication.chatbar.webui.component.JSUIBean();

/**
 * Initializing method
 *
 * @param {HTMLElement} rootNode
 * @param {UIMainChatWindow} UIMainChatWindow
 */
UIJoinRoomPopupWindow.prototype.init = function(rootNode, UIMainChatWindow) {
  this.id = 'UIJoinRoomPopupWindow';
  this.rootNode = rootNode;
  this.UIMainChatWindow = UIMainChatWindow;
  var DOMUtil = eXo.core.DOMUtil;
  var tmpNode = DOMUtil.findFirstDescendantByClass(this.rootNode, 'table', 'UIGrid');
  if (tmpNode.getElementsByTagName('tbody').length > 0) {
    this.roomListContainerNode = tmpNode.getElementsByTagName('tbody')[0];
  } else {
    this.roomListContainerNode = tmpNode;
  }
  this.joinRoomButtonNode = eXo.core.DOMUtil.findFirstDescendantByClass(this.rootNode, 'a', 'JoinRoomButton');
  this.joinRoomButtonNode.hrefBk = this.joinRoomButtonNode.href;
  this.LocalTemplateEngine = this.UIMainChatWindow.LocalTemplateEngine;
  this.pageIteratorNode = DOMUtil.findFirstDescendantByClass(this.rootNode, 'div', this.CSS_CLASS.uiPageIterator);
  this.uiPageIterator = new eXo.communication.chatbar.webui.UIPageIterator(this.pageIteratorNode);
  this.uiPageIterator.setGotoPageCallback(this.gotoPage);
  this._callback();
  this._registerEventCallback(this._RELOAD_EVENT, this.onReload);
};

/**
 * Use to reload UI states
 */
UIJoinRoomPopupWindow.prototype.onReload = function(eventData) {
  var uiJoinRoomPopupWindow = eXo.communication.chatbar.webui.UIJoinRoomPopupWindow;
  uiJoinRoomPopupWindow._isOnLoading = true;
  uiJoinRoomPopupWindow.setVisible(uiJoinRoomPopupWindow._isVisible());
  uiJoinRoomPopupWindow._isOnLoading = false;
};

/**
 * Call when room list is refreshed.
 */
UIJoinRoomPopupWindow.prototype.reloadRoomList = function() {
  this.uiPageIterator.reload();
};

/**
 * Request server to get room list in a range
 *
 * @param {Integer} from
 * @param {Integer} to
 */
UIJoinRoomPopupWindow.prototype.gotoPage = function(from, to) {
  eXo.communication.chatbar.webui.UIMainChatWindow.jabberGetRoomList(from, to);
};

/**
 * Use to update room list which get from service
 *
 * @param {JSonData} serverData
 */
UIJoinRoomPopupWindow.prototype.updateRoomList = function(serverData) {
  roomList = serverData.hostedRooms ? serverData.hostedRooms : [];

  // Fix bug table innerHTML for ie
  var tmpNode = this.roomListContainerNode.parentNode;
  tmpNode.removeChild(this.roomListContainerNode);
  this.roomListContainerNode = document.createElement('tbody');
  tmpNode.appendChild(this.roomListContainerNode);
  for (var i=0; i<roomList.length; i++) {
    var roomInfo = roomList[i];
    roomInfo.enabled4Add = true;
    this.roomListContainerNode.appendChild(this.createRoomNode(roomInfo, (i%2)));
  }
  this.uiPageIterator.totalItem = serverData.totalRooms;
  this.uiPageIterator.renderPageIterator(serverData);
  if(eXo.core.Browser.isIE7() && !serverData.hostedRooms)
  	this.reloadRoomList();
};

/**
 * Create a room node to add to room list result
 *
 * @param {RoomInfo} roomInfo
 * @param {Boolean} isAlternate
 */
UIJoinRoomPopupWindow.prototype.createRoomNode = function(roomInfo, isAlternate) {
  var DOMUtil = eXo.core.DOMUtil;
  var uiRoomRowNode = document.createElement('tr');
  if (isAlternate) {
    uiRoomRowNode.className = 'UIRoomRowC';
  } else {
    uiRoomRowNode.className = 'UIRoomRow';
  }
  uiRoomRowNode.roomInfo = roomInfo;
  var tdTmpNode = document.createElement('td');
  
  //var selectBoxNode = document.createElement('input');
  
  //selectBoxNode.type = 'checkbox';
  //selectBoxNode.className = 'CheckBox';
  var checkBoxHTML = '<input type="radio" class="CheckBox"';
  if (!roomInfo.enabled4Add) {
    checkBoxHTML += ' checked="true" disabled="true"';
  }
  checkBoxHTML += 'name="roomName" value="' + roomInfo['name'] +
    '" onclick="eXo.communication.chatbar.webui.UIJoinRoomPopupWindow.selectRoom(event);" style="width: 10px;">';
  
  tdTmpNode.style.width = '10px';
  tdTmpNode.style.textAlign = 'center';
  tdTmpNode.innerHTML = checkBoxHTML;
  uiRoomRowNode.appendChild(tdTmpNode.cloneNode(true));
  
  tdTmpNode.innerHTML = '<span></span>';
  tdTmpNode.style.textAlign = '';
  tdTmpNode.style.width = '';
  
  var tmpRoomName = roomInfo['name'];
  tdTmpNode.setAttribute('title', tmpRoomName);
  if (tmpRoomName.length > this.MAX_ROOM_NAME_DISPLAY) {
    tmpRoomName = tmpRoomName.substr(0, this.MAX_ROOM_NAME_DISPLAY) + '...';
  }
  tdTmpNode.innerHTML = tmpRoomName;//roomInfo['name'];
  uiRoomRowNode.appendChild(tdTmpNode.cloneNode(true));
  var tmpRoomDesc = roomInfo['description'];
  tdTmpNode.setAttribute('title', tmpRoomDesc);
  if (tmpRoomDesc.length > this.MAX_ROOM_DESC_DISPLAY) {
    tmpRoomDesc = tmpRoomDesc.substr(0, this.MAX_ROOM_DESC_DISPLAY) + '...';
  }
  tdTmpNode.innerHTML = tmpRoomDesc;
  uiRoomRowNode.appendChild(tdTmpNode.cloneNode(true));
  
  return uiRoomRowNode;
};

/**
 * Keep only one room selected by user
 *
 * @param {Event} event
 */
UIJoinRoomPopupWindow.prototype.selectRoom = function(event) {
  var DOMUtil = eXo.core.DOMUtil;
  event = event || window.event;
  var srcElement = event.srcElement || event.target;
  srcElement.checked = true;
};

/**
 * Call when user press join room button
 */
UIJoinRoomPopupWindow.prototype.joinRoomAction = function() {
  var DOMUtil = eXo.core.DOMUtil;
  var checkBoxList = DOMUtil.findDescendantsByClass(this.roomListContainerNode, 'input', 'CheckBox');
  for (var i=0; i<checkBoxList.length; i++) {
    var currentNode = checkBoxList[i];
    if (currentNode.checked) {
      // Check if target room is protected
      var roomInfoNode = DOMUtil.findAncestorByTagName(currentNode, 'tr');
      if (!roomInfoNode) {
        // window.jsconsole.error('Can not detect room information');
        return;
      }
      var roomInfo = roomInfoNode.roomInfo;
      var joinedRooms = this.UIMainChatWindow.joinedRooms;
      for (var i=0; i<joinedRooms.length; i++) {
        var joinedRoomInfo = joinedRooms[i];
        if (joinedRoomInfo.roomInfo.room == roomInfo.room) {
          var uiTabControlObj = this.UIMainChatWindow.UIChatWindow.createNewTab(roomInfo.room, true);
          uiTabControlObj.roomConfigured = true;
          this.setVisible(false);
          return;
        }
      }
      this.UIMainChatWindow.jabberJoinToRoom(currentNode.value, roomInfo.isPasswordProtected);
      this.setVisible(false);
      return;
    }
  }
};

UIJoinRoomPopupWindow.prototype.joinSelectedRoomAction = function(obj) {
	  var DOMUtil = eXo.core.DOMUtil;
	  var roomInfoNode= obj ;
	  var joinedRooms = this.UIMainChatWindow.joinedRooms;
      for (var i=0; i<joinedRooms.length; i++) {
        var joinedRoomInfo = joinedRooms[i];
        if (joinedRoomInfo.roomInfo.room == roomInfoNode.getAttribute("roomId")) {
          this.UIMainChatWindow.UIChatWindow.createNewTab(joinedRoomInfo.roomInfo.room, true);           
          return;
        }
      }
      //this.UIMainChatWindow.jabberJoinToRoom(joinedRoomInfo.roomInfo.room, joinedRoomInfo.roomInfo.isPasswordProtected);
      return; 
	  
	  /*var checkBoxList = DOMUtil.findDescendantsByClass(this.roomListContainerNode, 'input', 'CheckBox');
	  for (var i=0; i<checkBoxList.length; i++) {
	    var currentNode = checkBoxList[i];
	    if (currentNode.checked) {
	      // Check if target room is protected
	      var roomInfoNode = DOMUtil.findAncestorByTagName(currentNode, 'tr');
	      if (!roomInfoNode) {
	        // window.jsconsole.error('Can not detect room information');
	        return;
	      }
	      var roomInfo = roomInfoNode.roomInfo;
	      var joinedRooms = this.UIMainChatWindow.joinedRooms;
	      for (var i=0; i<joinedRooms.length; i++) {
	        var joinedRoomInfo = joinedRooms[i];
	        if (joinedRoomInfo.roomInfo.room == roomInfo.room) {
	          this.UIMainChatWindow.UIChatWindow.createNewTab(roomInfo.room, true);
	          this.setVisible(false);
	          return;
	        }
	      }
	      this.UIMainChatWindow.jabberJoinToRoom(currentNode.value, roomInfo.isPasswordProtected);
	      this.setVisible(false);
	      return;
	    }
	  }*/
	};
	
	UIJoinRoomPopupWindow.prototype.joinSelectedRoomByIdAction = function(event) {
		event = event || window.event;
	  var srcElement = event.srcElement || event.target;
	  var roomId = srcElement.getAttribute('roomId');
	  var roomName = roomId.split('@')[0];
	  var userName = this.UIMainChatWindow.userNames[this.UIMainChatWindow.XMPPCommunicator.TRANSPORT_XMPP];
		userName = userName+'@';
	  var joinedRooms = this.UIMainChatWindow.joinedRooms;
      for (var i=0; i<joinedRooms.length; i++) {
        var joinedRoomInfo = joinedRooms[i];
        if (joinedRoomInfo.roomInfo.room == roomId) {
        	//
        	var isThisUserJoined = false;
        	var roomOccupantsList = joinedRoomInfo.occupants;
		  		for(var j=0; j<roomOccupantsList.length; j++){
		  			var occupant = roomOccupantsList[j];
		  			if(occupant.jid.indexOf(userName)==0){
		  				isThisUserJoined = true;
		  				break;
		  			}
		  		}
		  		//
        	if(isThisUserJoined){
        		var uiTabControlObj = this.UIMainChatWindow.UIChatWindow.createNewTab(joinedRoomInfo.roomInfo.room, true); 
        				uiTabControlObj.roomConfigured = true;
        	}  
        	else
          	this.UIMainChatWindow.jabberJoinToRoom(roomName, joinedRoomInfo.isPasswordProtected);
          return;
        }
      }
      return; 
   };

/**
 * Make component visible or not
 *
 * @param {Boolean} visible
 */
UIJoinRoomPopupWindow.prototype.setVisible = function(visible) {
  this._setOption('visible', visible);
  if (!visible || !this.UIMainChatWindow.userStatus ||
      this.UIMainChatWindow.userStatus == this.UIMainChatWindow.OFFLINE_STATUS) {
	  if (this.rootNode.style.display != 'none') {
	    this.rootNode.style.display = 'none'; 
	  }
    return;
  }
  if (visible) {
    this.uiPageIterator.reload();
    if (this.rootNode.style.display != 'block') {
      this.rootNode.style.display = 'block'; 
    }
    this.UIPopupManager.focusEventFire(this);
  }
};

eXo.communication.chatbar.webui.UIJoinRoomPopupWindow = new UIJoinRoomPopupWindow();
