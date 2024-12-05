// src/app/api/teachers/complete-profile/route.js
import { verifyToken } from '../../../../lib/auth';

export async function POST(req) {
    const client = await db.connect();

    try {
        // Begin transaction
        await client.query('BEGIN');

        // Extract the token and payload (Assuming you are using JWT)
        const token = req.headers.get('Authorization')?.split(' ')[1];
        const userId = verifyToken(token); // Extract user ID from the token
        if (!userId) {
            return new Response(JSON.stringify({ message: 'Invalid token' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Extract the teacher-specific details from the request body
        const {
            teaching_mode,
            bio,
            experience_years,
            hourly_rate,
            education,
            languages = [],
            duration_per_session,
        } = await req.json();

        // Log the received values for debugging
        console.log('Received Values:', {
            user_id: userId.id,
            teaching_mode,
            bio,
            experience_years,
            hourly_rate,
            education,
            duration_per_session,
            languages,
        });

        // Insert the teacher profile into the database
        const createTeacherQuery = `
            INSERT INTO teachers (user_id, teaching_mode, bio, experience_years, hourly_rate, education, duration_per_session)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *`;
        const teacherValues = [
            userId.id,
            teaching_mode,
            bio,
            experience_years,
            hourly_rate,
            education,
            duration_per_session,
        ];
        const teacherResult = await client.query(createTeacherQuery, teacherValues);
        const newTeacherProfile = teacherResult.rows[0];

        // Handle multiple languages
        for (const languageId of languages) {
            const addLanguageQuery = `
                INSERT INTO teacher_languages (teacher_id, language_id)
                VALUES ($1, $2)
                RETURNING *`;
            const languageValues = [newTeacherProfile.teacher_id, languageId];
            await client.query(addLanguageQuery, languageValues);
        }

        // Commit transaction
        await client.query('COMMIT');

        return new Response(
            JSON.stringify({
                message: 'Teacher profile created successfully',
                teacher: newTeacherProfile,
            }),
            {
                status: 201,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    } catch (error) {
        // Rollback transaction in case of an error
        await client.query('ROLLBACK');
        console.error('Error:', error);
        return new Response(
            JSON.stringify({ message: 'Failed to create profile', error: error.message }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    } finally {
        // Release the client
        client.release();
    }
}