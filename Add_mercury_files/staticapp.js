function validateFileMaxSize(message, nginxMessage, maxsize) {
   if (maxsize == 0 || maxsize === undefined) {
      maxsize = 5;
   }
   var maxsize1MB = 1024*1024;
   maxsize = maxsize * maxsize1MB;
   var nginxMaxsize = 9.5 * maxsize1MB;
   var currentSize = 0;
   var valid = true;
   $("input[type='file']").each(function() {
    $(this).closest(".form-group").removeClass("has-error");
    $(this).closest(".form-group").find(".help-block").remove();
    if ($(this).val() != "") {
       var size = $(this)[0].files[0].size;
       currentSize += size;
       if (maxsize < size) {
          valid = false;
          $(this).closest(".form-group").addClass("has-error");
          $(this).closest(".form-group").append('<div class="help-block col-xs-12 col-sm-reset inline">' + message + '</div>');
       }
    }
   });
   if (valid && currentSize > nginxMaxsize) {
      valid = false;
      $("input[type='file']").each(function() {
         $(this).closest(".form-group").addClass("has-error");
         $(this).closest(".form-group").append('<div class="help-block col-xs-12 col-sm-reset inline">' + nginxMessage + '</div>');
      });
   }
   return valid;
}

$(document).ready(function() {
   $(window).resize(function() {
      var container = $('body > .select2-container--open');
      if (container.length) {
         var id = container.find('ul').get(0).id.replace(/^select2-/, "").replace(/-results$/, "");
         container.css('width', window.getComputedStyle($('select[id="' + id + '"].select2').next('.select2-container:visible').get(0)).width);
      }
   });
   $('select.select2').on('select2:open', function() {
      var id = this.id;
      $('body > .select2-container--open').css('width', window.getComputedStyle($('select[id="' + id + '"].select2').next('.select2-container:visible').get(0)).width);
   });
});

function fixHeader (){
   var $header = $('.page-header');
   var $main = $(".main-container")
   if (!$header[0]) { return;}
   var topValue = 0;
   if (!$("button[data-target='.sidebar']").is(":visible")) {
     topValue = $("#sidebar").height() + 12
   }
   if($(window).scrollTop() >= topValue){
     if (!$header.hasClass("page-header-top") || $header.height() != $main.data("headerHeight")) {
       $header.addClass("page-header-top");
       var padding = 73 + $header.height();
       $main.css({
          'padding-top': padding +'px'
       });
       $main.data("headerHeight", $header.height());
     }
   } else {
     $header.removeClass("page-header-top");
     $main.css({
        'padding-top': '45px'
     });
   }
 }

jQuery(function($) {
    $('.my-chosen-select2').chosen({disable_search_threshold: 10});
    //$("#e1").select2();
    //$("#nosearch").select2({minimumResultsForSearch:10});
    //$("#nosearch2").select2({minimumResultsForSearch:10});
    $('[data-rel=tooltip]').tooltip();
    //$("table").stickyTableHeaders({ fixedOffset: $(".header") });
});