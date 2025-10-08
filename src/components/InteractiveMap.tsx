import { Id } from "../../convex/_generated/dataModel";

interface Location {
  _id: Id<"locations">;
  name: string;
  latitude: number;
  longitude: number;
  description?: string;
}

interface InteractiveMapProps {
  locations: Location[];
  onLocationSelect: (locationId: string | null) => void;
  selectedLocationId: string | null;
}

export default function InteractiveMap({ 
  locations, 
  onLocationSelect, 
  selectedLocationId 
}: InteractiveMapProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      {/* Map placeholder - In a real app, you'd use a mapping library like Leaflet or Google Maps */}
      <div className="h-96 bg-gradient-to-br from-blue-100 to-green-100 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-4">🗺️</div>
            <p className="text-gray-600 mb-4">Peta Interaktif Lokasi Pemantauan</p>
            <p className="text-sm text-gray-500">
              (Dalam implementasi nyata, gunakan library peta seperti Leaflet atau Google Maps)
            </p>
          </div>
        </div>
        
        {/* Location markers */}
        {locations.map((location, index) => (
          <button
            key={location._id}
            onClick={() => onLocationSelect(
              selectedLocationId === location._id ? null : location._id
            )}
            className={`absolute w-6 h-6 rounded-full border-2 border-white shadow-lg transition-all ${
              selectedLocationId === location._id
                ? "bg-red-500 scale-125"
                : "bg-blue-500 hover:scale-110"
            }`}
            style={{
              left: `${20 + (index * 15)}%`,
              top: `${30 + (index * 10)}%`,
            }}
            title={location.name}
          />
        ))}
      </div>
      
      {/* Location list */}
      <div className="p-4 border-t bg-gray-50">
        <h3 className="font-medium text-gray-900 mb-3">Lokasi Pemantauan</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {locations.map((location) => (
            <button
              key={location._id}
              onClick={() => onLocationSelect(
                selectedLocationId === location._id ? null : location._id
              )}
              className={`p-3 rounded-lg border text-left transition-colors ${
                selectedLocationId === location._id
                  ? "bg-blue-50 border-blue-200 text-blue-700"
                  : "bg-white border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="font-medium">{location.name}</div>
              <div className="text-sm text-gray-500">
                {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
              </div>
              {location.description && (
                <div className="text-sm text-gray-600 mt-1">
                  {location.description}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
