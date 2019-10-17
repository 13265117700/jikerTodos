const PAGE = {
  data:{
    todos:[{
      title:'代办一',
      completed:true
    },{
      title:'代办2',
      completed:false
    }],
    filters:{
      1:'全部',
      2:'待办',
      3:'已办'
    },
    filter:1,
    bobal:0,
  },
  init:function(){
    this.getTodos();
    this.bind();
    // this.render();
  },

  bind:function(){
    $('#todo-input').on('keyup',this.addTodo);
    $('#todos-list').on('click','.todo-item-hd',this.changeTodo);
    $('#todos-list').on('click','.todo-item-ft',this.removeTodo);
    $('#todos-filter').on('click', '.filter-item', this.switchTodo);
    $('#todos-filter').on('click', '.filter-remove-put', this.deletehTodo);
    $(window).on('unload',this.saveTodos);
  },

  getTodos:function(){
    let todos =localStorage.getItem('todos');
    todos = JSON.parse(todos) || [];
    PAGE.data.todos = todos;
    this.render();
  },
  
  saveTodos:function(){
    let todos = PAGE.data.todos;
    let todosStr = JSON.stringify(todos);
    localStorage.setItem('todos',todosStr);
  },

  render:function(){
    let todos = PAGE.data.todos;
    let filters = PAGE.data.filters;
    let filter = PAGE.data.filter;
    // console.log(filter)
    todos.forEach((data,index)=> data.index = index);
    let showTodos;
    if(filter === 2){
      showTodos = todos.filter(data => !data.completed);
    }else if(filter === 3){
      showTodos = todos.filter(data => data.completed);
    }else{
      showTodos = todos;
    }
    // console.log(showTodos)
    PAGE.data.bobal = showTodos.length;

    let todosElement = showTodos.map((data)=>{
      return `
        <div class="todo-item ${data.completed? 'active':''}" data-index= "${data.index}">
          <div class="todo-item-hd"></div>
          <div class="todo-item-bd">${data.title}</div>
          <div class="todo-item-ft">x</div>
        </div>
      `
    }).join('');
    // console.log(todosElement)

    let switchElement = Reflect.ownKeys(filters).map(key =>{
      return `
      <span class="filter-item ${filter == key? 'active':''}" data-id="${key}">${filters[key]}</span>
      `
    }).join('');
    // console.log(switchElement)

    let filterElement = `
      <div class="filter-count">
        <span class="filter-count-number">${PAGE.data.bobal}</span>
        <span class="filter-count-text">项目</span>
      </div>
      <div class="filter-list" id="filter-list">
        ${switchElement}
      </div>
      <div class="filter-remove" id="filter-remove">
        <span class="filter-remove-put" >删除已完成</span>
      </div>
    `
    // console.log(filterElement)
    $('#todos-list').html(todosElement);
    $('#todos-filter').html(filterElement)
  },

  addTodo:function(e){
    let value = this.value.trim();
    if(e.which !== 13 || !value){
      return;
    }
    let todos = PAGE.data.todos;
    todos.push({
      title:value,
      completed:false
    })
    PAGE.render();
    this.value = '';
    // console.log(value)
  },

  changeTodo:function(){
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
  switchTodo:function(e){
    let filterItem = e.target;
    // console.log(filterItem)
    let filter = filterItem.dataset.id;
    // console.log(filterItem.dataset.id)
    PAGE.data.filter = Number(filter);
    // console.log(PAGE.data.filter)
    PAGE.render();
  },
  deletehTodo:function(){
    let todos = PAGE.data.todos;
    let remove = todos.filter(data => !data.completed);
    PAGE.data.todos = remove;
    PAGE.render();
  }
}

PAGE.init();