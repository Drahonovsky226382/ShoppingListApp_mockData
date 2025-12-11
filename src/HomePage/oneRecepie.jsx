import { useNavigate } from "react-router-dom";
import { TiDeleteOutline } from "react-icons/ti";
import { FaArchive } from "react-icons/fa";
import { TiShoppingCart } from "react-icons/ti";
import FetchHelper from "../FetchHelper";
import DeleteRecipe from "./deleteRecepie";

function OneRecipe({ recipes, setRecipes, currentUser }) {
  const navigate = useNavigate();

  const handleDelete = async (id) => {
    setRecipes((prev) => prev.filter((r) => r.id !== id));

    await FetchHelper.recipe.delete({ id });
  };

  const handleArchive = async (e, id) => {
    e.stopPropagation();

    setRecipes((prev) =>
      prev.map((r) => (r.id === id ? { ...r, archived: true } : r))
    );

    await FetchHelper.recipe.update({ id, archived: true });
  };

  return (
    <div style={{ padding: 32 }}>
      <h2 className="mb-4">
        <TiShoppingCart /> My Recipes
      </h2>

      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {recipes
          .filter((recipe) => !recipe.archived)
          .filter((recipe) => recipe.ownerId === currentUser.id)
          .map((recipe) => {
            const isOwner = recipe.ownerId === currentUser.id;

            return (
              <div className="col" key={recipe.id}>
                <div
                  onClick={() => navigate(`/${recipe.slug}`)}
                  className="border rounded p-3 h-100 d-flex flex-column justify-content-between shadow-sm"
                  style={{ cursor: "pointer" }}
                >
                  <div>
                    <h5 className="mb-1">{recipe.recipeName}</h5>
                    <small className="text-muted">
                      Owner: {recipe.ownerName}
                    </small>
                  </div>

                  <div className="d-flex justify-content-end gap-3 mt-3">
                    {/* ARCHIVE */}
                    {isOwner && (
                      <FaArchive
                        onClick={(e) => handleArchive(e, recipe.id)}
                        style={{ fontSize: 24, cursor: "pointer" }}
                      />
                    )}

                    {/* DELETE */}
                    <DeleteRecipe
                      recipe={recipe}
                      currentUser={currentUser}
                      onDelete={handleDelete}
                    >
                      <TiDeleteOutline
                        style={{
                          fontSize: 26,
                          cursor: "pointer",
                          color: "red",
                        }}
                      />
                    </DeleteRecipe>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default OneRecipe;
