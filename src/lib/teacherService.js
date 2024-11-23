// lib/teacherService.js
import { query } from './db';

// create teacher
export async function createTeacherProfile({
  user_id,
  teaching_mode,
  bio,
  experience_years,
  hourly_rate,
  education,
  duration_per_session,
}) {
  const text = `
        INSERT INTO teachers (user_id, teaching_mode, bio, experience_years, hourly_rate, education, duration_per_session)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *`;
  const values = [
    user_id,
    teaching_mode,
    bio,
    experience_years,
    hourly_rate,
    education,
    duration_per_session,
  ];
  const result = await query(text, values);
  return result.rows[0];
}
export async function updateTeacherProfile({
  user_id,
  teaching_mode,
  bio,
  experience_years,
  hourly_rate,
  education,
  duration_per_session,
}) {
  const text = `
        UPDATE teachers
        SET 
            teaching_mode = $1,
            bio = $2,
            experience_years = $3,
            hourly_rate = $4,
            education = $5,
            duration_per_session = $6,
            updated_at = NOW()  -- optional timestamp for record keeping
        WHERE user_id = $7
        RETURNING *;
    `;

  const values = [
    teaching_mode,
    bio,
    experience_years,
    hourly_rate,
    education,
    duration_per_session,
    user_id,
  ];

  const result = await query(text, values);
  return result.rows[0];
}
export async function updateTeacherProfileWithDetails(userId, { hourly_rate, duration_per_session, grade_levels, subjects }) {
  try {
      // Step 1: Fetch the teacher_id using the user_id
      const teacherResult = await query(
          `SELECT teacher_id FROM teachers WHERE user_id = $1`,
          [userId]
      );

      if (teacherResult.rows.length === 0) {
          throw new Error('Teacher not found for the provided user ID');
      }

      const teacherId = teacherResult.rows[0].teacher_id;

      // Step 2: Update only the provided fields in the teachers table
      const updateFields = [];
      const values = [];

      if (hourly_rate !== undefined) {
          updateFields.push(`hourly_rate = $${updateFields.length + 1}`);
          values.push(hourly_rate);
      }

      if (duration_per_session !== undefined) {
          updateFields.push(`duration_per_session = $${updateFields.length + 1}`);
          values.push(duration_per_session);
      }

      if (updateFields.length > 0) {
          values.push(teacherId);
          const updateQuery = `
              UPDATE teachers
              SET ${updateFields.join(', ')}, updated_at = NOW()
              WHERE teacher_id = $${updateFields.length + 1}
          `;

          await query(updateQuery, values);
      }

      // Step 3: Update grade levels if provided
      if (grade_levels && grade_levels.length > 0) {
          await updateTeacherGradeLevels(teacherId, grade_levels);
      }

      // Step 4: Update subjects if provided
      if (subjects && subjects.length > 0) {
          await updateTeacherSubjects(teacherId, subjects);
      }

      return { message: 'Teacher profile updated successfully' };
  } catch (error) {
      console.error('Error updating teacher profile:', error.message);
      throw new Error('Failed to update teacher profile');
  }
}
// get all
export async function getAllTeachers() {
  const text = `
      SELECT 
        t.teacher_id, 
        u.name, 
        u.email, 
        u.phone_number, 
        u.gender, 
        u.dob, 
        u.profile_picture, 
        u.area, 
        c.city_name, 
        t.teaching_mode, 
        t.bio, 
        t.is_verified,  -- Updated field name
        t.experience_years, 
        t.education, 
        t.rating, 
        t.hourly_rate,
        t.duration_per_session,  -- Added duration_per_session
        array_agg(DISTINCT lang.name) AS languages,  -- Aggregate languages
        array_agg(DISTINCT gl.sub_level) AS grade_levels,  -- Aggregate grade levels
        array_agg(DISTINCT s.name) AS subjects  -- Aggregate subjects
      FROM teachers t
      JOIN users u ON t.user_id = u.user_id
      LEFT JOIN cities c ON u.city_id = c.city_id
      LEFT JOIN teacher_languages tl ON tl.teacher_id = t.teacher_id
      LEFT JOIN languages lang ON tl.language_id = lang.language_id
      LEFT JOIN teacher_grade_levels tgl ON tgl.teacher_id = t.teacher_id
      LEFT JOIN grade_levels gl ON tgl.grade_level_id = gl.grade_level_id
      LEFT JOIN teacher_subjects ts ON ts.teacher_id = t.teacher_id
      LEFT JOIN subjects s ON ts.subject_id = s.subject_id
      GROUP BY t.teacher_id, u.user_id, c.city_name;  -- Group by to avoid aggregation errors
    `;
  const result = await query(text);
  return result.rows;
}
export async function filterTeachers(filters) {
  const { grade, keyword, languages, price, subjects } = filters;

  const conditions = [];
  const values = [];
  let index = 1;

  // Filter by grade level domain
  if (grade) {
    conditions.push(
      `t.teacher_id IN (
        SELECT tgl.teacher_id
        FROM teacher_grade_levels tgl
        JOIN grade_levels gl ON tgl.grade_level_id = gl.grade_level_id
        WHERE gl.domain = $${index}
      )`
    );
    values.push(grade);
    index += 1; // Increment index
  }

  // Filter by subjects
  if (subjects) {
    conditions.push(
      `t.teacher_id IN (
        SELECT ts.teacher_id
        FROM teacher_subjects ts
        JOIN subjects s ON ts.subject_id = s.subject_id
        WHERE s.name = $${index}
      )`
    );
    values.push(subjects);
    index += 1; // Increment index
  }

  // Filter by languages
  if (languages) {
    conditions.push(
      `t.teacher_id IN (
        SELECT tl.teacher_id
        FROM teacher_languages tl
        JOIN languages l ON tl.language_id = l.language_id
        WHERE l.name = $${index}
      )`
    );
    values.push(languages);
    index += 1; // Increment index
  }

  // Filter by price
  if (price) {
    const priceRange = price.split('-').map(Number); // Assuming `price` is a string like "500-1000"
    if (priceRange.length === 2) {
      conditions.push(`t.hourly_rate BETWEEN $${index} AND $${index + 1}`);
      values.push(priceRange[0], priceRange[1]);
      index += 2; // Increment index by 2
    }
  }

  // Filter by keyword in teacher's name, bio, or area
  if (keyword) {
    conditions.push(
      `(u.name ILIKE $${index} OR t.bio ILIKE $${index + 1} OR u.area ILIKE $${index + 2})`
    );
    const keywordFilter = `%${keyword}%`;
    values.push(keywordFilter, keywordFilter, keywordFilter);
    index += 3; // Increment index by 3
  }

  // Combine all conditions
  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const text = `
      SELECT 
        t.teacher_id, 
        u.name, 
        u.email, 
        u.phone_number, 
        u.gender, 
        u.dob, 
        u.profile_picture, 
        u.area, 
        c.city_name, 
        t.teaching_mode, 
        t.bio, 
        t.is_verified,
        t.experience_years, 
        t.education, 
        t.rating, 
        t.hourly_rate,
        t.duration_per_session,
        array_agg(DISTINCT lang.name) AS languages,
        array_agg(DISTINCT gl.sub_level) AS grade_levels,
        array_agg(DISTINCT s.name) AS subjects
      FROM teachers t
      JOIN users u ON t.user_id = u.user_id
      LEFT JOIN cities c ON u.city_id = c.city_id
      LEFT JOIN teacher_languages tl ON tl.teacher_id = t.teacher_id
      LEFT JOIN languages lang ON tl.language_id = lang.language_id
      LEFT JOIN teacher_grade_levels tgl ON tgl.teacher_id = t.teacher_id
      LEFT JOIN grade_levels gl ON tgl.grade_level_id = gl.grade_level_id
      LEFT JOIN teacher_subjects ts ON ts.teacher_id = t.teacher_id
      LEFT JOIN subjects s ON ts.subject_id = s.subject_id
      ${whereClause}
      GROUP BY t.teacher_id, u.user_id, c.city_name;
    `;

  const result = await query(text, values);
  return result.rows;
}



// get by id
export async function getTeacherById(id) {
  const result = await query(
    `
        SELECT 
            u.user_id, 
            u.email, 
            u.name, 
            u.phone_number, 
            u.gender, 
            u.dob, 
            u.profile_picture,
            u.city_id, 
            u.area, 
            t.teaching_mode, 
            t.bio, 
            t.is_verified,  -- Updated field name
            t.experience_years, 
            t.education, 
            t.rating, 
            t.hourly_rate,
            t.duration_per_session,  -- Added duration_per_session
            c.city_name, 
            c.region,
            array_agg(DISTINCT lang.name) AS languages,  -- Aggregate languages
            array_agg(DISTINCT gl.sub_level) AS grade_levels,  -- Aggregate grade levels
            array_agg(DISTINCT s.name) AS subjects  -- Aggregate subjects
        FROM teachers t
        JOIN users u ON u.user_id = t.user_id
        LEFT JOIN cities c ON u.city_id = c.city_id
        LEFT JOIN teacher_languages tl ON tl.teacher_id = t.teacher_id
        LEFT JOIN languages lang ON tl.language_id = lang.language_id
        LEFT JOIN teacher_grade_levels tgl ON tgl.teacher_id = t.teacher_id
        LEFT JOIN grade_levels gl ON tgl.grade_level_id = gl.grade_level_id
        LEFT JOIN teacher_subjects ts ON ts.teacher_id = t.teacher_id
        LEFT JOIN subjects s ON ts.subject_id = s.subject_id
        WHERE t.teacher_id = $1
        GROUP BY u.user_id, t.teacher_id, c.city_name, c.region
    `,
    [id]
  );

  return result.rows[0]; // Return the first row of the result
}

// Update teacher profile
// export async function updateTeacherProfile(user_id, updates) {
//   const {
//     name,
//     phone_number,
//     gender,
//     dob,
//     city_id,
//     area,
//     teaching_mode,
//     bio,
//     experience_years,
//     education,
//     hourly_rate,
//   } = updates;

//   // Start a transaction
//   await query('BEGIN');

//   try {
//     // Update the users table
//     await query(
//       `
//             UPDATE users
//             SET name = $1, phone_number = $2, gender = $3, dob = $4, city_id = $5, area = $6, updated_at = NOW()
//             WHERE user_id = $7
//         `,
//       [name, phone_number, gender, dob, city_id, area, user_id]
//     );

//     // Update the teachers table
//     await query(
//       `
//             UPDATE teachers
//             SET teaching_mode = $1, bio = $2, experience_years = $3, education = $4, hourly_rate = $5, updated_at = NOW()
//             WHERE user_id = $6
//         `,
//       [teaching_mode, bio, experience_years, education, hourly_rate, user_id]
//     );

//     // Commit the transaction
//     await query('COMMIT');
//     return { message: 'Teacher profile updated successfully' };
//   } catch (err) {
//     // Rollback if there's an error
//     await query('ROLLBACK');
//     throw new Error('Failed to update teacher profile');
//   }
// }

// Delete teacher profile
export async function deleteTeacherProfile(user_id) {
  const result = await query('DELETE FROM users WHERE user_id = $1 RETURNING *', [user_id]);
  return result.rowCount;
}
export async function addTeacherGradeLevels(teacherId, gradeLevelId) {
  const text = `
        INSERT INTO teacher_grade_levels (teacher_id, grade_level_id)
        VALUES ($1, $2)
        RETURNING *`;

  const values = [teacherId, gradeLevelId];
  const result = await query(text, values); // Use the imported query function
  return result.rows[0]; // Return the newly created row
}
export async function addTeacherSubjects(teacherId, subjectId) {
  const text = `
        INSERT INTO teacher_subjects (teacher_id, subject_id)
        VALUES ($1, $2)
        RETURNING *`;

  const values = [teacherId, subjectId];
  const result = await query(text, values); // Use the imported query function
  return result.rows[0]; // Return the newly created row
}

export async function addTeacherLanguages(teacherId, languageId) {
  const text = `
        INSERT INTO teacher_languages (teacher_id, language_id)
        VALUES ($1, $2)
        RETURNING *`;
  const values = [teacherId, languageId];
  const result = await query(text, values); // Use the imported query function
  return result.rows[0]; // Return the newly created row
}
// very important function
export const getTeacherIdByUserId = async (userId) => {
  const text = 'SELECT teacher_id FROM teachers WHERE user_id = $1';
  const values = [userId];

  const result = await query(text, values);

  // Check if a teacher exists for the provided user ID
  if (result.rows.length > 0) {
    return result.rows[0].teacher_id; // Return the teacher_id
  }
  throw new Error('No teacher found for this user ID');
};

export const getTeacherByUserId = async (userId) => {
  const text = `
    SELECT 
      t.*, 
      array_agg(DISTINCT lang.name) AS languages,       -- Fetch languages
      array_agg(DISTINCT gl.domain) AS domains,         -- Fetch domains
      array_agg(DISTINCT gl.sub_level) AS sub_levels,   -- Fetch sublevels
      array_agg(DISTINCT s.name) AS subjects            -- Fetch subjects
    FROM teachers t
    LEFT JOIN teacher_languages tl ON t.teacher_id = tl.teacher_id
    LEFT JOIN languages lang ON tl.language_id = lang.language_id
    LEFT JOIN teacher_grade_levels tgl ON t.teacher_id = tgl.teacher_id
    LEFT JOIN grade_levels gl ON tgl.grade_level_id = gl.grade_level_id
    LEFT JOIN teacher_subjects ts ON t.teacher_id = ts.teacher_id
    LEFT JOIN subjects s ON ts.subject_id = s.subject_id
    WHERE t.user_id = $1
    GROUP BY t.teacher_id;
  `;
  const values = [userId];

  try {
    const result = await query(text, values);

    // Check if a teacher exists for the provided user ID
    if (result.rows.length > 0) {
      return result.rows[0]; // Return teacher details with languages, domains, sublevels, and subjects
    }
    return null; // Return null if no teacher found
  } catch (error) {
    console.error('Database query error:', error);
    throw new Error('Failed to fetch teacher details'); // Generic error message
  }
};
export async function clearTeacherAvailability(teacher_id) {
  const text = `
      DELETE FROM teacher_availability
      WHERE teacher_id = $1
  `;
  const values = [teacher_id];
  await query(text, values);
}

// save teacher availability information
export const saveTeacherAvailability = async ({ teacher_id, day, start_time, end_time }) => {
  const text = `
        INSERT INTO teacher_availability (teacher_id, day, start_time, end_time)
        VALUES ($1, $2, $3, $4)
    `;
  const values = [teacher_id, day, start_time, end_time];

  await query(text, values);
};
export const getTeacherAvailabilityByTeacherId = async (teacher_id) => {
  const text = `
        SELECT day, start_time, end_time
        FROM teacher_availability
        WHERE teacher_id = $1
    `;
  const values = [teacher_id];

  const { rows } = await query(text, values);
  return rows;
};
export const updateTeacherAvailability = async ({ availability_id, start_time, end_time }) => {
  const text = `
        UPDATE teacher_availability
        SET start_time = $1, end_time = $2
        WHERE availability_id = $3
    `;
  const values = [start_time, end_time, availability_id];

  await query(text, values);
};
export const deleteTeacherAvailability = async (availability_id) => {
  const text = `
        DELETE FROM teacher_availability
        WHERE availability_id = $1
    `;
  const values = [availability_id];

  await query(text, values);
};
export async function clearTeacherLanguages(teacherId) {
  const text = `
        DELETE FROM teacher_languages
        WHERE teacher_id = $1
    `;
  const values = [teacherId];

  await query(text, values);
}
export async function clearTeacherGradeLevels(teacherId) {
  const text = `
        DELETE FROM teacher_grade_levels
        WHERE teacher_id = $1
    `;
  const values = [teacherId];

  await query(text, values);
}
export async function clearTeacherSubjects(teacherId) {
  const text = `
        DELETE FROM teacher_subjects
        WHERE teacher_id = $1
    `;
  const values = [teacherId];

  await query(text, values);
}
export async function updateTeacherLanguages(teacherId, languageIds) {
  // Clear existing languages
  await clearTeacherLanguages(teacherId);

  // Add new languages concurrently
  const languagePromises = languageIds.map((languageId) => addTeacherLanguages(teacherId, languageId));
  await Promise.all(languagePromises);
}

export async function updateTeacherGradeLevels(teacherId, gradeLevelIds) {
  // Clear existing grade levels
  await clearTeacherGradeLevels(teacherId);

  // Add new grade levels concurrently
  const gradeLevelPromises = gradeLevelIds.map((gradeLevelId) => addTeacherGradeLevels(teacherId, gradeLevelId));
  await Promise.all(gradeLevelPromises);
}

export async function updateTeacherSubjects(teacherId, subjectIds) {
  // Clear existing subjects
  await clearTeacherSubjects(teacherId);

  // Add new subjects concurrently
  const subjectPromises = subjectIds.map((subjectId) => addTeacherSubjects(teacherId, subjectId));
  await Promise.all(subjectPromises);
}


// need to create update ,delete ,get ,teacher availbility  as well
