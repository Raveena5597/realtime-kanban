import React from "react";
import { useDraggable } from "@dnd-kit/core";
import socket from "../socket";

export default function TaskCard({ task, column }) {

    const { attributes, listeners, setNodeRef, transform } =
        useDraggable({
            id: task.id,
            data: { column }
        });

    const deleteTask = () => {

        socket.emit("deleteTask", {
            id: task.id,
            column: column
        });

    };

    const editTask = () => {

        const newTitle = prompt("Edit task title:", task.title);

        if (!newTitle) return;

        socket.emit("editTask", {
            id: task.id,
            column: column,
            title: newTitle
        });

    };

    const style = {
        transform: transform
            ? `translate(${transform.x}px, ${transform.y}px)`
            : undefined,
        background: "white",
        padding: 10,
        marginBottom: 10,
        borderRadius: 5
    };

    return (

        <div ref={setNodeRef} style={style} className="task-card">

            {/* Drag area */}
            <div
                {...listeners}
                {...attributes}
                style={{ cursor: "grab", marginBottom: 8 }}
            >
                {task.title}
            </div>

            {/* Buttons */}
            <div className="task-buttons">

                <button onClick={editTask} className="btn-edit">
                    Edit
                </button>

                <button onClick={deleteTask} className="btn-delete">
                    Delete
                </button>

            </div>

        </div>

    );
}