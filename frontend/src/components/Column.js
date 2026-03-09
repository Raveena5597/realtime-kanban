import React from "react";
import { useDroppable } from "@dnd-kit/core";
import TaskCard from "./TaskCard";

export default function Column({ id, title, tasks }) {

    const { setNodeRef } = useDroppable({
        id
    });

    return (

        <div
            ref={setNodeRef}
            className="column"
        >

            <h2 className="column-title">{title}</h2>
            {tasks.map(task => (
                <TaskCard key={task.id} task={task} column={id} />
            ))}

        </div>
    )
}