// src/app/api/reviews/[teacher_id]/route.js

import { query } from "src/lib/db";

export async function GET(req, { params }) {
  try {
    const { teacher_id } = params;  // Get teacher_id from the URL params

    // Validate teacher_id
    if (!teacher_id) {
      return new Response(
        JSON.stringify({ message: 'Teacher ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Fetch reviews for the given teacher_id
    const fetchReviewsQuery = `
      SELECT r.review_id, r.contract_id, r.student_id, r.teacher_id, r.rating, r.review_text, r.created_at, 
             u.profile_picture AS student_profile_picture,
             u.name AS student_name
      FROM reviews r
      JOIN students s ON r.student_id = s.student_id
      JOIN users u ON s.user_id = u.user_id
      WHERE r.teacher_id = $1
      ORDER BY r.created_at DESC;
    `;
    
    const { rows: reviews } = await query(fetchReviewsQuery, [teacher_id]);

    // If no reviews found for the teacher
    if (reviews.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No reviews found for this teacher' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(JSON.stringify(reviews), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return new Response(
      JSON.stringify({ message: 'Failed to fetch reviews', error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
