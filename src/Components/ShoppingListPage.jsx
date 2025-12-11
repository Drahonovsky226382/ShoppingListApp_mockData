import { useState, useEffect } from "react";
import ShoppingListHeader from "./ShoppingListHeader";
import AddItemForm from "./AddItemForm";
import AddMemberForm from "./AddMemberForm";
import { useUser } from "../user";
import { useParams, useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import FetchHelper from "../FetchHelper";
import PendingItem from "../PendingItem";

function ShoppingListPage() {
  const currentUser = useUser();
  const { recipeSlug } = useParams();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState(null);

  const [members, setMembers] = useState([]);
  const [membersStatus, setMembersStatus] = useState("pending");
  const [loadedMembersOnce, setLoadedMembersOnce] = useState(false);

  const [items, setItems] = useState([]);
  const [itemsStatus, setItemsStatus] = useState("pending");
  const [loadedItemsOnce, setLoadedItemsOnce] = useState(false);

  // LOAD RECIPE
  useEffect(() => {
    FetchHelper.recipe.get({ slug: recipeSlug }).then((res) => {
      if (res.ok) setRecipe(res.data);
      else navigate("/");
    });
  }, [recipeSlug, navigate]);

  const owner = recipe ? { id: recipe.ownerId, name: recipe.ownerName } : null;

  // LOAD MEMBERS
  const reloadMembers = () => {
    FetchHelper.member.list({ recipeSlug }).then((result) => {
      if (result.ok) {
        setMembers(result.data);
        setMembersStatus("ready");
        setLoadedMembersOnce(true);
      } else {
        setMembersStatus("error");
      }
    });
  };

  useEffect(() => {
    if (!recipe || loadedMembersOnce) return;
    setMembersStatus("pending");
    reloadMembers();
  }, [recipe, recipeSlug, loadedMembersOnce]);

  // LOAD ITEMS
  const reloadItems = () => {
    FetchHelper.item.list({ recipeSlug }).then((result) => {
      if (result.ok) {
        setItems(result.data);
        setItemsStatus("ready");
        setLoadedItemsOnce(true);
      } else {
        setItemsStatus("error");
      }
    });
  };

  useEffect(() => {
    if (!recipe || loadedItemsOnce) return;
    setItemsStatus("pending");
    reloadItems();
  }, [recipe, recipeSlug, loadedItemsOnce]);

  if (!recipe) return <PendingItem />;

  return (
    <div style={{ padding: 32 }}>
      <div
        onClick={() => navigate(-1)}
        style={{
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          marginBottom: "16px",
          fontSize: "1.5rem",
          gap: "8px",
        }}
      >
        <IoArrowBack />
        <span>Back</span>
      </div>

      <ShoppingListHeader recipe={recipe} currentUser={currentUser} />

      <div className="d-flex flex-column flex-md-row gap-4 mt-3">
        {/* MEMBERS */}
        <div className="flex-fill border border-dark rounded p-3">
          {membersStatus === "pending" && <PendingItem />}
          {membersStatus === "error" && <p>Failed to load members.</p>}

          {membersStatus === "ready" && (
            <AddMemberForm
              recipeSlug={recipeSlug}
              owner={owner}
              currentUser={currentUser}
              members={members}
              onMembersUpdate={reloadMembers}
            />
          )}
        </div>

        {/* ITEMS */}
        <div className="flex-fill border border-dark rounded p-3">
          {itemsStatus === "pending" && <PendingItem />}
          {itemsStatus === "error" && <p>Failed to load items.</p>}

          {itemsStatus === "ready" && (
            <AddItemForm
              recipeSlug={recipeSlug}
              items={items}
              onItemsUpdate={reloadItems}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default ShoppingListPage;
