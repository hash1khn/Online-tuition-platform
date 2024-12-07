import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { hashPassword } from '../../../../lib/auth';
import { query } from '../../../../lib/db';
import { createUser } from '../../../../lib/userService';

dotenv.config();

export async function POST(req) {
  try {
    const { email, password, name, phone_number, gender, city_id, area, profile_picture, role, dob } = await req.json();
    console.log({ email, password, name, phone_number, gender, city_id, area, profile_picture, role, dob });

    // Ensure role is valid (it must be 'teacher', 'student', or 'admin')
    if (!['teacher', 'student', 'admin'].includes(role)) {
      return new Response(
        JSON.stringify({ message: 'Invalid role. Must be either teacher, student, or admin.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check if the email already exists directly within the API
    const existingUserQuery = 'SELECT * FROM users WHERE email = $1';
    const existingUserResult = await query(existingUserQuery, [email]);
    const existingUser = existingUserResult.rows[0];

    if (existingUser) {
      return new Response(
        JSON.stringify({ message: 'A user with this email already exists.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Insert the user into the users table with the given role
    const newUser = await createUser({
      email,
      hashedPassword,
      name,
      phone_number,
      gender,
      role,
      city_id,
      area,
      profile_picture,
      dob,
    });

    // Send a "Thank You for Signing Up" email
    await sendThankYouEmail(email, name);

    // Respond with success and the newly created user data
    return new Response(
      JSON.stringify({ message: 'User created successfully. Thank you email sent.', user: newUser }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    // Catch any errors during user creation and respond with an error message
    return new Response(
      JSON.stringify({ message: 'Failed to create user', error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// Function to send a thank-you email
async function sendThankYouEmail(email, name) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: '"Tutorly.pk" <pk.tutorly@gmail.com>', // Sender address
    to: email, // Receiver's email
    subject: 'Welcome to Tutorly.pk!', // Dynamic subject based on role
    text: `
  Hi ${name},
  
  Welcome to Tutorly.pk - your personalized ${role === 'teacher' ? 'teaching' : 'learning'} platform!
  
  ${role === 'teacher' ? `
  We're excited to have you join our community of expert tutors. With Tutorly.pk, you can share your knowledge, connect with eager students, and make a meaningful impact. Start setting up your profile and creating your first session today!
  ` : `
  We're thrilled to have you onboard. Tutorly.pk connects you with expert tutors to help you achieve your learning goals. Explore the platform and begin your journey to success today!
  `}
  
  If you have any questions, feel free to reach out to us at support@tutorly.pk.
  
  Best Regards,
  The Tutorly.pk Team
    `.trim(), // Dynamic plain text body
    html: `
      <p>Hi ${name},</p>
      <p>Welcome to <strong>Tutorly.pk</strong> - your personalized ${role === 'teacher' ? 'teaching' : 'learning'} platform!</p>
      ${role === 'teacher' ? `
      <p>We're excited to have you join our community of expert tutors. With Tutorly.pk, you can share your knowledge, connect with eager students, and make a meaningful impact. Start setting up your profile and creating your first session today!</p>
      ` : `
      <p>We're thrilled to have you onboard. Tutorly.pk connects you with expert tutors to help you achieve your learning goals. Explore the platform and begin your journey to success today!</p>
      `}
      <p>If you have any questions, feel free to reach out to us at <a href="mailto:support@tutorly.pk">support@tutorly.pk</a>.</p>
      <p>Best Regards,</p>
      <p><strong>The Tutorly.pk Team</strong></p>
    `.trim(), // Dynamic HTML body
  };
  
  await transporter.sendMail(mailOptions);
  
}  
