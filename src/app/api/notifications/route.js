import { verifyToken } from 'src/lib/auth';
import { query } from 'src/lib/db';

export async function GET(req) {
  try {
    // Extract token from Authorization header
    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return new Response(
        JSON.stringify({ message: 'Unauthorized: No token provided' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const userId = verifyToken(token)?.id;
    if (!userId) {
      return new Response(
        JSON.stringify({ message: 'Unauthorized: Invalid token' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Determine if the user is a student or teacher
    let roleId = null; // `student_id` or `teacher_id`
    let roleType = null; // Either "student" or "teacher"

    // Check if the user is a student
    const studentQuery = 'SELECT student_id FROM students WHERE user_id = $1';
    const { rows: studentRows } = await query(studentQuery, [userId]);
    if (studentRows.length > 0) {
      roleId = studentRows[0].student_id;
      roleType = 'student';
    }

    // If not a student, check if the user is a teacher
    if (!roleId) {
      const teacherQuery = 'SELECT teacher_id FROM teachers WHERE user_id = $1';
      const { rows: teacherRows } = await query(teacherQuery, [userId]);
      if (teacherRows.length > 0) {
        roleId = teacherRows[0].teacher_id;
        roleType = 'teacher';
      }
    }

    // If neither student nor teacher
    if (!roleId) {
      return new Response(
        JSON.stringify({ message: 'User is neither a student nor a teacher' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Fetch notifications for the specific role ID
    const notificationsQuery = `
      SELECT * 
      FROM notifications 
      WHERE user_id = $1 
      ORDER BY created_at DESC
    `;
    const { rows: notifications } = await query(notificationsQuery, [roleId]);

    return new Response(
      JSON.stringify({ role: roleType, notifications }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return new Response(
      JSON.stringify({ message: 'Failed to fetch notifications', error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
