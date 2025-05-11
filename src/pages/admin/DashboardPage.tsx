import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { useMembers } from '../../hooks/useMembers';
import { useEvents } from '../../hooks/useEvents';
import { useNotifications } from '../../hooks/useNotifications';
import { 
  BarChart, 
  Calendar, 
  LineChart, 
  TrendingUp, 
  TrendingDown, 
  Users 
} from 'lucide-react';
import { format } from 'date-fns';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const DashboardPage = () => {
  const { members } = useMembers();
  const { events } = useEvents();
  const { notifications } = useNotifications();
  
  const [stats, setStats] = useState({
    totalMembers: 0,
    newMembers: 0,
    totalEvents: 0,
    upcomingEvents: 0,
  });

  const [recentMembers, setRecentMembers] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  useEffect(() => {
    if (members.length > 0) {
      // Calculate new members (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const newMembersCount = members.filter(member => 
        new Date(member.createdAt) >= thirtyDaysAgo
      ).length;
      
      setStats(prev => ({
        ...prev,
        totalMembers: members.length,
        newMembers: newMembersCount,
      }));
      
      // Get 5 most recent members
      const recent = [...members]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);
      
      setRecentMembers(recent);
    }
  }, [members]);

  useEffect(() => {
    if (events.length > 0) {
      // Calculate upcoming events
      const today = new Date();
      
      const upcoming = events.filter(event => 
        new Date(event.eventDate) >= today
      );
      
      setStats(prev => ({
        ...prev,
        totalEvents: events.length,
        upcomingEvents: upcoming.length,
      }));
      
      // Get 5 soonest upcoming events
      const soonest = [...upcoming]
        .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime())
        .slice(0, 5);
      
      setUpcomingEvents(soonest);
    }
  }, [events]);

  // Monthly members chart data
  const getMembersChartData = () => {
    const months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - 5 + i);
      return date;
    });
    
    const monthLabels = months.map(month => format(month, 'MMM yyyy'));
    
    const monthlyData = months.map(month => {
      const monthStart = new Date(month.getFullYear(), month.getMonth(), 1);
      const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0);
      
      return members.filter(member => {
        const createdAt = new Date(member.createdAt);
        return createdAt >= monthStart && createdAt <= monthEnd;
      }).length;
    });
    
    return {
      labels: monthLabels,
      datasets: [
        {
          label: 'New Members',
          data: monthlyData,
          borderColor: 'rgb(30, 64, 175)',
          backgroundColor: 'rgba(30, 64, 175, 0.5)',
          tension: 0.3,
        },
      ],
    };
  };

  // Event distribution chart data
  const getEventChartData = () => {
    const today = new Date();
    const nextSixMonths = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() + i);
      return date;
    });
    
    const monthLabels = nextSixMonths.map(month => format(month, 'MMM yyyy'));
    
    const monthlyData = nextSixMonths.map(month => {
      const monthStart = new Date(month.getFullYear(), month.getMonth(), 1);
      const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0);
      
      return events.filter(event => {
        const eventDate = new Date(event.eventDate);
        return eventDate >= monthStart && eventDate <= monthEnd;
      }).length;
    });
    
    return {
      labels: monthLabels,
      datasets: [
        {
          label: 'Events',
          data: monthlyData,
          backgroundColor: 'rgba(220, 38, 38, 0.7)',
        },
      ],
    };
  };

  // Activity distribution chart data
  const getActivityChartData = () => {
    return {
      labels: ['Members', 'Events', 'Notifications'],
      datasets: [
        {
          data: [members.length, events.length, notifications.length],
          backgroundColor: [
            'rgba(30, 64, 175, 0.7)',
            'rgba(220, 38, 38, 0.7)',
            'rgba(59, 130, 246, 0.7)',
          ],
          borderColor: [
            'rgb(30, 64, 175)',
            'rgb(220, 38, 38)',
            'rgb(59, 130, 246)',
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600">Welcome to the Karn Kayastha Mahila Samaj admin panel</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="mr-4 rounded-full bg-blue-100 p-3 text-blue-800">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Members</p>
              <h3 className="text-2xl font-bold">{stats.totalMembers}</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="mr-4 rounded-full bg-green-100 p-3 text-green-800">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">New Members</p>
              <h3 className="text-2xl font-bold">{stats.newMembers}</h3>
              <p className="text-xs text-gray-500">Last 30 days</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="mr-4 rounded-full bg-purple-100 p-3 text-purple-800">
              <Calendar size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Events</p>
              <h3 className="text-2xl font-bold">{stats.totalEvents}</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="mr-4 rounded-full bg-yellow-100 p-3 text-yellow-800">
              <TrendingDown size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Upcoming Events</p>
              <h3 className="text-2xl font-bold">{stats.upcomingEvents}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <LineChart className="mr-2 h-5 w-5" />
              Member Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            {members.length > 0 && (
              <Line 
                data={getMembersChartData()} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        precision: 0,
                      },
                    },
                  },
                }}
                height={250}
              />
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart className="mr-2 h-5 w-5" />
              Event Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            {events.length > 0 && (
              <Bar 
                data={getEventChartData()} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        precision: 0,
                      },
                    },
                  },
                }}
                height={250}
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Activity Summary */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Activity Summary</CardTitle>
          </CardHeader>
          <CardContent>
            {members.length > 0 && events.length > 0 && notifications.length > 0 && (
              <div className="flex justify-center">
                <div style={{ height: '250px', width: '250px' }}>
                  <Doughnut 
                    data={getActivityChartData()} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom',
                        },
                      },
                    }}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Recent Members</CardTitle>
          </CardHeader>
          <CardContent>
            {recentMembers.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {recentMembers.map(member => (
                  <li key={member.id} className="flex items-center py-3">
                    <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full">
                      <img
                        src={member.photoUrl}
                        alt={member.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="ml-3">
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-gray-500">{member.designation}</p>
                    </div>
                    <div className="ml-auto text-xs text-gray-500">
                      {format(new Date(member.createdAt), 'MMM d, yyyy')}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-500">No recent members</p>
            )}
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingEvents.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {upcomingEvents.map(event => (
                  <li key={event.id} className="py-3">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-md">
                        <img
                          src={event.imageUrl}
                          alt={event.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="ml-3">
                        <p className="font-medium">{event.title}</p>
                        <p className="text-sm text-gray-500">{event.location}</p>
                      </div>
                    </div>
                    <div className="mt-1 text-xs font-medium text-blue-800">
                      {format(new Date(event.eventDate), 'EEEE, MMMM d, yyyy')}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-500">No upcoming events</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;