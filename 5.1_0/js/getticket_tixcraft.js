
$(()=>{
    chrome.runtime.sendMessage({
        type: "createmodel"
        });

    
    chrome.storage.local.get([ //取得瀏覽器擴充本地儲存
    "tixcraft_quick",
    "tixcraft_date_on",
    "tixcraft_date",
    "tixcraft_time",
    "tixcraft_time_just",
    "tixcraft_auto",
    "tixcraft_omg_first",
    "tixcraft_omg",
    "tixcraft_omg_num",
    "tixcraft_ocr",
    "tixcraft_anser",
    "tixcraft_autosend",
    "tixcraft_reloadtime",
    "tixcraft_ticketcount",
    "tixcraft_reloadtimecheck",
    "tixcraft_vague",
    "tixcraft_precise"
  ] ,(result)=> {
    let restartticket=()=>{ //按下立即購票
        $("a").each((k,e)=>{
            if($(e).text()=="立即購票"){
                let element=e;
                if ("createEvent" in document) {
                    var evt = document.createEvent("HTMLEvents");
                    evt.initEvent("click", false, true);
                    element.dispatchEvent(evt);
                }
                else{
                    element.fireEvent("click");
                }
            }});
    }
  

    if(window.location.href.indexOf("activity/detail")>0){ //在detail 頁面 推薦 game頁面
        $("a").each((k,e)=>{  //each 每個都會跑  所以會影響效能
        
        if($(e).text()=="立即購票"){
            $(e).parent().parent().append($("<a>").attr("href",$(e).attr("href")).text("冰塊:這網址更快"));
        }});
    }

    let iceconsole=$("<div>").attr("style","width: 200px;");
    let icediv = document.createElement("div");
    icediv.setAttribute("id", "icecubes_ticket");
    let iceimg =document.createElement("img");
    let iceconsole_time=$("<div>");
    let iceconsole_play=$("<div>");
    iceconsole.append(iceconsole_play);
    if(result.tixcraft_date==null||result.tixcraft_date==''){
        iceconsole.append(iceconsole_time.text("未輸入開搶時間，無法自動啟動"));
    }else{
        iceconsole.append(iceconsole_time);

    }


    if(result.tixcraft_quick){
        iceimg.setAttribute("class","img_icecubes start");
    }else{
        iceimg.setAttribute("class","img_icecubes closed");
    }
    icediv.onclick=()=>{
        if(iceimg.getAttribute("class").includes("closed")){
            chrome.storage.local.set({
                "tixcraft_quick":true,
              },()=>{
                location.reload();
              });
        }else{
            chrome.storage.local.set({
                "tixcraft_quick":false,
              },()=>{
                location.reload();
              });
        }
      
    }
    icediv.append(iceimg);
    $(icediv).append(iceconsole);
    $("body").append(icediv);

    if(result.tixcraft_date!=null&&result.tixcraft_date!='' && result.tixcraft_date_on && !result.tixcraft_quick){
        let settime=result.tixcraft_date;
        let datecheck = setInterval(function() {
            let nowtime=new Date();
            nowtime = nowtime.toTimeString().substring(0,8);
            iceconsole_time.text("目前時間："+nowtime+" , 設定前五秒自動啟動");
            if(settime > nowtime){
                if(((parseInt(settime.substring(3,5))==0?60:parseInt(settime.substring(3,5)))-1)==parseInt(nowtime.substring(3,5))){
                    if(parseInt(nowtime.substring(6,8))>55){
                        clearInterval(datecheck);
                        chrome.storage.local.set({
                            "tixcraft_quick":true,
                        },()=>{
                        location.reload();
                        });
                    }
                }
            }else if(settime.substring(0,2)==00){
                if(((parseInt(settime.substring(3,5))==0?60:parseInt(settime.substring(3,5)))-1)==parseInt(nowtime.substring(3,5))){
                    if(parseInt(nowtime.substring(6,8))>55){
                        clearInterval(datecheck);
                        chrome.storage.local.set({
                            "tixcraft_quick":true,
                        },()=>{
                        location.reload();
                        });
                    }
                }
               
            }else{
                iceconsole_time.text("已過時");
                clearInterval(datecheck);
            }
        },1000);

    }
    if(result.tixcraft_quick){  //如果插件是啟動的
        
        if(window.location.href.indexOf("activity/detail")>0){
           
            restartticket();
            let trygettime=0;
            let tryget = setInterval(function() {
                let gotit=false;
                trygettime+=1;
                let showlist=$("tr[class='gridc fcTxt']");
                    for(let i=0;i<showlist.length;i++){
                        if(showlist[i].innerText.indexOf(result.tixcraft_time)>=0){
                            if($(showlist[i]).find("button").length>0&&!(showlist[i].innerText.indexOf("選購一空")>=0)){
                                let element=$(showlist[i]).find("button")[0];
                                if ("createEvent" in document) {
                                    var evt = document.createEvent("HTMLEvents");
                                    evt.initEvent("click", false, true);
                                    element.dispatchEvent(evt);
                                }
                                else{
                                    element.fireEvent("click");
                                }
                                gotit=true;
                                clearInterval(tryget);
                            }
                        }
                    }
                    if(!gotit){
                        if(result.tixcraft_time_just==1){
                            for(let i=0;i<showlist.length;i++){
                                if($(showlist[i]).find("button").length>0&&!(showlist[i].innerText.indexOf("選購一空")>=0)){
                                    let element=$(showlist[i]).find("button")[0];
                                    if ("createEvent" in document) {
                                        var evt = document.createEvent("HTMLEvents");
                                        evt.initEvent("click", false, true);
                                        element.dispatchEvent(evt);
                                    }
                                    else{
                                        element.fireEvent("click");
                                    }
                                    gotit=true;
                                    clearInterval(tryget);
                                }
                            }
                        }else if(result.tixcraft_time_just==2){
                            for(let i=0;i<showlist.length;i++){
                                if($(showlist[showlist.length-i]).find("button").length>0&&!(showlist[showlist.length-i].innerText.indexOf("選購一空")>=0)){
                                    let element=$(showlist[showlist.length-i]).find("button")[0];
                                    if ("createEvent" in document) {
                                        var evt = document.createEvent("HTMLEvents");
                                        evt.initEvent("click", false, true);
                                        element.dispatchEvent(evt);
                                    }
                                    else{
                                        element.fireEvent("click");
                                    }
                                    gotit=true;
                                    clearInterval(tryget);
                                }
                            }
                        }
                        restartticket();
                    }
                    iceconsole_time.text("(注意)已刷新次數:"+trygettime);
                
            },500);
        }else if(window.location.href.indexOf("activity/game")>0){
                let showlist=$("tr[class='gridc fcTxt']");
                for(let i=0;i<showlist.length;i++){
                    if(showlist[i].innerText.indexOf(result.tixcraft_time)>=0&&!(showlist[i].innerText.indexOf("選購一空")>=0)){
                        if($(showlist[i]).find("button").length>0){
                            let element=$(showlist[i]).find("button")[0];
                            if ("createEvent" in document) {
                                var evt = document.createEvent("HTMLEvents");
                                evt.initEvent("click", false, true);
                                element.dispatchEvent(evt);
                            }
                            else{
                                element.fireEvent("click");
                            }
                        }
                    }
                }

                
        }else if(window.location.href.indexOf("ticket/area")>0){ //選擇區域
            
            if(result.tixcraft_auto=="human"){
                
                $("#select_form_manual").click();
            }

            
            let firstselectarea= async(findout)=>{
                let arealist=[];
                let vagueAndprecise=[];
                for(let i=0;i<result.tixcraft_vague;i++){
                  vagueAndprecise.push("tixcraft_area_vague_"+i);
                }
                chrome.storage.local.get(vagueAndprecise ,
                    (result2)=> {
                      for(let i=0;i<result.tixcraft_vague;i++){
                        arealist.push( result2["tixcraft_area_vague_"+i]);
                      }
                      for(let i=0;i<arealist.length;i++){
                        if(findout){
                            break;
                        }
    
                        if(arealist[i]!=""){
                            $($("div[class='zone area-list']").find("a")).each((k,e)=>{
                                let getnum=parseInt($(e).find("font[color='#FF0000']").text().replace(/[^\d]/g,""));
                                if(isNaN(getnum)?true: getnum>=result.tixcraft_ticketcount) {
                                    let areaname=arealist[i];
                                    let splitareaname=areaname.split("");
                                    let inputres=".*"
                                    for(let j=0;j<splitareaname.length;j++){
                                    inputres+=splitareaname[j]+".*";
                                    }
                                    let getres = new RegExp(inputres);
                                    if(getres.exec($(e).text())!=null){
                                        let element=document.getElementById($(e).attr("id"));
                                        if ("createEvent" in document) {
                                            var evt = document.createEvent("HTMLEvents");
                                            evt.initEvent("click", false, true);
                                            element.dispatchEvent(evt);
                                            findout=true;
                                        }
                                        else{
                                            element.fireEvent("click");
                                            findout=true;
                                        }
                                    }
                                }
                            });
                        }
                    }
                  } );
               
                return findout;
            }
            let secondselectarea= async(findout)=>{
                let areaprecise=[];
                let vagueAndprecise=[];

                for(let i=0;i<result.tixcraft_precise;i++){
                  vagueAndprecise.push("tixcraft_area_precise_"+i);
                }
                chrome.storage.local.get(vagueAndprecise ,
                    (result2)=> {

                      for(let i=0;i<result.tixcraft_precise;i++){
                        areaprecise.push(result2["tixcraft_area_precise_"+i]);
                      }
                      for(let i=0;i<areaprecise.length;i++){
                        if(findout){
                            break;
                        }
                        if(areaprecise[i]!=""){
                            $($("div[class='zone area-list']").find("a")).each((k,e)=>{
                                let getnum=parseInt($(e).find("font[color='#FF0000']").text().replace(/[^\d]/g,""));
                                if(isNaN(getnum)?true: getnum>=result.tixcraft_ticketcount) {
                                    let inputres=".*"+areaprecise[i]+".*"
                                    let getres = new RegExp(inputres);
                                    if(getres.exec($(e).text())!=null){
                                        let element=document.getElementById($(e).attr("id"));
                                        if ("createEvent" in document) {
                                            var evt = document.createEvent("HTMLEvents");
                                            evt.initEvent("click", false, true);
                                            element.dispatchEvent(evt);
                                            findout=true;
                                        }
                                        else{
                                            element.fireEvent("click");
                                            findout=true;
                                        }
                                    }
                                }
                            });
                        }
                    }
                  } );
                
                return findout;
            }
           
            let threeselectarea = async(findout)=>{
                try{
                    if(result.tixcraft_omg!=0&&!findout){
                        if(result.tixcraft_omg==1){
                            let selecta =$($("div[class='zone area-list']").find("a"));
                            
                            for(let i =0;i<selecta.length;i++){
                                let getnum=parseInt($(selecta[i]).find("font[color='#FF0000']").text().replace(/[^\d]/g,""));
                                if(isNaN(getnum)?true: getnum>=result.tixcraft_ticketcount) {
                                    let element=document.getElementById($(selecta[i]).attr("id"));
                                    if ("createEvent" in document) {
                                        var evt = document.createEvent("HTMLEvents");
                                        evt.initEvent("click", false, true);
                                        element.dispatchEvent(evt);
                                        return true;
                                    }
                                    else{
                                        element.fireEvent("click");
                                        return true;
                                    }
                                }
                            }
                        }else if(result.tixcraft_omg==2){
                            let selecta =$($("div[class='zone area-list']").find("a"));
                            for(let i =selecta.length-1;i>=0;i--){
                                let getnum=parseInt($(selecta[i]).find("font[color='#FF0000']").text().replace(/[^\d]/g,""));
                                if(isNaN(getnum)?true: getnum>=result.tixcraft_ticketcount) {
                                    let element=document.getElementById($(selecta[i]).attr("id"));
                                    if ("createEvent" in document) {
                                        var evt = document.createEvent("HTMLEvents");
                                        evt.initEvent("click", false, true);
                                        element.dispatchEvent(evt);
                                        return true;
                                    }
                                    else{
                                        element.fireEvent("click");
                                        return true;
                                    }
                                }
                            }
                                
                        }else if(result.tixcraft_omg==3){
                            let x=0;
                            let y=0;
                            let selecta =$($("div[class='zone area-list']").find("a"));
                            for(let i =0;i<selecta.length;i++){
                                let nowcount=$(selecta[i]).find("font[color='#FF0000']").text().replace(/[^\d]/g,"");
                                if(parseInt(nowcount)>y){
                                    y=nowcount;
                                    x=i;
                                }
                            }
                            let getnum=parseInt($(selecta[x]).find("font[color='#FF0000']").text().replace(/[^\d]/g,""));
                            if(isNaN(getnum)?true: getnum>=result.tixcraft_ticketcount) {
                                let element=document.getElementById($(selecta[x]).attr("id"));
                                if ("createEvent" in document) {
                                    var evt = document.createEvent("HTMLEvents");
                                    evt.initEvent("click", false, true);
                                    element.dispatchEvent(evt);     
                                    return true;
                   
                                }
                                else{
                                    element.fireEvent("click");
                                    return true;

                                }
                            }
                        }else if(result.tixcraft_omg==4){
                            let x=0;
                            let selecta =$($("div[class='zone area-list']").find("a"));
                            for(let i =0;i<selecta.length;i++){
                                let nowcount=$(selecta[i]).find("font[color='#FF0000']").text().replace(/[^\d]/g,"");
                                if(parseInt(nowcount)>=result.tixcraft_omg_num){
                                    x=i;
                                    break;
                                }
                            }
                            let element=document.getElementById($(selecta[x]).attr("id"));
                                if ("createEvent" in document) {
                                    var evt = document.createEvent("HTMLEvents");
                                    evt.initEvent("click", false, true);
                                    element.dispatchEvent(evt);    
                                    return true;
                    
                                }
                                else{
                                    element.fireEvent("click");
                                    return true;

                                }
                        }
                    }
                }catch(e){
                    return false;
                }
            }
            
          
            


            let runselectarea = async()=>{
                let findout=false;
                if(!result.tixcraft_omg_first){
                    findout=await firstselectarea(findout);
                    findout=await secondselectarea(findout);
                }
                findout=await threeselectarea(findout);

  
                if(!findout&&result.tixcraft_reloadtimecheck){
                    setTimeout(() => {
                        window.location.reload();
                    }, result.tixcraft_reloadtime*1000);
                }
                
            }
            runselectarea();

        }else if(window.location.href.indexOf("ticket/ticket")>0){ //選擇張數
            
            if(result.tixcraft_auto!="human"){
                let maxcount= $($("#ticketPriceList").find("select")[0]).find("option").length-1;
                if(maxcount>=result.tixcraft_ticketcount){
                    $($("#ticketPriceList").find("select")[0]).val(result.tixcraft_ticketcount);
                }else{
                    $($("#ticketPriceList").find("select")[0]).val(maxcount);
                }  
            }


            $("label[for=TicketForm_agree]").click();

        
            const getocrimg = async(url,callback)=>{ //傳送圖片
                const img = new Image();
                img.onload = function(e) {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);
                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                   
                    chrome.runtime.sendMessage(
                        {
                            type:"predit",
                            saveimage:Array.from(imageData.data),   
                            width: img.width,
                            height: img.height},
                          (response) => {
                              callback(response);
                          });
                };
                const timestamp = Date.now(); // 取得當前時間戳記
                img.src = `${url}?t=${timestamp}`; // 加上時間戳記             
            }
         
        

            let x=0;
            let sendanser=(captchf_version,ocrstring)=>{
                $('#TicketForm_verifyCode').val(ocrstring);  
                if(result.tixcraft_autosend){
                      fetch(window.location.href, {
                    "headers": {
                        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                        "accept-language": "zh-TW,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
                        "cache-control": "max-age=0",
                        "content-type": "application/x-www-form-urlencoded",
                        "sec-ch-ua-mobile": "?0",
                        "sec-fetch-dest": "document",
                        "sec-fetch-mode": "navigate",
                        "sec-fetch-site": "same-origin",
                        "sec-fetch-user": "?1",
                        "upgrade-insecure-requests": "1"
                    },
                    "referrer": window.location.href,
                    "referrerPolicy": "strict-origin-when-cross-origin",
                    "body": "_csrf="+encodeURIComponent($("meta[name=csrf-token]").attr("content"))+"&"+encodeURIComponent($($("#form-ticket-ticket").find("select")).attr("name"))+"="+$($("#form-ticket-ticket").find("select")).val()+"&"+encodeURIComponent($($("#form-ticket-ticket").find("select").parent().find("input")).attr("name"))+"="+$($("#form-ticket-ticket").find("select").parent().find("input")).val()+"&TicketForm%5BverifyCode%5D="+$("#TicketForm_verifyCode").val()+"&TicketForm%5Bagree%5D=1",
                    "method": "POST",
                    "mode": "cors",
                    "credentials": "include"
                    }).then((response)=>{
                        if(response.url.indexOf("order")>0){
                            window.location.href=response.url;
                        }else  if(response.url.indexOf("login")>0){
                            window.location.href=response.url;
                        }else{
                            captchf(captchf_version);
                            if(x>3){
                                window.location.reload();
                            }
                            x++;

                        }
                        
                    });
                   
                }
            }
            let captchf=(captchf_version)=>{
                if(captchf_version=="new"){
                    getocrimg('/ticket/captcha',(ocrstring)=>{
                        sendanser(captchf_version,ocrstring);
                    });
                }
            }
            if(result.tixcraft_ocr){
                captchf("new");
            }
          
        }else if(window.location.href.indexOf("ticket/verify")>0){ //驗證快速通過
        
            $.ajax({
                url: window.location.href.replaceAll("verify","check-code"),
                type: "POST",
                data: "_csrf="+encodeURIComponent($("meta[name=csrf-token]").attr("content"))+"&checkCode="+result.tixcraft_anser,
                success: function (response) {
                    if (response.message) {
                        $("input[name=checkCode]").val(result.tixcraft_anser);
                        $("input[name=checkCode]").parent().append($("<p>").text("冰塊：錯誤 無法快速通關 快改"));
                    } else if (response.confirm) {
                        $.ajax({
                            url: window.location.href.replaceAll("verify","check-code"),
                            type: "POST",
                            data: "_csrf="+encodeURIComponent($("meta[name=csrf-token]").attr("content"))+"&checkCode="+result.tixcraft_anser+"&confirmed=true",
                            success: function (response) {
                                window.location.reload();
                            },
                            error: function() {
                            
                            }
                        });
                    } else if (response.url) {
                        window.location.href = response.url;
                    }
                },
                error: function() {
                
                }
            });
        }
       


    }
});
});
