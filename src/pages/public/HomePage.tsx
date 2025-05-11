import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useEvents } from '../../hooks/useEvents';
import { useMembers } from '../../hooks/useMembers';
import { ArrowRight, Calendar } from 'lucide-react';
import Button from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { format } from 'date-fns';
import type { Event } from '../../types';
import type { Member } from '../../types';

// Hero section background
const heroBg = "/src/Images/logo.png";

const HomePage = () => {
  const { events, loading: eventsLoading } = useEvents();
  const { members, loading: membersLoading } = useMembers();
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const [keyMembers, setKeyMembers] = useState<Member[]>([]);

  useEffect(() => {
    if (!eventsLoading && events.length > 0) {
      // Get featured or upcoming events
      const featured = events
        .filter(event => event.isFeatured || new Date(event.eventDate) >= new Date())
        .slice(0, 3);
      setFeaturedEvents(featured);
    }
  }, [events, eventsLoading]);

  useEffect(() => {
    if (!membersLoading && members.length > 0) {
      // Get first 4 members (in a real app, you'd probably filter by role/importance)
      setKeyMembers(members.slice(0, 4));
    }
  }, [members, membersLoading]);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section
        className="relative flex min-h-[700px] items-center justify-center bg-blue-900 bg-cover bg-center text-white"
        style={{ backgroundImage: `linear-gradient(rgba(30, 64, 175, 0.3), rgba(30, 64, 175, 0.3)), url(${heroBg})` }}
      >
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="mb-6 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
            Karn Kayastha Mahila Samaj
          </h1>
          <p className="mx-auto mb-8 max-w-xl text-lg leading-relaxed text-blue-100">
            Empowering women through unity, education, and cultural preservation since 2000.
          </p>
          <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <Link to="/events">
              <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white">
                Upcoming Events
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-800">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2
            className="text-2xl md:text-4xl lg:text-[40px] font-bold text-[#106AAA] text-center mb-10 font-aloevera"
          >
            About Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.3fr] gap-12">
            {/* Left: Vision, Mission, History */}
            <div className="flex flex-col space-y-6">
              {/* Vision */}
              <div className="rounded-2xl bg-red-50 p-6 shadow-sm">
                <span className="inline-block rounded-full bg-white px-4 py-2 text-lg font-semibold text-red-700 mb-4 shadow">
                  Our Vision
                </span>
                <p className="text-gray-700">
                  Fusce sed pellentesque dui. Nunc lacinia, nibh vitae gravida condimentum, turpis neque commodo mauris, id rutrum lacus nisl a risus.
                </p>
              </div>
              {/* Mission */}
              <div className="rounded-2xl bg-green-50 p-6 shadow-sm">
                <span className="inline-block rounded-full bg-white px-4 py-2 text-lg font-semibold text-red-700 mb-4 shadow">
                  Our Mission
                </span>
                <p className="text-gray-700">
                  Fusce sed pellentesque dui. Nunc lacinia, nibh vitae gravida condimentum, turpis neque commodo mauris, id rutrum lacus nisl a risus.
                </p>
              </div>
              {/* History */}
              <div className="rounded-2xl bg-blue-50 p-6 shadow-sm">
                <span className="inline-block rounded-full bg-white px-4 py-2 text-lg font-semibold text-red-700 mb-4 shadow">
                  Our History
                </span>
                <p className="text-gray-700">
                  Fusce sed pellentesque dui. Nunc lacinia, nibh vitae gravida condimentum, turpis neque commodo mauris, id rutrum lacus nisl a risus.
                </p>
              </div>
            </div>
            {/* Right: Large Card */}
            <div className="flex items-center">
              <div
                className="relative w-full h-full rounded-2xl flex flex-col justify-center items-center p-10 text-center"
                style={{
                  backgroundImage: "url('/src/Images/hero.png')", // Change to your image path
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                {/* No overlay, no text */}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h2 className="text-2xl md:text-4xl lg:text-[40px] font-bold text-[#106AAA] text-center font-aloevera mb-8">
              Upcoming Events
            </h2>
          </div>
          {eventsLoading ? (
            <div className="flex justify-center py-8">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-800 border-t-transparent"></div>
            </div>
          ) : featuredEvents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredEvents.map(event => (
                <Card key={event.id} className="rounded-2xl shadow overflow-hidden">
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
                      <Calendar size={16} className="mr-1" />
                      <span>{event.location}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600">No upcoming events at the moment.</p>
          )}
        </div>
      </section>

      {/* Key Members Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center">
            <div className="flex-1" />
            <div className="mb-10">
              <h2 className="text-2xl md:text-4xl lg:text-[40px] font-bold text-[#106AAA] text-center font-aloevera">
                Our Leadership
              </h2>
            </div>
            <div className="flex-1 flex justify-end">
           
            </div>
          </div>

          {membersLoading ? (
            <div className="flex justify-center py-8">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-800 border-t-transparent"></div>
            </div>
          ) : keyMembers.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {keyMembers.map(member => (
                <div key={member.id} className="text-center">
                  <div className="mx-auto mb-4 h-40 w-40 overflow-hidden rounded-full">
                    <img
                      src={member.photoUrl}
                      alt={member.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <h3 className="mb-1 text-xl font-semibold">{member.name}</h3>
                  <p className="mb-2 text-blue-800">{member.designation}</p>
                  {member.bio && (
                    <p className="text-sm text-gray-600 line-clamp-2">{member.bio}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600">No members information available.</p>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-red-600 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold">Join Our Community</h2>
          <p className="mx-auto mb-6 max-w-xl text-lg">
            Become a part of our growing community and help us make a difference.
          </p>
          <Link to="/contact">
            <Button
              size="lg"
              className="bg-white text-red-600 hover:bg-gray-100"
            >
              Contact Us Today
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;