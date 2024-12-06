import { query } from 'src/lib/db';
import { createContract, getContractById, updateContractStatus, deleteContract ,getAllContracts} from '../../../lib/contractService';
import { verifyToken } from '../../../lib/auth';

export async function POST(req) {
  try {
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

    // Fetch `student_id` using `user_id`
    const studentQuery = 'SELECT student_id FROM students WHERE user_id = $1';
    const { rows: studentRows } = await query(studentQuery, [userId]);
    const studentId = studentRows[0]?.student_id;

    if (!studentId) {
      return new Response(
        JSON.stringify({ message: 'Student not found for the given user ID' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = await req.json();
    const { teacher_id, start_date, end_date, mode,subjects } = body;

    // Automatically set status to "pending"
    const status = 'pending';

    // Begin transaction
    await query('BEGIN');

    // Insert into `hiring_contracts` table
    const insertContractQuery = `
      INSERT INTO hiring_contracts (student_id, teacher_id, start_date, end_date, mode, status)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const contractValues = [studentId, teacher_id, start_date, end_date, mode,status];
    const { rows: contractRows } = await query(insertContractQuery, contractValues);
    const newContract = contractRows[0];

    // Insert into `contract_subjects` table for each subject
    const insertSubjectQuery = `
      INSERT INTO contract_subjects (contract_id, subject_id)
      VALUES ($1, $2);
    `;
    for (const subjectId of subjects) {
      await query(insertSubjectQuery, [newContract.contract_id, subjectId]);
    }

    // Commit transaction
    await query('COMMIT');

    return new Response(JSON.stringify(newContract), { status: 201, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    // Rollback transaction in case of an error
    await query('ROLLBACK');
    console.error('Error creating contract:', error);
    return new Response(
      JSON.stringify({ message: 'Failed to create contract', error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}




export async function GET(req) {
  try {
    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return new Response(
        JSON.stringify({ message: 'Unauthorized: No token provided' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Fetch `user_id` from the token
    const userId = verifyToken(token)?.id;
    if (!userId) {
      return new Response(
        JSON.stringify({ message: 'Unauthorized: Invalid token' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Determine whether the user is a student or teacher
    const studentQuery = 'SELECT student_id FROM students WHERE user_id = $1';
    const teacherQuery = 'SELECT teacher_id FROM teachers WHERE user_id = $1';

    const studentResult = await query(studentQuery, [userId]);
    const teacherResult = await query(teacherQuery, [userId]);

    const url = new URL(req.url);
    const status = url.searchParams.get('status'); // Get the status from the query parameter

    if (studentResult.rows.length > 0) {
      // User is a student
      const studentId = studentResult.rows[0].student_id;

      const queryText = `
        SELECT hc.*, 
               t.hourly_rate,
               json_agg(json_build_object('subject_id', cs.subject_id, 'subject_name', s.name)) AS subjects,
               u.name AS teacher_name,
               u.profile_picture AS teacher_profile_picture
        FROM hiring_contracts hc
        LEFT JOIN contract_subjects cs ON hc.contract_id = cs.contract_id
        LEFT JOIN subjects s ON cs.subject_id = s.subject_id
        LEFT JOIN teachers t ON hc.teacher_id = t.teacher_id
        LEFT JOIN users u ON t.user_id = u.user_id
        WHERE hc.student_id = $1 ${status ? 'AND hc.status = $2' : ''} 
        GROUP BY hc.contract_id, u.name, u.profile_picture, t.hourly_rate
      `;
      const values = status ? [studentId, status] : [studentId];
      const { rows } = await query(queryText, values);

      // Add total_price to each contract based on hourly_rate, start_date, and end_date
      const result = rows.map(contract => {
        const startDate = new Date(contract.start_date);
        const endDate = new Date(contract.end_date);
        const hourlyRate = contract.hourly_rate;

        // Calculate the number of hours between start_date and end_date
        const hours = Math.abs(endDate - startDate) / 36e5; // Convert ms to hours
        const totalPrice = hourlyRate * hours;

        // Add total_price to each contract but keep other fields unchanged
        return { ...contract, total_price: totalPrice };
      });

      return new Response(JSON.stringify(result), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } else if (teacherResult.rows.length > 0) {
      // User is a teacher
      const teacherId = teacherResult.rows[0].teacher_id;

      const queryText = `
        SELECT hc.*, 
               t.hourly_rate,
               json_agg(json_build_object('subject_id', cs.subject_id, 'subject_name', s.name)) AS subjects,
               u.profile_picture AS student_profile_picture
        FROM hiring_contracts hc
        LEFT JOIN contract_subjects cs ON hc.contract_id = cs.contract_id
        LEFT JOIN subjects s ON cs.subject_id = s.subject_id
        LEFT JOIN students st ON hc.student_id = st.student_id
        LEFT JOIN users u ON st.user_id = u.user_id
        WHERE hc.teacher_id = $1 ${status ? 'AND hc.status = $2' : ''} 
        GROUP BY hc.contract_id, u.profile_picture, t.hourly_rate
      `;
      const values = status ? [teacherId, status] : [teacherId];
      const { rows } = await query(queryText, values);

      // Add total_price to each contract based on hourly_rate, start_date, and end_date
      const result = rows.map(contract => {
        const startDate = new Date(contract.start_date);
        const endDate = new Date(contract.end_date);
        const hourlyRate = contract.hourly_rate;

        // Calculate the number of hours between start_date and end_date
        const hours = Math.abs(endDate - startDate) / 36e5; // Convert ms to hours
        const totalPrice = hourlyRate * hours;

        // Add total_price to each contract but keep other fields unchanged
        return { ...contract, total_price: totalPrice };
      });

      return new Response(JSON.stringify(result), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } else {
      return new Response(
        JSON.stringify({ message: 'User is neither a student nor a teacher' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error fetching contracts:', error);
    return new Response(
      JSON.stringify({ message: 'Failed to fetch contracts', error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}




export async function PUT(req) {
    const { contract_id, status } = await req.json();
    const updatedContract = await updateContractStatus(contract_id, status);
    return new Response(JSON.stringify(updatedContract), { status: 200 });
}

export async function DELETE(req) {
    const { contract_id } = await req.json();
    await deleteContract(contract_id);
    return new Response(JSON.stringify({ message: 'Contract deleted' }), { status: 200 });
}