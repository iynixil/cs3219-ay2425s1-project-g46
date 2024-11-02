// Author(s): Andrew
const db = require("../db/firebase");
const userReviewCollection = db.collection("userReviews");


// For user feedback
const addReview = async (req, res) => {
  try {
    const {email, newReview} = req.body;

    const userRef = userReviewCollection.doc(email);
    
    const doc = await userRef.get();

    if (!doc.exists) {
        await userRef.set({1: newReview});
    } else {
        const reviews = doc.data();
        const reviewKeys = Object.keys(reviews).map(Number);
        const maxKey = Math.max(...reviewKeys);
        await userRef.update({ [maxKey + 1]: newReview});
    }
    console.log("Review added successfully");
    res.send({ message: "Review added successfully"});
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).send({ error: error.message });
  }
}

// For website feedback

const transporter = require("../db/nodemailer"); 

const addWebsiteFeedback = async (req, res) => {
    const feedbackContent = req.body.feedbackContent.comment;
    console.log("Fetching website feedback: ", feedbackContent);

    const mailOptions = {
        from: {
            name: "CS3219 PeerPrep Program",
            address: process.env.EMAIL_USER,
        },
        to: [process.env.EMAIL_USER],
        subject: "Website Feedback",
        text: feedbackContent || "No feedback provided",
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Feedback email has been sent");
        res.send({ message: "Feedback sent successfully" });
    } catch (error) {
        console.error("Failed to send feedback:", error);
        res.status(500).send({ error: "Failed to send feedback" });
    }
};

  


module.exports = {
  addReview,
  addWebsiteFeedback
};