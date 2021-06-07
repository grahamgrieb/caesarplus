console.log("hello");
//chrome.storage.local.clear();
var amount = 1;
var iframe;
var changing_term = false;
var changing_term_value;

//setting up initial listener that sees when the iframe parent is changed
const iframe_parent = document.getElementById("win0divPSPAGECONTAINER_MD");
var observerOptions = {
    childList: true,

    subtree: true
}
//call onParentLoaded if parent element is changed
const observer = new MutationObserver(onParentLoaded);
observer.observe(iframe_parent, observerOptions);

function onFrameLoaded() {
    //console.log('iframe loaded');
    iframe = document.getElementById("main_target_win0");
    //checking if the iframe contain an element with "CLASS_SEARCH", this tells us if were on the class search page(and not for example on a the shopping cart page)
    const frameobserver = new MutationObserver(oniFrameChange);
    if (iframe.contentWindow.document.getElementById("pt_pageinfo_win0").getAttribute('page') == "SSR_CLSRCH_ENTRY") {
        //<input type="button" id="load_button" tabindex="995" value="Load" class="PSPUSHBUTTON" style="width:50px;" data-termchanged="0" onclick="while(this.dataset.termchanged!="1"); addchg_win0(this); submitAction_win0(this.form,this.id); this.dataset.termchanged="2";>
        console.log("search page");
        //adds buttons and selector
        iframe.contentWindow.document.getElementById("win0div$ICField232$0").innerHTML += `</br><div style="width:600px;"><div style="display: flex; justify-content: center;"><input type="button" id="save_button" tabindex="995" value="Save" class="PSPUSHBUTTON" style="width:50px;"> 
                                                                                    <input type="button" id="load_button" tabindex="995" value="Load" class="PSPUSHBUTTON" style="width:50px;" data-termchanged="0">
                                                                                        
                                                                                        <select class="PSDROPDOWNLIST" id="bookmarks" style="width:220px; "></select>
                                                                                        <input type="button" id="remove_button" tabindex="995" value="❌" class="PSPUSHBUTTON" style="width:25px;"></div></div>`;

        iframe.contentWindow.document.getElementById("save_button").onclick = saveButton;
        iframe.contentWindow.document.getElementById("load_button").addEventListener("click", loadButton);
        iframe.contentWindow.document.getElementById("remove_button").onclick = removeButton;





        //when the bookmark storage is changed call onItemChanged()
        chrome.storage.local.onChanged.addListener(onItemChanged);
        //call onItemChanged to set up the initial selector list
        onItemChanged();
        //when the iframe is changed call oniFrameChange

        frameobserver.observe(iframe.contentWindow.document, observerOptions);

    }




}
//checks if iframe exists and if it does set a listener to call onFrameLoaded() when the iframe does load
function onParentLoaded(ev) {
    if (document.getElementById("main_target_win0")) {
        document.getElementById("main_target_win0").onload = onFrameLoaded;


    }

}
//called on iframe change, used to add the bookmark elements back when the page is reloaded(happens when the user tries to do an invalid search or clicks the clear button)
function oniFrameChange() {

    console.log('iframe changed');
    //if on search page
    if (iframe.contentWindow.document.getElementById("pt_pageinfo_win0").getAttribute('page') == "SSR_CLSRCH_ENTRY") {
        //this is for when the user does an invalid search
        if (!iframe.contentWindow.document.getElementById("save_button") && iframe.contentWindow.document.getElementById("win0divDERIVED_CLSMSG_ERROR_TEXT") && iframe.contentWindow.document.getElementById("win0divDERIVED_CLSMSG_ERROR_TEXT").textContent && iframe.contentWindow.document.getElementById("WAIT_win0").style.visibility == "hidden") {
            onFrameLoaded();
            console.log('reload because of search error');
        }
        //this is when the user clicks the clears button
        else if (!iframe.contentWindow.document.getElementById("save_button") &&
            (!iframe.contentWindow.document.getElementById("win0divDERIVED_CLSMSG_ERROR_TEXT") || (iframe.contentWindow.document.getElementById("win0divDERIVED_CLSMSG_ERROR_TEXT") && !iframe.contentWindow.document.getElementById("win0divDERIVED_CLSMSG_ERROR_TEXT").textContent))
            && iframe.contentWindow.document.getElementById("WAIT_win0").style.visibility == "hidden") {

            onFrameLoaded();
            console.log('reload because of clear');
            //if it was changing the term because of a bookmark load
            if (changing_term) {
                iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_SUBJECT_SRCH$0").selectedIndex = changing_term_value[0];
                iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_SSR_EXACT_MATCH1$1").selectedIndex = parseInt(changing_term_value[1], 10);
                iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_CATALOG_NBR$1").value = changing_term_value[2], 10;
                iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_ACAD_CAREER$2").selectedIndex = changing_term_value[3];
                iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_SSR_OPEN_ONLY$3").checked = changing_term_value[4];
                iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_DESCR$4").value = changing_term_value[5];
            }

        }
    }
    //if on results page
    else if (iframe.contentWindow.document.getElementById("pt_pageinfo_win0").getAttribute('page') == "SSR_CLSRCH_RSLT" && iframe.contentWindow.document.getElementById("WAIT_win0").style.visibility == "hidden") {
        if (!iframe.contentWindow.document.getElementById("tab_button")) {
            console.log("results page")

            resultsPage()
        }
    }
}


function saveButton() {
    console.log("saving");


    console.log('amount' + amount);


    chrome.storage.local.set({
        [amount]: [iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_SUBJECT_SRCH$0").selectedIndex,
        iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_SSR_EXACT_MATCH1$1").selectedIndex,
        iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_CATALOG_NBR$1").value,
        iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_ACAD_CAREER$2").selectedIndex,
        iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_SSR_OPEN_ONLY$3").checked,
        iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_DESCR$4").value,
        iframe.contentWindow.document.getElementById("CLASS_SRCH_WRK2_STRM$35$").selectedIndex,
        iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_SUBJECT_SRCH$0").options[iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_SUBJECT_SRCH$0").selectedIndex].text
        ]
    },
        function (result) {
            //console.log('set is '+result);

        });
    amount = amount + 1;
}

function loadButton() {


    const value = iframe.contentWindow.document.getElementById("bookmarks").options[iframe.contentWindow.document.getElementById("bookmarks").selectedIndex].value.split(',');
    console.log("loading ")
    console.log(value)
    if (iframe.contentWindow.document.getElementById("CLASS_SRCH_WRK2_STRM$35$").selectedIndex != value[6]) {
        iframe.contentWindow.document.getElementById("CLASS_SRCH_WRK2_STRM$35$").selectedIndex = value[6];
        var event = new Event('change');
        iframe.contentWindow.document.getElementById("CLASS_SRCH_WRK2_STRM$35$").dispatchEvent(event);
        changing_term = true;
        changing_term_value = value;
        //while(iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_SUBJECT_SRCH$0").selectedIndex!=0);
    }
    else {
        iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_SUBJECT_SRCH$0").selectedIndex = value[0];
        iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_SSR_EXACT_MATCH1$1").selectedIndex = parseInt(value[1], 10);
        iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_CATALOG_NBR$1").value = value[2], 10;
        iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_ACAD_CAREER$2").selectedIndex = value[3];
        iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_SSR_OPEN_ONLY$3").checked = value[4];
        iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_DESCR$4").value = value[5];
    }




    // while (iframe.contentWindow.document.getElementById("WAIT_win0").style.visibility != "hidden");




}
function removeButton() {

    const remove_ind = iframe.contentWindow.document.getElementById("bookmarks").options[iframe.contentWindow.document.getElementById("bookmarks").selectedIndex].value.split(',')[8];
    console.log('remove ' + remove_ind);
    chrome.storage.local.remove(remove_ind);
}


function onItemChanged() {
    console.log("changed");

    chrome.storage.local.get(null, function (result) {
        //console.log(result);
        var index = 1;
        iframe.contentWindow.document.getElementById("bookmarks").innerHTML = ``;
        for (const [key, value] of Object.entries(result)) {

            const term = iframe.contentWindow.document.getElementById("CLASS_SRCH_WRK2_STRM$35$").options[value[6]].text.slice(2, 7);
            //var subject = iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_SUBJECT_SRCH$0").options[value[0]].text.match(/\b[A-Z\_]+(?:\s+[A-Z\_]+)*\b/);
            var subject = value[7].match(/\b[A-Z\_]+(?:\s+[A-Z\_]+)*\b/);
            if (!subject) {
                subject = "N/A";
            }
            var match;
            if (value[1] == 1) {
                match = "contains";
            }
            else if (value[1] == 2) {
                match = ">=";
            }
            else if (value[1] == 3) {
                match = "=";
            }
            else if (value[1] == 4) {
                match = "<=";
            }

            var number = value[2];
            if (number) {
                match = match + " "
            }

            value.push(key)
            iframe.contentWindow.document.getElementById("bookmarks").innerHTML += `<option value="${value}">${subject} ${match}${number}, \'${term}</option>`;
            index = index + 1;

        };
    });
}


function resultsPage() {
    iframe.contentWindow.document.getElementById("win0divDERIVED_CLSRCH_GROUP5").innerHTML += `<a id="tab_button"  style="width:50px;" ptlinktgt="pt_peoplecode" " class="PSHYPERLINK">Load</a>`
    iframe.contentWindow.document.getElementById("tab_button").onclick = function () { newTab(0) };
    var ind = 0;
    iframe.contentWindow.document.querySelectorAll('*[id^="ACE_SSR_CLSRSLT_WRK_GROUPBOX2$"]').forEach(elem => {
        elem.outerHTML += `<input type="button" id="morebutton${ind}" tabindex="995" value="More Info" class="PSPUSHBUTTON" style="width:60px;"></input>    <input type="button" id="tabbutton${ind}" tabindex="995" value="Open in New Tab" class="PSPUSHBUTTON" style="width:100px;"></input>`;
        iframe.contentWindow.document.getElementById(`tabbutton${ind}`).onclick = (function (ind) {
            return function () {
                newTab(ind);
            }
        })(ind);
        iframe.contentWindow.document.getElementById(`morebutton${ind}`).onclick = (function (ind) {
            return function () {
                moreInfo(ind);
            }
        })(ind);
        iframe.contentWindow.document.getElementById(`DERIVED_CLSRCH_DESCRLONG$${ind}`).innerHTML+=`<div id="extra_info${ind}"></div>`;
        ind++;
    })
    ind = 0;

}
function newTab(ind) {
    console.log(ind);
    var xhr = new XMLHttpRequest();

    var fd = `ICAJAX=1&ICNAVTYPEDROPDOWN=0&ICType=Panel&ICElementNum=0&ICStateNum=${iframe.contentWindow.document.getElementById("ICStateNum").value}&ICAction=MTG_CLASSNAME%24${ind}&ICModelCancel=0&ICXPos=0&ICYPos=0&ResponsetoDiffFrame=-1&TargetFrameName=None&FacetPath=None&ICFocus=&ICSaveWarningFilter=0&ICChanged=-1&ICSkipPending=0&ICAutoSave=0&ICResubmit=0&ICSID=${iframe.contentWindow.document.getElementById("ICSID").value}&ICAGTarget=true&ICActionPrompt=false&ICBcDomData=UnknownValue&ICPanelHelpUrl=&ICPanelName=&ICFind=&ICAddCount=&ICAppClsData=&DERIVED_SSTSNAV_SSTS_MAIN_GOTO$27$=9999`;

    xhr.open("POST", "https://caesar.ent.northwestern.edu/psc/CS857PRD/EMPLOYEE/SA/c/SA_LEARNER_SERVICES.CLASS_SEARCH.GBL", true);
    xhr.addEventListener('load', function (event) {

        const newTab = iframe.contentWindow.document.cloneNode(true);

        console.log(newTab);
        newTab.getElementById("win0divPSPAGECONTAINER").outerHTML = event.target.responseXML.getElementById("win0divPAGECONTAINER").innerHTML.slice(9, -3)

        var wnd = window.open("");
        wnd.document.write(newTab.documentElement.outerHTML);



    });
    xhr.withCredentials = "true";
    xhr.setRequestHeader('Content-Type', "application/x-www-form-urlencoded");
    xhr.send(fd);
}
function moreInfo(ind) {
    console.log(ind);
    var xhr = new XMLHttpRequest();

    var fd = `ICAJAX=1&ICNAVTYPEDROPDOWN=0&ICType=Panel&ICElementNum=0&ICStateNum=${iframe.contentWindow.document.getElementById("ICStateNum").value}&ICAction=MTG_CLASSNAME%24${ind}&ICModelCancel=0&ICXPos=0&ICYPos=0&ResponsetoDiffFrame=-1&TargetFrameName=None&FacetPath=None&ICFocus=&ICSaveWarningFilter=0&ICChanged=-1&ICSkipPending=0&ICAutoSave=0&ICResubmit=0&ICSID=${iframe.contentWindow.document.getElementById("ICSID").value}&ICAGTarget=true&ICActionPrompt=false&ICBcDomData=UnknownValue&ICPanelHelpUrl=&ICPanelName=&ICFind=&ICAddCount=&ICAppClsData=&DERIVED_SSTSNAV_SSTS_MAIN_GOTO$27$=9999`;

    xhr.open("POST", "https://caesar.ent.northwestern.edu/psc/CS857PRD/EMPLOYEE/SA/c/SA_LEARNER_SERVICES.CLASS_SEARCH.GBL", true);
    xhr.addEventListener('load', function (event) {

        const newTab = iframe.contentWindow.document.cloneNode(true);

        console.log(newTab);
        newTab.getElementById("win0divPSPAGECONTAINER").outerHTML = event.target.responseXML.getElementById("win0divPAGECONTAINER").innerHTML.slice(9, -3)
        if (newTab.getElementById("SSR_CLS_DTL_WRK_SSR_REQUISITE_LONG")) {
            iframe.contentWindow.document.getElementById(`extra_info${ind}`).innerHTML += `<br>Class Capacity: ${newTab.getElementById("SSR_CLS_DTL_WRK_ENRL_TOT").innerText}/${newTab.getElementById("SSR_CLS_DTL_WRK_ENRL_CAP").innerText}<br><br>Wait List Total: ${newTab.getElementById("SSR_CLS_DTL_WRK_WAIT_TOT").innerText} <br><br>Reqs: ${newTab.getElementById("SSR_CLS_DTL_WRK_SSR_REQUISITE_LONG").innerText}`;
        }
        else {
            iframe.contentWindow.document.getElementById(`extra_info${ind}`).innerHTML += `<br>Class Capacity: ${newTab.getElementById("SSR_CLS_DTL_WRK_ENRL_TOT").innerText}/${newTab.getElementById("SSR_CLS_DTL_WRK_ENRL_CAP").innerText}<br><br>Wait List Total: ${newTab.getElementById("SSR_CLS_DTL_WRK_WAIT_TOT").innerText}`;
        }
        iframe.contentWindow.document.getElementById(`morebutton${ind}`).value="Less Info";
        iframe.contentWindow.document.getElementById(`morebutton${ind}`).onclick= (function (ind) {
            return function () {
                lessInfo(ind);
            }
        })(ind);
        //var wnd = window.open("");
        //wnd.document.write(newTab.documentElement.outerHTML);



    });
    xhr.withCredentials = "true";
    xhr.setRequestHeader('Content-Type', "application/x-www-form-urlencoded");
    xhr.send(fd);
}
function lessInfo(ind){
    iframe.contentWindow.document.getElementById(`extra_info${ind}`).innerHTML="";
    iframe.contentWindow.document.getElementById(`morebutton${ind}`).value="More Info";
    iframe.contentWindow.document.getElementById(`morebutton${ind}`).onclick= (function (ind) {
        return function () {
            moreInfo(ind);
        }
    })(ind);
}
