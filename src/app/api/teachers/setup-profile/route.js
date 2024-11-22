import { getTeacherByUserId} from '../../../../lib/teacherService';
import { verifyToken } from '../../../../lib/auth';

export async function GET(req) {
    try{
    // Extract token from headers
    const token = req.headers.get('Authorization').split(' ')[1];
        const userId = verifyToken(token);  // Extract user ID from the token
        console.log(userId)
        if (!userId) {
            return new Response(JSON.stringify({ message: 'Invalid token' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Fetch teacher info by user_id
        const teacher = await getTeacherByUserId(userId.id);

        if (!teacher) {
            return new Response(JSON.stringify({ message: 'Teacher not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        return new Response(JSON.stringify(teacher), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(JSON.stringify({ message: 'Error fetching teacher profile', error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}


