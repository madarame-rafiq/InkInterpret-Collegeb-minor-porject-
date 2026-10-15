import 'dotenv/config'
import { pool } from "./pool.js";


try {
    const result = await pool.query('SELECT current_database()');
    console.log(result.rows[0]);
} catch (error) {
    console.error(`Database error ${error}`);
    process.exitCode = 1;
}
finally{
    pool.end();
}