import express from "express";

import {
    getUserById,
    addUser,
    deleteUser,
    getUserByEmail
} from "./database.js";

import cors from 'cors';
const corsOption= {
    origin: "http://127.0.0.1:5173",
    method: ["POST", "GET"],
    credentials: true,
};

const app = express ();
app.use(express.json());
app.use(cors(corsOption));


app.get("/perfil/:id", async (req,res)=>{
    const user = await getUserById(req.params.id);
    res.status(200).send(user);
});

app.delete("/user/:id",async (req,res)=> {
    await deleteUser(req.params.id);
    res.send({message: "User deleted succesfully"});
});

app.post("/user/register", async (req, res)=> {
    const  {name, email, password} = req.body;
    const user = await addUser(name,email,password);
    res.status(201).send(user);
});

app.listen(process.env.WEB_PORT, ()=> {
    console.log(`Server running on port ${process.env.WEB_PORT}`)
});

app.post("/user/login", async (req, res) => {
    const { email, password } = req.body;
    
    const user = await getUserByEmail(email);

    if (!user) {
        return res.status(404).send({ message: "User not found" });
    }

    if (user.password === password) {
        res.status(200).send({
            message: "Login successful",
            user: { id: user.id, name: user.name, email: user.email }
        });
    } else {
        res.status(401).send({ message: "Wrong Password" });
    }
});

