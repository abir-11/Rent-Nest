import { Router } from "express";
import { categoryController } from "./category.controller";


const router=Router();


router.post('/category',categoryController.createCategory);
router.get('/category',categoryController.getAllCategoris);


export const catagoryRouter=router;