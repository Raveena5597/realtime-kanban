const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const pool = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

let tasks = {
    todo: [],
    inprogress: [],
    done: []
};


// Load tasks from PostgreSQL when server starts
async function loadTasks() {

    const result = await pool.query("SELECT * FROM tasks");

    tasks = {
        todo: [],
        inprogress: [],
        done: []
    };

    result.rows.forEach(task => {

        tasks[task.column_name].push({
            id: task.id,
            title: task.title,
            updatedAt: task.updated_at
        });

    });

}

loadTasks();


// Socket connection
io.on("connection", (socket) => {

    console.log("User connected");

    // Send tasks to new client
    socket.emit("loadTasks", tasks);


    // Create Task
    socket.on("createTask", async (task) => {

        const newTask = {
            id: uuidv4(),
            title: task.title,
            updatedAt: Date.now()
        };

        await pool.query(
            "INSERT INTO tasks(id,title,column_name,updated_at) VALUES($1,$2,$3,$4)",
            [newTask.id, newTask.title, "todo", newTask.updatedAt]
        );

        tasks.todo.push(newTask);

        io.emit("tasksUpdated", tasks);

    });


    // Edit Task
    socket.on("editTask", async ({ id, column, title }) => {

        const updatedAt = Date.now();

        await pool.query(
            "UPDATE tasks SET title=$1, updated_at=$2 WHERE id=$3",
            [title, updatedAt, id]
        );

        tasks[column] = tasks[column].map(task =>
            task.id === id ? { ...task, title, updatedAt } : task
        );

        io.emit("tasksUpdated", tasks);

    });


    // Delete Task
    socket.on("deleteTask", async ({ id, column }) => {

        await pool.query(
            "DELETE FROM tasks WHERE id=$1",
            [id]
        );

        tasks[column] = tasks[column].filter(task => task.id !== id);

        io.emit("tasksUpdated", tasks);

    });


    // Move Task between columns
    socket.on("updateTasks", async (updatedTasks) => {

        tasks = updatedTasks;

        // Update DB for each task
        for (const column of Object.keys(tasks)) {

            for (const task of tasks[column]) {

                await pool.query(
                    "UPDATE tasks SET column_name=$1, updated_at=$2 WHERE id=$3",
                    [column, Date.now(), task.id]
                );

            }

        }

        io.emit("tasksUpdated", tasks);

    });


    socket.on("disconnect", () => {
        console.log("User disconnected");
    });

});


server.listen(5000, () => {
    console.log("Server running on port 5000");
});