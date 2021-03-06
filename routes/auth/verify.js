const express = require('express')

//Access the connection to Heroku Database
let pool = require('../../utilities/utils').pool

const router = express.Router()

router.use(express.json())

/**
 * @api {get} /verification/{verification_code} Request to verify user
 * @apiName GetVerification
 * @apiGroup Verification
 *
 * @apiSuccess (Success 202) {boolean} success true when the user was validated
 *
 * @apiError (400: Verification code not found) {String} message "Code not found"
 */
router.get("/:id", (req, res) => {
    let theQuery = "UPDATE MEMBERS SET VERIFICATION=1 WHERE VERIFICATION_CODE=$1 RETURNING Email"
    let values = [req.params.id]

    pool.query(theQuery, values)
    .then((result) => {
        // if no result is found
        if (!result.rows.length) {
            res.status(400).send({
                message: "The verification URL is invalid."
            })
        }
        else {
            res.statusCode = 202
            res.setHeader('Content-Type', 'text/html')
            res.sendFile('views/verification.html', { root: '.' })
        }
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
