import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const samples = await ctx.db.query("samples").order("desc").collect();
    
    return await Promise.all(
      samples.map(async (sample) => {
        const location = await ctx.db.get(sample.locationId);
        return {
          ...sample,
          location,
        };
      })
    );
  },
});

export const getByLocation = query({
  args: { locationId: v.id("locations") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("samples")
      .withIndex("by_location", (q) => q.eq("locationId", args.locationId))
      .order("desc")
      .collect();
  },
});

export const create = mutation({
  args: {
    sampleId: v.string(),
    locationId: v.id("locations"),
    collectionDate: v.number(),
    collectorName: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("samples", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("samples"),
    sampleId: v.string(),
    locationId: v.id("locations"),
    collectionDate: v.number(),
    collectorName: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    return await ctx.db.patch(id, updates);
  },
});

export const remove = mutation({
  args: { id: v.id("samples") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});
