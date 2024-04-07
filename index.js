const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.sendFile(__dirname, "index.html");
});

app.post("/submit", (req, res) => {
  console.log(req.body);
  const { name, email, phone, datetime, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.ORG_EMAIL_USER,
      pass: process.env.ORG_EMAIL_PASS,
    },
  });

  const emailTemplate = `
        <p>Hii doctor, You have a new appointment request:</p>
        <ul>
            <li>Name: ${name}</li>
            <li>Email: ${email}</li>
            <li>Phone: ${phone}</li>
            <li>Preferred Date and Time: ${datetime}</li>
            <li>Message: ${message}</li>
        </ul>
    `;

  transporter.sendMail(
    {
      from: process.env.ORG_EMAIL_USER,
      to: process.env.DOCTOR_MAIL,
      subject: "New Appointment Request",
      html: emailTemplate,
    },
    (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        res.status(500).json({
          error: "An error occurred while sending the email",
          e: error,
        });
      } else {
        console.log("Email sent:", info.response);
        res
          .status(200)
          .json({ message: "Appointment request sent successfully" });
      }
    }
  );
});

app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});
