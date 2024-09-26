const mongoose = require('mongoose');

const placementDataSchema = new mongoose.Schema({
  sno: String,
  enrolmentNo: String,
  name: String,
  discipline: String,
  degree: String,
  contactNo: String,
  emailId: String,
  accepted: String,  // "Yes" or "No"
  session: String,
  companyName: String
});

const PlacementData = mongoose.model('PlacementData', placementDataSchema, 'PlacementData'); // Use 'PlacementData' as the exact collection name

module.exports = PlacementData;
