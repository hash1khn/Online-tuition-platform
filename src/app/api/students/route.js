import { query } from 'src/lib/db';
import { createStudent, updateStudent, getStudentWithSubjects, addStudentSubjects, updateStudentSubjects } from '../../../lib/studentService';
import { verifyToken } from '../../../lib/auth';

// Create a new student with subjects
export async function POST(req) {
    try {
        // Get token from the request headers
        const token = req.headers.get('Authorization')?.split(' ')[1];
        const userId = verifyToken(token); // Extract user ID from the token
        if (!userId) {
            return new Response(JSON.stringify({ message: 'Invalid token' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Extract user ID from the decoded token
        const myuserId = userId.id;
        console.log(myuserId) // Adjust based on your token payload

        if (!userId) {
            return new Response(
                JSON.stringify({ message: 'User ID not found in token' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Parse the body of the request
        const body = await req.json();
        const { subjects, ...studentData } = body;

        // Include the user_id when creating the student record
        const newStudent = await createStudent({ ...studentData, user_id: myuserId });

        // Add subjects to the student
        const studentSubjects = await addStudentSubjects(newStudent.student_id, subjects);

        return new Response(
            JSON.stringify({ ...newStudent, subjects: studentSubjects }),
            { status: 201, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error('Error creating student:', error);
        return new Response(
            JSON.stringify({ message: 'Failed to create student', error: error.message }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}

// Update a student with subjects
export async function PUT(req) {
    try {
        const body = await req.json();
        const { student_id, subjects, ...studentData } = body;

        // Update the student
        const updatedStudent = await updateStudent(student_id, studentData);

        // Update subjects
        const updatedSubjects = await updateStudentSubjects(student_id, subjects);

        return new Response(
            JSON.stringify({ ...updatedStudent, subjects: updatedSubjects }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error('Error updating student:', error);
        return new Response(
            JSON.stringify({ message: 'Failed to update student', error: error.message }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}

// Get a student with subjects
export async function GET(req) {
    try {
      // Extract the token from Authorization header
      const token = req.headers.get('Authorization')?.split(' ')[1];
      if (!token) {
        return new Response(
          JSON.stringify({ message: 'Unauthorized: No token provided' }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
      }
  
      // Verify token and extract user_id
      const userId = verifyToken(token)?.id;
      if (!userId) {
        return new Response(
          JSON.stringify({ message: 'Unauthorized: Invalid token' }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
      }
  
      // Fetch student_id using user_id
      const studentQuery = 'SELECT student_id FROM students WHERE user_id = $1';
      const { rows: studentRows } = await query(studentQuery, [userId]);
  
      if (studentRows.length === 0) {
        return new Response(
          JSON.stringify({ message: 'Student not found for the given user ID' }),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }
  
      const studentId = studentRows[0].student_id;
  
      // Fetch student details, including grade level and subjects
      const studentDetailsQuery = `
        SELECT 
          s.student_id,
          s.guardian_phone,
          s.guardian_address,
          s.guardian_name,
          gl.domain AS grade_domain,
          gl.sub_level AS grade_sub_level,
          JSON_AGG(
            JSON_BUILD_OBJECT('subject_id', sub.subject_id, 'name', sub.name)
          ) AS subjects
        FROM students s
        LEFT JOIN grade_levels gl ON s.grade_level_id = gl.grade_level_id
        LEFT JOIN student_subjects ss ON s.student_id = ss.student_id
        LEFT JOIN subjects sub ON ss.subject_id = sub.subject_id
        WHERE s.student_id = $1
        GROUP BY 
          s.student_id, 
          s.guardian_phone, 
          s.guardian_address,
          s.guardian_name,
          gl.domain, 
          gl.sub_level
      `;
  
      const { rows: studentDetails } = await query(studentDetailsQuery, [studentId]);
  
      if (studentDetails.length === 0) {
        return new Response(
          JSON.stringify({ message: 'No details found for the student' }),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }
  
      return new Response(
        JSON.stringify({ student: studentDetails[0] }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } catch (error) {
      console.error('Error fetching student details:', error);
      return new Response(
        JSON.stringify({ message: 'Failed to fetch student details', error: error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }