console.log("hello");
var amount=1;
var iframe;

//const search_iframe=document.getElementById("PT_AGSTARTPAGE_NUI");
//const search_iframe=document.getElementById("main_target_win0");
//console.log(search_iframe);

function onFrameLoaded(){
    iframe=document.getElementById("main_target_win0");
    //console.log(document.getElementById("main_target_win0"));
    if(iframe.contentWindow.document.getElementById("CLASS_SEARCH")){
        
        console.log("HEYY");
        //iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_SUBJECT_SRCH$0").selectedIndex=2;
       // iframe.contentWindow.document.getElementById("win0div$ICField232$0").innerHTML+=`<p id="save_button">Save</p><p id="load_button">Load</p>`;
        iframe.contentWindow.document.getElementById("win0div$ICField232$0").innerHTML+=`</br><div style="width:600px;"><div style="display: flex; justify-content: center;"><input type="button" id="save_button" tabindex="995" value="Save" class="PSPUSHBUTTON" style="width:50px;"> 
                                                                                        <input type="button" id="load_button" tabindex="995" value="Load" class="PSPUSHBUTTON" style="width:50px;">
                                                                                        <select class="PSDROPDOWNLIST" id="bookmarks" style="width:220px; "></select>
                                                                                        <input type="button" id="remove_button" tabindex="995" value="❌" class="PSPUSHBUTTON" style="width:25px;"></div></div>`;
        iframe.contentWindow.document.getElementById("save_button").onclick=saveButton;
        iframe.contentWindow.document.getElementById("load_button").onclick=loadButton;
        iframe.contentWindow.document.getElementById("remove_button").onclick=removeButton;
        chrome.storage.sync.onChanged.addListener(onItemChanged);
        onItemChanged();
        
        const frameobserver = new MutationObserver(oniFrameChange);
        frameobserver.observe(iframe.contentWindow.document, observerOptions);
        
    }


}
function onParentLoaded(ev){
    //if(ev[0])
    //console.log(ev);
    //console.log(ev[0].addedNodes[0]);
    //console.log(typeof ev[0].addedNodes[0]);
    //console.log(document.getElementById("DERIVED_REGFRM1_SS_TRANSACT_TITLE"));
    
    
    if(document.getElementById("main_target_win0")){
        document.getElementById("main_target_win0").onload=onFrameLoaded;
        
    }
   
}
function oniFrameChange(){
    
    console.log('iframe changed');
    if(!iframe.contentWindow.document.getElementById("save_button")&&iframe.contentWindow.document.getElementById("win0divDERIVED_CLSMSG_ERROR_TEXT").textContent&&iframe.contentWindow.document.getElementById("WAIT_win0").style.visibility=="hidden"){
        onFrameLoaded();
        console.log(iframe.contentWindow.document.getElementById("WAIT_win0").style.visibility);
        console.log('reload');
    } 
    else if(!iframe.contentWindow.document.getElementById("save_button")&&!iframe.contentWindow.document.getElementById("win0divDERIVED_CLSMSG_ERROR_TEXT").textContent&&iframe.contentWindow.document.getElementById("WAIT_win0").style.visibility=="hidden"){

    }
}
function saveButton(){
    console.log("saving");

    
    console.log('amount'+amount);
    
   
    chrome.storage.sync.set({[amount]: [iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_SUBJECT_SRCH$0").selectedIndex,
    iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_SSR_EXACT_MATCH1$1").selectedIndex,
    iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_CATALOG_NBR$1").value,
    iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_ACAD_CAREER$2").selectedIndex,
    iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_SSR_OPEN_ONLY$3").checked,
    iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_DESCR$4").value,
]},
     function(result) {
         //console.log('set is '+result);
        
      });
      amount=amount+1;
}
function loadButton(){
    
   
    const value=iframe.contentWindow.document.getElementById("bookmarks").options[iframe.contentWindow.document.getElementById("bookmarks").selectedIndex].value.split(',');
    console.log("loading")
    console.log(value)
    iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_SUBJECT_SRCH$0").selectedIndex=value[0];
    iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_SSR_EXACT_MATCH1$1").selectedIndex=parseInt(value[1],10);
    iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_CATALOG_NBR$1").value=value[2],10;
    iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_ACAD_CAREER$2").selectedIndex=value[3];
    iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_SSR_OPEN_ONLY$3").checked=value[4];
    iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_DESCR$4").value=value[5];
}
function removeButton(){
    
    const remove_ind=iframe.contentWindow.document.getElementById("bookmarks").selectedIndex+1;
    console.log('remove '+remove_ind)
    chrome.storage.sync.remove(remove_ind.toString());
}
function onItemChanged(){
    console.log("changed");
    
    chrome.storage.sync.get(null, function(result) {
        console.log(result);
        var index=1;
        iframe.contentWindow.document.getElementById("bookmarks").innerHTML=``;
        for (const [key, value] of Object.entries(result)) {
            const subject= iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_SUBJECT_SRCH$0").options[value[0]].text.match(/\b[A-Z]+(?:\s+[A-Z]+)*\b/);
            var match;
            if(value[1]==1){
                match="contains";
            }
            else if(value[1]==2){
                match=">=";
            }
            else if(value[1]==3){
                match="=";
            }
            else if(value[1]==4){
                match="<=";
            }
            //const match= iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_SSR_EXACT_MATCH1$1").options[value[1]].text;
            const number=value[2];
            iframe.contentWindow.document.getElementById("bookmarks").innerHTML+=`<option value="${value}">${subject} that ${match} ${number}</option>`;
            index=index+1;
        };
    });
}
//window.addEventListener('load',onSearchLoaded);
const iframe_parent=document.getElementById("win0divPSPAGECONTAINER_MD");
var observerOptions = {
    childList: true,
    //attributes: true,
  
    // Omit (or set to false) to observe only changes to the parent node
    subtree: true
  }
const observer = new MutationObserver(onParentLoaded);
observer.observe(iframe_parent, observerOptions);
chrome.storage.sync.clear();
//chrome.webRequest.onHeadersReceived.addListener(onSearchLoaded);