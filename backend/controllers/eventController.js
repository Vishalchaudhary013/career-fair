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
