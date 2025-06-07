'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Search } from 'lucide-react';
type DiagnosticResult = {
  model: string;
  manufacturer: string;
  locked: boolean;
  blacklisted: boolean;
  batteryHealth: number;
  lastSeen: string;
  blocklist: string;
  make: string;
  serial: string;
  carrier: string;
  intendedCarrier: string;
  memory: string;
  color: string;
  simLock: string;
  fmip: string;
  coo: string;
  att: string;
  tmobile: string;
  verizon: string;
  history: string;
};

export default function DiagnosticsPage() {
  const [imei, setImei] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [searchImei, setSearchImei] = useState('');
  const [recentChecks, setRecentChecks] = useState<string[]>([]);

  const handleCheck = async () => {
    setError('');
    setResult(null);

    if (!/^[0-9]{15}$/.test(imei)) {
      setError('IMEI must be a 15-digit number.');
      return;
    }
    if (!orderNumber.trim()) {
      setError('Order number is required.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid customer email.');
      return;
    }

    setLoading(true);
    try {
      const simulatedResponse = {
        model: 'iPhone 13 Pro',
        manufacturer: 'Apple',
        locked: false,
        blacklisted: false,
        batteryHealth: 92,
        lastSeen: '2024-11-18',
        blocklist: 'Clean',
        make: 'iPhone',
        serial: 'F2LZK0010XXX',
        carrier: 'Unlocked',
        intendedCarrier: 'AT&T',
        memory: '128GB',
        color: 'Sierra Blue',
        simLock: 'None',
        fmip: 'Off',
        coo: 'CN (China)',
        att: 'Good',
        tmobile: 'Unlocked',
        verizon: 'Compatible',
        history: '1 Previous Owner'
      };
      await new Promise((r) => setTimeout(r, 800));
      setResult(simulatedResponse);
      setRecentChecks(prev => [imei, ...prev.slice(0, 4)]);
    } catch {
      setError('Failed to fetch device info.');
    }
    finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    const formatted = `BLOCKLIST status: ${result.blocklist}\nManufacturer: ${result.manufacturer}\nMake: ${result.make}\nModel: ${result.model}\nSerial number: ${result.serial}\nCarrier: ${result.carrier}\nIntended Carrier: ${result.intendedCarrier}\nMemory: ${result.memory}\nColor: ${result.color}\nSIM lock: ${result.simLock}\nFMIP (Apple only): ${result.fmip}\nCountry of Origin (COO): ${result.coo}\nATT Status: ${result.att}\nT-Mobile Status: ${result.tmobile}\nVerizon Status: ${result.verizon}\nIMEI history: ${result.history}`;
    navigator.clipboard.writeText(formatted).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">

      {!result ? (
        <div className="relative w-[360px] h-[720px]">
          <Image
            src="/iphone.svg"
            alt="Phone"
            fill
            className="object-contain pointer-events-none select-none"
          />

          <div className="absolute top-[12%] left-[10%] w-[80%] h-[76%] overflow-y-auto px-2 py-4 space-y-4">
            <h1 className="text-5xl font-bold mb-8 text-center">IMEIer</h1>



            <div className="bg-black/80 backdrop-blur-lg rounded-xl border border-white/20 shadow-inner p-4 text-white space-y-4 text-sm">            <h3 className="text-white text-lg font-semibold">New IMEI Check</h3>

              <input
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="Order #"
                className="w-full px-4 py-2 bg-white/5 rounded border border-white/20"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Customer Email"
                className="w-full px-4 py-2 bg-white/5 rounded border border-white/20"
              />
              <input
                type="text"
                value={imei}
                onChange={(e) => setImei(e.target.value)}
                placeholder="15-digit IMEI"
                className="w-full px-4 py-2 bg-white/5 rounded border border-white/20"
              />
              <button
                onClick={handleCheck}
                className="w-full py-2 bg-emerald-600 rounded hover:bg-emerald-700 transition"
              >
                {loading ? 'Checking...' : 'Run Diagnostics'}
              </button>
              {error && <p className="text-red-400 text-xs">{error}</p>}
            </div>
            <div className="bg-black/80 backdrop-blur-md p-3 rounded-xl text-white space-y-2 text-sm">
              <div className="relative">
                <input
                  type="text"
                  value={searchImei}
                  onChange={(e) => setSearchImei(e.target.value)}
                  placeholder="Search IMEI"
                  className="w-full px-4 py-2 pr-10 bg-white/5 rounded border border-white/20 text-sm"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/70" />
              </div>

            </div>
            <div>
              <h3 className="font-semibold text-white">Recent IMEI Checks</h3>
              <ul className="list-disc list-inside text-white/80 text-xs">
                {recentChecks.map((imei, idx) => (
                  <li key={idx}>{imei}</li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      ) : (
        <div className="w-full max-w-2xl bg-white/5 backdrop-blur-md rounded-xl border border-white/20 p-6 text-sm text-white space-y-4">
          <h2 className="text-xl font-bold mb-4">Diagnostic Results</h2>
          <div className="grid grid-cols-2 gap-y-2 gap-x-6">
            <p><strong>BLOCKLIST status:</strong> {result.blocklist}</p>
            <p><strong>Manufacturer:</strong> {result.manufacturer}</p>
            <p><strong>Make:</strong> {result.make}</p>
            <p><strong>Model:</strong> {result.model}</p>
            <p><strong>Serial number:</strong> {result.serial}</p>
            <p><strong>Carrier:</strong> {result.carrier}</p>
            <p><strong>Intended Carrier:</strong> {result.intendedCarrier}</p>
            <p><strong>Memory:</strong> {result.memory}</p>
            <p><strong>Color:</strong> {result.color}</p>
            <p><strong>SIM lock:</strong> {result.simLock}</p>
            <p><strong>FMIP (Apple only):</strong> {result.fmip}</p>
            <p><strong>Country of Origin (COO):</strong> {result.coo}</p>
            <p><strong>ATT Status:</strong> {result.att}</p>
            <p><strong>T-Mobile Status:</strong> {result.tmobile}</p>
            <p><strong>Verizon Status:</strong> {result.verizon}</p>
            <p><strong>IMEI history:</strong> {result.history}</p>
          </div>
          <div className="flex gap-4 mt-4">
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-emerald-600 rounded hover:bg-emerald-700 transition"
            >
              {copied ? 'Copied!' : 'Copy to Clipboard'}
            </button>
            <button
              onClick={() => window.alert('Sharing feature coming soon.')}
              className="px-4 py-2 bg-indigo-600 rounded hover:bg-indigo-700 transition"
            >
              Share
            </button>
            <button
              onClick={() => setResult(null)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded hover:bg-white/20 transition"
            >
              Go back to tool
            </button>
          </div>
        </div>
      )}

      <footer className="mt-12 text-sm text-white/70">
        <div className="flex flex-wrap justify-center gap-6">
          <a href="#" className="hover:underline">FAQ</a>
          <a href="#" className="hover:underline">Help Center</a>
          <a href="#" className="hover:underline">Knowledge Base</a>
          <a href="#" className="hover:underline">Contact Support</a>
        </div>
      </footer>
    </div>
  );
}
