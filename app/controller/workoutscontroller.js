const db =require('../../config/db');

exports.musclename =async (req, res) => {
    try {
      // Assuming you have a database connection and a query function
      const muscles = await db.query('SELECT muscle_name FROM muscles');
      res.json(muscles.rows); // Assuming muscles is an array of objects with muscle_name property
    } catch (error) {
      console.error('Error fetching muscles:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  exports.workoutdetails =async (req, res) => {
    try {
      // Assuming you have a database connection and a query function
      const workout = await db.query('SELECT workout_name, quantity, description FROM workouts');
      res.json(workout.rows); // Assuming muscles is an array of objects with muscle_name property
    } catch (error) {
      console.error('Error fetching muscles:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  exports.fetchworkout= async (req, res) => {
    try {
      const result = await db.query(`
        SELECT mw.id AS muscles_workouts_id,
               m.muscle_name,

               w.workout_name,
               w.quantity,
               w.description,
               mw.accumalated_quantity,
               mw.commant ,
               mw.date ,
               mw.is_active AS workout_is_active,
               mw.created_at AS workout_created_at,
               mw.updated_at AS workout_updated_at,
               mw.status AS workout_status
        FROM muscles_workouts mw
        JOIN muscles m ON mw.muscle_id = m.id
        JOIN workouts w ON mw.workout_id = w.id;
      `);
      res.json(result.rows);
    } catch (err) {
      console.error('Error executing query', err);
      res.status(500).send('Internal Server Error');
    }
  };
  // Assuming you have already set up your Express app and configured it to parse JSON bodies using bodyParser.json()

// Example endpoint to add a record to the workouts table
exports.postwork= async (req, res) => {
    try {
      const { userId, muscleId, workoutId, accumulatedQuantity, comment, isActive, day } = req.body;
      // Construct SQL INSERT query
      const query = `
        INSERT INTO muscles_workouts (user_id, muscle_id, workout_id, accumulated_quantity, comment, is_active, day)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;
      `;
      // Execute the query
      const result = await pool.query(query, [userId, muscleId, workoutId, accumulatedQuantity, comment, isActive, day]);
      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      console.error('Error adding workout:', error);
      res.status(500).json({ success: false, error: 'An error occurred while adding workout' });
    }
  };
  
  exports.fetchFood = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
          um.id AS user_meals_id,
          df.id AS diet_foods_id,
          df.meal_type,
          df.food_name,
          df.max_cal_per_meal,
          df.description AS food_description,
          um.description AS meal_description,
          um.commant,
          um.is_active AS meal_is_active,
          um.created_at AS meal_created_at,
          um.updated_at AS meal_updated_at,
          ft.food_type_name,
          dt.diet_type_name
      FROM
          user_meals um
      JOIN
          diet_foods df ON um.diet_food_id = df.id
      JOIN
          food_types ft ON df.food_type_id = ft.id
      JOIN
          diet_types dt ON df.diet_type_id = dt.id;
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).send('Internal Server Error');
  }
};


  

  