const DocType = require('../models/documentType');



// create new Document Type
const createDocType = async (req, res) => {

    const { type_name, description } = req.body;

    let type;

    try {
        type = DocType.findOne({type_name: type})
    } catch (error) {
        return comsole.log(error)
    }

    if (type) {
        return res.status(400).json({message: "This document type already exist"})
    }

    const doctype = new DocType({
        type_name,
        description
    });

    try {
        await doctype.save();
    } catch (error) {
        return console.log(error)
    }

    return res.status(201).json({doctype});
}

// list all Document types
const getAllDoctype = async (req, res) => {

    let doctypes;

    try {
        doctypes = await DocType.find();
    } catch (error) {
        return console.log(error)
    }

    if (!doctypes || doctypes.length === 0) {
        return res.status(404).json({message: "No document types found"})
    }

    return res.status(200).json({doctypes});
}


// Get document type by Document Id
const getDoctypeById = async (req, res) => {

    const doctypeId = req.params.doctypeId;

    let doctype;

    try {
        doctype = await DocType.findById(doctypeId)
    } catch (error) {
        return console.log(error)
    }

    if (!doctypeId) {
        return res.status(404).json({message: "No doctype found by this Id"})
    };

    return res.status(200).json({doctype});
}

module.exports = {

    createDocType,
    getAllDoctype,
    getDoctypeById
}