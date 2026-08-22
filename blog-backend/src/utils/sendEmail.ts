import nodemailer from "nodemailer";
interface EmailOptions{
    email: string;
    subject: string;
    message: string;
}

export const sendEmail = async (options: EmailOptions) => {
    console.log("cek Email user", process.env.EMAIL_USER ? "ada" : "kosong")
    console.log("cek Email pass", process.env.EMAIL_PASS ? "ada" : "kosong")
    const transporter = nodemailer.createTransport({
        service:'gmail',
        port: 465,
        secure: true,
        auth:{
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: '" Blog App Admin" <${YOUR_EMAIL_ADDRESS}>',
        to: options.email,
        subject: options.subject,
        html: options.message,
    };

    await transporter.sendMail(mailOptions);
}  
