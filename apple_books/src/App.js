import {BrowserRouter} from 'react-router-dom';
import Routes from './routes';
import {HeaderProvider} from './hooks/headerProvider';
import './App.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <HeaderProvider>
          <Routes />
        </HeaderProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
