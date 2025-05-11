import { useState, useEffect } from 'react';
import { useMembers } from '../../hooks/useMembers';
import { Member } from '../../types';
import { 
  Eye, 
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

interface MemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Member>, file?: File) => void;
  initialData: Member | null;
  isLoading: boolean;
}

const MemberModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData = null,
  isLoading 
}: MemberModalProps) => {
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm({
    defaultValues: initialData || {
      name: '',
      designation: '',
      bio: '',
      contact: '',
      photoUrl: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
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

  const handleFormSubmit = (data: Partial<Member>) => {
    onSubmit(data, file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <Card className="w-full max-w-xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>{initialData ? 'Edit Member' : 'Add New Member'}</CardTitle>
          <button 
            onClick={onClose}
            className="rounded-full p-1 text-gray-500 transition-colors hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <div className="flex flex-col justify-between gap-6 sm:flex-row">
              <div className="sm:w-2/3 space-y-4">
                <FormField
                  label="Name"
                  htmlFor="name"
                  error={errors.name?.message}
                  required
                >
                  <Input
                    id="name"
                    {...register('name', { required: 'Name is required' })}
                    error={errors.name?.message}
                  />
                </FormField>

                <FormField
                  label="Designation"
                  htmlFor="designation"
                  error={errors.designation?.message}
                  required
                >
                  <Input
                    id="designation"
                    {...register('designation', { required: 'Designation is required' })}
                    error={errors.designation?.message}
                  />
                </FormField>

                <FormField
                  label="Contact Information"
                  htmlFor="contact"
                  error={errors.contact?.message}
                >
                  <Input
                    id="contact"
                    {...register('contact')}
                    error={errors.contact?.message}
                    placeholder="Email or Phone (Optional)"
                  />
                </FormField>

                <FormField
                  label="Bio"
                  htmlFor="bio"
                  error={errors.bio?.message}
                >
                  <TextArea
                    id="bio"
                    {...register('bio')}
                    error={errors.bio?.message}
                    placeholder="Brief bio (Optional)"
                  />
                </FormField>
              </div>

              <div className="sm:w-1/3">
                <FormField
                  label="Photo"
                  htmlFor="photo"
                  error={errors.photoUrl?.message}
                  required
                >
                  <ImageUpload
                    onFileChange={handleFileChange}
                    initialImage={watch('photoUrl')}
                    error={errors.photoUrl?.message}
                  />
                  <Input
                    id="photoUrl"
                    type="hidden"
                    {...register('photoUrl', { required: 'Photo URL is required' })}
                  />
                </FormField>
              </div>
            </div>

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
                {initialData ? 'Update' : 'Add'} Member
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

interface ViewMemberModalProps {
  member: Member | null;
  isOpen: boolean;
  onClose: () => void;
}

const ViewMemberModal = ({ member, isOpen, onClose }: ViewMemberModalProps) => {
  if (!isOpen || !member) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <Card className="w-full max-w-xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Member Details</CardTitle>
          <button 
            onClick={onClose}
            className="rounded-full p-1 text-gray-500 transition-colors hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6 sm:flex-row">
            <div className="sm:w-1/3">
              <div className="overflow-hidden rounded-lg">
                <img 
                  src={member.photoUrl} 
                  alt={member.name} 
                  className="h-48 w-full object-cover"
                />
              </div>
            </div>
            <div className="sm:w-2/3">
              <h3 className="text-2xl font-bold">{member.name}</h3>
              <p className="font-medium text-blue-800">{member.designation}</p>
              <div className="mt-4 space-y-2">
                {member.bio && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-500">Bio</h4>
                    <p>{member.bio}</p>
                  </div>
                )}
                {member.contact && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-500">Contact</h4>
                    <p>{member.contact}</p>
                  </div>
                )}
                <div>
                  <h4 className="text-sm font-semibold text-gray-500">Added On</h4>
                  <p>{format(new Date(member.createdAt), 'MMMM d, yyyy')}</p>
                </div>
              </div>
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
  memberName: string | undefined;
  isLoading: boolean;
}

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, memberName, isLoading }: ConfirmDeleteModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Confirm Deletion</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-center">
            Are you sure you want to delete <span className="font-semibold">{memberName}</span>? This action cannot be undone.
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

const AdminMembersPage = () => {
  const { members, loading, createMember, updateMember, deleteMember } = useMembers();
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [currentMember, setCurrentMember] = useState<Member | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.designation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddMember = () => {
    setCurrentMember(null);
    setModalOpen(true);
  };

  const handleEditMember = (member: Member) => {
    setCurrentMember(member);
    setModalOpen(true);
  };

  const handleViewMember = (member: Member) => {
    setCurrentMember(member);
    setViewModalOpen(true);
  };

  const handleDeleteClick = (member: Member) => {
    setCurrentMember(member);
    setDeleteModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setCurrentMember(null);
  };

  const handleFormSubmit = async (data: Partial<Member>, file?: File | null) => {
    setIsLoading(true);
    try {
      if (currentMember) {
        await updateMember(currentMember.id, data, file || undefined);
      } else {
        await createMember(data as Omit<Member, 'id' | 'createdAt'>, file || undefined);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!currentMember) return;
    
    setIsLoading(true);
    try {
      await deleteMember(currentMember.id);
      setDeleteModalOpen(false);
      setCurrentMember(null);
    } catch (error) {
      console.error('Error deleting member:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold">Members Management</h1>
          <p className="text-gray-600">Add, edit and manage organization members</p>
        </div>
        <Button onClick={handleAddMember}>
          <Plus className="mr-2 h-4 w-4" />
          Add Member
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="mb-6 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div className="max-w-md flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search members..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="text-sm text-gray-500">
              {filteredMembers.length} {filteredMembers.length === 1 ? 'member' : 'members'}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-800 border-t-transparent"></div>
            </div>
          ) : filteredMembers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="border-b bg-gray-50 text-left">
                    <th className="px-4 py-3 text-sm font-medium text-gray-500">Photo</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-500">Name</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-500">Designation</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-500">Added On</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="h-10 w-10 overflow-hidden rounded-full">
                          <img
                            src={member.photoUrl}
                            alt={member.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium">{member.name}</td>
                      <td className="px-4 py-3 text-gray-600">{member.designation}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {format(new Date(member.createdAt), 'MMM d, yyyy')}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewMember(member)}
                            className="rounded-full p-1 text-gray-500 transition-colors hover:bg-gray-100"
                            title="View"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleEditMember(member)}
                            className="rounded-full p-1 text-blue-600 transition-colors hover:bg-blue-50"
                            title="Edit"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(member)}
                            className="rounded-full p-1 text-red-600 transition-colors hover:bg-red-50"
                            title="Delete"
                          >
                            <Trash size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-lg text-gray-600">No members found.</p>
              <p className="text-gray-500">Add a new member to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Modal */}
      <MemberModal 
        isOpen={modalOpen} 
        onClose={handleCloseModal} 
        onSubmit={handleFormSubmit}
        initialData={currentMember}
        isLoading={isLoading}
      />

      {/* View Modal */}
      <ViewMemberModal 
        isOpen={viewModalOpen} 
        onClose={() => setViewModalOpen(false)} 
        member={currentMember}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal 
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        memberName={currentMember?.name}
        isLoading={isLoading}
      />
    </div>
  );
};

export default AdminMembersPage;