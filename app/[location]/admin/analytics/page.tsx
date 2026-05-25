"use client";

import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import MetricCard from "@/components/admin/MetricCard";
import BarChart from "@/components/admin/BarChart";
import InterestRankList from "@/components/admin/InterestRankList";
import TimeFilter from "@/components/admin/TimeFilter";
import { MOCK_METRICS, MOCK_HOURLY_CHECKINS, MOCK_TOP_INTERESTS } from "@/services/adminMockData";

const TIME_OPTIONS = ["Hari ini", "7 Hari", "30 Hari"];

export default function AnalyticsPage() {
  const [timeFilter, setTimeFilter] = useState("Hari ini");

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

        {/* Metrics */}
        <div className="grid grid-cols-4 gap-4 mb-6 max-[1100px]:grid-cols-2">
          {MOCK_METRICS.map((m, i) => (
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
          <BarChart title="Check-in per Jam" data={MOCK_HOURLY_CHECKINS} />
          <InterestRankList title="Top Minat" items={MOCK_TOP_INTERESTS} />
        </div>
      </div>
    </AdminLayout>
  );
}
