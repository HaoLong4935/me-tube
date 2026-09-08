import { relations } from "drizzle-orm";
import { integer, pgEnum, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { createSelectSchema, createInsertSchema } from "drizzle-zod"
import z from "zod";


export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    clerkId: text("clerk_id").unique().notNull(),
    name: text("name").notNull(),
    // TODO: Them banner
    imageUrl: text("image_url").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull()
}, (t) => [uniqueIndex("clerk_id_idx").on(t.clerkId)])
// Arrow function này nhận một biến t và tạo một index unique cho cột clerkID để tra cứu nhanh hơn
// Trả về một mảng các index của clerkID

export const categories = pgTable("categories", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull().unique(),
    description: text("description"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => [uniqueIndex("name_idx").on(t.name)])

export const videoVisibility = pgEnum("video_visibility", [
    "private",
    "public"
])

export const videos = pgTable("videos", {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    description: text("description"),
    muxStatus: text("mux_status"),
    thumbnailUrl: text("thumbnail_url"),
    thumbnailKey: text("thumbnail_key"),
    previewUrl: text("preview_url"),
    previewKey: text("preview_key"),
    duration: integer("duration").default(0).notNull(),
    visibility: videoVisibility("visibility").default("private").notNull(),
    muxAssetId: text("mux_asset_id").unique(),
    muxUploadId: text("mux_upload_id").unique(),
    muxPlaybackId: text("mux_playback_id").unique(),
    muxTrackId: text("mux_track_id").unique(),
    muxTrackStatus: text("mux_track_status"),
    userId: uuid("user_id").references(() => users.id, {
        onDelete: "cascade"
    }).notNull(),
    categoryId: uuid("category_id").references(() => categories.id, {
        onDelete: "set null",
    }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const videoSelectSchema = createSelectSchema(videos)
export const videoInsertSchema = createInsertSchema(videos)
// Phai update lai cach moi vi trong procedures cua video phan set update lai gia tri 
// studio bao loi vo no khong hieu duoc gia tri cua visibility la gi 
export const videoUpdateSchema = z.object({
    id: z.string().uuid(),
    title: z.string().min(1),
    description: z.string().nullable(),
    categoryId: z.string().uuid().nullable(),
    visibility: z.enum(["private", "public"]),
    thumbnailUrl: z.string().nullable(),
});

export const usersRelations = relations(users, ({ many }) => ({
    videos: many(videos),
}));

export const categoryRelations = relations(users, ({ many }) => ({
    videos: many(videos),
}));

export const videoRelations = relations(videos, ({ one }) => ({
    user: one(users, {
        fields: [videos.userId],
        references: [users.id]
    }),
    category: one(categories, {
        fields: [videos.userId],
        references: [categories.id]
    }),
}))