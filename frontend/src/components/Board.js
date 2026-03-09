import React, { useState, useEffect } from "react";
import Column from "./Column";
import socket from "../socket";
import { DndContext, closestCenter } from "@dnd-kit/core";

const initialData = {
    todo: [],
    inprogress: [],
    done: []
};

export default function Board() {

    const [tasks, setTasks] = useState(initialData);
    const [input, setInput] = useState("");
    const actionQueue = React.useRef([]);

    useEffect(() => {

        socket.on("connect", () => {

            console.log("Reconnected");

            // replay queued actions
            actionQueue.current.forEach(action => {
                socket.emit(action.event, action.payload);
            });

            actionQueue.current = [];

        });

    }, []);

    useEffect(() => {

        socket.on("loadTasks", (serverTasks) => {
            setTasks(serverTasks);
        });

        socket.on("tasksUpdated", (serverTasks) => {
            setTasks(serverTasks);
        });

        return () => {
            socket.off("loadTasks");
            socket.off("tasksUpdated");
        };

    }, []);


    const addTask = () => {

        if (!input.trim()) return;

        const payload = { title: input };

        if (socket.connected) {
            socket.emit("createTask", payload);
        } else {
            actionQueue.current.push({
                event: "createTask",
                payload
            });
        }

        setInput("");

    };

    const handleDragEnd = (event) => {

        const { active, over } = event;

        if (!over) return;

        const sourceColumn = active.data.current.column;
        const targetColumn = over.id;

        if (sourceColumn === targetColumn) return;

        const task = tasks[sourceColumn].find(t => t.id === active.id);

        const newSourceTasks =
            tasks[sourceColumn].filter(t => t.id !== active.id);

        const newTargetTasks =
            [...tasks[targetColumn], task];

        const updatedTasks = {
            ...tasks,
            [sourceColumn]: newSourceTasks,
            [targetColumn]: newTargetTasks
        };

        setTasks(updatedTasks);

        if (socket.connected) {
            socket.emit("updateTasks", updatedTasks);
        } else {
            actionQueue.current.push({
                event: "updateTasks",
                payload: updatedTasks
            });
        }
    };

    return (

        <div>

            {/* Add Task Area */}
            <div className="input-area">

                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Add new task"
                    className="input-box"
                />

                <button
                    onClick={addTask}
                    className="btn-add"
                >
                    Add
                </button>

            </div>

            {/* Board */}
            <DndContext
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >

                <div className="board-container">

                    <Column id="todo" title="To Do" tasks={tasks.todo} />
                    <Column id="inprogress" title="In Progress" tasks={tasks.inprogress} />
                    <Column id="done" title="Done" tasks={tasks.done} />

                </div>

            </DndContext>

        </div>

    );
}