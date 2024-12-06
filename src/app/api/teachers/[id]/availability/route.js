// src/app/api/teachers/[id]/availability/route.js

import { getTeacherAvailabilityByTeacherId } from "src/lib/teacherService";


export async function GET(req, { params }) {
    try {
        // Extract teacher_id from the dynamic route
        const { id: teacherId } = params;

        if (!teacherId) {
            return new Response(JSON.stringify({ message: 'Teacher ID is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Retrieve availability for the teacher
        const availability = await getTeacherAvailabilityByTeacherId(teacherId);

        return new Response(JSON.stringify(availability), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error retrieving availability:', error);
        return new Response(JSON.stringify({ message: 'Failed to retrieve availability', error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
