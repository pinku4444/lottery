import express from 'express';
import gameController from './GameController';
import auth from '../../middleware/authenticate';
import checkPremium from '../../middleware/checkPremium';


const router = express.Router();

router.get('/genResult', gameController.saveResult);
router.get("/getNextDraw/:id", gameController.getNextDraw);
router.post("/saveData", auth, checkPremium, gameController.saveUserData);
router.get("/getUserData", auth, checkPremium, gameController.getUserData);
router.delete("/deleteGameData/:id", auth, checkPremium, gameController.deleteGameData);
router.delete("/deleteAllUserGameData", auth, checkPremium, gameController.deleteAllUserGameData);
router.put("/updateData/:draw_no", auth, checkPremium, gameController.updateUserGameData);




export default router;