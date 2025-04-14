import { RouterProvider } from 'react-router-dom';
import Logo from './assets/images/ITKotoba.png'
import router from './routers';

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
