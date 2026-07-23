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
    const {
      companyName, jobProfile, location, candidatesRequired, description, logoLink,
      jobType, qualification, minSalary, maxSalary, minExperience, maxExperience,
      jobLocationState, jobLocationCity, pincode, jobExpiryDate, hiringProcess,
      positionOpenFor, otherBenefit, openForPhysicallyChallenged, organisationName,
      companyType, contactPersonName, designation, mobileNumber, email,
      yourDetailsJobRole, yourDetailsTotalOpenings, yourDetailsState, yourDetailsCity,
      yourDetailsMinSalary, yourDetailsMaxSalary, locations, salaryType, experienceType
    } = req.body;

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
      jobType, qualification, minSalary, maxSalary, minExperience, maxExperience,
      jobLocationState, jobLocationCity, pincode, jobExpiryDate, hiringProcess,
      positionOpenFor, otherBenefit, openForPhysicallyChallenged, organisationName,
      companyType, contactPersonName, designation, mobileNumber, email,
      yourDetailsJobRole, yourDetailsTotalOpenings, yourDetailsState, yourDetailsCity,
      yourDetailsMinSalary, yourDetailsMaxSalary,
      salaryType, experienceType,
      locations: locations ? (typeof locations === 'string' ? JSON.parse(locations) : locations) : [],
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
    const {
      companyName, jobProfile, location, candidatesRequired, description, logoLink,
      jobType, qualification, minSalary, maxSalary, minExperience, maxExperience,
      jobLocationState, jobLocationCity, pincode, jobExpiryDate, hiringProcess,
      positionOpenFor, otherBenefit, openForPhysicallyChallenged, organisationName,
      companyType, contactPersonName, designation, mobileNumber, email,
      yourDetailsJobRole, yourDetailsTotalOpenings, yourDetailsState, yourDetailsCity,
      yourDetailsMinSalary, yourDetailsMaxSalary, locations, salaryType, experienceType
    } = req.body;
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

    if (companyName !== undefined) partner.companyName = companyName;
    if (jobProfile !== undefined) partner.jobProfile = jobProfile;
    if (location !== undefined) partner.location = location;
    if (candidatesRequired !== undefined) partner.candidatesRequired = parseInt(candidatesRequired, 10) || 0;
    if (description !== undefined) partner.description = description;
    if (logoLink !== undefined) partner.logoLink = logoLink;
    if (jobType !== undefined) partner.jobType = jobType;
    if (qualification !== undefined) partner.qualification = qualification;
    if (minSalary !== undefined) partner.minSalary = minSalary;
    if (maxSalary !== undefined) partner.maxSalary = maxSalary;
    if (minExperience !== undefined) partner.minExperience = minExperience;
    if (maxExperience !== undefined) partner.maxExperience = maxExperience;
    if (jobLocationState !== undefined) partner.jobLocationState = jobLocationState;
    if (jobLocationCity !== undefined) partner.jobLocationCity = jobLocationCity;
    if (pincode !== undefined) partner.pincode = pincode;
    if (jobExpiryDate !== undefined) partner.jobExpiryDate = jobExpiryDate;
    if (hiringProcess !== undefined) partner.hiringProcess = hiringProcess;
    if (positionOpenFor !== undefined) partner.positionOpenFor = positionOpenFor;
    if (otherBenefit !== undefined) partner.otherBenefit = otherBenefit;
    if (openForPhysicallyChallenged !== undefined) partner.openForPhysicallyChallenged = openForPhysicallyChallenged;
    if (organisationName !== undefined) partner.organisationName = organisationName;
    if (companyType !== undefined) partner.companyType = companyType;
    if (contactPersonName !== undefined) partner.contactPersonName = contactPersonName;
    if (designation !== undefined) partner.designation = designation;
    if (mobileNumber !== undefined) partner.mobileNumber = mobileNumber;
    if (email !== undefined) partner.email = email;
    if (yourDetailsJobRole !== undefined) partner.yourDetailsJobRole = yourDetailsJobRole;
    if (yourDetailsTotalOpenings !== undefined) partner.yourDetailsTotalOpenings = yourDetailsTotalOpenings;
    if (yourDetailsState !== undefined) partner.yourDetailsState = yourDetailsState;
    if (yourDetailsCity !== undefined) partner.yourDetailsCity = yourDetailsCity;
    if (yourDetailsMinSalary !== undefined) partner.yourDetailsMinSalary = yourDetailsMinSalary;
    if (yourDetailsMaxSalary !== undefined) partner.yourDetailsMaxSalary = yourDetailsMaxSalary;
    if (salaryType !== undefined) partner.salaryType = salaryType;
    if (experienceType !== undefined) partner.experienceType = experienceType;
    if (locations !== undefined) {
      partner.locations = typeof locations === 'string' ? JSON.parse(locations) : locations;
    }

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
