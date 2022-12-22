const express = require("express");
const { eventModel } = require("../Models/Event.model");
const { notificationModel } = require("../Models/Notification.model");

const addEvent = async (req, res) => {
  const { eventname, description, starttime, endtime, playerslimit, user_id } =
    req.body;

  try {
    const new_event = new eventModel({
      eventname: eventname,
      description: description,
      starttime: starttime,
      endtime: endtime,
      playerslimit: playerslimit,
      user_id: user_id,
    });

    await new_event.save();
    res.send({ message: "Event added successfully", status: "Success" });
  } catch (err) {
    res.send({ message: "Event added Failed", status: err });
  }
};

const getEvent = async (req, res) => {
  const { filter_event, search } = req.query;

  if (search) {
    const event = await eventModel.find({ eventname: search });
    res.send(event);
  } else if (filter_event) {
    const event = await eventModel.find({ eventname: filter_event });
    res.send(event);
  } else {
    const event = await eventModel.find();
    res.send(event);
  }
};

const getSingleEvent = async (req, res) => {
  const { id } = req.params;
  const singleEvent = await eventModel.findOne({ _id: id });
  res.send(singleEvent);
};

const updateEvent = async (req, res) => {
  const { user_id, id } = req.body;
  const patchEvent = await eventModel.findOne({ _id: id });

  if (patchEvent.playerslimit == 0) {
    res.send("All event have been booked");
  } else {
    const updatedData = await eventModel.updateOne(
      { _id: id },
      { $set: { playerslimit: patchEvent.playerslimit - 1 } }
    );
    const deletenotification = await notificationModel.findOneAndDelete({
      user_id: user_id,
    });
    res.send("User Added Successfully");
  }
};

module.exports = {
  addEvent,
  getEvent,
  getSingleEvent,
  updateEvent,
};
