const express = require('express')

//Access the connection to Heroku Database
let pool = require('../../utilities/utils').pool

let getHash = require('../../utilities/utils').getHash

const router = express.Router()

router.use(express.json())

/**
 * @api {get} /authentication/{verification_code} Request to verify user
 * @apiName GetVerification
 * @apiGroup Verification
 *
 * @apiSuccess (Success 202) {boolean} success true when the user was validated
 *
 * @apiError (400: Verification code not found) {String} message "Code not found"
 */
router.get("/:id", (req, res) => {
    res.type("application/json")

    let theQuery = "UPDATE MEMBERS SET VERIFICATION=1 WHERE VERIFICATION_CODE=$1 RETURNING Email"
    let values = [req.params.id]

    pool.query(theQuery, values) 
    .then(result => {
        res.status(202).send({
            success: true,
            email: result[0].email
        })
    })
    .catch(err => {
        res.status(400).send({
            success: false,
            error: err.constraint,
            message: err.detail
        })
    })
})

module.exports = router