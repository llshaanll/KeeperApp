import React, { useState } from "react";
import axios from "axios";

function CreateArea(props) {
  const [newNote, setNewNote] = useState({ title: "", content: "" });

  function handleChange(event) {
    const { name, value } = event.target;

    setNewNote((prevValue) => {
      return { ...prevValue, [name]: value };
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    axios.post("http://localhost:3000/notes", newNote)
         .then((response)=>{props.onAdd(response.data)})
         .catch((error)=>{console.log("Error posting data to the database", error.message);
         })
    setNewNote({ title: "", content: "" });
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          onChange={handleChange}
          name="title"
          placeholder="Title"
          value={newNote.title}
        />
        <textarea
          onChange={handleChange}
          name="content"
          placeholder="Take a note..."
          rows="3"
          value={newNote.content}
        />
        <button>Add</button>
      </form>
    </div>
  );
}

export default CreateArea;
