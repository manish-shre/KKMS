import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { useMembers } from '../../hooks/useMembers';
import { Card, CardContent } from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import type { Member } from '../../types';

const MembersPage = () => {
  const { members, loading } = useMembers();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);

  useEffect(() => {
    if (members) {
      setFilteredMembers(
        members.filter(member =>
          member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.designation.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [members, searchTerm]);

  return (
    <div className="flex flex-col">
      {/* Banner Section */}
      <section
        className="relative flex min-h-[400px] items-center justify-center bg-blue-900 bg-cover bg-center text-white"
        style={{ 
          backgroundImage: `linear-gradient(rgba(30, 64, 175, 0.3), rgba(30, 64, 175, 0.3)), url('/hero.png')` 
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-2xl md:text-4xl lg:text-[40px] font-bold text-white font-aloevera">
            Our Members
          </h1>
        </div>
      </section>

      {/* Existing Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Meet the dedicated individuals who contribute to our community through their 
            leadership, expertise, and commitment to our shared values.
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
                placeholder="Search members by name or designation..."
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
        ) : filteredMembers.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredMembers.map(member => (
              <Card key={member.id} hover className="overflow-hidden">
                <div className="aspect-square overflow-hidden">
                  <img 
                    src={member.photoUrl} 
                    alt={member.name} 
                    className="h-full w-full object-cover transition-transform hover:scale-105"
                  />
                </div>
                <CardContent className="text-center">
                  <h3 className="mb-1 text-xl font-semibold">{member.name}</h3>
                  <p className="mb-3 text-blue-800">{member.designation}</p>
                  {member.bio && (
                    <p className="text-sm text-gray-600 line-clamp-3">{member.bio}</p>
                  )}
                  {member.contact && (
                    <p className="mt-2 text-sm text-gray-500">{member.contact}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-lg text-gray-600">No members found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MembersPage;