import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  locations: defineTable({
    name: v.string(),
    latitude: v.number(),
    longitude: v.number(),
    description: v.optional(v.string()),
    isActive: v.boolean(),
  }),
  
  samples: defineTable({
    sampleId: v.string(),
    locationId: v.id("locations"),
    collectionDate: v.number(),
    collectorName: v.string(),
    notes: v.optional(v.string()),
  }).index("by_location", ["locationId"])
    .index("by_date", ["collectionDate"]),
  
  labData: defineTable({
    sampleId: v.id("samples"),
    ph: v.number(),
    temperature: v.number(),
    microplasticConcentration: v.number(),
    degradationPercentage: v.number(),
    microorganism: v.string(),
    testDate: v.number(),
    beforeImageId: v.optional(v.id("_storage")),
    afterImageId: v.optional(v.id("_storage")),
    notes: v.optional(v.string()),
  }).index("by_sample", ["sampleId"])
    .index("by_test_date", ["testDate"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
