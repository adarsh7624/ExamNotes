import Notes from "../models/notes.model.js";
import UserModel from "../models/user.model.js";
import { generateGeminiResponse } from "../services/gemini.services.js";
import { buildPrompt } from "../utils/promptBuilder.js";

export const generateNotes = async (req, res) => {
    try {
        const {
            topic,
            classLevel,
            examType,
            revisionMode = false,
            includeDiagram = false,
            includeChart = false
        } = req.body;

        // 🔹 Validate input
        if (!topic || typeof topic !== "string") {
            return res.status(400).json({
                message: "Valid topic is required"
            });
        }

        // 🔹 Atomic credit check + deduction
        const user = await UserModel.findOneAndUpdate(
            { _id: req.userId, credits: { $gte: 10 } },
            { $inc: { credits: -10 } },
            { new: true }
        );

        if (!user) {
            return res.status(403).json({
                message: "Insufficient credits"
            });
        }

        // 🔹 Build AI prompt
        const prompt = buildPrompt({
            topic,
            classLevel,
            examType,
            revisionMode,
            includeDiagram,
            includeChart
        });

        // 🔹 Generate AI response safely
        let aiResponse;
        try {
            aiResponse = await generateGeminiResponse(prompt);
        } catch (err) {
            console.error("AI Service Error:", err);

            // 🔁 Refund credits if AI fails
            await UserModel.findByIdAndUpdate(user._id, {
                $inc: { credits: 10 }
            });

            return res.status(500).json({
                message: "AI service failed. Credits refunded.",
                error: err.message
            });
        }

        if (!aiResponse || typeof aiResponse !== "object") {
            // 🔁 Refund credits if response invalid
            await UserModel.findByIdAndUpdate(user._id, {
                $inc: { credits: 10 }
            });

            return res.status(500).json({
                message: "Failed to generate valid notes. Credits refunded."
            });
        }

        // 🔹 Save notes
        const notes = await Notes.create({
            user: user._id,
            topic,
            classLevel,
            examType,
            revisionMode,
            includeDiagram,
            includeChart,
            content: aiResponse
        });

        // 🔹 Update user notes list
        await UserModel.findByIdAndUpdate(user._id, {
            $push: { notes: notes._id },
            $set: {
                isCreditAvailable: user.credits - 10 > 0 // optional safety
            }
        });

        // 🔹 Response
        return res.status(200).json({
            success: true,
            data: aiResponse,
            noteId: notes._id,
            creditsLeft: user.credits
        });

    } catch (error) {
        console.error("Server Error:", error);

        return res.status(500).json({
            error: "AI generation failed",
            message: error.message
        });
    }
};