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
      <div className="analytics">
        {/* Header */}
        <div className="analytics__header">
          <div>
            <h1 className="analytics__title">Analytics</h1>
            <p className="analytics__subtitle">Ringkasan aktivitas dan performa lokasi.</p>
          </div>
          <TimeFilter
            options={TIME_OPTIONS}
            active={timeFilter}
            onChange={setTimeFilter}
          />
        </div>

        {/* Metrics */}
        <div className="analytics__metrics">
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
        <div className="analytics__charts">
          <BarChart title="Check-in per Jam" data={MOCK_HOURLY_CHECKINS} />
          <InterestRankList title="Top Minat" items={MOCK_TOP_INTERESTS} />
        </div>
      </div>

      <style jsx>{`
        .analytics__header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 28px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .analytics__title {
          font-size: 24px;
          font-weight: 800;
          color: var(--admin-text, #fff);
          margin-bottom: 4px;
          letter-spacing: -0.02em;
        }

        .analytics__subtitle {
          font-size: 13px;
          color: var(--admin-text-muted, #94A3B8);
        }

        .analytics__metrics {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }

        .analytics__charts {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 20px;
        }

        @media (max-width: 1100px) {
          .analytics__metrics {
            grid-template-columns: repeat(2, 1fr);
          }

          .analytics__charts {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </AdminLayout>
  );
}
