import express from "express";
import Assign from "../models/Assigned.js";
import User from "../models/Users.js";

const router = express.Router();
//create a statement

router.post("/assigntask", async (req, res) => {
  const newAssign = new Assign(req.body);
  const officer = await User.findOne({regNo: req.body.policeNumber})
  await officer.addCase(req.body.caseId)
  try {
    const savedTask = await newAssign.save();

    //   res.status(200).json(savedTask);
    res.redirect("/a-tables");
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("Assignment has been deleted");
        } catch (err) {
        return res.status(500).json(err);
        }
    } else {
        return res.status(403).json("Only admin can delete!");
    }
});

export default router;
