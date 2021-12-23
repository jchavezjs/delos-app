import DashboardUI from './components/DashboardUI';

const Dashboard = () => {
  const campaigns = [
    {
      id: 1213,
      name: 'Get ID data for KYC',
      description: 'Get main information of El Salvador’s Identity documents.',
      progress: 97,
    },
    {
      id: 1211,
      name: 'Get ID data for KYC',
      description: 'Get main information of El Salvador’s Identity documents.',
      progress: 100,
    },
    {
      id: 1212,
      name: 'Get ID data for KYC',
      description: 'Get main information of El Salvador’s Identity documents.',
      progress: 54,
    }
  ];

  return (
    <DashboardUI campaigns={campaigns} />
  );
}

export default Dashboard;