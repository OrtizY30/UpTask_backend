import { Request, Response } from "express";
import Task from "../models/Task";

export class TasksController {
  static createTask = async (req: Request, res: Response) => {
    try {
      const task = new Task(req.body);
      task.project = req.project.id;
      req.project.tasks.push(task.id);

      await Promise.allSettled([task.save(), req.project.save()]);
      res.send("Tarea creada correctamente");
    } catch (error) {
      console.log(error);
    }
  };

  static getProjectTask = async (req: Request, res: Response) => {
    try {
      const task = await Task.find({ project: req.project.id }).populate(
        "project"
      );
      res.json(task);
    } catch (error) {
      res.status(500).json({ error: "Error de servidor" });
    }
  };

  static getTaskbyId = async (req: Request, res: Response) => {
    try {
      const task = await Task.findById(req.task.id)
        .populate({
          path: "completedBy.user",
          select: "name id email",
        })
        .populate({
          path: "notes",
          select: "content id createdAt task",
          populate: { path: "createdBy", select: "name id email" },
        });
      res.json(task);
    } catch (error) {
      res.status(500).json({ error: "Error de servidor" });
    }
  };

  static updateTask = async (req: Request, res: Response) => {
    try {
      req.task.name = req.body.name;
      req.task.description = req.body.description;

      await req.task.save();

      res.send("Tarea Actualizada Correctamente");
    } catch (error) {
      res.status(500).json({ error: "Error de servidor" });
    }
  };

  static deleteTask = async (req: Request, res: Response) => {
    try {
      req.project.tasks = req.project.tasks.filter(
        (task) => task.toString() !== req.task.id.toString()
      );

      await Promise.allSettled([req.task.deleteOne(), req.project.save()]);
      res.send("Tarea Eliminada Correctamente");
    } catch (error) {
      res.status(500).json({ error: "Error de servidor" });
    }
  };

  static updateStatus = async (req: Request, res: Response) => {
    try {
      const { status } = req.body;
      req.task.status = status;
      const data = {
        user: req.user.id,
        status,
      };
      req.task.completedBy.push(data);

      await req.task.save();
      res.send("Tarea Actualizada");
    } catch (error) {
      console.log({ error: error });
      res.status(500).json({ error: "Error de servidor" });
    }
  };
}
