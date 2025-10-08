interface LabData {
  _id: string;
  beforeImageUrl: string | null;
  afterImageUrl: string | null;
  degradationPercentage: number;
  microorganism: string;
  testDate: number;
  sample: {
    _id: string;
    _creationTime: number;
    notes?: string;
    sampleId: string;
    locationId: string;
    collectionDate: number;
    collectorName: string;
  } | null;
  location: {
    _id: string;
    _creationTime: number;
    name: string;
    latitude: number;
    longitude: number;
    description?: string;
    isActive: boolean;
  } | null;
}

interface ImageComparisonProps {
  labData: LabData[];
}

export default function ImageComparison({ labData }: ImageComparisonProps) {
  const dataWithImages = labData.filter(d => d.beforeImageUrl && d.afterImageUrl);

  if (dataWithImages.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
          Galeri Perbandingan Visual
        </h3>
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-4">📸</div>
          <p>Belum ada gambar perbandingan tersedia</p>
          <p className="text-sm mt-2">
            Gambar mikroskop sebelum dan sesudah akan ditampilkan di sini
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
        Galeri Perbandingan Visual
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {dataWithImages.slice(0, 4).map((data) => (
          <div key={data._id} className="border rounded-lg overflow-hidden">
            <div className="p-4 bg-gray-50 border-b">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {data.sample?.sampleId || "Sample"}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {data.location?.name || "Unknown Location"}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600">
                    {data.degradationPercentage}%
                  </div>
                  <div className="text-xs text-gray-500">Degradasi</div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2">
              <div className="p-4">
                <h5 className="text-sm font-medium text-gray-700 mb-2">Sebelum</h5>
                <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                  {data.beforeImageUrl ? (
                    <img
                      src={data.beforeImageUrl}
                      alt="Before treatment"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="text-gray-400 text-center">
                      <div className="text-2xl mb-1">🔬</div>
                      <div className="text-xs">Gambar Sebelum</div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="p-4">
                <h5 className="text-sm font-medium text-gray-700 mb-2">Sesudah</h5>
                <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                  {data.afterImageUrl ? (
                    <img
                      src={data.afterImageUrl}
                      alt="After treatment"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="text-gray-400 text-center">
                      <div className="text-2xl mb-1">🔬</div>
                      <div className="text-xs">Gambar Sesudah</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 border-t">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Mikroorganisme:</span>
                <span className="font-medium">{data.microorganism}</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-gray-600">Tanggal Test:</span>
                <span className="font-medium">
                  {new Date(data.testDate).toLocaleDateString('id-ID')}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {dataWithImages.length > 4 && (
        <div className="text-center mt-6">
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Lihat Semua ({dataWithImages.length} gambar)
          </button>
        </div>
      )}
    </div>
  );
}
