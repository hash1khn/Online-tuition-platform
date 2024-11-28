// src/lib/reviewService.js
import { query } from './db';  
export const addReview = async (reviewData) => {
    const { contract_id, student_id, teacher_id, rating, review_text } = reviewData;
    const text = `
        INSERT INTO reviews (contract_id, student_id, teacher_id, rating, review_text)
        VALUES ($1, $2, $3, $4, $5) RETURNING *
    `;
    const values = [contract_id, student_id, teacher_id, rating, review_text];
    const { rows } = await query(text, values);
    return rows[0];
};
