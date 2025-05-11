import { useEffect, useState } from 'react';
import {  MapPin, Search } from 'lucide-react';
import { useEvents } from '../../hooks/useEvents';
import { Card, CardContent } from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import { format } from 'date-fns';
import type { Event } from '../../types';

const EventsPage = () => {
  const { events, loading } = useEvents();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);

  // First useEffect to handle search filtering
  useEffect(() => {
    if (events) {
      const filtered = events.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredEvents(filtered);
    }
  }, [events, searchTerm]);

  // Second useEffect to handle upcoming/past events separation
  useEffect(() => {
    if (filteredEvents.length > 0) {
      const now = new Date();
      const upcoming = filteredEvents.filter(event => new Date(event.eventDate) >= now);
      const past = filteredEvents.filter(event => new Date(event.eventDate) < now);
      
      setUpcomingEvents(upcoming);
      setPastEvents(past);
    } else {
      setUpcomingEvents([]);
      setPastEvents([]);
    }
  }, [filteredEvents]);

  return (
    <div className="flex flex-col">
      {/* Banner Section */}
      <section
        className="relative flex min-h-[400px] items-center justify-center bg-blue-900 bg-cover bg-center text-white"
        style={{ 
          backgroundImage: `linear-gradient(rgba(30, 64, 175, 0.3), rgba(30, 64, 175, 0.3)), url('/src/Images/hero.png')` 
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-2xl md:text-4xl lg:text-[40px] font-bold text-white font-aloevera">
            Our Events
          </h1>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="mb-12 text-center">
         
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Join us for our upcoming events and activities. Connect with our community,
            learn new skills, and celebrate our cultural heritage together.
          </p>
        </div>

        {/* Search */}
        <div className="mb-12">
          <div className="mx-auto max-w-xl">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                <Search className="h-5 w-5 text-blue-600" />
              </div>
              <Input
                type="text"
                placeholder="Search events by title, description or location..."
                className="w-full rounded-full border-2 border-blue-100 bg-white py-3 pl-12 pr-4 text-gray-700 shadow-sm transition-all duration-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-800 border-t-transparent"></div>
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="space-y-12">
            {/* Upcoming Events */}
            <section>
              <h2 className="mb-6 text-2xl font-bold text-blue-800">Upcoming Events</h2>
              {upcomingEvents.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {upcomingEvents.map(event => (
                    <Card key={event.id} hover className="overflow-hidden">
                      <div className="aspect-video overflow-hidden">
                        <img 
                          src={event.imageUrl} 
                          alt={event.title} 
                          className="h-full w-full object-cover transition-transform hover:scale-105"
                        />
                      </div>
                      <CardContent className="p-6">
                        <div className="mb-3 flex items-center justify-between">
                          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                            {format(new Date(event.eventDate), 'MMM dd, yyyy')}
                          </span>
                          {event.isFeatured && (
                            <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-800">
                              Featured
                            </span>
                          )}
                        </div>
                        <h3 className="mb-2 text-xl font-semibold">{event.title}</h3>
                        <p className="mb-4 text-sm text-gray-600 line-clamp-2">{event.description}</p>
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin size={16} className="mr-1" />
                          <span>{event.location}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No upcoming events at the moment.</p>
              )}
            </section>

            {/* Past Events */}
            {pastEvents.length > 0 && (
              <section>
                <h2 className="mb-6 text-2xl font-bold text-gray-700">Past Events</h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {pastEvents.map(event => (
                    <Card key={event.id} hover className="overflow-hidden opacity-75">
                      <div className="aspect-video overflow-hidden grayscale">
                        <img 
                          src={event.imageUrl} 
                          alt={event.title} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <CardContent className="p-6">
                        <div className="mb-3">
                          <span className="rounded-full bg-gray-200 px-3 py-1 text-xs font-medium text-gray-700">
                            {format(new Date(event.eventDate), 'MMM dd, yyyy')}
                          </span>
                        </div>
                        <h3 className="mb-2 text-xl font-semibold">{event.title}</h3>
                        <p className="mb-4 text-sm text-gray-600 line-clamp-2">{event.description}</p>
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin size={16} className="mr-1" />
                          <span>{event.location}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-lg text-gray-600">No events found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;