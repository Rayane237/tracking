import 'dotenv/config';
import { connectDatabase } from './config/db.js';
import app from './app.js';

const port = process.env.PORT || 5001;

await connectDatabase();

app.listen(port, () => {
  console.log(`Dubai Global Express API running on port ${port}`);
});
