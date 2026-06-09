import DashboardPage from '@/app/dashboard/DashboardPage';
import { getWeddingData } from '@/services/wedding';

export default async function Dashboard() {
    const { user , wedding } = await getWeddingData()
    

  return <DashboardPage  initialUser={user} initialWedding={wedding} />;
}