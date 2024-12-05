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
        const url = new URL(req.url);
        const student_id = url.searchParams.get('student_id');

        if (!student_id) {
            return new Response(
                JSON.stringify({ message: 'Student ID is required' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const student = await getStudentWithSubjects(student_id);

        if (!student) {
            return new Response(
                JSON.stringify({ message: 'Student not found' }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

        return new Response(JSON.stringify(student), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error fetching student:', error);
        return new Response(
            JSON.stringify({ message: 'Failed to fetch student', error: error.message }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
