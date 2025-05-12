import { Request, Response } from "express";
import Project from "../models/Project";

export class ProjectController {
  static createProject = async (req: Request, res: Response) => {
    const project = new Project(req.body);

    // Asignar un maganer en el model Schma
    project.manager = req.user.id;

    try {
      await project.save();
      res.send("Proyecto Creado correctamente");
    } catch (error) {
      console.log(error);
      res.status(500).send("Error al crear el proyecto");
      return;
    }
  };

  static getAllProjects = async (req: Request, res: Response) => {
    try {
      const projects = await Project.find({
        $or: [
          { manager: { $in: req.user.id } },
          { team: { $in: req.user.id } },
        ],
      });
      res.json(projects);
      return;
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Error al obtener los proyectos" });
      return;
    }
  };

  static getProjectById = async (req: Request, res: Response) => {
    const { projectId } = req.params;
    try {
      const project = await Project.findById(projectId).populate("tasks");
      if (!project) {
        const error = new Error("Projecto no encontrado");
        res.status(400).json({
          error: error.message,
        });
        return;
      }
      if (
        project.manager.toString() !== req.user.id.toString() &&
        !project.team.includes(req.user.id)
      ) {
        const error = new Error("Acción no válida");
        res.status(404).json({
          error: error.message,
        });
        return;
      }
      res.json(project);
    } catch (error) {
      console.log(error);
    }
  };

  static updateProject = async (req: Request, res: Response) => {
    try {
      const project = req.project;
      project.clientName = req.body.clientName;
      project.projectName = req.body.projectName;
      project.description = req.body.description;

     

      await project.save();
      res.send("Proyecto Actualizado");
    } catch (error) {
      console.log(error);
    }
  };

  static deleteProject = async (req: Request, res: Response) => {
    try {
      await req.project.deleteOne();
      res.send("Proyecto Eliminado Correctamente");
    } catch (error) {
      console.log(error);
    }
  };
}
