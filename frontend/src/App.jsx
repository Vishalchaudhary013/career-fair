import { BrowserRouter as Router } from "react-router-dom";
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css'; // Style component
import AppRoutes from "./routes/AppRoutes";

export { SERVER_URL } from "./config";

function App() {
  return (
     <Router>
       <AppRoutes />
     </Router>
  );
}

export default App;
