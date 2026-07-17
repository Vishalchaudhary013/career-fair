import Booking from "../models/Booking.js";
import Event from "../models/eventModel.js";
import mongoose from "mongoose";
import sendEmail from "../utils/sendEmail.js";
import sendWhatsApp from "../utils/sendWhatsApp.js";
import QRCode from "qrcode";
import crypto from "crypto";

const formatDateBackend = (dateVal) => {
  if (!dateVal) return "TBA";

  const date = new Date(dateVal);
  if (Number.isNaN(date.getTime())) return String(dateVal);

  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatTimeBackend = (timeVal) => {
  if (!timeVal) return "TBA";

  if (timeVal instanceof Date) {
    return timeVal.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  }

  const timeText = String(timeVal);
  if (/^\d{1,2}:\d{2}/.test(timeText)) {
    const [hourStr, minuteStr] = timeText.split(":");
    const hour = Number(hourStr);
    if (!Number.isNaN(hour)) {
      const suffix = hour >= 12 ? "PM" : "AM";
      const hour12 = hour % 12 || 12;
      return `${hour12}:${minuteStr} ${suffix}`;
    }
  }

  const parsed = new Date(timeText);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  }

  return timeText;
};

const getEventMeta = (event) => {
  const title = event?.basicInfo?.title || event?.fairName || "Event";
  const startDateValue = event?.basicInfo?.startDate || event?.startDate;
  const startTimeValue = event?.basicInfo?.startTime || event?.startDate;
  const venue = event?.location || event?.venue || {};

  return {
    title,
    dateStr: formatDateBackend(startDateValue),
    timeStr: formatTimeBackend(startTimeValue),
    venueStr: venue.venueName || venue.city || "Venue TBA",
  };
};

// @desc    Generate EAN-13 styled barcode HTML for email bodies
const generateHtmlBarcode = (bookingId) => {
  const codeStr = String(bookingId || "0120034399434").replace(
    /[^a-zA-Z0-9]/g,
    "",
  );
  const getNumericId = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const positive = Math.abs(hash);
    return (positive + "742558973912").slice(-12); // take last 12 digits
  };

  const displayVal = getNumericId(codeStr);
  const part1 = displayVal.slice(0, 1);
  const part2 = displayVal.slice(1, 7).split("").join(" ");
  const part3 = displayVal.slice(7, 12).split("").join(" ");

  const leftSequence = [
    2, 1, 1, 3, 2, 1, 1, 2, 3, 1, 2, 2, 1, 1, 3, 1, 2, 3, 1, 1, 2, 2, 1, 3, 2,
    1,
  ];
  const rightSequence = [
    1, 2, 3, 1, 2, 2, 1, 1, 3, 1, 2, 1, 1, 3, 2, 1, 1, 2, 3, 1, 2, 2, 1, 1, 3,
    2,
  ];

  let barsHtml = "";

  // Left guard (longer lines)
  barsHtml += `<span style="display: inline-block; width: 2px; height: 50px; background-color: #1e293b; margin-right: 2px; vertical-align: top;"></span>`;
  barsHtml += `<span style="display: inline-block; width: 2px; height: 50px; background-color: #1e293b; margin-right: 3px; vertical-align: top;"></span>`;

  // Left data (shorter lines)
  leftSequence.forEach((w, idx) => {
    const actualW = w * 1.6;
    if (idx % 2 === 0) {
      barsHtml += `<span style="display: inline-block; width: ${actualW.toFixed(1)}px; height: 36px; background-color: #1e293b; margin-right: 1.5px; vertical-align: top;"></span>`;
    } else {
      barsHtml += `<span style="display: inline-block; width: ${actualW.toFixed(1)}px; height: 36px; background-color: transparent; margin-right: 1.5px; vertical-align: top;"></span>`;
    }
  });

  // Middle guard (longer lines)
  barsHtml += `<span style="display: inline-block; width: 2px; height: 50px; background-color: #1e293b; margin-right: 2px; margin-left: 2px; vertical-align: top;"></span>`;
  barsHtml += `<span style="display: inline-block; width: 2px; height: 50px; background-color: #1e293b; margin-right: 3px; vertical-align: top;"></span>`;

  // Right data (shorter lines)
  rightSequence.forEach((w, idx) => {
    const actualW = w * 1.6;
    if (idx % 2 === 0) {
      barsHtml += `<span style="display: inline-block; width: ${actualW.toFixed(1)}px; height: 36px; background-color: #1e293b; margin-right: 1.5px; vertical-align: top;"></span>`;
    } else {
      barsHtml += `<span style="display: inline-block; width: ${actualW.toFixed(1)}px; height: 36px; background-color: transparent; margin-right: 1.5px; vertical-align: top;"></span>`;
    }
  });

  // Right guard (longer lines)
  barsHtml += `<span style="display: inline-block; width: 2px; height: 50px; background-color: #1e293b; margin-right: 2px; margin-left: 2px; vertical-align: top;"></span>`;
  barsHtml += `<span style="display: inline-block; width: 2px; height: 50px; background-color: #1e293b; vertical-align: top;"></span>`;

  return `
    <div style="text-align: center; margin: 25px 0 10px 0; font-family: monospace;">
      <div style="line-height: 0; white-space: nowrap; height: 50px;">
        ${barsHtml}
      </div>
      <table style="width: 212px; margin: 4px auto 0 auto; font-size: 11px; font-weight: bold; color: #1e293b; font-family: monospace; border-collapse: collapse;">
        <tr>
          <td style="width: 15px; text-align: left; padding: 0;">${part1}</td>
          <td style="width: 80px; text-align: center; letter-spacing: 3px; padding: 0;">${part2}</td>
          <td style="width: 80px; text-align: center; letter-spacing: 3px; padding: 0;">${part3}</td>
        </tr>
      </table>
    </div>
  `;
};

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private/Public depending on auth implementation
export const createBooking = async (req, res) => {
  try {
    const { eventId, tickets, totalPrice, totalItems, answers } = req.body;

    // Find the event
    const event = await Event.findById(eventId).populate("organizer");
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Try to extract email and phone from answers (defaulting to a logged-in user if available, but assuming anonymous for now)
    let email = req.user?.workEmail || "guest@example.com";
    let phone = "";

    // Look for email and phone in answers
    if (answers) {
      for (const [key, value] of Object.entries(answers)) {
        if (typeof value === "string") {
          if (value.includes("@")) {
            email = value;
          } else if (
            key.toLowerCase().includes("phone") ||
            key.toLowerCase().includes("mobile") ||
            key.toLowerCase().includes("contact") ||
            /^\+?[0-9\s-]{8,15}$/.test(value)
          ) {
            if (!phone) phone = value;
          }
        }
      }
    }

    const qrCodeId = crypto.randomUUID();

    const booking = await Booking.create({
      event: eventId,
      user: req.user?._id || null, // Optional if guest checkout allowed
      email,
      tickets,
      totalPrice,
      totalItems,
      answers,
      qrCodeId,
    });

    // Generate QR Code image as data URI (using order ID)
    const qrCodeDataUri = await QRCode.toDataURL(booking._id.toString());

    const { title, dateStr, timeStr } = getEventMeta(event);

    // Get Attendee Name
    const getAttendeeName = () => {
      if (answers) {
        if (answers.q_name) return answers.q_name;
        const nameQuestion = event?.questions?.find((q) =>
          q.title.toLowerCase().includes("name") && !q.title.toLowerCase().includes("company name")
        );
        if (nameQuestion) {
          const qId = nameQuestion.id || nameQuestion._id;
          if (answers[qId]) return answers[qId];
        }
        const nameKey = Object.keys(answers).find((key) =>
          key.toLowerCase().includes("name"),
        );
        if (nameKey && answers[nameKey]) return answers[nameKey];
      }
      return email.split("@")[0];
    };
    const attendeeName = getAttendeeName();

    // Email will use the attached QR code instead of the barcode HTML

    // Send Email
    try {
      await sendEmail({
        email,
        subject: `Your Tickets for ${title}`,
        message: `Thank you for booking! Your order ID is ${booking._id}. You can manage both your free and paid tickets under your profile.`,
        html: `
          <div style="background-color: #f1f5f9; padding: 40px 10px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
            <div style="max-width: 400px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); text-align: center;">
              
              <!-- Header -->
              <div style="font-size: 40px; margin-bottom: 15px;">🎉</div>
              <h2 style="font-size: 24px; font-weight: bold; color: #1e293b; margin: 0 0 5px 0;">Thank you!</h2>
              <p style="font-size: 14px; color: #64748b; margin: 0 0 20px 0;">Your ticket has been issued successfully</p>
              
              <div style="border-top: 1px dashed #cbd5e1; margin: 20px -30px;"></div>
              
              <!-- Details -->
              <div style="text-align: left; margin-bottom: 25px;">
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
                  <tr>
                    <td style="padding: 0; text-align: left;">
                      <span style="font-size: 10px; color: #94a3b8; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; display: block;">Ticket ID</span>
                      <span style="font-size: 14px; font-family: monospace; font-weight: bold; color: #334155; margin-top: 2px; display: block;">${booking._id}</span>
                    </td>
                    <td style="padding: 0; text-align: right; vertical-align: top;">
                      <span style="font-size: 10px; color: #94a3b8; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; display: block;">Amount</span>
                      <span style="font-size: 15px; font-weight: bold; color: #1e293b; margin-top: 2px; display: block;">${totalPrice > 0 ? `₹${totalPrice.toFixed(2)}` : "FREE"}</span>
                    </td>
                  </tr>
                </table>

                <div style="margin-bottom: 15px;">
                  <span style="font-size: 10px; color: #94a3b8; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; display: block;">Date & Time</span>
                  <span style="font-size: 14px; font-weight: 600; color: #334155; margin-top: 2px; display: block;">${dateStr} • ${timeStr}</span>
                </div>

                <div style="margin-bottom: 20px;">
                  <span style="font-size: 10px; color: #94a3b8; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; display: block;">Event</span>
                  <span style="font-size: 14px; font-weight: bold; color: #110060; margin-top: 2px; display: block;">${title}</span>
                </div>

                <!-- Attendee Card -->
                <div style="background-color: #f8fafc; border: 1px solid #f1f5f9; border-radius: 12px; padding: 12px; margin-top: 15px;">
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="width: 40px; padding: 0;">
                        <div style="width: 36px; height: 36px; border-radius: 50%; background-color: #ffffff; border: 1px solid #f1f5f9; text-align: center; line-height: 36px;">
                          ${
                            totalPrice > 0
                              ? `
                            <span style="color: #eb001b; font-size: 16px; font-weight: bold; vertical-align: middle;">MC</span>
                          `
                              : `
                            <span style="color: #110060; font-size: 16px; font-weight: bold; vertical-align: middle;">✓</span>
                          `
                          }
                        </div>
                      </td>
                      <td style="padding-left: 10px; vertical-align: middle;">
                        <p style="font-size: 13px; font-weight: bold; color: #334155; margin: 0; line-height: 1.2;">${attendeeName}</p>
                        <p style="font-size: 11px; color: #94a3b8; margin: 2px 0 0 0; line-height: 1.2;">${totalPrice > 0 ? "Paid Ticket • Confirmed" : "Free Pass • Confirmed"}</p>
                      </td>
                    </tr>
                  </table>
                </div>
              </div>

              <div style="border-top: 1px dashed #cbd5e1; margin: 20px -30px;"></div>

              <!-- QR Code -->
              <div style="text-align: center; margin-top: 20px;">
                <img src="cid:qrcode" alt="QR Code" style="width: 150px; height: 150px; padding: 5px; background: white; border: 1px solid #e2e8f0; border-radius: 8px;" />
                <p style="font-size: 10px; color: #94a3b8; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 8px;">Scan at Entry</p>
              </div>

            </div>
            
            <!-- Bottom Link -->
            <p style="text-align: center; font-size: 12px; color: #94a3b8; margin-top: 20px;">
              You can manage both your free and paid tickets under your profile.
            </p>
          </div>
        `,
        attachments: [
          {
            filename: "qrcode.png",
            content: qrCodeDataUri,
            encoding: "base64",
            cid: "qrcode",
          },
        ],
      });
    } catch (emailErr) {
      console.error("Failed to send ticket email:", emailErr);
    }

    // Send WhatsApp (mock)
    if (phone) {
      try {
        await sendWhatsApp({
          to: phone,
          eventTitle: title,
          attendeeName,
          bookingId: booking._id,
          totalPrice,
          dateStr,
          timeStr,
        });
      } catch (waErr) {
        console.error("Failed to send ticket WhatsApp:", waErr);
      }
    }

    // Send Notification to Organizer
    if (event.organizer && event.organizer.email) {
      try {
        await sendEmail({
          email: event.organizer.email,
          subject: `New Application for ${title}`,
          message: `Hello ${event.organizer.name || "Organizer"},\n\nYou have a new applicant for your event "${title}".\n\nApplicant Details:\nName: ${attendeeName}\nEmail: ${email}\n\nPlease check your dashboard for more details.\n\nThank you,\nCareer Fair Team`
        });
      } catch (adminEmailErr) {
        console.error("Failed to send organizer notification email:", adminEmailErr);
      }
    }

    res.status(201).json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Public
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("event");
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get bookings by Event ID
// @route   GET /api/bookings/event/:eventId
// @access  Private (Organizer only)
export const getBookingsByEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const bookings = await Booking.find({ event: eventId }).sort({
      createdAt: -1,
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify QR Code
// @route   POST /api/bookings/verify-qr
// @access  Private (Organizer only)
export const verifyQR = async (req, res) => {
  try {
    const { qrCodeId } = req.body;
    let booking;

    // Check if the qrCodeId is a valid ObjectId (since we now use the order ID for QR codes)
    if (mongoose.Types.ObjectId.isValid(qrCodeId)) {
      booking = await Booking.findById(qrCodeId).populate("event");
    }

    // Fallback for legacy QR codes that used UUIDs
    if (!booking) {
      booking = await Booking.findOne({ qrCodeId }).populate("event");
    }

    if (!booking) {
      return res
        .status(404)
        .json({ valid: false, message: "Invalid QR Code. Booking not found." });
    }

    res.json({
      valid: true,
      booking: {
        id: booking._id,
        status: booking.status,
        email: booking.email,
        totalItems: booking.totalItems,
        eventTitle: getEventMeta(booking.event).title,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete booking by ID
// @route   DELETE /api/bookings/:id
// @access  Private (Organizer/Admin)
export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
