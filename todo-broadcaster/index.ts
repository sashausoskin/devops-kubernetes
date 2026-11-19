import { connect } from "@nats-io/transport-node";
import axios from "axios";
import type { Todo } from "./types.js";

const destinationUrl = process.env.SERVICE_URL

const handleNewTodo = async (todo: Todo) => {
    destinationUrl && await axios.post(destinationUrl, {user: "bot", message: `A todo was created: ${todo.todo}`})
}

const handleTodoUpdate = async (todo: Todo) => {
    destinationUrl && await axios.post(destinationUrl, {user: "bot", message: `${todo.todo} has been done`})
}

const start = async () => {
  const nc = await connect({
    servers: process.env.NATS_URL || "nats://my-nats:4222",
  })

  nc.subscribe("todo_create", {
    queue: "todo.broadcaster.create.queue",
    callback: (err, msg) => {
      if (err) {
        console.error("Failed to receive todo created message", err)
        return
      }

      const todo = msg.json() as Todo
      console.log(
        `Received todo ${todo.todo}`,
      )

      handleNewTodo(todo).catch((e) => console.error("Couldn't send the message to external service:", e))
    },
  })

  nc.subscribe("todo_update", {
    queue: "todo.broadcaster.update.queue",
    callback: (err, msg) => {
      if (err) {
        console.error("Failed to receive todo updated message", err)
        return
      }

      const todo = msg.json() as Todo

      handleTodoUpdate(todo).catch((e) => console.error("Couldn't send the message to external service:", e))
    },
  })

  console.log("Broadcaster listening")
}

start().catch((err) => {
  console.error("Failed to connect to NATS", err)
  process.exit(1)
})