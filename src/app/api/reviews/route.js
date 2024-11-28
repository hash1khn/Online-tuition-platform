// src/app/api/reviews/route.js

import { addReview } from '../../../lib/reviewService';

export async function POST(req) {
    const data = await req.json();
    const review = await addReview(data);
    return new Response(JSON.stringify(review), { status: 201 });
}
