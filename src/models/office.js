const mongoose = require("mongoose");

const Schema = mongoose.Schema

const OfficeModelSchema = new Schema({

    office_id: {
        type: String,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    office_name: {
        type: String,
        required: true
    },

    location: {
        type: String,
        required: true
    },

    admin_name: {
        type: String,
        required: true
    }
})


// Middleware to auto-generate office_id before saving
OfficeModelSchema.pre("save", async function (next) {
  
    if (this.isNew && !this.office_id) {
      const randomDigits = Math.floor(1000 + Math.random() * 9000);
    //   const prefix = this.office_name.slice(0, 3).toUpperCase();
      
      const prefix = "SPGS";
  
      // Generate the unique office_id
      this.office_id = `${prefix}${randomDigits}`;
  
      // Check if office_id already exists in the collection
      const existingOffice = await mongoose.models.Office.findOne({ office_id: this.office_id });
      if (existingOffice) {
        return next(new Error("Generated office_id already exists. Please try again."));
      }
    }
    next();
  });
  

module.exports = mongoose.model('Office', OfficeModelSchema);