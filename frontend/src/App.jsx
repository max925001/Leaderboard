import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { RouterProvider } from 'react-router-dom';
import { store } from './redux/store';
import router from './router';

export default function App() {
  return (
    <Provider store={store}>
      <Toaster position="top-right" />
      <RouterProvider router={router} />
    </Provider>
  );
}