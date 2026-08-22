import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import prisma from "../prisma";
import { registerValidation } from "../schema/userSchema";
import bcrypt from "bcrypt";
import z from "zod";
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail";

export const getUser = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json({
      message: "successfully retrieved users",
      data: users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "failed to retrieve users" });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const validateData = registerValidation.parse(req.body);
    const existingUser = await prisma.user.findUnique({
      where: { email: validateData.email },
    });
    if (existingUser) {
      res.status(400).json({ message: "user already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(validateData.password, 10);

    const newUser = await prisma.user.create({
      data: {
        name: validateData.name,
        email: validateData.email,
        password: hashedPassword,
      },
    });

    res.status(201).json({ message: "Register successful", data: newUser });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: "Validation failed",
        errors: error.issues.map((e) => e.message),
      });
      return;
    }
  }
  res.status(500).json({message: "Server error"});
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const findUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!findUser) {
      res.status(404).json({ message: "user not found" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, findUser.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: "invalid password" });
      return;
    }

    const token = jwt.sign(
      { id: findUser.id, email: findUser.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" },
    );

    res.status(200).json({
      message: "login successful",
      token: token,
      data: {
        id: findUser.id,
        email: findUser.email,
        name: findUser.name,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
};


export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      res.status(404).json({ message: "user not found" });
      return;
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    const tokenExpired = new Date(Date.now() + 15 * 60 * 1000);

    await prisma.user.update({
      where: {email},
      data: {
        resetPasswordToken: resetToken,
        resetPasswordTokenExpired: tokenExpired,
      }
    })

   const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3001";

   const resetUrl = `${frontendUrl}/reset-password?token = ${resetToken}`;

    const message = `
    <h2> Reset Your Password </h2>
    <p>hello ${user.name}, you requested to reset your password account</p>
    <a href="${resetUrl}" style="background-color: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; display inline-block;">Reset Password</a>
    <p> this link will expire in 15 minutes</p>
    <p>if you did not request this, please ignore this email</p>
    `;

    await sendEmail({
      email: user.email,
      subject: "Reset Your Password",
      message: message,
    })

    res.status(200).json({message: "Password reset link sent to your email"})
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
}

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const {token, newPassword} = req.body;

    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: token,

        resetPasswordTokenExpired: {
          gte: new Date(),
        }
      }
    });
    if(!user) {
      res.status(400).json({message:"session has been expired!"})
      return;
    }
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: {id: user.id},
      data: {
        password: hashedNewPassword,
        resetPasswordToken: null,
        resetPasswordTokenExpired: null,
      },
    });
    res.status(200).json({message:"password has changed"})
  } catch (error) {
    console.error(error);
    res.status(500).json({message:"something wrong"})
  }
}