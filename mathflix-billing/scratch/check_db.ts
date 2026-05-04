import { db } from "../src/db";
import { students } from "../src/schema";

const all = await db.select().from(students).limit(1);
console.log(JSON.stringify(all, null, 2));
process.exit(0);
