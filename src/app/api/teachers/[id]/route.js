// In pages/api/teachers/[id].js
import { getTeacherById } from '../../../../lib/teacherService';

export async function GET(req, { params }) {
    try {
        const { id } = params;  // Extract the teacher's ID from the URL parameters
        const teacher = await getTeacherById(id);
        return new Response(JSON.stringify(teacher), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error fetching teacher:', error);
        return new Response(JSON.stringify({ message: 'Error fetching teacher', error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
