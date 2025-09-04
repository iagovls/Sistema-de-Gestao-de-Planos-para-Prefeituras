import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Legend,
    Tooltip,
} from "recharts";

interface GraficoProps {
    chartData: Array<{name: string; value: number}>;
}

export default function Grafico({ chartData }: GraficoProps) {

    const COLORS = ["#4CAF50", "#FF9800", "#F44336"];

    return (
        <div className="h-64 w-96">
            {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ percent, name }) =>
                                `${name} ${((percent || 0) * 100).toFixed(0)}%`
                            }
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            <Cell key={`cell-${0}`} fill={COLORS[0]} />
                            <Cell key={`cell-${1}`} fill={COLORS[1]} />
                            <Cell key={`cell-${2}`} fill={COLORS[2]} />
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                    Nenhum dado para exibir
                </div>
            )}
        </div>
    )
}