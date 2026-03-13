import { BrowserRouter } from "react-router-dom";
import Header from "./components/Header";
import AppRouter from "./router/AppRouter";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <AppRouter />
    </BrowserRouter>
  );
}

export default App ; 