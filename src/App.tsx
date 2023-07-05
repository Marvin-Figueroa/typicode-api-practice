import { BsTrash3Fill } from 'react-icons/bs';
import { MdAddTask } from 'react-icons/md';
import { FiEdit3 } from 'react-icons/fi';
import useTodos from './hooks/useTodos';
import todoService from './services/todoService';

function App() {
  const { todos, setTodos, error, setError, loading } = useTodos();

  const handleDelete = (id: number) => {
    const todosCopy = [...todos];

    // Update the UI first - Optimistic Update
    setTodos(todos.filter((todo) => todo.id !== id));

    // Send the request to the server
    todoService.delete(id).catch((error) => {
      setError(error.message);
      // Revert the UI back to the original state
      setTodos(todosCopy);
    });
  };

  const handleCreate = () => {
    const originalTodos = [...todos];

    const newTodo = {
      id: Math.floor(Math.random() * 1000),
      title: 'New Todo',
      userId: 1,
      completed: false
    };

    // Update the UI first - Optimistic Update
    setTodos([newTodo, ...todos]);

    // Send the request to the server
    todoService
      .create(newTodo)
      .then((response) => {
        setTodos([response.data, ...todos]);
      })
      .catch((error) => {
        setError(error.message);
        // Revert the UI back to the original state
        setTodos(originalTodos);
      });
  };

  const handleUpdate = (id: number) => {
    const originalTodos = [...todos];

    const updatedTodo = {
      id,
      title: 'Updated Todo',
      userId: 1,
      completed: true
    };

    // Update the UI first - Optimistic Update
    setTodos(todos.map((todo) => (todo.id === id ? updatedTodo : todo)));

    // Send the request to the server
    todoService.update(updatedTodo).catch((error) => {
      setError(error.message);
      // Revert the UI back to the original state
      setTodos(originalTodos);
    });
  };

  return (
    <div className='mx-auto w-75 text-center my-5'>
      <div className='d-flex justify-content-between align-items-center mb-4'>
        <h1 className='text-danger'>Todos</h1>
        <button
          onClick={() => handleCreate()}
          type='button'
          className='btn btn-success'>
          <MdAddTask />
        </button>
      </div>
      {loading && <div className='spinner-border m-5' role='status'></div>}
      {error && (
        <div className='alert alert-danger' role='alert'>
          {error}
        </div>
      )}
      <ul className='list-group'>
        {todos.map((todo) => (
          <li
            className='rounded gap-3 list-group-item my-2 bg-secondary text-white d-flex justify-content-between align-items-center'
            key={todo.id}>
            {todo.title}
            <div className='d-flex gap-2'>
              <button
                onClick={() => handleUpdate(todo.id)}
                type='button'
                className='btn btn-warning'>
                <FiEdit3 />
              </button>
              <button
                onClick={() => handleDelete(todo.id)}
                type='button'
                className='btn btn-danger'>
                <BsTrash3Fill />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

