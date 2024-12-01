var GUID_RUSSIA = '74a3cbb1-56fa-94f3-ab3f-e8db4940d96b';
var GUID_BELARUS = '07136d64-5821-d7cd-c46a-64f686f3db17';
var GUID_KZ = 'd90bf64b-8f06-9921-7964-97e08b7114af';
var GUID_KYRGYZ = 'd13b7f26-82b6-4591-c1de-eb19e75671ea';
var GUID_ARMENIA = '93ccf520-6850-38fe-4885-dd28b3a6fbc6';

document.NewWindow = null;
var fileMaxSize = 5 * 1024 * 1024;

// polyfill
if (!Array.isArray) {
   Array.isArray = function(arg) {
      return Object.prototype.toString.call(arg) === '[object Array]';
   };
}
if (!Element.prototype.matches) {
   Element.prototype.matches = Element.prototype.msMatchesSelector ||
       Element.prototype.webkitMatchesSelector;
}
if (!Element.prototype.closest) {
   Element.prototype.closest = function(s) {
      var el = this;

      do {
         if (el.matches(s)) return el;
         el = el.parentElement || el.parentNode;
      } while (el !== null && el.nodeType === 1);
      return null;
   };
}

// IE polyfill
if (!Object.values) {
   Object.values = function(obj) {
      var res = [];
      for (var i in obj) {
         if (obj.hasOwnProperty(i)) {
            res.push(obj[i]);
         }
      }
      return res;
   }
}
if ( typeof window.CustomEvent !== "function" ) {

   function CustomEvent(event, params) {
      params = params || {bubbles: false, cancelable: false, detail: undefined};
      var evt = document.createEvent('CustomEvent');
      evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
      return evt;
   }

   CustomEvent.prototype = window.Event.prototype;

   window.CustomEvent = CustomEvent;
}

function cancel(url, previousPage) {
   if (previousPage || url === undefined) {
      history.go(-1);
   } else {
      window.location.href=url;
   }
}

// See http://sandbox.fsvps.ru/issues/21344
function blockButtonsForTime() {
   $('button:submit').click(function(e){
      e.preventDefault();
      var form = $(this).parents('form:first');
   	$('button:submit').attr("disabled", true);
   	$('button:submit').css('opacity', 0.5);
   	form.submit();
   	// And after 30 seconds by default, we unblock the button
      setTimeout(function() {
         $('button:submit').removeAttr("disabled");
         $('button:submit').css('opacity', 1);

      }, 30000);
   });

}

function blockButton(elem) {
   $(elem).attr("disabled", true);
   $(elem).css('opacity', 0.5);
   // And after 30 seconds by default, we unblock the button
   setTimeout(function() {
      $(elem).removeAttr("disabled");
      $(elem).css('opacity', 1);
   }, 30000);

}

function id$(id) {
   //Быстрее выборки через jQuery, но в IE может отбирать элементы не по id, а по name.
   return document.getElementById(id);
}

function ce(e) {
   return document.createElement(e);
}

function ct(t) {
   return document.createTextNode(t);
}

function ie() {
   return navigator.appName == "Microsoft Internet Explorer";
}

function nothing() {}

function setValueHiddenElement(form, element, countryPk) {
   if (!document.forms[form].elements[element]) return;
   document.forms[form].elements[element].value = countryPk;
}

function checkReportDateInterval(checked, prefix) {
   var color = "#fff";
   if(checked) {
      color = "#eee";
   }

   if (!prefix) prefix = "";

   id$(prefix + "dateFrom").disabled = checked;
   id$(prefix + "dateFrom").style.background = color;
   id$(prefix + "dateTo").disabled = checked;
   id$(prefix + "dateTo").style.background = color;
}

function checkAllWithSameName(mainCheckBox, isDisable) {
   var chbs = document.forms[mainCheckBox.form.name].elements[mainCheckBox.name];

   for(var i = 0; i < chbs.length; i++) {
      chbs[i].checked = mainCheckBox.checked;
      if(chbs[i].value != mainCheckBox.value) {
         chbs[i].disabled = mainCheckBox.checked;
      }
   }
}

function checkElementsOnLoad(formName, prefix, nameElement) {
   if(id$("tempAP") != null) {
      id$("tempAP").value = "false";
   }

   if(document.forms[formName] != null) {
      var aps = document.forms[formName].elements["added" + nameElement];
      if(aps != null) {
         if(isNaN(aps.length)) {
            findElement(aps.value, formName, nameElement, prefix);
            if(prefix == "realTraffic" || prefix == "enterprises") {
               addCheckedElement(aps.value, formName, nameElement);
            }
         } else {
            for(var i = 0; i < aps.length; i++) {
               findElement(aps[i].value, formName, nameElement, prefix);
               if(prefix == "realTraffic" || prefix == "enterprises") {
                  addCheckedElement(aps[i].value, formName, nameElement);
               }
            }
         }
      }
   }

   if(id$("tempAP") != null) {
      id$("tempAP").value = "true";
   }
}

function findElement(id, formName, nameElement, prefix) {
   var apPk = document.forms[formName].elements[nameElement + "Pk"];
   if(apPk != null) {
      if(isNaN(apPk.length)) {
         var idStr = id;
         var apPkStr = apPk.value;

         if(id == apPk.value || idStr == apPkStr) {
            if(prefix == "enterprise") {
               setElementByValue(apPk.value, formName, nameElement);
            }
            if(prefix == "enterprises") {
               var id = apPk.value;
               setElementWithoutMultiple(id, formName, nameElement);
            }
            if(prefix == "realTraffic") {
               setElementWithoutMultiple(apPk.value, formName, nameElement);
            }
            if(prefix == "") {
               setElement(apPk.value, formName, nameElement);
            }
         }
      } else {
         for(var j = 0; j < apPk.length; j++) {
            var idStr = id;
            var apPkStr = apPk[j].value;

            if(id == apPk[j].value || idStr == apPkStr) {
               if(prefix == "enterprise") {
                  setElementByValue(apPk[j].value, formName, nameElement);
               }
               if(prefix == "realTraffic" ) {
                  setElementWithoutMultiple(apPk[j].value, formName, nameElement);
               }
               if(prefix == "enterprises" ) {
                  var id = apPk[j].value;
                  setElementWithoutMultiple(id, formName, nameElement);
               }
               if(prefix == "") {
                  setElement(apPk[j].value, formName, nameElement);
               }
            }
         }
      }
   }
}

function setElementWithoutMultiple(id, formName, nameElement) {
   var flag = id$(id).checked;
   var td = id$("td" + id);

   if(!flag) {
      id$(id).checked = true;
      var style = getStyleCheck(td, flag);

      td.setAttribute("class", style);
      td.setAttribute("className", style);
   }
}

function setElementRow(id) {
   var style = getStyleCheck(id$("row" + id), !id$(id).checked);

   id$("row" + id).setAttribute("class", style);
   id$("row" + id).setAttribute("className", style);
}

function setContractAllowedProduction(id) {
   setElementRow(id);
   if(id == "0") {
      var elements = document.forms["contractAddForm"].elements["production"];
      if(!isNaN(elements.length)) {
         for(var i = 0; i < elements.length; i++) {
            if(elements[i].getAttribute("id") != "0") {
               if(id$(id).checked) {
                  elements[i].getAttribute("id").checked = false;
                  id$("row" + elements[i].getAttribute("id")).style.display = "none";
               } else {
                  id$("row" + elements[i].getAttribute("id")).style.display = getDisplayTableRowStyle();
               }
            }
         }
      } //else it's any production
   } else {
      if(someConcreteProductionChecked()) {
         id$("0").checked = false;
         id$("row0").style.display = "none";
      } else {
         id$("row0").style.display = getDisplayTableRowStyle();
      }
   }
}

function someConcreteProductionChecked() {
   var elements = document.forms["contractAddForm"].elements["production"];
   for(var i = 0; i < elements.length; i++) {
      if(elements[i].getAttribute("id") != "0" && elements[i].checked) {
         return true;
      }
   }

   return false;
}

function setElementByValue(id, formName, nameElement) {
   var flag = id$(id).checked;
   var td = id$("td" + id);

   if(flag) {
      id$(id).checked = false;
      var style = getStyleCheck(td, flag);

      td.setAttribute("class", style);
      td.setAttribute("className", style);
      removeCheckedElement(id, formName, nameElement);
   }else {
      id$(id).checked = true;
      var style = getStyleCheck(td, flag);

      td.setAttribute("class", style);
      td.setAttribute("className", style);
      addCheckedElement(id, formName, nameElement);
   }
}

function setElementTrue(id, formName, nameElement) {
   var td = id$("td" + id);

   id$(id).checked = true;
   var style = getStyleCheck(td, false);

   td.setAttribute("class", style);
   td.setAttribute("className", style);
   addCheckedElement(id, formName, nameElement);
}

function setElementWithPrefix(id, formName, nameElement, flag, fromTemplate) {
   if (id$(id) != null) {
      var style = getStyleCheck(id$(id), flag);
      id$(id).setAttribute("class", style);
      id$(id).setAttribute("className", style);
   }
   if (!fromTemplate) {
      if (flag) {
         removeCheckedElement(id, formName, nameElement);
      } else {
         addCheckedElement(id, formName, nameElement);
      }
   }
}

function setElement(id, formName, nameElement, forced) {
   var checkbox = id$(id);
   try {
      if (forced || event && event.target !== checkbox) {
         checkbox.checked = !checkbox.checked
      }
   } catch (e) {
      if (!(e instanceof ReferenceError)) {
         console.error(e);
         return false
      }
   }

   var td = id$("td" + id);
   var style = getStyleCheck(td, !checkbox.checked);
   td.setAttribute("class", style);
   td.setAttribute("className", style);

   if(checkbox.checked) {
      addCheckedElement(id, formName, nameElement);
   } else {
      removeCheckedElement(id, formName, nameElement);
   }

   //Temporary function for admission points
   if(id$("tempAP") != null && id$("tempAP").value == "true" && !checkbox.checked) {
      if(id == 484 || id == 551 || id == 552 || id == 545 || id == 547 || id == 548) {
         /*checkAssociatedElement("551", formName, nameElement);
         checkAssociatedElement("552", formName, nameElement);
         checkAssociatedElement("545", formName, nameElement);
         checkAssociatedElement("547", formName, nameElement);
         checkAssociatedElement("548", formName, nameElement);
         checkAssociatedElement("484", formName, nameElement);*/
      } else if(id == 311 || id == 426) { //Выборг
         checkAssociatedElement("410", formName, nameElement); //Торфяновка (МАПП)
      //только для ЖЖ
      } else if(document.forms[formName].elements["productType"].value == 3 && (id == 255 || id == 256 || id == 264 || id == 267 || id == 269 || id == 277 || id == 291 || id == 293 || id == 295 || id == 301 || id == 303 || id == 359 || id == 363 || id == 364 || id == 367 || id == 368 || id == 370 || id == 377 || id == 378 || id == 385 || id == 389 || id == 391 || id == 392 || id == 398 || id == 400 || id == 406 || id == 412)) { //авто ПВКП на границе с Украиной
         checkAssociatedElement("561", formName, nameElement);
         checkAssociatedElement("562", formName, nameElement);
      }
   }

   return true
}

function getStyleCheck(element, checked) {
   var currentClass = element.getAttribute("class") == null ?
      element.getAttribute("className") : element.getAttribute("class");

   if(checked) {
      return currentClass.substring(parseInt(currentClass.length) - 7, currentClass.length) == "Checked" ?
         currentClass.substring(0, parseInt(currentClass.length) - 7) : currentClass;
   } else {
      return currentClass.substring(parseInt(currentClass.length) - 7, currentClass.length) != "Checked" ?
         currentClass + "Checked" : currentClass;
   }
}

function isCheckedClass(element) {
   var currentClass = element.getAttribute("class") == null ?
      element.getAttribute("className") : element.getAttribute("class");

   return currentClass.substring(parseInt(currentClass.length) - 7, currentClass.length) == "Checked";
}

function checkAssociatedElement(parentId, formName, nameElement) {
   if(!id$(parentId).checked) {
      id$(parentId).checked = true;
      id$("td" + parentId).setAttribute("class", "checked");
      id$("td" + parentId).setAttribute("className", "checked");
      addCheckedElement(parentId, formName, nameElement);
   }
}

function setStoredElement2(id, formName, nameElement, storageName, prefix, value) {
   id$(id).checked = !id$(id).checked;
   setStoredElement(id, formName, nameElement, storageName, prefix, value);
}

function setStoredElement(id, formName, nameElement, storageName, prefix, value) {
   setElement(id, formName, nameElement);

   var flag = id$(id).checked;
   if(flag) {
      addStoredElement(value, formName, storageName);
   } else {
      removeStoredElement(value, formName, storageName, prefix);
   }
}

//Method using only in companyListAjaxForm.jsp
function setStoredElement3(id, formName, nameElement, storageName, prefix, value, fromTemplate) {
   var elem = id$(id);
   if (elem != null) {
      var currentClass = id$(id).getAttribute("class") == null ?
          id$(id).getAttribute("className") : id$(id).getAttribute("class");

      var flag = parseInt(currentClass.length) > parseInt("Checked".length) && currentClass.substring(
              parseInt(currentClass.length) - parseInt("Checked".length), parseInt(currentClass.length)
          );
   }

   if(flag == "Checked") {
      $('input[name=enterprisePk][value=' + value + '], ' + //user-enterprise
        'input[name=companyPk][value=' + value + '], ' + //user-company
        'input[name=firmAuxPk][value=' + value + ']') //
          .remove();
      $('input[name=role_' + value + ']').remove();

      id$("role_" + id).innerHTML = "";
   } else {
      addStoredElement(value, formName, storageName);

      var roleByDefault = id$("roleByDefault");

      addStoredElementHidden(roleByDefault.value, formName, "role_" + value);

      var selectedRole = roleByDefault.selectedIndex;

      elem = id$("role_" + id);
      if (elem != null){
         elem.innerHTML = roleByDefault.options[selectedRole].innerHTML;
      }
   }

   setElementWithPrefix(id, formName, nameElement, flag == "Checked", fromTemplate);
}

function setSameValueTo(value, recipientId) {
   if(id$(recipientId) != null) {
      id$(recipientId).value = value;
   }
}

function addStoredElementHidden(value, formName, storageName) {
   var page;

   page = ce("input");
   page.setAttribute("name", storageName);
   page.setAttribute("type", "hidden");
   page.setAttribute("value", value);

   id$("storage").appendChild(page);
}

function addStoredElement(value, formName, storageName) {
   var page;

   page = ce("input");
   page.setAttribute("name", storageName);
   page.setAttribute("type", "hidden");
   page.setAttribute("value", value);

   id$("storage").appendChild(page);

   if(id$("storageFind") != null) {
      var page1;

      page1 = ce("input");
      page1.setAttribute("name", storageName);
      page1.setAttribute("type", "hidden");
      page1.setAttribute("value", value);

      id$("storageFind").appendChild(page1);
   }

   if(id$("storageSort") != null) {
      var page2;

      page2 = ce("input");
      page2.setAttribute("name", storageName);
      page2.setAttribute("type", "hidden");
      page2.setAttribute("value", value);

      id$("storageSort").appendChild(page2);
   }
   var numbers = id$("apsNumbers");
   if(numbers != null) {
      numbers.innerHTML = parseInt(numbers.innerHTML) + 1;
   }
}

function removeStoredElement2(formName, nameElement, storageName, prefix) {
   var checkedAP = id$("checked" + nameElement);

   $("input[name='" + storageName + "']" , "form[name='" + formName + "']").each( function() {
      checkedAP.removeChild(checkedAP.childNodes[0]);
      id = this.value;
      removeStoredElement(id, formName, storageName, prefix);

      if(id$(id) != null) {
         var flag = id$(id).checked;
         var td = id$("td" + id);

         if(flag) {
            id$(id).checked = false;
            var style = getStyleCheck(td, flag);

            td.setAttribute("class", style);
            td.setAttribute("className", style);
         }
      }
   });
}

function removeStoredElement3(formName, nameElement, storageName, prefix) {
   var checkedAP = id$("checked" + nameElement);

   $("input[name='" + storageName + "']" , "form[name='" + formName + "']").each( function() {
      checkedAP.removeChild(checkedAP.childNodes[0]);
      id = this.value;
      removeStoredElement(id, formName, storageName, prefix);

      id = $('input[value="' + id +'"][name="realTrafficVUPk"]').attr("id");

      if(id$(id) != null) {
         var flag = id$(id).checked;
         var td = id$("td" + id);

         if(flag) {
            id$(id).checked = false;
            var style = getStyleCheck(td, flag);

            td.setAttribute("class", style);
            td.setAttribute("className", style);
         }
      }
   });

   document.forms[formName].elements["allpk"].checked = false;
}

function removeStoredElement(value, formName, storageName, prefix) {
   var allInputs = document.forms[formName].elements[storageName];
   var findInputs = document.forms[prefix + "FindForm"] == null ? null : document.forms[prefix + "FindForm"].elements[storageName];
   var sortInputs = document.forms[prefix + "SortForm"] == null ? null : document.forms[prefix + "SortForm"].elements[storageName];

   if(allInputs != null) {
      if(allInputs.value != null && allInputs.value == value) {
         id$("storage").removeChild(allInputs);
         if(findInputs != null) {
            id$("storageFind").removeChild(findInputs);
         }
         if(sortInputs != null) {
            id$("storageSort").removeChild(sortInputs);
         }
      }

      for(var i = 0; i < allInputs.length; i++) {
         if(allInputs[i].value == value && allInputs[i].parentElement === id$("storage")) {
            id$("storage").removeChild(allInputs[i]);
            if(findInputs != null && findInputs[i] != null) {
               id$("storageFind").removeChild(findInputs[i]);
            }
            if(sortInputs != null && sortInputs[i] != null) {
               id$("storageSort").removeChild(sortInputs[i]);
            }
         }
      }
   }

   var numbers = id$("apsNumbers");
   if(numbers != null) {
      numbers.innerHTML = parseInt(numbers.innerHTML) - 1;
   }
}

function addCheckedElement(apValue, formName, nameElement) {
   var apName;

   if(formName == "realTrafficListForm" ||
      formName == "realTrafficVUListForm" ||
      formName == "simpleRealTrafficListForm" ||
      formName == "realTrafficAjaxListForm"
   ) {
      apName  = "Запись № " + apValue;
   } else if(formName == "enterpriseListForm") {
      apName  = "Предприятие № " + apValue;
   } else if(formName == "companyListAjaxForm" || formName == "firmAuxListAjaxForm") {
       apName = id$(apValue).childNodes[0].nodeValue + " - " + id$("role_" + apValue).innerHTML;
   } else if (formName == "enterpriseListAjaxForm") {
       var roleView = id$("role_" + apValue).innerHTML;
       if (roleView.trim() != "") {
           roleView = " - " + roleView;
       }
       apName  = $("#" + apValue + " span.view").text() + roleView;
   } else {
      apName  = id$("t" + apValue).innerHTML;
   }

   var checkedAP = id$("checked" + nameElement);
   if (checkedAP != null) {
      var option = ce("option");
      var textNode = ct(apName);
      option.setAttribute("value", apValue);
      option.appendChild(textNode);
      var currentClass = id$(apValue).getAttribute("class") == null ?
          id$(apValue).getAttribute("className") : id$(apValue).getAttribute("class");
      $(option).data("class", currentClass);
      $(option).data("impl", "new"); // чтобы в других местах ничего не сломать
      checkedAP.appendChild(option);

      var numbers = id$(nameElement + "Numbers");
      if(numbers != null) {
         numbers.innerHTML = parseInt(numbers.innerHTML) + 1;
      }
   }
}

function removeCheckedElement(apValue, formName, nameElement) {
   var checkedAP = id$("checked" + nameElement);
   if (checkedAP != null) {
       $(checkedAP).find("option[value='" + apValue + "']").remove();

      var numbers = id$(nameElement + "Numbers");
      if(numbers != null) {
         numbers.innerHTML = parseInt(numbers.innerHTML) - 1;
      }
   }
}

function selectElement(id, flag, formName, nameElement) {
   var isChecked = id$(id).checked;
   var td = id$("td" + id);

   if(!flag && isChecked) {
      id$(id).checked = false;
      var style = getStyleCheck(td, !flag);

      td.setAttribute("class", style);
      td.setAttribute("className", style);
      removeCheckedElement(id, formName, nameElement);
   }else if(flag && !isChecked) {
      id$(id).checked = true;
      var style = getStyleCheck(td, !flag);

      td.setAttribute("class", style);
      td.setAttribute("className", style);
      addCheckedElement(id, formName, nameElement);
   }
}

function selectStoredElement(id, flag, formName, nameElement, storageName, prefix, value) {
   var isChecked = id$(id).checked;

   if(!flag && isChecked) {
      removeStoredElement(value, formName, storageName, prefix);
   } else if(flag && !isChecked) {
      addStoredElement(value, formName, storageName);
   }

   selectElement(id, flag, formName, nameElement);
}

function selectAllElements(formName, flag, nameElement) {
   var elements = document.forms[formName].elements[nameElement + "Pk"];

   if(elements != null) {
      if(isNaN(elements.length)) {
         selectElement(elements.id, flag, formName, nameElement);
      } else {
         for(var i = 0; i < elements.length; i++) {
            selectElement(elements[i].id, flag, formName, nameElement);
         }
      }
   }
}

function selectAllBlockElements(formName, block, flag, nameElement) {
   block.find("[name='" + nameElement + "Pk']").each(function () {
      selectElement(this.id, flag, formName, nameElement);
   });
}

function selectAllStoredElements(formName, flag, nameElement, storageName, prefix) {
   var elements = document.forms[formName].elements[nameElement + "Pk"];

   if(elements != null) {
      if(isNaN(elements.length)) {
         selectStoredElement(elements.id, flag, formName, nameElement, storageName, prefix, elements.id);
      }else {
         for(var i = 0; i < elements.length; i++) {
            selectStoredElement(elements[i].id, flag, formName, nameElement, storageName, prefix, elements[i].id);
         }
      }
   }
}

function setAll(formName, nameElement) {
   var elements = document.forms[formName].elements[nameElement + "Pk"];

   if(elements != null) {
      if(isNaN(elements.length)) {
         setElement(elements.id, formName, nameElement);
      }else {
         for(var i = 0; i < elements.length; i++) {
            setElement(elements[i].id, formName, nameElement);
         }
      }
   }
}

function setAllStored(formName, nameElement, storageName, prefix) {
   var elements = document.forms[formName].elements[nameElement + "Pk"];

   if(elements != null) {
      if(isNaN(elements.length)) {
         setStoredElement(elements.id, formName, nameElement, storageName, prefix, elements.id);
      }else {
         for(var i = 0; i < elements.length; i++) {
            setStoredElement(elements[i].id, formName, nameElement, storageName, prefix, elements[i].id);
         }
      }
   }
}

function isOtherSubProduct(pk) {
   if(pk == 292 || pk == 330 || pk == 163 || pk == 176 || pk == 1004 || pk == 7385 || pk == 7391 || pk == 7396 || pk == 8866) {
      return true;
   }else {
      return false;
   }
}

function isOtherProduct(pk) {
   var isOther = id$("isOther");
   var product = id$("product");

   if((isOther != null && product.value == isOther.value) || pk == 18 || pk == 29) {
      return true;
   } else {
      return false;
   }
}

function showOtherProductName(productValue, subProductValue) {
   var productNameBlock = id$("productNameBlock");

   if(isOtherSubProduct(subProductValue) || isOtherProduct(productValue)) {
      productNameBlock.style.display = getDisplayTableRowStyle();
   } else {
      productNameBlock.style.display = "none";
   }
}

function showOtherProductNameForSubProduct(pk) {
   var productNameBlock = id$("productNameBlock");

   if(isOtherSubProduct(pk) || isOtherProduct(id$("product").value)) {
      productNameBlock.style.display = getDisplayTableRowStyle();
   }else {
      productNameBlock.style.display = "none";
   }
}

function showOtherProductNameForProduct(pk) {
   var productNameBlock = id$("productNameBlock");

   if(isOtherProduct(pk)) {
      productNameBlock.style.display = getDisplayTableRowStyle();
   } else {
      productNameBlock.style.display = "none";
   }
}

function showProducer(productValue, subProductValue) {
   var producerBlock = id$("producerBlock");

   if(productValue == 332 || (productValue >= 364 && productValue <= 368) || productValue == 28) {
      producerBlock.style.display = getDisplayTableRowStyle();
   } else {
      producerBlock.style.display = "none";
   }
}

function showProducerForSubProduct(pk) {
   var producerBlock = id$("producerBlock");

   if(id$("product").value == 332 || (id$("product").value >= 364 && id$("product").value <= 368) || id$("product").value == 28) {
      producerBlock.style.display = getDisplayTableRowStyle();
   } else {
      producerBlock.style.display = "none";
   }
}

function showProducerForProduct(pk) {
   var producerBlock = id$("producerBlock");

   if(pk == 332 || (pk >= 364 && pk <= 368) || pk == 28) {
      producerBlock.style.display = getDisplayTableRowStyle();
   } else {
      producerBlock.style.display = "none";
   }
}

function toggleSitesField(isShow) {
   if(id$("sites") != null) {
      if(isShow) {
         id$("sites").style.display = getDisplayTableRowStyle();
      }else {
         id$("sites").style.display = "none";
      }
   }
}

function toggleElementField(element, isShow) {
   var el = id$(element);
   if (!el) return;
   if(isShow) {
      el.style.display = getDisplayTableRowStyle();
   } else {
      el.style.display = "none";
   }
}

function readOnlyProductName() {
   var subProduct = id$("subProduct");
   var productName = id$("productName");

   if(subProduct.value == "null") {
      productName.readOnly = true;
      productName.style.background = "#efefef";
   }else {
      productName.readOnly = false;
      productName.style.background = "#fafafa";
      productName.value = "";
   }
}

function toggleBlock(block) {
   if(id$(block + "Block")) {
      if(id$(block + "Block").style.display == 'none') {
         id$(block + "Block").style.display = 'block';
      } else {
         id$(block + "Block").style.display = 'none';
      }
   }
}

function closeBlock(block) {
   if(id$(block + "Block")) {
      id$(block + "Block").style.display = 'none';
   }
}

function toggleBlockStatus(idChecked) {
   var flag = id$(idChecked).checked;

   if(flag) {
      $(".stateProductBlock").show();
      $(".stateBlock").hide();
    } else {
      $(".stateProductBlock").hide();
      $(".stateBlock").show();
      onStatusChange($("select[name='status']")[0]);
   }
}

//метод для скрытия\вывода блока зависящего от чекбокса
function toggleBlock1Status(block1, block2, idChecked) {
   if(id$(idChecked) != null) {
      var flag = id$(idChecked).checked;

      if(flag) {
         if(id$(block1) != null) {
            id$(block1).style.display = 'none';
            if(id$(block1 + "Text") != null) {
               id$(block1 + "Text").value = "";
            }
         }
       } else {
         if(id$(block1) != null) {
            id$(block1).style.display = getDisplayTableRowStyle();
         }
      }
   }
}

function toggleStyle(block, style) {
   if(ie()) {
      style = "list-item";
   }

   if(id$(block + "Block")) {
      if(id$(block + "Block").style.display == 'none') {
         id$(block + "Block").style.display = style;
      } else {
         id$(block + "Block").style.display = 'none';
      }
   }
}

function displayTableRow(show, block) {
   if(id$(block)) {
      if(show) {
         id$(block).style.display = getDisplayTableRowStyle();
      }else {
         id$(block).style.display = 'none';
      }
   }
}

function toggleTableRow(block) {
   if(id$(block)) {
      if(id$(block).style.display == 'none') {
         id$(block).style.display = getDisplayTableRowStyle();
      } else {
         id$(block).style.display = 'none';
      }
   }
}

function addRegionByTU() {
   var companyForm = document.forms["companyAddForm"];
   var regionPk = companyForm.elements["region"].value;

   if(regionPk != "null") {
      var savedRegion = ce("input");

      savedRegion.setAttribute("name", "regionPk");
      savedRegion.setAttribute("type", "hidden");
      savedRegion.setAttribute("value", regionPk);
      companyForm.appendChild(savedRegion);

      var selectedRegion = companyForm.elements["region"].selectedIndex;
      var addedRegions = id$("addedRegs");
      addedRegions.appendChild(
         ct(companyForm.elements["region"].options[selectedRegion].innerHTML)
      );
      addedRegions.appendChild(ce("br"));

      companyForm.elements["region"].removeChild(
         companyForm.elements["region"].options[selectedRegion]
      );

      companyForm.elements["region"].options[0].selected = true;
   }
}

function restoreRegionByTU() {
   var companyForm = document.forms["companyAddForm"];
   var addedRegions = id$("addedRegs");
   var regions = companyForm.elements["region"];
   var savedRegions = companyForm.elements["regionPk"];

   if(regions != null && savedRegions != null) {
      if(isNaN(savedRegions.length)) {
         for(k = 0; k < regions.options.length; k++) {
            if(regions.options[k].value == savedRegions.value) {
               addedRegions.appendChild(
                  ct(regions.options[k].innerHTML)
               );
               addedRegions.appendChild(ce("br"));
               regions.removeChild(regions.options[k]);
            }
         }
      } else {
         for(i = 0; i < savedRegions.length; i++) {
            for(j = 0; j < regions.options.length; j++) {
               if(regions.options[j].value == savedRegions[i].value) {
                  addedRegions.appendChild(
                     ct(regions.options[j].innerHTML)
                  );
                  addedRegions.appendChild(ce("br"));
                  regions.removeChild(regions.options[j]);
               }
            }
         }
      }
   }
}

function copyCountryList(formName, sourceName, targetName) {
   var sourceSelect = id$(sourceName);
   var targetSelect = id$(targetName);
   var newNode = sourceSelect.cloneNode(true);

   newNode.removeAttribute("id");
   newNode.removeAttribute("onchange");
   newNode.setAttribute("onchange", ""); //For stupid IE
   newNode.setAttribute("name", targetName);

   var selectedCountry = document.forms[formName].elements[targetName + "Selected"].value;
   for(i = 0; i < newNode.getElementsByTagName("option").length; i++) {
      if(newNode.getElementsByTagName("option")[i].getAttribute("value") == selectedCountry) {
         newNode.getElementsByTagName("option")[i].setAttribute("selected", true);
      } else if(newNode.getElementsByTagName("option")[i].getAttribute("selected")) {
         newNode.getElementsByTagName("option")[i].setAttribute("selected", false);
      }
   }

   targetSelect.appendChild(newNode);
}

function doRegReq() {
   var name = id$("name");
   if (name == null) {
      name = id$("productName");
   }
   var form = id$("form");
   var producer = id$("producer");
   var purpose = id$("purpose");
   var nameProduct = id$("nameProduct");
   var regReq = id$("regReq");
   var regNumber = id$("regNumber");
   var registrationNumber = id$("registrationNumber");
   var client = id$("client");
   var componentContent = id$("componentContent");
   var dateFrom = id$("dateFrom");
   var dateTo = id$("dateTo");
   var clientBlock = id$("clientBlock");
   var regNumberBlock = id$("regNumberBlock");
   var registrationNumberBlock = id$("registrationNumberBlock");
   var deliveryDateBlock = id$("deliveryDateBlock");
   var regSearchResultBlock = id$("regSearchResult");
   var regSearchResultNavBlock = id$("regSearchResultNav");

   var displayShowValue = getDisplayTableRowStyle();
   var otherRegCountry = id$("otherRegCountry");

   if(regReq.checked) {
      name.readOnly = true;
      form.readOnly = true;
      producer.readOnly = true;
      purpose.readOnly = true;
      nameProduct.style.display = "block";

      clientBlock.style.display = displayShowValue;
      regNumberBlock.style.display = displayShowValue;
      registrationNumberBlock.style.display = displayShowValue;
      deliveryDateBlock.style.display = displayShowValue;
      regSearchResultBlock.style.display = displayShowValue;
      regSearchResultNavBlock.style.display = displayShowValue;

      name.style.background = "#efefef";
      form.style.background = "#efefef";
      producer.style.background = "#efefef";
      purpose.style.background = "#efefef";
      setRegFieldsEditable();
   } else {
      if(otherRegCountry != null) {
         otherRegCountry.checked = false;
         setRegFieldsEditable();
      }

      name.readOnly = false;
      form.readOnly = false;
      producer.readOnly = false;
      purpose.readOnly = false;
      nameProduct.style.display = "none";

      clientBlock.style.display = "none";
      regNumberBlock.style.display = "none";
      registrationNumberBlock.style.display = "none";
      deliveryDateBlock.style.display = "none";
      regSearchResultBlock.style.display = "none";
      regSearchResultNavBlock.style.display = "none";

      name.style.background = "#fafafa";
      form.style.background = "#fafafa";
      producer.style.background = "#fafafa";
      purpose.style.background = "#fafafa";

      regNumber.value = "";
      registrationNumber.value = "";
      client.value = "";
      dateFrom.value = "";
      dateTo.value = "";
   }

   $('#cargo-purpose-block').toggle(!regReq.checked || otherRegCountry.checked)
}

function setRegFieldsEditable() {
   var otherRegCountry = id$("otherRegCountry");
   var regReq = id$("regReq");

   if(regReq != null && regReq.checked && otherRegCountry != null) {
      var name = id$("name");
      if (name == null) {
         name = id$("productName");
      }
      var form = id$("form");
      var producer = id$("producer");
      var purpose = id$("purpose");
      var regNumber = id$("regNumber");
      var registrationNumber = id$("registrationNumber");
      var client = id$("client");
      var dateFrom = id$("dateFrom");
      var dateTo = id$("dateTo");
      var regDataFindForm = id$("regDataFindForm");
      var productViewBlock = id$("productViewBlock");
      var regSearchResult = id$("regSearchResult");
      var regSearchResultNav = id$("regSearchResultNav");
      var productBlock = id$("productBlock");
      var subProductBlock = id$("subProductBlock");

      name.readOnly = !otherRegCountry.checked;
      form.readOnly = !otherRegCountry.checked;
      if (producer) {
         producer.readOnly = !otherRegCountry.checked;
      }
      if (!otherRegCountry.checked){
         $('[name = "enterpriseFromReference"][type = "radio"]').parent().parent().hide();
      } else {
         $('[name = "enterpriseFromReference"][type = "radio"]').parent().parent().show();
      }

      purpose.readOnly = !otherRegCountry.checked;
      regNumber.readOnly = !otherRegCountry.checked;
      registrationNumber.readOnly = !otherRegCountry.checked;
      client.readOnly = !otherRegCountry.checked;
      dateFrom.readOnly = !otherRegCountry.checked;
      dateTo.readOnly = !otherRegCountry.checked;

      var displayShowValue = getDisplayTableRowStyle();
      var formName = $(otherRegCountry).closest("form").attr("name");

      if(!otherRegCountry.checked) {
         regDataFindForm.style.display = "block";
         if(productViewBlock != null) {
            productViewBlock.style.display = displayShowValue;
         }
         if(regSearchResult != null) {
            regSearchResult.style.display = displayShowValue;
         }
         if(regSearchResultNav != null) {
            regSearchResultNav.style.display = displayShowValue;
         }
         productBlock.style.display = "none";
         subProductBlock.style.display = "none";

         name.style.background = "#efefef";
         form.style.background = "#efefef";
         if (producer) {
            producer.style.background = "#efefef";
         }
         purpose.style.background = "#efefef";
         regNumber.style.background = "#efefef";
         registrationNumber.style.background = "#efefef";
         client.style.background = "#efefef";
         dateFrom.style.background = "#efefef";
         dateTo.style.background = "#efefef";

         if ($('#product').data('request-type') === 'import') {
            loadList(formName, "subProduct", $("#product").val(), $("#subProduct").val(), true,
                "operatorui?_action=loadSubProduct&withoutHidden=true", init());
         }
      } else {
         var productPk = $("#product").val();
         if ($('#product').data('request-type') !== 'import') {
            checkRegReqForProduct(productPk);
            loadList(formName, "subProduct", productPk, $("#subProduct").val(), true,
                "operatorui?_action=loadSubProduct&withoutHidden=true", init());
         } else {
            loadList(formName, "subProduct", productPk, $("#subProductView").val(), true,
                "operatorui?_action=loadSubProduct&withoutHidden=true", init());
         }

         regDataFindForm.style.display = "none";
         if(productViewBlock != null) {
            productViewBlock.style.display = "none";
         }
         if(regSearchResult != null) {
            regSearchResult.style.display = "none";
         }
         if(regSearchResultNav != null) {
            regSearchResultNav.style.display = "none";
         }
         productBlock.style.display = displayShowValue;
         subProductBlock.style.display = displayShowValue;

         name.style.background = "#fafafa";
         form.style.background = "#fafafa";
         if (producer) {
            producer.style.background = "#fafafa";
         }
         purpose.style.background = "#fafafa";
         regNumber.style.background = "#fafafa";
         registrationNumber.style.background = "#fafafa";
         client.style.background = "#fafafa";
         dateFrom.style.background = "#fafafa";
         dateTo.style.background = "#fafafa";
      }
   }
   $('#cargo-purpose-block').toggle(!regReq.checked || otherRegCountry.checked);
   $("#subProductViewBlock").toggle(regReq.checked && (!otherRegCountry || !otherRegCountry.checked));
}

function checkElement(id) {
   id$(id).checked = true;
}

function checkBox(id) {
   var flag = id$(id).checked;
   if(flag && !id$(id).disabled) {
      id$(id).checked = false;
   } else {
      id$(id).checked = true;
   }
}

function setRequestType(requestType) {
   document.forms["chooseRequestForm"].elements["request"].value = requestType;
   checkElement(requestType);
   $('#additional-info').toggle(checkAnimalComponents());
}

function setProductType(productType) {
   document.forms["chooseRequestForm"].elements["productType"].value = productType;
   checkElement(productType);
}

function checkAnimalComponents() {
   return $('#Fodder').is(':checked') && $('#Export').is(':checked')
}

function submitChooseRequestForm(deniedMessage) {
   $('#fodder-check-error').remove();
   if (deniedMessage && checkAnimalComponents() && !$('#animal-components').is(':checked')) {
      addErrorMessage(deniedMessage, 'fodder-check-error');
      return
   }

   var requestType = document.forms["chooseRequestForm"].elements["request"].value;
   var actionName = "add" + requestType + "RequestForm";
   doAction("chooseRequestForm", actionName, "");
}

function submitChooseTemplateForm() {
   var requestType = document.forms["chooseRequestForm"].elements["request"].value;
   var actionName = "add" + requestType + "TemplateForm";
   doAction("chooseRequestForm", actionName, "");
}

function showRegistrationForm(divName) {
   var div = id$(divName);
   id$("physical").style.display = "none";
   id$("juridical").style.display = "none";
   id$("individual").style.display = "none";
   div.style.display = "block";
   checkElement(divName + "Radio");
   initSelectListForm('registration' + divName + 'FirmForm');
}

function disableNotStationEnterpriseType() {
   var enterpriseType = $('#enterpriseType input:radio[name="enterpriseType"]');
   enterpriseType.prop('checked', false);
   enterpriseType.filter('[value="3"]').prop('checked', true);
   enterpriseType.filter('[value!="3"]').prop("disabled", true);
   $("#activityRow").hide();
}

function firmRegisterCountryChange(suffix, requirePassport, init){
   var chosenCountry = $('#af-country-address-' + suffix).val();
   var enterpriseType = $('#enterpriseType').find('input:radio[name="enterpriseType"]');
   if(chosenCountry== GUID_RUSSIA){
      $('#' + suffix + ' .rf').show();
      $('#' + suffix + ' .ts').hide();
      $('#' + suffix + ' input[name="ogrn"], ' +
         '#' + suffix + ' input[name="kpp"], ' +
         '#' + suffix + ' input[name="fioSign"], ' +
         '#' + suffix + ' input[name="postSign"]').parent().parent().show();
      $('#' + suffix + ' input[name="insideHolding"], ' +
         '#' + suffix + ' input[name="holding"]').parent().parent().parent().show();
      if ($('#registrationjuridicalFirmForm input[name="insideHolding"]:checked').val() == "true") {
         $('#holdingBlock').show();
      }
      $("#" + suffix + " #contacts").show();
      if (!$('#physicalRadio').is(':checked')){
         $('#' + suffix + ' input[name="inn"]').parent().parent().children('.label').children('span').show();
      }
      $('#incorporationFormUuid').parent().parent().show();
      if (requirePassport != 'true'){
         $('#' + suffix + ' input[name="passport"]').parent().parent().children('.label').children('span').hide();
      } else {
         $('#' + suffix + ' input[name="passport"]').parent().parent().children('.label').children('span').show();
      }
      $('#' + suffix + ' input[name="passport"]').parent().parent().children('.value').children('span.help').show();
      $('#ikar-address-flag').val(true);

      disableNotStationEnterpriseType();
   } else{
      $('#' + suffix + ' .ts').show();
      $('#' + suffix + ' .rf').hide();
      $('#' + suffix + ' input[name="ogrn"], ' +
         '#' + suffix + ' input[name="kpp"], ' +
         '#' + suffix + ' input[name="fioSign"], ' +
         '#' + suffix + ' input[name="postSign"]').parent().parent().hide();
      $('#' + suffix + ' input[name="insideHolding"], ' +
         '#' + suffix + ' input[name="holding"]').parent().parent().parent().hide();
      $('#holdingBlock').hide();
      $("#" + suffix + " #contacts").hide();
      $('#' + suffix + ' input[name="inn"]').parent().parent().children('.label').children('span').hide();
      var pas = $('#' + suffix + ' input[name="passport"]');
      if (pas.data("required")) {
         pas.parent().parent().children('.label').children('span').show();
      }
      $('#incorporationFormUuid').parent().parent().hide();
      $('#incorporationFormUuid').val(null);
      $('#incorporationFormView').val(null);
      pas.parent().parent().children('.value').children('span.help').hide();
      $('#ikar-address-flag').val(false);

      $('#enterpriseType input:radio[name="enterpriseType"]').prop("disabled", false);
   }

    if ($('[name = "typeField"]').val() == "3") {
        $('#af-jur-label').find('span').hide();
    }

    // ИНН хэлпы
    var innHelper;
    switch (chosenCountry){
        case GUID_RUSSIA: {
            innHelper = 'Должен содержать 10 цифр';
            if(~suffix.indexOf('uridical')){
                innHelper = 'Должен содержать 10 цифр';
            } else {
                innHelper = 'Должен содержать 12 цифр';
            }
            break;
        }
        case GUID_BELARUS: {
            innHelper = 'Должен содержать 9 цифр';
            break;
        }
        case GUID_KZ: {
            innHelper = 'Должен содержать 12 цифр';
            break;
        }
        case GUID_ARMENIA: {
            innHelper = 'Должен содержать 8 цифр';
            break;
        }
        case GUID_KYRGYZ: {
            innHelper = 'Должен содержать 14 цифр';
            break;
        }
        default: {
            innHelper = 'Для данной страны не указан формат ИНН';
            break;
        }
    }
    $('#' + suffix + ' input[name="inn"]').parent().parent().children('.value').children('.help').text(innHelper);

    if(!init){
        $('#af-region-group input').val(null);
        $('#af-locality-group input').val(null);
        $('#af-street-group input').val(null);
        $('.error').text('');
        $('input[name=juridicalAddress]').val(null);
    } else {
        if (requirePassport != 'true') {
            $('#' + suffix + ' input[name="passport"]').parent().parent().children('.label').children('span').hide();
        }
    }
}

function checkboxAll(form, checkboxName, clickSelf) {
   var pks = document.forms[form].elements[checkboxName];
   if(pks != null) {
      if(!isNaN(pks.length)) {
         for (i = 0; i < pks.length; i++) {
            if (pks[i].checked != document.forms[form].elements["allpk"].checked){
               if (clickSelf) {
                  $(pks[i]).click();
               } else {
                  $(pks[i]).parent().click();
               }
            }
         }
      } else {
         if (pks.checked != document.forms[form].elements["allpk"].checked){
            if (clickSelf) {
               $(pks).click();
            } else {
               $(pks).parent().click();
            }
         }
      }
   }
}

function showPasswordFields() {
   if(document.forms["userModifyForm"].elements["setNewPassword"].checked) {
      id$("passwordFields").style.display = 'block';
   } else {
      id$("passwordFields").style.display = 'none';
   }
}

function getBlockTop(element) {
   var oNode = element;
   var iTop = 0;
   while(oNode.tagName != 'HTML') {
      iTop += oNode.offsetTop || 0;
      if(oNode.offsetParent) {
         oNode = oNode.offsetParent;
      } else {
         break;
      }
   }
   return iTop;
}

function getBlockLeft(element) {
   var oNode = element;
   var iLeft = 0;
   while(oNode.tagName != 'HTML') {
      iLeft += oNode.offsetLeft || 0;
      if(oNode.offsetParent) {
         oNode = oNode.offsetParent;
      } else {
         break;
      }
   }

   return iLeft;
}

function closeForm(form) {
   if(form == "findForm") {
      if(id$("sortForm") != null) id$("sortForm").style.display = "none";
      if(id$("reportForm") != null) id$("reportForm").style.display = "none";
   } else if(form == "sortForm") {
      if(id$("findForm") != null) id$("findForm").style.display = "none";
      if(id$("reportForm") != null) id$("reportForm").style.display = "none";
   }else {
      if(id$("sortForm") != null) id$("sortForm").style.display = "none";
      if(id$("findForm") != null) id$("findForm").style.display = "none";
   }
}

function toggleForm(form, top) {
   var sort = id$(form);
   top = top || getBlockTop(id$(form + "Bottom")) - sort.offsetHeight > 44;

   if(sort.style.display != "block") {
      closeForm(form);
      sort.style.display = "block";
      if(top) {
         element = id$(form + "Top");
         sort.style.top = getBlockTop(element) + element.offsetHeight + 'px';
         sort.style.left = getBlockLeft(element) + 'px';
      } else {
         element = id$(form + "Bottom");
         sort.style.top = getBlockTop(element) - sort.offsetHeight + 'px';
         sort.style.left = getBlockLeft(element) + 'px';
      }
   } else {
      sort.style.display = "none";
   }
}

function toggle(id, show) {
   if(id$(id)) {
      if(show) {
         id$(id).style.display = 'block';
      } else {
         id$(id).style.display = 'none';
      }
   }
}

function isIDagreement(agreement) {
   if(document.forms["decisionShowForm"] != null && document.forms["decisionShowForm"].elements["agreement"] != null) {
      document.forms["decisionShowForm"].elements["agreement"].value = agreement;

      if (id$("issueVetCertificate") != null) {
         if(agreement) {
            id$("issueVetCertificate").style.display = getDisplayTableRowStyle();
         }else {
            id$("issueVetCertificate").style.display = "none";
         }
      }
   }
}

function toggleBlockShow(block) {
   if (id$(block + "Block")) {
      if (id$(block + "Block").style.display == 'none') {
         id$(block + "Block").style.display = 'block';
         id$(block + "ToggleImg").setAttribute("src", "img/up.gif");
      } else {
         id$(block + "Block").style.display = 'none';
         id$(block + "ToggleImg").setAttribute("src", "img/down.gif");
      }
   }
}

function markCheckedEnterpriseDirectionConfirm() {
   return confirm("Вы действительно хотите отметить данное указание как \"проверенное\"?");
}

function formTransactionConfirm() {
   return confirm("Вы действительно хотите завершить оформление транзакции?");
}

function activateWarehouseConfirm() {
   return confirm("Вы действительно хотите восстановить данное место хранения/переработки, чтобы его можно было указывать в заявках?");
}

function deactivateWarehouseConfirm() {
   return confirm("Вы действительно хотите удалить данное место хранения/переработки, чтобы его нельзя было указывать в заявках? После этого будет возможность восстановить его.");
}

function blockUserConfirm() {
   return confirm("Вы действительно хотите заблокировать выбранного пользователя?");
}

function restoreUserConfirm() {
   return confirm("Вы действительно хотите восстановить выбранного пользователя?");
}

function synchronizeConfirm() {
   return confirm("Вы действительно хотите синхронизировать всех пользователей?");
}

function removeConfirm() {
   return confirm("Вы подтверждаете удаление?");
}

function cloneTransactionConfirm() {
   return confirm("Вы подтверждаете создание новой транзакции на основе аннулированной?");
}

function cloneVetDocumentConfirm() {
   return confirm("Вы подтверждаете создание нового ВСД на основе аннулированного?");
}


function removeEnterpriseDirectionConfirm() {
   return confirm("Вы действительно хотите удалить данный файл?");
}

function removeInBasketConfirm() {
   return confirm("Вы действительно хотите отправить заявку в корзину?");
}

function restoreConfirm() {
   return confirm("Вы действительно хотите восстановить заявку из корзины обратно?");
}

function clearBasketConfirm() {
   return confirm("Вы действительно хотите очистить корзину?");
}

function updateStatusConfirm() {
   return confirm("Вы подтверждаете снятие ограничения?");
}

function sendConfirmVU() {
   return confirm("Вы подтверждаете отправку заявки?");
}

function sendConfirmVUWithGuarantee() {
   return confirm("Подтверждая отправку заявки, я гарантирую выполнение вет. требований страны-импортера.");
}

function sendConfirmUVN() {
   return confirm("Вы подтверждаете отправку заявки в Управление ветеринарного надзора?");
}

function viseConfirm(revoked) {
   if (revoked === true) {
       return confirm("Внимание! Вы действительно хотите завизировать проект решения, который ранее был аннулирован?");
   } else {
      return confirm("Вы действительно хотите завизировать проект решения?");
   }
}

function viseAndSendToVUConfirm() {
   return confirm("Вы действительно хотите завизировать проект решения и отправить его на согласование в ВУ?");
}

function rejectRequestConfirm() {
   return confirm("Вы действительно хотите отклонить заявку?");
}

function acceptRequestConfirm() {
   return confirm("Вы действительно хотите принять заявку?");
}

function sendToConfirm() {
   return confirm("Вы действительно хотите отправить заявку хозяйствующему субъекту на подтверждение сделанных изменений?");
}

function confirmChanges() {
   return confirm("Вы действительно хотите подтвердить изменения в заявке, сделанные в ветеринарном управлении?");
}

function rejectChanges() {
   return confirm("Вы действительно хотите отклонить изменения в заявке, сделанные в ветеринарном управлении?");
}

function addChangeConfirm() {
   return confirm("Вы действительно хотите создать изменение/дополнение к данному разрешению?");
}

function addSampleConfirm() {
   return confirm("Вы действительно хотите добавить отметку об отборе пробы?\nДанное действие нельзя будет отменить");
}

function revokeRealTrafficVUConfirm() {
   return confirm("Вы действительно хотите аннулировать данную запись журнала?\nПри этом будут автоматически аннулированы все ВСД, оформленные на её основе");
}

function revokeRealTrafficVURequestConfirm() {
   return confirm("Вы действительно хотите аннулировать данную запись журнала?");
}

function revokeRealTrafficConfirm() {
   return confirm("Вы действительно хотите аннулировать данную запись журнала?\nПри этом будут автоматически аннулированы все акты отбора проб, оформленные по данному грузу");
}

function modifyRealTrafficVUConfirm() {
   return confirm("Вы действительно хотите изменить данную запись журнала?");
}

function formWithoutCreatingVetCertificateConfirm() {
   return confirm("Вы действительно хотите оформить данный груз без создания ветеринарного сертификата (в случае, если переоформление импортного ВСД не требуется)?");
}

function formVetCertificateConfirm() {
   return confirm("Вы действительно хотите оформить данный груз?");
}

function commitChangesInDecisionConfirm() {
   return confirm("Вы действительно хотите завизировать сделанные в заявке доработки?");
}

function enterpriseActionConfirm() {
   return confirm("Вы действительно хотите произвести выбранное действие с данными предприятиями?");
}

function modifyRequestTemplateConfirm() {
   return confirm("Вы действительно хотите отредактировать данный шаблон?\nПри изменении страны происхождения будут удалены прикрепленные к шаблону грузы с производителями, указанными из справочника");
}

function setFocus() {
   if (document.forms[0].elements[0].type != "hidden") {
      document.forms[0].elements[0].focus();
   }
}

function doActionWithOneParameter(formName, actionName, ancor, paramName1, paramValue1) {
   var form = document.forms[formName];
   form.elements[paramName1].value = paramValue1;
   doAction(formName, actionName, ancor);
}

function doActionWithTwoParameters(formName, actionName, ancor, paramName1, paramValue1, paramName2, paramValue2) {
   var form = document.forms[formName];
   form.elements[paramName1].value = paramValue1;
   form.elements[paramName2].value = paramValue2;
   doAction(formName, actionName, ancor);
}

function doActionWithParameters(formName, actionName, ancor, paramName1, paramValue1, paramName2, paramValue2) {
   var form = document.forms[formName];
   form.elements[paramName1].value = paramValue1;
   form.elements[paramName2].value = paramValue2;
   doAction(formName, actionName, ancor);
}

function doActionWithThreeParameters(formName, actionName, ancor, paramName1, paramValue1, paramName2, paramValue2, paramName3, paramValue3) {
   var form = document.forms[formName];
   form.elements[paramName1].value = paramValue1;
   form.elements[paramName2].value = paramValue2;
   form.elements[paramName3].value = paramValue3;
   doAction(formName, actionName, ancor);
}

function doAction(formName, actionName, ancor, loaderId) {
   var form = document.forms[formName];
   form.elements["_action"].value = actionName;
   form.action = form.action;
   if(!isEmpty(ancor)) {
      form.action += "#" + ancor;
   }
   doSubmit(form);
   if (loaderId) {
      showAjaxProcessingImage(loaderId);
   }
}

function doActionBlock(formName, actionName, pkName, pkValue, version, ancor) {
   var form = document.forms[formName];
   form.elements["_action"].value = actionName;
   form.elements["version"].value = version;
   form.elements[pkName].value = pkValue;
   form.action = form.action;
   if(!isEmpty(ancor)) {
      form.action += "#" + ancor;
   }
   doSubmit(form);
}

function doSubmit(form) {
   var useJQuerySubmit = form.elements["useJQuerySubmit"];
   useJQuerySubmit = !useJQuerySubmit ? false : useJQuerySubmit.value;
   if (!form.hasAttribute('keep-enabled')) {
      $(form).find('button').each(function () {
         blockButton(this)
      })
   }
   if (useJQuerySubmit) {
     $(form).submit();
   } else {
     form.submit();
   }
}

function setAction(formName, actionName) {
   var form = document.forms[formName];
   if(form != null) {
      form.elements["_action"].value = actionName;
   }
}

function setStateMenu(formName, stateMenu) {
   var form = document.forms[formName];
   if(form != null) {
      form.elements["stateMenu"].value = stateMenu;
   }
}

function setTemplate(formName, template) {
   setInput(formName, 'template', template);
}

function setInput(formName, inputName, value) {
   var form = document.forms[formName];
   if(form != null) {
      var input = form.elements[inputName];
      if(input != null) {
         input.value = value;
      }
   }
}

function cancelChoose(formName, actionName) {
   document.forms[formName].elements["_action"].value = actionName;
   document.forms[formName].elements["cancel"].value = "true";
   document.forms[formName].submit();
}

function reset() {
   document.forms[0].reset();
}

function CloseNewWindow() {
   if (document.NewWindow != null) {
      document.NewWindow.close();
   }
}

function CloseWindow() {
   if (opener != null && !opener.closed) {
      opener.document.NewWindow = null;
      opener.focus();
   }
   close();
}

function OpenNewWindow(URL, WindowName, Left, Top, Height, Width) {
   CloseNewWindow();

   document.NewWindow =
      open(
         URL,
         WindowName,
         "directories=no," +
            "hotkeys=no," +
            "menubar=no," +
            "resizable=yes," +
            "scrollbars=yes," +
            "status=no," +
            "toolbar=no," +
            "left=" + 150 + "," +
            "top=" + 100 + "," +
            "sreenX=" + 150 + "," +
            "screenY=" + 100 + "," +
            "height=" + Height + "," +
            "width=" + Width
      );

   if(document.NewWindow != null) {
      document.NewWindow.focus();
   }
}

function selectAll(common, start, end) {
   setValue(common.value, start, end);
}

function setValue(commonValue, start, end) {
   for (i = start; i <= end; i++) {
      select = document.getElementsByTagName("select")[i];
      select.value = commonValue;
   }
}

function checkboxAll2(common, start, end) {
   setChecked(common.checked, start, end);
}

function setChecked(commonValue, start, end) {
   for(i = start; i <= end; i++) {
      checkbox = document.getElementsByTagName("input")[i];
      checkbox.checked = commonValue;
   }
}

function removeAllChilds(parent) {
   if(parent != null) {
      if(needIEHack(parent)) {
         while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
         }
      } else {
         if(parent != null) {
            parent.innerHTML = "";
         }
      }
   }
}

function addForeignDoctorOnPage(parentHidden, parentView, foreignDoctorUuid, foreignDoctorView, realTrafficPk) {
   var realTrafficPkPrefix = "";

   if(realTrafficPk != null) {
      realTrafficPkPrefix = realTrafficPk + "_";
   }

   var appendData = true;
   if (id$(realTrafficPkPrefix + "singleForeignDoctor") != null) {
      appendData = false;
   }
   if(foreignDoctorUuid != null) {
      if(id$(realTrafficPkPrefix + "foreignDoctor" + foreignDoctorUuid) != null) {
         alert("Данный ветврач уже добавлен");
         return false;
      }

      var input = null;
      input = ce("input");
      input.setAttribute("id", realTrafficPkPrefix + "foreignDoctor" + foreignDoctorUuid);
      input.setAttribute("type", "hidden");
      input.setAttribute("name", realTrafficPkPrefix + "vetDoctor.uuid");
      input.setAttribute("value", foreignDoctorUuid);

      if(!appendData) {
         removeAllChilds(parentHidden);
         removeAllChilds(parentView);
      }

      parentHidden.appendChild(input);

      var tr = ce("tr");
      tr.setAttribute("id", realTrafficPkPrefix + "ep" + foreignDoctorUuid);
      tr.setAttribute("style", "background:#f3f3f3;");

      var td2 = ce("td");
      td2.setAttribute("width", "1%");
      td2.innerHTML = "<a href = 'javascript:hideForeignDoctor(\"" + foreignDoctorUuid + "\", " + realTrafficPk + ");' title = 'Удалить'><img src = \"/vetcontrol-docs/common/img/remove.gif\"></a>";

      var td3 = ce("td");
      td3.setAttribute("id", realTrafficPkPrefix + "foreignDoctorView_" + foreignDoctorUuid);
      td3.innerHTML = foreignDoctorView;

      tr.appendChild(td2);
      tr.appendChild(td3);
      parentView.appendChild(tr);

      return true;
   } else {
      alert("Не выбран ветврач");
      return false;
   }
}

function addEnterpriseOnCargoPage(parentHidden, parentView, entShowLink, enterprisePk, enterpriseView, contractPk) {
   // Если предприятие успешно добавилось на страницу, то сохраняем также идентификатор контракта, если он есть
   if(addEnterpriseOnPage(parentHidden, parentView, entShowLink, enterprisePk, enterpriseView) && !isEmpty(contractPk)) {
      var input = ce("input");
      input.setAttribute("id", "contract" + enterprisePk);
      input.setAttribute("type", "hidden");
      input.setAttribute("name", "contract" + enterprisePk);
      input.setAttribute("value", contractPk);
      parentHidden.appendChild(input);
   }
}

function addEnterpriseOnPage(parentHidden, parentView, entShowLink, enterprisePk, enterpriseView) {
   var appendData = true;
   if (id$("singleEnterprise") != null) {
      appendData = false;
   }
   if(enterprisePk != null) {
      if(id$("ent" + enterprisePk) != null) {
         return alert("Данное предприятие уже добавлено");
      }

      var commonNumber = $("[name='enterpriseCommonNumber_" + enterprisePk + "']").val();
      if (commonNumber && $("[name='entCommon'][value='" + commonNumber + "']").size() > 0) {
         return alert("Данное предприятие уже добавлено");
      }

      if(!appendData) {
         removeAllChilds(parentHidden);
         removeAllChilds(parentView);
      }

      var input = '<input type="hidden" id="ent' + enterprisePk + '" name="enterprise" value="' + enterprisePk + '"/>';
      parentHidden.innerHTML += input;

      if (commonNumber) {
         var inputCommon = '<input type="hidden" id="entCommon' + enterprisePk + '" name="entCommon" value="' + commonNumber + '"/>';
         parentHidden.innerHTML += inputCommon;
      }

      var tr = ce("tr");
      tr.setAttribute("id", "ep" + enterprisePk);
      tr.setAttribute("style", "background:#f3f3f3;");

      var td1 = ce("td");
      td1.setAttribute("width", "1%");
      td1.innerHTML = entShowLink;

      var td2 = ce("td");
      td2.setAttribute("width", "1%");
      td2.innerHTML = "<a href = 'javascript:hideEnterprise(" + enterprisePk + ");' title = 'Удалить'><img src = \"/vetcontrol-docs/common/img/remove.gif\"></a>";

      var td3 = ce("td");
      td3.setAttribute("id", "enterpriseView_" + enterprisePk);
      td3.innerHTML = enterpriseView;

      tr.appendChild(td1);
      tr.appendChild(td2);
      tr.appendChild(td3);
      parentView.appendChild(tr);

      return true;
   } else {
      alert("Не выбрано предприятие");
      return false;
   }
}

function addEnterpriseOnPageSVH(parentHidden, parentView, entShowLink, enterprisePk, enterpriseView, rtPk, numbers, producer) {
   if(enterprisePk != null) {
      if(id$(rtPk + "_ent" + enterprisePk) != null) {
         return alert("Данное предприятие уже добавлено");
      }

      var input = null;

      input = ce("input");
      input.setAttribute("id", rtPk + "_ent" + enterprisePk);
      input.setAttribute("type", "hidden");
      input.setAttribute("name", rtPk + "_enterprise");
      input.setAttribute("commonName", "producer");
      input.setAttribute("value", enterprisePk);

      parentHidden.appendChild(input);

      var tr = ce("tr");
      tr.setAttribute("id", rtPk + "_ep" + enterprisePk);
      tr.setAttribute("style", "background:#f3f3f3;");

      var td1 = ce("td");
      td1.setAttribute("width", "1%");
      td1.innerHTML = entShowLink;

      var td2 = ce("td");
      td2.setAttribute("width", "1%");
      td2.innerHTML = "<a href = 'javascript:hideEnterpriseSVH(" + enterprisePk + ", " + rtPk +");' title = 'Удалить'><img src = \"/vetcontrol-docs/common/img/remove.gif\"></a>";

      var td3 = ce("td");

      var div = ce("div");
      div.setAttribute("style", "background-color:#ddd;padding:2px;margin-bottom:2px;");
      div.innerHTML = enterpriseView;

      td3.appendChild(div);

      var eaList = id$("eaListToChoose").getElementsByTagName("input");

      for (i = 0; i < eaList.length; i++) {
         var label = ce("label");
         var checkbox = ce("input");
         checkbox.setAttribute("type", "checkbox");
         checkbox.setAttribute("name", rtPk + "_" + enterprisePk + "_" + "enterpriseActivity");
         var value = eaList[i].getAttribute("value").split("_");
         var eaPk = value[0];
         var eaName = value[1];
         checkbox.setAttribute("value", eaPk);
         label.appendChild(checkbox);
         label.appendChild(ct(eaName));
         td3.appendChild(label);
      }

      tr.appendChild(td1);
      tr.appendChild(td2);
      tr.appendChild(td3);
      parentView.appendChild(tr);

      id$("enterpriseNumbers").innerHTML = numbers + id$("enterpriseNumbers").innerHTML;
      document.dispatchEvent(new Event("enterprise:choose"));
      id$("producerList").innerHTML = "<div id='producerInfo_" + enterprisePk + "'>" +  producer + "<br></div>" + id$("producerList").innerHTML;
   } else {
      alert("Не выбрано предприятие");
   }
}

function hideEnterprise(enterprisePk) {
   if(confirm("Удалить предприятие из списка?")) {
      id$("enterpriseView").removeChild(id$("ep" + enterprisePk));
      id$("ent").removeChild(id$("ent" + enterprisePk));
      var entCommon = id$("entCommon" + enterprisePk);
      if (entCommon) {
         id$("ent").removeChild(entCommon);
      }

      if(id$("contract" + enterprisePk) != null) {
         id$("ent").removeChild(id$("contract" + enterprisePk));
      }
   }
}

function hideForeignDoctor(foreignDoctorPk, realTrafficPk) {
   if(confirm("Удалить ветврача?")) {
      if(realTrafficPk == null) {
         id$("foreignDoctorView").removeChild(id$("ep" + foreignDoctorPk));
         id$("foreignDoctor").removeChild(id$("foreignDoctor" + foreignDoctorPk));
      } else {
         id$(realTrafficPk + "_foreignDoctorView").removeChild(id$(realTrafficPk + "_ep" + foreignDoctorPk));
         id$(realTrafficPk + "_foreignDoctor").removeChild(id$(realTrafficPk + "_foreignDoctor" + foreignDoctorPk));
      }
   }
}

function hideEnterpriseSVH(enterprisePk, rtPk) {
   if(confirm("Удалить предприятие из списка?")) {
      id$(rtPk + "_enterpriseView").removeChild(id$(rtPk + "_ep" + enterprisePk));
      var inputField = id$(rtPk + "_ent" + enterprisePk);
      inputField.parentNode.removeChild(inputField);
      id$("producerList").removeChild(id$("producerInfo_" + enterprisePk));

      var numbers = document.forms[0].elements["enterpriseNumber"];

      if (numbers === undefined) {
         document.dispatchEvent(new Event("enterprise:delete"));
         return;
      }
      var toDelete = new Array();

      if(isNaN(numbers.length)) {
         var enterpriseNumber = id$("enterpriseNumberInfo_" + enterprisePk + "_" + numbers.value);
         if(enterpriseNumber != null) {
            toDelete.push(numbers.value);
         }
      } else {
         for(var i = 0; i < numbers.length; i++) {
            var enterpriseNumber = id$("enterpriseNumberInfo_" + enterprisePk + "_" + numbers[i].value);
            if(enterpriseNumber != null) {
               toDelete.push(numbers[i].value);
            }
         }
      }

      if(isNaN(toDelete.length)) {
         id$("enterpriseNumberInfo_" + enterprisePk + "_" + toDelete).parentNode.removeChild(id$("enterpriseNumberInfo_" + enterprisePk + "_" + toDelete));
      } else {
         for(var i = 0; i < toDelete.length; i++) {
            id$("enterpriseNumberInfo_" + enterprisePk + "_" + toDelete[i]).parentNode.removeChild(id$("enterpriseNumberInfo_" + enterprisePk + "_" + toDelete[i]));
         }
      }
      document.dispatchEvent(new Event("enterprise:delete"));
   }
}

function checkForeignDoctorIsRequireInRealTraffic(formName) {
   var numberElement = document.forms[formName].elements["vetDocumentNumber"];
   var dateElement = document.forms[formName].elements["vetDocumentDate"];

   if(numberElement != null  && dateElement != null && !isEmpty(numberElement.value) && !isEmpty(dateElement.value)) {
      id$("isRequiredVetDoctor").style.display = "inline";
   } else {
      id$("isRequiredVetDoctor").style.display = "none";
   }
}

function checkForeignDoctorIsRequiredInVetCertificate(value, realTrafficPk) {
   if(realTrafficPk != null && value != null && (parseInt(value) == 1 || parseInt(value) == 2)) {
      id$(realTrafficPk + "_isRequiredVetDoctor").style.display = "inline";
   } else {
      id$(realTrafficPk + "_isRequiredVetDoctor").style.display = "none";
   }
}

function resetList(list) {
   while(list.hasChildNodes()) {
      list.removeChild(list.childNodes[0]);
   }
   var notSelected = ce("option");
   var textNode = ct("не указано");
   notSelected.setAttribute("value", "null");
   notSelected.appendChild(textNode);
   list.appendChild(notSelected);
}


function addFileSpan() {
   var fileList = id$("files");
   var size = fileList.getElementsByTagName("span").length;
   size = size - 1;
   var pageNumber = size;
   if (id$("pageCounter") != null) {
      pageNumber = parseInt(id$("pageCounter").value);
      id$("pageCounter").setAttribute("value", (pageNumber + 1));
   }

   pageNumber++;

   var ws = ct(" ");
   var mainSpan = ce("span");
   mainSpan.setAttribute("id", "addFileSpan" + pageNumber);

   var span = ce("span");
   var label = ct("№ стр: ");
   span.appendChild(label);
   mainSpan.appendChild(span);
   mainSpan.appendChild(ws);

   var page;
   if (ie()) {
     page = ce('<input class="short" className="short" name="page' + pageNumber + '" type="text" value="' + pageNumber + '"/>');
   } else {
     page = ce("input");
     page.setAttribute("class", "short");
     page.setAttribute("className", "short");
     page.setAttribute("name", "page" + pageNumber);
     page.setAttribute("type", "text");
     page.setAttribute("value", pageNumber);
   }
   mainSpan.appendChild(page);
   mainSpan.appendChild(ws);

   mainSpan.innerHTML += "<span style='display: inline-table;'><input size = '43' name = 'document" + pageNumber + "' type = 'file' onchange = 'checkFileSize(this);'></span>";

   mainSpan.appendChild(ws);

   var a = ce("a");
   a.setAttribute("position", pageNumber);
   a.setAttribute("href", "javascript:hideFileSpan(" + pageNumber + ");");
   textNode = ct("Удалить");
   a.appendChild(textNode);
   mainSpan.appendChild(a);

   var br = ce("br");
   mainSpan.appendChild(br);
   fileList.appendChild(mainSpan);
   return pageNumber;
}

function addFile() {
   var fileList = id$("files");
   var size = fileList.getElementsByTagName("span").length;
   size = size - 1;
   var pageNumber = size;
   if (id$("pageCounter") != null) {
      pageNumber = parseInt(id$("pageCounter").value);
      id$("pageCounter").setAttribute("value", (pageNumber + 1));
   }

   var span = ce("span");
   var label = ct("№ стр: ");
   span.appendChild(label);
   fileList.appendChild(span);

   var page = ce("input");
   page.setAttribute("class", "short");
   page.setAttribute("className", "short");
   page.setAttribute("name", "page" + (pageNumber + 1));
   page.setAttribute("type", "text");
   page.setAttribute("value", (pageNumber + 1));
   fileList.appendChild(page);
   fileList.innerHTML += "<input size = '43' name = 'document" + (pageNumber + 1) + "' type = 'file' onchange = 'checkFileSize(this);'>";

   var ws = ct(" ");
   fileList.appendChild(ws);

   var a = ce("a");
   a.setAttribute("href", "javascript:hideFileHandler(event);");
   a.setAttribute("position", size);
   textNode = ct("Удалить");
   a.appendChild(textNode);
   fileList.appendChild(a);

   var br = ce("br");
   fileList.appendChild(br);
}

function hideFileHandler(e) {
   var targetItem;

   if(!e) {
      var e = window.event;
   }
   if(e.target) {
      targetItem = e.target;
   } else {
      if (e.srcElement) {
         targetItem = e.srcElement;
      }
   }
   if(targetItem.nodeType == 3) { // defeat Safari bug
      targetItem = targetItem.parentNode;
   }
   if(targetItem != null) {
      var position = targetItem.getAttribute("position");

      if (position != null) {
         hideFile(position);
      }
   }
}

function hideEnterpriseNumber(item) {
   id$("enterpriseNumber").removeChild(id$(item));
}

function hideEnterpriseNumberFromDB(item) {
   removeEnterpriseNumber(item, "operatorui?_action=removeEnterpriseNumber", init());
}

function getMaxEnterpriseNumberId() {
   var enList = id$("enterpriseNumber");
   var max = 0;

   if(isNaN(enList.getElementsByTagName("span").length)) {
      if(enList.getElementsByTagName("span")[i].getAttribute("id") > max) {
         max = enList.getElementsByTagName("span").getAttribute("id");
      }
   } else {
      for(var i = 0; i < enList.getElementsByTagName("span").length; i++) {
         if(enList.getElementsByTagName("span")[i].getAttribute("id") > max) {
            max = enList.getElementsByTagName("span")[i].getAttribute("id");
         }
      }
   }

   return max;
}

function addEnterpriseNumberToDB(form) {
   var enName = document.forms[form].elements["number"].value;

   if(!isEmpty(enName)) {
      addEnterpriseNumberAJAX(
         enName,
         "operatorui?_action=addEnterpriseNumber&enterprisePk=" +
         document.forms[form].elements["enterprisePk"].value,
         init(),
         form
      );
   } else {
      alert("Введите номер предприятия");
   }
}

function addEnterpriseNumber(form) {
   var enList = id$("enterpriseNumber");
   var enName = document.forms[form].elements["number"].value;
   var enId = parseInt(getMaxEnterpriseNumberId()) + 1;

   if(isEmpty(enName)) {
      alert("Введите номер предприятия");
   } else {
      var span = ce("span");
      span.setAttribute("class", "short");
      span.setAttribute("id", enId);
      span.appendChild(ce("br"));

      var a = ce("a");
      a.setAttribute("href", "javascript:hideEnterpriseNumber(\"" + enId + "\");");
      textNode = ct("Удалить");
      whiteSpace = ct(" ");
      a.appendChild(textNode);
      span.appendChild(a);
      span.appendChild(whiteSpace);

      var page = ce("input");
      page.setAttribute("id", "enterpriseNumber_" + enId);
      page.setAttribute("name", "enterpriseNumber");
      page.setAttribute("type", "hidden");
      page.setAttribute("value", enId + "_" + enName);
      span.appendChild(page);
      span.appendChild(ct(enName + "  "));

      enList.appendChild(span);
      document.forms[form].elements["number"].value = "";
   }
}

function hidePacking(item) {
   id$("packing").removeChild(id$(item));
}

//добавление новой упаковки
function addPackingNameElement(formName) {
   var packingList = id$("packing");
   var packingName = document.forms[formName].elements["packingName"].value;

   if(isEmpty(packingName)) {
      alert("Введите наименование упаковки");
   } else {
      var span = ce("span");
      span.setAttribute("style", "display:block;white-space: nowrap;");
      span.setAttribute("id", packingName);

      var a = ce("a");
      a.setAttribute("href", "javascript:hidePacking(\"" + packingName + "\");");
      textNode = ct("Удалить");
      whiteSpace = ct(" ");
      a.appendChild(textNode);
      span.appendChild(a);
      span.appendChild(whiteSpace);

      var page = ce("input");
      page.setAttribute("id", "packing_" + packingName);
      page.setAttribute("name", "packing");
      page.setAttribute("type", "hidden");
      page.setAttribute("value", "null_null_" + packingName);
      span.appendChild(page);
      span.appendChild(ct(packingName + "  "));

      packingList.appendChild(span);
      document.forms[formName].elements["packingName"].value = "";
      id$("packingName").style.display = 'none';
   }
}

function addPackingNameElementExtended(formName) {
   var packingList = id$("packing");
   var packCounter = parseInt(id$("packCounter").value);
   var packingName = document.forms[formName].elements["packingName"].value;

   if(isEmpty(packingName)) {
      alert("Введите наименование упаковки");
   } else {
      var span = ce("span");
      span.setAttribute("style", "display:block;white-space: nowrap;");
      span.setAttribute("id", "packManual_" + packCounter);

      var a = ce("a");
      a.setAttribute("href", "javascript:hidePacking(\"packManual_" + packCounter + "\");");
      textNode = ct("Удалить");
      whiteSpace = ct(" ");
      a.appendChild(textNode);
      span.appendChild(a);
      span.appendChild(whiteSpace);

      var page = ce("input");
      page.setAttribute("name", "packManual");
      page.setAttribute("type", "hidden");
      page.setAttribute("value", packingName);
      span.appendChild(page);
      span.appendChild(ct(packingName + "  "));

      packingList.appendChild(span);
      document.forms[formName].elements["packingName"].value = "";
      id$("packingName").style.display = 'none';
      id$("packCounter").value = packCounter + 1;
   }
}

function addPackingElement(value) {
   if(value != null) {
      var idStr = new String(value);
      var idArray = idStr.split("_");
      var id = idArray[0];
      var name = idArray[1];

      var packingList = id$("packing");

      if(value == "isOther") {
         id$("packingName").style.display = 'block';
      }else {
         id$("packingName").style.display = 'none';

         var span = ce("span");
         span.setAttribute("style", "display:block;white-space: nowrap;");
         span.setAttribute("id", id);

         var a = ce("a");
         a.setAttribute("href", "javascript:hidePacking(" + id + ");");
         textNode = ct("Удалить");
         whiteSpace = ct(" ");
         a.appendChild(textNode);
         span.appendChild(a);
         span.appendChild(whiteSpace);

         var page = ce("input");
         page.setAttribute("id", "packing_" + id);
         page.setAttribute("name", "packing");
         page.setAttribute("type", "hidden");
         page.setAttribute("value", id + "_" + name + "_null");
         span.appendChild(page);
         span.appendChild(ct(name + "  "));

         packingList.appendChild(span);
      }

      id$("packingList").value = "null";
   }
}

function addPackingElementExtended(value) {
   if(value != null) {
      var id = new String(value);
      var packingList = id$("packing");
      var spanId = "packAuto_" + id;

      if (value == "isOther") {
         id$("packingName").style.display = 'block';
      } else if (id$(spanId) == null) {
         id$("packingName").style.display = 'none';
         var name = id$("packAvail_"+id).value;

         var span = ce("span");
         span.setAttribute("style", "display:block;white-space: nowrap;");
         span.setAttribute("id", spanId);

         var a = ce("a");
         a.setAttribute("href", "javascript:hidePacking(\"" + spanId + "\");");
         textNode = ct("Удалить");
         whiteSpace = ct(" ");
         a.appendChild(textNode);
         span.appendChild(a);
         span.appendChild(whiteSpace);

         var page = '<input type="hidden" name="packAuto" value="' + id + '"/>';
         span.innerHTML += page;
         span.appendChild(ct(name + "  "));

         packingList.appendChild(span);
      }

      id$("packingList").value = "null";
   }
}

function addDecisionVUOnPage() {
   var outNumber = id$("outNumber").value.trim();
   var considerationDate = id$("considerationDate").value.trim();
   var success = true;

   if(isEmpty(outNumber) || isEmpty(considerationDate)) {
      alert("Укажите номер и дату разрешения");
      success = false;
   }
   if (!/(0?[1-9]|[12][0-9]|3[01])\.(0?[1-9]|1[012])\.(19|20)?\d\d/.test(considerationDate)) {
      alert("Дата указана некорректно");
      success = false;
   }

   var dId = getSafeString(outNumber + "_" + considerationDate);

   if(!checkDecisionVUUnique(dId)) {
      alert("Разрешение с таким номером и датой уже добавлено");
      success = false;
   }

   var expr = new RegExp("\\||\\_|<|>|\\&|\\\\|\\'|\\\"");

   if(expr.test(outNumber) || expr.test(considerationDate)) {
      alert("Номер или дата разрешения содержат недопустимые символы: <, >, &, \\, ', \", |, _");
      success = false;
   }

   if(success) {
      var name = (isEmpty(outNumber) ? "" : ("№ " + outNumber))
         + (isEmpty(considerationDate) ? "" : " от " + considerationDate + " г.");

      var span;
      if(ie()) {
         span = ce("div");
         span.setAttribute("style", "white-space:nowrap;");
      } else {
         span = ce("span")
         span.setAttribute("style", "display:block;white-space:nowrap;");
      }

      span.setAttribute("id", dId);

      var a = ce("a");
      a.setAttribute("href", "javascript:hideDecisionVUFromPage(\"" + dId + "\");");
      textNode = ct("Удалить");
      whiteSpace = ct(" ");
      a.appendChild(textNode);
      span.appendChild(a);
      span.appendChild(whiteSpace);

      span.appendChild(ct(name + "  "));

      var page

      page = ce("input");
      page.setAttribute("name", "outNumberAndConsiderationDate");
      page.setAttribute("type", "hidden");
      page.setAttribute("value", dId);

      span.appendChild(page);

      id$("decisions").appendChild(span);

      id$("outNumber").value = "";
      id$("considerationDate").value = "";
   }
}

function hideDecisionVUFromPage(containerId) {
   id$("decisions").removeChild(id$(containerId));
}

function getSafeString(str) {
   var result = trim(str)
      .replace("&*", "&amp;")
      .replace("<*", "&lt;")
      .replace(">*", "&gt;")
      .replace("\"*", "&quot;")
      .replace("'*", "&#039;");

   return result;
}

function checkDecisionVUUnique(dId) {
   var elements = document.forms["contractAddForm"].elements["outNumberAndConsiderationDate"];
   if(elements == null) {
      return true;
   }
   if(isNaN(elements.length)) {
      if(elements.value == dId) {
         return false;
      }
   } else {
      for(var i = 0; i < elements.length; i++) {
         if(elements[i].value == dId) {
            return false;
         }
      }
   }

   return true;
}

function hideFile(item) {
   var fileList = id$("files");

   fileList.removeChild(fileList.getElementsByTagName("span")[item]);
   fileList.removeChild(fileList.getElementsByTagName("input")[item * 2]);
   fileList.removeChild(fileList.getElementsByTagName("input")[item * 2]);
   fileList.removeChild(fileList.getElementsByTagName("a")[item]);
   fileList.removeChild(fileList.getElementsByTagName("br")[item]);
   updateItems(fileList);
}

function hideFileSpan(item) {
   var id = new String(item);
   var name = "addFileSpan" + id;
   var el = id$(name);
   if (el != null) {
      el.parentNode.removeChild(el);
   }
}

function updateItems(parentElement) {
   var inputList = parentElement.getElementsByTagName("input");
   var aList = parentElement.getElementsByTagName("a");

   for(i = 0; i < inputList.length; i+=2) {
      page = inputList[i];
      page.setAttribute("name", "page" + ((i / 2) + 1));

      file = inputList[i + 1];
      file.setAttribute("name", "document" + ((i / 2) + 1));

      a = aList[i / 2];
      a.setAttribute("position", (i / 2));
      a.setAttribute("href", "javascript:hideFileHandler(event);");
   }
}

// Убрал привязку вызова окошка ae_prompt к конкретной форме.
// Функция оставлена для совместимости,
// не стал искать по страницам, где она еще используется.
function checkSelectedDecisions(formName, decisionName, printActionName) {
   printSelectedDecisions(formName, decisionName, printActionName);
}

function printSelectedDecisions(formName, decisionName, printActionName) {
   var promtMessage =
      "Укажите номер страницы для печати.<br>" +
      "Если не указать номер, то для печати будут выведены все разрешения на текущей странице";
   $('#aep_text').data('validation-type', 'empty integer');
   $('#aep_text').data('validation-error', 'страница указана неверно');

   printSelectedItems(formName, decisionName, printActionName, promtMessage);
}

function printSelectedItems(formName, itemName, printActionName, promtMessage) {
   var someChecked = false;
   var form = document.forms[formName];
   var pks = window.document.forms[formName].elements[itemName];
   var params = new Array(formName, printActionName, itemName);

   if(pks != null) {

      if(pks.value != null) {
         if(pks.checked) {
            someChecked = true;
         }
      }

      for(i = 0; i < pks.length; i++) {
         if(pks[i].checked) {
            someChecked = true;
         }
      }

      form.setAttribute("target", "printWindow");
      if(!someChecked) {
         ae_prompt(setPagesForPrint, promtMessage, "", params);
      } else {
         openDecisionPrintWindow("", "printWindow");
         var oldActionName = document.forms[formName].elements["_action"].value;
         doAction(formName, printActionName, "");
         document.forms[formName].elements["_action"].value = oldActionName;
      }
   }
}

// Добавил условие на pages == "".
// Если юзер вместо страницы для печати ничего не написал,
// то функция checkAllPk отмечает все позиции на странице.
// Добавлено для оптимизации =)
function setPagesForPrint(pages, params) {
   if(pages != null && params != null) {
      var formName = params[0];
      var printActionName = params[1];
      var itemName = params[2];

      pages = pages.replace(/^\s+|\s+$/g, '');

      if (pages == "") {
         checkAllPk(formName, itemName, true);
      }

      window.document.forms[formName].elements["pagesForPrint"].value = pages;
      openPrintWindow("", "printWindow");
      var oldActionName = document.forms[formName].elements["_action"].value;
      doAction(formName, printActionName, "");
      document.forms[formName].elements["_action"].value = oldActionName;
   }
}

function checkAllPk(formName, itemName, checked) {
   document.forms[formName].elements["allpk"].checked = checked;
      checkboxAll(formName, itemName);
}

function someElementChecked(formName, elementName) {
   var someChecked = false;
   var pks = window.document.forms[formName].elements[elementName];

   if(pks.value != null) {
      if(pks.checked) {
         someChecked = true;
      }
   }

   for(i = 0; i < pks.length; i++) {
      if(pks[i].checked) {
         someChecked = true;
      }
   }

   return someChecked;
}

function viseSelectedDecisions(formName, decisionName, actionName, revoked) {
   if(!someElementChecked(formName, decisionName)) {
      alert("Не выбрано ни одного решения для визирования");
   } else {
      var msg = revoked === true
          ? "Внимание! Вы действительно хотите завизировать проект решения, который ранее был аннулирован?"
          : "Вы действительно хотите завизировать выбранные решения?";
      if(confirm(msg)) {
         doAction(formName, actionName, "");
      }
   }
}

function sendToWorkingSelectedDecisions(formName, decisionName, actionName) {
   if(!someElementChecked(formName, decisionName)) {
      alert("Не выбрано ни одного решения для отправки на доработку");
   } else {
      ae_prompt(sendToWorking, "Введите причину отправки на доработку:", "", [formName, actionName]);
   }
}

function sendToWorking(cause, params) {
   if(cause != null && params != null) {
      var element = window.document.forms[params[0]].elements["cause"];

      if(element != null) {
         element.value = cause;
      }

      doAction(params[0], params[1], "");
   }
}

function invertCheckbox(parentTD) {
   var input = parentTD.getElementsByTagName("input")[0];

   try {
      if (input && event && event.target !== input) {
         input.checked = !input.checked
      }
   } catch (e) {
      if (!(e instanceof ReferenceError)) {
         console.error(e);
      }
   }
}

function invertCheckbox2(input) {
   input.checked = !input.checked
}

function checkRadio(id, producerId) {
   var oldTd = $('[name = "oldTD"]').val();
   var oldParentTd = oldTd.split("_")[0];
   setTdChecked(oldTd, false);
   if (oldTd !== oldParentTd) {
      setTdChecked(oldParentTd, false);
   }
   setTdChecked(id, true);
   if (producerId !== undefined) {
      setTdChecked(id + "_" + producerId, true);
      document.forms[0].elements["oldTD"].value = id + "_" + producerId;
   } else {
      document.forms[0].elements["oldTD"].value = id;
   }

   loadRegData(id, producerId);

   if(document.forms[0].elements["medicineType"] != null) {
      selectMedicineProduct(id);
   }

   if(id$("efrNotSelect") != null) {
      id$("efrNotSelect").click();
   }
}

function setTdChecked(id, checked) {
   var td = id$("td" + id);
   if (td != null) {
      if (checked) {
         td.setAttribute("class", "checked");
         td.setAttribute("className", "checked");
      } else {
         td.setAttribute("class", "active");
         td.setAttribute("className", "active");
      }
      var checkBox = id$(id);
      if (checkBox != null) {
         checkBox.checked = checked;
      }
      $(td).find("td").each(function () {
         setTdChecked($(this).attr("id").substring(2), checked);
      });
   }
}

function checkRegReqForProduct(productPk) {
   var oldProducts = [373, 374, 386];
   if(id$("regReqHidden") != null) {
      if (productPk != null && !isNaN(productPk)) {
         $.post('operatorui', {
            _action: 'registrationNotRequiredByProduct',
            productPk: productPk
         })
            .done(function(data){
               id$("regReq").disabled = !data;
               id$("regReqHidden").disabled = data;
            })
            .fail(function(data){
               var regReqDisable = oldProducts.indexOf(parseInt(productPk)) >= 0;
               id$("regReq").disabled = !regReqDisable;
               id$("regReqHidden").disabled = regReqDisable;
            })
      } else {
         id$("regReq").disabled = true;
         id$("regReqHidden").disabled = false;
      }
   }
}

function selectMedicineProduct(id) {
   var type = document.forms[0].elements["_" + id + "_type"].value;
   selectMedicineProductByType(type);
}

function selectMedicineProductByType(type) {
   var productElement = document.forms[0].elements["product"];
   var subProductElement = document.forms[0].elements["subProduct"];

   initSubProductMedicineOption();
   $('#subProductView').html($('<option>', {
      selected: true,
      text: 'не указано',
   }));

   $.get("operatorui?_action=findProductByIrenaType&productType=4&irenaType=" + type, function(response) {
      if (response) {
         productElement.value = response.productPk;
         document.forms[0].elements["productView"].value = response.productPk;

         addSubProductMedicineOption("", response.subProductPk);

         subProductElement.value = response.subProductPk;

         $(subProductElement).change();
         if ($(productElement).data('request-type') === 'import') {
            checkImportMedicineRegReq(productElement.value, 'productView', true);
         } else {
            checkRegReqForProduct(productElement.value);
         }
         $('#subProductView').html($('<option>', {
            selected: true,
            value: response.subProductPk,
            text: response.subProductName,
         }));
      }
   });
}

function initSubProductMedicineOption() {
   var subProductElement = document.forms[0].elements["subProduct"];

   while(subProductElement.hasChildNodes()) {
      subProductElement.removeChild(subProductElement.childNodes[0]);
   }

   var firstOption = ce("option");
   var textNode = ct("не указано");
   firstOption.setAttribute("value", "null");
   firstOption.appendChild(textNode);
   subProductElement.appendChild(firstOption);
}

function addSubProductMedicineOption(text, value) {
   var subProductOption = null;

   subProductOption = ce("option");
   var textNode = ct(text);
   subProductOption.setAttribute("value", value);
   subProductOption.setAttribute("selected", "true");
   subProductOption.appendChild(textNode);

   document.forms[0].elements["subProduct"].appendChild(subProductOption);
}

function selectMedicineSubProduct(id) {
   if(id == 277) {
      document.forms[0].elements["subProduct"].value = 4440;
   } else if(id = 291) {
      document.forms[0].elements["subProduct"].value = 5123;
   } else {
      document.forms[0].elements["subProduct"].value = "";
   }
}

function setProductView() {
   var productPk = document.forms[0].elements["product"].value;
   if(type == 277) {
      document.forms[0].elements["productView"].value = 277;
   } else {
      document.forms[0].elements["productView"].value = 278;
   }
}

function toggleMedicineBlocks(isRegReq, skipChange) {
   var displayShowValue = getDisplayTableRowStyle();
   var fromRegistry = isRegReq && !$('#otherRegCountry').is(':checked');

   if (fromRegistry) {
      id$("productViewBlock").style.display = displayShowValue;
      id$("subProductViewBlock").style.display = displayShowValue;
      id$("productBlock").style.display = "none";
      id$("subProductBlock").style.display = "none";
      $('#efrSelect').parent().hide();
   } else {
      if (!skipChange) {
         $("#product").change();
      }
      id$("productBlock").style.display = displayShowValue;
      id$("subProductBlock").style.display = displayShowValue;
      id$("productViewBlock").style.display = "none";
      id$("subProductViewBlock").style.display = "none";
      $('#efrSelect').parent().show();
   }
}

function checkImportMedicineRegReq(product, mirrorId, skipClear) {
   $.get('operatorui', { _action: 'checkCargoRegReq', product })
       .done((regReq) => {
          id$("regReq").disabled = !regReq.editable;
          id$("regReqHidden").disabled = regReq.editable;
          if (!regReq.editable || $('#regReq').data('manual') !== true) {
             id$("regReq").checked = regReq.regReq;
             id$("regReqHidden").value = regReq.regReq;
          }
          $(mirrorId).val(product);
          doRegReq();
          toggleMedicineBlocks(id$("regReq").checked, true);
          if (!skipClear) {
             clearRegData();
             loadList("enterpriseListAjaxForm", "subProduct", product, id$("subProduct").value, false, "operatorui?_action=loadSubProduct&withoutHidden=true", init());
          }
       });
}

function clearRegData() {
   var name = id$("name");
   if (name == null) {
      name = id$("productName")
   }
   clearField(name);
   clearField(id$("form"));
   clearField(id$("producer"));
   clearField(id$("purpose"));
   clearField(id$("regNumber"));
   clearField(id$("registrationNumber"));
   clearField(id$("client"));
   clearField(id$("componentContent"));
   clearField(id$("dateFrom"));
   clearField(id$("dateTo"));
   clearField(id$("packaging"));
}

function clearField(elem) {
   if (elem != null) {
      elem.value = '';
   }
}

function checkGmoComment() {
   var GMO = $('#GMO');
   if (GMO.attr("readonly")) {
      return false;
   } else {
      if(GMO.is(':checked')) {
         id$("gmoComment").style.display = getDisplayTableRowStyle();
      } else {
         id$("gmoComment").style.display = "none";
         $("#gmoComment input").val("");
      }
      return true;
   }
}

function loadRegData(id, producerId) {
   $('[name *= "regGuid"]').val(id);

   var name = id$("name");
   if (name == null) {
      name = id$("productName")
   }
   fillField(id, "name", name);
   fillField(id, "form", id$("form"));
   fillField(id, "producer", id$("producer"));
   fillField(id, "purpose", id$("purpose"));
   fillField(id, "regNumber", id$("regNumber"));
   fillField(id, "registrationNumber", id$("registrationNumber"));
   fillField(id, "client", id$("client"));
   fillField(id, "componentContent", id$("componentContent"));
   fillField(id, "dateFrom", id$("dateFrom"));
   fillField(id, "dateTo", id$("dateTo"));
   fillField(id, "packaging", id$("packaging"));

   if (producerId !== undefined) {
      fillField(id, "producerView_" + producerId, id$("producer"));
   }

   var GMO = $('#GMO');
   if(GMO) {
      if($('[name = "_' + id + '_gmo"]').val() == "true") {
         GMO.prop('checked', true);
         GMO.attr("readonly", "readonly");
         if(id$("gmoComment") != null) {
            id$("gmoComment").style.display = getDisplayTableRowStyle();
            fillField(id, "gmoComment", id$("gmoComment"));
         }
      } else {
         GMO.prop('checked', false);
         GMO.removeAttr("readonly");
         if(id$("gmoComment") != null) {
            id$("gmoComment").style.display = "none";
         }
      }
   }

   var feedAdditiveType = $('[name = "_' + id + '_feedAdditiveType"]');
   if (feedAdditiveType.length > 0) {
      var value = feedAdditiveType.val();
      if (isInteger(value)) {
         $("#feedAdditive").val(value);
      } else {
         $("#feedAdditive").val("null");
      }
   }
}

function fillField(id, field, elem) {
   if(elem != null) {
      elem.value =
         $('[name = "_' + id + '_' + field + '"]').val();
   }
}

function setPageList(page) {
   var pageList = parseInt(document.forms[0].elements["pageList"].value);
   var lastPage = parseInt(document.forms[0].elements["lastPage"].value);

   if(page == "first") {
      document.forms[0].elements["pageList"].value = 1;
   } else if(page == "next") {
      document.forms[0].elements["pageList"].value = ++pageList;
   } else if(page == "prev") {
      document.forms[0].elements["pageList"].value = --pageList;
   } else {
      document.forms[0].elements["pageList"].value = lastPage;
   }
}

function setPageListForCargo(page) {
   var pageList = parseInt(document.forms[0].elements["pageListForCargo"].value);
   var lastPage = parseInt(document.forms[0].elements["lastPageForCargo"].value);

   if(page == "first") {
      document.forms[0].elements["pageListForCargo"].value = 1;
   } else if(page == "next") {
      document.forms[0].elements["pageListForCargo"].value = ++pageList;
   } else if(page == "prev") {
      document.forms[0].elements["pageListForCargo"].value = --pageList;
   } else {
      document.forms[0].elements["pageListForCargo"].value = lastPage;
   }
}

function toggleCheckbox(id) {
   checkBox(id);
}

function trim(str) {
   if (str == null) {
      return null;
   }
   str += " ";
   return str.replace(/^\s+|\s+$/g, '');
}

function equals(str1, str2) {
   var f = (str1 != null)
      && (str2 != null)
      && (trim(str1) == trim(str2));
   return f;
}

function equalsIgnoreCase(str1, str2) {
   var a = (str1 != null);
   var b = (str2 != null);
   if (a && b) {
      str1 = trim(str1).toLowerCase();
      str2 = trim(str2).toLowerCase();
   } else {
      return false;
   }
   var c = (str1 == str2);
   return c;
}

function isEmpty(str) {
   var a = (str == null);
   var b = !a && (trim(str).length == 0)
   return a || b;
}

function isNull(str) {
   var a = isEmpty(trim(str));
   var b = equals(trim(str), "null");
   return a || b;
}

function isInteger(n) {
    return /^\d+$/.test(n);
}

function contain(str1, str2) {
   return (str1.indexOf(str2, 0) > -1);
}

function containIgnoreCase(str1, str2) {
   return (str1.toLowerCase().indexOf(str2.toLowerCase(), 0) > -1);
}

function toggleTargetFormProductTypeBlock(requestTypeCheckbox) {
   if (requestTypeCheckbox != null) {
      var requestTypeCode = requestTypeCheckbox.getAttribute("requestType");
      if (requestTypeCode != null) {
         var productTypeBlock = document.getElementById(requestTypeCode + "ProductTypeBlock");
         if (productTypeBlock != null) {
            if (requestTypeCheckbox.checked) {
               productTypeBlock.style.display = "";
            } else {
               productTypeBlock.style.display = "none";

               resetProductTypeCheckboxes(requestTypeCode);
            }
         }
      }
   }
}

function resetProductTypeCheckboxes(requestTypeCode) {
   var productTypeCheckboxes = document.getElementsByName(requestTypeCode + "ProductType");
   if (productTypeCheckboxes != null) {
      for (var i = 0; i < productTypeCheckboxes.length; i++) {
         productTypeCheckboxes[i].checked = false;
      }
   }
}

function initTargetForm(formName) {
   var targetForm = document.forms[formName];
   if (targetForm != null) {
      for (var i = 0; i < targetForm.elements.length; i++) {
         var element = targetForm.elements[i];
         if (element.type == "checkbox"
               && element.getAttribute("requestType") != null
         ) {
            toggleTargetFormProductTypeBlock(element);
         }
      }
   }
}

function checkOtherCondition(checked) {
   var checkbox = document.getElementById("cnItemCheckbox:otherCondition");
   var hiddenField = document.getElementById("otherCondition");

   if (checkbox != null && hiddenField != null) {
      if (checked) {
         checkbox.checked = true;
         hiddenField.value = "true";

         // функция из condition_name_set_form.js
         // принимает в качестве параметра часть айдишника после двоеточия
         // (cnItemCheckbox:otherCondition)
         onConditionItemClick("otherCondition");
      } else {
         checkbox.checked = false;
         hiddenField.value = "false";
      }
   }
}

function checkUnitCoef() {
   var isCommonUnit = document.getElementById("isCommonUnit");
   var unitCoef = document.getElementById("unitCoef");
   var unitCoefHidden = document.getElementById("unitCoefHidden");
   var unitCoefLabel = document.getElementById("unitCoefLabel");
   var integral = id$("integral");
   var integralLabel = id$("integralLabel");
   if (isCommonUnit != null
      && unitCoef != null
      && unitCoefLabel != null
      && unitCoefHidden != null
   ) {
      if (isCommonUnit.checked) {
         unitCoef.style.color = "#AAAAAA";
         unitCoef.style.borderColor = "#AAAAAA";
         unitCoefLabel.style.fontStyle = "italic";
         unitCoefLabel.style.color = "#AAAAAA";
         unitCoef.disabled = true;
         unitCoef.setAttribute("oldValue", unitCoef.value);
         unitCoef.value = "1";
         unitCoefHidden.value = unitCoef.value;
         integralLabel.style.color = "";
         integralLabel.style.fontStyle = "";
         integral.disabled = false;
      } else {
         unitCoef.value = unitCoef.getAttribute("oldValue");
         unitCoefHidden.value = unitCoef.value;
         unitCoef.style.color = "";
         unitCoef.style.borderColor = "";
         unitCoefLabel.style.fontStyle = "";
         unitCoefLabel.style.color = "";
         unitCoef.disabled = false;
         integralLabel.style.color = "#AAAAAA";
         integralLabel.style.fontStyle = "italic";
         integral.disabled = true;
      }
   }
}

function realTrafficFormInConfirm() {
   return confirm("Вы действительно хотите завершить оформление груза, ввозимого на территорию РФ?");
}

function realTrafficFormOutConfirm() {
   return confirm("Вы действительно хотите завершить оформление груза, вывозимого за пределы РФ?");
}

function realTrafficFormConfirm() {
   return confirm("Вы действительно хотите завершить оформление груза?");
}

function realTrafficCargoRemoveConfirm() {
   return confirm("Вы действительно хотите удалить сведения о грузе?");
}

function automaticConditionApplyConfirm() {
   return confirm("Данное условие будет автоматически добавлено ко всем подходящим неоформленным разрешениям.\nВы уверены, что хотите продолжить?");
}

function constraintApplyConfirm() {
   return confirm("Данное ограничение будет применено ко всем подходящим заявкам и разрешениям.\nВы уверены, что хотите продолжить?");
}

function pvkpConstraintApplyConfirm() {
   return confirm("Вы подтверждаете применение данного ограничения на пункты пропуска?");
}

function checkDecisionConfirm() {
   return confirm("Вы действительно хотите отметить данное решение как одобренное?");
}

function returnDecisionConfirm() {
   return confirm("Вы действительно хотите отозвать данное решение?\nПри этом оно будет направлено на доработку исполнителю.");
}

function showTextareaForm() {
   var textareaOvrl = window.document.getElementById("aep_ovrl");
   var textareaWw = window.document.getElementById("aep_ww");
   if (textareaOvrl != null && textareaWw != null) {
      document.body.style.overflow = "auto";
      textareaOvrl.style.display = "";
      textareaWw.style.display = "";
   }
}

function showTextareaForm2(formName, srtPk, srtVersion) {
   if(formName != null && srtPk != null) {
      document.forms[formName].elements['sRealTrafficPk'].value = srtPk;
      document.forms[formName].elements['srtVersion'].value = srtVersion;
   }
   showTextareaForm();
}

function showTextareaFormAndSetAction(formName, statusPk, statusVersion, action) {
   if(formName != null && statusPk != "") {
      document.forms[formName].elements['statusPk'].value = statusPk;
      document.forms[formName].elements['statusVersion'].value = statusVersion;
   }
   if(id$("submitButton") != null) {
      id$("textareaButtons").removeChild(id$("submitButton"));
   }
   if (id$("cancelButton") != null) {
      id$("textareaButtons").removeChild(id$("cancelButton"));
   }

   var button = null;
   var cancelButton = null;

   button = ce("button");
   button.setAttribute("type", "button");
   button.setAttribute("class", "postitive");
   button.setAttribute("id", "submitButton");
   button.onclick = function() { checkFieldAndSubmit(formName, action, 'sentToWorkingReason');};

   cancelButton = ce("button");
   cancelButton.setAttribute("type", "button");
   cancelButton.setAttribute("id", "cancelButton");
   cancelButton.setAttribute("class", "negative");
   cancelButton.onclick = function() { hideTextareaForm();};

   var img = ce("img");
   img.setAttribute("src", "/vetcontrol-docs/common/img/buttons/tick.gif");
   var text = ct("Отправить на доработку");
   button.appendChild(img);
   button.appendChild(text);

   var img2 = ce("img");
   img2.setAttribute("src", "/vetcontrol-docs/common/img/buttons/cross.gif");
   var text2 = ct("Отмена");
   cancelButton.appendChild(img2);
   cancelButton.appendChild(text2);

   id$("textareaButtons").appendChild(button);
   id$("textareaButtons").appendChild(cancelButton);

   showTextareaForm();
}

function hideTextareaForm() {
   var textareaOvrl = window.document.getElementById("aep_ovrl");
   var textareaWw = window.document.getElementById("aep_ww");

   if (textareaOvrl != null && textareaWw != null) {
      document.body.style.overflow = "auto";
      textareaOvrl.style.display = "none";
      textareaWw.style.display = "none";
      
      var errorMessage = document.getElementById("errorMessage");
      
      if (errorMessage) {
         errorMessage.style.display = "none";
      }
   }
}

function checkFieldAndSubmit(formName, formAction, fieldId, messageId) {
   if(messageId == undefined)
      messageId = "errorMessage";
   var fieldElement = id$(fieldId);
   if (fieldElement != null) {
      if(fieldElement.value == null || trim(fieldElement.value) == "") {
         var errorElement = id$(messageId);
         errorElement.style.display = "block";
      } else {
         doAction(formName, formAction);
      }
   }
}

function addEnterpriseImportCountry(formName) {
	   var countryList = id$("countries");
	   var countryStr = new String(document.forms[formName].elements["importCountries"].value);
	   var countryArr = countryStr.split("_");
	   var cId = countryArr[0];

	   if (cId !== "null") {
		   var cName = countryArr[1];
		   if (id$(cId) == null) {
			  var span = ce("span");
			  span.setAttribute("class", "short");
			  span.setAttribute("id", cId);
			  span.setAttribute("name", cId);
			  span.appendChild(ce("br"));

			  var a = ce("a");
			  a.setAttribute("href", "javascript:hideEnterpriseImportCountry(\"" + cId + "\");");
			  var textNode = ct("Удалить");
			  var whiteSpace = ct(" ");
			  a.appendChild(textNode);
			  span.appendChild(a);
			  span.appendChild(whiteSpace);

			  var page = ce("input");
			  page.setAttribute("id", "importCountry_" + cId);
			  page.setAttribute("name", "importCountry");
			  page.setAttribute("type", "hidden");
			  page.setAttribute("value", cId);
			  span.appendChild(page);
			  span.appendChild(ct(cName + "  "));

			  countryList.appendChild(span);
		   } else {
			  alert("Страна " + cName + " уже выбрана");
		   }
	}
}

function hideEnterpriseImportCountry(countryPk) {
   id$("countries").removeChild(id$(countryPk));
}

function removeEnterpriseImportCountryActConfirm() {
   return confirm("Вы действительно хотите удалить данный файл?");
}

function startsWith(string, substring) {
   return string.substring(0, parseInt(substring.length)) == substring;
}

function endsWith(string, substring) {
   return string.substring(parseInt(string.length) - parseInt(substring.length), parseInt(string.length)) == substring;
}

function getDisplayTableRowStyle() {
   var displayShowValue = "table-row";
   if(ie()) {
      displayShowValue = "";
   }

   return displayShowValue;
}

function copySecretCode(fieldName) {
   var field = id$(fieldName);
   if (field != null) {
     copyToClipboard(field.value);
   }
}

function copyToClipboard(s) {
   if (window.clipboardData && clipboardData.setData) {
      clipboardData.setData('text', s);
   }
}

function showModifyFirmPropsMessage() {
   alert("После сохранения введенной информации для начала работы Вам потребуется заново войти в систему под тем же паролем");
}

function addReferencedCheckedElement(selectedElement) {
   var selectedName = selectedElement.getAttribute("selectedName");
   var selectedValue = selectedElement.getAttribute("value");
   var storage = id$("storage");

   if (!selectedElement.checked) {
      var size = storage.childNodes.length;
      for (var i = 0; i < size; i++) {
         if (storage.childNodes[i].value == selectedValue) {
            storage.removeChild(storage.childNodes[i]);
            break;
         }
      }
   } else {
      var input = ce("input");
      input.setAttribute("type", "hidden");
      input.setAttribute("name", selectedName);
      input.setAttribute("value", selectedValue);
      storage.appendChild(input);
   }
}

function getTextContent(node) {
   var _result = "";
   if(node == null) {
      return _result;
   }
   return node.text || node.textContent || (function(node) {
      var _result = "";
      var childrens = node.childNodes;
      var i = 0;
      while (i < childrens.length) {
         var child = childrens.item(i);
         switch (child.nodeType) {
            case 1: // ELEMENT_NODE
            case 5: // ENTITY_REFERENCE_NODE
               _result += arguments.callee(child);
               break;
            case 3: // TEXT_NODE
            case 2: // ATTRIBUTE_NODE
            case 4: // CDATA_SECTION_NODE
               _result += child.nodeValue;
               break;
            case 6: // ENTITY_NODE
            case 7: // PROCESSING_INSTRUCTION_NODE
            case 8: // COMMENT_NODE
            case 9: // DOCUMENT_NODE
            case 10: // DOCUMENT_TYPE_NODE
            case 11: // DOCUMENT_FRAGMENT_NODE
            case 12: // NOTATION_NODE
            // skip
            break;
         }
         i++;
      }
      return _result;
   } (node));
}

function toggleForRadio(id, show, radioName, formName) {
   var element = id$(id);
   if(show) {
      element.style.display = 'block';
   } else {
      element.style.display = 'none';
   }

   var radios = document.forms[formName].elements[radioName];
   for (var i = 0; i < radios.length; i++) {
      var itemId = radios[i].value;
      if (("p" + itemId) != id) {
         id$("p" + itemId).style.display = 'none';
      }
   }
}

function addTextInput(name, styleClass, container, addElement) {
   var parent = id$(container);
   var input = document.createElement("input");
   input.setAttribute("class", styleClass);
   input.setAttribute("name", name);
   input.setAttribute("type", "text");
   parent.appendChild(input);
   var addButton = id$(addElement);
   parent.removeChild(addButton);
   parent.appendChild(addButton);
}

function getProductName(subProductNameWithCode) {
   var expr = new RegExp("\\s\\([\\d,\\-\\s\\.]*\\)");

   if(expr.test(subProductNameWithCode)) {
      try {
         return subProductNameWithCode.substring(
            0, parseInt(subProductNameWithCode.length) - parseInt(expr.exec(subProductNameWithCode)[0].length)
         );
      } catch (error) {
         return subProductNameWithCode;
      }
   } else {
      return subProductNameWithCode;
   }
}

function splitWeightOfVetDocument(checked) {
   if(checked) {
      id$("inputWeightBlock").style.display = getDisplayTableRowStyle();
      $('#related-document-edit-block').show();
      var wabillBlock = id$("waybillRouteAddBlock");
      if (wabillBlock) {
        wabillBlock.style.display = getDisplayTableRowStyle();
      }
      var qpb = id$("quantityPackingBlock");
      if (qpb) {
         qpb.style.display = getDisplayTableRowStyle();
      }
      id$("splitWeightHelpBlock").style.display = getDisplayTableRowStyle();
      var noticeField = id$("noticeFieldValue");
      if (noticeField.value.toLowerCase().indexOf('причина возврата') < 0) {
         noticeField.value += (isEmpty(id$("noticeFieldValue").innerHTML) ? "" : "\n") + "Причина возврата: "
      }
   } else {
      id$("inputWeightBlock").style.display = "none";
      $('#related-document-edit-block').hide();
      var wabillBlock = id$("waybillRouteAddBlock");
      if (wabillBlock) {
        wabillBlock.style.display = "none";
      }
      var qpb = id$("quantityPackingBlock");
      if (qpb) {
         qpb.style.display = "none";
      }
      id$("splitWeightHelpBlock").style.display = "none";
      id$("noticeFieldValue").innerHTML = "";
   }
}

function realTrafficActFormConfirm() {
   return confirm("Вы действительно хотите принять решение по данному грузу \"Досмотр невозможен по техническим причинам\" без оформления акта ветеринарно-санитарного досмотра?");
}

function setCurrentDay(startDateId, endDateId, isChecked) {
   setCurrentDayInterval(startDateId, endDateId, isChecked, 0);
}

function setCurrentDayInterval(startDateId, endDateId, isChecked, intervalInDays) {
   if(isChecked) {
      var now = new Date();
      if(id$(startDateId) != null) {
         id$(startDateId).value = getDateString(now);
      }
      if(id$(endDateId) != null) {
         now.setDate(now.getDate() + intervalInDays);
         id$(endDateId).value = getDateString(now);
      }
   } else {
      if(id$(startDateId) != null) {
         id$(startDateId).value = "";
      }
      if(id$(endDateId) != null) {
         id$(endDateId).value = "";
      }
   }
   if (id$(startDateId) != null) {
      id$(startDateId).dispatchEvent(createEvent("change"));
   }
   if (id$(endDateId) != null) {
      id$(endDateId).dispatchEvent(createEvent("change"));
   }
}

function getDateString(date) {
   var day = date.getDate();
   var month = date.getMonth() + 1;
   var year = date.getYear();
   //Разные браузеры по-разному вычисляют год. Например IE даёт полный год, а FF - полный год минус 1900
   //По браузеру не стал проверять, т.к. этот способ менее надежный, чем нижеиспользуемый
   //Вряд ли пользователю нужно будет найти записи 1900-летней давности...
   if(year < 1900) {
      year = year + 1900;
   }

   return (day > 9 ? day : "0" + day) + "." + (month > 9 ? month : "0" + month) + "." + year;
}

function getTimeString(date) {
   var h = date.getHours();
   var m = date.getMinutes();
   return (h > 9 ? h : "0" + h) + ":" + (m > 9 ? m : "0" + m);
}

function openWindow(url, windowName, left, top, height, width) {
   window.document.printWindow = window.open(
      url,
      windowName,
      "directories=no," +
      "hotkeys=no," +
      "menubar=yes," +
      "resizable=yes," +
      "scrollbars=yes," +
      "status=no," +
      "toolbar=no," +
      "left=" + left + "," +
      "top=" + top + "," +
      "sreenX=" + left+ "," +
      "screenY=" + top + "," +
      "height=" + height + "," +
      "width=" + width
   );
   if (window.document.printWindow != null) {
      window.document.printWindow.focus();
   }
}

function openPrintWindow(url, windowName) {
   var height = document.body.clientHeight;
   var width = document.body.clientWidth - 300;
   openWindow(url, windowName, 0, 0, height, width);
}

function openDecisionPrintWindow(url, windowName) {
   openWindow(url, windowName, 0, 0, document.body.clientHeight, 700);
}

function setFirmDetailsByCountry() {
   var country = document.getElementsByName("country.guid")[0];
   var style = getDisplayTableRowStyle();

   if (country.value == "74a3cbb1-56fa-94f3-ab3f-e8db4940d96b") {
      id$("details").style.display = style;
   } else {
      id$("details").style.display = "none";
   }
}

function checkFocus(obj, keyPress, num) {
   //Except enter, backspace e delete
   if ((keyPress.keyCode != 13) && (keyPress.keyCode != 8) && (keyPress.keyCode != 46) ) {
      if (obj.value.length > 3 && document.forms[0].elements["uuid_" + num] != null) {
         document.forms[0].elements["uuid_" + num].focus();
         checkUUID(num - 1);
      }
   }
}

function checkUUID(num) {
   var expr = new RegExp("[0-9a-fA-F]{4}");

   if(expr.test(document.forms[0].elements["uuid_" + num].value)) {
      document.forms[0].elements["uuid_" + num].setAttribute("class", "UUID");
      document.forms[0].elements["uuid_" + num].setAttribute("className", "UUID");
      id$("errorMessage").innerHTML = "";
      return true;
   } else {
      document.forms[0].elements["uuid_" + num].setAttribute("class", "notValidUUID");
      document.forms[0].elements["uuid_" + num].setAttribute("className", "notValidUUID");
      id$("errorMessage").innerHTML = "Код ветеринарно-сопроводительного документа указан некорректно";
      return false;
   }
}

function isValidUUID() {
   var f = true;
   var isValid = true;

   for(var i = 1; i <= 8; i++) {
      f = checkUUID(i);
      if(isValid && !f) {
         isValid = f;
      }
  }

  if(!isValid) {
     id$("errorMessage").innerHTML = "Код ветеринарно-сопроводительного документа указан некорректно";
  } else {
     id$("errorMessage").innerHTML = "";
  }

  return isValid;
}

function clearUUID() {
   for(var i = 1; i <= 8; i++) {
      document.forms[0].elements["uuid_" + i].value = "";
      document.forms[0].elements["uuid_" + i].setAttribute("class", "UUID");
      document.forms[0].elements["uuid_" + i].setAttribute("className", "UUID");
   }
   id$("errorMessage").innerHTML = "";
}

function checkReportWeightDifference(checked) {
   var color = "#fff";
   if(checked) {
      color = "#eee";
   }

   id$("amount").style.background = color;
   id$("amount").disabled = checked;
}


function printSelectedVetCertificateWeight(formName, vcName, printActionName) {
   var promtMessage =
      "Укажите номер страницы для печати.<br>" +
      "Если не указать номер, то для печати будут выведены все ветсертификаты на текущей странице";

   var someChecked = false;
   var form = document.forms[formName];
   var pks = window.document.forms[formName].elements[vcName];
   var params = new Array(formName, printActionName, vcName);

   if(pks.value != null) {
      if(pks.checked) {
         someChecked = true;
      }
   }

   for(i = 0; i < pks.length; i++) {
      if(pks[i].checked) {
         someChecked = true;
      }
   }

   form.setAttribute("target", "printWindow");
   if(!someChecked) {
      ae_prompt(setPagesForPrint, promtMessage, "", params);
   } else {
      openPrintWindow("", "printWindow");
      var oldActionName = document.forms[formName].elements["_action"].value;
      doAction(formName, printActionName, "");
      document.forms[formName].elements["_action"].value = oldActionName;
   }
}

function pasteUUID(num) {
   if (window.clipboardData) {
      var uuid = window.clipboardData.getData("text");

      for(var i = 0; i < uuid.length(); i + 4) {
         if(num <= 8) {
            document.forms[0].elements["uuid_" + num].value = uuid.substring(i, i + 4);
            checkUUID(num);
         } else {
            break;
         }
         if(num < 8) {
            document.forms[0].elements["uuid_" + (num + 1)].focus();
            num++;
         } else {
            break;
         }
      }
   }
}

function checkExportAnimal(formName) {
   var productType = document.forms[formName].elements["productType"].value;
   if(productType != null && productType == 3) {
      var originCounty = document.forms[formName].elements["originCountry"].value;
	  var isForeign = document.forms[formName].elements["isForeign"].value;
      if (isForeign == "false" || originCounty == "74a3cbb1-56fa-94f3-ab3f-e8db4940d96b" && isForeign == "true") {
         id$("warehouses").style.display = getDisplayTableRowStyle();
		 $("#storagePoint").hide();
      } else {
         $("#warehouses").hide();
         id$("storagePoint").style.display = getDisplayTableRowStyle();
      }
   }
}

function setFodderRegFieldsEditable() {
   var otherRegCountry = id$("otherRegCountry");
   var regReq = id$("regReq");

   if(regReq != null && regReq.checked && otherRegCountry != null) {
      var name = id$("name");
      if (name == null) {
         name = id$("productName");
      }
      var form = id$("form");
      var producer = id$("producer");
      var purpose = id$("purpose");
      var componentContent = id$("componentContent");
      var regNumber = id$("regNumber");
      var registrationNumber = id$("registrationNumber");
      var client = id$("client");
      var dateFrom = id$("dateFrom");
      var dateTo = id$("dateTo");

      name.readOnly = !otherRegCountry.checked;
      form.readOnly = !otherRegCountry.checked;
      if (producer) {
         producer.readOnly = !otherRegCountry.checked;
      }
      purpose.readOnly = !otherRegCountry.checked;
      componentContent.readOnly = !otherRegCountry.checked;
      regNumber.readOnly = !otherRegCountry.checked;
      registrationNumber.readOnly = !otherRegCountry.checked;
      client.readOnly = !otherRegCountry.checked;
      dateFrom.readOnly = !otherRegCountry.checked;
      dateTo.readOnly = !otherRegCountry.checked;

      if (otherRegCountry.checked){
         $('#GMO').removeAttr("readonly");
         $('#feedAdditive').removeAttr("disabled");
      } else {
         $('#feedAdditive').attr("disabled", "disabled");
      }

      toggleFodderRegFindForm(otherRegCountry.checked);

      toggleFodderEnterpriseField(!otherRegCountry.checked);
      $('#cargo-purpose-block').toggle(!regReq.checked || otherRegCountry.checked)
   }
}

function toggleFodderRegFindForm(otherRegCountry) {
   var displayShowValue = getDisplayTableRowStyle();

   var name = id$("name");
   if (name == null) {
      name = id$("productName");
   }
   var form = id$("form");
   var producer = id$("producer");
   var purpose = id$("purpose");
   var componentContent = id$("componentContent");
   var regNumber = id$("regNumber");
   var registrationNumber = id$("registrationNumber");
   var client = id$("client");
   var dateFrom = id$("dateFrom");
   var dateTo = id$("dateTo");
   var regDataFindForm = id$("regDataFindForm");
   var regSearchResult = id$("regSearchResult");
   var regSearchResultNav = id$("regSearchResultNav");

   if(otherRegCountry) {
      regDataFindForm.style.display = "none";
      if(regSearchResult != null) {
         regSearchResult.style.display = "none";
      }
      if(regSearchResultNav != null) {
         regSearchResultNav.style.display = "none";
      }

      name.style.background = "#fafafa";
      form.style.background = "#fafafa";
      if (producer) {
         producer.style.background = "#fafafa";
      }
      purpose.style.background = "#fafafa";
      componentContent.style.background = "#fafafa";
      regNumber.style.background = "#fafafa";
      registrationNumber.style.background = "#fafafa";
      client.style.background = "#fafafa";
      dateFrom.style.background = "#fafafa";
      dateTo.style.background = "#fafafa";
   } else {
      regDataFindForm.style.display = "block";
      if(regSearchResult != null) {
         regSearchResult.style.display = displayShowValue;
      }
      if(regSearchResultNav != null) {
         regSearchResultNav.style.display = displayShowValue;
      }

      name.style.background = "#efefef";
      form.style.background = "#efefef";
      if (producer) {
         producer.style.background = "#efefef";
      }
      purpose.style.background = "#efefef";
      componentContent.style.background = "#efefef";
      regNumber.style.background = "#efefef";
      registrationNumber.style.background = "#efefef";
      client.style.background = "#efefef";
      dateFrom.style.background = "#efefef";
      dateTo.style.background = "#efefef";
   }
}

function doFodderRegReq() {
   var name = id$("name");
   if (name == null) {
      name = id$("productName");
   }
   var form = id$("form");
   var producer = id$("producer");
   var purpose = id$("purpose");
   var nameProduct = id$("nameProduct");
   var regReq = id$("regReq");
   var regNumber = id$("regNumber");
   var registrationNumber = id$("registrationNumber");
   var client = id$("client");
   var componentContent = id$("componentContent");
   var dateFrom = id$("dateFrom");
   var dateTo = id$("dateTo");
   var clientBlock = id$("clientBlock");
   var regNumberBlock = id$("regNumberBlock");
   var registrationNumberBlock = id$("registrationNumberBlock");
   var deliveryDateBlock = id$("deliveryDateBlock");
   var regSearchResultBlock = id$("regSearchResult");
   var regSearchResultNavBlock = id$("regSearchResultNav");

   var displayShowValue = getDisplayTableRowStyle();
   var otherRegCountry = id$("otherRegCountry");

   if(regReq.checked) {
      name.readOnly = true;
      form.readOnly = true;
      purpose.readOnly = true;
      componentContent.readOnly = true;
      client.readOnly = true;
      regNumber.readOnly = true;
      registrationNumber.readOnly = true;
      dateFrom.readOnly = true;
      dateTo.readOnly = true;
      nameProduct.style.display = "block";

      clientBlock.style.display = displayShowValue;
      regNumberBlock.style.display = displayShowValue;
      registrationNumberBlock.style.display = displayShowValue;
      deliveryDateBlock.style.display = displayShowValue;
      regSearchResultBlock.style.display = displayShowValue;
      regSearchResultNavBlock.style.display = displayShowValue;

      name.style.background = "#efefef";
      form.style.background = "#efefef";
      purpose.style.background = "#efefef";
      componentContent.style.background = "#efefef";
      client.style.background = "#efefef";
      regNumber.style.background = "#efefef";
      registrationNumber.style.background = "#efefef";
      dateFrom.style.background = "#efefef";
      dateTo.style.background = "#efefef";

      if (producer){
         producer.readOnly = true;
         producer.style.background = "#efefef";
      }

      if (otherRegCountry.checked){
         $('#feedAdditive').removeAttr("disabled");
      } else {
         $('#feedAdditive').attr("disabled", "disabled");
      }
      toggleFodderRegFindForm(otherRegCountry.checked)
   } else {

      if(otherRegCountry != null) {
         otherRegCountry.checked = false;
         setFodderRegFieldsEditable();
      }
      name.readOnly = false;
      form.readOnly = false;
      purpose.readOnly = false;
      componentContent.readOnly = false;
      client.readOnly = true;
      regNumber.readOnly = true;
      registrationNumber.readOnly = true;
      dateFrom.readOnly = true;
      dateTo.readOnly = true;
      nameProduct.style.display = "none";

      clientBlock.style.display = "none";
      regNumberBlock.style.display = "none";
      registrationNumberBlock.style.display = "none";
      deliveryDateBlock.style.display = "none";
      regSearchResultBlock.style.display = "none";
      regSearchResultNavBlock.style.display = "none";

      name.style.background = "#fafafa";
      form.style.background = "#fafafa";
      purpose.style.background = "#fafafa";
      componentContent.style.background = "#fafafa";

      if (producer != null){
         producer.readOnly = false;
         producer.style.background = "#fafafa";
      }

      $('#GMO').removeAttr("readonly");
      $('#feedAdditive').removeAttr("disabled");

      regNumber.value = "";
      registrationNumber.value = "";
      client.value = "";
      dateFrom.value = "";
      dateTo.value = "";
   }

   toggleFodderEnterpriseField(regReq.checked);
   $('#cargo-purpose-block').toggle(!regReq.checked || otherRegCountry.checked)
}

function toggleFodderEnterpriseField(textOnly) {
   if (textOnly) {
      $('#enterpriseInputType').hide();
      $('[name = "enterpriseFromReference"]').removeAttr("checked");
      try {
         $('#efrNotSelect').click();
      } catch (e) { }
   } else {
      if (window.enterpriseChooseForm) {
         enterpriseChooseForm.checkEnterpriseRequired();
      } else {
         $('#enterpriseInputType').show();
      }
   }
}

function getCheckedRadio(formName, radioName) {
   if(document.forms[formName] == null || document.forms[formName].elements[radioName] == null) {
      return null;
   }

   var elements = document.forms[formName].elements[radioName];
   if(isNaN(elements.length)) {
      if(elements.checked) {
         return elements.value;
      }
   } else {
      for(var i = 0; i < elements.length; i++) {
         if(elements[i].checked) {
            return elements[i].value;
         }
      }
   }

   return null;
}

function validAndSubmitRealTrafficChooseForm(formName, firmPk) {
   var form = document.forms[formName];
   var realTrafficType = getCheckedRadio(formName, "realTrafficType");
   var requestType = getCheckedRadio(formName, "requestType");
   var isValid = !isEmpty(realTrafficType);

   if(!isValid) {
      alert("Укажите информацию в обязательных для заполнения полях");
   } else {
      if(realTrafficType == "general") {
         doAction(formName, "findGeneralDecisionForRealTrafficAjaxForm", "");
      } else {
         if(requestType != 3) {
            showAjaxProcessingImage('winAjaxShowForm');
            matchDecisionGreenPass('', '', formWithoutNotificationFunc, showNotificationDialogFunc, firmPk);
         } else {
            doAction(formName, "showSimpleRealTrafficTransitInAddForm", "");
         }
      }
   }
}

function checkElementByValue(form, name, value) {
   if(form != null && name != null) {
      var elements = document.forms[form].elements[name];

      if(elements != null) {
         if(isNaN(elements.length)) {
            if(elements.value == value) {
               elements.checked = true;
            }
         } else {
            for(var i = 0; i < elements.length; i++) {
               if(elements[i].value == value) {
                  elements[i].checked = true;
               }
            }
         }
      }
   }
}

function checkOtherConstraintType(inputType) {
   if (inputType == 1 || inputType == 2) {
      $(".otherTypeInput").hide().attr('disabled', true);
   } else if (inputType == 3) {
      $(".otherTypeInput").show().removeAttr('disabled');
   }
}

function changeDateForPerishableProduction(perishable) {
   if(perishable == null) {perishable = true;}

   try {
       DateFormatNamespace.onPerishableChange(perishable);
   } catch (e) {}
}

function setStamp(visible) {
   displayTableRow(visible, "vetStampTypeRow");
   displayTableRow(visible, "revokedRow");
   if (id$("revoked").checked) {
      setStampRevoke(visible);
   }
}

function setStampRevoke(visible) {
   displayTableRow(visible, "revokeReasonRow");
   displayTableRow(visible, "revokingDateRow");
}

function showNumberWindowAjax(url, submitForm, formName) {
   var found = false;
   var enterpriseTypeValue;
   var enterpriseTypeElement;
   var enterpriseTypeRadio = false;

   if(document.forms["enterpriseModifyForm"] != null) {
      if(document.forms["enterpriseModifyForm"].elements["enterpriseType"] != null) {
         enterpriseTypeElement = document.forms["enterpriseModifyForm"].elements["enterpriseType"];
         enterpriseTypeRadio = true;
      } else if(document.forms["enterpriseModifyForm"].elements["enterpriseType.pk"] != null) {
         enterpriseTypeElement = document.forms["enterpriseModifyForm"].elements["enterpriseType.pk"];
      }
   } else if(document.forms["enterpriseAddForm"]) {
      if(document.forms["enterpriseAddForm"].elements["enterpriseType"] != null) {
         enterpriseTypeElement = document.forms["enterpriseAddForm"].elements["enterpriseType"];
         enterpriseTypeRadio = true;
      } else if(document.forms["enterpriseAddForm"].elements["enterpriseType.pk"] != null) {
         enterpriseTypeElement = document.forms["enterpriseAddForm"].elements["enterpriseType.pk"];
      }
   }

   if(enterpriseTypeRadio) {
      if(isNaN(enterpriseTypeElement.length)) {
         if(enterpriseTypeElement.checked) {
            found = true;
            enterpriseTypeValue = enterpriseTypeElement.value;
         }
      } else {
         for(i = 0; i < enterpriseTypeElement.length; i++) {
            if(enterpriseTypeElement[i].checked) {
               found = true;
               enterpriseTypeValue = enterpriseTypeElement[i].value;
            }
         }
      }
   } else {
      enterpriseTypeValue = enterpriseTypeElement.value;
   }

   if (enterpriseTypeRadio && !found) {
      alert("Тип поднадзорного объекта не определен");
   }
   url += "&enterpriseType=" + enterpriseTypeValue;
   if (!submitForm) {
      loadCommonWindow(url, init());
   } else {
      loadHTMLData(url, formName, "winAjaxShowForm", init());
   }
}

function showNumberAdd(enterprisePk) {
   var url = "operatorui?"
      + "_action=addEnterpriseStampAjaxForm"
      + "";
   if (enterprisePk != null) {
      url += "&enterprisePk=" + enterprisePk;
   }
   showNumberWindowAjax(url, false);
}

function stampModify(id, enterprisePk) {
   var url = "operatorui?"
      + "_action=modifyEnterpriseStampAjaxForm"
      + ""
      + "&pk=" + id;
   if (enterprisePk == null) {
      url += "&insertOperation=true";
   } else {
      url += "&enterprisePk=" + enterprisePk;
   }
   showNumberWindowAjax(url, true, "enterpriseAddForm");
}

function stampDeleteAjax(id) {
   if (confirm("Вы уверены, что хотите удалить номер?")) {
      deleteEnterpriseNumber("operatorui?"
         + "&_action=removeEnterpriseNumber"
         + "",
         id, init()
      );
      info = id$("numberSpan_" + id);
      if (info != null) {
         info.parentNode.removeChild(info);
      }
   }
}

function onEnterNumberAdd(e, modify) {
   var key = navigator.appName == 'Netscape' ? e.which : e.keyCode;
   if(key == 13) {
      if (modify) {
         modifyEnterpriseNumberStamp("operatorui?_action=modifyEnterpriseNumberStamp",
            "numberAjaxAddForm", "winAjaxShowForm", init());
      } else {
         addEnterpriseNumberStamp("operatorui?_action=addEnterpriseNumberStamp", "numberAjaxAddForm", "winAjaxShowForm",
            "numberInfoSpan", "numberHiddenSpan", init());
      }
   }
}

function stampDelete(id) {
   if (confirm("Вы уверены, что хотите удалить номер?")) {
      hidden = id$("numberDiv_" + id);
      info = id$("numberSpan_" + id);
      if (hidden != null) {
         hidden.parentNode.removeChild(hidden);
      }
      if (info != null) {
         info.parentNode.removeChild(info);
      }
   }
}

function doActionWithEnterprises(formToPost, checked) {
   var enterpriseAction = getCheckedRadio("enterpriseListForm", "enterpriseAction");
   var action;

   if(enterpriseAction != null) {
      if(enterpriseAction == 'addStatusToEnterprises') {
         action = checked ? "addStatusEnterpriseListCheckedForeignForm" : "addStatusEnterpriseListForm";
         doAction(formToPost, action, '');
      } else if(enterpriseAction == 'moveToHiddenEnterprises' || enterpriseAction == 'moveFromHiddenEnterprises') {
         if(enterpriseActionConfirm()) {
            action = checked ? "changeEnterpriseHiddenListCheckedForeignForm" : "changeEnterpriseHiddenListForm";
            document.forms["enterpriseFindForm"].elements["enterpriseAction"].value = enterpriseAction;
            doAction(formToPost, action, '');
         }
      }
   }
}

function checkFileSize(fileInput) {
   if(ie()) {
      try {
         var fso = new ActiveXObject("Scripting.FileSystemObject");
         var filepath = fileInput.value;
         var thefile = fso.GetFile(filepath);
         var size = thefile.size;
         if (size > fileMaxSize) {
            fileInput.style.border = "3px solid red";
            alert("Превышен максимально допустимый размер файла: 5 Мб");
            fileInput.value = "";
         } else {
            fileInput.style.border = "1px solid #31AAE1";
         }
      } catch(e) {}
   } else {
      var files = fileInput.files;
      if (files) {
         for (var i = 0; i < files.length; i++) {
            if (files[i].size > fileMaxSize) {
               fileInput.style.border = "3px solid red";
               alert("Превышен максимально допустимый размер файла: 5 Мб");
               fileInput.value = "";
            } else {
               fileInput.style.border = "1px solid #31AAE1";
            }
         }
      }
   }
}

function setOuterHTML(elementID, newCode) {
   var someElement = id$(elementID);
   if (someElement.outerHTML) {
      someElement.outerHTML = newCode;
   } else {
      var range = document.createRange();
      range.setStartBefore(someElement);
      var docFrag = range.createContextualFragment(newCode);
      someElement.parentNode.replaceChild(docFrag, someElement);
   }
}

function setInnerHTML(el, html) {
   var element = typeof el == "string" ? document.getElementById(el) : el;
   $(element).html(html);
}

function prepareSettingsForm() {
   $("ul.form").hide();
   addHoverEventToTitles();
   $("div.title").click(
      function() {
         $("div.title").removeClass("selectedTitle");
         addHoverEventToTitles();
         $(this).off('mouseenter mouseleave');
         $(this).addClass("selectedTitle");
         $("ul.form").slideUp("fast");
         $(this).next("ul.form:hidden").slideDown("normal");
      }
   );
}

function addHoverEventToTitles() {
   $("div.title").hover(
      function() {
         $(this).addClass("selectedTitle");
      },
      function() {
         $(this).removeClass("selectedTitle");
      }
   );
}

function filterDictionaryValuesByParent() {
   var parentKey = $("select[name='parentList'] option:selected").val();
   $("td.active").show();
   $("td.activeChecked").show();
   $("td.active input").show();
   $("td.activeChecked input").show();

   if(!isEmpty(parentKey)) {
      $("td.active[parentKey!='" + parentKey + "']").hide();
      $("td.activeChecked[parentKey!='" + parentKey + "']").hide();
      $("td.active[parentKey!='" + parentKey + "'] input").hide();
      $("td.activeChecked[parentKey!='" + parentKey + "'] input").hide();
   }
}

function selectAllVisibleElements(formName, flag, nameElement) {
   var elements = document.forms[formName].elements[nameElement + "Pk"];

   if(elements != null) {
      if(isNaN(elements.length)) {
         if(elements.style.display != "none") {
            selectElement(elements.id, flag, formName, nameElement);
         }
      } else {
         for(var i = 0; i < elements.length; i++) {
            if(elements[i].style.display != "none") {
               selectElement(elements[i].id, flag, formName, nameElement);
            }
         }
      }
   }
}

function initTextInput(inputId) {
   if($(inputId).hasClass("textInputInit")) {
      $(inputId).val("");
      $(inputId).removeClass("textInputInit");
   }
}

function disableElement(id) {
   $("#" + esc(id)).attr("disabled", "disabled");
}

function enableElement(id, enable) {
   if (enable === false) {
      disableElement(id);
   } else {
      $("#" + esc(id)).removeAttr("disabled");
   }
}

function showWindow(formName) {
   var ovrl = window.document.getElementById(formName + "_ovrl");
   var ww = window.document.getElementById(formName + "_ww");

   if (ovrl != null && ww != null) {
      document.body.style.overflow = "auto";
      ovrl.style.display = "";
      ww.style.display = "";
   }
}

function hideWindow(formName) {
   var ovrl = window.document.getElementById(formName + "_ovrl");
   var ww = window.document.getElementById(formName + "_ww");

   if (ovrl != null && ww != null) {
      document.body.style.overflow = "auto";
      ovrl.style.display = ww.style.display = "none";
   }
}

// возвращает cookie с именем name, если есть, если нет, то undefined
function getCookie(name) {
  var matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

// устанавливает cookie c именем name и значением value
// options - объект с свойствами cookie (expires, path, domain, secure)
function setCookie(name, value, options) {
  options = options || {};

  var expires = options.expires;

  if (typeof expires == "number" && expires) {
    var d = new Date();
    d.setTime(d.getTime() + expires*1000);
    expires = options.expires = d;
  }
  if (expires && expires.toUTCString) {
   options.expires = expires.toUTCString();
  }

  value = encodeURIComponent(value);

  var updatedCookie = name + "=" + value;

  for(var propName in options) {
    updatedCookie += "; " + propName;
    var propValue = options[propName];
    if (propValue !== true) {
      updatedCookie += "=" + propValue;
     }
  }

  document.cookie = updatedCookie;
}

// удаляет cookie с именем name
function deleteCookie(name) {
  setCookie(name, "", { expires: -1 });
}

// экранирует селектор для jQuery
function esc(str) {
   return str.replace(/\./g,'\\.');
}

function contains(element, array) {
   return $.inArray(element, array) > -1;
}

function onEnter(e, handler) {
   var key = navigator.appName == 'Netscape' ? e.which : e.keyCode;
   if(key == 13) {
      handler();
   }
}

function handleDateIntervalRadio(id, value) {
   var singleDate = $("span[id='" + id + ".singleDate']");
   var intervalDate = $("span[id='" + id + ".intervalDate']");
   var textDate = $("span[id='" + id + ".text']");

   singleDate.toggle(value == 1);
   disableArea(singleDate, value != 1);

   intervalDate.toggle(value == 2);
   disableArea(intervalDate, value != 2);

   textDate.toggle(value == 3);
   disableArea(textDate, value != 3);
}

function disableArea(el, disable) {
   el.find("*").each(function() {
      if (!disable) {
         $(this).removeAttr("disabled");
      } else {
         $(this).attr("disabled", "disabled");
      }
   });
}

function fillSortForm(sortByFirst, sortByFirstOrder, sortBySecond, sortBySecondOrder, sortByThird, sortByThirdOrder) {
   $("[name='sortByFirst'] option[value='" + sortByFirst + "']").attr("selected", "selected");
   $("[name='sortByFirstOrder'][value='" + sortByFirstOrder + "']").attr("checked", true);
   $("[name='sortBySecond'] option[value='" + sortBySecond + "']").attr("selected", "selected");
   $("[name='sortBySecondOrder'][value='" + sortBySecondOrder + "']").attr("checked", true);
   $("[name='sortByThird'] option[value='" + sortByThird + "']").attr("selected", "selected");
   $("[name='sortByThirdOrder'][value='" + sortByThirdOrder + "']").attr("checked", true);
}

function disablePositive() {
    $(".positive").attr("disabled", "disabled");
}

function enablePositive() {
    $(".positive").removeAttr("disabled");
}

jQuery.fn.disablePositiveOnClick =
function () {
   return this.each(function() {
      // Do nothing, just checking
   });
};

jQuery.fn.loadAllowedProduction =
    function (action, triggerChange, addNull) {
       if (triggerChange === undefined) triggerChange = true;
       return this.each(function() {
          var container = $(this);
          $.get(
              "operatorui?_action=" + action + "",
              function (xml) {
                 var list = container.find('select');
                 // Поддержка ИЕ8
                 var id = list.attr('id');
                 list.attr('id', id);
                 //
                 list.empty();
                 var elements = $(xml).find('element');
                 if (elements.length != 1 || addNull) {
                    var o = new Option(
                       'не указано',
                       null,
                       ('null' == container.data('selected')),
                       ('null' == container.data('selected'))
                    );
                    //list.append(o);
                    //Поддержка ИЕ8
                    o.innerHTML = 'не указано';
                    document.getElementById(id).appendChild(o);
                    //
                 }
                 elements.each(function () {
                    var value = $(this).find('value').text();
                    o = new Option(
                        $(this).find('view').text(),
                        value,
                        (value == container.data('selected')),
                        (value == container.data('selected'))
                    );
                    //list.appendChild(o);
                    // Поддержка ИЕ8
                    o.innerHTML = $(this).find('view').text();
                    document.getElementById(id).appendChild(o);
                    //
                 });
                 list.attr('loading', '');
                 if (elements.length == 1 && triggerChange) {
                    list.change();
                 }
                 list.removeAttr('loading');

                 if (list.attr("onAfterInit") && !list.attr('inited')) {
                    eval(list.attr("onAfterInit"));
                    list.attr('inited', '');
                 }
              },
             'html'
          )
       });
    };

jQuery.fn.ForceNumericOnly =
    function()
    {
       return this.each(function()
       {
          $(this).keydown(function(e)
          {
             if ($.inArray(e.keyCode, [46, 8, 9, 27, 13]) !== -1 ||
                    // Allow: Ctrl+A
                 (e.keyCode == 65 && e.ctrlKey === true) ||
                    // Allow: home, end, left, right
                 (e.keyCode >= 35 && e.keyCode <= 40)) {
                // let it happen, don't do anything
                return;
             }
             // Ensure that it is a number and stop the keypress
             if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
             }
          });
       });
    };


jQuery.fn.ForceDecimalOnly =
    function(decimal)
    {
       return this.each(function()
       {
          if (decimal == null) decimal = 3;
          $(this).keydown(function(e)
          {
             if (!isNaN(parseFloat(+$(this).val().replace(',', '.')))) {
                presentValue=$(this).val();
             }
          });
          $(this).keyup(function(e)
          {
             if (isNaN(parseFloat(+$(this).val().replace(',', '.')))) {
                $(this).val(presentValue);
             } else {
                var val = $(this).val().replace(',', '.');
                if (val != "" && (
                        parseFloat(+val) != parseFloat(+val).toFixed(decimal)
                        || (val.indexOf('.') != -1 && val.length - val.indexOf('.') > decimal + 1)
                    )) {
                   if ($(this).parent().find(".errorMessage").length > 0) {
                      $(this).parent().find(".errorMessage").html("вы можете указать не более трех символов в дробной части");
                   } else {
                      $(this).parent().append("<br/><span class = 'errorMessage'>вы можете указать не более трех символов в дробной части</span>");
                   }
                   var reserve = 5;
                   var str = parseFloat(+val).toFixed(decimal + reserve).toString();
                   if (str.indexOf('e') == -1) {
                      str = str.substring(0, str.length - reserve);

                   } else {
                      str = val.substring(0, val.indexOf('.') + decimal + 1);
                   }
                   $(this).val(str);
                } else {
                   if ($(this).parent().find(".errorMessage").length > 0) {
                      $(this).parent().find(".errorMessage").text("");
                   }
                }
             }

             var required = $(this).parent().parent().find("td.label span.errorMessage").length>0;
             if (required && $(this).val() == "") {
                if ($(this).parent().find(".errorMessage").length > 0) {
                   $(this).parent().find(".errorMessage").text("поле обязательно для заполнения");
                } else {
                   $(this).parent().append("<br/><span class = 'errorMessage'>поле обязательно для заполнения</span>");
                }
             }
          });
       });
    };

jQuery.fn.ForceLatin =
    function(length)
    {
       if (!length){
          length = 250;
       }
       return this.each(function(){
          $(this).bind('input', function(){
             $(this).val($(this).val().replace(/[^a-zA-Z0-9./-]/g, '').substr(0, length));
          })
       });
    };

//TODO перенести в onReady.js после мержа с единицами измерения
$(document).ready(function(){
   var elem = $('[validate-list-size]');
   elem.parent().append('<span class = "help">Можно указать несколько номеров через запятую, но не более десяти.</span>');
   elem.keydown(function(){
      tmp = $(this).val();
   });
   elem.keyup(function(){
      var list = $(this).val().split(",");
      var message = $(this).parent().children('.errorMessage');
      if (list.length > 10){
         $(this).val(tmp);
         if (message.length == 0){
            $(this).after('<span class = "errorMessage"><br />Длина списка не должна превышать десяти элементов</span>');
         } else {
            message.show();
         }
      } else {
         message.hide();
      }
   });

   $('[validate]').submit(function(){
      if (!$(this).validateForm()){
         event.preventDefault();
         $(this).find("button[type='submit']").prop('disabled',false);
      }
   });

   $('form:has(#listContent), form:has(.emplist)').css({'display': 'inline-block', 'min-width': '100%'})
});

function removeEnterpriseAjax(pk, onSuccess, action, form){
   $.post(
       "operatorui?_action=removeEnterpriseAjax&enterprisePk=" + pk,
       function(){
          onSuccess("operatorui?_action=" + action + "", form, init());
       }
   );
}

function showBrowserWarning(){
   if (document.all && !document.addEventListener) {
      var message = "" +
         "<div class='systemMessage'>" +
         "Используемый веб-браузер не поддерживается, некоторые страницы могут отображаться некорректно. Рекомендуется установить более новую версию веб-браузера." +
         "</div>";
      $('#wrapper').after(message);
   }
}

/**
 *  Устанавливает в поле значение текущей даты с учетом геозоны
 *  Требует подключенного data-time/moment.min.js
 */
function setToday(elem){
   elem = $('#' + elem);
   if (elem.prop('disabled')) return;
   void(elem.val(moment().format("DD.MM.YYYY")));
}

function goToAnchor(anchor){
   if (isEmpty(anchor)) return false;

   var elem = $('#' + anchor);
   if (elem.length > 0) {
      $('html, body').animate({
         scrollTop: elem.offset().top
      }, 0);
   }
}

function setScrollToNav() {
   $('body').data("scrollToNav", true);
}

function scrollToNav() {
   var body = $('body');
   if (body.data('scrollToNav')) {
      body.animate({scrollTop: $('#pageNavBlock').offset().top}, 0);
      body.removeData('scrollToNav');
   }
}

function hideOrigin() {
   $("#origin select").val("null");
   $("#origin").hide();
   $("#text-origin").show();
}

function hideOriginText() {
   $("#origin").show();
   $("#text-origin").hide();
   $("#text-origin input").val("");
}

function initChosens(noResultsTesxt) {
   $('.my-chosen-select2').chosen({disable_search_threshold: 10, no_results_text: noResultsTesxt});
   $('.my-chosen-with-search').chosen({
      no_results_text: noResultsTesxt,
      search_contains: true
   });
}

function isValidDate(val) {
   if (!val) return false;

   var val_r = ('' + val).split(".");
   var year = parseInt(val_r[2]);
   var month = parseInt(val_r[1]);
   var day = parseInt(val_r[0]);

   if (isNaN(year) || isNaN(month) || isNaN(day)) return false;

   var curDate = new Date(year, --month, day);
   return (
      curDate.getFullYear() == year
      && curDate.getMonth() == month
      && curDate.getDate() == day
   );
}

function toggleEnterpriseActivityRow() {
   if ($("input:radio[name='enterpriseType'][value='3']").is(":checked")) {
      $("#activityRow").hide();
   } else {
      $("#activityRow").show();
   }

   $("input:radio[name='enterpriseType']").click(function () {
      if ($(this).val() === "3") {
         $("#activityRow").hide();
      } else {
         $("#activityRow").show();
      }
   })
}

function saveEnterpriseWithIgnoreSimilar() {
    $("#ignoreSimilar").val("true");
    if ($("form.main-form").length === 0) {
        $("form").submit();
    } else {
        $("form.main-form").submit();
    }
 }



(function ( $ ) {

   var defaults = {
      integer: 15,
      fractional: 6
   };

   $.fn.formattedDecimal =
      function(options) {
         return this.each(function() {

            var $this = $(this);

            var settings = $.extend(defaults, options);
            settings = $.extend(settings, $this.data());

            var errorContainer = $this.parent().find('.errorMessage');
            if (errorContainer.length === 0) {
               errorContainer = $('<span>', {'class': 'errorMessage'});
               $this.parent().append('<br/>');
               $this.parent().append(errorContainer);
            }

            var val = $this.val();

            $this.keydown(function(e)
            {
               var regexp = new RegExp('^(\\d{1,' + settings.integer + '})([,\\.]\\d{0,' + settings.fractional + '})?$');
               if (regexp.test($this.val())) {
                  val = $this.val();
               }
            });

            $this.keyup(function(e)
            {
               errorContainer.text('');
               var currentVal = $this.val();
               if (currentVal === '') return false;

               if (isNaN(currentVal.replace(',', '.'))) {
                  $this.val(val);
               } else {
                  var newVal = currentVal.replace(',', '.').split('.');

                  if (newVal[0].length > settings.integer) {
                     errorContainer.text('В целой части числа может быть указано не более ' + settings.integer + ' символов');
                     setTimeout(function(){$this.val(val)}, 120);
                  }

                  if (newVal[1] && newVal[1].length > settings.fractional) {
                     errorContainer.text('В дробной части числа может быть указано не более ' + settings.fractional + ' символов');
                     setTimeout(function(){$this.val(val)}, 120);
                  }
               }
            });
         });
      };

}( jQuery ));

function waybillAbsentCheck(value) {
   if (value) {
      $('.waybill-info').prop('disabled', value).addClass('disabled');
      $('.waybill-info').closest("tr").hide();
   } else {
      $('.waybill-info').prop('disabled', value).removeClass('disabled');
      $('.waybill-info').closest("tr").show();
   }

}

$.fn.serializeForm = function()
{
   var o = {};
   var a = this.serializeArray();
   $.each(a, function() {
      if (o[this.name] !== undefined) {
         if (!o[this.name].push) {
            o[this.name] = [o[this.name]];
         }
         o[this.name].push(this.value || '');
      } else {
         o[this.name] = this.value || '';
      }
   });
   return o;
};

$.fn.deserializeForm = function (data) {
    if (data === undefined) return;
    var selectLists = [];
    $.each(this, function () {
        if (data[this.name] !== undefined) {
            switch (this.type) {
               case 'checkbox':
               case 'radio':
                  if (Array.isArray(data[this.name])) {
                     var elem = this;
                     $.each(data[this.name], function() {
                        if (elem.value == this) {
                           elem.checked = true
                        }
                     })
                  } else {
                     if (this.value == data[this.name]) {
                        this.checked = true
                     }
                  }
                  break;
               case 'select-one':
                  if (this.attributes.loadUrl) {
                     this.setAttribute('selected', data[this.name]);
                     if (this.attributes.initOnLoad) {
                        selectLists.push(this);
                     }
                  } else {
                     $(this).val(data[this.name]).change();
                  }
                  break;
               default:
                  $(this).val(data[this.name]);
            }
        }
    });
    // select_list_ajax_load.js required (it should be already included if initOnLoad selects exist)
    $.each(selectLists, function() {
       doBeforeLoad(this);
       updateSelectList(this, true);
    })
};

function toggleAnimalTypeFields(isAnimalType, addIgnoreAttribute) {
    if (isAnimalType) {
        changeDateForPerishableProduction(false);
    } else {
        changeDateForPerishableProduction($("input[type='radio'][name='perishable']:checked").val() === "true");
    }

    var showClass = isAnimalType ? "showAnimalType" : "hideAnimalType";
    var hideClass = isAnimalType ? "hideAnimalType" : "showAnimalType";

    $("." + showClass + ":not([ignoreToggle])").each(function(){
        $(this).show();
        $(this).removeAttr("disabled");
    });
    $("." + hideClass + ":not([ignoreToggle])").each(function(){
        $(this).hide();
        $(this).attr("disabled", "disabled");
    });

    if (addIgnoreAttribute) {
      addIgnoreToggleAttribute(".hideAnimalType,.showAnimalType", $("[name='perishable']").closest("tr"));
    }
}

function addIgnoreToggleAttribute(selector, parent) {
   if (parent) {
      parent.attr("ignoreToggle", "");
      parent.find(selector).attr("ignoreToggle", "");
   } else {
      $(selector).attr("ignoreToggle", "");
   }
}

function removeIgnoreToggleAttribute(selector, parent) {
    if (parent) {
        parent.removeAttr("ignoreToggle", "");
        parent.find(selector).removeAttr("ignoreToggle", "");
    } else {
        $(selector).removeAttr("ignoreToggle", "");
    }
}

function checkButtonBeforeSubmit(btn) {
    if (!$(btn).data('clicked')) {
        $(btn).data('clicked', true);
        setTimeout(function() {
            $(btn).data('clicked', false)
        }, 3000);
        return true;
    }
    return false;
}

function showModalConfirm(blockId) {
    $( '#' + blockId).dialog( 'open' );
    return false;
}

function checkDateForNewYear() {
   var now = new Date();
   if (now.getMonth() === 11) { // декабрь
      return now.getDate() >= 15;
   }
   if (now.getMonth() === 0) { // январь
      return now.getDate() <= 15;
   }
   return false;
}

function showNewYear(img) {
   if (!checkDateForNewYear()) {
      return
   }
   var src = [
      "/vetcontrol-docs/common/img/snowman.png",
      "/vetcontrol-docs/common/img/christmastree.png",
      "/vetcontrol-docs/common/img/snowman2.png",
      "/vetcontrol-docs/common/img/dedmoroz.png",
      "/vetcontrol-docs/common/img/snegurka.png",
      "/vetcontrol-docs/common/img/ball.png"
   ];

   $(img).attr("src", src[Math.floor(Math.random() * src.length)]).show();
}

function submitWithReason(options) {

   var defaults = {
      length: 250,
      field: 'revokingReason',
      formName: false,
      action: false,
      reasonFor: 'аннулирования'
   };

   var settings = $.extend({}, defaults, options);

   if (!settings.formName || !settings.action) {
      console.error('Not enough parameters passed. Form name and action required');
      return false;
   }

   var input = $('#' + settings.field);
   var error = input.siblings('#revoking-error');
   if (error.length === 0) {
      error = $('<span>', {
         id: 'revoking-error',
         'class': 'errorMessage'
      });
      input.after(error);
   }

   error.hide();

   var emptyError = 'не указана причина ' + settings.reasonFor;
   var lengthError = 'причина ' + settings.reasonFor + ' превышает максимальную длину (' + settings.length + ')';

   var reason = input.val();

   if (!reason || trim(reason).length == 0) {
      error.text(emptyError).css('display', 'block');
      return false;
   } else if (reason.length > settings.length) {
      error.text(lengthError).css('display', 'block');
      return false;
   }

   doAction(settings.formName, settings.action);
}

function showNavigation() {
   var header = $("#listTitle");
   if (header.is(":hidden")) {
      $(".preview-toggleable").toggle();
   }
   var navbar = $('.navbar');
   if (navbar.is(":hidden")) {
      navbar.show();
   }
}

function fixSelect2InDialogInteraction() {
    if ($.ui && $.ui.dialog && $.ui.dialog.prototype._allowInteraction) {
        var ui_dialog_interaction = $.ui.dialog.prototype._allowInteraction;
        $.ui.dialog.prototype._allowInteraction = function(e) {
            if ($(e.target).closest('.select2-dropdown').length) return true;
            return ui_dialog_interaction.apply(this, arguments);
        };
    }
}

function isValidGtin(gtin) {
   if (isEmpty(gtin)) return true;

   var pattern = new RegExp("\\d{8}|\\d{12,14}");
   if (!pattern.test(gtin)) return false;

   var controlDigit = parseInt(gtin.charAt(gtin.length - 1));
   var reversed = gtin.substring(0, gtin.length - 1).split("").reverse();

   var sum = 0;
   for (var i = 0; i < reversed.length; i++) {
      var n = parseInt(reversed[i]);
      if (i % 2 === 0) {
         sum += n * 3;
      } else {
         sum += n;
      }
   }

   return controlDigit === (10 - (sum % 10)) % 10;
}

$.fn.setMaxLength = function(options)
{
   var defaults = {
      length: 255
   };
   var settings = $.extend(defaults, options, true);

   return this.each(function() {
      $(this).keypress(function(e) {
         var selected;
         if (e.target.selectionStart !== undefined) {
            selected = !(e.target.selectionStart === e.target.selectionEnd);
         } else if(document.selection) {
            e.target.focus();
            var range = document.selection.createRange();
            selected = (range.text.length > 0);
         }

         if(e.target.value.length >= settings.length && !selected) {
            return false;
         }
      });
      $(this).on('input', function(e){
         e.target.value = e.target.value.substr(0, settings.length);
      });
   });
};

function splitRange(s) {
   var ar = s.indexOf('\\-') < 0 ? s.split('-') : false;
   if (!ar || ar.length !== 2) return [s];
   var start = parseInt(ar[0]);
   var end = parseInt(ar[1]);
   if (!start || !end || start >= end) return [s];
   var result = [];
   for (var i=start; i<=end; i++) {
      result.push(String(i));
   }
   return result;
}

function bindRangeCheckOnSubmit(formSelector, fieldSelector) {
   $(formSelector).on('submit', function() {
      var success = true;
      $(fieldSelector).each(function() {
         var number = $(this).val();
         if (number !== '') {
            var parts = number.split(',');
            var unique = [];
            for (var i=0; i<parts.length; i++) {
               var tmp = splitRange(parts[i]);
               for (var j=0; j<tmp.length; j++) {
                  if (unique.indexOf(tmp[j]) < 0) {
                     unique.push(tmp[j]);
                  }
               }
            }
            if (unique.length > 10) {
               $(this).siblings('.errorMessage').show();
               success = false;
            }
         }
      });
      return success;
   });
}

function addMessageBlock(id, message, type) {
   var container = $('#main-message-container');
   if (container.length === 0) return;

   var style, icon;
   switch (type) {
      case 1:
         style = "info";
         icon = "info-circle";
         break;
      case 2:
         style = "warning";
         icon = "exclamation-circle";
         break;
      case 3:
         style = "success";
         icon = "check-circle";
         break;
      case 4:
         style = "danger";
         icon = "times-circle";
         break;
   }

   var div = $('<div>', {
      "id": id,
      "class": "message message-" + style
   }).append($("<i>", {
      "class": "message-icon fa fa-" + icon + " fa-lg"
   })).append(message);

   container.append(div);
}

function bindCollapsible() {
   $('.collapsible-header').click(function(){
      toggleCollapsible(this);
   });
}

function toggleCollapsible(elem) {
   var label;
   if ($(elem).data("open")) {
      $(elem).data("open", false);
      label = $(elem).data("label-show");
      if (label) $(elem).text(label);
   } else {
      $(elem).data("open", true);
      label = $(elem).data("label-hide");
      if (label) $(elem).text(label);
   }
   $(elem).parents('.collapsible').find('.collapsible-item').slideToggle();
}

function copySelect2Option(fromSelect, toSelect) {
   toSelect.val(null).trigger('change');

   var data = fromSelect.select2("data");
   if (data && data[0]) {
      var option = new Option(data[0].text, data[0].id, false, true);
      toSelect.append(option).trigger('change');
   }
}

function createEvent(name) {
   var event;
   if (typeof(Event) === 'function') {
      event = new Event(name);
   } else {
      event = document.createEvent('Event');
      event.initEvent(name, false, false);
   }
   return event;
}

function checkTrafficWithNotification(submitFunc) {
   var fromReference = $('[name="enterpriseFromReference"]:checked').val();
   if (fromReference === undefined) {
      fromReference = $('#old_enterpriseFromReference').val();
   }
   var ent = $('[name="enterprise"]').map(function() { return this.value}).get();
   var old_ent = $('[name="old_enterprise"]').map(function() { return this.value}).get();
   var producerChanged =
      fromReference != $('#old_enterpriseFromReference').val()
      || fromReference && ($(old_ent).not(ent).get().length > 0 || $(ent).not(old_ent).get().length > 0)
      || !fromReference && $('#producer').val() != $('#old_producer').val();

   var waybillChanged = ($("#oldWaybillDate").val() && $("#oldWaybillDate").val() != $("#waybillDate").val())
       || ($("#oldWaybill").val() && $("#oldWaybill").val() != $("#waybill").val())
   ;

   var piah = $("#piah").val() === "true";
   var vetDocumentChanged = !piah && ($("#oldVetDocumentDate").val() != $("#vetDocumentDate").val()
         || $("#oldVetDocumentNumber").val() != $("#vetDocumentNumber").val());

   var piahChanged = piah && $("#pesticides-registration-number-old").val() != $("#pesticides-registration-number").val();

   if (producerChanged
      || waybillChanged
      || vetDocumentChanged
      || piahChanged) {
      $("#greenPassNotificationPk").val('');
   }

   submitFunc();
}

function changeWarehouseHandler(e) {
   var vetCertificat = [];
   $("input[name='storagePoint']:checked").each(function(){
      var warehouseID = $(this).val();
      var lic = $('#vc' + warehouseID).val();
      if (vetCertificat.indexOf(lic) === -1) {
         vetCertificat.push(lic);
      }
   });
   $('#vetCertificat').val(vetCertificat.join());
}

function printSample(action, choose, pk, guid, cancelFunc, printAct, printProtocol) {
   if (choose) {
      var dialog = $('#print-dialog');
      dialog.dialog('open');
      dialog.find("#print-dialog-sample-pk").val(pk);
      dialog.find("#print-dialog-sample-guid").val(guid);
   } else {
      openDecisionPrintWindowAjax(
         'operatorui?_action=' + action
         + '&pk=' + pk + '&guid=' + guid
         + '&act=' + printAct
         + '&protocol=' + printProtocol,
         'printWindow', cancelFunc);
   }
}

function addErrorMessage(message, id) {
   $(`#${id}`).remove();
   $('#main-message-container').append($(`<div id="${id}" class='message message-danger'><i class="message-icon fa fa-times-circle fa-lg"></i>${message}</div>`));
   $('body, html').animate({ scrollTop: 0}, 300)
}

function closeMessage(messageId, messagePk) {
   $("#" + messageId).remove();

   if (!isEmpty(messagePk)) {
      $.post('operatorui?_action=closeMessage', {
         pk: messagePk
      })
   }
}

function undoCloseMessage(messageId, messagePk) {
   $.post('operatorui?_action=closeMessage&undo=true', {
      pk: messagePk,
   }, function(response) {
      if (response.success) {
         var messageItem = $("#" + messageId);
         messageItem.removeClass("message-closable");
         messageItem.find(".message-icon-close").remove();
      }
   });
}