import express from 'express';
import Case from "../models/Case.js";


const router = express.Router();
//create a statement

router.post("/add", async (req, res) => {
    const newStatement = new Case(req.body);
    try {
      const savedStatement = await newStatement.save();
      // res.status(200).json(savedStatement);

      res.redirect("/tables")
    } catch (err) {
      res.status(500).json(err);
    }
  });

  export default router;