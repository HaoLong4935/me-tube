import { db } from "@/db";
import { categories } from "@/db/schema";

const categoriesName = [
    "Cars and vehicles",
    "Comedy",
    "Gaming",
    "Education",
    "Entertainment",
    "Film and animation",
    "Survival",
    "How-to and style",
    "Painting",
    "News and politics",
    "Horror movies",
    "Sports",
    "Dance and trends",
    "Travle and events",
    "People and blogs"
]

async function main() {
    console.log("Seeding categories...")

    try {
        const values = categoriesName.map((name) => ({
            name,
            description: `Videos related to ${name.toLowerCase()}`,
        }))

        await db.insert(categories).values(values)
        console.log("Categories seeding success");

    } catch (error) {
        console.log("Error seeding categories", error);
        process.exit(1)
    }
}

main()