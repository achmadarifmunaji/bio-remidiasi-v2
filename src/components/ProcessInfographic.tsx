export default function ProcessInfographic() {
  const steps = [
    {
      number: 1,
      title: "Pengumpulan Sampel",
      description: "Sampel air dikumpulkan dari lokasi yang terkontaminasi mikroplastik",
      icon: "🧪",
      color: "blue"
    },
    {
      number: 2,
      title: "Identifikasi Mikroorganisme",
      description: "Mikroorganisme yang mampu mendegradasi plastik diidentifikasi dan diisolasi",
      icon: "🔬",
      color: "green"
    },
    {
      number: 3,
      title: "Proses Bio-remediasi",
      description: "Mikroorganisme diaplikasikan untuk memecah struktur molekul mikroplastik",
      icon: "🧬",
      color: "purple"
    },
    {
      number: 4,
      title: "Monitoring & Analisis",
      description: "Efektivitas proses dipantau melalui analisis laboratorium berkala",
      icon: "📊",
      color: "orange"
    }
  ];

  const colorClasses = {
    blue: "bg-blue-100 text-blue-700 border-blue-200",
    green: "bg-green-100 text-green-700 border-green-200",
    purple: "bg-purple-100 text-purple-700 border-purple-200",
    orange: "bg-orange-100 text-orange-700 border-orange-200",
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step, index) => (
          <div key={step.number} className="relative">
            {/* Connector line */}
            {index < steps.length - 1 && (
              <div className="hidden lg:block absolute top-16 left-full w-6 h-0.5 bg-gray-300 z-0" />
            )}
            
            {/* Step card */}
            <div className={`relative z-10 p-6 rounded-lg border-2 ${colorClasses[step.color as keyof typeof colorClasses]}`}>
              <div className="text-center">
                <div className="text-4xl mb-3">{step.icon}</div>
                <div className="text-lg font-bold mb-2">
                  {step.number}. {step.title}
                </div>
                <p className="text-sm opacity-80">
                  {step.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Additional info */}
      <div className="mt-12 bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
          Keunggulan Bio-remediasi
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl mb-2">🌱</div>
            <h4 className="font-semibold text-gray-900 mb-1">Ramah Lingkungan</h4>
            <p className="text-sm text-gray-600">
              Menggunakan proses alami tanpa bahan kimia berbahaya
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">💰</div>
            <h4 className="font-semibold text-gray-900 mb-1">Ekonomis</h4>
            <p className="text-sm text-gray-600">
              Biaya operasional rendah dibanding metode konvensional
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">🎯</div>
            <h4 className="font-semibold text-gray-900 mb-1">Efektif</h4>
            <p className="text-sm text-gray-600">
              Mampu mendegradasi berbagai jenis mikroplastik
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
