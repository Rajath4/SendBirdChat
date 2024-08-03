import {
  Route,
  BrowserRouter as Router,
  Switch,
} from 'react-router-dom';
import { Flip, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/toast.override.css';
import CallPage from './components/pages/CallPage';
import LoginPage from './components/pages/LoginPage';



function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={LoginPage} />
        <Route path="/call" component={CallPage} />
        <Route path="/login" component={LoginPage} />
      </Switch>

      <ToastContainer
        position="bottom-left"
        autoClose={false}
        transition={Flip}
        hideProgressBar
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Router>
  );
}

export default App;
