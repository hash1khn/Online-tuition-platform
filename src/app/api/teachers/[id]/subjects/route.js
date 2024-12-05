import { query } from '../../../../../lib/db';

export async function GET(req, { params }) {
    try {
        const { id } = params;

        if (!id) {
            return new Response(JSON.stringify({ message: 'Teacher ID is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Query to fetch subjects for the given teacher_id
        const text = `
            SELECT ts.subject_id, s.name 
            FROM teacher_subjects ts
            JOIN subjects s ON ts.subject_id = s.subject_id
            WHERE ts.teacher_id = $1
        `;
        const values = [id];
        const { rows } = await query(text, values);

        if (rows.length === 0) {
            return new Response(JSON.stringify({ message: 'No subjects found for this teacher' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        return new Response(JSON.stringify(rows), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error fetching teacher subjects:', error);
        return new Response(JSON.stringify({ message: 'Failed to fetch subjects', error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}