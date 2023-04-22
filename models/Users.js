import mongoose from "mongoose";


const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
      min: 3,
      max: 20,
      unique: true,
    },
    name2: {
      type: String,
      require: true,
      min: 3,
      max: 20,
      unique: true,
    },
    regNo: {
      type: String,
      require: true,
      min: 3,
      max: 6,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
      min: 6,
    },
    officerCases: {
      type: [String],
    },
  },
  { timestamps: true }
);

UserSchema.methods.addCase = function (caseCode) {
  this.officerCases.push(caseCode);
  return this.save();
};

const User = mongoose.model("User", UserSchema);
export default User;
