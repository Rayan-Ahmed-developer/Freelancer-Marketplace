import mongoose,{ models } from "mongoose";

const projectSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    budget:{
        type:Number,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    skillsRequired:[{
        type:String
    }],
    experienceLevel:{
        type:String,
        enum:["beginner","intermediate","expert"],
        required:true
    }, 
    deliveryTime:{
        type:String,
        default:'1 to 4 months'
    },       
    status:{
        type:String,
        enum:["open","in progress","completed","canceled"],
        default:"open"
    },
    client:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",         
        required:true
    },

},{
    timestamps:true
})

export const Projects  = models.Projects || mongoose.model("Projects", projectSchema)