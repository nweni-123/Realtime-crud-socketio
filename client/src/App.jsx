import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./App.css";

const socket = io("http://localhost:3000");

function App() {
  const [formInputs, setFormInputs] = useState({
    name: "",
    age: "",
    phone: "",
  });
  const [crudData, setCrudData] = useState([]);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    socket.on("crudData", (data) => {
      setCrudData(data);
    });

    return () => {
      socket.off("crudData");
    };
  }, []);

  const handleInput = (event) => {
    const { name, value } = event.target;
    setFormInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formInputs.name || !formInputs.age || !formInputs.phone) return;

    socket.emit("data", formInputs);
    setFormInputs({ name: "", age: "", phone: "" });
  };

  const getEditData = (item) => {
    setFormInputs(item);
    setIsEdit(true);
  };

  const handleEdit = (e) => {
    e.preventDefault();
    if (!formInputs.name || !formInputs.age || !formInputs.phone) return;

    socket.emit("editData", formInputs);
    setIsEdit(false);
    setFormInputs({ name: "", age: "", phone: "" });
  };

  const handleDelete = (id) => {
    socket.emit("deleteData", id);
  };

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>CRUD Operations</h1>

      <form
        onSubmit={isEdit ? handleEdit : handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.75rem",
        }}
      >
        <input
          type="text"
          name="name"
          placeholder="Enter your name"
          value={formInputs.name}
          onChange={handleInput}
          style={{ padding: "0.4rem", width: "220px" }}
        />
        <input
          type="number"
          name="age"
          placeholder="Enter your age"
          value={formInputs.age}
          onChange={handleInput}
          style={{ padding: "0.4rem", width: "220px" }}
        />
        <input
          type="text"
          name="phone"
          placeholder="Enter your phone number"
          value={formInputs.phone}
          onChange={handleInput}
          style={{ padding: "0.4rem", width: "220px" }}
        />
        <button type="submit" style={{ padding: "0.45rem 1rem" }}>
          {isEdit ? "Edit Data" : "Add Data"}
        </button>
      </form>

      {crudData.length > 0 && (
        <table
          border="1"
          cellPadding="8"
          style={{ margin: "1.5rem auto", borderCollapse: "collapse" }}
        >
          <thead>
            <tr>
              <th>Name</th>
              <th>Age</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {crudData.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.age}</td>
                <td>{item.phone}</td>
                <td>
                  <button
                    onClick={() => getEditData(item)}
                    style={{ marginRight: "0.4rem" }}
                  >
                    Edit
                  </button>
                  <button onClick={() => handleDelete(item.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;