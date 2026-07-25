const express = require('express');
const router = express.Router();

/**
 * @route   POST /api/contact
 * @desc    Send a contact / inquiry message to the portfolio owner.
 *          This is a placeholder endpoint – email delivery (e.g. via Nodemailer
 *          or a third-party service like SendGrid) should be wired up here.
 * @access  Public
 */
router.post('/', async (req, res) => {
  const { name, email, message } = req.body;

  // Basic field validation
  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      error: {
        type: 'VALIDATION_ERROR',
        message: 'name, email and message are required fields.',
      },
    });
  }

  // TODO: integrate email transport (Nodemailer / SendGrid / Resend)
  // Example:
  //   await transporter.sendMail({ from: email, to: OWNER_EMAIL, subject: `Message from ${name}`, text: message })

  return res.status(200).json({
    success: true,
    message: 'Your message has been received. We will get back to you shortly.',
  });
});

module.exports = router;
