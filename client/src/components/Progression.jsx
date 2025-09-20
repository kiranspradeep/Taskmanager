import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";

export default function Progression({ tasks }) {
  const completed = tasks.filter(t => t.completed).length;
  const pending = tasks.filter(t => !t.completed).length;

  const data = [
    { name: "Completed", value: completed },
    { name: "Pending", value: pending }
  ];

  const COLORS = ["#22c55e", "#facc15"]; // green, yellow

  return (
    <div className="bg-white/80 shadow-lg rounded-xl p-6 backdrop-blur-md w-full h-full flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Task Progression</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
      <p className="mt-4 text-gray-700 text-lg">
        Completed: <span className="font-semibold text-green-500">{completed}</span> | Pending: <span className="font-semibold text-yellow-500">{pending}</span>
      </p>
    </div>
  );
}
