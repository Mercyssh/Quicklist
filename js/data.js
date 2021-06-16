// This file will setup constructors for some common data objects


// Constructor for list (string, array, string)
function List(name, tasks, mode){
    this.name = name;
    this.tasks = tasks;
    this.mode = mode;
    this.id = new Date().getTime();
}

//Constructor for Task (string, string, boolean)
function Task(title, description, status){
    this.title = title;
    this.description = description;
    this.status = false;
    this.id = new Date().getTime();
}