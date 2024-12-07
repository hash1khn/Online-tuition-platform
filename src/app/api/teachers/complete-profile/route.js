// src/app/api/teachers/complete-profile/route.js
import { query } from 'src/lib/db';
import { verifyToken } from '../../../../lib/auth';

export async function POST(req) {
  try {
    // Extract the token
    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return new Response(
        JSON.stringify({ message: 'Authorization token missing' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Verify the token and extract the user ID
    const userId = verifyToken(token)?.id;
    if (!userId) {
      return new Response(
        JSON.stringify({ message: 'Invalid or expired token' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Parse request body
    const {
      teaching_mode,
      bio,
      experience_years,
      hourly_rate,
      education,
      languages = [],
      duration_per_session,
    } = await req.json();

    // Insert the teacher profile into the database
    const createTeacherQuery = `
      INSERT INTO teachers (user_id, teaching_mode, bio, experience_years, hourly_rate, education, duration_per_session)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING teacher_id, user_id;
    `;
    const teacherValues = [
      userId,
      teaching_mode,
      bio,
      experience_years,
      hourly_rate,
      education,
      duration_per_session,
    ];
    const teacherResult = await query(createTeacherQuery, teacherValues);
    const newTeacher = teacherResult.rows[0];
    const teacherId = newTeacher.teacher_id;

    console.log('New Teacher ID:', teacherId);

    // Insert languages into the `teacher_languages` table
    if (languages.length > 0) {
      const insertLanguagesQuery = `
        INSERT INTO teacher_languages (teacher_id, language_id)
        VALUES ${languages.map((_, i) => `($1, $${i + 2})`).join(', ')};
      `;
      const languageValues = [teacherId, ...languages];
      await query(insertLanguagesQuery, languageValues);
    }

    return new Response(
      JSON.stringify({
        message: 'Teacher profile created successfully',
        teacher: newTeacher,
      }),
      {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({
        message: 'Failed to create profile',
        error: error.message,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
