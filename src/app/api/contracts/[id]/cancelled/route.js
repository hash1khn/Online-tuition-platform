// src/app/api/contracts/[contractId]/cancelled.js

import { verifyToken } from "src/lib/auth";
import { query } from "src/lib/db";

export async function PATCH(req, { params }) {
  try {
    const { contractId } = params;

    if (!contractId) {
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

    // Fetch the current status of the contract
    const checkContractQuery = `
      SELECT status
      FROM hiring_contracts
      WHERE contract_id = $1;
    `;
    const { rows: contractRows } = await query(checkContractQuery, [contractId]);

    if (contractRows.length === 0) {
      return new Response(
        JSON.stringify({ message: 'Contract not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const currentStatus = contractRows[0].status;

    // Check if the contract is already cancelled
    if (currentStatus === 'cancelled') {
      return new Response(
        JSON.stringify({ message: 'Contract is already cancelled' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Update the status to 'cancelled'
    const updateStatusQuery = `
      UPDATE hiring_contracts
      SET status = 'cancelled', updated_at = NOW()
      WHERE contract_id = $1
      RETURNING *;
    `;
    const { rows: updatedContractRows } = await query(updateStatusQuery, [contractId]);

    return new Response(JSON.stringify(updatedContractRows[0]), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error updating contract status:', error);
    return new Response(
      JSON.stringify({ message: 'Failed to cancel contract', error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
