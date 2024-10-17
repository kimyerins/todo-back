const moongoose = require("mongoose");
const Schema = moongoose.Schema;

const taskSchema = Schema(
  {
    task: {
      type: String,
      required: true,
    },
    isComplete: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

const Task = moongoose.model("Task", taskSchema);

module.exports = Task;
