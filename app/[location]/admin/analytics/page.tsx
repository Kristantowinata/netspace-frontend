"use client";

import React, { useState, useEffect, useCallback } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import MetricCard from "@/components/admin/MetricCard";
import BarChart from "@/components/admin/BarChart";
import InterestRankList from "@/components/admin/InterestRankList";
import TimeFilter from "@/components/admin/TimeFilter";
import {
  getAnalyticsMetrics,
  getHourlyCheckIns,
  getTopInterests,
} from "@/services/adminApi";
import type {
  MetricData,
  HourlyCheckIn,
  InterestStat,
} from "@/services/adminMockData";

const TIME_OPTIONS = ["Hari ini", "7 Hari", "30 Hari"];

export default function AnalyticsPage() {
  const [timeFilter, setTimeFilter] = useState("Hari ini");
  const [metrics, setMetrics] = useState<MetricData[]>([]);
  const [hourly, setHourly] = useState<HourlyCheckIn[]>([]);
  const [interests, setInterests] = useState<InterestStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // silent=true is used by the background poll: it refreshes the numbers without
  // flipping `loading`, so the page never flashes its spinner mid-session. Only
  // the very first load (and the manual "Coba Lagi" retry) show the spinner.
  const fetchAll = useCallback((silent = false) => {
    if (!silent) {
      setLoading(true);
      setError(null);
    }
    return Promise.all([
      getAnalyticsMetrics(),
      getHourlyCheckIns(),
      getTopInterests(),
    ])
      .then(([m, h, i]) => {
        setMetrics(m);
        setHourly(h);
        setInterests(i);
        if (silent) setError(null);
      })
      .catch((err) => {
        console.error(err);
        // A failed background poll shouldn't blow away data we already have;
        // only surface the error UI on a non-silent (foreground) load.
        if (!silent) {
          setError(
            "Gagal memuat data analytics. Silakan periksa koneksi server Anda."
          );
        }
      })
      .finally(() => {
        if (!silent) setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // "User Aktif Sekarang" tracks live WebSocket connections, so poll every 10s
  // to keep the dashboard feeling real-time without a manual refresh.
  useEffect(() => {
    const id = setInterval(() => fetchAll(true), 10_000);
    return () => clearInterval(id);
  }, [fetchAll]);

  return (
    <AdminLayout>
      <div>
        {/* Header */}
        <div className="flex items-start justify-between mb-7 flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-white mb-1 tracking-tight">Analytics</h1>
            <p className="text-[13px] text-admin-text-muted">Ringkasan aktivitas dan performa lokasi.</p>
          </div>
          <TimeFilter
            options={TIME_OPTIONS}
            active={timeFilter}
            onChange={setTimeFilter}
          />
        </div>

        {error ? (
          <div className="bg-white/[0.035] backdrop-blur-[20px] border border-white/[0.06] rounded-xl py-14 px-6 flex flex-col items-center justify-center text-center gap-3">
            <div className="w-12 h-12 rounded-full bg-red-400/10 border border-red-400/20 flex items-center justify-center text-admin-danger text-lg font-bold">
              ⚠️
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Gagal Memuat Data</p>
              <p className="text-xs text-admin-text-muted mt-1 max-w-[320px]">{error}</p>
            </div>
            <button
              type="button"
              className="mt-2 inline-flex items-center justify-center px-4 py-2 rounded-lg font-[inherit] text-xs font-semibold cursor-pointer transition-all duration-200 outline-none bg-admin-primary/10 text-admin-accent border border-admin-primary/35 hover:bg-admin-primary/20 hover:border-admin-primary/50"
              onClick={() => fetchAll()}
            >
              Coba Lagi
            </button>
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-7 h-7 rounded-full border-[3px] border-admin-primary/30 border-t-admin-primary animate-admin-spin" />
          </div>
        ) : (
          <>
            {/* Metrics */}
            <div className="grid grid-cols-4 gap-4 mb-6 max-[1100px]:grid-cols-2">
              {metrics.map((m, i) => (
                <MetricCard
                  key={i}
                  label={m.label}
                  value={m.value}
                  delta={m.delta}
                  deltaType={m.deltaType}
                />
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-[1.5fr_1fr] gap-5 max-[1100px]:grid-cols-1">
              <BarChart title="Check-in per Jam" data={hourly} />
              <InterestRankList title="Top Minat" items={interests} />
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
