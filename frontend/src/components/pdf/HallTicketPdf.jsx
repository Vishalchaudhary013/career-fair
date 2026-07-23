import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import axios from "axios";
import { SERVER_URL } from "../../config";

function HallTicketPdf() {
  const location = useLocation();
  const navigate = useNavigate();
  const { hallTicket } = location.state || {};
  const { jobFairId } = hallTicket || {};
  const [jobFairData, setJobFairData] = useState(null);

  useEffect(() => {
    if (hallTicket) fetchJobFair();
  }, [hallTicket]);

  useEffect(() => {
    if (jobFairData) generatePdf();
  }, [jobFairData]);

  const fetchJobFair = async () => {
    try {
      const res = await axios.get(`${SERVER_URL}/api/jobFair/${jobFairId}`);
      setJobFairData(res.data);
    } catch (err) {
      console.error("Job Fair Fetch Error:", err);
    }
  };

  const formatDate = (d) => {
    if (!d) return "";
    return new Date(d).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (d) => {
    if (!d) return "";
    return new Date(d).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatEventDateRange = (start, end) => {
    if (!start || !end) return "";
    const s = formatDate(start);
    const e = formatDate(end);
    return s === e ? s : `${s} - ${e}`;
  };

  const formatEntryTiming = (start, end) => {
    if (!start || !end) return "";
    return `${formatTime(start)} - ${formatTime(end)}`;
  };

  const generatePdf = () => {
    if (!hallTicket || !jobFairData) return;

    const doc = new jsPDF();

    const pageWidth = doc.internal.pageSize.getWidth();
    const marginX = 16;
    const marginY = 8;

    let y = marginY + 10;

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(11);

    // TOP LEFT → Ticket ID
    doc.text(
      `Ticket ID : ${hallTicket.hallTicketNumber}`,
      marginX,
      y
    );

    // TOP RIGHT → Created At
    doc.text(
      `Created At : ${formatDate(hallTicket.createdAt)}`,
      pageWidth - marginX,
      y,
      { align: "right" }
    );

    // TITLE "HALL TICKET"
    y += 15;
    doc.setFontSize(18);
    doc.setFont("Helvetica", "bold");
    doc.text("HALL TICKET", pageWidth / 2, y, { align: "center" });

    // FAIR NAME
    y += 12;
    doc.setFontSize(13);
    doc.setFont("Helvetica", "bold");

    const fairName = jobFairData.jobFairName || "";
    const fairLines = doc.splitTextToSize(`"${fairName}"`, pageWidth - 2 * marginX);
    doc.text(fairLines, pageWidth / 2, y, { align: "center" });

    y += fairLines.length * 7 + 5;

    // DATE OF EVENT & ENTRY TIMING
    doc.setFontSize(11);
    doc.setFont("Helvetica", "normal");

    const eventRange = formatEventDateRange(
      jobFairData.jobFairStart,
      jobFairData.jobFairEnd
    );

    const timing = formatEntryTiming(
      jobFairData.jobFairStart,
      jobFairData.jobFairEnd
    );

    doc.text(`Date Of Fair : ${eventRange}`, marginX, y);
    doc.text(
      `Entry Timing : ${timing}`,
      pageWidth - marginX,
      y,
      { align: "right" }
    );

    // CANDIDATE DETAILS
    y += 15;

    const fullName = hallTicket.fullName || "";
    const gender = hallTicket.gender || "";
    const email = hallTicket.email || "";
    const mobile = hallTicket.mobileNumber || "";
    const qualification = hallTicket.highestQualification || "";
    const specialization = hallTicket.discipline || "";

    const qualificationLine =
      specialization
        ? `${qualification} (${specialization})`
        : qualification;

    const col1X = marginX;
    const col2X = pageWidth / 2 + 10;
    const rowGap = 8;

    // Row 1
    doc.text(`1. Candidate Name : ${fullName}`, col1X, y);
    doc.text(`2. Gender : ${gender}`, col2X, y);

    // Row 2
    y += rowGap;
    doc.text(`3. Email ID : ${email}`, col1X, y);
    doc.text(`4. Contact No. : ${mobile}`, col2X, y);

    // Row 3
    y += rowGap;
    doc.text(`5. Highest Qualification : ${qualificationLine}`, col1X, y);

    // APPLYING FOR BOX
    y += 14;
    const box1X = marginX;
    const box1Y = y;
    const box1Width = pageWidth - 2 * marginX;
    const box1Height = 32;

    doc.rect(box1X, box1Y, box1Width, box1Height);

    doc.setFont("Helvetica", "bold");
    doc.text("Applying for :", box1X + 4, box1Y + 8);

    doc.text(
      "(For office use only)",
      box1X + box1Width - 4,
      box1Y + 8,
      { align: "right" }
    );

    doc.setFont("Helvetica", "normal");

    doc.text("1. ___________________________", box1X + 4, box1Y + 16);
    doc.text("2. ___________________________", box1X + box1Width / 2 + 4, box1Y + 16);

    doc.text("3. ___________________________", box1X + 4, box1Y + 24);
    doc.text("4. ___________________________", box1X + box1Width / 2 + 4, box1Y + 24);

    // IMPORTANT INSTRUCTIONS BOX
  

   const instructions = [
  "1. The candidate must carry this Hall Ticket to the venue without fail. Entry to the premises shall be strictly prohibited without a valid Hall Ticket.",

  "2. Candidates are permitted to apply for a maximum of four (04) companies per day.",

  "3. The candidate must bring a valid Government-issued Photo Identification Proof for verification.",
  "   (a) Accepted IDs include Aadhaar Card, PAN Card, Voter ID Card, Passport, or Driving Licence.",

  "4. The candidate shall report to the venue with the following mandatory documents:",
  "   (a) Four (04) recent passport-size photographs.",
  "   (b)  (04) hard copies of the updated Resume/Curriculum Vitae (CV).",

  "5. All candidates must report at least thirty (30) minutes prior to the scheduled reporting time to complete verification and other formalities.",

  "6. The organizers reserve the right to deny entry or cancel the candidature of any candidate found providing false information or violating any of the above instructions."
];

doc.setFont("Helvetica", "bold");
doc.setFontSize(12);

const box2X = marginX;
const box2Width = pageWidth - 2 * marginX;

// Calculate all wrapped lines
doc.setFont("Helvetica", "normal");
doc.setFontSize(10);

let allLines = [];
instructions.forEach((ins) => {
  const wrapped = doc.splitTextToSize(ins, box2Width - 10);
  allLines.push(...wrapped);
});

// Auto height calculation
const lineHeight = 5;
const headerHeight = 14;
const boxHeight = headerHeight + allLines.length * lineHeight + 10;

const box2Y = box1Y + box1Height + 14;

// Draw box
doc.rect(box2X, box2Y, box2Width, boxHeight);

// Title
doc.setFont("Helvetica", "bold");
doc.setFontSize(12);
doc.text(
  "IMPORTANT INSTRUCTIONS",
  pageWidth / 2,
  box2Y + 8,
  { align: "center" }
);

// Draw instruction text
doc.setFont("Helvetica", "normal");
doc.setFontSize(10);

let instrY = box2Y + 18;

allLines.forEach((line) => {
  doc.text(line, box2X + 5, instrY);
  instrY += lineHeight;
});

    // SIGNATURE BOTTOM RIGHT
    doc.text(
      "Candidate's Signature",
      pageWidth - marginX,
      doc.internal.pageSize.getHeight() - 12,
      { align: "right" }
    );

    // DOWNLOAD
    const pdfBlob = doc.output("blob");
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Hall_Ticket_${hallTicket.hallTicketNumber}.pdf`;
    link.click();
  };

  const goBack = () => navigate(`/job-fair/${jobFairId}`);

  return (
    <div style={{ textAlign: "center", padding: "60px" }}>
      <h3>Generating Hall Ticket...</h3>
      <button onClick={goBack} style={{ marginTop: "25px", padding: "12px 20px", background: "red", color: "white", border: "none", borderRadius: "6px" }}>
        Back to Job Fair Details
      </button>
    </div>
  );
}

export default HallTicketPdf;
