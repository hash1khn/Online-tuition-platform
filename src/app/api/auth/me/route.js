import { verifyToken } from '../../../../lib/auth';
import { query } from '../../../../lib/db';

export async function GET(req) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ message: 'Authorization token required' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    const text = 'SELECT * FROM users WHERE user_id = $1';
    const result = await query(text, [decoded.id]);
    const user = result.rows[0];

    if (!user) {
      return new Response(JSON.stringify({ message: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      user: {
        id: user.user_id,
        email: user.email,
        name: user.name,
        role: user.role,
        profile_picture: user.profile_picture,
      },
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Token verification error:', error.message);
    return new Response(JSON.stringify({ message: 'Unauthorized', error: error.message }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
