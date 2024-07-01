$(()=> {
  chrome.storage.local.get([ //取得瀏覽器擴充本地儲存
    "ibon_quick",
    "ibon_date",
    "ibon_time",
    "ibon_auto",
    "ibon_area",
    "ibon_area2",
    "ibon_area3",
    "ibon_area4",
    "ibon_omg",
    "ibon_nokeep",
    "ibon_autosend",
    "ibon_ticketcount"], (result)=> {
     
      let iceconsole=$("<div>").attr("style", "width: 200px;");
      let icediv=document.createElement("div");
      icediv.setAttribute("id", "icecubes_ticket");
      let iceimg=document.createElement("img");
      if(result.ibon_date==null||result.ibon_date=='') {
          result.ibon_quick=false;
          iceconsole.text("未輸入日期");
      }
      if(result.ibon_quick) {
          iceimg.setAttribute("class", "img_icecubes start");
      }
      else {
          iceimg.setAttribute("class", "img_icecubes closed");
      }
      icediv.onclick=()=> {
          if(iceimg.getAttribute("class").includes("closed")) {
              chrome.storage.local.set( {
                  "ibon_quick": true,
              }
              , ()=> {
                  location.reload();
              }
              );
          }
          else {
              chrome.storage.local.set( {
                  "ibon_quick": false,
              }
              , ()=> {
                  location.reload();
              }
              );
          }
      }
      icediv.append(iceimg);
      $(icediv).append(iceconsole);
      $("body").append(icediv);
      if(result.ibon_quick) {
          //如果插件是啟動的
          if(window.location.href.indexOf("ActivityInfo/Details")>0) {
              let trygettime=0;
              let tryget=setInterval(function() {
                  trygettime+=1;
                  let showlist=$("#GameInfoList").children("div");
                  if(showlist.length>0) {
                      showlist.each((k, e)=> {
                          if($(e).text().replaceAll("-", "/").includes(result.ibon_date.replaceAll("-", "/"))&& $(e).text().includes(result.ibon_time)) {
                                console.log($(e).text());
                              if($(e).find("button").length>0) {
                                  let element=$(e).find("button")[0];
                                  if ("createEvent" in document) {
                                      var evt=document.createEvent("HTMLEvents");
                                      evt.initEvent("click", false, true);
                                      element.dispatchEvent(evt);
                                  }
                                  else {
                                      element.fireEvent("click");
                                  }
                                  clearInterval(tryget);
                              }
                              else {
                                  RefreshActivityInfo();
                              }
                          }
                      }
                      );
                  }
                  else {
                      RefreshActivityInfo();
                  }
                  iceconsole.text("(注意)已刷新次數:"+trygettime);
              }
              , 500);
          }
          else if($("div[class='step-grid active']").text().indexOf("選擇票區")>0) {
            let checkmap=setInterval(() => {
              //選擇區域
              if(result.ibon_auto=="human") {
                  $("#ctl00_ContentPlaceHolder1_BUY_TYPE_1").click()
              }
              let arealist=[result.ibon_area, result.ibon_area2, result.ibon_area3, result.ibon_area4];
              let findout=false;
              let seatwrap=$(".select-seat-wrap").find("table").find("tr");
              for(let i=0;
              i<4;
              i++) {
                  if(findout) {
                      break;
                  }
                  if(arealist[i]!="") {
                      seatwrap.each((k, e)=> {
                          if($(e).find("td[class=action]").length>0) {
                              let getnum=parseInt($(e).find("td[class=action]").find("span").text());
                              if(isNaN(getnum)?true: getnum>=result.ibon_ticketcount) {
                                  if($(e).text().includes("區")&&arealist[i].includes("區")) {
                                      if($(e).text().replaceAll(" ", "").includes(arealist[i].replaceAll(" ", ""))) {
                                          let element=document.getElementById($(e).attr("id"));
                                          if ("createEvent" in document) {
                                              var evt=document.createEvent("HTMLEvents");
                                              evt.initEvent("click", false, true);
                                              element.dispatchEvent(evt);
                                              findout=true;
                                              clearInterval(checkmap);
                                          }
                                          else {
                                              element.fireEvent("click");
                                              findout=true;
                                              clearInterval(checkmap);
                                          }
                                      }
                                  }
                                  else {
                                      if($(e).text().replaceAll(" ", "").replaceAll("區", "").includes(arealist[i].replaceAll(" ", "").replaceAll("區", ""))) {
                                          let element=document.getElementById($(e).attr("id"));
                                          if ("createEvent" in document) {
                                              var evt=document.createEvent("HTMLEvents");
                                              evt.initEvent("click", false, true);
                                              element.dispatchEvent(evt);
                                              findout=true;
                                              clearInterval(checkmap);
                                          }
                                          else {
                                              element.fireEvent("click");
                                              findout=true;
                                              clearInterval(checkmap);
                                          }
                                      }
                                  }
                              }
                          }
                      }
                      );
                  }
              }
              if(result.ibon_omg&&!findout) {
                  seatwrap.each((k, e)=> {
                      if($(e).find("td[class=action]").length>0) {
                          let getnum=parseInt($(e).find("td[class=action]").find("span").text());
                          if(isNaN(getnum)?true: getnum>=result.ibon_ticketcount) {
                              let element=document.getElementById($(e).attr("id"));
                              if ("createEvent" in document) {
                                  var evt=document.createEvent("HTMLEvents");
                                  evt.initEvent("click", false, true);
                                  element.dispatchEvent(evt);
                                  findout=true;
                                  clearInterval(checkmap);
                              }
                              else {
                                  element.fireEvent("click");
                                  findout=true;
                                  clearInterval(checkmap);
                              }
                          }
                      }
                  }
                  );
              }
                  

            }, 1000);
              
          }
          else if($("div[class='step-grid active']").text().indexOf("座位/數量")>0) {
           

              //選擇張數
              if(result.ibon_nokeep) {
                  $("#ctl00_ContentPlaceHolder1_notConsecutive").click();
              }
              if(result.ibon_auto!="human") {
                  let maxcount=$($("#ctl00_ContentPlaceHolder1_DataGrid").find("select")[0]).find("option").length-1;
                  if(maxcount>=result.ibon_ticketcount) {
                      $("#ctl00_ContentPlaceHolder1_DataGrid_ctl02_AMOUNT_DDL").val(result.ibon_ticketcount);
                  }
                  else {
                      $("#ctl00_ContentPlaceHolder1_DataGrid_ctl02_AMOUNT_DDL").val(maxcount);
                  }
                  if(result.ibon_autosend) {

                        if($("i[class='fas fa-user']").length>0){
                            alert("未登入，請自行送出");
                        }else{
                            var theForm = document.forms['aspnetForm'];
                            if (!theForm) {
                                theForm = document.aspnetForm;
                            }
                            let element=$("#content").find("a[onclick='showProcess();']")[0];
                            if ("createEvent" in document) {
                                var evt=document.createEvent("HTMLEvents");
                                evt.initEvent("click");
                            
                                element.dispatchEvent(evt);
                            }
                            else {
                                element.fireEvent("click");
                            }
                            if (!theForm.onsubmit || (theForm.onsubmit() != false)) {
                                theForm.__EVENTTARGET.value = element.href.match(/(\(\')(.*)(\'\,)/g)[0].split("'")[1];
                                theForm.__EVENTARGUMENT.value = '';
                                theForm.submit();
                            }
                        }
                        
                  }
              }
          }else if($("div[class='step-grid active']").text().indexOf("選擇活動/商品")>0) {

            if(result.ibon_auto!="human") {
                let maxcount=$($("#ctl00_ContentPlaceHolder1_DataGrid").find("select")[0]).find("option").length-1;
                if(maxcount>=result.ibon_ticketcount) {
                    $("#ctl00_ContentPlaceHolder1_DataGrid_ctl02_AMOUNT_DDL").val(result.ibon_ticketcount);
                }
                else {
                    $("#ctl00_ContentPlaceHolder1_DataGrid_ctl02_AMOUNT_DDL").val(maxcount);
                }     
                if(result.ibon_autosend) {

                      if($("i[class='fas fa-user']").length>0){
                          alert("未登入，請自行送出");
                      }else{
                          var theForm = document.forms['aspnetForm'];
                          if (!theForm) {
                              theForm = document.aspnetForm;
                          }
                          let element=$("#content").find("a[onclick='showProcess();']")[0];
                          if ("createEvent" in document) {
                              var evt=document.createEvent("HTMLEvents");
                              evt.initEvent("click");
                          
                              element.dispatchEvent(evt);
                          }
                          else {
                              element.fireEvent("click");
                          }
                          if (!theForm.onsubmit || (theForm.onsubmit() != false)) {
                              theForm.__EVENTTARGET.value = element.href.match(/(\(\')(.*)(\'\,)/g)[0].split("'")[1];
                              theForm.__EVENTARGUMENT.value = '';
                              theForm.submit();
                          }
                      }
                      
                }
            }
          }
      }
  }
  );
}

);