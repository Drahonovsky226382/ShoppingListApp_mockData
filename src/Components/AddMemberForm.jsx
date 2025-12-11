import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Members from "./Members";
import FetchHelper from "../FetchHelper";

function AddMemberForm({
  recipeSlug,
  owner,
  currentUser,
  members,
  onMembersUpdate,
}) {
  const [show, setShow] = useState(false);
  const [newMemberName, setNewMemberName] = useState("");
  const [warning, setWarning] = useState("");
  const [deleteWarning, setDeleteWarning] = useState("");

  const handleClose = () => {
    setWarning("");
    setNewMemberName("");
    setShow(false);
  };

  const handleAddMember = async (e) => {
    e.preventDefault();

    if (currentUser.id !== owner.id) {
      setWarning("Only the owner can add members.");
      return;
    }

    if (!newMemberName.trim()) return;

    const newMember = {
      id: Date.now().toString(),
      name: newMemberName,
      ownerId: owner.id,
      userId: null,
    };

    await FetchHelper.member.create({ recipeSlug, member: newMember });

    handleClose();
    onMembersUpdate();
  };

  const handleRemoveMember = async (memberId) => {
    if (currentUser.id !== owner.id && memberId !== currentUser.id) {
      setDeleteWarning("Only the owner can remove members.");
      return;
    }

    await FetchHelper.member.delete({ recipeSlug, memberId });
    onMembersUpdate();
  };

  return (
    <>
      <Members
        owner={owner}
        members={members}
        onRemove={handleRemoveMember}
        deleteWarning={deleteWarning}
      />

      <div className="text-center mt-2">
        <Button onClick={() => setShow(true)}>Add member</Button>
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Member</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {warning && (
            <div style={{ color: "red", marginBottom: 10 }}>{warning}</div>
          )}

          <Form onSubmit={handleAddMember}>
            <Form.Group>
              <Form.Control
                type="text"
                placeholder="Enter name"
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                autoFocus
              />
            </Form.Group>

            <Modal.Footer>
              <Button onClick={handleClose}>Close</Button>
              <Button type="submit" variant="primary">
                Add
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default AddMemberForm;
