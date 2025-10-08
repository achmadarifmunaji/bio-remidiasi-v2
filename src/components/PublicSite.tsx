import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import MetricsCard from "./MetricsCard";
import InteractiveMap from "./InteractiveMap";
import TrendChart from "./TrendChart";
import ProcessInfographic from "./ProcessInfographic";
import ImageComparison from "./ImageComparison";

export default function PublicSite() {
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  const metrics = useQuery(api.labData.getMetrics);
  const locations = useQuery(api.locations.getActiveLocations);
  const labData = useQuery(api.labData.list);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">
              Platform Digitalisasi Bio-Remediasi Mikroplastik
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
              Memantau dan menganalisis efektivitas bio-remediasi dalam mengurangi 
              kontaminasi mikroplastik di lingkungan perairan
            </p>
            <div className="flex justify-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 max-w-md">
                <div className="text-3xl font-bold mb-2">
                  {metrics?.avgDegradation || 0}%
                </div>
                <div className="text-sm opacity-80">
                  Rata-rata Degradasi Mikroplastik
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
          Metrik Kunci Proyek
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricsCard
            title="Degradasi Rata-rata"
            value={`${metrics?.avgDegradation || 0}%`}
            icon="🧬"
            color="blue"
          />
          <MetricsCard
            title="Total Sampel"
            value={metrics?.totalSamples || 0}
            icon="🔬"
            color="green"
          />
          <MetricsCard
            title="Lokasi Aktif"
            value={metrics?.activeLocations || 0}
            icon="📍"
            color="purple"
          />
          <MetricsCard
            title="pH Rata-rata"
            value={metrics?.avgPh || 0}
            icon="⚗️"
            color="orange"
          />
        </div>
      </section>

      {/* Interactive Map */}
      <section className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
          Peta Lokasi Pemantauan
        </h2>
        <InteractiveMap 
          locations={locations || []}
          onLocationSelect={setSelectedLocationId}
          selectedLocationId={selectedLocationId}
        />
      </section>

      {/* Process Infographic */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
            Proses Bio-Remediasi
          </h2>
          <ProcessInfographic />
        </div>
      </section>

      {/* Data Analysis */}
      <section className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
          Analisis Data Detail
        </h2>
        
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lokasi
              </label>
              <select
                value={selectedLocationId || ""}
                onChange={(e) => setSelectedLocationId(e.target.value || null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Semua Lokasi</option>
                {locations?.map((location) => (
                  <option key={location._id} value={location._id}>
                    {location.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tanggal Mulai
              </label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tanggal Akhir
              </label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Trend Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <TrendChart
            locationId={selectedLocationId}
            startDate={new Date(dateRange.start).getTime()}
            endDate={new Date(dateRange.end).getTime()}
            metric="degradation"
            title="Tren Degradasi Mikroplastik"
          />
          <TrendChart
            locationId={selectedLocationId}
            startDate={new Date(dateRange.start).getTime()}
            endDate={new Date(dateRange.end).getTime()}
            metric="ph"
            title="Tren pH Air"
          />
        </div>

        {/* Image Comparisons */}
        <ImageComparison labData={labData || []} />
      </section>
    </div>
  );
}
