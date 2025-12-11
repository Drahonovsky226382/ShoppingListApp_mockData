import { useEffect, useState } from "react";
import { useUser } from "../user";
import FetchHelper from "../FetchHelper";
import PendingItem from "../PendingItem";
import OneRecipe from "./oneRecepie";
import AddRecipe from "./addRecepie";

function HomePage() {
  const currentUser = useUser();
  const [recipes, setRecipes] = useState([]);
  const [status, setStatus] = useState("pending");
  const [error, setError] = useState("");

  const reload = () => {
    setStatus("pending");
    FetchHelper.recipe.list().then((result) => {
      if (result.ok) {
        setRecipes(result.data);
        setStatus("ready");
      } else {
        setError("Failed to load recipes");
        setStatus("error");
      }
    });
  };

  useEffect(() => {
    reload();
  }, []);

  if (status === "pending") return <PendingItem />;
  if (status === "error") return <p>{error}</p>;

  return (
    <>
      <OneRecipe
        recipes={recipes}
        setRecipes={setRecipes}
        currentUser={currentUser}
      />
      <AddRecipe currentUser={currentUser} onAdded={reload} />
    </>
  );
}

export default HomePage;
