import './App.css'
import {BrowserRouter, HashRouter, Route, Routes} from "react-router-dom";
import LoginPage from "./page/Login.jsx";
import {ThemeProvider} from "@/components/theme-provider.jsx";
import DashboardPage from "@/src/page/Dashboard.jsx";
import SignUpPage from "@/src/page/SignUp.jsx";
import AddFoodPage from "@/src/page/AddFood.jsx";

function App() {

  return (
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <HashRouter>
              <Routes>
                  <Route index element={<DashboardPage />} />
                  <Route path="/add" element={<AddFoodPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignUpPage />} />
              </Routes>
          </HashRouter>
      </ThemeProvider>
  )
}

export default App
