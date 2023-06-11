const nodemailer = require("nodemailer");
const sgMail = require("@sendgrid/mail");
const amqp = require("amqplib");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const transporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 465,
  secure: true,
  auth: {
    user: "apikey",
    pass: process.env.SENDGRID_API_KEY,
  },
});

async function sendMailWithSendgrid(mailOptions) {
  try {
    await transporter.sendMail(mailOptions);
    console.log("Mail sent");
  } catch (error) {
    console.log("Error sending email:", error);
  }
}
async function publishToRabbitMQ(message) {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    console.log("Connected to RabbitMQ");

    const queue = "email_queue";
    await channel.assertQueue(queue);

    // Publish the message to the queue
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
    console.log("Message published to RabbitMQ");

    await channel.close();
    await connection.close();
  } catch (error) {
    console.error("Error publishing to RabbitMQ:", error);
    throw error;
  }
}

async function consumeFromRabbitMQ() {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    console.log("Connected to RabbitMQ");

    const queue = "email_queue";
    await channel.assertQueue(queue);

    // Consume messages from the queue
    channel.consume(queue, async (message) => {
      const emailData = JSON.parse(message.content.toString());

      try {
        // Process the emailData and send the email via SendGrid
        await sendMailWithSendgrid(emailData);
        console.log("Email sent");
        channel.ack(message); // Acknowledge the message after successful processing
      } catch (error) {
        console.log("Error sending email:", error);
        channel.reject(message, true);
      }
    });

    console.log("Consumer started");
  } catch (error) {
    console.error("Error consuming from RabbitMQ:", error);
    throw error;
  }
}

module.exports = { sendMailWithSendgrid, publishToRabbitMQ, consumeFromRabbitMQ };
