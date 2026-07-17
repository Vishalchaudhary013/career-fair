/**
 * Hall Ticket Routes
 */

const express = require("express");
const router = express.Router();
const HallTicket = require("../models/HallTicket");

/**
 * Get Hall Ticket by Student ID
 * This is used when frontend wants hall ticket for a given student
 */
router.get("/:studentId", async (req, res) => {
  try {
    const hallTicket = await HallTicket.findOne({
      studentId: req.params.studentId,
    });

    if (!hallTicket) {
      return res.status(404).json({ message: "Hall Ticket not found" });
    }

    return res.status(200).json(hallTicket);
  } catch (error) {
    console.error("Hall Ticket Fetch Error:", error);
    res.status(500).json({
      message: "Server Error fetching Hall Ticket",
      error: error.message,
    });
  }
});

module.exports = router;

