import { verifyToken } from 'src/lib/auth';
import { query } from 'src/lib/db';

export async function PATCH(req) {
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

    // Check if the user is a teacher or student
    let roleId = null; // `teacher_id` or `student_id`
    let roleType = null; // "teacher" or "student"

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

    // Update notifications to mark them as read
    const updateQuery = `
      UPDATE notifications
      SET is_read = TRUE
      WHERE user_id = $1
    `;
    const result = await query(updateQuery, [roleId]); // Use roleId as user_id is stored as teacher_id/student_id

    return new Response(
      JSON.stringify({
        message: `Notifications marked as read successfully for ${roleType}`,
        updatedCount: result.rowCount,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error updating notifications:', error);
    return new Response(
      JSON.stringify({ message: 'Failed to update notifications', error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
