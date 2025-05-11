import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

const MessagesPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) setMessages(data);
      setLoading(false);
    };
    fetchMessages();
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Contact Messages</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-800 border-t-transparent"></div>
            </div>
          ) : messages.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="border-b bg-gray-50 text-left">
                    <th className="px-4 py-3 text-sm font-medium text-gray-500">Name</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-500">Email</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-500">Message</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-500">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {messages.map(msg => (
                    <tr key={msg.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{msg.name}</td>
                      <td className="px-4 py-3 text-blue-700">{msg.email}</td>
                      <td className="px-4 py-3 text-gray-700">{msg.message}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{new Date(msg.created_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-lg text-gray-600">No messages found.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MessagesPage; 