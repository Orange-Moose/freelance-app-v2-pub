import dotenv from 'dotenv';
dotenv.config({ path: 'variables.env' });

const dump = (obj) => JSON.stringify(obj, null, 2);

const adminEmail = process.env.EMAIL;
const siteName = "Freelance App";

export default { dump, siteName, adminEmail }