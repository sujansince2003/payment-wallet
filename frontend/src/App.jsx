import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
  Signup,
  Home,
  Signin,
  Dashboard,
  Sendmoney,
} from "./Components/index.js";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Signin />} />
          <Route path="/transfer" element={<Sendmoney />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
