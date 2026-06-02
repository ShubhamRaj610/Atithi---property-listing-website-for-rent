const express = require("express");

const router = express.Router();

const model = require("../utils/gemini");

router.post(
    "/generate-description",
    async (req, res) => {

        try {

            const {
                title,
                location,
                country,
                price
            } = req.body;

            const prompt = `
            Generate an attractive Airbnb-style property description.

            Property Title:
            ${title}

            Location:
            ${location}, ${country}

            Price:
            ₹${price} per night

            Requirements:
            - Keep under 120 words
            - Professional tone
            - Mention travel experience
            `;

            const result =
                await model.generateContent(prompt);

            const response =
                result.response.text();

            res.json({
                success: true,
                description: response
            });

        } catch (err) {

            console.log(err);

            res.status(500).json({
                success: false,
                message: "AI generation failed"
            });
        }
    }
);

module.exports = router;