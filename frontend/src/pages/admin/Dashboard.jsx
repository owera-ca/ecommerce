import { Package, TrendingUp, DollarSign, Users } from "lucide-react";

export default function Dashboard() {
    const stats = [
        { title: "Total Revenue", value: "$45,231.89", trend: "+20%", icon: DollarSign },
        { title: "Active Orders", value: "356", trend: "+5%", icon: TrendingUp },
        { title: "Inventory Items", value: "1,245", trend: "-2%", icon: Package },
        { title: "New Customers", value: "89", trend: "+12%", icon: Users },
    ];

    return (
        <div className="admin-dashboard fade-in">
            <div className="stats-grid">
                {stats.map((stat, i) => {
                    const Icon = stat.icon;
                    const isPositive = stat.trend.startsWith("+");
                    return (
                        <div key={i} className="stat-card">
                            <div className="stat-header">
                                <h3>{stat.title}</h3>
                                <div className="stat-icon"><Icon size={20} /></div>
                            </div>
                            <div className="stat-value">{stat.value}</div>
                            <div className={`stat-trend ${isPositive ? "positive" : "negative"}`}>
                                {stat.trend} from last month
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="recent-activity">
                <h3>Recent Orders</h3>
                <div className="table-responsive">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Status</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>#ORD-001</td>
                                <td>Jane Smith</td>
                                <td><span className="badge badge-success">Completed</span></td>
                                <td>$299.00</td>
                            </tr>
                            <tr>
                                <td>#ORD-002</td>
                                <td>Michael Scott</td>
                                <td><span className="badge badge-warning">Processing</span></td>
                                <td>$1,4999.00</td>
                            </tr>
                            <tr>
                                <td>#ORD-003</td>
                                <td>Dwight Schrute</td>
                                <td><span className="badge badge-success">Completed</span></td>
                                <td>$49.00</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
