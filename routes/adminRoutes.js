import express from "express";
import {
  createUser,
  getUsers,
  updateUser,
  deleteUser,
  unblockuser,
  blockuser,
} from "../controllers/user.js";
import { verifyAdmin } from "../middleware/verifyToken.js";

const router = express.Router();

//------------CRUD-----------//

router.post("/createUser", verifyAdmin, createUser);

router.get("/getUsers", verifyAdmin, getUsers);

router.put("/updateUser/:id", verifyAdmin, updateUser);

router.delete("/deleteUser/:id", verifyAdmin, deleteUser);

//------------BLOCK/UNBLOCK-----------//

router.put("/unblockUser/:id", verifyAdmin, unblockuser);

router.put("/blockUser/:id", verifyAdmin, blockuser);

export default router;
