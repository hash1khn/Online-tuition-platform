// src/app/api/contracts/[contractId]/cancelled.js

import { verifyToken } from "src/lib/auth";
import { query } from "src/lib/db";

export async function PATCH(req, { params }) {
  try {
    const { id: contract_id } = params;

    if (!contract_id) {
      return new Response(
        JSON.stringify({ message: 'Contract ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate the contract's current status
    const contractCheckQuery = `
      SELECT * 
      FROM hiring_contracts 
      WHERE contract_id = $1 AND status = 'active';
    `;
    const { rows: contractRows } = await query(contractCheckQuery, [contract_id]);

    if (contractRows.length === 0) {
      return new Response(
        JSON.stringify({ message: 'Contract not found or not pending' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Update the status of the contract to 'accepted'
    const updateStatusQuery = `
      UPDATE hiring_contracts 
      SET status = 'cancelled', updated_at = NOW()
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