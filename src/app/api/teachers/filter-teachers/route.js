import { filterTeachers } from "../../../../lib/teacherService";


export async function POST(req) {
    try {
      const body = await req.json();
  
      // Extract filters from the request body
      const filters = {
        grade: body.grade || null,
        keyword: body.keyword || null,
        languages: body.languages || null,
        price: body.price || null,
        subjects: body.subjects || null,
      };
  
      // Fetch filtered teachers
      const teachers = await filterTeachers(filters);
  
      return new Response(JSON.stringify(teachers), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Error fetching filtered teachers:', error);
  
      return new Response(JSON.stringify({ message: 'Failed to fetch filtered teachers', error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }