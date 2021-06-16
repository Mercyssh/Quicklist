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
// This function will add a list to current userdata
function createList(){
    //If the title is not empty
    if(newlisttitle.value != ''){
        let newlist = new List(newlisttitle.value, [], 'active');
        userdata.push(newlist);

        // Clear out everything
        saveData();
    }
}

function deleteList(e){
    let listcard =  e.target.parentNode.parentNode.parentNode
    let list = userdata.findIndex(val => val.id == listcard.id);
    userdata.splice(list, 1);
    saveData();

    // console.log(listcard);
    // console.log(list);
}

// Save userdata to localstorage
function saveData(){
    storage.setItem('userdata', JSON.stringify(userdata));
    updateDOM();
    console.log('Saved Data')
}

// Hide and unhide the new list form whenever appropriate buttons are pressed
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

        // Clean the slate
        // let template = `
        // <div id="newlistbtn">

        //     <div class="newlistbtn">
        //         New List +
        //     </div>

        //     <div class="newlistform" hidden>
        //         <input type="text" class="newlisttitle" placeholder="Enter List Title.." spellcheck="false">
        //         <div class="newlistbtns">
        //             <img src="assets/checkmark.svg" alt="Save" width="18px" id="acceptlistbtn" title="Create List">
        //             <img src="assets/cross.svg" alt="Discard" width="14px" id="discardlistbtn" title="Discard List">
        //         </div>
        //     </div>

        // </div>
        // `
        // root.innerHTML = template;

        //GENEREATE LISTS AND TASKS IN EACH LIST
        for(var i=0; i<userdata.length; i++){

            // find if there are no tasks
            let hidden = userdata[i].tasks.length==0;

            // Interpret the active tasks from object into UI
            let tasks=userdata[i].tasks;
            let activetasks = ``, archivedtasks = ``;
            for(var u=0; u<tasks.length; i++){
                if(tasks[u].status==false)
                activetasks += `
                <div class="task" id="${tasks[u].id}">
                    <div class="taskheader"><h3 class="tasktitle">${tasks[u].title}</h3><img src="assets/checkmark.svg" alt="Done" width="16px" hidden> </div>
                    <p class="taskdescription">${tasks[u].description}</p>
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
                    <input class="listtitle" type="text" value="${userdata[i].name}">
                    <div class="listicons">
                        <img src="assets/archive.svg" class="togglearchive" alt="Archive" width="14px">
                        <img src="assets/cross.svg" class="deletelist" alt="Delete" width="14px">
                    </div>
                </div>

                <!-- List of tasks -->
                <div class="listtasks activetasks ${hidden ? 'hide' : ''}">
                ${activetasks}
                </div>

                <div class="listtasks archivetasks hide">
                ${archivedtasks}
                </div>

                <!-- Section to add new task -->
                <div class="listnewtask">

                    <!-- Main Btn - Click to make form visible -->
                    <div class="newtaskbtn">+ Add new Task..</div>

                    <!-- Form to fill up task info -->
                    <div class="newtaskform" hidden>
                        <div class="newtaskinputs">
                            <input type="text" class="titleinput" placeholder="Enter Title.."><br>
                            <input type="text" class="descriptioninput" placeholder="Enter Description... (optional)"><br>
                        </div>
                        <div class="newtaskbtns">
                            <img src="assets/checkmark.svg" alt="Save" width="18px">
                            <img src="assets/cross.svg" alt="Discard" width="14px">
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

        reattachEventListeners();
}

// This function will reattach all event listeners
function reattachEventListeners(){
    let deletelistbtns = document.querySelectorAll('.deletelist');
    deletelistbtns.forEach(val => {
        val.removeEventListener('click', e=>deleteList(e));
    })
    deletelistbtns.forEach(val => {
        val.addEventListener('click', e=>deleteList(e));
    })
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

