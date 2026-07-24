import Event from "../models/eventModel.js";
import { parseFormData } from "../utils/parseFormData.js";
import fs from "fs";
import path from "path";

export const createEventServices = async (req) => {
  // persist the incoming body for debugging
  try {
    fs.writeFileSync(
      path.join(process.cwd(), "debug_req_body.json"),
      JSON.stringify(req.body, null, 2),
    );
  } catch (e) {
    console.error("Failed to write debug_req_body.json", e);
  }

  console.log("req.body in createEventServices:", req.body);

  let {
    fairName,
    visibility,
    venue,
    contact,
    socialLinks,
    statistics,
    hiringPartners,
    whoCanApply,
    tickets,
    questions,
    faqs,
    category,
    fairType,
    description,
    organizerName,
    registrationDeadline,
    instructions,
    termAndConditions,
    startDate,
    endDate,
    language,
  } = req.body;

  venue = parseFormData(venue);
  faqs = parseFormData(faqs);
  contact = parseFormData(contact);
  socialLinks = parseFormData(socialLinks);
  statistics = parseFormData(statistics);
  hiringPartners = parseFormData(hiringPartners);
  whoCanApply = parseFormData(whoCanApply);
  tickets = parseFormData(tickets);
  questions = parseFormData(questions);

  const fairBanner = req.files?.fairBanner?.[0]?.filename || "";
  const fairLogo = req.files?.fairLogo?.[0]?.filename || "";
  const companyListDocument = req.files?.companyListDocument?.[0]?.filename || "";

  if (req.files?.companyLogo && Array.isArray(hiringPartners)) {
    req.files.companyLogo.forEach((file, index) => {
      if (hiringPartners[index]) {
        if (file.originalname !== "empty_logo.txt") {
          hiringPartners[index].logo = file.filename;
        }
      }
    });
  }

  try {
    const createdEvent = await Event.create({
      fairName,
      visibility,
      venue,
      contact,
      socialLinks,
      statistics,
      hiringPartners,
      whoCanApply,
      tickets,
      questions,
      faqs,
      category,
      fairType,
      description,
      organizerName,
      registrationDeadline,
      instructions,
      termAndConditions,
      startDate,
      endDate,
      language,
      fairBanner,
      fairLogo,
      companyListDocument,
      organizer: req.user ? req.user._id : undefined,
    });

    return createdEvent;
  } catch (err) {
    try {
      fs.writeFileSync(
        path.join(process.cwd(), "debug_event_error.json"),
        JSON.stringify(
          {
            message: err.message,
            stack: err.stack,
            body: req.body,
            files: req.files || null,
          },
          null,
          2,
        ),
      );
    } catch (writeErr) {
      console.error("Failed to write debug_event_error.json", writeErr);
    }
    throw err;
  }
};

export const getAllEventsServices = async (query) => {
  const events = await Event.find(query || {});
  return events;
};

export const getEventByIdServices = async (id) => {
  const event = await Event.findById(id);
  if (!event) {
    throw new Error("Event not found");
  }
  return event;
};

export const updateEventServices = async (id, req) => {
  let {
    fairName,
    visibility,
    venue,
    contact,
    socialLinks,
    statistics,
    hiringPartners,
    whoCanApply,
    tickets,
    questions,
    faqs,
    category,
    fairType,
    description,
    organizerName,
    registrationDeadline,
    instructions,
    termAndConditions,
    startDate,
    endDate,
    language,
  } = req.body;

  venue = parseFormData(venue) || undefined;
  faqs = parseFormData(faqs) || undefined;
  contact = parseFormData(contact) || undefined;
  socialLinks = parseFormData(socialLinks) || undefined;
  statistics = parseFormData(statistics) || undefined;
  hiringPartners = parseFormData(hiringPartners) || undefined;
  whoCanApply = parseFormData(whoCanApply) || undefined;
  tickets = parseFormData(tickets) || undefined;
  questions = parseFormData(questions) || undefined;

  const updateData = {
    ...(fairName && { fairName }),
    ...(visibility && { visibility }),
    ...(venue && { venue }),
    ...(contact && { contact }),
    ...(socialLinks && { socialLinks }),
    ...(statistics && { statistics }),
    ...(hiringPartners && { hiringPartners }),
    ...(whoCanApply && { whoCanApply }),
    ...(tickets && { tickets }),
    ...(questions && { questions }),
    ...(faqs && { faqs }),
    ...(category && { category }),
    ...(fairType && { fairType }),
    ...(description && { description }),
    ...(organizerName && { organizerName }),
    ...(registrationDeadline && { registrationDeadline }),
    ...(instructions && { instructions }),
    ...(termAndConditions && { termAndConditions }),
    ...(startDate && { startDate }),
    ...(endDate && { endDate }),
    ...(language && { language }),
  };

  const fairBanner = req.files?.fairBanner?.[0]?.filename;
  const fairLogo = req.files?.fairLogo?.[0]?.filename;
  const companyListDocument = req.files?.companyListDocument?.[0]?.filename;

  if (fairBanner) updateData.fairBanner = fairBanner;
  if (fairLogo) updateData.fairLogo = fairLogo;
  if (companyListDocument) updateData.companyListDocument = companyListDocument;

  if (req.files?.companyLogo && Array.isArray(updateData.hiringPartners)) {
    req.files.companyLogo.forEach((file, index) => {
      if (updateData.hiringPartners[index]) {
        if (file.originalname !== "empty_logo.txt") {
          updateData.hiringPartners[index].logo = file.filename;
        }
      }
    });
  }

  const event = await Event.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
  if (!event) {
    throw new Error("Event not found");
  }
  return event;
};


export const updateEventServicesWithLogging = async (id, req) => {
  try {
    return await updateEventServices(id, req);
  } catch (err) {
    try {
      fs.writeFileSync(
        path.join(process.cwd(), "debug_update_error.json"),
        JSON.stringify(
          {
            message: err.message,
            stack: err.stack,
            id,
            body: req.body,
            files: req.files || null,
          },
          null,
          2,
        ),
      );
    } catch (writeErr) {
      console.error("Failed to write debug_update_error.json", writeErr);
    }
    throw err;
  }
};

export const deleteEventServices = async (id) => {
  const event = await Event.findByIdAndDelete(id);
  if (!event) {
    throw new Error("Event not found");
  }
  return event;
};
