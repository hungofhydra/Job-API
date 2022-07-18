const Job = require('../models/Job')
const StatusCodes = require('http-status-codes').StatusCodes;
const {BadRequestError, NotFoundError} = require('../errors')

const getAllJobs = async (req, res) => {
    const jobs = await Job.find({createdBy : req.user.userId});
    res.status(StatusCodes.OK).json({jobs});
}

const getJob = async (req, res) => {
    res.send('Get job')
}

const createJob = async (req, res) => {
    req.body.createdBy = req.user.userId;
    const job = await Job.create(req.body)
    if (!job) throw new BadRequestError('Oops! Something Happened');
    res.status(StatusCodes.CREATED).json({job});
}

const updateJob = async (req, res) => {
    res.send('Update job')
}

const deleteJob = async (req, res) => {
    res.send('Delete job')
}


module.exports = {
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob
}