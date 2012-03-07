/**
 * @author uocnguyen
 *
 * @desc this file used to import all javascript library which needed to chat application
 * working well,
 */

if(!eXo.communication) eXo.communication = {};
eXo.communication.chat = {
    eXoChat : {},
    core : {},
    locale : {},
    webui : {
      component : {}
    }
}

// Overwrite html entities to ignore white space from html encode
eXo.core.HTMLUtil.entities.nbsp = null;

eXo.communication.chat.eXoChat = {
  /**
   * This method use to initialize all data before call UIMainChatWindow to init all chat application component 
   */
  init : function() {
    try {
      var thys = eXo.communication.chat.eXoChat;
      var UIChatNode = document.getElementById('UIChat');
      var eXoToken = UIChatNode.getAttribute('eXoToken');
      var userName = UIChatNode.getAttribute('userName');
      eXo.communication.chat.core.XMPPCommunicator.init(thys.restcontextname);
      eXo.communication.chat.core.LocalTemplateEngine.init('templateArea');
      eXo.communication.chat.webui.UIMainChatWindow.init(thys.applicationId, eXoToken, userName, thys.cometdcontextname);
      eXo.communication.chat.webui.UIChatDragDrop.init(
        eXo.communication.chat.webui.UIMainChatWindow.chatWindowsContainerNode,
        [{className:'OverflowContainer', tagName: 'div'}, {className: 'PopupTitle', tagName: 'span'}]);
      eXo.communication.chat.webui.UIMainChatWindow.xLogin(userName);
    } catch (e) {
      throw (new Error('Error while loading chat application.'));
    }
  }
}


