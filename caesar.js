//console.log("hello");
//chrome.storage.local.clear();
var amount;
var iframe;
var changing_term = false;
var changing_attribute= false;
var opening_advanced=false;
var opening_attributes=false;
var serif_on=true;
var current_value;

class SearchBookmark {
    constructor(subjectId, subjectName, courseSelector, courseNumber, career, open, keyword, term, startSelector, startNumber, endSelector, endNumber, days, mon, tues, wed, thurs, fri,sat,sun, instructNameSelector, instructName, classNbr, campus, courseComp, session, attribute,attributeValue) {
        //console.log(arguments.length)
        this.subjectId = subjectId;
        this.subjectName = subjectName;
        this.courseSelector = courseSelector;
        this.courseNumber = courseNumber;
        this.career = career;
        this.open = open;
        this.keyword = keyword;
        this.term = term;
        this.advancedSearch = false;
        this.attriSearch = false;

        if(arguments.length==10){
            this.attriSearch = true;
            this.attribute=startSelector;
            this.attributeValue=startNumber;
        }
        else if (arguments.length >=26 ) {
            this.advancedSearch = true;
            this.startSelector = startSelector;
            this.startNumber = startNumber;
            this.endSelector = endSelector;
            this.endNumber = endNumber;
            this.days = days;
            this.mon = mon;
            this.tues = tues;
            this.wed = wed;
            this.thurs = thurs;
            this.fri = fri;
            this.sat=sat;
            this.sun=sun;
            this.instructName = instructName;
            this.instructNameSelector = instructNameSelector;
            this.classNbr = classNbr;
            this.campus = campus
            this.courseComp = courseComp;
            this.session = session;
            if(arguments.length == 28 ){
                this.attriSearch = true;
                this.attribute=attribute;
                this.attributeValue=attributeValue;
            }
        }
        


    }
}

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
    ////console.log('iframe loaded');
    iframe = document.getElementById("main_target_win0");
    //checking if the iframe contain an element with "CLASS_SEARCH", this tells us if were on the class search page(and not for example on a the shopping cart page)
    const frameobserver = new MutationObserver(oniFrameChange);
    if (iframe.contentWindow.document.getElementById("pt_pageinfo_win0").getAttribute('page') == "SSR_CLSRCH_ENTRY") {
       //console.log("search page");
        //adds buttons and selector
        iframe.contentWindow.document.getElementById("win0div$ICField143").outerHTML = `</br><div style="width:600px;"><div style="display: flex; justify-content: center;"><label class="PSDROPDOWNLABEL">Bookmarks </label><input type="button" id="save_button" tabindex="995" value="Save" class="PSPUSHBUTTON" style="width:50px;"> 
                                                                                    <input type="button" id="load_button" tabindex="995" value="Load" class="PSPUSHBUTTON" style="width:50px;">
                                                                                        <select class="PSDROPDOWNLIST" id="bookmarks" style="width:220px; "></select>
                                                                                        <input type="button" id="remove_button" tabindex="995" value="Delete" class="PSPUSHBUTTON" style="width:50px;"></div></div>`;

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

    
    //if on search page
    if (iframe.contentWindow.document.getElementById("pt_pageinfo_win0").getAttribute('page') == "SSR_CLSRCH_ENTRY") {
        //console.log('iframe changed');
        //this is for when the user does an invalid search
        if (!iframe.contentWindow.document.getElementById("save_button") && iframe.contentWindow.document.getElementById("win0divDERIVED_CLSMSG_ERROR_TEXT") && iframe.contentWindow.document.getElementById("win0divDERIVED_CLSMSG_ERROR_TEXT").textContent && iframe.contentWindow.document.getElementById("WAIT_win0").style.visibility == "hidden") {
            onFrameLoaded();
            //console.log('reload because of search error');
        }
        //this is when the user clicks the clears button,pane is opened, or term is changed
        else if (!iframe.contentWindow.document.getElementById("save_button") &&
            (!iframe.contentWindow.document.getElementById("win0divDERIVED_CLSMSG_ERROR_TEXT") || (iframe.contentWindow.document.getElementById("win0divDERIVED_CLSMSG_ERROR_TEXT") && !iframe.contentWindow.document.getElementById("win0divDERIVED_CLSMSG_ERROR_TEXT").textContent))
            && iframe.contentWindow.document.getElementById("WAIT_win0").style.visibility == "hidden") {
           //console.log("why did reload")
           
            //if it was changing the term because of a bookmark load
            if (changing_term) {
                //console.log('changing_term');
                loadButtonAfter();
                changing_term=false;
            }
            //if it was opening the advanced page because a bookmark load contains advanced search info
            else if(opening_advanced){
               // console.log('opening_advanced');
                loadButtonAfter()
                opening_advanced=false;
            }
            else if(opening_attributes){
               // console.log('opening_attributes');
                loadButtonAfter()
                opening_attributes=false;
            }
            else if (changing_attribute) {
               // console.log('changing_attributes');
                loadButtonAfter();
                changing_attribute=false;
            }
            //clear
            else{
                //console.log('reload because of clear');
                onFrameLoaded();
            }
           // 
           

        }
    }
    //if on results page
    else if (iframe.contentWindow.document.getElementById("pt_pageinfo_win0").getAttribute('page') == "SSR_CLSRCH_RSLT" && iframe.contentWindow.document.getElementById("WAIT_win0").style.visibility == "hidden") {
        if (!iframe.contentWindow.document.getElementById("tabbutton1")) {
            //console.log("results page")

            resultsPage()
        }
    }
}


function saveButton() {
    //console.log("saving");


    //console.log('amount' + amount);
    var bookmark;
    // if advanced tab is open
    if (iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_SSR_START_TIME_OPR$5")) {
        //if attributes tab open
        if(iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_CRSE_ATTR$12")){
            bookmark = new SearchBookmark(iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_SUBJECT_SRCH$0").selectedIndex, iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_SUBJECT_SRCH$0").options[iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_SUBJECT_SRCH$0").selectedIndex].text, iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_SSR_EXACT_MATCH1$1").selectedIndex, iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_CATALOG_NBR$1").value, iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_ACAD_CAREER$2").selectedIndex, iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_SSR_OPEN_ONLY$3").checked, iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_DESCR$4").value, iframe.contentWindow.document.getElementById("CLASS_SRCH_WRK2_STRM$35$").selectedIndex, iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_SSR_START_TIME_OPR$5").selectedIndex, iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_MEETING_TIME_START$5").value, iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_SSR_END_TIME_OPR$5").selectedIndex, iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_MEETING_TIME_END$5").value, iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_INCLUDE_CLASS_DAYS$6").selectedIndex, iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_MON$6").checked, iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_TUES$6").checked, iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_WED$6").checked, iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_THURS$6").checked, iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_FRI$6").checked, iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_SAT$6").checked, iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_SUN$6").checked, iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_SSR_EXACT_MATCH2$7").selectedIndex, iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_LAST_NAME$7").value, iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_CLASS_NBR$8").value, iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_CAMPUS$9").selectedIndex, iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_SSR_COMPONENT$10").selectedIndex, iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_SESSION_CODE$11").selectedIndex, iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_CRSE_ATTR$12").selectedIndex,iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_CRSE_ATTR_VALUE$12").selectedIndex)
        }
        //if just advanced tab
        else{
            bookmark = new SearchBookmark(iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_SUBJECT_SRCH$0").selectedIndex, iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_SUBJECT_SRCH$0").options[iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_SUBJECT_SRCH$0").selectedIndex].text, iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_SSR_EXACT_MATCH1$1").selectedIndex, iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_CATALOG_NBR$1").value, iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_ACAD_CAREER$2").selectedIndex, iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_SSR_OPEN_ONLY$3").checked, iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_DESCR$4").value, iframe.contentWindow.document.getElementById("CLASS_SRCH_WRK2_STRM$35$").selectedIndex, iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_SSR_START_TIME_OPR$5").selectedIndex, iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_MEETING_TIME_START$5").value, iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_SSR_END_TIME_OPR$5").selectedIndex, iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_MEETING_TIME_END$5").value, iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_INCLUDE_CLASS_DAYS$6").selectedIndex, iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_MON$6").checked, iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_TUES$6").checked, iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_WED$6").checked, iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_THURS$6").checked, iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_FRI$6").checked, iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_SAT$6").checked, iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_SUN$6").checked, iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_SSR_EXACT_MATCH2$7").selectedIndex, iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_LAST_NAME$7").value, iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_CLASS_NBR$8").value, iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_CAMPUS$9").selectedIndex, iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_SSR_COMPONENT$10").selectedIndex, iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_SESSION_CODE$11").selectedIndex)
        }
    }
    //if attributes tab open and advanced closed
    else if(iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_CRSE_ATTR$12")){
        bookmark = new SearchBookmark(iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_SUBJECT_SRCH$0").selectedIndex, iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_SUBJECT_SRCH$0").options[iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_SUBJECT_SRCH$0").selectedIndex].text, iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_SSR_EXACT_MATCH1$1").selectedIndex, iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_CATALOG_NBR$1").value, iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_ACAD_CAREER$2").selectedIndex, iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_SSR_OPEN_ONLY$3").checked, iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_DESCR$4").value, iframe.contentWindow.document.getElementById("CLASS_SRCH_WRK2_STRM$35$").selectedIndex,iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_CRSE_ATTR$12").selectedIndex,iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_CRSE_ATTR_VALUE$12").selectedIndex)
    }
    else {
        bookmark = new SearchBookmark(iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_SUBJECT_SRCH$0").selectedIndex, iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_SUBJECT_SRCH$0").options[iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_SUBJECT_SRCH$0").selectedIndex].text, iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_SSR_EXACT_MATCH1$1").selectedIndex, iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_CATALOG_NBR$1").value, iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_ACAD_CAREER$2").selectedIndex, iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_SSR_OPEN_ONLY$3").checked, iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_DESCR$4").value, iframe.contentWindow.document.getElementById("CLASS_SRCH_WRK2_STRM$35$").selectedIndex)
    }
    chrome.storage.local.set({
        [amount]: bookmark
    },
        function (result) {
            //console.log("bookmark ");
            //console.log(bookmark);

        });
    amount = amount + 1;
}
function loadButton(){
    const ind =iframe.contentWindow.document.getElementById("bookmarks").options[iframe.contentWindow.document.getElementById("bookmarks").selectedIndex].value;
    chrome.storage.local.get(ind, function (result) {
       // console.log("loading ")
        //console.log(result)
        current_value=result[ind];
        loadButtonAfter();
    })
    }

function loadButtonAfter(ind) {
   

        if (iframe.contentWindow.document.getElementById("CLASS_SRCH_WRK2_STRM$35$").selectedIndex != current_value.term) {
            iframe.contentWindow.document.getElementById("CLASS_SRCH_WRK2_STRM$35$").selectedIndex = current_value.term;
            var event = new Event('change');
            changing_term = true;
            iframe.contentWindow.document.getElementById("CLASS_SRCH_WRK2_STRM$35$").dispatchEvent(event);
           
            return;
            
            
    
        }
        else {
            //needs to expand advance pane
            if(current_value.advancedSearch&&!iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_SSR_START_TIME_OPR$5")){
                opening_advanced=true;
                iframe.contentWindow.document.getElementById("DERIVED_CLSRCH_SSR_EXPAND_COLLAPS$149$$1").click();
                
                return;
                
                
            }
            //needs advanced pane but its already expanded
            else if(current_value.advancedSearch&&iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_SSR_START_TIME_OPR$5")){
                //console.log("advanced pane already open");
                iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_SSR_START_TIME_OPR$5").selectedIndex=current_value.startSelector;
                iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_MEETING_TIME_START$5").value=current_value.startNumber;
                iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_SSR_END_TIME_OPR$5").selectedIndex=current_value.endSelector;
                iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_MEETING_TIME_END$5").value=current_value.endNumber;
                iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_INCLUDE_CLASS_DAYS$6").selectedIndex=current_value.days;
                iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_MON$6").checked=current_value.mon;
                iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_TUES$6").checked=current_value.tues;
                iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_WED$6").checked=current_value.wed;
                iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_THURS$6").checked=current_value.thurs;
                iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_FRI$6").checked=current_value.fri;
                iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_SAT$6").checked=current_value.sat;
                iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_SUN$6").checked=current_value.sun
                iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_SSR_EXACT_MATCH2$7").selectedIndex=current_value.instructNameSelector;
                iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_LAST_NAME$7").value=current_value.instructName;
                iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_CLASS_NBR$8").value=current_value.classNbr;
                iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_CAMPUS$9").selectedIndex=current_value.campus;
                iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_SSR_COMPONENT$10").selectedIndex=current_value.courseComp;
                iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_SESSION_CODE$11").selectedIndex=current_value.session;
                
            }
             //needs to expand attrib pane
            if(current_value.attriSearch&&!iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_CRSE_ATTR$12")){
                opening_attributes=true;
                iframe.contentWindow.document.getElementById("DERIVED_CLSRCH_SSR_EXPAND_COLLAPS$149$$2").click();
                
                return;
            }
             //needs attrib pane but its already expanded
             else if(current_value.attriSearch&&iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_CRSE_ATTR$12")){

                 
                if(iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_CRSE_ATTR$12").selectedIndex!=current_value.attribute){

                    iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_CRSE_ATTR$12").selectedIndex=current_value.attribute;
                    var event = new Event('change');
                    changing_attribute = true;
                    iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_CRSE_ATTR$12").dispatchEvent(event);
                    return;
                }
                
                iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_CRSE_ATTR_VALUE$12").selectedIndex=current_value.attributeValue;

             }
            iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_SUBJECT_SRCH$0").selectedIndex = current_value.subjectId;
            iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_SSR_EXACT_MATCH1$1").selectedIndex = current_value.courseSelector;
            iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_CATALOG_NBR$1").value = current_value.courseNumber;
            iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_ACAD_CAREER$2").selectedIndex = current_value.career;
            iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_SSR_OPEN_ONLY$3").checked = current_value.open;
            iframe.contentWindow.document.getElementById("SSR_CLSRCH_WRK_DESCR$4").value =current_value.keyword;
            onFrameLoaded();
        }
    
    
}
function removeButton() {

    const remove_ind = iframe.contentWindow.document.getElementById("bookmarks").options[iframe.contentWindow.document.getElementById("bookmarks").selectedIndex].value;
    //console.log('remove ' + remove_ind);
    chrome.storage.local.remove(remove_ind);
}


function onItemChanged() {
    //console.log("changed");

    chrome.storage.local.get(null, function (result) {
        //console.log(result);
        
        
        var index = 1;
        iframe.contentWindow.document.getElementById("bookmarks").innerHTML = ``;
        for (const [key, value] of Object.entries(result)) {

            const term = iframe.contentWindow.document.getElementById("CLASS_SRCH_WRK2_STRM$35$").options[value.term].text.slice(2, 7);
            var subject = value.subjectName.match(/\b[A-Z\_]+(?:\s+[A-Z\_]+)*\b/);
            if (!subject) {
                subject = "N/A";
            }
            var match;
            if (value.courseSelector == 1) {
                match = "contains";
            }
            else if (value.courseSelector == 2) {
                match = ">=";
            }
            else if (value.courseSelector == 3) {
                match = "=";
            }
            else if (value.courseSelector == 4) {
                match = "<=";
            }

            var number = value.courseNumber;
            if (number) {
                match = match + " "
            }
            iframe.contentWindow.document.getElementById("bookmarks").innerHTML += `<option value="${key}">${subject} ${match}${number}, \'${term}</option>`;
            index = index + 1;

        };
        amount=index;
    });
}


function resultsPage() {
    //iframe.contentWindow.document.getElementById("win0divDERIVED_CLSRCH_GROUP5").innerHTML += `<a id="tab_button"  style="width:50px;" ptlinktgt="pt_peoplecode" " class="PSHYPERLINK">Load</a>`
    //iframe.contentWindow.document.getElementById("tab_button").onclick = function () { newTab(0) };
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
        iframe.contentWindow.document.getElementById(`DERIVED_CLSRCH_DESCRLONG$${ind}`).innerHTML += `<div id="extra_info${ind}"></div>`;
        ind++;
    })
    ind = 0;

}
function newTab(ind) {
    //console.log(ind);
    var xhr = new XMLHttpRequest();

    var fd = `ICAJAX=1&ICNAVTYPEDROPDOWN=0&ICType=Panel&ICElementNum=0&ICStateNum=${iframe.contentWindow.document.getElementById("ICStateNum").value}&ICAction=MTG_CLASSNAME%24${ind}&ICModelCancel=0&ICXPos=0&ICYPos=0&ResponsetoDiffFrame=-1&TargetFrameName=None&FacetPath=None&ICFocus=&ICSaveWarningFilter=0&ICChanged=-1&ICSkipPending=0&ICAutoSave=0&ICResubmit=0&ICSID=${iframe.contentWindow.document.getElementById("ICSID").value}&ICAGTarget=true&ICActionPrompt=false&ICBcDomData=UnknownValue&ICPanelHelpUrl=&ICPanelName=&ICFind=&ICAddCount=&ICAppClsData=&DERIVED_SSTSNAV_SSTS_MAIN_GOTO$27$=9999`;

    xhr.open("POST", "https://caesar.ent.northwestern.edu/psc/CS857PRD/EMPLOYEE/SA/c/SA_LEARNER_SERVICES.CLASS_SEARCH.GBL", true);
    xhr.addEventListener('load', function (event) {

        const newTab = iframe.contentWindow.document.cloneNode(true);

        //console.log(newTab);
        newTab.getElementById("win0divPSPAGECONTAINER").outerHTML = event.target.responseXML.getElementById("win0divPAGECONTAINER").innerHTML.slice(9, -3)
        newTab.getElementById("ACE_$ICField241").outerHTML="";
        newTab.getElementById("win0divNW_DERIVED_SS_NW_LINK_CRSE_DESCR").parentElement.parentElement.outerHTML="";
        newTab.getElementById("NW_DERIVED_SS_NW_LINK_INST_CTEC$0").outerHTML="";
        newTab.getElementById("DERIVED_REGFRM1_TITLE1").innerText+="- ALL LINKS HAVE BEEN REMOVED";
        newTab.title=`${newTab.getElementById("DERIVED_CLSRCH_DESCR200").innerText}`;
        var wnd = window.open("");
        wnd.document.write(newTab.documentElement.outerHTML);



    });
    xhr.withCredentials = "true";
    xhr.setRequestHeader('Content-Type', "application/x-www-form-urlencoded");
    xhr.send(fd);
}
function moreInfo(ind) {
    //console.log(ind);
    var xhr = new XMLHttpRequest();

    var fd = `ICAJAX=1&ICNAVTYPEDROPDOWN=0&ICType=Panel&ICElementNum=0&ICStateNum=${iframe.contentWindow.document.getElementById("ICStateNum").value}&ICAction=MTG_CLASSNAME%24${ind}&ICModelCancel=0&ICXPos=0&ICYPos=0&ResponsetoDiffFrame=-1&TargetFrameName=None&FacetPath=None&ICFocus=&ICSaveWarningFilter=0&ICChanged=-1&ICSkipPending=0&ICAutoSave=0&ICResubmit=0&ICSID=${iframe.contentWindow.document.getElementById("ICSID").value}&ICAGTarget=true&ICActionPrompt=false&ICBcDomData=UnknownValue&ICPanelHelpUrl=&ICPanelName=&ICFind=&ICAddCount=&ICAppClsData=&DERIVED_SSTSNAV_SSTS_MAIN_GOTO$27$=9999`;

    xhr.open("POST", "https://caesar.ent.northwestern.edu/psc/CS857PRD/EMPLOYEE/SA/c/SA_LEARNER_SERVICES.CLASS_SEARCH.GBL", true);
    xhr.addEventListener('load', function (event) {

        const newTab = iframe.contentWindow.document.cloneNode(true);

        //console.log(newTab);
        newTab.getElementById("win0divPSPAGECONTAINER").outerHTML = event.target.responseXML.getElementById("win0divPAGECONTAINER").innerHTML.slice(9, -3)
        if (newTab.getElementById("SSR_CLS_DTL_WRK_SSR_REQUISITE_LONG")) {
            iframe.contentWindow.document.getElementById(`extra_info${ind}`).innerHTML += `<br>Class Capacity: ${newTab.getElementById("SSR_CLS_DTL_WRK_ENRL_TOT").innerText}/${newTab.getElementById("SSR_CLS_DTL_WRK_ENRL_CAP").innerText}<br><br>Wait List Total: ${newTab.getElementById("SSR_CLS_DTL_WRK_WAIT_TOT").innerText} <br><br>Reqs: ${newTab.getElementById("SSR_CLS_DTL_WRK_SSR_REQUISITE_LONG").innerText}`;
        }
        else {
            iframe.contentWindow.document.getElementById(`extra_info${ind}`).innerHTML += `<br>Class Capacity: ${newTab.getElementById("SSR_CLS_DTL_WRK_ENRL_TOT").innerText}/${newTab.getElementById("SSR_CLS_DTL_WRK_ENRL_CAP").innerText}<br><br>Wait List Total: ${newTab.getElementById("SSR_CLS_DTL_WRK_WAIT_TOT").innerText}`;
        }
        iframe.contentWindow.document.getElementById(`morebutton${ind}`).value = "Less Info";
        iframe.contentWindow.document.getElementById(`morebutton${ind}`).onclick = (function (ind) {
            return function () {
                lessInfo(ind);
            }
        })(ind);

    });
    xhr.withCredentials = "true";
    xhr.setRequestHeader('Content-Type', "application/x-www-form-urlencoded");
    xhr.send(fd);
}
function lessInfo(ind) {
    iframe.contentWindow.document.getElementById(`extra_info${ind}`).innerHTML = "";
    iframe.contentWindow.document.getElementById(`morebutton${ind}`).value = "More Info";
    iframe.contentWindow.document.getElementById(`morebutton${ind}`).onclick = (function (ind) {
        return function () {
            moreInfo(ind);
        }
    })(ind);
}
