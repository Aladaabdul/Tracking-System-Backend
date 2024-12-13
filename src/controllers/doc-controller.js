const Document = require("../models/document");
const DocType = require("../models/documentType");


//create new Document
const createDocument = async (req, res) => {

    const { title, status, created_by, current_location, submitted_by, reference_number, submitted_to, progress} = req.body;

    // let documentType;

    // try {
    //     documentType = await DocType.findOne({ type_name: document_type_id });
    // } catch (error) {
    //     return console.log(error)
    // }

    const document = new Document({
            title,
            status,
            created_by,
            current_location,
            submitted_by,
            reference_number,
            submitted_to,
            progress
    });

    try {
        await document.save()
    } catch (error) {
        return console.log(error)
    }

    return res.status(201).json({document});
}

// Get all document
const getAllDocument = async (req, res) => {

    let documents;

    try {
        documents = await Document.find();
    } catch (error) {
        return console.log(error)
    }

    if (!documents || documents.length === 0) {
        return res.status(404).json({message: "No documents found"});
    }

    return res.status(200).json({documents});
}

//Get document by Id
const getDocumentById = async (req, res) => {

    const docId = req.params.docId;

    let document;

    try {
        document = await Document.findById(docId);
    } catch (error) {
        return console.log(error)
    }

    if (!document) {
        return res.status(404).json({message: "No document found"});
    }

    return res.status(200).json({document});
}

//Update document by docId
const updateDocument = async (req, res) => {

    const docId = req.params.docId;

    const { status, progress, current_location} = req.body;

    let document

    try {
        document = await Document.findByIdAndUpdate(docId, {
            status,
            progress,
            current_location
        })
    } catch(error) {
        return console.log(error)
    }

    if (!document) {
        return res.status(500).json({message: "Unable to update document"});
    }

    return res.status(200).json({message: "Document updated successfully"});
}

const deleteDocument = async (req, res) => {

    const docId = req.params.docId;

    let document

    try {
        document = await Document.findByIdAndDelete(docId)
    } catch(error) {
        return console.log(error)
    }

    if (!document) {
        return res.status(500).json({message: "Unable to delete document"});
    }

    return res.status(200).json({message: "Document deleted successfully"});
}

const searchDocument = async (req, res) => {

    const { title, doc_id } = req.query;

    const filter = {};

    if (title) filter.title = { $regex: title, $options: 'i' };
    if (doc_id) filter.doc_id = doc_id;
    
    let documents;
    try {
        documents = await Document.find(filter);
    } catch (error) {
        return console.log(error);
    }

    if (!documents || documents.length === 0) {
        return res.status(404).json({message: "No documents found"});
    }

    return res.status(200).json(documents)
}


module.exports = {

    createDocument,
    getAllDocument,
    getDocumentById,
    updateDocument,
    deleteDocument,
    searchDocument
}