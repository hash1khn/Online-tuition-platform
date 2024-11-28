// src/lib/reviewService.js

export const addReview = async (reviewData) => {
    const { contract_id, student_id, teacher_id, rating, review_text } = reviewData;
    const query = `
        INSERT INTO reviews (contract_id, student_id, teacher_id, rating, review_text)
        VALUES ($1, $2, $3, $4, $5) RETURNING *
    `;
    const values = [contract_id, student_id, teacher_id, rating, review_text];
    const { rows } = await db.query(query, values);
    return rows[0];
};
