const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const DocSchema = new Schema ({

    title: {
        type: String,
        required: true
    },

    doc_id: {
        type: String,
        unique: true
    },

    status: {
        type: String,
        enum: ["pending", "approved"],
        default: "pending"
    },

    creation_date: {
        type: Date,
        default: Date.now
    },

    last_modified: {
        type: Date,
        default: Date.now
    },

    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Office",
        required: "true"
    },

    current_location: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Office",
        required: "true"
    },

    submitted_by: {
        type: String,
        required: true,
        default: ""
    },

    document_type_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DocType",
        required: "true"   
    }
})


DocSchema.pre("save", async function(next) {

    if (this.isNew && !this.doc_id) {
        const randomDigits = Math.floor(1000 + Math.random() * 9000);
        const prefix = this.title.slice(0, 3).toUpperCase();
    
        // Generate the unique doc_id
        this.doc_id = `${prefix}${randomDigits}`;
    
        // Check if doc_id already exists in the collection
        const existingDocId = await mongoose.models.Document.findOne({ doc_id: this.doc_id });
        if (existingDocId) {
          return next(new Error("Generated doc_id already exists. Please try again."));
        }
      }
    
    this.last_modified = new Date()
    next()
})

// Middleware to auto-generate doc_id before saving
// DocSchema.pre("save", async function (next) {
//     if (this.isNew && !this.doc_id) {
//       const randomDigits = Math.floor(1000 + Math.random() * 9000);
//       const prefix = this.title.slice(0, 3).toUpperCase();
  
//       // Generate the unique doc_id
//       this.doc_id = `${prefix}${randomDigits}`;
  
//       // Check if doc_id already exists in the collection
//       const existingDocId = await mongoose.models.Document.findOne({ office_id: this.office_id });
//       if (existingDocId) {
//         return next(new Error("Generated doc_id already exists. Please try again."));
//       }
//     }
//     next();
//   });


module.exports = mongoose.model('Document', DocSchema);