import mongoose from "mongoose";


const CaseSchema = mongoose.Schema(
    {
        offenderName: {
            type: String,
            require: true,
            min: 3,
            max: 25,
            unique: true,
        },
        offenderId: {
            type: Number,
            require: true,
            min: 8,
            // max: 20,
            unique: true,
        },
        offenderCrime: {
            type: String,
            require: true,
            min: 4,
            max:100,
        },
        victimName: {
            type: String,
            require: true,
            min: 3,
            max: 25,
            unique: true,
        },
        victimId: {
            type: Number,
            require: true,
            min: 3,
            // max: 20,
            unique: true,
        },
        statement: {
            type: String,
            require: true,
            min: 10,
            max: 2000,
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

var Case = mongoose.model("Case", CaseSchema)
export default Case;