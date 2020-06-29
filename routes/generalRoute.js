const express = require('express');
const router = express.Router();

router.post("/terms-conditions",(req,res) => {
    let resData = {
        success: false,
        errorMessage: {
            fatalError: ""
        }
    };

    resData.terms = [
        "১) প্রোডাক্ট পিক করতে কালেক্টর যাওয়ার আগে মার্চেন্টকে প্রোডাক্ট প্রস্তুত রাখতে হবে।",
        "২) মার্চেন্ট সকল প্রকার প্রোডাক্টের প্যাকেজিং এর ব্যবস্থা করবেন।",
        "৩) ত্রূটিপূর্ণ প্যাকেজিং এর কারণে প্রোডাক্ট ড্যামেজ হলে কর্তৃপক্ষ দায়ী থাকবেনা।",
    ]
    resData.success = true;
    res.json(resData);

});

module.exports = router;