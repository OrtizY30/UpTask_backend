import { Router } from "express";
import { ProjectController } from "../controllers/ProjectController";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import { TasksController } from "../controllers/TaskController";
import { validateProjectExists } from "../middleware/project";
import {
  hasAuthorization,
  taskBelongsToProject,
  taskExist,
} from "../middleware/task";
import { authenticate } from "../middleware/auth";
import { TeamMemberController } from "../controllers/TeamController";
import { NoteController } from "../controllers/NoteController";

const router = Router();
router.param("projectId", validateProjectExists);

router.use(authenticate);

router.post(
  "/",
  body("projectName")
    .notEmpty()
    .withMessage("El nombre del Proyecto es obligatorio"),
  body("clientName")
    .notEmpty()
    .withMessage("El nombre del Cliente es obligatorio"),
  body("description")
    .notEmpty()
    .withMessage("La Descripcion del Proyecto es obligatorio"),
  handleInputErrors,
  ProjectController.createProject
);

router.get("/", ProjectController.getAllProjects);

router.get(
  "/:projectId",
  param("projectId").isMongoId().withMessage("ID no Válido"),
  handleInputErrors,
  ProjectController.getProjectById
);

router.put(
  "/:projectId",
  body("projectName")
    .notEmpty()
    .withMessage("El nombre del Proyecto es obligatorio"),
  body("clientName")
    .notEmpty()
    .withMessage("El nombre del Cliente es obligatorio"),
  body("description")
    .notEmpty()
    .withMessage("La Descripcion del Proyecto es obligatorio"),
  param("projectId").isMongoId().withMessage("ID no Válido"),
  handleInputErrors,
  hasAuthorization,
  ProjectController.updateProject
);

router.delete(
  "/:projectId",
  param("projectId").isMongoId().withMessage("ID no Válido"),
  handleInputErrors,
  hasAuthorization,
  ProjectController.deleteProject
);

// Routes for tasks

router.param("taskId", taskExist);
router.param("taskId", taskBelongsToProject);

router.post(
  "/:projectId/tasks",
  hasAuthorization,
  body("name").notEmpty().withMessage("El nombre de la tarea es obligatorio"),
  body("description")
    .notEmpty()
    .withMessage("La descripción de la tarea es obligatoria"),
  handleInputErrors,
  TasksController.createTask
);

router.get("/:projectId/tasks", TasksController.getProjectTask);

router.get(
  "/:projectId/tasks/:taskId",
  param("taskId").isMongoId().withMessage("ID no Válido"),
  handleInputErrors,
  TasksController.getTaskbyId
);

router.put(
  "/:projectId/tasks/:taskId",
  hasAuthorization,
  param("taskId").isMongoId().withMessage("ID no Válido"),
  body("name").notEmpty().withMessage("El nombre de la tarea es obligatorio"),
  body("description")
    .notEmpty()
    .withMessage("La descripción de la tarea es obligatoria"),
  handleInputErrors,
  TasksController.updateTask
);

router.delete(
  "/:projectId/tasks/:taskId",
  hasAuthorization,
  param("taskId").isMongoId().withMessage("ID no Válido"),
  handleInputErrors,
  TasksController.deleteTask
);

router.post(
  "/:projectId/tasks/:taskId/status",
  param("taskId").isMongoId().withMessage("ID no Válido"),
  body("status").notEmpty().withMessage("El estado es obligatorio"),
  handleInputErrors,
  TasksController.updateStatus
);

// Routes for Teams

router.post(
  "/:projectId/team/find",
  body("email").isEmail().toLowerCase().withMessage("Email no válido"),
  handleInputErrors,
  TeamMemberController.findMemberByEmail
);

router.get(
  "/:projectId/team",

  TeamMemberController.getProjectTeam
);

router.post(
  "/:projectId/team",
  body("id").isMongoId().withMessage("ID no valido"),
  handleInputErrors,
  TeamMemberController.addUserById
);

router.delete(
  "/:projectId/team/:userId",
  param("userId").isMongoId().withMessage("ID no valido"),
  handleInputErrors,
  TeamMemberController.removeMemberById
);

// Routes for Notes

export default router;

router.post(
  "/:projectId/tasks/:taskId/notes",
  body("content")
    .notEmpty()
    .withMessage("El contenido de la nota no puede ir vacío"),
  handleInputErrors,
  NoteController.createNote
);

router.get(
    "/:projectId/tasks/:taskId/notes",
    NoteController.getTaskNotes
  );

  router.delete(
    "/:projectId/tasks/:taskId/notes/:noteId",
    param('noteId').isMongoId().withMessage('ID no válido'),
    handleInputErrors,
    NoteController.deleteNote
)
