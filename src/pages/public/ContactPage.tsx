import { useState } from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import TextArea from '../../components/ui/TextArea';
import FormField from '../../components/ui/FormField';
import { Card, CardContent } from '../../components/ui/Card';
import { supabase } from '../../lib/supabase';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccess(false);
    
    try {
      // Insert into Supabase messages table
      const { name, email, message } = formData;
      const { error } = await supabase.from('messages').insert([{ 
        name, 
        email, 
        message 
      }]);

      if (error) {
        console.error('Error submitting message:', error);
        alert(`Failed to send message: ${error.message}`);
        return;
      }

      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      console.error('Unexpected error:', err);
      alert('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
            Contact Us
          </h1>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Have questions or want to get involved? We'd love to hear from you.
            Reach out to us using the contact form or the information below.
          </p>
        </div>

        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Contact Information */}
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-6">
                  <h2 className="mb-6 text-2xl font-bold text-blue-800">Get in Touch</h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <MapPin className="mr-3 mt-1 h-5 w-5 flex-shrink-0 text-blue-800" />
                      <div>
                        <h3 className="font-medium">Address</h3>
                        <p className="text-gray-600">
                          123 Main Street<br />
                          City, State 12345<br />
                          Country
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Phone className="mr-3 mt-1 h-5 w-5 flex-shrink-0 text-blue-800" />
                      <div>
                        <h3 className="font-medium">Phone</h3>
                        <p className="text-gray-600">+1 (123) 456-7890</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Mail className="mr-3 mt-1 h-5 w-5 flex-shrink-0 text-blue-800" />
                      <div>
                        <h3 className="font-medium">Email</h3>
                        <p className="text-gray-600">info@kkms.org</p>
                      </div>
                    </div>
                  </div>
                  
                  <hr className="my-6" />
                  
                  <div>
                    <h3 className="mb-4 font-medium">Follow Us</h3>
                    <div className="flex space-x-4">
                      <a 
                        href="https://facebook.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="rounded-full bg-blue-100 p-2 text-blue-800 transition-colors hover:bg-blue-200"
                      >
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                        </svg>
                      </a>
                      <a 
                        href="https://instagram.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="rounded-full bg-blue-100 p-2 text-blue-800 transition-colors hover:bg-blue-200"
                      >
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <h2 className="mb-6 text-2xl font-bold text-blue-800">Send Us a Message</h2>
                  
                  {success ? (
                    <div className="rounded-md bg-green-50 p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-green-800">Message sent successfully!</h3>
                          <div className="mt-2 text-sm text-green-700">
                            <p>Thank you for contacting us. We'll get back to you as soon as possible.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-8">
                      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                        <FormField label="Your Name" htmlFor="name" required>
                          <div className="relative">
                            <Input
                              id="name"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              required
                              className="w-full rounded-xl border-2 border-blue-100 bg-white px-6 py-4 text-gray-700 shadow-sm transition-all duration-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 hover:border-blue-300"
                              placeholder="Enter your name"
                            />
                          </div>
                        </FormField>
                        
                        <FormField label="Your Email" htmlFor="email" required>
                          <div className="relative">
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={formData.email}
                              onChange={handleChange}
                              required
                              className="w-full rounded-xl border-2 border-blue-100 bg-white px-6 py-4 text-gray-700 shadow-sm transition-all duration-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 hover:border-blue-300"
                              placeholder="Enter your email"
                            />
                          </div>
                        </FormField>
                      </div>
                      
                      <FormField label="Message" htmlFor="message" required>
                        <div className="relative">
                          <TextArea
                            id="message"
                            name="message"
                            rows={6}
                            value={formData.message}
                            onChange={handleChange}
                            required
                            className="w-full rounded-xl border-2 border-blue-100 bg-white px-6 py-4 text-gray-700 shadow-sm transition-all duration-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 hover:border-blue-300 resize-none"
                            placeholder="Type your message here..."
                          />
                        </div>
                      </FormField>
                      
                      <Button
                        type="submit"
                        isLoading={!!isSubmitting}
                        className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-4 text-white shadow-lg transition-all duration-300 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="flex items-center justify-center">
                          {isSubmitting ? (
                            <>
                              <svg className="mr-2 h-5 w-5 animate-spin" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                              </svg>
                              Sending...
                            </>
                          ) : (
                            <>
                              Send Message
                              <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                              </svg>
                            </>
                          )}
                        </span>
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Google Map */}
          <div className="mt-12">
            <div className="overflow-hidden rounded-lg shadow-md">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387193.3059445135!2d-74.25986548248684!3d40.69714941932609!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sin!4v1615458399086!5m2!1sen!2sin"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                title="Map"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;