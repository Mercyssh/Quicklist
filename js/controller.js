// SET UP DATA
// Get all required main elements
const root = document.querySelector('#root');
const storage = window.localStorage;

// Get List buttons
const newlistbtn = document.querySelector('.newlistbtn');
const newlistform = document.querySelector('.newlistform');
const newlisttitle = document.querySelector('.newlisttitle');
const acceptlistbtn = document.querySelector('#acceptlistbtn');
const discardlistbtn = document.querySelector('#discardlistbtn');

// Get current user data
var userdata = JSON.parse(storage.getItem('userdata'));
if (userdata == undefined){
    storage.setItem('userdata', JSON.stringify([]));
    userdata = [];
}
console.log(userdata);



// DECLARE FUNCTIONS
// Create a new list
function createList(){
    //If the title is not empty
    if(newlisttitle.value != ''){
        let newlist = new List(newlisttitle.value, [], 'active');
        userdata.push(newlist);
        saveData();
    }
}
// Delete the list
function deleteList(ele){
    
    //ANIMATIONS HERE
    let listcard =  ele.parentNode.parentNode.parentNode;
    listcard.classList.add('collapseleft');
    
    // MAIN LOGIC HERE
    setTimeout(() => {

        let listindex = userdata.findIndex(val => val.id == listcard.id);
        userdata.splice(listindex, 1);

        // Save here instead, only save when no other tasks are collapsing
        listcard.remove();
        let flag = root.querySelectorAll('.collapseleft').length
        if(flag<1){
            saveData();
        }

    }, 500);
}
// Toggle list mode
function toggleListMode(ele){

    let list = ele.closest('.list');
    let listid = list.id;
    let listindex = userdata.findIndex(val => val.id == listid);
    if(userdata[listindex].mode=='active'){
        userdata[listindex].mode='archived';
    }
    else {
        userdata[listindex].mode='active';
    }
    saveData();
}

// HANDLE TASKS
function createTask(listid, title, description){

    let listindex = userdata.findIndex(v => v.id == listid);
    userdata[listindex].tasks.push(new Task(title, description, false));
    
    // console.log(listid, title, description);
    saveData();
}
function doneTask(ele){

    // Handle animations - 1
    let spans = ele.querySelectorAll("span");
    spans.forEach(span => span.classList.add('strikethrough'));
    let checkmark = ele.querySelector("img");
    checkmark.classList.add('checkmark');

    // Get the task and list info
    let taskid = ele.id;
    let taskindex;
    let listindex = userdata.findIndex(i => {

        let flag = i.tasks.findIndex(j => {
            return j.id == ele.id;
        });

        taskindex=flag;
        return flag!=-1

    })
    let listid = userdata[listindex].id;

    //Start collapse animation
    setTimeout(() => {
        ele.classList.add('collapseup');

        //Actual logic goes here
        setTimeout(() => {
            userdata[listindex].tasks[taskindex].status=true;

            // Save here instead, only save when no other tasks are collapsing
            ele.remove();
            let flag = root.querySelectorAll('.collapseup').length
            if(flag<1){
                saveData();
            }
        }, 1000)
    }, 600);

    

}
function deleteTask(ele){

    //Animations
    let checkmark = ele.querySelector('img');
    let tasktitle = ele.querySelector('.tasktitle');
    let taskdescription = ele.querySelector('.taskdescription');

    checkmark.classList.add('redify');
    ele.classList.add('collapseup');
    tasktitle.classList.add('deleting');
    taskdescription.classList.add('deleting');

    // Get the task and list info
    let taskindex;
    let listindex = userdata.findIndex(i => {

        let flag = i.tasks.findIndex(j => {
            return j.id == ele.id;
        });

        taskindex=flag;
        return flag!=-1

    })

    // Actual logic now
    setTimeout(() => {

        // remove task
        userdata[listindex].tasks.splice(taskindex, 1);

        // Save here instead, only save when no other tasks are collapsing
        ele.remove();
        let flag = root.querySelectorAll('.collapseup').length
        if(flag<1){
            saveData();
        }
    }, 1000);
}
function toggleTaskForm(ele){
    
    let type = ele.alt;
    // console.log(ele);

    if(type==undefined){
        let titleinput = ele.closest('.listnewtask').querySelector('.titleinput');
        ele.hidden = !ele.hidden;
        ele.parentNode.querySelector('.newtaskform').hidden = !ele.parentNode.querySelector('.newtaskform');
        titleinput.focus();
    } else if(type=='Save'){
        // If clickign on save btn, check if value is there
        let forminput = ele.parentNode.parentNode.querySelector('.newtaskinputs');
        let titleinput = forminput.querySelector('.titleinput');
        let descriptioninput = forminput.querySelector('.descriptioninput');

        if(titleinput.value!='')
            createTask(ele.closest('.list').id, titleinput.value, descriptioninput.value);
            
        // toggle the form
        titleinput.value='';
        descriptioninput.value='';
        ele.parentNode.parentNode.hidden = !ele.parentNode.parentNode.hidden;
        ele.parentNode.parentNode.parentNode.querySelector('.newtaskbtn').hidden = !ele.parentNode.parentNode.parentNode.querySelector('.newtaskbtn').hidden
        

    } else if(type=='Discard'){
        // If clickign on save btn, check if value is there
        let forminput = ele.parentNode.parentNode.querySelector('.newtaskinputs');
        let titleinput = forminput.querySelector('.titleinput');
        let descriptioninput = forminput.querySelector('.descriptioninput');
        titleinput.value='';
        descriptioninput.value='';

        // toggle the form
        ele.parentNode.parentNode.hidden = !ele.parentNode.parentNode.hidden;
        ele.parentNode.parentNode.parentNode.querySelector('.newtaskbtn').hidden = !ele.parentNode.parentNode.parentNode.querySelector('.newtaskbtn').hidden
    }
    
    // console.log(type);
    //TBW
}
function toggleTaskFormKeyboardCheck(elem, e){

    let form = elem.closest('.listnewtask');
    let newtaskbtn = form.querySelector('.newtaskbtn');
    let newtaskform = form.querySelector('.newtaskform');

    let titleinput = elem.parentNode.querySelector('.titleinput');
    let descriptioninput = elem.parentNode.querySelector('.descriptioninput');

    if(e.key=="Enter"){
        if(titleinput.value!=''){
            // console.log(newtaskbtn);
            createTask(elem.closest('.list').id, titleinput.value, descriptioninput.value);

            //Toggle On off
            newtaskbtn.hidden = !newtaskbtn.hidden;
            newtaskform.hidden = !newtaskform.hidden;
            titleinput.value='';
            descriptioninput.value='';
        }
    } else if(e.key=="Escape"){
        //Toggle On off
        newtaskbtn.hidden = !newtaskbtn.hidden;
        newtaskform.hidden = !newtaskform.hidden;
        titleinput.value='';
        descriptioninput.value='';
    }
}

// Save userdata to localstorage
function saveData(){
    storage.setItem('userdata', JSON.stringify(userdata));
    updateDOM();
    console.log('Saved Data')
}

// Hide and unhide the NEW LIST FORM
function toggleListForm(){
    newlistbtn.hidden = !newlistbtn.hidden;
    newlistform.hidden = !newlistform.hidden;

    if(!newlistform.hidden){
        newlisttitle.focus();
    } else {
        newlisttitle.value='';
    }
}

// Update the DOM Whenever needed
function updateDOM(){

        //REMOVE ALL LISTS
        let newlistbtn_ = document.getElementById('newlistbtn');
        let lists = root.querySelectorAll('.list');
        lists.forEach(element => element.remove());

        //REGENEREATE LISTS AND TASKS IN EACH LIST
        for(var i=0; i<userdata.length; i++){

            // find if there are no tasks
            let hidden = userdata[i].mode!='active';

            // Interpret the active tasks from object into UI
            let tasks=userdata[i].tasks;
            let activetasks = ``, archivedtasks = ``;
            for(var u=0; u<tasks.length; u++){
                if(tasks[u].status==false)
                activetasks += `
                <div class="task" id="${tasks[u].id}" onclick="doneTask(this)">
                    <div class="taskheader"><h3 class="tasktitle"><span class="">${tasks[u].title}</span></h3><img src="assets/checkmark.svg" alt="Done" width="16px" class="" style="opacity:0;"> </div>
                    <p class="taskdescription"><span class="">${tasks[u].description}</span></p>
                </div>
                `
                else
                archivedtasks += `
                <div class="task" id="${tasks[u].id}" onclick="deleteTask(this)">
                    <div class="taskheader"><h3 class="tasktitle completed">${tasks[u].title}</h3><img src="assets/checkmark.svg" class="checkmark2" alt="Done" width="16px"> </div>
                    <p class="taskdescription completed">${tasks[u].description}</p>
                </div>
                `
            }
            
            // Create template and Prepend to root
            let template = `
            <div class="list" id="${userdata[i].id}">

                <!-- Header containing Icons and Title of List -->
                <div class="listheader">
                    <input class="listtitle" type="text" value="${userdata[i].name}" spellcheck="false">
                    <div class="listicons">
                        <img src="assets/archive.svg" class="togglearchive ${hidden ? '': 'ungreenify'} ${hidden ? 'greenify': ''}" alt="Archive" width="14px" onclick="toggleListMode(this)">
                        <img src="assets/cross.svg" class="deletelist" alt="Delete" width="14px" onclick="deleteList(this)">
                    </div>
                </div>

                <!-- List of tasks -->
                <div class="listtasks activetasks ${hidden ? 'hide' : ''}">
                ${activetasks}
                </div>

                <div class="listtasks archivetasks ${hidden ? '' : 'hide'}">
                ${archivedtasks}
                </div>

                <!-- Section to add new task -->
                <div class="listnewtask">

                    <!-- Main Btn - Click to make form visible -->
                    <div class="newtaskbtn" onclick="toggleTaskForm(this)">+ Add new Task..</div>

                    <!-- Form to fill up task info -->
                    <div class="newtaskform" hidden>
                        <div class="newtaskinputs">
                            <input type="text" class="titleinput" placeholder="Enter Title.." spellcheck="false" onkeydown="toggleTaskFormKeyboardCheck(this, event)"><br>
                            <input type="text" class="descriptioninput" placeholder="Enter Description... (optional)" spellcheck="false" onkeydown="toggleTaskFormKeyboardCheck(this, event)"><br>
                        </div>
                        <div class="newtaskbtns">
                            <img src="assets/checkmark.svg" alt="Save" width="18px" onclick="toggleTaskForm(this)">
                            <img src="assets/cross.svg" alt="Discard" width="14px" onclick="toggleTaskForm(this)">
                        </div>
                    </div>

                </div>

            </div>
            `;
            let tmp = document.createElement('div');
            tmp.innerHTML = template;

            root.insertBefore(tmp.firstElementChild, newlistbtn_);
            // root.prepend(tmp.firstElementChild);
        }
        // console.log(root);
}

// HANDLE NEW LIST CREATION
// Toggle Vibility
newlistbtn.addEventListener('click', e=>{
    toggleListForm();
})
// Keyboard enter check
newlisttitle.addEventListener('keydown', e=>{
    if(e.key=="Enter"){
        createList();
        toggleListForm();
    } else if (e.key=="Escape"){
        toggleListForm();
    }
})
// Validate title, create list and toggle visibility
acceptlistbtn.addEventListener('click', e=>{
    createList();
    toggleListForm();
})
discardlistbtn.addEventListener('click', e=>{
    toggleListForm();
})
updateDOM();

