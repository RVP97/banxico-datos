import {
  date,
  index,
  integer,
  numeric,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const series = pgTable("series", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  frequency: text("frequency"),
  unit: text("unit"),
  lastSyncedAt: timestamp("last_synced_at"),
});

export const dataPoints = pgTable(
  "data_points",
  {
    id: integer("id").generatedByDefaultAsIdentity().primaryKey(),
    seriesId: text("series_id")
      .notNull()
      .references(() => series.id),
    date: date("date", { mode: "date" }).notNull(),
    value: numeric("value", { precision: 20, scale: 6 }).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [
    uniqueIndex("uq_series_date").on(table.seriesId, table.date),
    index("idx_series_date_range").on(table.seriesId, table.date),
  ],
);
