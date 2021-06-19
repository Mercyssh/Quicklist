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
    let listcard =  ele.parentNode.parentNode.parentNode;
    console.log(listcard)
    let list = userdata.findIndex(val => val.id == listcard.id);
    userdata.splice(list, 1);
    saveData();
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

// TO BE CONTINUED FROM HERE
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
            saveData();
        }, 1000)
    }, 600);

}
function deleteTask(ele){
    //TBW
}
function toggleTaskForm(ele){
    
    let type = ele.alt;

    // newlistbtn.hidden = !newlistbtn.hidden;
    // newlistform.hidden = !newlistform.hidden;

    if(type==undefined){
        ele.hidden = !ele.hidden;
        ele.parentNode.querySelector('.newtaskform').hidden = !ele.parentNode.querySelector('.newtaskform');

    } else if(type=='Save'){
        // If clickign on save btn, check if value is there
        let forminput = ele.parentNode.parentNode.querySelector('.newtaskinputs');
        let titleinput = forminput.querySelector('.titleinput');
        let descriptioninput = forminput.querySelector('.descriptioninput');

        if(titleinput.value!='')
            createTask(ele.closest('.list').id, titleinput.value, descriptioninput.value);
        titleinput.value='';
        descriptioninput.value='';

        // toggle the form
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
// UPDATE FUNCTION TO UPDATE IN PROPER SEQUENCE
function updateDOM(){
        //REMOVE ALL LISTS
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
                <div class="task" id="${tasks[u].id}">
                    <div class="taskheader"><h3 class="tasktitle completed">${tasks[u].title}</h3><img src="assets/checkmark.svg" alt="Done" width="16px"> </div>
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
                            <input type="text" class="titleinput" placeholder="Enter Title.." spellcheck="false"><br>
                            <input type="text" class="descriptioninput" placeholder="Enter Description... (optional)" spellcheck="false"><br>
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

            // console.log(userdata[i])
            root.prepend(tmp.firstElementChild);
        }
        // console.log(root);
}



// HANDLE NEW LIST CREATION
// Toggle Vibility
newlistbtn.addEventListener('click', e=>{
    toggleListForm();
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

