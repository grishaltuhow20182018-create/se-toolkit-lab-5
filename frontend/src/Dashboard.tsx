import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

interface ScoreBucket {
  bucket: string;
  count: number;
}

interface TimelinePoint {
  date: string;
  submissions: number;
}

interface PassRate {
  task: string;
  avg_score: number;
  attempts: number;
}

const labs = ['lab-04', 'lab-03', 'lab-05'];

const Dashboard: React.FC = () => {
  const [selectedLab, setSelectedLab] = useState<string>(labs[0]);
  const [scores, setScores] = useState<ScoreBucket[]>([]);
  const [timeline, setTimeline] = useState<TimelinePoint[]>([]);
  const [passRates, setPassRates] = useState<PassRate[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('api_key') ?? '';
    if (!token) return;

    setLoading(true);
    setError(null);

    const urls = [
      `/analytics/scores?lab=${encodeURIComponent(selectedLab)}`,
      `/analytics/timeline?lab=${encodeURIComponent(selectedLab)}`,
      `/analytics/pass-rates?lab=${encodeURIComponent(selectedLab)}`,
    ];

    Promise.all(
      urls.map((u) =>
        fetch(u, { headers: { Authorization: `Bearer ${token}` } }).then((r) => {
          if (!r.ok) throw new Error(r.statusText);
          return r.json();
        }),
      ),
    )
      .then(([scoresData, timelineData, passRatesData]) => {
        setScores(scoresData as ScoreBucket[]);
        setTimeline(timelineData as TimelinePoint[]);
        setPassRates(passRatesData as PassRate[]);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [selectedLab]);

  const scoreChartData = {
    labels: scores.map((s) => s.bucket),
    datasets: [
      {
        label: 'Count',
        data: scores.map((s) => s.count),
        backgroundColor: '#36A2EB',
      },
    ],
  };

  const timelineChartData = {
    labels: timeline.map((t) => t.date),
    datasets: [
      {
        label: 'Submissions',
        data: timeline.map((t) => t.submissions),
        borderColor: '#FF6384',
        backgroundColor: '#FF6384',
        tension: 0.4,
      },
    ],
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Analytics Dashboard</h2>
      <div style={{ marginBottom: 12 }}>
        <label>
          Select Lab:{' '}
          <select
            value={selectedLab}
            onChange={(e) => setSelectedLab(e.target.value)}
          >
            {labs.map((lab) => (
              <option key={lab} value={lab}>
                {lab}
              </option>
            ))}
          </select>
        </label>
      </div>

      {loading && <p>Loading data...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {!loading && !error && (
        <>
          <section>
            <h3>Score Distribution</h3>
            <Bar data={scoreChartData} />
          </section>
          <section>
            <h3>Submissions Over Time</h3>
            <Line data={timelineChartData} />
          </section>
          <section>
            <h3>Pass Rates</h3>
            <table>
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Avg Score</th>
                  <th>Attempts</th>
                </tr>
              </thead>
              <tbody>
                {passRates.map((p) => (
                  <tr key={p.task}>
                    <td>{p.task}</td>
                    <td>{p.avg_score}</td>
                    <td>{p.attempts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </>
      )}
    </div>
  );
};

export default Dashboard;
