// src/lib/contractService.js

import { query } from './db';

export const createContract = async (contractData) => {
    const { student_id, teacher_id, subject_id, start_date, end_date, mode, payment_terms, status } = contractData;
    const text = `
        INSERT INTO hiring_contracts (student_id, teacher_id, subject_id, start_date, end_date, mode, payment_terms, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *
    `;
    const values = [student_id, teacher_id, subject_id, start_date, end_date, mode, payment_terms, status];
    const { rows } = await query(text, values);
    return rows[0];
};

export const getContractById = async (contract_id) => {
    const text = `
        SELECT * FROM hiring_contracts WHERE contract_id = $1
    `;
    const { rows } = await query(text, [contract_id]);
    return rows[0];
};

export const updateContractStatus = async (contract_id, status) => {
    const text = `
        UPDATE hiring_contracts SET status = $1, updated_at = NOW() WHERE contract_id = $2 RETURNING *
    `;
    const { rows } = await query(text, [status, contract_id]);
    return rows[0];
};

export const getAllContracts = async () => {
    const text = `
        SELECT * FROM hiring_contracts
    `;
    const { rows } = await query(text);
    return rows;
};

export const deleteContract = async (contract_id) => {
    const text = `
        DELETE FROM hiring_contracts WHERE contract_id = $1
    `;
    const result = await query(text, [contract_id]);
    return { success: true, message: `Contract with ID ${contract_id} deleted`, result };
};
