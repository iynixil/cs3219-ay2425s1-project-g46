// Author(s): Andrew
const db = require("../db/firebase");
const userReviewCollection = db.collection("userReviews");

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

module.exports = {
  addReview
};