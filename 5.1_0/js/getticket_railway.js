


$(()=>{
    if($($("ol[class=breadcrumb]").find("li")[2]).text()=="個人訂票"||$("#content").find("div")[0].innerHTML.includes("依車次單程訂票")){
    
    chrome.storage.local.get([
        "railway_status",
        "railway_country",
        "railway_pid",
        "railway_startStation",
        "railway_endStation",
        "railway_normal",
        "railway_wheelchair",
        "railway_child",
        "railway_num",
        "railway_num2",
        "railway_num3",
        "railway_date",
    ],(result)=> {
        let icediv = document.createElement("div");
        icediv.setAttribute("id", "icecubes_ticket");
        let iceimg =document.createElement("img");
        
        if(result.railway_status=="open"){
            iceimg.setAttribute("class","img_icecubes start");
        }else{
            iceimg.setAttribute("class","img_icecubes closed");
        }
        icediv.onclick=()=>{
            if(iceimg.getAttribute("class").includes("closed")){
                chrome.storage.local.set({
                    "railway_status":"open",
                  },()=>{
                    location.reload();
                  });
            }else{
                chrome.storage.local.set({
                    "railway_status":"close",
                  },()=>{
                    location.reload();
                  });
            }
          
        }
        icediv.append(iceimg);
        $("body").append(icediv);

        if(result.railway_status=="open"){
            if($($("ol[class=breadcrumb]").find("li")[2]).text()=="個人訂票"){
                if(result.railway_country=="PERSON_ID"){
                    $("#personlType").click();
                }else if(result.railway_country=="PASSPORT_NO"){
                    $("#passport").click();
                }
                
                //身份證字號
                $("#pid").val(result.railway_pid);
                //起站
                $("#startStation").val(result.railway_startStation);
                $("#startStation1").val(result.railway_startStation);
                
                //出站
                $("#endStation").val(result.railway_endStation);
                $("#endStation1").val(result.railway_endStation);
    
        
                //普通票
                $("#normalQty").val(result.railway_normal);
                $("#normalQty1").val(result.railway_normal);
              
                $("#normalQty").change()
                $("#normalQty1").change()
    
        
                //輪椅需求
                if(result.railway_wheelchair>0){
                    $("#wheelChair").click();
                    $("#wheelChair1").click();
                    $('#closeDialog').click();
                    $("#wheelChairQty").val(result.railway_wheelchair);
                    $("#wheelChairQty1").val(result.railway_wheelchair);
                    $("#wheelChairQty").change();
                    $("#wheelChairQty1").change();
                    
                }
                //親子座椅
                if(result.railway_child>0){
                    $("#parentChild").click();
                    $("#parentChild1").click();
                    $('#closeDialog').click();
                    $("#parentChildQty").val(result.railway_child);
                    $("#parentChildQty1").val(result.railway_child);
                    $("#parentChildQty").change();
                    $("#parentChildQty1").change();
                }
        
                //訂票日
                $("#rideDate1").val(result.railway_date);
                $("#rideDate1").change();
        
                //車次
                $("#trainNoList1").val(result.railway_num);
                $("#trainNoList2").val(result.railway_num2);
                $("#trainNoList3").val(result.railway_num3);
        
                $("div[class=btn-sentgroup]").append('<div id="railway_timeout" style="padding-right: 50px;"></div>');
                $("div[class=btn-sentgroup]").append('<div id="railway_timeout2" style="padding-right: 50px;"></div>');
    
                let railway_go=()=>{
                    $("#queryForm").submit()
                }
    
                let stamptime=new Date(result.railway_date+" 00:00:00");
                stamptime.setTime(stamptime.getTime()-(86400000*28));
                let stamp;
                let startinterval=setInterval(()=> {
                    stamp=new Date(stamptime-(new Date()));
                    $("#railway_timeout").text("自動送出："+(23-new Date().getHours())+":"+(59-new Date().getMinutes())+":"+(59-new Date().getSeconds()));
                    if(
                    new Date().getHours()==0 &&
                    new Date().getMinutes()==0 &&
                    new Date().getSeconds()==0
                    ){
                        clearInterval(startinterval);
                        railway_go();
                    }
                    
                    if(stamp.getTime()>0){
                        $("#railway_timeout2").text("選定時間搶票："+
                    (stamp.getUTCDate()-1)+"天 "+
                    stamp.getUTCHours()+":"+
                    stamp.getUTCMinutes()+":"+
                    stamp.getUTCSeconds());
                    }else{
                        $("#railway_timeout2").text("選定時間 已過");
                    }
                },500);
    
            }else if($("#content").find("div")[0].innerHTML.includes("依車次單程訂票")){
                if(result.railway_country=="PERSON_ID"){
                    $("#personlType").click();
                }else if(result.railway_country=="PASSPORT_NO"){
                    $("#passport").click();
                }
                
                //身份證字號
                $("#pid").val(result.railway_pid);
                //起站
                $("select[name='ticketOrderParamList[0].startStation']").val(result.railway_startStation.substring(0,4));
                
                //出站
                $("select[name='ticketOrderParamList[0].endStation']").val(result.railway_endStation.substring(0,4));
    
        
                //普通票
                $("select[name='ticketOrderParamList[0].normalQty']").val(result.railway_normal);
                $("select[name='ticketOrderParamList[0].normalQty']").change();
        
                //輪椅需求
                if(result.railway_wheelchair>0){
                    $("#isWheelAgree0").click();
                    $("#wheel-notice-modal-simple").hide()
                    $("#_wheelChairQty_0").val(result.railway_wheelchair);
                    $("#_wheelChairQty_0").change();
                }
                //親子座椅
                if(result.railway_child>0){
                    $("#isParentChildAgree0").click();
                    $("#child-seat-first-modal-simple").hide();
                    $("#_parentChildQty_0").val(result.railway_child);
                    $("#_parentChildQty_0").change();

                }
        
                //訂票日
                $("#rideDate0").val(result.railway_date);
                $("#rideDate0").change();
        
                //車次
                $("input[name='ticketOrderParamList[0].trainNoList[0]']").val(result.railway_num);
                $("input[name='ticketOrderParamList[0].trainNoList[1]']").val(result.railway_num2);
                $("input[name='ticketOrderParamList[0].trainNoList[2]']").val(result.railway_num3);
        
                $("div[class='booking-footer col-3 col-md-11 col-mx-auto']").append('<div id="railway_timeout" style="padding-right: 50px;"></div>');
                $("div[class='booking-footer col-3 col-md-11 col-mx-auto']").append('<div id="railway_timeout2" style="padding-right: 50px;"></div>');
    
                if(
                    new Date().getHours()==0 &&
                    new Date().getMinutes()==0 
                    ){
                    $("#submitBtn").focus();
                }
                let stamptime=new Date(result.railway_date+" 00:00:00");
                stamptime.setTime(stamptime.getTime()-(86400000*28));
                let stamp;
                let startinterval=setInterval(()=> {
                    stamp=new Date(stamptime-(new Date()));
                    $("#railway_timeout").text("請手動驗證並送出："+(23-new Date().getHours())+":"+(59-new Date().getMinutes())+":"+(59-new Date().getSeconds()));
                    if(
                    new Date().getHours()==0 &&
                    new Date().getMinutes()==0 &&
                    new Date().getSeconds()==0
                    ){
                        clearInterval(startinterval);
                        window.location.reload();

                    }
                    
                    if(stamp.getTime()>0){
                        $("#railway_timeout2").text("選定時間搶票："+
                    (stamp.getUTCDate()-1)+"天 "+
                    stamp.getUTCHours()+":"+
                    stamp.getUTCMinutes()+":"+
                    stamp.getUTCSeconds());
                    }else{
                        $("#railway_timeout2").text("選定時間 已過");
                    }
                },500);
    
            }

            
        }
    });
    
       
}
  });
  