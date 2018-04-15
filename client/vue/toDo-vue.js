Vue.component('todo-content', {
  name: 'todo-content',
  template: `
  <div>
      <!-- To Do List Item  -->
      <div class="container" v-if="todo_lists && todo_lists.length">
        <h2>Your To Do List: </h2>
        <div class="row">
          <div class="col-sm-4" v-for="(toDoList, index ) in todo_lists">
            <div class="panel panel-primary" data-toggle="popover"  title="Click the title to edit To Do">
              <div class="panel-heading" @click="set_todo(toDoList)">
                <button type="button" @click="delete_todo(toDoList)" data-toggle="popover"  title="Delete To Do" class="close">&times;</button>
                <div data-toggle="modal" data-target="#editToDoModal">{{ toDoList.title}}</div>
              </div>
              <div class="panel-body" style="overflow: auto;">{{ toDoList.content }}</div>
              <!-- kalo sempet tambah kapan di bikin ny (created At)  -->
              <div class="panel-footer text-right">
                <label class="switch" data-toggle="popover" title="Change Status" >
                  <input type="checkbox" :id="toDoList._id" @click="update_todo_status(toDoList, index)" :checked="toDoList.completed">
                  <span class="slider round"></span>
                </label>
                <!-- <button class="btn btn-default">Ceklist</button> -->
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Edit To Do List -->
        <div class="modal fade" id="editToDoModal" role="dialog" >
          <div class="modal-dialog" style="width:50%;">
            <div class="modal-content">
              <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal">&times;</button>
                <h4 class="modal-title">Edit To Do</h4>
              </div>
              <div class="modal-body form-group">
                <label for="editTitle">Title :</label>
                <input type="text" class="form-control" :value="edit_todo.title" id="editTitle">
                <label for="editContent">Details :</label>
                <textarea class="form-control" rows="4" id="editContent" :value="edit_todo.content" style="resize: none;"></textarea>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-default" @click="update_todo(edit_todo)">Edit</button>
                <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
              </div>
            </div>
          </div>
        </div>


      </div><br><br>
    </div>


  `,
  props: ['todo_lists', 'edit_todo'],
  // data: function(){
  //   return {
  //     toDoLists:[],
  //     editToDo:{}
  //   }
  // },
  methods: {
    set_todo: function(objData){
      let payload = objData

      this.$emit('set_todo', payload)
    },
    update_todo: function(objData){
      let toDo_id = objData._id
      let title = $('#editTitle').val()
      let content = $('#editContent').val()
      let payload = {
        toDo_id,
        title,
        content
      }
      this.$emit('update_todo', payload)

    },
    update_todo_status: function(objData, index){
      let toDo_id = objData._id
      let toDo_status = $(`#${toDo_id}`).prop('checked')
      let payload = {
        _id:toDo_id,
        toDo_status,
        index
      }
      this.$emit('update_todo_status', payload)
    },
    delete_todo: function(objData){
      let toDo_id = objData._id
      let toDo_title = objData.title
      let payload = {
        _id:toDo_id,
        title:toDo_title
      }
      this.$emit('delete_todo', payload)

    }

  }
})
