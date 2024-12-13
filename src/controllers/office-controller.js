const Office = require("../models/office");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secretKey = process.env.TOKEN_KEY



// Register a new office
const registerOffice = async (req, res) => {

    const { password, office_name, location, admin_name} = req.body;

    let existingOffice;

    try {
        existingOffice = await Office.findOne({office_name})
    } catch (error) {
        return console.log(error)
    }

    if (existingOffice) {
        return res.status(400).json({message: "Office already Exist! Login Instead"})
    }

    const hashedPassword = bcrypt.hashSync(password);

    const office = new Office({

        office_name,
        password: hashedPassword,
        location,
        admin_name
    })

    try {
        await office.save()
    } catch (error) {
        console.log(error);
    }

    return res.status(201).json({office})
}

// Login an Office
const loginOffice = async (req, res) => {

    const { office_id, password} = req.body;

    let existingOffice;

    try {
        existingOffice = await Office.findOne({office_id})
    } catch (error) {
        return console.log(error);
    }

    if (!existingOffice) {
        return res.status(400).json({message: "No Office by this ID"})
    }

    const isPasswordCorrect = bcrypt.compareSync(password, existingOffice.password)

    if (!isPasswordCorrect) {
        return res.status(400).json({message: "Incorrect password"});
    }

    const token = jwt.sign({ officeId: existingOffice.id, office_id: existingOffice.office_id }, secretKey , { expiresIn: '1h' });

    return res.status(200).json({message: "Login Successfully", token})
}

// Get all Offices
const getAllOffice = async (req, res) => {

    let offices;

    try {
        offices = await Office.find()
    } catch(error) {
        return console.log(console.error);
    }

    if (!offices || offices.length === 0) {
        return res.status(404).json({message: "No office found"})
    }

    return res.status(200).json({offices})
}

// Get office by ID
const getOfficeById = async(req, res) => {

    const officeId = req.params.officeId;

    let office;

    try {
        office = await Office.findById(officeId)
    } catch(error) {
        return console.log(error)
    }

    if (!office) {
        return res.status(404).json({message: "No office found by this Id"})
    }

    return res.status(200).json({office});
}

// Update office data
const updateOffice = async(req, res) => {

    const officeId = req.params.officeId;
    const { office_name, location, admin_name } = req.body;


    let office;

    try {
        office = await Office.findByIdAndUpdate(officeId, {
            office_name,
            location,
            admin_name
        })
    } catch(error) {
        return console.log(error)
    }

    if (!office) {
        return res.status(500).json({message: "Unable to update office"})
    }

    return res.status(200).json({message: "Office Updated Successfully"});
}

// Update office data
const deleteOffice = async(req, res) => {

    const officeId = req.params.officeId;

    let office;

    try {
        office = await Office.findByIdAndDelete(officeId)
    } catch(error) {
        return console.log(error)
    }

    if (!office) {
        return res.status(500).json({message: "Unable to delete office"})
    }

    return res.status(200).json({message: "Office Deleted Successfully"});
}


const getAuthOffice = async(req, res) => {

    const officeId = req.office.officeId;

    if (!officeId) {
        return res.status(403).json({message: "No authorization provided"})
    }

    let office;

    try {
        office = await Office.findOne({_id: officeId})
    } catch(err) {
        return console.log(err)
    }

    if (!office) {
        return res.status(404).json({message: "No office found"})
    }

    return res.status(200).json({office})
}


const changePassword = async (req, res) => {

    const officeId = req.params.officeId

    const { oldPassword, newPassword } = req.body

    let existingOffice;

    try {
        existingOffice = await Office.findById(officeId)
    } catch (err) {
        return console.log(err)
    }

    const comparePassword = bcrypt.compareSync(oldPassword, existingOffice.password)

    if (!comparePassword) {
        return res.status(400).json({message: "Invalid Password"})
    }

    existingOffice.password = await bcrypt.hashSync(newPassword)

    try {
        await existingOffice.save()
    } catch (err) {
        return console.log(err)
    }

    return res.status(200).json({message: "Password changed successfully"})
}



module.exports = {
    registerOffice,
    loginOffice,
    getAllOffice,
    getOfficeById,
    updateOffice,
    deleteOffice,
    getAuthOffice,
    changePassword
}