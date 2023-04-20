import mongoose from "mongoose";


const AssignedSchema = mongoose.Schema(
    {
        policeNumber: {
            type: String,
            require: true,
            min: 4,
            max: 25,
        },
        caseId: {
            type: String,
            require: true,
            min: 4,
            max: 10,
            unique: true,
        },
        isClosed: {
            type: Boolean,
            default: false
        }
    },
    {timestamps: true}
)

var Assign = mongoose.model("Assign", AssignedSchema)
export default Assign;