import { Router } from "express";
import { createArticle, deleteArticle, getAllArticle, getArticleById, updateArticle } from "../controller/articleContrroler";
import { verifyToken } from "../middleWare/auth";

const router = Router()

router.get('/', getAllArticle);
router.get('/:id', getArticleById)

router.post('/', verifyToken ,createArticle);
router.put('/:id', verifyToken, updateArticle)
router.delete('/:id', verifyToken, deleteArticle)
export default router