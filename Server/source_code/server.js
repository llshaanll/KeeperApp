import express from "express";
import pg from "pg";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

//Constant fields
const app = express();
const port = process.env.PORT || 3000;

//Passing credentials as object to database to gain access
const db = new pg.Client({
    user: process.env.DB_USER,
    host: process.env.HOST,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DB_PORT
});

//Establishing connection to database
db.connect().then(()=>{
    console.log("Successfully connected to database")
}).catch((error)=>{
    console.log("Error connecting to database: ", error.message)
});

//Middlewares
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());

//GET route
app.get("/notes", async (req, res)=>{
    try{
        const notes = await db.query("SELECT * FROM notes");
        res.json(notes.rows);
    }catch(error){
        res.status(500).send({meesage: "Error fetching data from database", error: error.message});
    }
});

//POST route
app.post("/notes", async (req, res)=>{
    const {title, content} = req.body;
    try{
        const newNote = await db.query("INSERT INTO notes (title, content) VALUES ($1, $2) RETURNING * ;", [title, content]);
        res.json(newNote.rows[0]);
    }catch(error){
        res.status(500).send({message: "Error creating new note", error: error.message});
    }
});

//DELETE route
app.delete("/notes/:id", async (req, res)=>{
    const id = req.params.id;
    try{
        await db.query("DELETE FROM notes WHERE id = $1;", [id]);
        res.json({message: "Note deleted successfully"});
    }catch(error){
        res.status(500).send({message: "Error deleting note", error: error.message});
    }
});

//Starting the server on PORT
app.listen(port, ()=>{
    console.log(`Server listening to port ${port}.`)
});