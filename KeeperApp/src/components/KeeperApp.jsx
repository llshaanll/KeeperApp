import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";

function App() {
  const [note, setNote] = useState([]);

  useEffect(()=>{
    //Getting notes from database
    axios.get("http://localhost:3000/notes")
         //Upadting the UI
         .then((response)=>{setNote(response.data)})
         .catch((error)=>{console.log("Error fetching data from API", error.message);
         })
  }, []);

  function addNote(newNote) {
    setNote((prevValue) => {
      return [...prevValue, newNote];
    });
  }

  function onDelete(id) {
    //Updating the UI
    setNote((prevValue) => {
      return prevValue.filter((item) => {
        return item.id !== id;
      })
    })
    //Deleteing from Database
    axios.delete(`http://localhost:3000/notes/${id}`)
         .then(()=>{
          //Updating theUI
          setNote((prevValue) => {
            return prevValue.filter((item) => {
              return item.id !== id;
            })
          })
         })
         .catch((error)=>{console.log("Error deleting from database", error.message);
         })
  }
  return (
    <div>
      <Header />
      <CreateArea onAdd={addNote} />
      {note.map((item) => {
        return (
          <Note
            key={item.id}
            id={item.id}
            title={item.title}
            content={item.content}
            deleteNote={onDelete}
          />
        );
      })}
      <Footer />
    </div>
  );
}

export default App;
