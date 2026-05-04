import { db } from "./src/db";
import { shopItems } from "./src/schema";
import crypto from "crypto";

async function seed() {
  await db.insert(shopItems).values([
    {
      id: crypto.randomUUID(),
      name: "Potion of Revival",
      description: "Restores HP back to 100%. Cures DEBUFF status.",
      icon: "🧪",
      apCost: 50,
      stock: -1,
    },
    {
      id: crypto.randomUUID(),
      name: "Scroll of Hint",
      description: "Gain a clue for the next hard math problem.",
      icon: "📜",
      apCost: 150,
      stock: -1,
    },
    {
      id: crypto.randomUUID(),
      name: "Shield of Exemption",
      description: "Skip one daily assignment without penalty.",
      icon: "🛡️",
      apCost: 300,
      stock: 5, // Limited stock!
    },
  ]);
  console.log("Shop items seeded!");
}

seed().catch(console.error);
