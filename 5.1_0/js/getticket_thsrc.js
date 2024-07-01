
  //是否快速確認購票
  var buyticket=false;
  //是否看票
  var lookticket=false;
  //是否跳出提醒  
  var notifycheck=false;
  //是否需要自動確認車次進行搶票(若註解 將提醒不進行搶票)
  var checkgetticket=false;
  //期望 幾點幾分 以後的票(若註解 將以目前車票最晚時間)
  var checkstart='23:59';
  var checklast='23:59';
  
window.onload = function () {
    chrome.storage.local.get([
        "thsrc_buyticket",
        "thsrc_userid",
        "thsrc_phone",
        "thsrc_email",
        "thsrc_lookticket",
        "thsrc_checkgetticket",
        "thsrc_notifycheck",
        "thsrc_start",
        "thsrc_end"
      ],(result)=> {
        buyticket=result.thsrc_buyticket;
        $('#idNumber').val(result.thsrc_userid);
        $('#mobilePhone').val(result.thsrc_phone);
        $('#email').val(result.thsrc_email);
        lookticket=result.thsrc_lookticket;
        notifycheck=result.thsrc_notifycheck;
        checkgetticket=result.thsrc_checkgetticket;
        checkstart=result.thsrc_start;
        checklast=result.thsrc_end;
        thsrc_getticket_start();

        
      });

}

let thsrc_getticket_start=()=>{




    if($("#BookingS3FormSP").val()!=null){
        if(buyticket){
            
            $("input[name=agree]").prop("checked", true);
            $('#isSubmit').click();
        }
    
    }else if($("#BookingS2Form_TrainQueryDataViewPanel").val()!=null){
        //code start---------

        let icediv = document.createElement("div");
        icediv.setAttribute("id", "icecubes_ticket");
        let iceimg =document.createElement("img");
        iceimg.setAttribute("src","");
        icediv.onclick=()=>{
            if(iceimg.getAttribute("class").includes("closed")){
                chrome.storage.local.set({
                    "thsrc_lookticket":true,
                  },()=>{
                    location.reload();
                  });
            }else{
                chrome.storage.local.set({
                    "thsrc_lookticket":false,
                  },()=>{
                    location.reload();
                  });
            }
          
        }
        if(lookticket){
            iceimg.setAttribute("class","img_icecubes start");
        }else{
            iceimg.setAttribute("class","img_icecubes closed");
        }
        icediv.append(iceimg);
        $("body").append(icediv);

        if(lookticket){
           

            if(notifycheck){
                if (Notification.permission === 'default' || Notification.permission === 'undefined') {
                    Notification.requestPermission(function(permission) {
                        if (permission === 'granted') {
                            var notification = new Notification('冰塊說!', {body:'開啟通知'});
                        }else{
                            //alert("冰塊只能用彈出視窗提醒你，無法直接通知你");
                        }
                    });
                    }else{
                        var notification = new Notification('冰塊說!', {body:'執行中'});
                    }    
            }


            let checkandgetticket=()=>{
                setTimeout(()=>{

                    $('.uk-flex.uk-flex-middle.result-item').each((index,item) => {
                        if(checkstart<$($(item).find($('.departure-time')).find($('span'))[0]).text() && checklast>$($(item).find($('.departure-time')).find($('span'))[0]).text()){
                                            
                            if(checkgetticket){
                                $(item).find('.uk-radio').click();
                                $('input[name=SubmitButton]').click();
                                $("#BookingS2Form").submit();
                                return false;
                            }
                            if(notifycheck){
                                var notification = new Notification('冰塊說!', {
                                    body: '有最新更晚的車票 快點～～～回瀏覽器',
                                    requireInteraction: true
                                });
                                return false; // breaks
                                
                            }
                            
                        }
                    });
                    return "無票";
                },500);
            }


            let touchbackevent = ()=>{
                let touchback = setInterval(() => {
                    if($('#BookingS2Form_TrainQueryDataViewPanel_PreAndLaterTrainContainer_laterTrainLink').css("visibility")=='hidden'&&$('#BookingS2Form_TrainQueryDataViewPanel_PreAndLaterTrainContainer_preTrainLink').css("visibility")=='hidden'){
                        location.reload();
                    }else{
                        if($('#BookingS2Form_TrainQueryDataViewPanel_PreAndLaterTrainContainer_preTrainLink').css("visibility")=='hidden'){
                            $('#BookingS2Form_TrainQueryDataViewPanel_PreAndLaterTrainContainer_laterTrainLink').click();
                        }else{
                            $('#BookingS2Form_TrainQueryDataViewPanel_PreAndLaterTrainContainer_preTrainLink').click();
                            checkandgetticket();
                            clearInterval(touchback);
                            gorun();
                        }  
                    }
                }, 1000);
            }


            let touchnextevent = ()=>{
                let touchnext = setInterval(() => {
                    if($('#BookingS2Form_TrainQueryDataViewPanel_PreAndLaterTrainContainer_laterTrainLink').css("visibility")=='hidden'&&$('#BookingS2Form_TrainQueryDataViewPanel_PreAndLaterTrainContainer_preTrainLink').css("visibility")=='hidden'){
                        location.reload();
                    }else{
                        if($('#BookingS2Form_TrainQueryDataViewPanel_PreAndLaterTrainContainer_laterTrainLink').css("visibility")=='hidden'){
                            $('#BookingS2Form_TrainQueryDataViewPanel_PreAndLaterTrainContainer_preTrainLink').click();
                        }else{
                            $('#BookingS2Form_TrainQueryDataViewPanel_PreAndLaterTrainContainer_laterTrainLink').click();
                            checkandgetticket();
                            clearInterval(touchnext);
                            gorun();
                        }  
                    }
                }, 1000);
            }
            let gorun =()=>{
                let tryget=setInterval(function() {
                    if($($($('.uk-flex.uk-flex-middle.result-item')[$('.uk-flex.uk-flex-middle.result-item').length-1]).find($('.departure-time')).find($('span'))[0]).text()<checklast && $($($('.uk-flex.uk-flex-middle.result-item')[0]).find($('.departure-time')).find($('span'))[0]).text()>checkstart){
                        checkandgetticket();
                    }
                    else if($($($('.uk-flex.uk-flex-middle.result-item')[0]).find($('.departure-time')).find($('span'))[0]).text()>checklast){
                        clearInterval(tryget);
                        touchbackevent();
            
                    }else if($($($('.uk-flex.uk-flex-middle.result-item')[$('.uk-flex.uk-flex-middle.result-item').length-1]).find($('.departure-time')).find($('span'))[0]).text()<checkstart){
                        clearInterval(tryget);
                        touchnextevent();
                    }else{
                        clearInterval(tryget);
                        touchbackevent();
                    }
            
                },5000);
            
            }
            checkandgetticket();
            gorun();
            
        }

    }

  }