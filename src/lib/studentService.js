import { query } from './db';

// Insert student subjects
export const addStudentSubjects = async (student_id, subjectIds) => {
    const text = `
        INSERT INTO student_subjects (student_id, subject_id)
        VALUES ($1, $2)
        RETURNING *;
    `;

    // Use Promise.all to insert subjects concurrently
    const insertedSubjects = await Promise.all(
        subjectIds.map(async (subject_id) => {
            const { rows } = await query(text, [student_id, subject_id]);
            return rows[0];
        })
    );

    return insertedSubjects;
};

// Update student subjects
export const updateStudentSubjects = async (student_id, subjectIds) => {
    const deleteQuery = `
        DELETE FROM student_subjects WHERE student_id = $1;
    `;

    const insertQuery = `
        INSERT INTO student_subjects (student_id, subject_id)
        VALUES ($1, $2)
        RETURNING *;
    `;

    // Delete existing subjects
    await query(deleteQuery, [student_id]);

    // Insert new subjects concurrently
    const insertedSubjects = await Promise.all(
        subjectIds.map(async (subject_id) => {
            const { rows } = await query(insertQuery, [student_id, subject_id]);
            return rows[0];
        })
    );

    return insertedSubjects;
};


// Fetch student with subjects
export const getStudentWithSubjects = async (student_id) => {
    const studentQuery = `
        SELECT * FROM students WHERE student_id = $1;
    `;

    const subjectQuery = `
        SELECT s.subject_id, sub.name AS subject_name
        FROM student_subjects s
        INNER JOIN subjects sub ON s.subject_id = sub.subject_id
        WHERE s.student_id = $1;
    `;

    const { rows: studentRows } = await query(studentQuery, [student_id]);
    if (!studentRows[0]) {
        return null; // Student not found
    }

    const { rows: subjectRows } = await query(subjectQuery, [student_id]);
    return {
        ...studentRows[0],
        subjects: subjectRows,
    };
};
 // Import your database connection
// Create a new student
export const createStudent = async (studentData) => {
    const {
        user_id,
        grade_level_id,
        guardian_phone,
        guardian_name,
        guardian_address,
    } = studentData;

    const text = `
        INSERT INTO students (user_id, grade_level_id, guardian_name, guardian_phone, guardian_address)
        VALUES ($1, $2, $3, $4, $5) RETURNING *;
    `;

    const values = [user_id, grade_level_id, guardian_name, guardian_phone, guardian_address];
    const { rows } = await query(text, values);
    return rows[0];
};

// Update an existing student
export const updateStudent = async (student_id, studentData) => {
    const {
        grade_level_id,
        guardian_contact,
        guardian_phone,
        guardian_address,
    } = studentData;

    const text = `
        UPDATE students
        SET 
            grade_level_id = $1,
            guardian_contact = $2,
            guardian_phone = $3,
            guardian_address = $4,
            updated_at = NOW()
        WHERE student_id = $5
        RETURNING *;
    `;

    const values = [grade_level_id, guardian_contact, guardian_phone, guardian_address, student_id];
    const { rows } = await query(text, values);
    return rows[0];
};

// Get a student by ID
export const getStudentById = async (student_id) => {
    const text = `
        SELECT * FROM students
        WHERE student_id = $1;
    `;
    const { rows } = await query(text, [student_id]);
    return rows[0];
};
export const getStudentWithDetails = async (student_id) => {
    // Query to fetch student details along with grade level and subject information
    const studentQuery = `
        SELECT 
            s.student_id,
            s.user_id,
            s.grade_level_id,
            gl.domain AS grade_domain,
            gl.sub_level AS grade_sub_level,
            s.guardian_contact,
            s.guardian_phone,
            s.guardian_address,
            s.created_at,
            s.updated_at
        FROM 
            students s
        LEFT JOIN 
            grade_levels gl ON s.grade_level_id = gl.grade_level_id
        WHERE 
            s.student_id = $1;
    `;

    const subjectsQuery = `
        SELECT 
            ss.subject_id,
            sub.name AS subject_name,
            sub.description AS subject_description
        FROM 
            student_subjects ss
        INNER JOIN 
            subjects sub ON ss.subject_id = sub.subject_id
        WHERE 
            ss.student_id = $1;
    `;

    const { rows: studentRows } = await query(studentQuery, [student_id]);
    if (!studentRows[0]) {
        return null; // Student not found
    }

    const { rows: subjectRows } = await query(subjectsQuery, [student_id]);

    return {
        ...studentRows[0],
        subjects: subjectRows,
    };
};