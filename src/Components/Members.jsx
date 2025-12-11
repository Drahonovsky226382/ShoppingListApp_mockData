import { TiDeleteOutline } from "react-icons/ti";

function Members({ owner, members = [], onRemove, deleteWarning }) {
  // Odstraníme ownera z members pole
  const otherMembers = members.filter((m) => m.id !== owner.id);

  return (
    <div>
      <h4 className="border-bottom border-dark pb-2 mb-3">
        <strong>Owner:</strong> <span>{owner.name}</span>
      </h4>

      <h4 className="fw-bold">Members:</h4>
      <div className="mt-3">
        {otherMembers.map((m) => (
          <div
            key={m.id}
            className="d-flex justify-content-between align-items-center border rounded p-2 mb-2"
          >
            <h7>{m.name}</h7>
            <TiDeleteOutline
              onClick={() => onRemove(m.id)}
              style={{ fontSize: "28px", cursor: "pointer", color: "red" }}
            />
          </div>
        ))}

        {deleteWarning && (
          <div style={{ color: "red", marginBottom: "10px" }}>
            {deleteWarning}
          </div>
        )}
      </div>
    </div>
  );
}

export default Members;
