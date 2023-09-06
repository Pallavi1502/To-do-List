const listsContainer = document.querySelector('[data-lists]')
const newListForm = document.querySelector('[data-new-list-form]')
const newListInput = document.querySelector('[data-new-list-input]')
const deleteListBtn = document.querySelector('[data-delete-list-btn]')
const dataListDisplayContainer = document.querySelector('[data-list-display-container]')
const listTitleElement = document.querySelector('[data-list-title]')
const listCountElement = document.querySelector('[data-list-count]')
const tasksContainer = document.querySelector('[data-tasks]')
const taskTemplate = document.getElementById('task-template')
const newTaskForm = document.querySelector('[data-new-task-form]')
const newTaskInput = document.querySelector('[data-new-task-input]')
const clearCompleteBtn = document.querySelector('[data-clear-complete-btn]')


// ------ local storage   -------
const LOCAL_STORAGE_LIST_KEY = 'task.lists' 
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = 'task.selectedId' 
let lists= JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || []
let selectedId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY)

// ------  eventListeners  --------
newListForm.addEventListener('submit',e=>{
    e.preventDefault()
    const listName = newListInput.value 
    if(listName == null || listName === '') return
    const list = createList(listName)
    newListInput.value = null
    lists.push(list)
    save()
    render()
})
newTaskForm.addEventListener('submit',e=>{
    e.preventDefault()
    const taskName = newTaskInput.value 
    if(taskName == null || taskName === '') return
    const task = createTask(taskName)
    newTaskInput.value = null
    const selectedList = lists.find(list => list.id === selectedId)
    selectedList.tasks.push(task)
    save()
    render()
})

listsContainer.addEventListener('click' , e=>{
    if(e.target.tagName.toLowerCase() =='li'){
        selectedId = e.target.dataset.listId
        save()
        render()
    }
})
tasksContainer.addEventListener('click' , e =>{
    if(e.target.tagName.toLowerCase() =='input'){
        const selectedList = lists.find( list => list.id === selectedId)
        const selectedTask = selectedList.tasks.find(task => task.id === e.target.id) 
        selectedTask.complete = e.target.checked
        save()
        renderTaskCount(selectedList)
    }
}
)
  
clearCompleteBtn.addEventListener('click' , e =>{
    const selectedList = lists.find( list => list.id === selectedId)
    selectedList.tasks = selectedList.tasks.filter(task => !task.complete)
    save()
    render()
})
deleteListBtn.addEventListener('click', e=>{
    lists = lists.filter(list => list.id !== selectedId)
    selectedId = null
    save()
    render()
} )

// ------------ functions ------------ 
function  createList(liname){
    return { id: Date.now().toString(), name:liname, tasks:[] }
}
function createTask(name){
    return { id: Date.now().toString(), name:name, complete:false }
}


function render(){
    clearElement(listsContainer);
    renderLists()

    const selectedList= lists.find(list => list.id === selectedId)
    if(selectedId == null){
        dataListDisplayContainer.style.display = 'none'
    }
    else{
        dataListDisplayContainer.style.display = ''
        listTitleElement.innerText = selectedList.name
        renderTaskCount(selectedList)
        clearElement(tasksContainer)
        renderTasks(selectedList)
    }
}
render()

function renderLists(){
    lists.forEach(list =>{
        const listElement = document.createElement('li')
        
        listElement.dataset.listId= list.id
        listElement.classList.add("list-item")
        listElement.innerText = list.name
        if(list.id === selectedId){
            listElement.classList.add("active-list")
        }
        listsContainer.appendChild(listElement)
    })
}

function clearElement(ele){
    while(ele.firstChild){
        ele.removeChild(ele.firstChild)
    }
}

function renderTaskCount(selectedList){
    const incompleteTasksCount = selectedList.tasks.filter(task =>!task.complete).length
    const taskString = incompleteTasksCount === 1 ? "task" : "tasks"
    listCountElement.innerText = `${incompleteTasksCount} ${taskString} remaining` 
}


function renderTasks(selectedList){
    selectedList.tasks.forEach(task =>{
        const taskElement = document.importNode(taskTemplate.content, true)
        const checkbox = taskElement.querySelector('input')
        checkbox.id = task.id
        checkbox.checked = task.complete
        const label = taskElement.querySelector('label')
        label.htmlFor = task.id
        label.append(task.name)
        tasksContainer.appendChild(taskElement)
    })
}

function save(){
    localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists))
    localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedId)
}



