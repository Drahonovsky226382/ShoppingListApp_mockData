import "./App.css";
import { Routes, Route } from "react-router-dom";
import { UserProvider, UserSelector } from "./user";
import HomePage from "./HomePage/HomePage";
import ShoppingListPage from "./Components/ShoppingListPage";
import Archived from "./HomePage/archivedRecipes";

function App() {
  return (
    <UserProvider>
      <div style={{ padding: 16 }}>
        <UserSelector />
      </div>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/archived" element={<Archived />} />
        <Route path="/:recipeSlug" element={<ShoppingListPage />} />
      </Routes>
    </UserProvider>
  );
}

export default App;
