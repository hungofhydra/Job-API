const express = require('express');
const checkObjectid = require('../middleware/check-object-id');
const router = express.Router();
const {
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob} = require('../controllers/jobs');


router.route('/').post(createJob).get(getAllJobs)
router.route('/:id').get(checkObjectid, getJob).delete(checkObjectid ,deleteJob).patch(checkObjectid ,updateJob);

module.exports = router