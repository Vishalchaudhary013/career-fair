import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: "./backend/.env" });

const eventSchema = new mongoose.Schema({}, { strict: false });
const Event = mongoose.model("Event", eventSchema);

async function check() {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/career-fairs", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const events = await Event.find({});
    console.log("Total events:", events.length);
    events.forEach(e => {
      console.log(`- ${e.fairName || e.basicInfo?.title}:`);
      console.log(`  startDate: ${e.startDate}, endDate: ${e.endDate}`);
      if (e.basicInfo) {
        console.log(`  basicInfo.startDate: ${e.basicInfo.startDate}, basicInfo.endDate: ${e.basicInfo.endDate}`);
      }
    });
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
check();
