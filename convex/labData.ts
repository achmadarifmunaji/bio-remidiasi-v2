import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const labData = await ctx.db.query("labData").order("desc").collect();
    
    return await Promise.all(
      labData.map(async (data) => {
        const sample = await ctx.db.get(data.sampleId);
        const location = sample ? await ctx.db.get(sample.locationId) : null;
        
        return {
          ...data,
          sample,
          location,
          beforeImageUrl: data.beforeImageId ? await ctx.storage.getUrl(data.beforeImageId) : null,
          afterImageUrl: data.afterImageId ? await ctx.storage.getUrl(data.afterImageId) : null,
        };
      })
    );
  },
});

export const getMetrics = query({
  args: {},
  handler: async (ctx) => {
    const allData = await ctx.db.query("labData").collect();
    
    if (allData.length === 0) {
      return {
        avgDegradation: 0,
        totalSamples: 0,
        activeLocations: 0,
        avgPh: 0,
      };
    }

    const avgDegradation = allData.reduce((sum, data) => sum + data.degradationPercentage, 0) / allData.length;
    const avgPh = allData.reduce((sum, data) => sum + data.ph, 0) / allData.length;
    const totalSamples = allData.length;
    
    const locations = await ctx.db.query("locations").filter((q) => q.eq(q.field("isActive"), true)).collect();
    const activeLocations = locations.length;

    return {
      avgDegradation: Math.round(avgDegradation * 10) / 10,
      totalSamples,
      activeLocations,
      avgPh: Math.round(avgPh * 100) / 100,
    };
  },
});

export const getTrendData = query({
  args: {
    locationId: v.optional(v.id("locations")),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let data;
    
    if (args.startDate && args.endDate) {
      data = await ctx.db
        .query("labData")
        .withIndex("by_test_date", (q) => 
          q.gte("testDate", args.startDate!).lte("testDate", args.endDate!)
        )
        .order("asc")
        .collect();
    } else {
      data = await ctx.db.query("labData").order("asc").collect();
    }
    
    let filteredData = data;
    if (args.locationId) {
      const samplesAtLocation = await ctx.db
        .query("samples")
        .withIndex("by_location", (q) => q.eq("locationId", args.locationId!))
        .collect();
      
      const sampleIds = new Set(samplesAtLocation.map(s => s._id));
      filteredData = data.filter(d => sampleIds.has(d.sampleId));
    }

    return filteredData.map(d => ({
      date: d.testDate,
      degradation: d.degradationPercentage,
      ph: d.ph,
      microplasticConcentration: d.microplasticConcentration,
      temperature: d.temperature,
    }));
  },
});

export const create = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("labData", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("labData"),
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
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    return await ctx.db.patch(id, updates);
  },
});

export const remove = mutation({
  args: { id: v.id("labData") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});
