import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import FetchHelper from "../FetchHelper";

function DeleteRecipe({ recipe, currentUser, onDelete, children }) {
  const [show, setShow] = useState(false);

  if (!recipe || !currentUser || !recipe.ownerId) return null;

  const isOwner = recipe.ownerId === currentUser.id;
  if (!isOwner) return null;

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setShow(true);
  };

  const confirmDelete = async (e) => {
    e.stopPropagation();
    const result = await FetchHelper.recipe.delete({ id: recipe.id });
    if (result.ok && onDelete) {
      onDelete(recipe.id);
    }
    setShow(false);
  };

  return (
    <>
      <span onClick={handleDeleteClick}>{children}</span>

      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete recipe</Modal.Title>
        </Modal.Header>

        <Modal.Body>Are you sure you want to delete this recipe?</Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Cancel
          </Button>

          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default DeleteRecipe;
