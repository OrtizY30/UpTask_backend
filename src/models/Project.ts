import mongoose, { Schema, Document, PopulatedDoc, Types} from "mongoose";
import Task, { ITask } from "./Task";
import { IUser } from "./User";
import Note from "./Note";

// Modelo de Interface typeScript 
export interface IProject extends Document  {
    projectName: string;
    clientName: string;
    description: string;
    tasks: PopulatedDoc<ITask & Document>[];
    manager: PopulatedDoc<IUser & Document>
    team: PopulatedDoc<IUser & Document>[]

}

const ProjectSchema : Schema = new Schema({
    projectName: {
        type: String,
        required: true,
        trim: true
    },
    clientName: {
        type: String,
        required: true,
        trim: true,

    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    tasks: [
        {
            type: Types.ObjectId,
            ref: 'Task'
        }
    ],
    manager: {
          type: Types.ObjectId,
            ref: 'User'
    },
    team: [
        {
            type: Types.ObjectId,
            ref: 'User'
        }
    ],
    // timestams sirve para guardar una fecha de creación y actualización del documento
}, {timestamps: true})

// Middleware
ProjectSchema.pre('deleteOne', {document: true}, async function() {
    const projectId = this._id
    
    if(!projectId) return
    const tasks = await Task.find({project: projectId})
    for(const task of tasks ){
        await Note.deleteMany({task: task.id})
    }
    await Task.deleteMany({project: projectId})
})

// project es el nombre del modelo y ProjectSchema es el esquema que se va a usar para crear el modelo
// mongoose.model<tipo de documento>(nombre del modelo, esquema)

const Project = mongoose.model<IProject>('Project', ProjectSchema)

export default Project;

