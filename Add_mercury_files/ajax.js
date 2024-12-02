var loadImg = new Image();
var winCloseImg = new Image();
var winCloseOnImg = new Image();
var ajaxVetcontrol = new Object();
loadImg.src = "./Main_mercury_files/ajax-loader.gif";
var preloaderImg ="./Main_mercury_files/sprites.png";
winCloseImg.src = "./Main_mercury_files/winClose.gif";
winCloseOnImg.src = "./Main_mercury_files/winCloseOn.gif";
ajaxVetcontrol.active = 0;

function init() {
   if(!ie() && XMLHttpRequest) {
      return new XMLHttpRequest();
   } else if (ActiveXObject) {
      try {
         return new ActiveXObject("Msxml2.XMLHTTP");
      } catch(e) {
         try {
            return new ActiveXObject("Microsoft.XMLHTTP");
         } catch(e2) {
            alert("Ошибка инициализации XMLHttpRequest!\nВаш веб-браузер не поддерживает данную технологию");
            return null;
         }
      }
   }
}

var templateUrl = "";

function isAjaxVetcontrol() {
   return true;
}

function createTemplate(url) {
   templateUrl = url;
   reqG = init();
   ae_prompt(createTemplateAjax, "Введите название шаблона:", "", null);
}

function createTemplateSuffix(url, suffix) {
   templateUrl = url;
   reqG = init();
   ae_prompt_suffix(createTemplateAjax, "Введите название шаблона:", "", null, suffix);
}

function loadList(formName, elementName, parentValue, pk, edit, url, req) {
   if(document.forms[formName] != null && document.forms[formName].elements[elementName] != null) {
      loadAjaxList(formName, elementName, pk, "pk", parentValue, edit, url, req, true);
   }
}

function loadSimpleAjaxList(formName, elementName, elementPk, edit, url, req, showNullOption) {
   if(document.forms[formName] != null && document.forms[formName].elements[elementName] != null) {
      loadAjaxList(formName, elementName, elementPk, "", "", edit, url, req, showNullOption);
   }
}

function loadChildList(formName, childName, childValue, parentName, parentValue, edit, url) {
   if (document.forms[formName] == null && document.forms[formName].elements[childName] == null) {
      return;
   }

   if (!isNull(parentValue)) {
      loadAjaxList(formName, childName, childValue, parentName, parentValue, edit, url, init(), true);
   } else {
      resetList(document.forms[formName].elements[childName]);
   }
}

function loadAjaxList(formName, childName, childPk, parentName, parentPk, edit, url, req, showNullOption) {
   var list = document.forms[formName].elements[childName];
   var additionalOptions = {};
   for (var i = 0; i < list.children.length; i++) {
      var option = list.children[i];
      if (option.getAttribute("data-include")) {
         additionalOptions[option.value] = option;
      }
   }
   clearList(list);
   var loading = ce("option");
   var textNode = ct("загрузка данных...");
   loading.appendChild(textNode);
   loading.setAttribute("value", "null");
   list.appendChild(loading);

   req.onreadystatechange = myCallback3;

   function myCallback3() {
      if (req.readyState == 4) {
         ajaxVetcontrol.active--;
         if (req.status == 200) {
            doList(list, req.responseXML);
            var afterInit = list.getAttribute("onAfterInit");
            if (afterInit != null) {
               eval(afterInit);
            }
            list.dispatchEvent(createEvent('after-init'))
         }
      }
   }

   function doList(list, responseXML) {
      clearList(list);
      var result = responseXML.getElementsByTagName("list")[0];

      if(showNullOption) {
         var firstOption = ce("option");
         var textNode = ct("не указано");
         firstOption.setAttribute("value", "null");
         firstOption.appendChild(textNode);
         list.appendChild(firstOption);
      }

      for (i = 0; i < result.getElementsByTagName("element").length; i++) {
         var element = result.getElementsByTagName("element")[i];
         var value = element.getElementsByTagName("value")[0];
         var view = element.getElementsByTagName("view")[0];
         var hidden = false;
         var disabled = false;

         if(element.getAttribute("hidden") != null && element.getAttribute("hidden") == "true") {
            hidden = true;
         }
         if(element.getAttribute("disabled") != null && element.getAttribute("disabled") == "true") {
            disabled = true;
         }

         if(view.childNodes[0] != null) {
            var option = addElementToList(list, value.childNodes[0].nodeValue, view.childNodes[0].nodeValue, hidden, disabled);
            if (element.hasAttributes()) {
               for (var j = 0; j < element.attributes.length; j++) {
                  option.setAttribute("data-" + element.attributes[j].name, element.attributes[j].value)
               }
            }

            if (additionalOptions[value.childNodes[0].nodeValue]) {
               additionalOptions[value.childNodes[0].nodeValue] = null;
            }
         }
      }

      for (var value in additionalOptions) {
         var option = additionalOptions[value];
         if (option) {
            list.appendChild(option);
         }
      }
   }

   function addElementToList(list, value, view, hidden, disabled) {
      var option = ce("option");
      var textNode = ct(view);
      option.setAttribute("value", value);
      if(((childName == "subProduct" || childName == "subProduct_") && isOtherSubProduct(value)) ||
          ((childName == "product" || childName == "product_") && isOtherProduct(value))
      ) {
         option.setAttribute("class", "isOther");
         option.setAttribute("className", "isOther");
      }
      if(hidden == true) {
         option.setAttribute("class", "hidden");
         option.setAttribute("className", "hidden");
      }
      if(disabled == true) {
         option.setAttribute("disabled", true);
      }
      if(edit) {
         if(childPk == value) {
            option.setAttribute("selected", "selected");
         }
      }
      option.appendChild(textNode);
      list.appendChild(option);
      return option;
   }

   function clearList(list) {
      while(list.hasChildNodes()) {
         list.removeChild(list.childNodes[0]);
      }
   }

   var group = document.forms[formName].elements["group"];

   if(group != null) {
      url += "&group=" + group.value;
   }

   if(!isEmpty(parentName) && !isEmpty(parentPk)) {
      url += "&" + parentName + "=" + parentPk;
   }

   if(ie()) {
      url += "&preventCachingForIE=" + Math.random();
   }

   ajaxVetcontrol.active++;

   req.open("GET", url, true);

   req.send(null);
}

function listRegData(formName, elementName, url, req) {
   var inProgressText = "идет поиск...";
   var searchResult = id$("searchResult");
   var searching = id$("searching");

   if (searching.innerHTML === inProgressText) return;

   searching.innerHTML = inProgressText;

   req.onreadystatechange = myCallback4;
   clearRegList();

   function myCallback4() {

      if(req.readyState == 4) {
         ajaxVetcontrol.active--;
         if(req.status == 200) {
            fillListData(req.responseXML);
         }
         if(req.status == 500) {
            alert("Ошибка при поиске");
         }
      }
   }

   function fillListData(responseXML) {
      searching.innerHTML = "";
      var result = responseXML.getElementsByTagName("list")[0];

      if(result.getElementsByTagName("regData").length == 0) {
         id$("regDataNotFound").innerHTML = "поиск результатов не дал";
      } else {
         id$("regDataNotFound").innerHTML = "";
      }

      for (i = 0; i < result.getElementsByTagName("regData").length; i++) {
         addRow(result.getElementsByTagName("regData")[i]);
         addInputs(result.getElementsByTagName("regData")[i]);
      }

      setPageNavigation(result);
   }

   function setPageNavigation(result) {
      var lastPage = parseInt(result.getAttribute("lastPage"));
      var pageList = parseInt(result.getAttribute("pageList"));
      var totalSize = parseInt(result.getAttribute("totalSize"));

      $('[name = "lastPageForCargo"]').val(lastPage);
      $('[name = "pageListForCargo"]').val(pageList);
      $('[name = "totalSizeForCargo"]').val(totalSize);

      if(totalSize > 10) {
         id$("pageNav").style.display = "block";
      } else {
         id$("pageNav").style.display = "none";
      }

      if(totalSize > 10) {
         if(pageList > 1) {
            $("#first").button("enable");
            $("#prev").button("enable");
         } else {
            $("#first").button("disable");
            $("#prev").button("disable");
         }
         if(pageList < lastPage) {
            $("#next").button("enable");
            $("#last").button("enable");
         } else {
            $("#next").button("disable");
            $("#last").button("disable");
         }

         id$("pageListForCargo").innerHTML = pageList;
         id$("lastPageForCargo").innerHTML = lastPage;
      }
   }

   function addRow(element) {
      var tr = ce("tr");
      var id = getElementValue(element, "pk");
      var td;

      var producers = getProducers(element);
      if (producers.length === 0) {
         td = createTd(id);
         td.onclick = getHandler(id);
         td.appendChild(createInput(id));
         td.appendChild(createView(element));
      } else if (producers.length === 1) {
         var producerId = 0;
         td = createTd(id + "_" + producerId);
         td.onclick = getHandler(id, producerId);
         td.appendChild(createInput(id + "_" + producerId));
         td.appendChild(createView(element));
      } else {
         td = createTd(id);
         var span = createView(element);
         span.setAttribute("style", "margin-left: 21px; line-height: 23px");
         td.appendChild(span);
         td.appendChild(createProducers(element));
      }

      tr.appendChild(td);
      id$("searchResultBody").appendChild(tr);
   }

   function getProducers(element) {
      var producerList = element.getElementsByTagName("producerList")[0];
      return producerList.getElementsByTagName("producer");
   }

   function createProducers(element) {
      var table = ce("table");
      var parentId = getElementValue(element, "pk");
      var producers = getProducers(element);
      for (var i = 0; i < producers.length; i++) {
         var producer = producers[i];
         var tr = ce("tr");
         var id = parentId + "_" + i;
         var td = createTd(id);
         td.onclick = getHandler(parentId, i);
         td.appendChild(createInput(id));
         td.appendChild(ct(getElementValue(producer, "producerView")));
         tr.appendChild(td);
         table.appendChild(tr);
      }
      return table;
   }

   function getHandler(id, producerId) {
      return function () {
         checkRadio(id, producerId);
         $("#producerId").val(producerId);
      }
   }

   function getElementValue(element, name) {
      return element.getElementsByTagName(name)[0].childNodes[0].nodeValue;
   }

   function createTd(id) {
      var td = ce("td");
      td.setAttribute("id", "td" + id);
      td.setAttribute("class", "active");
      return td;
   }

   function createInput(id) {
      var input = ce("input");
      input.setAttribute("name", "regId");
      input.setAttribute("type", "radio");
      input.setAttribute("value", id);
      input.setAttribute("id", id);
      return input;
   }

   function createView(element) {
      var span = ce("span");
      span.appendChild(ct(
         fillField(element, "name") + ", учетная серия №: " +
         fillField(element, "regNumber"))
      );
      return span;
   }

   function addInputs(element) {
      var id = element.getElementsByTagName("pk")[0].childNodes[0].nodeValue;

      addInput(id, "pk", element);
      addInput(id, "regNumber", element);
      addInput(id, "name", element);
      addInput(id, "type", element);
      addInput(id, "gmo", element);
      addInput(id, "form", element);
      addInput(id, "producer", element);
      addInput(id, "purpose", element);
      addInput(id, "registrationNumber", element);
      addInput(id, "client", element);
      addInput(id, "componentContent", element);
      addInput(id, "dateFrom", element);
      addInput(id, "dateTo", element);
      addInput(id, "feedAdditiveType", element);
      addInput(id, "packaging", element, "");

      var producers = getProducers(element);
      for (var i = 0; i < producers.length; i++) {
         var producer = producers[i];
         addInput(id, "producerView", producer, "", i);
      }
   }

   function addInput(id, elementName, element, defaultValue, elementId) {
      var input = ce("input");
      var name = "_" + id + "_" + elementName;
      if (elementId !== undefined) name += "_" + elementId;
      input.setAttribute("name", name);
      input.setAttribute("id", name);
      input.setAttribute("type", "hidden");
      input.setAttribute("value", fillField(element, elementName, defaultValue));

      id$("placeForInputs").appendChild(input);
   }

   function fillField(element, field, defaultValue) {
      if(element.getElementsByTagName(field)[0].childNodes[0] != null) {
         return element.getElementsByTagName(field)[0].childNodes[0].nodeValue;
      } else {
         return defaultValue !== undefined ? defaultValue : "-";
      }
   }

   function clearRegList(field) {
      searchResult.removeChild(id$("searchResultBody"));
      var tbody = ce("tbody");
      tbody.setAttribute("id", "searchResultBody");
      searchResult.appendChild(tbody);

      $("#placeForInputs").remove();
      var span = ce("span");
      span.setAttribute("id", "placeForInputs");
      document.forms[0].appendChild(span);
   }

   var findRegNumber = $('[name = "' + elementName + '"]').val();
   var pageList = $('[name = "pageListForCargo"]').val();
   $('[name = "findRegNumber"]').val(findRegNumber);
   var productType = $('[name *= "productType"]:not([name *= "_"])').val();

   ajaxVetcontrol.active++;
   req.open("GET", url + "&findRegNumber=" + encodeURIComponent(findRegNumber) + "&pageListForCargo=" + pageList + "&productType=" + productType, true);
   req.send(null);
}

function removeFile(filePk, url, req, parentId) {
   req.onreadystatechange = myCallback4;

   function myCallback4() {
      if (req.readyState == 4) {
         ajaxVetcontrol.active--;
         if (req.status == 200) {
            removeFileFromPage(req.responseXML);
         } else {
            alert("Невозможно удалить файл. Код ошибки: " + req.status);
         }
      }
   }

   function removeFileFromPage(responseXML) {
      var status = responseXML.getElementsByTagName("status")[0];
      if(status.getAttribute("success") == "true") {
         var addedPages = "";
         if (parentId != "") {
            addedPages = id$(parentId);
         } else {
            addedPages = id$("addedFiles");
         }
         addedPages.removeChild(id$("file_" + filePk));
      } else {
         alert("Ошибка при удалении файла: файл недоступен");
      }
   }

   ajaxVetcontrol.active++;
   req.open("GET", url + "&filePk=" + filePk, true);
   req.send(null);
}

function doAjaxPOST(url, req, data, onSuccess, onFail) {
   req.onreadystatechange = myCallback4;

   function myCallback4() {
      if (req.readyState == 4) {
         ajaxVetcontrol.active--;
         if (req.status == 200) {
            doCallback(req.responseXML);
         }
      }
   }

   function doCallback(responseXML) {
      var status = responseXML.getElementsByTagName("status")[0];
      if(status.getAttribute("success") == "true") {
         if (onSuccess) {
            onSuccess(responseXML);
         }
      } else if (onFail) {
         onFail(responseXML);
      }
   }

   ajaxVetcontrol.active++;
   req.open("POST", url, true);
   setRequestHeader(req);

   dataStr = $.map(data, function(value, name){
      return name + "=" + value;
   }).join("&");

   req.send(dataStr);
}

function removeEnterpriseNumber(numberPk, url, req) {
   req.onreadystatechange = myCallback5;

   function myCallback5() {

      if (req.readyState == 4) {
         ajaxVetcontrol.active--;
         if (req.status == 200) {
            removeNumberFromPage(req.responseXML);
         }
      }
   }

   function removeNumberFromPage(responseXML) {
      var status = responseXML.getElementsByTagName("status")[0];
      if(status.getAttribute("success") == "true") {
         id$("enterpriseNumber").removeChild(id$(numberPk));
      } else {
         alert("Ошибка при удалении номера: номер недоступен");
      }
   }

   ajaxVetcontrol.active++;
   req.open("GET", url + "&numberPk=" + numberPk, true);
   req.send(null);
}

function addEnterpriseNumberAJAX(number, url, req, form) {
   req.onreadystatechange = myCallback6;

   function myCallback6() {

      if (req.readyState == 4) {
         ajaxVetcontrol.active--;
         if (req.status == 200) {
            addNumberToDB(req.responseXML);
         }
      }
   }

   function addNumberToDB(responseXML) {
      var status = responseXML.getElementsByTagName("status")[0];
      if(status.getAttribute("success") == "true") {
         addEnterpriseNumber(form);
      } else {
         alert(
             "Ошибка при добавлении номера: " + (isEmpty(status.getAttribute("message")) ? "системная ошибка" : status.getAttribute("message"))
         );
      }
   }

   ajaxVetcontrol.active++;
   req.open("GET", url + "&number=" + encodeURIComponent(number), true);
   req.send(null);
}

var reqG = null;

function showAjaxResultMessage(message) {
   var $messageContainer = $('#ajax-message');
   var $messageDialog = $('#ajax-message-dialog');
   if (typeof $errorMessageContainer !== "undefined" && $messageContainer.length > 0 && $messageDialog.length > 0 && $messageDialog.hasClass('ui-dialog-content')) {
      $errorMessageContainer.html(message);
      $errorMessageDialog.dialog('open');
   } else {
      alert(message);
   }
}
function createTemplateAjax(templateName, params) {
   if(templateUrl != null && templateName != null && templateName.length > 0 && templateName.length < 250) {
      function myCallback5() {

         if (reqG.readyState == 4) {
            ajaxVetcontrol.active--;
            if (reqG.status == 200) {
               if (reqG.responseXML) {
                  templateConfirm(reqG.responseXML);
               } else {
                  templateConfirmJson(reqG.response);
               }
            }
         }
      }

      reqG.onreadystatechange = myCallback5;

      function templateConfirm(responseXML) {
         var status = responseXML.getElementsByTagName("status")[0];
         var message = "";
         if (status.getElementsByTagName("fullMessage")[0]) {
            message = status.getElementsByTagName("fullMessage")[0].innerHTML;
         }
         if(status.getAttribute("success") == "true") {
            if (isEmpty(message)) message = "Шаблон успешно создан";
         } else {
            if (isEmpty(message)) message = "Ошибка: невозможно создать шаблон";
         }
         showAjaxResultMessage(message);
      }

      function templateConfirmJson(response) {
         try {
            var json = JSON.parse(response);
            var success = json.success;
            var message = json.message;
            if (success) {
               if (isEmpty(message)) message = "Шаблон успешно создан";
            } else {
               if (isEmpty(message)) message = "Ошибка: невозможно создать шаблон";
            }
            showAjaxResultMessage(message);
         } catch (e) {
            console.error(e);
         }
      }
      ajaxVetcontrol.active++;
      reqG.open("GET", templateUrl + "&templateName=" + encodeURIComponent(templateName), true);
      reqG.send(null);
   } else if(templateUrl != null && templateName != null && (templateName.length < 1 || templateName.length > 249)) {
      if(templateName.length < 1) alert("Введите название шаблона");
      if(templateName.length > 249) alert("Слишком длинное название шаблона");
   }
}

function loadListInput(formName, elementName, parentValue, pk, edit, url, req) {
   var list = document.getElementById(elementName);
   clearList(list);

   req.onreadystatechange = myCallback3;

   function myCallback3() {

      if(req.readyState == 4) {
         ajaxVetcontrol.active--;
         if(req.status == 200) {
            doList(list, req.responseXML);
         }
      }
   }

   function doList(list, responseXML) {
      var result = responseXML.getElementsByTagName("list")[0];

      for (i = 0; i < result.getElementsByTagName("element").length; i++) {
         var element = result.getElementsByTagName("element")[i];
         var value = element.getElementsByTagName("value")[0];
         var view = element.getElementsByTagName("view")[0];
         addElementToList(list, value.childNodes[0].nodeValue, view.childNodes[0].nodeValue);
      }

      checkProducts(formName);
   }

   function checkProducts(formName) {
      var aps = document.forms[formName].elements["addedProduct"];

      if(aps != null) {
         if(isNaN(aps.length)) {
            findProduct(aps.value, formName);
         } else {
            for(i = 0; i < aps.length; i++) {
               findProduct(aps[i].value, formName);
            }
         }
      }
   }

   function findProduct(id, formName) {
      var prPk = document.forms[formName].elements["productPk"];

      if(prPk != null) {
         if(isNaN(prPk.length)) {
            if(id == prPk.value) {
               prPk.checked = true;
            }
         } else {
            for(j = 0; j < prPk.length; j++) {
               if(id == prPk[j].value) {
                  prPk[j].checked = true;
               }
            }
         }
      }
   }

   function addElementToList(list, value, view) {
      var input;
      var span;

      input = ce("input");
      input.setAttribute("id", "p" + value);
      input.setAttribute("name", "productPk");
      input.setAttribute("type", "checkbox");
      input.setAttribute("value", value);
      input.setAttribute("class", "active");
      input.setAttribute("className", "active");

      span = ce("span");
      span.setAttribute("class", "active");
      span.setAttribute("className", "active");

      var text = ct(" " + view);
      span.appendChild(input);
      span.appendChild(text);
      list.appendChild(span);
      list.appendChild(ce("br"));
   }

   function clearList(list) {
      while(list.hasChildNodes()) {
         list.removeChild(list.childNodes[0]);
      }
   }

   ajaxVetcontrol.active++;
   req.open("GET", url + "&pk=" + parentValue, true);
   req.send(null);
}

function loadEnterprise(url, enterprisePk, req, formId) {
   if(enterprisePk != null) {
      if (!formId) formId = "enterpriseAjaxShowForm";
      showAjaxProcessingImage(formId);
      function myCallback8() {
         if (req.readyState == 4) {
            ajaxVetcontrol.active--;
            if (req.status == 200) {
               showEnterpriseForm(req.responseXML);
            } else {
               hideAjaxProcessingImage(formId);
               alert("Невозможно отобразить информацию. Код ошибки: " + req.status);
            }
         }
      }

      req.onreadystatechange = myCallback8;

      function showEnterpriseForm(responseXML) {
         var htmlData = responseXML.getElementsByTagName("htmlData")[0];
         var enterprise = htmlData.getElementsByTagName("enterprise")[0];
         setInnerHTML(formId, getTextContent(enterprise));
         setWindowPosition(formId);
         document.body.style.overflow = "auto";
      }
      ajaxVetcontrol.active++;
      req.open("GET", url + "&enterprisePk=" + enterprisePk, true);
      req.send(null);
   }
}

function loadConstraint(url, constraintPk, req) {
   if(constraintPk != null) {
      showAjaxProcessingImage("constraintAjaxShowForm");

      function myCallback7() {
         if (req.readyState == 4) {
            ajaxVetcontrol.active--;
            if (req.status == 200) {
               showConstraintForm(req.responseXML);
            } else {
               hideAjaxProcessingImage("constraintAjaxShowForm");
               alert("Невозможно отобразить информацию. Код ошибки: " + req.status);
            }
         }
      }

      req.onreadystatechange = myCallback7;

      function showConstraintForm(responseXML) {
         var status = responseXML.getElementsByTagName("htmlData")[0];
         var constraint = status.getElementsByTagName("constraint")[0];
         setInnerHTML("constraintAjaxShowForm", getTextContent(constraint));
         setWindowPosition('constraintAjaxShowForm');
         document.body.style.overflow = "auto";
      }
      ajaxVetcontrol.active++;
      req.open("GET", url + "&constraintPk=" + constraintPk, true);
      req.send(null);
   }
}

/** Данная функция появилась в результате рефакторинга и обобщения.
 * Она делает следующее. С помощью асинхронного вызова производится
 * загрузка из базы всех данных по дочерним записям,
 * связанным с данной родительской записью. На основе данной информации
 * внутри соответствующего блока производится обновление стилей для нужных строк,
 * чтобы показать их выделение цветом.
 * @param url string - ссылка, по которой нужно обратиться к системе (в ней содержится название экшена).
 * @param pageListId string - идентификатор формы, данные из которых передаются через асинхронный вызов системе
 * @param req XMLHttpRequest - объект для асинхронного запроса, через который происходит взаимосвязь с системой.
 * @param parentName string - название родительской сущности (с маленькой буквы).
 * @param childName string - название дочерней сущности (с маленькой буквы).
 * @author shevchenko-dv-100705
 */
function loadChildren(url, pageListId, req, parentName, childName) {
   var currentSelectedParent = document.forms[childName + "ListAjaxForm"].elements["selected" + capitaliseFirstLetter(parentName)].value;
   if(isNaN(currentSelectedParent) || id$(parentName + "_" + currentSelectedParent) == null) {
      alert("Выберите родителя");
      return false;
   }

   function myCallback10() {
      if (req.readyState == 4) {
         ajaxVetcontrol.active--;
         if (req.status == 200) {
            showChildForm(req.responseXML);
         } else {
            alert("Невозможно отобразить информацию. Код ошибки: " + req.status);
         }
      }
   }

   req.onreadystatechange = myCallback10;

   function showChildForm(responseXML) {
      var status = responseXML.getElementsByTagName("htmlData")[0];
      var childList = status.getElementsByTagName(childName + "List")[0];
      setInnerHTML(childName + "AjaxShowForm", getTextContent(childList));
      if (document.forms[childName + "ListAjaxForm"].elements[parentName + "Changed"].value == "false") {
         id$("apsNumbers").innerHTML = id$("apsNumbersMJ").innerHTML;
         id$("storage").innerHTML = id$("storageMJ").innerHTML;
         id$("checkedap").innerHTML = id$("checkedapMJ").innerHTML;
      }
      clearList(id$("apsNumbersMJ"));
      clearList(id$("storageMJ"));
      clearList(id$("checkedapMJ"));
      id$("checkedapMJ").name = "trashMJ";

      //Highlight all the selected children
      var selectedChildren = document.forms[childName + "ListAjaxForm"].elements[childName + "Pk"];
      if (selectedChildren != null) {
         if (isNaN(selectedChildren.length)) {
            var childId = childName +"_" + selectedChildren.value;
            if (id$(childId) != null) {
               var style = getStyleCheck(id$(childId), false);
               id$(childId).setAttribute("class", style);
               id$(childId).setAttribute("className", style);
            }
         } else {
            for (var i = 0; i < selectedChildren.length; i++) {
               var childId = childName + "_" + selectedChildren[i].value;
               if (id$(childId) != null) {
                  var style = getStyleCheck(id$(childId), false);
                  id$(childId).setAttribute("class", style);
                  id$(childId).setAttribute("className", style);
               }
            }
         }
      }
   }

   function clearList(list) {
      while(list.hasChildNodes()) {
         list.removeChild(list.childNodes[0]);
      }
   }

   var data = getRequestBody(document.forms[pageListId]);
   ajaxVetcontrol.active++;
   req.open("POST", url, true);
   setRequestHeader(req);

   showLocalAjaxProcessingImageWithHeight(childName + "AjaxShowForm", 1000);

   req.send(data);
}

function loadParentWithChildren(url, pageListId, req, parentName, childName, loadChildAction, additionalParams) {
   function myCallback10() {
      if (req.readyState == 4) {
         ajaxVetcontrol.active--;
         if (req.status == 200) {
            showChildForm(req.responseXML);
         } else {
            alert("Невозможно отобразить информацию. Код ошибки: " + req.status);
         }
      }
   }

   req.onreadystatechange = myCallback10;

   function showChildForm(responseXML) {
      var status = responseXML.getElementsByTagName("htmlData")[0];
      var parentList = status.getElementsByTagName(parentName + "List")[0];
      setInnerHTML(parentName + "sAjaxShowForm", getTextContent(parentList));
      id$(childName + "AjaxShowForm").innerHTML = "";
      var selectedId = "selected" + capitaliseFirstLetter(parentName);
      document.forms[childName + "ListAjaxForm"].elements[selectedId].value = "";
      //select first user
      if(checkWasParentChanged(childName + 'ListAjaxForm', parentName)) {
         var firstId = "first" + capitaliseFirstLetter(parentName);
         if(id$(firstId) != null) {
            var firstParents = id$(firstId).getElementsByTagName("td");
            if(isNaN(firstParents.length)) {
               firstParent = firstParents.getAttribute("id");
            } else {
               for(var i = 0; i < firstParents.length; i++) {
                  if(firstParents[i].getAttribute("id") != null && startsWith(firstParents[i].getAttribute("id"), parentName)) {
                     firstParent = firstParents[i].getAttribute("id");
                     break;
                  }
               }
            }
            if(firstParent != null) {
               var firstParentId = firstParent.substring(parentName.length + 1, firstParent.length);
               loadParentEntity(parentName, firstParentId, childName);
               loadChildren('operatorui?_action=' + loadChildAction+'&' + additionalParams, childName + 'ListAjaxForm', init(), parentName, childName);
            }
         }
      }
   }

   var data = getRequestBody(document.forms[pageListId]);

   ajaxVetcontrol.active++;
   req.open("POST", url, true);
   setRequestHeader(req);

   showLocalAjaxProcessingImageWithHeight(parentName + "sAjaxShowForm", 1000);

   req.send(data);
}

function loadCompany(url, pageListId, req) {
   loadChildren(url, pageListId, req, "user", "company");
}

// Это новая функция, которая является аналогом loadCompany,
// только она подгружает список предприятий из таблицы Enterprise
function loadEnterprise2(url, pageListId, req) {
   loadChildren(url, pageListId, req, "user", "enterprise");
}

function getRequestBody(oForm) {
   var aParams = new Array();
   if(oForm != null) {
      for(var i = 0; i < oForm.elements.length; i++) {
         var elem = oForm.elements[i];

         //Не включаем в параметры отключенные элементы
         if (elem.disabled) {
            continue;
         }

         //Если элемент чекбокс или радиобаттон, то надо проверить, отметил ли его пользователь
         if (((elem.type ==  "checkbox" || elem.type == "radio") && elem.checked)
             || (elem.type != "checkbox" && elem.type != "radio")) {

            $(elem).map(function() {
               return $(this).val();
            }).each(function(){
               var sParam = encodeURIComponent(oForm.elements[i].name);
               sParam += "=";
               sParam += encodeURIComponent(this);
               aParams.push(sParam);
            });
         }
      }
   }
   //Доавляем к запросу таймштамп, чтобы браузер не кэшировал аджаксовые списки
   aParams.push("timestamp=" + new Date().getTime());
   return aParams.join("&");
}

function hideLayoutForm(id, elem) {
   if (elem) {
      id = $(elem).closest("#printform_ww").parent().attr("id");
   }

   if(id$(id) != null) {
      id$(id).innerHTML = "";
   } else if(id$("winAjaxShowForm") != null) {
      id$("winAjaxShowForm").innerHTML = "";
   }
   document.body.style.overflow = "auto";
}

function showLocalAjaxProcessingImage(parentId) {
   if(id$(parentId) != null) {
      if(id$(parentId).nodeName == "TABLE" || id$(parentId).nodeName == "TBODY") {
         if(ie()) {
            trySetInnerHtml(id$(parentId), "<div id=\"ajax_loader\"><div id=\"preloader\"></div></div>");
         } else {
            id$(parentId).innerHTML =
                "<tr><td><div id=\"ajax_loader\"><div id=\"preloader\"></div></div></td></tr>";
         }
      } else {
         id$(parentId).innerHTML =
             "<div id=\"ajax_loader\"><div id=\"preloader\"></div></div>";
      }
      new imageLoader(preloaderImg, 'startAnimation()');
   }
}

function showLocalAjaxLoader(parentId) {
   var loader = '<div id="loading-spinner-container">' +
                  '<div id="loading-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>' +
                '</div>';
   if(id$(parentId) != null) {
      if(id$(parentId).nodeName == "TABLE" || id$(parentId).nodeName == "TBODY") {
         if(ie()) {
            trySetInnerHtml(id$(parentId), loader);
         } else {
            id$(parentId).innerHTML = loader;
         }
      } else {
         id$(parentId).innerHTML = loader;
      }
   }
}

function showLocalAjaxProcessingImageWithHeight(parentId, height) {
   trySetInnerHtml(id$(parentId), "<div id=\"ajax_loader\" style=\"height:"
       + height + "px;\"><div id=\"preloader\"></div></div>");
   new imageLoader(preloaderImg, 'startAnimation()');
}

function showAjaxProcessingImage(parentId) {
   trySetInnerHtml(id$(parentId),
       "<div id=\"printform_ovrl\">&nbsp;</div>" +
       "<div id=\"ajax_loader\"><div id=\"preloader\"></div></div>");
   new imageLoader(preloaderImg, 'startAnimation()');
}

function hideAjaxProcessingImage(parentId) {
   clearHTMLData(parentId);
}

function loadCheckList(elementName, url, req, checkboxName) {
   var list = document.getElementById(elementName);
   if (list == null) {
      list = document.getElementsByTagName("table")[0];
   }
   list = list.getElementsByTagName("tbody")[0];

   //clearCheckList(list);
   var frame = ce("tr");
   var td = ce("td");

   var loading = ce("span");
   var textNode = ct("загрузка данных...");
   loading.appendChild(textNode);

   td.appendChild(loading);
   frame.appendChild(td);
   list.appendChild(frame);

   req.onreadystatechange = myCallback3;

   function myCallback3() {
      if (req.readyState == 4) {
         ajaxVetcontrol.active--;
         if (req.status == 200) {
            doList(list, req.responseXML);
         }
      }
   }

   function doList(list, responseXML) {
      clearCheckList(list);
      var result = responseXML.getElementsByTagName("list")[0];

      for (i = 0; i < result.getElementsByTagName("element").length; i++) {
         var element = result.getElementsByTagName("element")[i];
         var value = element.getElementsByTagName("value")[0];
         var view = element.getElementsByTagName("view")[0];

         addElementToCheckList(list, value.childNodes[0].nodeValue, view.childNodes[0].nodeValue);
      }
   }

   function addElementToCheckList(list, value, view) {
      var frame = ce("tr");
      var td = ce("td");

      var label = ce("label");
      var option = ce("input");
      var textNode = ct(view);
      option.setAttribute("type", "checkbox");
      option.setAttribute("name", checkboxName)
      option.setAttribute("value", value);
      label.appendChild(option);
      label.appendChild(textNode);

      td.appendChild(label);
      frame.appendChild(td);
      list.appendChild(frame);
   }

   function clearCheckList(list) {
      if (list != null) {
         while(list.hasChildNodes()) {
            list.removeChild(list.childNodes[0]);
         }
      }
   }

   ajaxVetcontrol.active++;
   req.open("GET", url, true);
   req.send(null);
}

function checkWasUserChanged(companyForm) {
   return checkWasParentChanged(companyForm, "user");
}

function checkWasParentChanged(childForm, parentName) {
   var changed = parentName + "Changed";
   if(document.forms[childForm].elements[changed].value == "true") {
      var ok = confirm("Текущий родитель был изменен.\nПри выборе другого родителя несохраненные изменения будут утеряны.\nПродолжить?");
      if(ok) {
         document.forms[childForm].elements[changed].value = "false";
      }

      return ok;
   }

   return true;
}

/**
 * Данная функция меняет строку, делая ее первую букву заглавной.
 * @param name string - исходная строка.
 * @return string - новую строку, с заглавной первой буквой.
 * @assumption Данная функция предполагает, что name - не пустая строка и не null.
 * @author shevchenko-dv-100705
 */
function capitaliseFirstLetter(name) {
   return name.charAt(0).toUpperCase() + name.substr(1);
}

/**
 * Данная функция создана в результате рефакторинга, и выделяет цветом выбранную
 * пользователем сущность, а также записывает ее как скрытое значение внутри дочернего блока.
 * @param parentName string - название родителя, для которого производится подгрузка дочерних сущностей.
 * @param pk int - первичный ключ родителя, для которого производится данная манипуляция.
 * @param childName string - название дочерней сущности (определяет название соответствующих блоков).
 * @assumption Данная функция строится исходя из следующих предположений:
 * 1. На странице есть элемент с идентификатором parentName + "_" + pk, стиль которого функция должна изменить.
 * 2. На странице есть форма с идентификатором childName + "ListAjaxForm".
 * 3. Внутри этой формы есть скрытое поле с идентификатором selected + parentName (с большой буквы).
 * 4. Это поле может быть и пустым. Если его значение не пусто, то оно содержит идентификатор предыдущей выбранной  родительской сущности.
 * 5. Если значение поля не пустое, то на странице должен быть элемент с идентификатором parentName + [значение поля].
 *    Его стиль функция тоже должна изменить (снять выделение).
 * @author shevchenko-dv-100705
 **/
function loadParentEntity(parentName, pk, childName) {
   var parentId = parentName + "_" + pk;
   var selectedId = "selected" + capitaliseFirstLetter(parentName);
   var style = getStyleCheck(id$(parentId), false);

   var currentSelectedParent = document.forms[childName + "ListAjaxForm"].elements[selectedId].value;
   if(!isNaN(currentSelectedParent) && id$(parentName + "_" + currentSelectedParent) != null) {
      var selectedId2 = parentName + "_" + currentSelectedParent;
      id$(selectedId2).setAttribute("class", getStyleCheck(id$(selectedId2), true));
      id$(selectedId2).setAttribute("className", getStyleCheck(id$(selectedId2), true));
   }

   id$(parentId).setAttribute("class", style);
   id$(parentId).setAttribute("className", style);
   document.forms[childName + "ListAjaxForm"].elements[selectedId].value = pk;
}

// Эта функция - аналог loadUserCompany, только для предприятий Enterprise
function loadUserEnterprise(userPk) {
   loadParentEntity("user", userPk, "enterprise");
}

function loadUserCompany(userPk) {
   loadParentEntity("user", userPk, "company");
}

/**
 * Данный метод появился в результате рефакторинга и обобщения. Он производит сохранение
 * на уровне базы сведений о дочерних записях, связанных с родительской.
 * @param saveUrl string - адрес, содержащий внутри название экшена обработки для сохранения данных в базе
 * @param loadUrl string - адрес, назначение которого непонятно зачем.
 * @param pageListId string - идентификатор формы, содержимое которой передается в качестве параметров запроса к системе
 * @param req XmlHttpRequest - объект для асинхронного взаимодействия с системой.
 * @param parentName string - название родительской сущности (с маленькой буквы).
 * @param childName string - название дочерней сущности (с маленькой буквы).
 * @author shevchenko-dv-100705
 */
function saveParentChildren(saveUrl, loadUrl, pageListId, req, parentName, childName) {
   var selectedId = "selected" + capitaliseFirstLetter(parentName);
   var currentSelectedParent = document.forms[childName + "ListAjaxForm"].elements[selectedId].value;

   if(isNaN(currentSelectedParent) || id$(parentName + "_" + currentSelectedParent) == null) {
      alert("Выберите родителя");
      return false;
   }

   if(document.forms[childName + "ListAjaxForm"].elements[parentName + "Changed"].value == "false") {
      alert("Выбранный родитель не был изменен");
      return false;
   }

   showAjaxProcessingImage(childName + "AjaxShowForm");

   function myCallback11() {

      if (req.readyState == 4) {
         ajaxVetcontrol.active--;
         if (req.status == 200) {
            saveChild(req.responseXML);
         } else {
            hideAjaxProcessingImage(childName + "AjaxShowForm");
            alert("Невозможно выполнить действие. Код ошибки: " + req.status);
         }
      }
   }

   function saveChild(responseXML) {
      var status = responseXML.getElementsByTagName("status")[0];
      hideAjaxProcessingImage(childName + "AjaxShowForm");
      if(status.getAttribute("success") == "false") {
         var message = responseXML.getElementsByTagName("message")[0];
         if(message != null && message.childNodes != null && message.childNodes[0] != null) {
            alert("Произошла ошибка при сохранении информации: " + message.childNodes[0].nodeValue);
         } else {
            alert("Произошла ошибка при сохранении информации");
         }
      }
      document.forms[childName + "ListAjaxForm"].elements[parentName + "Changed"].value = "false";
      loadChildren(loadUrl, pageListId, init(), parentName, childName);
   }

   req.onreadystatechange = myCallback11;

   var data = getRequestBody(document.forms[pageListId]);

   ajaxVetcontrol.active++;
   req.open("POST", saveUrl, true);
   setRequestHeader(req);
   req.send(data);

}

function saveUserCompany(saveUrl, loadUrl, pageListId, req) {
   return saveParentChildren(saveUrl, loadUrl, pageListId, req, "user", "company");
}

// Эта функция - аналог saveUserCompany, но для предприятий из Enterprise
function saveUserEnterprise(saveUrl, loadUrl, pageListId, req) {
   return saveParentChildren(saveUrl, loadUrl, pageListId, req, "user", "enterprise");
}


function selectCompany(companyPk, companyForm) {
   selectChild(companyForm, "user");
}

function selectChild(formName, parentName) {
   document.forms[formName].elements[parentName + "Changed"].value = "true";
}

function removeEnterpriseDirectionFile(url, filePk, req) {
   req.onreadystatechange = myCallback12;

   function myCallback12() {
      if (req.readyState == 4) {
         ajaxVetcontrol.active--;
         if (req.status == 200) {
            removeEDFileFromPage(req.responseXML);
         }
      }
   }

   function removeEDFileFromPage(responseXML) {
      var status = responseXML.getElementsByTagName("status")[0];
      var filesExists = $("[id = fileExists_" + filePk + "]");
      var filesDoesNotExists = $("[id = fileDoesNotExists_" + filePk + "]");

      if(status.getAttribute("success") == "true") {
         id$("fileExists_" + filePk).style.display = "none";
         id$("fileDoesNotExists_" + filePk).style.display = "block";
         filesExists.each(function(){
            this.style.display = "none";
         });
         filesDoesNotExists.each(function(){
            this.style.display = "block";
         });
         alert("Файл успешно удален");
      } else {
         alert("Ошибка при удалении файла: файл недоступен");
      }
   }

   ajaxVetcontrol.active++;
   req.open("GET", url + "&enterpriseDirectionPk=" + filePk, true);
   req.send(null);
}

function selectMainCompany(value) {
   document.forms["companyListAjaxForm"].elements["mainCompany"].value = value;
}

function selectMainCompanyUser(value) {
   if(value != null) {
      document.forms["userListAjaxForm"].elements["mainCompany"].value = value;
      document.forms["userListAjaxForm"].elements["mainCompany"].onchange();
   } else {
      document.forms["userListAjaxForm"].elements["mainCompany"].value = "null";
      document.forms["userListAjaxForm"].elements["mainCompany"].onchange();
   }
}

function createUserTemplate() {
   clearTemplate();

   var checkedap = id$("checkedap").options;

   var attrClassName = ie() ? "className" : "class";

   if(isNaN(checkedap.length)) {
      if(!startsWith(id$(checkedap.value).getAttribute(attrClassName), "activeOk")) {
         var option = ce("option");
         var textNode = ct(checkedap.innerHTML);
         option.setAttribute("value", checkedap.value);
         option.appendChild(textNode);
         id$("template").appendChild(option);
      }
   } else {
      for(var i = 0; i < checkedap.length; i++) {
         var impl = $(checkedap[i]).data("impl");
         var currentClass = $(checkedap[i]).data("class");
         if(
             impl === "new" && startsWith(currentClass, "activeChecked") ||
             startsWith(id$(checkedap[i].value).getAttribute(attrClassName), "activeOkChecked")
         ) {
            var option = ce("option");
            var textNode = ct(checkedap[i].innerHTML);
            option.setAttribute("value", checkedap[i].value);
            option.appendChild(textNode);
            $(option).data("impl", impl);
            $(option).data("class", currentClass);
            id$("template").appendChild(option);
            if (startsWith(checkedap[i].value, "enterprise_")) {
                var enterprisePk = checkedap[i].value.substring("enterprise_".length, checkedap[i].value.length);
                var locationKey = $("#storage input[name='" + enterprisePk + "']");
                if (locationKey !== null) {
                    $("#template").after($('<input>').attr({"type": "hidden", "name": enterprisePk, "value": locationKey.val()}));
                }
            }
         }
      }
   }
}

function clearTemplate() {
   clearHTMLData("template");
}

function applyTemplate() {
   var templateCompany = id$("template").options;

   var attrClassName = ie() ? "className" : "class";

   if(isNaN(templateCompany.length)) {
      if(!startsWith(id$(templateCompany.value).getAttribute(attrClassName), "activeOk")) {
         var companyPk = templateCompany.value.substring("company_".length, templateCompany.value.length);
         selectCompany(companyPk, "companyListAjaxForm");
         setStoredElement3("company_" + companyPk, "companyListAjaxForm", "ap", "companyPk", "", companyPk, true);
      }
   } else {
      for(var i = 0; i < templateCompany.length; i++) {
         if(id$(templateCompany[i].value) === null || (
                 !startsWith(id$(templateCompany[i].value).getAttribute(attrClassName), "activeOkChecked") &&
                 !startsWith(id$(templateCompany[i].value).getAttribute(attrClassName), "activeChecked"))) {
            var companyPk = templateCompany[i].value.substring("company_".length, templateCompany[i].value.length);
            selectCompany(companyPk, "companyListAjaxForm");
            setStoredElement3("company_" + companyPk, "companyListAjaxForm", "ap", "companyPk", "", companyPk, true);
         }
      }
   }
}

// Это аналог функции applyTemplate, но для предприятий из Enterprise
function applyTemplate2() {
   var templateEnterprise = id$("template").options;

   var attrClassName = ie() ? "className" : "class";

   if(isNaN(templateEnterprise.length)) {
      if(!startsWith(id$(templateEnterprise.value).getAttribute(attrClassName), "activeOk")) {
         var enterprisePk = templateEnterprise.value.substring("enterprise_".length, templateEnterprise.value.length);
         selectCompany(enterprisePk, "enterpriseListAjaxForm");
         setStoredElement3("enterprise_" + enterprisePk, "enterpriseListAjaxForm", "ap", "enterprisePk", "", enterprisePk, true);
      }
   } else {
      for(var i = 0; i < templateEnterprise.length; i++) {
         var impl = $(templateEnterprise[i]).data("impl");
         if(id$(templateEnterprise[i].value) === null || (
             !startsWith(id$(templateEnterprise[i].value).getAttribute(attrClassName), "activeOkChecked") &&
             !startsWith(id$(templateEnterprise[i].value).getAttribute(attrClassName), "activeChecked"))) {
            var enterprisePk = templateEnterprise[i].value.substring("enterprise_".length, templateEnterprise[i].value.length);
            selectCompany(enterprisePk, "enterpriseListAjaxForm");
            setStoredElement3("enterprise_" + enterprisePk, "enterpriseListAjaxForm", "ap", "enterprisePk", "", enterprisePk, true);
            var locationKey = $("#template").parent().find("input[name='" + enterprisePk + "']");
            if (locationKey !== null) {
               $("#storage").append($('<input>').attr({"type": "hidden", "name": enterprisePk, "value": locationKey.val()}));
            }
         }
      }
   }
}

function applyTemplate3() {
   var templateEnterprise = id$("template").options;

   var attrClassName = ie() ? "className" : "class";

   if(isNaN(templateEnterprise.length)) {
      if(!startsWith(id$(templateEnterprise.value).getAttribute(attrClassName), "activeOk")) {
         var firmPk = templateEnterprise.value.substring("firmAux_".length, templateEnterprise.value.length);
         selectChild("firmAuxListAjaxForm", "enterprise");
         setStoredElement3("firmAux_" + firmPk, "firmAuxListAjaxForm", "ap", "firmAuxPk", "", firmPk);
      }
   } else {
      for(var i = 0; i < templateEnterprise.length; i++) {
         if(!startsWith(id$(templateEnterprise[i].value).getAttribute(attrClassName), "activeOk")) {
            var firmPk = templateEnterprise[i].value.substring("firmAux_".length, templateEnterprise[i].value.length);
            selectChild("firmAuxListAjaxForm", "enterprise");
            setStoredElement3("firmAux_" + firmPk, "firmAuxListAjaxForm", "ap", "firmAuxPk", "", firmPk);
         }
      }
   }
}

function deleteImportCountryFromAct(url, countryPk, req, actPk) {
   req.onreadystatechange = myCallback14;

   function myCallback14() {

      if (req.readyState == 4) {
         ajaxVetcontrol.active--;
         if (req.status == 200) {
            deleteImportCountryFromPage(req.responseXML);
         }
      }
   }

   function deleteImportCountryFromPage(responseXML) {
      var status = responseXML.getElementsByTagName("status")[0];
      if (status.getAttribute("success") == "true") {
         var importCountySpan = id$("ic_" + countryPk);
         var importCountrySpan2 = importCountySpan.cloneNode(true);
         importCountrySpan2.removeChild(importCountrySpan2.getElementsByTagName("a")[0]);
         id$("unusedCountries").appendChild(importCountrySpan2);
         id$("act_" + actPk).removeChild(importCountySpan);
      } else {
         alert("Ошибка при удалении файла: файл недоступен");
      }
   }
   ajaxVetcontrol.active++;
   req.open("GET", url + "&countryPk=" + countryPk, true);
   req.send(null);
}

function showImportCountryChooseForm(url, allowedProductionPk, req, actPk, formName) {
   req.onreadystatechange = myCallback15;

   function myCallback15() {

      if (req.readyState == 4) {
         ajaxVetcontrol.active--;
         if (req.status == 200) {
            showForm(req.responseXML);
         }
      }
   }

   function showForm(responseXML) {
      var list = document.getElementById("unselectedIC");
      list = list.getElementsByTagName("tbody")[0];
      document.forms[formName].elements["actPk"].value = actPk;

      clearCheckList(list);

      var result = responseXML.getElementsByTagName("list")[0];
      var textareaOvrl = window.document.getElementById("aep_ovrl");
      var textareaWw = window.document.getElementById("aep_ww");
      if (textareaOvrl != null && textareaWw != null) {
         document.body.style.overflow = "auto";
         textareaOvrl.style.display = "";
         textareaWw.style.display = "";
      }

      for (var i = 0; i < result.getElementsByTagName("element").length; i++) {
         var element = result.getElementsByTagName("element")[i];
         var value = element.getElementsByTagName("value")[0];
         var view = element.getElementsByTagName("view")[0];

         addElementToCheckList(list, value.childNodes[0].nodeValue, view.childNodes[0].nodeValue);
      }

      function addElementToCheckList(list, value, view) {
         var frame = ce("tr");
         var td = ce("td");
         var label = ce("label");
         var option = ce("input");
         var textNode = ct(view);
         option.setAttribute("type", "checkbox");
         option.setAttribute("value", value);
         option.setAttribute("name", "selectImportCountries");
         label.appendChild(option);
         label.appendChild(textNode);

         td.appendChild(label);
         frame.appendChild(td);
         list.appendChild(frame);
      }

      function clearCheckList(list) {
         if (list != null) {
            while(list.hasChildNodes()) {
               list.removeChild(list.childNodes[0]);
            }
         }
      }
   }
   ajaxVetcontrol.active++;
   req.open("GET", url + "&statusPk=" + allowedProductionPk, true);
   req.send(null);
}

function getRequestBodyWithCheckboxes(oForm) {
   var aParams = new Array();
   if(oForm != null) {
      for(var i = 0; i < oForm.elements.length; i++) {
         if (oForm.elements[i].getAttribute("type") == "checkbox") {
            if (oForm.elements[i].checked) {
               var sParam = encodeURIComponent(oForm.elements[i].name);
               sParam += "=";
               sParam += encodeURIComponent(oForm.elements[i].value);
               aParams.push(sParam);
            }
         } else {
            var sParam = encodeURIComponent(oForm.elements[i].name);
            sParam += "=";
            sParam += encodeURIComponent(oForm.elements[i].value);
            aParams.push(sParam);
         }
      }
   }
   return aParams.join("&");
}

function addImportCountriesToAct(url, pk, req, formName) {
   req.onreadystatechange = myCallback16;

   function myCallback16() {
      if (req.readyState == 4) {
         ajaxVetcontrol.active--;
         if (req.status == 200) {
            addImportCountries(req.responseXML);
         }
      }
   }

   function addImportCountries(responseXML) {
      var result = responseXML.getElementsByTagName("list")[0];

      for (var i = 0; i < result.getElementsByTagName("element").length; i++) {
         var element = result.getElementsByTagName("element")[i];
         //тут хранится значение ПК добавленного предприятия.
         var value = element.getElementsByTagName("value")[0];

         var addedElement = document.getElementById("ic_" + value.childNodes[0].nodeValue);
         var actPk = document.forms[formName].elements['actPk'].value;
         var actTable = document.getElementById("act_" + actPk);
         var newAddedElement = addedElement.cloneNode(true);
         var link = ce("a");
         var spaces = ct(" ");
         link.setAttribute("href", "javascript:deleteImportCountryFromAct('operatorui?_action=deleteImportCountryFromAct&countryVersion=" + value.childNodes[0].nodeValue + "&actPk=" + actPk + "', '" + value.childNodes[0].nodeValue + "', init(), "+ actPk +")");

         newAddedElement.insertBefore(spaces, newAddedElement.firstChild);
         newAddedElement.insertBefore(link, newAddedElement.firstChild);

         var img = ce("img");
         img.setAttribute("src", "/vetcontrol-docs/common/img/remove.gif");
         link.appendChild(img);
         actTable.appendChild(newAddedElement);

         id$("unusedCountries").removeChild(addedElement);
      }

      var textareaOvrl = window.document.getElementById("aep_ovrl");
      var textareaWw = window.document.getElementById("aep_ww");

      if (textareaOvrl != null && textareaWw != null) {
         document.body.style.overflow = "auto";
         textareaOvrl.style.display = textareaWw.style.display = "none";
      }
   }
   var data = getRequestBodyWithCheckboxes(document.forms[formName]);

   ajaxVetcontrol.active++;
   req.open("POST", url, true);
   setRequestHeader(req);
   req.send(data);
}

function deleteEnterpriseAct(url, pk, req) {
   req.onreadystatechange = myCallback17;

   function myCallback17() {

      if (req.readyState == 4) {
         ajaxVetcontrol.active--;
         if (req.status == 200) {
            deleteEnterpriseActFromForm(req.responseXML);
         }
      }
   }

   function deleteEnterpriseActFromForm(responseXML) {
      var status = responseXML.getElementsByTagName("status")[0];
      if (status.getAttribute("success") == "true") {
         var deleteLink = id$("delete_act_" + pk);
         deleteLink.style.display = "none";
         deleteLink.parentNode.appendChild(ct("(файл удалён)"));
      } else {
         alert("Ошибка при удалении файла: файл недоступен");
      }
   }

   ajaxVetcontrol.active++;
   req.open("GET", url + "&actPk=" + pk, true);
   req.send(null);
}

function loadAllowedProduction(url, enterprisePk, req) {
   if(enterprisePk != null) {
      function myCallback14() {
         if (req.readyState == 4) {
            ajaxVetcontrol.active--;
            if (req.status == 200) {
               showAllowedProductionForm(req.responseXML);
            } else {
               alert("Невозможно отобразить информацию. Код ошибки: " + req.status);
            }
         }
      }

      req.onreadystatechange = myCallback14;

      function showAllowedProductionForm(responseXML) {
         var status = responseXML.getElementsByTagName("htmlData")[0];
         var apList = status.getElementsByTagName("allowedProductionList")[0];
         setInnerHTML("productions", getTextContent(apList));
      }

      ajaxVetcontrol.active++;
      req.open("GET", url + "&enterprise=" + enterprisePk, true);
      req.send(null);
   } else {
      alert("Не выбрано предприятие");
   }
}

function selectEnterprise(enterprisePk, parentHTML) {
   if(enterprisePk != null) {
      document.forms["contractAddForm"].elements["enterprise"].value = enterprisePk;
      clearHTMLData("enterpriseAjaxListForm");
      displayTableRow(true, "selectedEnterpriseBlock");
      id$("selectedEnterprise").innerHTML = parentHTML;
      document.forms["contractAddForm"].elements["enterpriseView"].value = parentHTML;
   } else {
      alert("Не выбрано предприятие");
   }
}

function selectEnterpriseFirm(enterprisePk, commonEnterpriseNumber, parentHTML) {
   if(enterprisePk != null && commonEnterpriseNumber != null) {
      document.forms["contractAddForm"].elements["enterprise"].value = enterprisePk;
      document.forms["contractAddForm"].elements["commonEnterpriseNumber"].value = commonEnterpriseNumber;
      clearHTMLData("enterpriseAjaxListForm");
      displayTableRow(true, "selectedEnterpriseBlock");
      id$("selectedEnterprise").innerHTML = parentHTML;
      document.forms["contractAddForm"].elements["enterpriseView"].value = parentHTML;
   } else {
      alert("Не выбрано предприятие");
   }
}

function showUnloadingPlace() {
   if (id$("unloadingPlace") != null && id$("unloadingPlace-address") != null) {
      displayTableRow(true, "unloadingPlace");
      displayTableRow(true, "unloadingPlace-address");
   }
}

function selectFirm(firmPk, commonHSNumber, parentHTML) {
   if(firmPk != null && commonHSNumber != null) {
      if(document.forms["contractAddForm"].elements["firm"] != null) {
         document.forms["contractAddForm"].elements["firm"].value = firmPk;
      }
      if(document.forms["contractAddForm"].elements["firmPk"] != null) {
         document.forms["contractAddForm"].elements["firmPk"].value = firmPk;
      }
      if(document.forms["contractAddForm"].elements["commonHSNumber"] != null) {
         document.forms["contractAddForm"].elements["commonHSNumber"].value = commonHSNumber;
      }
      if(document.forms["contractAddForm"].elements["firmView"] != null) {
         document.forms["contractAddForm"].elements["firmView"].value = parentHTML;
      }

      clearHTMLData("firmAjaxListForm");
      displayTableRow(true, "selectedFirmBlock");
      id$("selectedFirm").innerHTML = parentHTML;

      if(id$("warehouseRegion") != null && id$("storagePointForm") != null) {
         displayTableRow(true, "warehouseRegion");
         displayTableRow(true, "storagePointForm");
         clearHTMLData("warehouseListForm");
         loadList("contractAddForm", "warehouseRegion", firmPk, null, false, "operatorui?_action=loadRegionListByFirmWarehouse", init());
      }
      showUnloadingPlace();

       if(document.forms["contractAddForm"].elements["firm"] != null) {
           $(document.forms["contractAddForm"].elements["firm"]).trigger('change');
       }

       if(document.forms["contractAddForm"].elements["commonHSNumber"] != null) {
          $(document.forms["contractAddForm"].elements["commonHSNumber"]).trigger('change');
       }
   } else {
      alert("Не выбран хозяйствующий субъект");
   }
}

function selectFirmGuidCommon(fieldName, firmGuid, parentHTML) {
   if (firmGuid != null) {
      if(document.forms["contractAddForm"].elements[fieldName + ".guid"] != null) {
         document.forms["contractAddForm"].elements[fieldName + ".guid"].value = firmGuid;
      }
      if(document.forms["contractAddForm"].elements[fieldName + ".firmTemplate"] != null) {
         document.forms["contractAddForm"].elements[fieldName + ".firmTemplate"].value = parentHTML;
      }

      clearHTMLData(fieldName + "_ajaxListForm");
      displayTableRow(true, "selected_" + fieldName + "_block");
      id$("selected_" + fieldName).innerHTML = parentHTML;
   } else {
      alert("Не выбран хозяйствующий субъект");
   }
}

function selectSender(firmPk, commonHSNumber, parentHTML) {
   if(firmPk != null && commonHSNumber != null) {
      document.forms["contractAddForm"].elements["sender"].value = firmPk;
      document.forms["contractAddForm"].elements["senderCommonHSNumber"].value = commonHSNumber;
      clearHTMLData("senderAjaxListForm");
      displayTableRow(true, "selectedSenderBlock");
      id$("selectedSender").innerHTML = parentHTML;
      document.forms["contractAddForm"].elements["senderView"].value = parentHTML;
      id$("saveTemplate").disabled = false;
   } else {
      alert("Не выбран хозяйствующий субъект");
   }
}



function selectViaFirm(firmPk, commonHSNumber, parentHTML) {
   if(firmPk != null && commonHSNumber != null) {
      document.forms["contractAddForm"].elements["viaFirm"].value = firmPk;
      document.forms["contractAddForm"].elements["viaCommonHSNumber"].value = commonHSNumber;
      clearHTMLData("viaFirmAjaxListForm");
      displayTableRow(true, "selectedViaFirmBlock");
      id$("selectedViaFirm").innerHTML = parentHTML;
      document.forms["contractAddForm"].elements["viaFirmView"].value = parentHTML;
   } else {
      alert("Не выбран хозяйствующий субъект");
   }
}

function loadHTMLDataVCHack(url, formName, parentId, req, callback) {
   if (!document.forms[formName] && document.forms['decisionShowForm']) {
      formName = 'decisionShowForm'
   }
   loadHTMLData(url, formName, parentId, req, callback)
}

function loadHTMLData(url, formName, parentId, req, callback, useCssLoader) {
   function myCallback15() {
      if (req.readyState == 4) {
         ajaxVetcontrol.active--;
         if (req.status == 200) {
            showHTMLData(req.responseXML);
            callback && callback();
         } else {
            alert("Невозможно отобразить информацию. Код ошибки: " + req.status);
         }
      }
   }

    req.onreadystatechange = myCallback15;

    function showHTMLData(responseXML) {
        var htmlData = responseXML.getElementsByTagName("htmlData")[0];
        var data = htmlData.getElementsByTagName("data")[0];
        if(id$(parentId) != null) {
            setInnerHTML(parentId, getTextContent(data));
        }
        var executeOnLoadData = htmlData.getElementsByTagName("executeOnLoad")[0];
        if (executeOnLoadData != null) {
            eval(trim(getTextContent(executeOnLoadData)));
        }
        setWindowPosition(parentId);
    }

    var data = getRequestBody(document.forms[formName]);

    ajaxVetcontrol.active++;
    req.open("POST", url, true);
    setRequestHeader(req);

    if (useCssLoader) {
       showLocalAjaxLoader(parentId)
    } else {
       showLocalAjaxProcessingImage(parentId)
    }

    req.send(data);
}

function clearHTMLData(parentId) {
   var parent = id$(parentId);
   if(needIEHack(parent)) {
      while (parent.firstChild) {
         parent.removeChild(parent.firstChild);
      }
   } else {
      if(parent != null) {
         parent.innerHTML = "";
      }
   }
   return true;
}

function loadHTMLList(url, method, formName, req) {

   function myCallback15() {

      if (req.readyState == 4) {
         ajaxVetcontrol.active--;
         if (req.status == 200) {
            showHTMLList(req.responseXML);
         } else {
            alert("Невозможно отобразить информацию. Код ошибки: " + req.status);
         }
      }
   }

   req.onreadystatechange = myCallback15;

   function showHTMLList(responseXML) {
      var htmlData = responseXML.getElementsByTagName("htmlData")[0];
      var listContent = htmlData.getElementsByTagName("listContent")[0];
      setInnerHTML("listContent", getTextContent(listContent));
      var listTitle = htmlData.getElementsByTagName("listTitle")[0];
      var title = getTextContent(listTitle);
      if (title && title.length) {
         setInnerHTML("listTitle", title);
      }
      var executeOnLoadData = htmlData.getElementsByTagName("executeOnLoad")[0];
      if (executeOnLoadData != null) {
         eval(trim(getTextContent(executeOnLoadData)));
      }
   }

   var data = null;
   ajaxVetcontrol.active++;
   data = getRequestBody(document.forms[formName]);
   req.open("POST", url, true);

   setRequestHeader(req);

   showLocalAjaxProcessingImage("listContent");

   req.send(data);
}

function loadHTMLListContinues(url, method, formName, req) {

   function myCallback15() {

      if (req.readyState == 4) {
         ajaxVetcontrol.active--;
         if (req.status == 200) {
            showHTMLList(req.responseXML);
         } else {
            alert("Невозможно отобразить информацию. Код ошибки: " + req.status);
         }
      }
   }

   req.onreadystatechange = myCallback15;

   function showHTMLList(responseXML) {
      var htmlData = responseXML.getElementsByTagName("htmlData")[0];
      var listContent = htmlData.getElementsByTagName("listContent")[0];
      $('#listContent').append(getTextContent(listContent));
      var listTitle = htmlData.getElementsByTagName("listTitle")[0];
      setInnerHTML("listTitle", getTextContent(listTitle));
      var executeOnLoadData = htmlData.getElementsByTagName("executeOnLoad")[0];
      if (executeOnLoadData != null) {
         eval(trim(getTextContent(executeOnLoadData)));
      }
      $('#ajax_loader').remove();
   }

   var data = null;
   ajaxVetcontrol.active++;
   data = getRequestBody(document.forms[formName]);
   req.open("POST", url, true);

   setRequestHeader(req);

   $("#listContent").append('<div id="ajax_loader"><div id="preloader"></div></div>');

   req.send(data);
}

function removeSelectedFirm() {
   if(document.forms["contractAddForm"].elements["firm"] != null) {
      document.forms["contractAddForm"].elements["firm"].value = "";
      $(document.forms["contractAddForm"].elements["firm"]).trigger('change');
   }
   if(document.forms["contractAddForm"].elements["commonHSNumber"] != null) {
      document.forms["contractAddForm"].elements["commonHSNumber"].value = "";
   }
   displayTableRow(false, "selectedFirmBlock");
   clearHTMLData("selectedFirm");

   if(id$("warehouseRegion") != null) {
      id$("warehouseRegion").style.display = "none";
   }
   if(id$("storagePointForm") != null) {
      id$("storagePointForm").style.display = "none";
      clearHTMLData("warehouseListForm");
   }
   if (id$("unloadingPlace") != null) {
      id$("unloadingPlace").style.display = "none";
   }
   if (id$("unloadingPlace-address") != null) {
      id$("unloadingPlace-address").style.display = "none";
   }
}

function removeSelectedCommonFirm(fieldName) {
   if(document.forms["contractAddForm"].elements[fieldName + ".guid"] != null) {
      document.forms["contractAddForm"].elements[fieldName + ".guid"].value = "";
   }
   if(document.forms["contractAddForm"].elements[fieldName + ".firmTemplate"] != null) {
      document.forms["contractAddForm"].elements[fieldName + ".firmTemplate"].value = "";
   }
   displayTableRow(false, "selected_" + fieldName + "_block");
   clearHTMLData("selected_" + fieldName);
}

function removeSelectedViaFirm() {
   document.forms["contractAddForm"].elements["viaFirm"].value = "";
   document.forms["contractAddForm"].elements["viaCommonHSNumber"].value = "";
   displayTableRow(false, "selectedViaFirmBlock");
   clearHTMLData("selectedViaFirm");
}

function removeSelectedSender() {
   document.forms["contractAddForm"].elements["sender"].value = "";
   document.forms["contractAddForm"].elements["senderCommonHSNumber"].value = "";
   displayTableRow(false, "selectedSenderBlock");
   id$("selectedSender").innerHTML = "";
   id$("saveTemplate").checked = false;
   id$("saveTemplate").disabled = true;

}

function removeSelectedEnterprise() {
   document.forms["contractAddForm"].elements["enterprise"].value = "";
   if(document.forms["contractAddForm"].elements["commonEnterpriseNumber"] != null) {
      document.forms["contractAddForm"].elements["commonEnterpriseNumber"].value = "";
   }
   displayTableRow(false, "selectedEnterpriseBlock");
   id$("selectedEnterprise").innerHTML = "";
   if(id$("productions") != null) {
      id$("productions").innerHTML = "";
   }
}

function getSecretCode(url) {
   var field = id$("secretCodeField");
   var errField = id$("errorMessageField");

   clearAll();
   showLoadingImg();

   var req = init();

   req.onreadystatechange = myCallback3;
   ajaxVetcontrol.active++;
   req.open("GET", url, true);
   req.send(null);

   function myCallback3() {

      var errorMessage = "При формировании секретного кода произошла ошибка.\n" +
          "Попробуйте ещё раз или обратитесь в службу технической поддержки.";
      if (req.readyState == 4) {
         ajaxVetcontrol.active--;
         if (req.status == 200) {
            var contentType = req.getResponseHeader("Content-type");
            if (contentType.indexOf("json") != -1) {
               var secretCode = trim(req.responseText);
               secretCode = secretCode.substring(2, secretCode.length - 1);
               processResponse(secretCode);
            } else {
               // show error: content type is incorrect
               showErrorMessage(errorMessage);
            }
            // do after load: hide loading img
            hideLoadingImg();
         } else {
            // show error: response status is bad
            showErrorMessage(errorMessage);
         }
      }
   }

   function processResponse(obj) {
      field.innerHTML = obj;
   }

   function clearAll() {
      field.innerHTML = "";
      hideErrorMessage();
      hideLoadingImg();
   }

   function showLoadingImg() {
      field.innerHTML = "Формирование секретного кода..."
   }

   function hideLoadingImg() {
      // do nothing
   }

   function showErrorMessage(message) {
      if (errField != null) {
         errField.innerHTML = message;
         errField.style.display = "";
      }
   }

   function hideErrorMessage() {
      if (errField != null) {
         errField.innerHTML = "";
         errField.style.display = "none";
      }
   }
}

function loadWindow(url, parentId, req) {
   if (!id$(parentId)) {
      parentId = "winAjaxShowForm";
   }

   showAjaxProcessingImage(parentId);

   function myCallback8() {
      if (req.readyState == 4) {
         ajaxVetcontrol.active--;
         if (req.status == 200) {
            showWindowForm(req.responseXML);
         } else {
            hideAjaxProcessingImage(parentId);
            alert("Невозможно отобразить информацию. Код ошибки: " + req.status);
         }
      }
   }

   req.onreadystatechange = myCallback8;

   function showWindowForm(responseXML) {
      var htmlData = responseXML.getElementsByTagName("htmlData")[0];
      var data = htmlData.getElementsByTagName("data")[0];
      if(data == null) {
         data = htmlData.getElementsByTagName("enterprise")[0];
      }

      setInnerHTML(parentId, getTextContent(data));
      document.body.style.overflow = "auto";
      var executeOnLoadData = htmlData.getElementsByTagName("executeOnLoad")[0];
      if(executeOnLoadData != null) {
         eval(trim(getTextContent(executeOnLoadData)));
      }
      setWindowPosition(parentId);

   }

   ajaxVetcontrol.active++;
   req.open("GET", url, true);
   req.send(null);
}

function loadCommonWindow(url, req) {
   loadWindow(url, "winAjaxShowForm", req);
}

function deleteEnterpriseNumber(url, pk, req) {
   req.onreadystatechange = mycallback_en;

   function mycallback_en() {

      if (req.readyState == 4) {
         ajaxVetcontrol.active--;
         if (req.status == 200) {
            deleteEnterpriseNumberFromPage(req.responseXML);
         } else {
            alert("Невозможно удалить условие. Код ошибки: " + req.status);
         }
      }
   }

   function deleteEnterpriseNumberFromPage(responseXML) {
      var status = responseXML.getElementsByTagName("status")[0];
      if (status.getAttribute("success") == "true") {

      } else {
         alert("Ошибка при удалении номера - номер не найден");
      }
   }
   ajaxVetcontrol.active++;
   req.open("GET", url + "&numberPk=" + pk, true);
   req.send(null);
}

function deleteContractCondition(url, pk, req) {
   req.onreadystatechange = myCallback9;

   function myCallback9() {

      if (req.readyState == 4) {
         ajaxVetcontrol.active--;
         if (req.status == 200) {
            deleteContractConditionFromPage(req.responseXML);
         } else {
            alert("Невозможно удалить условие. Код ошибки: " + req.status);
         }
      }
   }

   function deleteContractConditionFromPage(responseXML) {
      var status = responseXML.getElementsByTagName("status")[0];
      if (status.getAttribute("success") == "true") {
         var conditionsContainer = id$("contractConditions");
         var removedCondition = id$("cc_" + pk);
         conditionsContainer.removeChild(removedCondition);
      } else {
         alert("Ошибка при удалении условия на требование контракта: условие не найдено");
      }
   }
   ajaxVetcontrol.active++;
   req.open("GET", url + "&pk=" + pk, true);
   req.send(null);
}

function addSampleByEnterpriseStatus(url, enterprisePk, vetCertificateCargoPk, req) {
   req.onreadystatechange = myCallback20;

   function myCallback20() {

      if (req.readyState == 4) {
         ajaxVetcontrol.active--;
         if (req.status == 200) {
            increaseSamplesCount(req.responseXML);
         } else {
            alert("Невозможно добавить информацию об отборе пробы. Код ошибки: " + req.status);
         }
      }
   }

   function increaseSamplesCount(responseXML) {
      var status = responseXML.getElementsByTagName("status")[0];
      if (status.getAttribute("success") == "true") {
         var samplesCounter = id$("sampleCount_" + enterprisePk + "_" + vetCertificateCargoPk);
         var message = status.getElementsByTagName("message")[0].childNodes[0].nodeValue.split("|");
         samplesCounter.innerHTML = message[0];
         if (message[1] == "0") {
            alert("Отобрано 10 проб. Режим усиленного контроля снят.");
         }
      } else {
         alert(status.getElementsByTagName("message")[0].childNodes[0].nodeValue);
      }
   }
   ajaxVetcontrol.active++;
   req.open("GET", url + "&enterprisePk=" + enterprisePk + "&cargoPk=" + vetCertificateCargoPk, true);
   req.send(null);
}

function setSelectedInList(formName, elementName, selectedValue) {
   var elements = document.forms[formName].elements[elementName].options;
   for (var i = 0; i < elements.length; i++) {
      if (elements[i].value == selectedValue) {
         elements[i].selected = true;
      } else {
         elements[i].selected = false;
      }
   }
}

function saveFirmForEnterprise(url, form, childName, req) {
   req.onreadystatechange = myCallback18;

   function myCallback18() {

      if (req.readyState == 4) {
         ajaxVetcontrol.active--;
         if (req.status == 200) {
            addFirmsToEnterprise(req.responseXML);
         }
      }
   }

   function addFirmsToEnterprise(responseXML) {
      var status = responseXML.getElementsByTagName("status")[0];
      if(status.getAttribute("success") != "true") {
         alert("Произошла ошибка при сохранении информации");
      } else {
         loadHTMLData('operatorui?_action=findFirmAuxAddAjax', form, childName, init());
      }
   }

   var data = getRequestBody(document.forms[form]);

   ajaxVetcontrol.active++;
   req.open("POST", url, true);
   setRequestHeader(req);

   showLocalAjaxProcessingImageWithHeight(childName, 1000);

   req.send(data);
}

function addSubRegion(url, form, childName, req) {
   req.onreadystatechange = myCallback19;

   function myCallback19() {

      if (req.readyState == 4) {
         ajaxVetcontrol.active--;
         if (req.status == 200) {
            addSubRegion(req.responseXML);
         }
      }
   }

   function addSubRegion(responseXML) {
      hideAjaxProcessingImage(childName);
      var status = responseXML.getElementsByTagName("status")[0];
      var message = responseXML.getElementsByTagName("message")[0].childNodes[0].nodeValue;
      if (status.getAttribute("success") == "true") {
         var msg = message.split("_");
         alert(msg[0]);
         var addedap = ce("input");
         addedap.setAttribute("name", "addedap");
         addedap.setAttribute("type", "hidden");
         addedap.setAttribute("value", msg[1]);
         document.forms[form].appendChild(addedap);
         document.forms[form].reset();
         document.forms[form].elements["changed"].value = true;
      } else {
         alert(message);
      }
   }

   var data = getRequestBody(document.forms[form]);

   ajaxVetcontrol.active++;
   req.open("POST", url, true);
   setRequestHeader(req);
   showAjaxProcessingImage(childName);
   req.send(data);
}

function removeCatchRegionDocument(url, filePk, req) {
   req.onreadystatechange = myCallback12;

   function myCallback12() {
      if (req.readyState == 4) {
         ajaxVetcontrol.active--;
         if (req.status == 200) {
            removeEDFileFromPage(req.responseXML);
         }
      }
   }

   function removeEDFileFromPage(responseXML) {
      var status = responseXML.getElementsByTagName("status")[0];
      if(status.getAttribute("success") == "true") {
         id$("document_" + filePk).style.display = "none";
         alert("Файл успешно удален");
         document.forms[0].elements["version"].value = parseInt(document.forms[0].elements["version"].value) + 1;
      } else {
         alert("Ошибка при удалении файла: файл недоступен");
      }
   }

   ajaxVetcontrol.active++;
   req.open("GET", url + "&catchRegionProductionPk=" + filePk, true);
   req.send(null);
}

function checkRealTrafficEnterpriseRequired(url, form, req, isRealTrafficVU, callback) {
   if (isRealTrafficVU && $('#regReq').is(':checked')) {
      return;
   }
   if (id$("enterpriseBlock") === null) return;

   req.onreadystatechange = myCallback20;

   function myCallback20() {

      if (req.readyState == 4) {
         ajaxVetcontrol.active--;
         if (req.status == 200) {
            if (isRealTrafficVU == true) {
               checkRealTrafficVU(req.responseXML);
            } else {
               checkRealTraffic(req.responseXML);
            }
         }
      }
   }

   function checkRealTraffic(responseXML) {
      var status = responseXML.getElementsByTagName("status")[0];
      if (status.getAttribute("success") == "true") {
         var message = responseXML.getElementsByTagName("message")[0].childNodes[0].nodeValue;
         if (message == 1) {
            id$("enterpriseManually").style.display = "none";
            id$("enterpriseInputType").style.display = "none";
            id$("notLicensedEnterpriseBlock").style.display = "none";
            id$("enterpriseBlock").style.display = getDisplayTableRowStyle();
            id$("selectedEnterpriseBlock").style.display = getDisplayTableRowStyle();
            if (id$("enterpriseForm"))
               id$("enterpriseForm").style.display = getDisplayTableRowStyle();
            document.forms[form].elements['enterpriseFromReference'].value = "true";
            id$("efindhref1").setAttribute("href", 'javascript:loadHTMLData("operatorui?_action=findEnterpriseWithHistoryAjax", "enterpriseListAjaxForm", "enterpriseAjaxListForm", init());');
            id$("efindhref2").onclick = function() {loadHTMLData("operatorui?_action=findEnterpriseWithHistoryAjax", "enterpriseListAjaxForm", "enterpriseAjaxListForm", init());closeBlock("findFormEnterprise");};
         } else if (message == 2) {
            id$("enterpriseManually").style.display = "none";
            id$("enterpriseInputType").style.display = "none";
            id$("enterpriseBlock").style.display = getDisplayTableRowStyle();
            id$("selectedEnterpriseBlock").style.display = getDisplayTableRowStyle();
            id$("notLicensedEnterpriseBlock").style.display = getDisplayTableRowStyle();
            id$("efindhref1").setAttribute("href", 'javascript:loadHTMLData("operatorui?_action=findAllEnterpriseWithHistoryAjax", "enterpriseListAjaxForm", "enterpriseAjaxListForm", init());');
            id$("efindhref2").onclick = function() {loadHTMLData("operatorui?_action=findAllEnterpriseWithHistoryAjax", "enterpriseListAjaxForm", "enterpriseAjaxListForm", init());closeBlock("findFormEnterprise");};
            document.forms[form].elements['enterpriseFromReference'].value = "true";
            id$("enterpriseForm").style.display = getDisplayTableRowStyle();
         } else if (message == 3) {
            id$("enterpriseInputType").style.display = getDisplayTableRowStyle();
            id$("notLicensedEnterpriseBlock").style.display = getDisplayTableRowStyle();
            id$("efindhref1").setAttribute("href", 'javascript:loadHTMLData("operatorui?_action=findAllEnterpriseWithHistoryAjax", "enterpriseListAjaxForm", "enterpriseAjaxListForm", init());');
            id$("efindhref2").onclick = function() {loadHTMLData("operatorui?_action=findAllEnterpriseWithHistoryAjax", "enterpriseListAjaxForm", "enterpriseAjaxListForm", init());closeBlock("findFormEnterprise");};
            id$("enterpriseForm").style.display = getDisplayTableRowStyle();
         } else if (message == 4) {
            id$("enterpriseForm").style.display = "none";
         }
         id$("efrSelect").checked = true;
      }
   }

   function toggleEnterpriseBlock(isShow) {
      $('#enterpriseBlock').toggle(isShow);
      $('.enterpriseBlock').toggle(isShow);
      $('#selectedEnterpriseBlock').toggle(isShow);
      $('#enterpriseNumberHelp').toggle(isShow);
      $('#producerRow').toggle(isShow);
      $('#otherEnterpriseNumberHelp').toggle(isShow);
      $('div[id^="enterpriseNumberInfo_"]').toggle(isShow);
   }

   function checkRealTrafficVU(responseXML) {
      var status = responseXML.getElementsByTagName("status")[0];
      if (status.getAttribute("success") == "true") {
         var message = responseXML.getElementsByTagName("message")[0].childNodes[0].nodeValue;
         var findAction;
         if (message == 1) {
            $('#enterpriseManually').hide();
            $('#enterpriseInputType').hide();
            toggleEnterpriseBlock(true);
            $('#enterpriseFromReference').val('true');
            findAction = "operatorui?_action=listLicensedProducerEnterpriseAjax&rtPk=1&pageList=1";
            id$("efrSelect").checked = true;
         } else if (message == 2) {
            $('#enterpriseManually').hide();
            $('#enterpriseInputType').hide();
            toggleEnterpriseBlock(true);
            $('#enterpriseFromReference').val('true');
            findAction = "operatorui?_action=listProducerEnterpriseAjax&rtPk=1&pageList=1";
            id$("efrSelect").checked = true;
         } else if (message == 3) {
            id$("enterpriseInputType").style.display = getDisplayTableRowStyle();
            toggleEnterpriseBlock(true);
            findAction = "operatorui?_action=listProducerEnterpriseAjax&rtPk=1&pageList=1";
            id$("efrSelect").checked = true;
            $('.enterpriseBlock').show();
            $('#enterpriseManually').hide();
         } else if (message == 4) {
            $('#enterpriseManually').hide();
            $('#enterpriseInputType').hide();
            toggleEnterpriseBlock(false);
            $('#enterpriseFromReference').val('true');
         }
         $('#findAction').val(findAction);
         id$("efindhref2").onclick = function() {id$("searchRtPk").value=1;id$("1_enterpriseAjaxListForm").style.display="block";loadHTMLData(findAction, form, "1_enterpriseAjaxListForm", init());closeBlock("1_findFormEnterprise");};
      }
      callback && callback();
   }
   var action = document.forms[form].elements["_action"].value;
   if (isRealTrafficVU) {
      document.forms[form].elements["_action"].value = "checkRealTrafficVUEnterpriseRequiredAjax";
   } else {
      document.forms[form].elements["_action"].value = "checkRealTrafficEnterpriseRequiredAjax";
   }

   var data = getRequestBody(document.forms[form]);

   ajaxVetcontrol.active++;
   req.open("POST", url, true);
   setRequestHeader(req);
   req.send(data);

   document.forms[form].elements["_action"].value = action;
}

function addEnterpriseNumberStamp(url, formName, parentId, infoId, hiddenId, req) {
   function callback_addEnterpriseNumberStamp() {

      if (req.readyState == 4) {
         ajaxVetcontrol.active--;
         if (req.status == 200) {
            addEnterpriseNumberStampOnPage(req.responseXML);
         } else {
            alert("Невозможно отобразить информацию. Код ошибки: " + req.status);
         }
      }
   }

   req.onreadystatechange = callback_addEnterpriseNumberStamp;

   function addEnterpriseNumberStampOnPage(responseXML) {
      var htmlData = responseXML.getElementsByTagName("htmlData")[0];
      var data = htmlData.getElementsByTagName("data")[0];
      if (htmlData.getAttribute("success") == "true") {
         id$(infoId).innerHTML += getTextContent(data);
         var hiddenData = htmlData.getElementsByTagName("hiddenData")[0];
         if (hiddenData != null) {
            id$(hiddenId).innerHTML += getTextContent(hiddenData);
         }
         hideLayoutForm(formName);
      } else {
         setInnerHTML(parentId, getTextContent(data));
         var executeOnLoadData = htmlData.getElementsByTagName("executeOnLoad")[0];
         if (executeOnLoadData != null) {
            eval(trim(getTextContent(executeOnLoadData)));
         }
         setWindowPosition(parentId);
      }
   }

   var data = getRequestBody(document.forms[formName]);

   ajaxVetcontrol.active++;
   req.open("POST", url, true);
   setRequestHeader(req);

   showLocalAjaxProcessingImage(parentId);

   req.send(data);
}

function modifyEnterpriseNumberStamp(url, formName, parentId, req) {
   function callback_modifyEnterpriseNumberStamp() {
      if (req.readyState == 4) {
         ajaxVetcontrol.active--;
         if (req.status == 200) {
            modifyEnterpriseNumberStampOnPage(req.responseXML);
         } else {
            alert("Невозможно отобразить информацию. Код ошибки: " + req.status);
         }
      }
   }

   req.onreadystatechange = callback_modifyEnterpriseNumberStamp;

   function modifyEnterpriseNumberStampOnPage(responseXML) {
      var htmlData = responseXML.getElementsByTagName("htmlData")[0];
      var data = htmlData.getElementsByTagName("data")[0];
      if (htmlData.getAttribute("success") == "true") {
         var elementId = htmlData.getAttribute("id");

         var infoId = "numberSpan_" + elementId;
         var hiddenId = "numberDiv_" + elementId;

         setInnerHTML(infoId, getTextContent(data));
         var hiddenData = htmlData.getElementsByTagName("hiddenData")[0];
         if (hiddenData != null) {
            setInnerHTML(hiddenId, getTextContent(hiddenData));
         }
         hideLayoutForm(formName);

      } else {
         setInnerHTML(parentId, getTextContent(data));
         var executeOnLoadData = htmlData.getElementsByTagName("executeOnLoad")[0];
         if (executeOnLoadData != null) {
            eval(trim(getTextContent(executeOnLoadData)));
         }
         setWindowPosition(parentId);
      }
   }

   var data = getRequestBody(document.forms[formName]);

   ajaxVetcontrol.active++;
   req.open("POST", url+"&ignoreTags=true", true);
   setRequestHeader(req);

   showLocalAjaxProcessingImage(parentId);

   req.send(data);
}

function addNotLicensedEnterprise(url, formName, parentId, req) {
   function myCallback16() {

      if (req.readyState == 4) {
         ajaxVetcontrol.active--;
         if (req.status == 200) {
            addNotLicensedEnterpriseOnPage(req.responseXML);
         } else {
            alert("Невозможно отобразить информацию. Код ошибки: " + req.status);
         }
      }
   }

   req.onreadystatechange = myCallback16;

   function addNotLicensedEnterpriseOnPage(responseXML) {
      var htmlData = responseXML.getElementsByTagName("htmlData")[0];
      var data = htmlData.getElementsByTagName("data")[0];
      if (htmlData.getAttribute("success") == "true") {
         var enterprisePk = htmlData.getAttribute("ePk");
         var parentHidden = id$("ent");
         var parentView = id$("enterpriseView");
         var enterpriseView = getTextContent(data);
         var entShowLink = getTextContent(htmlData.getElementsByTagName("entShowLink")[0]);

         addEnterpriseOnPage(parentHidden, parentView, entShowLink, enterprisePk, enterpriseView);

         alert("Предприятие успешно добавлено");
      } else {
         setInnerHTML(parentId, getTextContent(data));
         var executeOnLoadData = htmlData.getElementsByTagName("executeOnLoad")[0];
         if (executeOnLoadData != null) {
            eval(trim(getTextContent(executeOnLoadData)));
         }
         setWindowPosition(parentId);
      }
   }

   var data = getRequestBody(document.forms[formName]);

   ajaxVetcontrol.active++;
   req.open("POST", url, true);
   setRequestHeader(req);

   showLocalAjaxProcessingImage(parentId);

   req.send(data);
}

function addForeignDoctor(url, formName, parentId, realTrafficPk, req) {
   function myCallback17() {

      if (req.readyState == 4) {
         ajaxVetcontrol.active--;
         if (req.status == 200) {
            addForeignDoctorAjaxOnPage(req.responseXML);
         } else {
            alert("Невозможно отобразить информацию. Код ошибки: " + req.status);
         }
      }
   }

   req.onreadystatechange = myCallback17;

   function addForeignDoctorAjaxOnPage(responseXML) {
      var realTrafficPkPrefix = "";

      if(realTrafficPk != null) {
         realTrafficPkPrefix = realTrafficPk + "_";
      }

      var htmlData = responseXML.getElementsByTagName("htmlData")[0];
      var data = htmlData.getElementsByTagName("data")[0];
      if (htmlData.getAttribute("success") == "true") {
         var fdPk = htmlData.getAttribute("ePk");
         var parentHidden = id$(realTrafficPkPrefix + "foreignDoctor");
         var parentView = id$(realTrafficPkPrefix + "foreignDoctorView");
         var foreignDoctorView = getTextContent(data);

         addForeignDoctorOnPage(parentHidden, parentView, fdPk, foreignDoctorView, realTrafficPk);

         alert("Ветеринарный врач успешно добавлен");
      } else {
         setInnerHTML(parentId, getTextContent(data));
         var executeOnLoadData = htmlData.getElementsByTagName("executeOnLoad")[0];
         if (executeOnLoadData != null) {
            eval(trim(getTextContent(executeOnLoadData)));
         }
         setWindowPosition(parentId);
      }
   }

   var data = getRequestBody(document.forms[formName]);

   ajaxVetcontrol.active++;
   req.open("POST", url, true);
   setRequestHeader(req);

   showLocalAjaxProcessingImage(parentId);

   req.send(data);
}

function checkRequestEnterpriseRequired(url, form, req) {
   if ($('#regReq').is(':checked') && !$('#otherRegCountry').is(':checked')) {
      return;
   }

   req.onreadystatechange = myCallback20;

   function myCallback20() {

      if (req.readyState == 4) {
         ajaxVetcontrol.active--;
         if (req.status == 200) {
            checkRequest(req.responseXML);
         }
      }
   }

   function checkRequest(responseXML) {
      var status = responseXML.getElementsByTagName("status")[0];
      if (status.getAttribute("success") == "true") {
         var message = responseXML.getElementsByTagName("message")[0].childNodes[0].nodeValue;
         if (message == 1) {
            id$("enterpriseManually").style.display = "none";
            id$("enterpriseInputType").style.display = "none";
            id$("notLicensedEnterpriseBlock").style.display = "none";
            id$("enterpriseBlock").style.display = getDisplayTableRowStyle();
            id$("selectedEnterpriseBlock").style.display = getDisplayTableRowStyle();
            id$("enterpriseForm").style.display = getDisplayTableRowStyle();
            document.forms[form].elements['enterpriseFromReference'].value = "true";
            document.forms[form].elements['allEnterprises'].value = "";
            id$("efindhref1").setAttribute("href", 'javascript:loadHTMLData("operatorui?_action=findEnterpriseForCargo", "enterpriseListAjaxForm", "enterpriseAjaxListForm", init());');
            id$("efindhref2").onclick = function() {loadHTMLData("operatorui?_action=findEnterpriseForCargo", "enterpriseListAjaxForm", "enterpriseAjaxListForm", init());closeBlock("findFormEnterprise");};
         } else if (message == 2) {
            id$("enterpriseManually").style.display = "none";
            id$("enterpriseInputType").style.display = "none";
            id$("enterpriseBlock").style.display = getDisplayTableRowStyle();
            id$("selectedEnterpriseBlock").style.display = getDisplayTableRowStyle();
            id$("notLicensedEnterpriseBlock").style.display = getDisplayTableRowStyle();
            id$("efindhref1").setAttribute("href", 'javascript:loadHTMLData("operatorui?_action=findAllEnterpriseForCargo", "enterpriseListAjaxForm", "enterpriseAjaxListForm", init());');
            id$("efindhref2").onclick = function() {loadHTMLData("operatorui?_action=findAllEnterpriseForCargo", "enterpriseListAjaxForm", "enterpriseAjaxListForm", init());closeBlock("findFormEnterprise");};
            document.forms[form].elements['enterpriseFromReference'].value = "true";
            document.forms[form].elements['allEnterprises'].value = "All";
            id$("enterpriseForm").style.display = getDisplayTableRowStyle();
         } else if (message == 3) {
            id$("enterpriseInputType").style.display = getDisplayTableRowStyle();
            id$("notLicensedEnterpriseBlock").style.display = getDisplayTableRowStyle();
            id$("enterpriseManually").style.display = "none";
            id$("enterpriseBlock").style.display = getDisplayTableRowStyle();
            id$("selectedEnterpriseBlock").style.display = getDisplayTableRowStyle();
            document.forms[form].elements['enterpriseFromReference'].value = "true";
            document.forms[form].elements['allEnterprises'].value = "All";
            id$("efindhref1").setAttribute("href", 'javascript:loadHTMLData("operatorui?_action=findAllEnterpriseForCargo", "enterpriseListAjaxForm", "enterpriseAjaxListForm", init());');
            id$("efindhref2").onclick = function() {loadHTMLData("operatorui?_action=findAllEnterpriseForCargo", "enterpriseListAjaxForm", "enterpriseAjaxListForm", init());closeBlock("findFormEnterprise");};
            id$("enterpriseForm").style.display = getDisplayTableRowStyle();
         } else if (message == 4) {
            id$("enterpriseForm").style.display = "none";
            document.forms[form].elements['allEnterprises'].value = "All";
         } else if (message == 5) {
            id$("enterpriseManually").style.display = "none";
            id$("enterpriseInputType").style.display = "none";
            id$("enterpriseBlock").style.display = "none";
            id$("selectedEnterpriseBlock").style.display = "none";
            id$("cerberusEnterpriseBlock").style.display = getDisplayTableRowStyle();
            id$("enterpriseForm").style.display = getDisplayTableRowStyle();
            document.forms[form].elements['enterpriseFromReference'].value = "true";
         } else if (message == 6) {
            id$("enterpriseManually").style.display = getDisplayTableRowStyle();
            id$("enterpriseInputType").style.display = getDisplayTableRowStyle();
            id$("enterpriseBlock").style.display = "none";
            id$("selectedEnterpriseBlock").style.display = "none";
            id$("cerberusEnterpriseBlock").style.display = getDisplayTableRowStyle();
            id$("enterpriseForm").style.display = getDisplayTableRowStyle();
            document.forms[form].elements['enterpriseFromReference'].value = "true";
         }
         id$("efrSelect").checked = true;
      }

      document.dispatchEvent(new Event('enterprise.required.checked'))
   }
   var action = document.forms[form].elements["_action"].value;
   document.forms[form].elements["_action"].value = "checkRequestEnterpriseRequiredAjax";

   var data = getRequestBody(document.forms[form]);

   ajaxVetcontrol.active++;
   req.open("POST", url, true);
   setRequestHeader(req);
   req.send(data);

   document.forms[form].elements["_action"].value = action;
}

function addNotLicensedSVHEnterprise(url, formName, parentId, req) {
   req.onreadystatechange = myCallback21;

   function myCallback21() {

      if (req.readyState == 4) {
         ajaxVetcontrol.active--;
         if (req.status == 200) {
            addNotLicensedSVHEnterpriseOnPage(req.responseXML);
         } else {
            alert("Невозможно отобразить информацию. Код ошибки: " + req.status);
         }
      }
   }

   function addNotLicensedSVHEnterpriseOnPage(responseXML) {
      var htmlData = responseXML.getElementsByTagName("htmlData")[0];
      var data = htmlData.getElementsByTagName("data")[0];
      if (htmlData.getAttribute("success") == "true") {
         var ePk = htmlData.getAttribute("ePk");
         var rtPk = htmlData.getAttribute("rtPk");
         var parentHidden = id$("ent");
         var parentView = id$(rtPk + "_enterpriseView");
         var enterpriseView = getTextContent(data);

         var entShowLink = getTextContent(htmlData.getElementsByTagName("entShowLink")[0]);
         var number = getTextContent(htmlData.getElementsByTagName("number")[0]);
         var producer = getTextContent(htmlData.getElementsByTagName("producer")[0]);

         addEnterpriseOnPageSVH(parentHidden, parentView, entShowLink, ePk, enterpriseView, rtPk, number, producer);

         alert("Предприятие успешно добавлено");
      } else {
         setInnerHTML(parentId, getTextContent(data));
         var executeOnLoadData = htmlData.getElementsByTagName("executeOnLoad")[0];
         if (executeOnLoadData != null) {
            eval(trim(getTextContent(executeOnLoadData)));
         }
         setWindowPosition(parentId);
      }
   }
   var data = getRequestBody(document.forms[formName]);

   ajaxVetcontrol.active++;
   req.open("POST", url, true);
   setRequestHeader(req);

   showLocalAjaxProcessingImage(parentId);

   req.send(data);
}

function needIEHack(parent) {
   var needHack = false;
   if(parent != null) {
      var parentTag = parent.tagName.toLowerCase();
      needHack = true && ie() && (parentTag == 'table' || parentTag == 'tbody');
   }
   return needHack;
}

function trySetInnerHtml(parent, newInnerHtml){
   if (needIEHack(parent)) {
      var parentId = parent.getAttribute("id");
      clearHTMLData(parentId);
      //IE <table> and child nodes (except <td>) innerHtml property is read-only
      var table = parent;
      var row = table.insertRow(-1);
      var cell = row.insertCell(-1);
      cell.innerHTML = newInnerHtml;
   } else {
      parent.innerHTML = newInnerHtml;
   }
   return true;
}

function showViolationAddForm(cidhPk) {
   var url = "operatorui?_action=addCargoViolationForm";
   if (cidhPk != null) {
      url += "&cargoInspectionDecision.pk=" + cidhPk;
   } else {
      alert("Не указана обязательная информация для выполнения данного действия");
      return false;
   }
   loadHTMLData(url, "decisionShowForm", "winAjaxShowForm", init());
}

function showViolationModifyForm(pk) {
   var url = "operatorui?_action=modifyCargoViolationForm";
   if (pk != null) {
      url += "&pk=" + pk;
   } else {
      alert("Не указана обязательная информация для выполнения данного действия");
      return false;
   }
   loadHTMLData(url, "decisionShowForm", "winAjaxShowForm", init());
}

function removeViolation(pk, cidhPk) {
   if (confirm("Вы уверены, что хотите удалить нарушение?")) {
      if (pk == null || cidhPk == null) {
         alert("Не указана обязательная информация для выполнения данного действия");
         return false;
      }
      removeViolationAjax("operatorui?&_action=removeCargoViolation", pk, cidhPk, init());
   }
}

function removeViolationAjax(url, pk, cidhPk, req) {
   req.onreadystatechange = mycallbackVC;

   function mycallbackVC() {
      if (req.readyState == 4) {
         ajaxVetcontrol.active--;
         if (req.status == 200) {
            removeViolationCargoFromPage(req.responseXML);
         } else {
            alert("Невозможно удалить нарушение. Код ошибки: " + req.status);
         }
      }
   }

   function removeViolationCargoFromPage(responseXML) {
      var status = responseXML.getElementsByTagName("status")[0];
      if (status.getAttribute("success") == "true") {
         refreshPageAfterAddOrModifyCargoViolation();
         id$("cargoViolationBody").removeChild(id$("cargoViolationRow_" + pk));
         updateInspectionDecisionList(false);
      } else {
         alert("Ошибка при удалении нарушения: запись не найдена");
      }
   }

   ajaxVetcontrol.active++;
   req.open("GET", url + "&pk=" + pk + "&cargoInspectionDecision.pk=" + cidhPk, true);
   req.send(null);
}

function addCargoViolation(url, formName, parentId, req) {
   function callback_addCargoViolation() {
      if (req.readyState == 4) {
         ajaxVetcontrol.active--;
         if (req.status == 200) {
            addCargoViolationOnPage(req.responseXML);
         } else {
            alert("Невозможно сохранить информацию. Код ошибки: " + req.status);
         }
      }
   }

   req.onreadystatechange = callback_addCargoViolation;

   function addCargoViolationOnPage(responseXML) {
      var htmlData = responseXML.getElementsByTagName("htmlData")[0];
      var data = htmlData.getElementsByTagName("data")[0];
      if (htmlData.getAttribute("success") == "true") {
         refreshPageAfterAddOrModifyCargoViolation();
         hideLayoutForm(formName);
         if(id$("violationHelpMessage") != null) {
            id$("violationHelpMessage").style.display = "none";
         }
         updateInspectionDecisionList(true);
      } else {
         showErrorPageAfterAddOrModifyCargoViolation(parentId, htmlData, data);
      }
   }

   var data = getRequestBody(document.forms[formName]);

   ajaxVetcontrol.active++;
   req.open("POST", url, true);
   setRequestHeader(req);

   showLocalAjaxProcessingImage(parentId);

   req.send(data);
}

function modifyCargoViolation(url, formName, parentId, req) {
   function callback_modifyCargoViolation() {
      if (req.readyState == 4) {
         ajaxVetcontrol.active--;
         if (req.status == 200) {
            modifyCargoViolationOnPage(req.responseXML);
         } else {
            alert("Невозможно сохранить информацию. Код ошибки: " + req.status);
         }
      }
   }

   req.onreadystatechange = callback_modifyCargoViolation;

   function modifyCargoViolationOnPage(responseXML) {
      var htmlData = responseXML.getElementsByTagName("htmlData")[0];
      var data = htmlData.getElementsByTagName("data")[0];
      if (htmlData.getAttribute("success") == "true") {
         var elementId = htmlData.getAttribute("id");

         refreshPageAfterAddOrModifyCargoViolation();


         hideLayoutForm(formName);
      } else {
         showErrorPageAfterAddOrModifyCargoViolation(parentId, htmlData, data);
      }
   }

   var data = getRequestBody(document.forms[formName]);

   ajaxVetcontrol.active++;
   req.open("POST", url, true);
   setRequestHeader(req);

   showLocalAjaxProcessingImage(parentId);

   req.send(data);
}

function showErrorPageAfterAddOrModifyCargoViolation(parentId, htmlData, data) {
   setInnerHTML(parentId, getTextContent(data));
   var executeOnLoadData = htmlData.getElementsByTagName("executeOnLoad")[0];
   if (executeOnLoadData != null) {
      eval(trim(getTextContent(executeOnLoadData)));
   }
   setWindowPosition(parentId);
}

function refreshPageAfterAddOrModifyCargoViolation() {
   var decisionForm = document.forms["decisionShowForm"];
   var isVetControl = decisionForm.elements["vetControl"] != null
       && decisionForm.elements["vetControl"].value == "true";
   var realTraffic = decisionForm.elements["realTrafficPk"];
   var vetCertificate = decisionForm.elements["vetCertificatePk"];

   if(realTraffic != null) {
      var realTrafficPk = realTraffic.value;
      if(isVetControl) {
         window.location.href = "operatorui?_action=formRealTrafficActForm&realTrafficPk=" + realTrafficPk + "&cancelActionMenuState=70";
      } else {
         window.location.href = "operatorui?_action=formRealTrafficForm&realTrafficPk=" + realTrafficPk + "&cancelActionMenuState=70";
      }
   } else if(vetCertificate != null) {
      var vetCertificatePk = vetCertificate.value;
      if(isVetControl) {
         window.location.href = "operatorui?_action=formCargoActForm&vetCertificatePk=" + vetCertificatePk;
      } else {
         window.location.href = "operatorui?_action=showVetCertificateNotFormed&vetCertificatePk=" + vetCertificatePk;
      }
   }
}

function onEnterCargoViolationAdd(e, modify) {
   var key = navigator.appName == 'Netscape' ? e.which : e.keyCode;
   if(key == 13) {
      if (modify) {
         modifyCargoViolation("operatorui?_action=modifyCargoViolation", "cargoViolationAddForm", "winAjaxShowForm", init());
      } else {
         addCargoViolation("operatorui?_action=addCargoViolation", "cargoViolationAddForm", "winAjaxShowForm", init());
      }
   }
}

function updateInspectionDecisionList(isAdd) {
   var currentViolationCount = getViolationCount();

   if(!isAdd && currentViolationCount == 0) {
      $("#absenceDocuments").remove();
      var url = "operatorui?&_action=updateInspectionDecisionList";
      var realTrafficPk = document.forms["decisionShowForm"].elements["pk"];
      var vetCertificatePk = document.forms["decisionShowForm"].elements["vetCertificatePk"];
      var vetControl = document.forms["decisionShowForm"].elements["vetControl"];

      if(vetControl != null) {
         url += "&vetControl=" + vetControl.value;
      }

      if (realTrafficPk != null) {
         url += "&realTrafficPk=" + realTrafficPk.value;
      } else if(vetCertificatePk != null) {
         url += "&vetCertificatePk=" + vetCertificatePk.value;
      } else {
         alert("Не указана обязательная информация для выполнения данного действия");
         return false;
      }
      loadHTMLData(url, "decisionShowForm", "inspectionDecisionBlock", init());
   }
}

function getViolationCount() {
   var violations = id$("cargoViolationBody").getElementsByTagName("tr");
   var count = 0;
   for(var i = 0; i < violations.length; i++) {
      if(startsWith(violations[i].getAttribute("id"), "cargoViolationRow_")) {
         count++;
      }
   }
   return count;
}

function setWindowPosition(parentId) {
   if(id$("ffContent") != null) {
     // $('#ffContent .layoutvalue2, #ffContent .layoutform2').css('width',  'auto');
      $('#ffContent .innerFormWide .label').css('cssText', 'width:50%!important;max-width:300px;');
   }
   if(id$("winBorder") != null && id$("printform_win") != null) {
      // если указана цель, то работаем с ней
      var modalWindowThatHasToBeTheOne;
      if (parentId) {
         modalWindowThatHasToBeTheOne = $("#" + parentId + " #printform_win");
      } else {
      // иначе пробуем угадать
         var modalWindowInWinAjaxDiv = $('#winAjaxShowForm #printform_win');
         var modalWindowInEnterpriseAjaxDivAsIfWinAjaxIsNotAnough = $('#enterpriseAjaxShowForm #printform_win');
         var modalWindowInFirmAjaxDivAsIfOthersTwoIsNotAnough = $('#firmAjaxShowForm #printform_win');
         var modalWindowInForeignDoctorAjaxDivWhyNot = $('#foreignDoctorAjaxAddForm #printform_win');

         if (modalWindowInWinAjaxDiv.length > 0) {
            modalWindowThatHasToBeTheOne = modalWindowInWinAjaxDiv;
         }
         if (modalWindowInEnterpriseAjaxDivAsIfWinAjaxIsNotAnough.length > 0) {
            modalWindowThatHasToBeTheOne = modalWindowInEnterpriseAjaxDivAsIfWinAjaxIsNotAnough;
         }
         if (modalWindowInFirmAjaxDivAsIfOthersTwoIsNotAnough.length > 0) {
            modalWindowThatHasToBeTheOne = modalWindowInFirmAjaxDivAsIfOthersTwoIsNotAnough;
         }
         if (modalWindowInForeignDoctorAjaxDivWhyNot.length > 0) {
            modalWindowThatHasToBeTheOne = modalWindowInForeignDoctorAjaxDivWhyNot;
         }
      }

      if (modalWindowThatHasToBeTheOne) {
         var width = modalWindowThatHasToBeTheOne.find("#ffContent .layoutform2").width();
         if (!width) {
            width = modalWindowThatHasToBeTheOne.find("#ffContent").width()
         }
         width += 2; // компенсация толщины границ
         var minWidth = modalWindowThatHasToBeTheOne.find('#winName').width() + 35; // ширина кнопки
         modalWindowThatHasToBeTheOne.css("width", "");
         modalWindowThatHasToBeTheOne.find('#winBorder').css("width", "");
         modalWindowThatHasToBeTheOne.css('cssText', 'width: ' + width + 'px; min-width: ' + minWidth + 'px;');
         modalWindowThatHasToBeTheOne.find('#winBorder').css('cssText', 'width: ' + width + 'px!important; min-width: ' + minWidth + 'px;');
         modalWindowThatHasToBeTheOne.find('#ffContent').css('cssText', 'height: auto; overflow: auto; max-height: ' + (document.body.clientHeight - 150) + 'px;');
      }
   }

   $('#ffContent .layoutvalue2, #ffContent .layoutform2').css('width',  '100%');

   if(ie() && id$("winBorder") != null) {
      $("html, body").animate({scrollTop:0},"fast");
      if (!$('body').data('ie-gve')){
         modalWindowThatHasToBeTheOne.find('#ffContent').css('cssText', 'overflow: auto; height: ' + (document.body.clientHeight - 100) + 'px;');
      }
   }
}

function setRequestHeader(req) {
   req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
}

function initExportBlock(formName, admissionPointGuid, transitCountryGuid) {
   if(document.forms[formName].elements["admissionPoint.guid"].options.length <= 1) {
      loadSimpleAjaxList(formName, "admissionPoint.guid", admissionPointGuid, true,
          "operatorui?_action=listAdmissionPointGuidTransportType"
          + "&transportType=" + getCheckedRadio(formName, "transportType"), init(), true);
   }

   if(document.forms[formName].elements["transitCountry.guid"].options.length <= 1) {
      loadSimpleAjaxList(formName, "transitCountry.guid", transitCountryGuid, true,
          "operatorui?_action=loadCountryList&customUnion=false", init(), true);
   }
}

function updateAdmissionPointList(formName, admissionPointGuid) {
   loadSimpleAjaxList(formName, "admissionPoint.guid", admissionPointGuid, true,
       "operatorui?_action=listAdmissionPointGuidTransportType"
       + "&transportType=" + getCheckedRadio(formName, "transportType"), init(), true);
}

function checkFeedAdditiveRequired(productFieldName, subProductFieldName, requestType, productValue, subProductValue) {
   if (!productValue) {
      productValue = $("[name='" + productFieldName + "']").val();
   }
   if (!subProductValue) {
      subProductValue = $("[name='" + subProductFieldName + "']").val();
   }
   $.ajax({
      method: "POST",
      url: "operatorui?_action=findFodderTypeCondition&" + productFieldName + "=" + productValue
      + "&" + subProductFieldName + "=" + subProductValue
      + "&requestType=" + requestType
   }).done(function(msg) {
      if (msg.success) {
         $("#feedAdditiveTr").show();
      } else {
         $("#feedAdditiveTr").hide();
      }
   }).fail(function(msg) {
      $("#feedAdditiveTr").hide();
   });
}

function checkWildFishRequired(productFieldName, subProductFieldName, countryValue, samplingReasonValue, productTypeValue, productValue, subProductValue) {
   if (!productValue) {
      productValue = $("[name='" + productFieldName + "']").val();
   }
   if (!subProductValue) {
      subProductValue = $("[name='" + subProductFieldName + "']").val();
   }
   $.ajax({
      method: "POST",
      url: "operatorui?_action=findWildFishCondition&productType.pk=" + productTypeValue
      + "&country.guid=" + countryValue
      + "&samplingReasonList=" + samplingReasonValue
      + "&" + productFieldName + "=" + productValue
      + "&" + subProductFieldName + "=" + subProductValue
   }).done(function(msg) {
      if (msg.success) {
         $(".wildFishTr").show();
      } else {
         $(".wildFishTr").hide();
      }
   }).fail(function(msg) {
      $(".wildFishTr").hide();
   }).always(function() {
      wildFishChanged();
   });
}

function matchDecisionGreenPass(decisionPk, cargoPk, failCallBack, successCallBack, firmPk) {
   $.ajax({
      method: "POST",
      url: "operatorui?_action=matchDecisionNotificationGreenPass&pk=" + decisionPk
      + "&cargo.pk=" + cargoPk + "&firmPk=" + firmPk
   }).done(function(msg) {
      if (msg.success) {
         successCallBack(cargoPk);
      } else {
         failCallBack(cargoPk);
      }
   }).fail(function(msg) {
      failCallBack(cargoPk);
   });
}

function matchRealTrafficGreenPass(decisionPk, cargoPk, failCallBack, successCallBack) {
   var trailer = $("#trailer").val() ? $("#trailer").val() : "";
   var container = $("#container").val() ? $("#container").val() : "";
   $.ajax({
      method: "POST",
      url: "operatorui?_action=matchRealTrafficNotification&pk=" + decisionPk
      + "&cargo.pk=" + cargoPk
      + "&realTraffic.transportType=" + $("#transportType").val()
      + "&realTraffic.transport=" + encodeURIComponent($("#transport").val())
      + "&realTraffic.trailer=" + encodeURIComponent(trailer)
      + "&realTraffic.container=" + encodeURIComponent(container)
      + "&realTraffic.waybill=" + encodeURIComponent($("#waybill").val())
      + "&realTraffic.waybillDate=" + $("#waybillDate").val()
      + "&realTraffic.vetDocumentDate=" + $("#vetDocumentDate").val()
      + "&realTraffic.vetDocumentNumber=" + encodeURIComponent($("#vetDocumentNumber").val())
   }).done(function(msg) {
      if (msg.success) {
         successCallBack(cargoPk);
      } else {
         failCallBack();
      }
   }).fail(function(msg) {
      failCallBack();
   });
}

function addRealTrafficVUProjectLaboratoryAjax(successCallBack) {
   $.ajax({
      method: "POST",
      url: "operatorui?_action=addRealTrafficVUProjectChildAjax&type=1&realTrafficVUProject=" + $('#trafficProjectPk').val()
      + "&laboratory.actNumber=" + encodeURIComponent($('#actNumber_modal').val())
      + "&laboratory.actDate=" + encodeURIComponent($('#actDate_modal').val())
      + "&laboratory.laboratory=" + encodeURIComponent($('#laboratory_modal').val())
      + "&laboratory.disease=" + encodeURIComponent($('#disease_modal').val())
      + "&laboratory.researchDate=" + encodeURIComponent($('#researchDate_modal').val())
      + "&laboratory.method=" + encodeURIComponent($('#method_modal').val())
      + "&laboratory.expertiseNumber=" + encodeURIComponent($('#expertiseNumber_modal').val())
      + "&laboratory.result=" + encodeURIComponent($('#result_modal').val())
      + "&laboratory.conclusion=" + encodeURIComponent($('#conclusion_modal').val()),
      contentType: "charset=utf-8"
   }).done(function(msg) {
      if (msg.success) {
         successCallBack(msg.message);
      }
   });
}

function modifyRealTrafficVUProjectLaboratoryAjax(id, successCallBack) {
   $.ajax({
      method: "POST",
      url: "operatorui?_action=modifyRealTrafficVUProjectChildAjax&type=1&pk=" + id
      + "&realTrafficVUProject=" + $('#trafficProjectPk').val()
      + "&laboratory.actNumber=" + encodeURIComponent($('#actNumber_modal').val())
      + "&laboratory.actDate=" + encodeURIComponent($('#actDate_modal').val())
      + "&laboratory.laboratory=" + encodeURIComponent($('#laboratory_modal').val())
      + "&laboratory.disease=" + encodeURIComponent($('#disease_modal').val())
      + "&laboratory.researchDate=" + encodeURIComponent($('#researchDate_modal').val())
      + "&laboratory.method=" + encodeURIComponent($('#method_modal').val())
      + "&laboratory.expertiseNumber=" + encodeURIComponent($('#expertiseNumber_modal').val())
      + "&laboratory.result=" + encodeURIComponent($('#result_modal').val())
      + "&laboratory.conclusion=" + encodeURIComponent($('#conclusion_modal').val()),
      contentType: "charset=utf-8"
   }).done(function(msg) {
      if (msg.success) {
         successCallBack(id);
      }
   });
}

function removeRealTrafficVUProjectChildAjax(id, successCallBack) {
   $.ajax({
      method: "POST",
      url: "operatorui?_action=removeRealTrafficVUProjectChildAjax&&pk=" + id
      + "&realTrafficVUProject=" + $('#trafficProjectPk').val(),
      contentType: "charset=utf-8"
   }).done(function(msg) {
      successCallBack(id);
   });
}

function addRealTrafficVUProjectOperationAjax(successCallBack) {
   $.ajax({
      method: "POST",
      url: "operatorui?_action=addRealTrafficVUProjectChildAjax&type=2&realTrafficVUProject=" + $('#trafficProjectPk').val()
      + "&operation.operationType=" + encodeURIComponent($('#operationType_modal').val())
      + "&operation.illness=" + encodeURIComponent($('#illness_modal').val())
      + "&operation.operationDate=" + encodeURIComponent($('#operationDate_modal').val())
      + "&operation.vaccineName=" + encodeURIComponent($('#vaccineName_modal').val())
      + "&operation.vaccineSerial=" + encodeURIComponent($('#vaccineSerial_modal').val())
      + "&operation.vaccineDateTo=" + encodeURIComponent($('#vaccineDateTo_modal').val()),
      contentType: "charset=utf-8"
   }).done(function(msg) {
      if (msg.success) {
         successCallBack(msg.message);
      }
   });
}

function modifyRealTrafficVUProjectOperationAjax(id, successCallBack) {
   $.ajax({
      method: "POST",
      url: "operatorui?_action=modifyRealTrafficVUProjectChildAjax&type=2&pk=" + id
      + "&realTrafficVUProject=" + $('#trafficProjectPk').val()
      + "&operation.operationType=" + encodeURIComponent($('#operationType_modal').val())
      + "&operation.illness=" + encodeURIComponent($('#illness_modal').val())
      + "&operation.operationDate=" + encodeURIComponent($('#operationDate_modal').val())
      + "&operation.vaccineName=" + encodeURIComponent($('#vaccineName_modal').val())
      + "&operation.vaccineSerial=" + encodeURIComponent($('#vaccineSerial_modal').val())
      + "&operation.vaccineDateTo=" + encodeURIComponent($('#vaccineDateTo_modal').val()),
      contentType: "charset=utf-8"
   }).done(function(msg) {
      if (msg.success) {
         successCallBack(id);
      }
   });
}

function loadCollapsibleList(id, url, headerCallback) {
   id = "#" + id;
   var header = $(id + " .collapsible-header");
   var loader = $(id + "-loader");
   var item = $(id + " .collapsible-item");
   loader.show();
   $.ajax({
      type : "GET",
      url : url,
      dataType : "html",
      success : function(data){
         loader.hide();
         $(id + "-content").html(data);
      },
      complete: function () {
         if (!headerCallback) {
            header.click(function () {
               item.slideToggle();
            });
         } else {
            header.click(headerCallback);
         }
         item.slideToggle();
      }
   });
}

function loadCollapsibleListPage(id, url) {
   id = "#" + id;
   var loader = $(id + "-loader");
   var nav = $(id + "-nav");
   loader.show();
   nav.hide();
   $.ajax({
      type : "GET",
      url : url + "&pageList=" + nav.find("input[name='pageList']").val(),
      dataType : "html",
      success : function(data){
         loader.hide();
         $(id + "-content").html(data);
      }
   });
}

function loadAccordion(id, url) {
   id = "#" + id;
   var loader = $(id + "-loader");
   loader.show();
   $.ajax({
      type : "GET",
      url : url,
      dataType : "html",
      success : function(data){
         loader.hide();
         $(id + "-content").html(data);
         $(id).accordion("option", {
            disabled: false,
            active: 0
         })
      }
   });
}

function openDecisionPrintWindowAjax(url, windowName, failCallBack) {
   $.ajax({
      method: "GET",
      url: url
   }).done(function(data) {
      openDecisionPrintWindow("", windowName);
      if (window.document.printWindow != null) {
         window.document.printWindow.document.write(data);
         window.document.printWindow.document.close();
      }
   }).fail(function(data) {
      failCallBack();
   });
}

function loadDialog(url, dialogParams) {
   showLocalAjaxProcessingImage("loader-container");
   $.ajax({
      method: "GET",
      url: url,
      dataType: "html"
   }).done(function(data) {
      var dialog = $("<div></div>").html(data).css({
         "overflow-y": "auto"
      });
      dialogParams = $.extend({
         autoOpen: false,
         resizable: false,
         modal: true,
         width: "auto",
         closeText: "Закрыть",
         open: function(event, ui) {
            if (dialogParams && dialogParams.fixedHeight) {
               $(this).css("height", "calc(100% - 34px)"); // устанавливаем высоту ui-dialog-content за вычетом шапки
               var uiDialog = $(this).closest(".ui-dialog");
               uiDialog.css({
                  "max-width": "90%",
                  "max-height": "90%"
               });
               uiDialog.css("height", uiDialog.outerHeight()); // явно установим высоту, чтобы отображался скроллбар
               dialog.dialog("option", "position", dialog.dialog("option", "position"));
            }

            $('.ui-widget-overlay').bind("click", function () {
               dialog.dialog("close");
            });
         },
         close: function(event, ui) {
            $(this).dialog("destroy").remove();
         }
      }, dialogParams);

      dialog.dialog(dialogParams);
      dialog.find(".dialog-button").button();
      dialog.find(".dialog-button-close").on("click", function () {
         dialog.dialog("close");
      });
      dialog.dialog("open");
   }).always(function() {
      hideAjaxProcessingImage("loader-container");
   })
}