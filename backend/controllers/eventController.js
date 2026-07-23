import Event from "../models/eventModel.js";
import {
  createEventServices,
  getAllEventsServices,
  getEventByIdServices,
  updateEventServicesWithLogging as updateEventServices,
  deleteEventServices,
} from "../services/eventServices.js";

export const createFair = async (req, res) => {
  try {
    const fair = await createEventServices(req);

    return res.status(201).json({
      success: true,
      message: "Fair Created Successfully",
      data: fair,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllFairs = async (req, res) => {
  try {
    const fairs = await getAllEventsServices(req.query);
    return res.status(200).json({
      success: true,
      data: fairs,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getFairById = async (req, res) => {
  try {
    const fair = await getEventByIdServices(req.params.id);
    return res.status(200).json({
      success: true,
      data: fair,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateFair = async (req, res) => {
  try {
    const fair = await updateEventServices(req.params.id, req);
    return res.status(200).json({
      success: true,
      message: "Fair Updated Successfully",
      data: fair,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteFair = async (req, res) => {
  try {
    await deleteEventServices(req.params.id);
    return res.status(200).json({
      success: true,
      message: "Fair Deleted Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const joinAsPartner = async (req, res) => {
  try {
    const { id } = req.params;
    const { companyName, jobProfile, location, candidatesRequired, description, logoLink } = req.body;

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    const companyLogo = req.files?.companyLogo?.[0]?.filename || "";

    const newPartner = {
      companyName,
      jobProfile,
      location,
      candidatesRequired: parseInt(candidatesRequired, 10) || 0,
      description: description || "",
      logo: companyLogo,
      logoLink: logoLink || "",
      postedBy: req.user._id,
      postedByEmail: req.user.email,
    };

    event.hiringPartners.push(newPartner);
    await event.save();

    return res.status(200).json({
      success: true,
      message: "Successfully joined as Hiring Partner!",
      data: event,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getEmployerDashboard = async (req, res) => {
  try {
    const userId = req.user._id;

    const events = await Event.find({
      "hiringPartners.postedBy": userId
    });

    let totalFairs = events.length;
    let totalJobRoles = 0;
    let totalVacancies = 0;
    const participatingFairs = [];

    events.forEach(event => {
      const myPartners = event.hiringPartners.filter(
        p => p.postedBy && p.postedBy.toString() === userId.toString()
      );

      totalJobRoles += myPartners.length;
      myPartners.forEach(p => {
        totalVacancies += p.candidatesRequired || 0;
      });

      participatingFairs.push({
        _id: event._id,
        fairName: event.fairName,
        startDate: event.startDate,
        endDate: event.endDate,
        venue: event.venue,
        myPostings: myPartners
      });
    });

    return res.status(200).json({
      success: true,
      stats: {
        totalFairs,
        totalJobRoles,
        totalVacancies
      },
      participatingFairs
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateEmployerJob = async (req, res) => {
  try {
    const { id, jobId } = req.params;
    const { companyName, jobProfile, location, candidatesRequired, description, logoLink } = req.body;
    const userId = req.user._id;

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    const partner = event.hiringPartners.id(jobId);
    if (!partner) {
      return res.status(404).json({ success: false, message: "Job posting not found" });
    }

    if (partner.postedBy && partner.postedBy.toString() !== userId.toString() && req.user.role !== "SUPER_ADMIN" && req.user.role !== "ADMIN") {
      return res.status(403).json({ success: false, message: "Not authorized to edit this job posting" });
    }

    if (companyName) partner.companyName = companyName;
    if (jobProfile) partner.jobProfile = jobProfile;
    if (location) partner.location = location;
    if (candidatesRequired !== undefined) partner.candidatesRequired = parseInt(candidatesRequired, 10) || 0;
    if (description !== undefined) partner.description = description;
    if (logoLink !== undefined) partner.logoLink = logoLink;

    if (req.files?.companyLogo?.[0]) {
      partner.logo = req.files.companyLogo[0].filename;
    }

    await event.save();

    return res.status(200).json({
      success: true,
      message: "Job posting updated successfully",
      data: event
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteEmployerJob = async (req, res) => {
  try {
    const { id, jobId } = req.params;
    const userId = req.user._id;

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    const partner = event.hiringPartners.id(jobId);
    if (!partner) {
      return res.status(404).json({ success: false, message: "Job posting not found" });
    }

    if (partner.postedBy && partner.postedBy.toString() !== userId.toString() && req.user.role !== "SUPER_ADMIN" && req.user.role !== "ADMIN") {
      return res.status(403).json({ success: false, message: "Not authorized to delete this job posting" });
    }

    event.hiringPartners.pull(jobId);
    await event.save();

    return res.status(200).json({
      success: true,
      message: "Job posting removed successfully",
      data: event
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
