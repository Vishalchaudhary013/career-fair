const sendWhatsApp = async ({
  to,
  eventTitle,
  attendeeName,
  bookingId,
  totalPrice,
  dateStr,
  timeStr,
}) => {
  console.log("WhatsApp ticket notification queued", {
    to,
    eventTitle,
    attendeeName,
    bookingId,
    totalPrice,
    dateStr,
    timeStr,
  });

  return {
    success: true,
    message: "WhatsApp notification mocked successfully",
  };
};

export default sendWhatsApp;
