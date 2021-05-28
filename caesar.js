console.log("hello");
var amount=1;
var iframe;


function onFrameLoaded(){
    iframe=document.getElementById("main_target_win0");
    //checking if the iframe contain an element with "CLASS_SEARCH", this tells us if were on the class search page(and not for example on a the shopping cart page)
    if(iframe.contentWindow.document.getElementById("CLASS_SEARCH")){
        
       // console.log("HEYY");
        //adds buttons and selector
        iframe.contentWindow.document.getElementById("win0div$ICField232$0").innerHTML+=`</br><div style="width:600px;"><div style="display: flex; justify-content: center;"><input type="button" id="save_button" tabindex="995" value="Save" class="PSPUSHBUTTON" style="width:50px;"> 
                                                                                        <input type="button" id="load_button" tabindex="995" value="Load" class="PSPUSHBUTTON" style="width:50px;">
                                                                                        <select class="PSDROPDOWNLIST" id="bookmarks" style="width:220px; "></select>
                                                                                        <input type="button" id="remove_button" tabindex="995" value="❌" class="PSPUSHBUTTON" style="width:25px;"></div></div>`;
        iframe.contentWindow.document.getElementById("save_button").onclick=saveButton;
        iframe.contentWindow.document.getElementById("load_button").onclick=loadButton;
        iframe.contentWindow.document.getElementById("remove_button").onclick=removeButton;
        //when the bookmark storage is changed call onItemChanged()
        chrome.storage.local.onChanged.addListener(onItemChanged);
        //call onItemChanged to set up the initial selector list
        onItemChanged();
        //when the iframe is changed call oniFrameChange
        const frameobserver = new MutationObserver(oniFrameChange);
        frameobserver.observe(iframe.contentWindow.document, observerOptions);
        
    }


}
//checks if iframe exists and if it does set a listener to call onFrameLoaded() when the iframe does load
function onParentLoaded(ev){
    if(document.getElementById("main_target_win0")){
        document.getElementById("main_target_win0").onload=onFrameLoaded;
        
    }
   
}
//called on iframe change, used to add the bookmark elements back when the page is reloaded(happens when the user tries to do an invalid search or clicks the clear button)
function oniFrameChange(){
    
    console.log('iframe changed');

    //this is for when the user does an invalid search
    if(!iframe.contentWindow.document.getElementById("save_button")&&iframe.contentWindow.document.getElementById("win0divDERIVED_CLSMSG_ERROR_TEXT")&&iframe.contentWindow.document.getElementById("win0divDERIVED_CLSMSG_ERROR_TEXT").textContent&&iframe.contentWindow.document.getElementById("WAIT_win0").style.visibility=="hidden"){
        onFrameLoaded();
        console.log('reload because of search error');
    } 
    //this is when the user clicks the clears button
    else if(!iframe.contentWindow.document.getElementById("save_button")&&
            (!iframe.contentWindow.document.getElementById("win0divDERIVED_CLSMSG_ERROR_TEXT")||(iframe.contentWindow.document.getElementById("win0divDERIVED_CLSMSG_ERROR_TEXT")&&!iframe.contentWindow.document.getElementById("win0divDERIVED_CLSMSG_ERROR_TEXT").textContent))
            &&iframe.contentWindow.document.getElementById("WAIT_win0").style.visibility=="hidden"){

                onFrameLoaded();
                console.log('reload because of clear');
    }
}
function saveButton(){
    console.log("saving");

    
    console.log('amount'+amount);
    
   
    chrome.storage.local.set({[amount]: [iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_SUBJECT_SRCH$0").selectedIndex,
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
    
    const remove_ind=iframe.contentWindow.document.getElementById("bookmarks").options[iframe.contentWindow.document.getElementById("bookmarks").selectedIndex].value.split(',')[6];
    console.log('remove '+remove_ind);
    chrome.storage.local.remove(remove_ind);
}
function onItemChanged(){
    console.log("changed");
    
    chrome.storage.local.get(null, function(result) {
        //console.log(result);
        var index=1;
        iframe.contentWindow.document.getElementById("bookmarks").innerHTML=``;
        for (const [key, value] of Object.entries(result)) {
            const subject= iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_SUBJECT_SRCH$0").options[value[0]].text.match(/\b[A-Z\_]+(?:\s+[A-Z\_]+)*\b/);
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
            value.push(key)
            iframe.contentWindow.document.getElementById("bookmarks").innerHTML+=`<option value="${value}">${subject} ${match} ${number}</option>`;
            index=index+1;
        };
    });
}
//setting up initial listener that sees when the iframe parent is changed
const iframe_parent=document.getElementById("win0divPSPAGECONTAINER_MD");
var observerOptions = {
    childList: true,

    subtree: true
  }
  //call onParentLoaded if parent element is changed
const observer = new MutationObserver(onParentLoaded);
observer.observe(iframe_parent, observerOptions);
