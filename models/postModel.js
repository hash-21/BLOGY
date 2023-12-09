const mongoose = require("mongoose");
const nodemailer=require('../config/nodemailer');
const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Like",
  }],
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
  }],
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
  },
});



postSchema.post("save", async function (doc) {
    try {
        console.log("DOC", doc);

    // Connect to nodemailer
    const transporter = nodemailer.connect();

    // Send mail 
    const info = await transporter.sendMail({
      from: 'BLOGY',
      to: doc.author.email,
      subject: 'New Post Uploaded',
      html: `<h2>Hello post uploaded</h2>`,
    });

    console.log("INFO of mail", info);

  } catch (error) {
    console.error(error);
  }
});


// Export 
module.exports = mongoose.model("Post",postSchema);