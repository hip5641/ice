
$(()=> {
    chrome.storage.local.get([ //取得瀏覽器擴充本地儲存
    "kktix_quick",
    "kktix_ticketname",
    "kktix_ticketcount",
    "kktix_anser"
   ], (result)=> {
      let icediv = document.createElement("div");
        icediv.setAttribute("id", "icecubes_ticket");
        let iceimg =document.createElement("img");
        

        if(result.kktix_quick){
            iceimg.setAttribute("class","img_icecubes start");
        }else{
            iceimg.setAttribute("class","img_icecubes closed");
        }
        icediv.onclick=()=>{
            if(iceimg.getAttribute("class").includes("closed")){
                chrome.storage.local.set({
                    "kktix_quick":true,
                  },()=>{
                    location.reload();
                  });
            }else{
                chrome.storage.local.set({
                    "kktix_quick":false,
                  },()=>{
                    location.reload();
                  });
            }
          
        }
        icediv.append(iceimg);
        $("body").append(icediv);
        if(result.kktix_quick){
          if(window.location.href.indexOf("registrations/new")>0) {
            let trykktix=setInterval(() => {
                let checkticket = (nowticket)=>{
                    let inputtest=result.kktix_ticketname.replaceAll("("," ").replaceAll(")"," ").replaceAll("$"," ").replaceAll("*"," ").replaceAll("\n","").replaceAll("\t","").replaceAll(" ","");
                    var myRe = new RegExp("(.*)"+inputtest+"(.*)", 'g');
                    let haveticket=myRe.exec(nowticket);
                    if(haveticket){
                        return true;
                    }else{

                        myRe = new RegExp("(.*)"+nowticket+"(.*)", 'g');
                        haveticket=myRe.exec(inputtest);
                        if(haveticket){
                            return true;
                        }else{
                            if(inputtest==nowticket){
                                return true;
                            }else{
                                return false;
                            }
                        }
                    }
                }
    
                let getagree=()=>{
                    $("#person_agree_terms").prop("checked","checked");
                      let element=$("#person_agree_terms")[0];
                      if ("createEvent" in document) {
                          var evt = document.createEvent("HTMLEvents");
                          evt.initEvent("click", false, true);
                          element.dispatchEvent(evt);
          
                      }
                      else{
                          element.fireEvent("click");
                      }
                  
                }
                getagree();
    
                let ticketlist = $("div[class='ticket-list-wrapper ng-scope']").find("input");
                if(!ticketlist.length>0){
                    ticketlist = $("div[class='ticket-list ng-scope']").find("input");
                }
                for(let i=0;i<ticketlist.length;i++){
                    let nowticket=ticketlist[i].parentElement.parentElement.innerText.replaceAll("("," ").replaceAll(")"," ").replaceAll("$"," ").replaceAll("*"," ").replaceAll("\n","").replaceAll("\t","").replaceAll(" ","");
                    if(checkticket(nowticket)){
                        while(ticketlist[i].value<result.kktix_ticketcount){
                            let element=ticketlist[i].parentElement.getElementsByTagName("button")[1];
                            if ("createEvent" in document) {
                                var evt = document.createEvent("HTMLEvents");
                                evt.initEvent("click", false, true);
                                element.dispatchEvent(evt);
                            }
                            else{
                                element.fireEvent("click");
                            }
                        }
                        break;
                    }
                }
              
                  let trycaptcha = setInterval(() => {
                    let sendanserlist=[];
                    let anserlist = $("div[class='custom-captcha-inner']")[0].innerText.split("\n");
                    for(let i=0;i<anserlist.length;i++){
                        let getanser = /(【)(.*)(】)/g;
                        let isanser=getanser.exec(anserlist[i]);
                        if(isanser!=null){
                            sendanserlist.push(isanser[2]);
                        }
                    }

                    if(sendanserlist.length>0){

                      clearInterval(trykktix);                        
                      clearInterval(trycaptcha);
                      
                      let trycaptchaint=0;
                      let element1= $("input[name=captcha_answer]")[0];
                      
                      if(result.kktix_anser){
                        let gostop=document.createElement("button");
                        gostop.style.backgroundColor='#00aed6';
                        gostop.innerText="停止猜測";
                        element1.parentElement.append(gostop );
                        let trysendcaptcha=setInterval(() => {
                            $(gostop).click(()=>{
                                clearInterval(trysendcaptcha);
                            })
                            const inputEvent = new InputEvent('input', {
                              bubbles: true,
                              cancelable: true,
                              composed: true,
                              data: sendanserlist[trycaptchaint], 
                            });
                            
                            element1.value = sendanserlist[trycaptchaint];
                            
                            element1.dispatchEvent(inputEvent);
                            if($($("div[class='form-actions plain align-center register-new-next-button-area']").find("button")[0]).attr("disabled")==null){
                                let element=$("div[class='form-actions plain align-center register-new-next-button-area']").find("button")[0];
                                if ("createEvent" in document) {
                                    var evt = document.createEvent("HTMLEvents");
                                    evt.initEvent("click", false, true);
                                    element.dispatchEvent(evt);
                                }
                                else{
                                    element.fireEvent("click");
                                    
                                }                
                            }
                            trycaptchaint++;
                            if(trycaptchaint>=sendanserlist.length){
                              trycaptchaint=0;
                            }
                            
                        }, 500);
                      }else{
                        $(element1).focus();
                      }
                    }

                  }, 750); 
            
                
            

                if($($("div[class='form-actions plain align-center register-new-next-button-area']").find("button")[0]).attr("disabled")==null){
                    let element=$("div[class='form-actions plain align-center register-new-next-button-area']").find("button")[0];
                    if ("createEvent" in document) {
                        var evt = document.createEvent("HTMLEvents");
                        evt.initEvent("click", false, true);
                        element.dispatchEvent(evt);
                        clearInterval(trykktix);
                    }
                    else{
                        element.fireEvent("click");
                        clearInterval(trykktix);
                    }                
                }
              
            }, 1000);
          }  
      }

  });
}

);