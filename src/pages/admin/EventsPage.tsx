import { useState, useEffect } from 'react';
import { useEvents } from '../../hooks/useEvents';
import { Event } from '../../types';
import { 
  Calendar as CalendarIcon,
  Eye, 
  MapPin,
  Pencil, 
  Plus, 
  Search, 
  Trash, 
  X
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import TextArea from '../../components/ui/TextArea';
import FormField from '../../components/ui/FormField';
import ImageUpload from '../../components/ui/ImageUpload';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Event>, file?: File) => void;
  initialData: Event | null;
  isLoading: boolean;
}

const EventModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData = null,
  isLoading 
}: EventModalProps) => {
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm({
    defaultValues: initialData || {
      title: '',
      description: '',
      eventDate: format(new Date(), 'yyyy-MM-dd'),
      location: '',
      isFeatured: false,
      imageUrl: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    }
  });

  // Reset form when initialData changes
  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const [file, setFile] = useState<File | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (selectedFile: File) => {
    setFile(selectedFile);
  };

  const handleFormSubmit = (data: Partial<Event>) => {
    onSubmit(data, file || undefined);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <Card className="w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>{initialData ? 'Edit Event' : 'Add New Event'}</CardTitle>
          <button 
            onClick={onClose}
            className="rounded-full p-1 text-gray-500 transition-colors hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <FormField
              label="Title"
              htmlFor="title"
              error={errors.title?.message}
              required
            >
              <Input
                id="title"
                {...register('title', { required: 'Title is required' })}
                error={errors.title?.message}
              />
            </FormField>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                label="Event Date"
                htmlFor="eventDate"
                error={errors.eventDate?.message}
                required
              >
                <Input
                  id="eventDate"
                  type="date"
                  {...register('eventDate', { required: 'Event date is required' })}
                  error={errors.eventDate?.message}
                />
              </FormField>

              <FormField
                label="Location"
                htmlFor="location"
                error={errors.location?.message}
                required
              >
                <Input
                  id="location"
                  {...register('location', { required: 'Location is required' })}
                  error={errors.location?.message}
                />
              </FormField>
            </div>

            <FormField
              label="Description"
              htmlFor="description"
              error={errors.description?.message}
              required
            >
              <TextArea
                id="description"
                {...register('description', { required: 'Description is required' })}
                error={errors.description?.message}
                rows={4}
              />
            </FormField>

            <div className="flex items-center space-x-2">
              <input
                id="isFeatured"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-blue-800 focus:ring-blue-500"
                {...register('isFeatured')}
              />
              <label htmlFor="isFeatured" className="text-sm font-medium text-gray-700">
                Featured Event (will be highlighted on the homepage)
              </label>
            </div>

            <FormField
              label="Event Image"
              htmlFor="imageUrl"
              error={errors.imageUrl?.message}
              required
            >
              <ImageUpload
                onFileChange={handleFileChange}
                initialImage={watch('imageUrl')}
                error={errors.imageUrl?.message}
              />
              <Input
                id="imageUrl"
                type="hidden"
                {...register('imageUrl', { required: 'Image URL is required' })}
              />
            </FormField>

            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                isLoading={isLoading}
              >
                {initialData ? 'Update' : 'Add'} Event
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

interface ViewEventModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
}

const ViewEventModal = ({ event, isOpen, onClose }: ViewEventModalProps) => {
  if (!isOpen || !event) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <Card className="w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Event Details</CardTitle>
          <button 
            onClick={onClose}
            className="rounded-full p-1 text-gray-500 transition-colors hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="overflow-hidden rounded-lg">
              <img 
                src={event.imageUrl} 
                alt={event.title} 
                className="h-56 w-full object-cover"
              />
            </div>
            
            <div>
              <h3 className="text-2xl font-bold">{event.title}</h3>
              
              <div className="mt-2 flex flex-wrap gap-y-2 text-sm">
                <div className="mr-4 flex items-center text-gray-600">
                  <CalendarIcon size={16} className="mr-1" />
                  {format(new Date(event.eventDate), 'MMMM d, yyyy')}
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin size={16} className="mr-1" />
                  {event.location}
                </div>
              </div>
              
              {event.isFeatured && (
                <div className="mt-2">
                  <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
                    Featured Event
                  </span>
                </div>
              )}
            </div>
            
            <div>
              <h4 className="mb-2 text-sm font-semibold text-gray-500">Description</h4>
              <p className="text-gray-700">{event.description}</p>
            </div>
            
            <div>
              <h4 className="mb-1 text-sm font-semibold text-gray-500">Added On</h4>
              <p className="text-gray-600">{format(new Date(event.createdAt), 'MMMM d, yyyy')}</p>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <Button 
              variant="outline" 
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  eventTitle: string | undefined;
  isLoading: boolean;
}

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, eventTitle, isLoading }: ConfirmDeleteModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Confirm Deletion</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-center">
            Are you sure you want to delete <span className="font-semibold">{eventTitle}</span>? This action cannot be undone.
          </p>
          <div className="flex justify-center space-x-4">
            <Button 
              variant="outline" 
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button 
              variant="danger"
              onClick={onConfirm}
              isLoading={isLoading}
            >
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const AdminEventsPage = () => {
  const { events, loading, createEvent, updateEvent, deleteEvent } = useEvents();
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filterType, setFilterType] = useState('all'); // 'all', 'upcoming', 'past'

  // Filter events based on search term and filter type
  const filteredEvents = events.filter(event => {
    const matchesSearch = 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;
    
    const eventDate = new Date(event.eventDate);
    const today = new Date();
    
    if (filterType === 'upcoming') {
      return eventDate >= today;
    } else if (filterType === 'past') {
      return eventDate < today;
    }
    
    return true;
  });

  const handleAddEvent = () => {
    setCurrentEvent(null);
    setModalOpen(true);
  };

  const handleEditEvent = (event: Event) => {
    setCurrentEvent(event);
    setModalOpen(true);
  };

  const handleViewEvent = (event: Event) => {
    setCurrentEvent(event);
    setViewModalOpen(true);
  };

  const handleDeleteClick = (event: Event) => {
    setCurrentEvent(event);
    setDeleteModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setCurrentEvent(null);
  };

  const handleFormSubmit = async (data: Partial<Event>, file?: File) => {
    setIsLoading(true);
    try {
      if (currentEvent) {
        await updateEvent(currentEvent.id, data, file);
      } else {
        await createEvent(data as Omit<Event, 'id' | 'createdAt'>, file);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!currentEvent) return;
    
    setIsLoading(true);
    try {
      await deleteEvent(currentEvent.id);
      setDeleteModalOpen(false);
      setCurrentEvent(null);
    } catch (error) {
      console.error('Error deleting event:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold">Events Management</h1>
          <p className="text-gray-600">Add, edit and manage organization events</p>
        </div>
        <Button onClick={handleAddEvent}>
          <Plus className="mr-2 h-4 w-4" />
          Add Event
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="mb-6 space-y-4">
            <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
              <div className="max-w-md flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search events..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="text-sm text-gray-500">
                {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterType('all')}
                className={`rounded-full px-3 py-1 text-sm ${
                  filterType === 'all'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All Events
              </button>
              <button
                onClick={() => setFilterType('upcoming')}
                className={`rounded-full px-3 py-1 text-sm ${
                  filterType === 'upcoming'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Upcoming
              </button>
              <button
                onClick={() => setFilterType('past')}
                className={`rounded-full px-3 py-1 text-sm ${
                  filterType === 'past'
                    ? 'bg-gray-100 text-gray-800'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Past Events
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-800 border-t-transparent"></div>
            </div>
          ) : filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredEvents.map(event => {
                const isPast = new Date(event.eventDate) < new Date();
                
                return (
                  <Card key={event.id} className={isPast ? 'opacity-75' : ''}>
                    <div className="aspect-video overflow-hidden">
                      <img 
                        src={event.imageUrl} 
                        alt={event.title} 
                        className={`h-full w-full object-cover ${isPast ? 'grayscale' : ''}`}
                      />
                    </div>
                    <CardContent className="p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                          isPast 
                            ? 'bg-gray-200 text-gray-700' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {format(new Date(event.eventDate), 'MMM d, yyyy')}
                        </span>
                        {event.isFeatured && (
                          <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
                            Featured
                          </span>
                        )}
                      </div>
                      <h3 className="mb-1 text-lg font-semibold line-clamp-1">{event.title}</h3>
                      <p className="mb-3 text-sm text-gray-600 line-clamp-2">{event.description}</p>
                      <div className="mb-3 flex items-center text-xs text-gray-500">
                        <MapPin size={14} className="mr-1" />
                        <span className="line-clamp-1">{event.location}</span>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="flex-1"
                          onClick={() => handleViewEvent(event)}
                        >
                          <Eye size={14} className="mr-1" />
                          View
                        </Button>
                        <Button 
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => handleEditEvent(event)}
                        >
                          <Pencil size={14} className="mr-1" />
                          Edit
                        </Button>
                        <Button 
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:bg-red-50 hover:text-red-700"
                          onClick={() => handleDeleteClick(event)}
                        >
                          <Trash size={14} />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-lg text-gray-600">No events found.</p>
              <p className="text-gray-500">Add a new event to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Modal */}
      <EventModal 
        isOpen={modalOpen} 
        onClose={handleCloseModal} 
        onSubmit={handleFormSubmit}
        initialData={currentEvent}
        isLoading={isLoading}
      />

      {/* View Modal */}
      <ViewEventModal 
        isOpen={viewModalOpen} 
        onClose={() => setViewModalOpen(false)} 
        event={currentEvent}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal 
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        eventTitle={currentEvent?.title}
        isLoading={isLoading}
      />
    </div>
  );
};

export default AdminEventsPage;