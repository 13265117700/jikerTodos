const PAGE = {
  data:{
    todos:[{
      title:'代办一',
      completed:true
    },{
      title:'代办二',
      completed:false
    }],
    filters:{
       1:'全部',
       2:'待办',
       3:'已办',
    },
    filter:1,
    total:0
  },
  

  init:function(){
    this.getTodos();
    this.bind();
    this.render();
  },

  bind:function(){
    let todoInput = document.getElementById('todo-input');
    todoInput.addEventListener('keyup',this.addTodo);

    let todosList = document.getElementById('todos-list');
    this.onEventLister(todosList,'click','todo-item-hd',this.toggleTodo);
    this.onEventLister(todosList,'click','todo-item-ft',this.removeTodo);

    let todosFilter = document.getElementById('todos-filter');
    this.onEventLister(todosFilter,'click','filter-item',this.filterTodo);
    this.onEventLister(todosFilter,'click','filter-remove-put',this.filterRemoveTodo);

    window.addEventListener('unload',this.saveTodos);
  },

  onEventLister:function(parentNode,action,childClassName,callback){
    parentNode.addEventListener(action,function(e){
      e.target.className.indexOf(childClassName) >= 0 && callback(e);
    })
  },

  saveTodos:function(){
    let todos = PAGE.data.todos;
    let todosStr = JSON.stringify(todos);
    localStorage.setItem('todos',todosStr);
  },

  getTodos:function(){
    let todos = localStorage.getItem('todos');
    todos = JSON.parse(todos) || [];
    PAGE.data.todos = todos;
    this.render();
  },

  render:function(){
    let todos = PAGE.data.todos;
    let filters = PAGE.data.filters;
    let filter = PAGE.data.filter;
    todos.forEach((data,index)=> data.index = index);
    let showTodos;
    switch(filter){
      case 2:
        showTodos = todos.filter(data => !data.completed);
        break;
      case 3: 
        showTodos = todos.filter(data => data.completed);
        break;
      default:
        showTodos = todos;
        break;
    }
    PAGE.data.total = showTodos.length;

    let todosElement = showTodos.map((data)=>{
      return `
      <div class="todo-item ${data.completed?'active':''}" data-index ="${data.index}">
        <div class="todo-item-hd"></div>
        <div class="todo-item-bd">${data.title}</div>
        <div class="todo-item-ft">x</div>
      </div>
      `
    }).join('');

    let filterElement = Object.keys(filters).map(kep =>{
      return `
      <span class="filter-item ${filter == kep? 'active':''}" data-id = "${kep}">
        ${filters[kep]}
      </span>
       `
    }).join('');

    let foter = `
    <div class="filter-count">
      <span class="filter-count-number" id="count-number">${PAGE.data.total}</span>
      <span class="filter-count-text">项目</span>
    </div>
    <div class="filter-list" id="filter-list">
      ${filterElement}
    </div>
    <div class="filter-remove" id="filter-remove">
    <span class="filter-remove-put">删除已完成</span>
    </div>
    `

    let todosList = document.getElementById('todos-list');
    let todosFilter = document.getElementById('todos-filter');
    todosList.innerHTML = todosElement;
    todosFilter.innerHTML = foter;
  },

  addTodo:function(e){
    let value = this.value.trim();
    if(e.which !==13 || !value){
      return;
    }
    let todos = PAGE.data.todos;
    todos.push({
      title: value,
      completed:false
    })
    this.value = '';
    PAGE.render();
  },

  toggleTodo:function(e){
    let todos = PAGE.data.todos;
    let todoItem = e.target.parentNode;
    let index = todoItem.dataset.index;
    todos[index].completed = !todos[index].completed;
    PAGE.render();
  },

  removeTodo:function(e){
    let todos = PAGE.data.todos;
    let todoItem = e.target.parentNode;
    let index = todoItem.dataset.index;
    todos.splice(index,1);
    PAGE.render();
  },

  filterTodo:function(e){
    let filterItem = e.target;
    let filter = filterItem.dataset.id;
    PAGE.data.filter = Number(filter);
    PAGE.render();
  },
  
  filterRemoveTodo:function(){
    let todos = PAGE.data.todos;
    let todo = todos.filter(data => !data.completed);
    PAGE.data.todos = todo
    PAGE.render();
  }
}
PAGE.init();