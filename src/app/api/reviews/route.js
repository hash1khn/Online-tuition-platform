// src/app/api/reviews/route.js
 // Assuming you have a utility to interact with the DB

import { query } from "src/lib/db";

export async function POST(req) {
  try {
    const { contract_id, student_id, teacher_id, rating, review_text } = await req.json();

    // Validate inputs
    if (!contract_id || !student_id || !teacher_id || !rating || !review_text) {
      return new Response(
        JSON.stringify({ message: 'All fields are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return new Response(
        JSON.stringify({ message: 'Rating must be between 1 and 5' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Insert review into the database
    const insertReviewQuery = `
      INSERT INTO reviews (contract_id, student_id, teacher_id, rating, review_text, created_at)
      VALUES ($1, $2, $3, $4, $5, NOW())
      RETURNING *;
    `;
    const { rows: reviewRows } = await query(insertReviewQuery, [
      contract_id,
      student_id,
      teacher_id,
      rating,
      review_text,
    ]);

    return new Response(JSON.stringify(reviewRows[0]), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error creating review:', error);
    return new Response(
      JSON.stringify({ message: 'Failed to create review', error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
