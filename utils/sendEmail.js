const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");

const sendEmail = async (email, subject, payload, template) => {
  try {
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      port: 465,
      secure: process.env.SECURE,
      auth: {
        user: 'orta.itkoldau@gmail.com',
        pass: process.env.PASS, 
      },
    });

    const source = fs.readFileSync(path.join(__dirname, template), "utf8");
    const compiledTemplate = handlebars.compile(source);
    const options = () => {
      return {
        from: 'orta.itkoldau@gmail.com',
        to: email,
        subject: subject,
        html: compiledTemplate(payload),
      };
    };

    // Send email
    transporter.sendMail(options(), (error, info) => {
      if (error) {
        console.log("if Not sent", error)
        return error;
      } else {
        console.log("sent")
        return res.status(200).json({
          success: true,
        });
      }
    });
  } catch (error) {
    console.log("Not sent", error)
    return error;
  }
};

/*
Example:
sendEmail(
  "youremail@gmail.com,
  "Email subject",
  { name: "Eze" },
  "./templates/layouts/main.handlebars"
);
*/

module.exports = sendEmail;