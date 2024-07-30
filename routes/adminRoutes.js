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
//TODO-ADD MIDDLEWARE TO VERIFY ADMIN(verifyAdmin) AFTER UDATING REQUESTS FROM FRONTEND WITH ADDING HEADER TOKEN
router.post("/createUser", createUser);

router.get("/getUsers", getUsers);

router.put("/updateUser/:id",updateUser);

router.delete("/deleteUser/:id", deleteUser);

//------------BLOCK/UNBLOCK-----------//

router.put("/unblockUser/:id", verifyAdmin, unblockuser);

router.put("/blockUser/:id", verifyAdmin, blockuser);

export default router;
