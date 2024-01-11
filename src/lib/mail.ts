import nodemailer from "nodemailer";

export async function sendMail({
                                   to,
                                   name,
                                   subject,
                                   body
                               }: {
    to: string;
    name: string;
    subject: string;
    body: string
}) {
    const {SMTP_EMAIL, SMTP_PASSWORD, SMTP_HOST, SMTP_PORT} = process.env;

    const transport = nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT),
        secure: true,
        auth: {
            user: SMTP_EMAIL,
            pass: SMTP_PASSWORD,
        },
    });
    try {
        await transport.verify()
    } catch (error) {
        console.log(error)
    }

    try {
        await transport.sendMail({
            from: name + " <" + SMTP_EMAIL + ">",
            to,
            subject,
            html: body,
        })
    } catch (error) {
        console.log(error);
    }
}

export const sendVerificationEmail = async (email: string, token: string) => {
    const confirmLink = `http://localhost:3000/auth/new-verification?token=${token}`;

    await sendMail({
        to: email,
        name: "Mes Notes",
        subject: "Confirme ton email via le lien",
        body: `<p>Clique <a href="${confirmLink}">ici</a> pour confirmer ton email.</p>`
    })
}

export const sendPasswordResetEmail = async (email: string, token: string) => {
    const resetLink = `http://localhost:3000/auth/new-password?token=${token}`;

    await sendMail({
        to: email,
        name: "Mes Notes",
        subject: "Reset your password",
        body: `<p>Clique <a href="${resetLink}">ici</a> pour réinitialiser ton mot de passe.</p>`
    })
}