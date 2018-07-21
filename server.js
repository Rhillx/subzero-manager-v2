const express = require('express');

const app = express();

const port = 5000;


app.get('/api/users', (req, res)=>{
    const users = [
        {id:1, username: "rhillx"},
        { id: 2, username: "Goon" },
        { id: 3, username: "Euro" },
        {id: 4, username: "Brad"}
    ];

    res.json(users)
});


app.listen(port, ()=> console.log(`server started on port ${port}`));