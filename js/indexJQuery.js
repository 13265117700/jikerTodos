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
    this.render();
    this.bind();
  },

  bind:function(){
    $('#todo-input').on('keyup',this.addTodo);
    $('#todos-list').on('click', '.todo-item-hd',this.toggleTodo);
    $('#todos-list').on('click', '.todo-item-ft',this.removeTodo);
    $('#todos-filter').on('click','.filter-item',this.filterTodo);
    $('#todos-filter').on('click','.filter-remove-put',this.removeMoreTodo);
    $(window).on('unload',this.saveTodos)
  },

  saveTodos:function(){
    let todos = PAGE.data.todos;
    let todosSrt = JSON.stringify(todos);
    localStorage.setItem('todos',todosSrt)
  },

  getTodos:function(){
    let todos = localStorage.getItem('todos');
    todos = JSON.parse(todos) || [];
    PAGE.data.todos = todos;
    PAGE.render();
  },

  render:function(){
    let todos = PAGE.data.todos;
    let filters = PAGE.data.filters;
    let filter = PAGE.data.filter;
    todos.forEach((data,index)=> data.index = index);

    let showTodo;
    switch(filter){
      case 2:
        showTodo = todos.filter(data => !data.completed);
        break;
      case 3:
        showTodo = todos.filter(data => data.completed);
        break;
      default:
        showTodo = todos;
        break;
    }
    console.log(showTodo)
    PAGE.data.total = showTodo.length;

    let todosElement = showTodo.map((data)=>{
      return `
      <div class="todo-item ${data.completed? 'active':''}" data-index = "${data.index}">
        <div class="todo-item-hd"></div>
        <div class="todo-item-bd">${data.title}</div>
        <div class="todo-item-ft">x</div>
      </div>
      `
    }).join('');

    let switchElement = Object.keys(filters).map(key =>{
      return `
      <span class="filter-item${ filter == key? 'active':''}" data-id ="${key}">
      ${filters[key]}
      </span>
      `
    }).join('');

    let filterElement = `
    <div class="filter-count">
      <span class="filter-count-number">${PAGE.data.total}</span>
      <span class="filter-count-text">项目</span>
    </div>
    <div class="filter-list" id="filter-list">
     ${switchElement}
    </div>
    <div class="filter-remove" id="filter-remove">
      <span class="filter-remove-put" >删除已完成</span>
    </div>
    `

    $('#todos-list').html(todosElement);
    $('#todos-filter').html(filterElement);
  },

  addTodo:function(e){
    console.log(123)
    let value = this.value.trim();
    if(e.which !==13 || !value){
      return;
    }
    let todos = PAGE.data.todos;
    let tmp = todos.find(function(data){
      return value == data.title
    })
    if(!tmp){
      todos.push({
        title:value,
        complete:false
      })
    }
    PAGE.render();
    this.value = '';
  },

  toggleTodo:function(){
    let todos = PAGE.data.todos;
    let index = $(this).parent().data('index');
    todos[index].completed = !todos[index].completed;
    PAGE.render();
  },

  removeTodo:function(){
    let todos = PAGE.data.todos;
    let index = $(this).parent().data('index');
    todos.splice(index,1);
    PAGE.render();
  },

  filterTodo:function(e){
    let filterItem = e.target;
    let filter = filterItem.dataset.id;
    PAGE.data.filter = Number(filter);
    PAGE.render();
  },

  removeMoreTodo:function(){
    let todos = PAGE.data.todos;
    let todo = todos.filter(data => !data.completed);
    PAGE.data.todos = todo;
    PAGE.render();
  }
}
PAGE.init();