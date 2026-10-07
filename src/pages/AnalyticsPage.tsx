import React from 'react';
import { 
  BarChart3, 
  Clock, 
  Fuel, 
  ShieldCheck, 
  Award, 
  Download, 
  Truck
} from 'lucide-react';
import { useLogistics } from '../context/LogisticsContext';
import { StatsCard } from '../components/common/StatsCard';

export const AnalyticsPage: React.FC = () => {
  const { stats, drivers, addToast } = useLogistics();

  const handleExportFullReport = () => {
    addToast('Quarterly Fleet & Operations Report PDF generated', 'success');
  };

  // Weekly volumes mock distribution
  const weeklyData = [
    { day: 'Mon', count: 18, onTime: 18 },
    { day: 'Tue', count: 24, onTime: 23 },
    { day: 'Wed', count: 28, onTime: 27 },
    { day: 'Thu', count: 22, onTime: 22 },
    { day: 'Fri', count: 32, onTime: 31 },
    { day: 'Sat', count: 15, onTime: 14 },
    { day: 'Sun', count: 11, onTime: 11 },
  ];

  const maxWeeklyCount = Math.max(...weeklyData.map((d) => d.count));

  // Fuel consumption by vehicle type
  const fuelByType = [
    { type: 'Heavy Semi-Trucks', rate: '7.8 km/L', cost: '$18,420', efficiency: 84 },
    { type: 'Cargo Vans', rate: '12.4 km/L', cost: '$6,250', efficiency: 92 },
    { type: 'Reefer Units', rate: '6.9 km/L', cost: '$12,180', efficiency: 78 },
    { type: 'Electric Delivery Vans', rate: '4.2 kWh/10km', cost: '$1,840', efficiency: 98 },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Fleet Intelligence & Operations Analytics
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Historical delivery SLAs, fuel consumption metrics, driver safety ratings, and throughput trends.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportFullReport}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all hover:scale-102 cursor-pointer active:scale-98"
        >
          <Download className="h-4 w-4" />
          <span>Export Analytics Report</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="On-Time Delivery SLA"
          value={`${stats.onTimeDeliveryRate}%`}
          subtitle="Target: >95.0% compliance"
          icon={Clock}
          accentColor="emerald"
          trend={{ value: '+1.4%', isPositive: true, label: 'vs last month' }}
        />
        <StatsCard
          title="Fleet Fuel Efficiency"
          value={`${stats.totalFuelEfficiency} km/L`}
          subtitle="Overall fleet average"
          icon={Fuel}
          accentColor="indigo"
          trend={{ value: '+0.5 km/L', isPositive: true, label: 'improved' }}
        />
        <StatsCard
          title="Fleet Utilization"
          value={`${Math.round(((stats.activeVehicles + stats.availableVehicles) / Math.max(1, stats.totalVehicles)) * 100)}%`}
          subtitle={`${stats.activeVehicles} active units in route`}
          icon={Truck}
          accentColor="cyan"
          trend={{ value: '+3.8%', isPositive: true, label: 'asset uptime' }}
        />
        <StatsCard
          title="Driver Safety Index"
          value="98.8%"
          subtitle="FMCSA & DOT audit score"
          icon={ShieldCheck}
          accentColor="purple"
          trend={{ value: 'Zero', isPositive: true, label: 'critical incidents' }}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Consignment Volume Bars (8 cols) */}
        <div className="lg:col-span-8 rounded-2xl glass-card border border-slate-200/90 dark:border-slate-800/80 p-5 flex flex-col justify-between shadow-xs dark:shadow-lg dark:shadow-black/20 transition-colors duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <span>Weekly Consignment Dispatch Volume</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Total shipments dispatched per day across all hubs</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-medium">
                <span className="h-2.5 w-2.5 rounded bg-indigo-500" /> Dispatched
              </span>
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                <span className="h-2.5 w-2.5 rounded bg-emerald-500" /> On-Time
              </span>
            </div>
          </div>

          {/* Bar Chart Graphics */}
          <div className="flex items-end justify-between gap-3 h-56 pt-6 pb-2 px-2 border-b border-slate-200/90 dark:border-slate-800/80">
            {weeklyData.map((item, index) => {
              const heightPercent = Math.round((item.count / maxWeeklyCount) * 100);
              const staggerClass = `stagger-${Math.min(index + 1, 8)}`;
              return (
                <div key={item.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group cursor-pointer">
                  <span className="text-[10px] font-bold text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:scale-110 transition-all">
                    {item.count}
                  </span>
                  <div className="w-full max-w-[42px] bg-slate-100 dark:bg-slate-800/60 rounded-t-lg overflow-hidden flex flex-col justify-end transition-all group-hover:bg-slate-200 dark:group-hover:bg-slate-800" style={{ height: `${heightPercent}%` }}>
                    <div
                      className={`w-full bg-indigo-500 rounded-t-lg transition-all duration-300 group-hover:bg-indigo-400 group-hover:brightness-110 shadow-[0_0_12px_rgba(99,102,241,0.5)] animate-bar-grow ${staggerClass}`}
                      style={{ height: '100%' }}
                    />
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{item.day}</span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-4 mt-2">
            <span>Total 7-Day Throughput: <strong className="text-slate-900 dark:text-white font-bold">150 Dispatches</strong></span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">98.7% Delivered within ETA</span>
          </div>
        </div>

        {/* Fleet Fuel & Energy Efficiency (4 cols) */}
        <div className="lg:col-span-4 rounded-2xl glass-card border border-slate-200/90 dark:border-slate-800/80 p-5 flex flex-col justify-between shadow-xs dark:shadow-lg dark:shadow-black/20 transition-colors duration-300">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
              <Fuel className="h-4.5 w-4.5 text-amber-500 dark:text-amber-400" />
              <span>Fuel & Energy Metrics</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Consumption breakdown by fleet category</p>

            <div className="space-y-4">
              {fuelByType.map((item) => (
                <div key={item.type} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/90 dark:border-slate-800/80 text-xs">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{item.type}</span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-mono font-bold">{item.rate}</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden mb-1.5">
                    <div
                      className="h-full bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                      style={{ width: `${item.efficiency}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <span>Est. Cost: {item.cost}</span>
                    <span>Efficiency: {item.efficiency}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-300 text-xs mt-4">
            <span className="font-bold block">Carbon Reduction Target:</span>
            EV fleet expansion saved 3,420 kg CO2 emissions this calendar month.
          </div>
        </div>
      </div>

      {/* Driver Scorecards & Hub Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Operators */}
        <div className="rounded-2xl glass-card border border-slate-200/90 dark:border-slate-800/80 p-5 shadow-xs dark:shadow-lg dark:shadow-black/20 transition-colors duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="h-4.5 w-4.5 text-amber-500 dark:text-amber-400" />
              <span>Top Operator Standings</span>
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">This Quarter</span>
          </div>

          <div className="space-y-3">
            {drivers.slice(0, 4).map((driver, index) => (
              <div
                key={driver.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/90 dark:border-slate-800/80 text-xs card-interactive cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-400 dark:text-slate-500 font-mono w-4">#{index + 1}</span>
                  <img
                    src={driver.avatar}
                    alt={driver.name}
                    className="h-9 w-9 rounded-xl object-cover ring-1 ring-indigo-500/30"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256';
                    }}
                  />
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{driver.name}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{driver.licenseType}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-right">
                  <div>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{driver.onTimeRate}%</span>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500">On-Time</p>
                  </div>
                  <div>
                    <span className="font-bold text-amber-600 dark:text-amber-400">{driver.rating} ★</span>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500">Rating</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Major Hub Distribution */}
        <div className="rounded-2xl glass-card border border-slate-200/90 dark:border-slate-800/80 p-5 shadow-xs dark:shadow-lg dark:shadow-black/20 transition-colors duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Truck className="h-4.5 w-4.5 text-indigo-600 dark:text-indigo-400" />
              <span>Regional Terminal Flow</span>
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">Transit Volume</span>
          </div>

          <div className="space-y-3 text-xs">
            {[
              { hub: 'New York Metro Terminal', state: 'NY', volume: '34 shipments', share: 92 },
              { hub: 'Chicago Distribution Center', state: 'IL', volume: '28 shipments', share: 85 },
              { hub: 'Dallas Lone Star Depot', state: 'TX', volume: '22 shipments', share: 74 },
              { hub: 'Atlanta Logistics Gateway', state: 'GA', volume: '19 shipments', share: 68 },
            ].map((hub) => (
              <div key={hub.hub} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/90 dark:border-slate-800/80">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{hub.hub}</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold">{hub.volume}</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.5)]"
                    style={{ width: `${hub.share}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
