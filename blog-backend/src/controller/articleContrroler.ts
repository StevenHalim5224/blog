import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import prisma from "../prisma";
import { AuthRequest } from "../middleWare/auth";
import { articleValidation } from "../schema/articleSchema";
import z from "zod";

export const createArticle = async (req: AuthRequest, res: Response) => {
  try {
    const validateData = articleValidation.parse(req.body);

    const authorId = req.user?.id;
    if (!authorId) {
      res.status(401).json({ message: "User not found" });
      return;
    }

    const newArticle = await prisma.article.create({
      data: {
        title: validateData.title,
        content: validateData.content,
        category: validateData.category,
        imageUrl: validateData.imageUrl!,
        prepTime: validateData.prepTime || null,
        difficulty: validateData.difficulty || null,
        authorId: authorId,
      },
    });

    res
      .status(201)
      .json({ message: "Article successfuly publish!", data: newArticle });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: "validation failed",
        errors: error.issues.map((e) => e.message),
      });
      return;
    }
    console.error("Error creating article:", error);
    res.status(500).json({ message: "failed to create article" });
  }
};

export const getAllArticle = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const skip = (page - 1) * limit;

    const article = await prisma.article.findMany({
      skip: skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },

      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    const totalArticle = await prisma.article.count();
    const totalPages = Math.ceil(totalArticle / limit);

    res.status(200).json({
      message: "success fetch all articles",
      data: article,
      meta: {
        curretPage: page,
        limit: limit,
        totalArticle: totalArticle,
        totalPages: totalPages,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "failed to fetch articles" });
  }
};

export const getArticleById = async (req: Request, res: Response) => {
  try {
    const articleId = req.params.id as string;

    const article = await prisma.article.findUnique({
      where: { id: articleId },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!article) {
      res.status(404).json({ message: "Article not found" });
      return;
    }

    res.status(200).json({
      message: "success fetch article detail",
      data: article,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "failed to fetch article" });
  }
};

export const updateArticle = async (req: AuthRequest, res: Response) => {
  try {
    const articleId = req.params.id as string;
    const validateData = articleValidation.parse(req.body);

    const userId = req.user?.id;

    const existingArticle = await prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!existingArticle) {
      res.status(404).json({ message: "Article not found" });
      return;
    }

    if (existingArticle.authorId !== userId) {
      res
        .status(403)
        .json({ message: "you are not authorized to edit this article" });
      return;
    }

    const updatedArticle = await prisma.article.update({
      where: { id: articleId },
      data: {
        title: validateData.title,
        content: validateData.content,
        category: validateData.category,
        imageUrl: validateData.imageUrl!,
        prepTime: validateData.prepTime || null,
        difficulty: validateData.difficulty || null,
      },
    });

    res.status(200).json({
      message: "Article successfully updated",
      data: updatedArticle,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: "Validation failed",
        errors: error.issues.map((e) => e.message),
      });
      return;
    }
  }
};

export const deleteArticle = async (req: AuthRequest, res: Response) => {
  try {
    const articleId = req.params.id as string;
    const userId = req.user?.id;

    const existingArticle = await prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!existingArticle) {
      res.status(404).json({ message: "Article not found" });
      return;
    }

    if (existingArticle.authorId !== userId) {
      res
        .status(403)
        .json({ message: "You are not authorized to edit this article" });
      return;
    }

    await prisma.article.delete({
      where: { id: articleId },
    });

    res.status(200).json({ message: "Article has been deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete article" });
  }
};
