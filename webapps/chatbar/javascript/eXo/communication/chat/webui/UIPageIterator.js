/**
 * @author Uoc Nguyen
 *  email uoc.nguyen@exoplatform.com
 *
 *  This is an UI component use to split page or page iteration.
 */
function UIPageIterator(rootNode) {
  this.rootNode = rootNode;
  if (!this.rootNode) {
    throw (new Error('[UIPageIterator] Root node is null'));
  }
  this.rootNode.UIPageIterator = this;
  this.CSS_CLASS = {
    pagesTotal       : 'PagesTotalNumber',
    previousTopPage  : 'LastTopPageIcon',
    previousPage     : 'LastPageIcon',
    nextPage         : 'NextPageIcon',
    nextTopPage      : 'NextTopPageIcon',
    disabledPrefix   : 'Disable',
    pageNo           : 'Number',
    selectedPage     : 'Number PageSelected'
  };
  this.currentPageNo = 0;
  this.totalPage = 0;
  this.NUM_PER_PAGE = 10;
  this.MAX_PAGE_NUM = 5;
  this.gotoPageCallBack = null;
  this.totalItem = 0;
  this.init();
}

/**
 * Use to set go to page call back handle
 *
 * @param {Function} callBack
 */
UIPageIterator.prototype.setGotoPageCallback = function(callBack) {
  this.gotoPageCallBack = callBack;
};

/**
 * Initializing method
 */
UIPageIterator.prototype.init = function() {
  var DOMUtil = eXo.core.DOMUtil;
  this.totalPageNode = DOMUtil.findFirstDescendantByClass(this.rootNode, 'a', this.CSS_CLASS.pagesTotal);
  
  this.previousPageNode = 
        DOMUtil.findFirstDescendantByClass(this.rootNode, 'a', this.CSS_CLASS.previousPage) ||
        DOMUtil.findFirstDescendantByClass(this.rootNode, 'a', this.CSS_CLASS.disabledPrefix + this.CSS_CLASS.previousPage);
  this.previousPageNode.onclick = this.gotoPageWrapper;
  this.previousPageNode.pageNo = -1;
  this.previousPageNode.getPageNo = this.getPageNoFromNode;
  
  this.nextPageNode = 
        DOMUtil.findFirstDescendantByClass(this.rootNode, 'a', this.CSS_CLASS.nextPage) ||
        DOMUtil.findFirstDescendantByClass(this.rootNode, 'a', this.CSS_CLASS.disabledPrefix + this.CSS_CLASS.nextPage);
  this.nextPageNode.onclick = this.gotoPageWrapper;
  this.nextPageNode.pageNo = +1;
  this.nextPageNode.getPageNo = this.getPageNoFromNode;
  
  this.nextTopPageNode = 
        DOMUtil.findFirstDescendantByClass(this.rootNode, 'a', this.CSS_CLASS.nextTopPage) ||
        DOMUtil.findFirstDescendantByClass(this.rootNode, 'a', this.CSS_CLASS.disabledPrefix + this.CSS_CLASS.nextTopPage);
  this.nextTopPageNode.onclick = this.gotoPageWrapper;
  this.nextTopPageNode.pageNo = +10;
  this.nextTopPageNode.getPageNo = this.getPageNoFromNode;

  this.previousTopPageNode = 
        DOMUtil.findFirstDescendantByClass(this.rootNode, 'a', this.CSS_CLASS.previousTopPage) ||
        DOMUtil.findFirstDescendantByClass(this.rootNode, 'a', this.CSS_CLASS.disabledPrefix + this.CSS_CLASS.previousTopPage);
  this.previousTopPageNode.onclick = this.gotoPageWrapper;
  this.previousTopPageNode.pageNo = -10;
  this.previousTopPageNode.getPageNo = this.getPageNoFromNode;
};

/**
 * Call when component is in destroy process
 */
UIPageIterator.prototype.destroy = function() {
  this.totalPage = 0;
  this.currentPageNo = 0;
};

/**
 * Use to render page iterator HTML structor
 */
UIPageIterator.prototype.renderPageIterator = function() {
  this.totalPage = Math.ceil(this.totalItem/this.NUM_PER_PAGE);
  //debugger;
  if (this.totalPage > 1) {
    this.totalPageNode.innerHTML = this.totalPage + '';
    this.toggleNavButtons();
    
    var DOMUtil = eXo.core.DOMUtil;

    // Remove old pages node
    var pageNodeList = DOMUtil.findDescendantsByClass(this.rootNode, 'a', this.CSS_CLASS.pageNo);
    for (var i=0; i<pageNodeList.length; i++) {
      DOMUtil.removeElement(pageNodeList[i]);
    }

    // Calculate pageStart and pageEnd
    var pageStart = this.currentPageNo - Math.floor(this.MAX_PAGE_NUM/2);
    while (pageStart < 0) {
      pageStart ++;
    }
    var pageEnd = pageStart + this.MAX_PAGE_NUM;
    if (pageEnd > this.totalPage) {
      var delta = pageEnd - this.totalPage;
      pageEnd = this.totalPage;
      pageStart = pageStart - delta;
      pageStart = (pageStart < 0) ? 0 : pageStart;
    }
    for (var i=(pageEnd - 1); i>=pageStart; i--) {
      var pageNode = document.createElement('a');
      if (i == this.currentPageNo) {
        pageNode.className = this.CSS_CLASS.selectedPage;
      } else {
        pageNode.className = this.CSS_CLASS.pageNo;
      }
      pageNode.innerHTML = (i + 1);
      pageNode.pageNo = i;
      pageNode.getPageNo = this.getPageNoFromNode;
      pageNode.isAbsolute = true;
      pageNode.style.cursor = 'pointer';
      pageNode.onclick = this.gotoPageWrapper;

      this.rootNode.insertBefore(pageNode, this.previousPageNode);
    }

    if (this.rootNode.style.display != 'block') {
      this.rootNode.style.display = 'block';
    }
  } else {
    if (this.rootNode.style.display != 'none') {
      this.rootNode.style.display = 'none';
    }
  }
};

/**
 * Use to get page no from a node
 */
UIPageIterator.prototype.getPageNoFromNode = function() {
  return this.pageNo;
};

/**
 * Enable/disable navigation buttons
 *
 * @param {HTMLElement} buttonNode
 * @param {Boolean} enable
 * @param {String} disabledClass
 * @param {String} enabledClass
 */
UIPageIterator.prototype.enableNavButton = function(buttonNode, enable, disabledClass, enabledClass) {
  if (!buttonNode) {
    window.jsconsole.debug('buttonNode = ' + buttonNode + ' - args=', arguments);
  }
  window.jsconsole.debug('enable: ' + enable, buttonNode);
  var className = buttonNode.className;
  if (enable) {
    buttonNode.className = 'Icon ' + enabledClass;
    buttonNode.onclick = buttonNode.onclickbk || buttonNode.onclick;
  } else {
    buttonNode.className = 'Icon ' + disabledClass;
    buttonNode.onclickbk = buttonNode.onclick || buttonNode.onclickbk;
    buttonNode.onclick = null;
  }
};

/**
 * Use to refresh
 */
UIPageIterator.prototype.reload = function() {
  this.gotoPage(this.currentPageNo, true, true);
};

/**
 * Wrapper method
 */
UIPageIterator.prototype.gotoPageWrapper = function() {
  var uiPageIterator = eXo.core.DOMUtil.findAncestorsByClass(this, 'UIPageIterator');
  if (uiPageIterator &&
      uiPageIterator[0] &&
      this.getPageNo) {
    uiPageIterator[0].UIPageIterator.gotoPage(this.getPageNo(), this.isAbsolute);
  } else {
    window.jsconsole.error('Can not find UIPageIterator');
  }
};

/**
 * Jump to a page
 *
 * @param {Integer} pageNum
 * @param {Boolean} isAbsolutePage
 * @param {Boolean} forceReload
 */
UIPageIterator.prototype.gotoPage = function(pageNum, isAbsolutePage, forceReload) {
  var targetPageNo = parseInt(this.currentPageNo) + parseInt(pageNum);
  if (isAbsolutePage) {
    targetPageNo = pageNum;
  }
  if (targetPageNo < 0) {
    targetPageNo = 0;
  }
  if (targetPageNo >= this.totalPage) {
    targetPageNo = this.totalPage - 1;
  }
  if (!forceReload &&
      targetPageNo == this.currentPageNo) {
    return;
  }
  window.jsconsole.warn('Go to page: ' + targetPageNo);
  var from = targetPageNo * this.NUM_PER_PAGE;
  from = (from >= 0) ? from : 0;
  var to = from + this.NUM_PER_PAGE;
  if (this.gotoPageCallBack) {
    this.gotoPageCallBack(from, to);
  }
  this.currentPageNo = targetPageNo;
};

/**
 * Use to toggle navigation buttons
 */
UIPageIterator.prototype.toggleNavButtons = function() {
  // Navigator button toggle
  var DOMUtil = eXo.core.DOMUtil;
  var isPreviousEnable = false;
  var isNextEnable = false;
  var isFirstEnable = false;
  var isLastEnable = false;
  if (this.isPageValid(this.currentPageNo - 1)) {
    isPreviousEnable = true;
  }
  if (this.isPageValid(this.currentPageNo + 1)) {
    isNextEnable = true;
  }
  if (this.isPageValid(this.currentPageNo - 10)) {
    isFirstEnable = true;
  }
  if (this.isPageValid(this.currentPageNo + 10)) {
    isLastEnable = true;
  }
  this.enableNavButton(this.previousTopPageNode, isFirstEnable, this.CSS_CLASS.disabledPrefix + this.CSS_CLASS.previousTopPage, this.CSS_CLASS.previousTopPage);
  this.enableNavButton(this.previousPageNode, isPreviousEnable, this.CSS_CLASS.disabledPrefix + this.CSS_CLASS.previousPage, this.CSS_CLASS.previousPage);
  this.enableNavButton(this.nextPageNode, isNextEnable, this.CSS_CLASS.disabledPrefix + this.CSS_CLASS.nextPage, this.CSS_CLASS.nextPage);
  this.enableNavButton(this.nextTopPageNode, isLastEnable, this.CSS_CLASS.disabledPrefix + this.CSS_CLASS.nextTopPage, this.CSS_CLASS.nextTopPage);
};

/**
 * Check page no is valid or not
 *
 * @param {Integer} pageNo
 */
UIPageIterator.prototype.isPageValid = function(pageNo) {
  var valid = false;
  if (pageNo >= 0 && pageNo <= (this.totalPage - 1)) {
    valid = true;
  }
  window.jsconsole.warn('page: ' + pageNo + ' valid:' + valid + ' - total: ' + this.totalPage);
  return valid;
};

eXo.communication.chatbar.webui.UIPageIterator = UIPageIterator;
