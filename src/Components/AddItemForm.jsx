import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import MyItems from "./MyItem";
import { BsToggleOn, BsToggleOff } from "react-icons/bs";
import FetchHelper from "../FetchHelper";

function AddItemForm({ recipeSlug, items, onItemsUpdate }) {
  const [show, setShow] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [showOnlyUnchecked, setShowOnlyUnchecked] = useState(false);

  const handleClose = () => setShow(false);

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    await FetchHelper.item.create({
      recipeSlug,
      name: newItemName,
      checked: false,
    });

    setNewItemName("");
    handleClose();
    onItemsUpdate();
  };

  const handleToggle = async (id) => {
    const item = items.find((i) => i.id === id);

    await FetchHelper.item.update({
      recipeSlug,
      id,
      checked: !item.checked,
    });

    onItemsUpdate();
  };

  const handleRemoveItem = async (id) => {
    await FetchHelper.item.delete({ recipeSlug, id });
    onItemsUpdate();
  };

  const filteredItems = showOnlyUnchecked
    ? items.filter((i) => !i.checked)
    : items;

  return (
    <div>
      <MyItems
        items={filteredItems}
        onToggle={handleToggle}
        onRemove={handleRemoveItem}
      />

      {/* Add Item Button */}
      <div className="text-center mt-3">
        <Button onClick={() => setShow(true)}>Add item</Button>
      </div>

      {/* Modal */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add item</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form onSubmit={handleAddItem}>
            <Form.Group>
              <Form.Control
                type="text"
                placeholder="Enter item"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                autoFocus
              />
            </Form.Group>

            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button variant="primary" type="submit">
                Add
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Toggle unchecked */}
      <span
        className="mb-3 me-2"
        style={{
          cursor: "pointer",
          fontSize: "1.8rem",
          color: showOnlyUnchecked ? "grey" : "green",
        }}
        onClick={() => setShowOnlyUnchecked(!showOnlyUnchecked)}
      >
        {showOnlyUnchecked ? <BsToggleOff /> : <BsToggleOn />}
      </span>
    </div>
  );
}

export default AddItemForm;
