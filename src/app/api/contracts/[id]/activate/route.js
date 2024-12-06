import { verifyToken } from 'src/lib/auth';
import { query } from 'src/lib/db';

export async function PATCH(req, { params }) {
    try {
      const { id: contract_id } = params;
  
      if (!contract_id) {
        return new Response(
          JSON.stringify({ message: 'Contract ID is required' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
  
      // Extract the token from the headers
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
  
      // Check if the user is a teacher
      const teacherQuery = 'SELECT teacher_id FROM teachers WHERE user_id = $1';
      const { rows: teacherRows } = await query(teacherQuery, [userId]);
      const teacherId = teacherRows[0]?.teacher_id;
  
      if (!teacherId) {
        return new Response(
          JSON.stringify({ message: 'Teacher not found for the given user ID' }),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }
  
      // Validate the contract's current status
      const contractCheckQuery = `
        SELECT * 
        FROM hiring_contracts 
        WHERE contract_id = $1 AND teacher_id = $2 AND status = 'accepted';
      `;
      const { rows: contractRows } = await query(contractCheckQuery, [contract_id, teacherId]);
  
      if (contractRows.length === 0) {
        return new Response(
          JSON.stringify({ message: 'Contract not found or not accepted' }),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }
  
      // Update the status of the contract to 'active'
      const updateStatusQuery = `
        UPDATE hiring_contracts 
        SET status = 'active', updated_at = NOW()
        WHERE contract_id = $1
        RETURNING *;
      `;
      const { rows: updatedRows } = await query(updateStatusQuery, [contract_id]);
  
      return new Response(JSON.stringify(updatedRows[0]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Error updating contract status:', error);
      return new Response(
        JSON.stringify({ message: 'Failed to update contract status', error: error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }