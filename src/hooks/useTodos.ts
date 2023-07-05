import { useEffect, useState } from 'react';
import todoService, { Todo } from '../services/todoService';
import { CanceledError } from '../services/apiClient';

const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const { request, cancel } = todoService.getAll<Todo>();

    request
      .then((response) => {
        setTodos(response.data);
      })
      .catch((error) => {
        if (error instanceof CanceledError) return;
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });

    return cancel;
  }, []);

  return { todos, setTodos, error, setError, loading };
};

export default useTodos;
