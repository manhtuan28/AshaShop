import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, CheckCircle } from 'lucide-react';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setFormData({ name: '', email: '', phone: '', message: '' });
    setTimeout(() => setSent(false), 5000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-poppins space-y-10">
      
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500">
        <Link to="/" className="hover:text-black transition-colors">Home</Link>
        <span>/</span>
        <span className="text-black font-medium">Contact</span>
      </nav>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Call To Us & Write To Us Cards */}
        <div className="lg:col-span-4 bg-white shadow-exclusive-sm border border-gray-100 rounded p-8 space-y-8">
          
          {/* Call To Us */}
          <div className="space-y-4 pb-8 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-exclusive-red flex items-center justify-center text-white">
                <Phone className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-base text-black">Call To Us</h3>
            </div>
            <p className="text-xs text-gray-600">We are available 24/7, 7 days a week.</p>
            <p className="text-xs font-medium text-black">Phone: +8801611112222</p>
          </div>

          {/* Write To Us */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-exclusive-red flex items-center justify-center text-white">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-base text-black">Write To Us</h3>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Fill out our form and we will contact you within 24 hours.
            </p>
            <p className="text-xs font-medium text-black">Emails: customer@exclusive.com</p>
            <p className="text-xs font-medium text-black">Emails: support@exclusive.com</p>
          </div>

        </div>

        {/* Right Column: Contact Form */}
        <div className="lg:col-span-8 bg-white shadow-exclusive-sm border border-gray-100 rounded p-8">
          {sent && (
            <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded text-sm mb-6 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>Thank you! Your message has been sent successfully. We will reply shortly.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <input
                type="text"
                required
                placeholder="Your Name *"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-exclusive-bg rounded px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-black"
              />
              <input
                type="email"
                required
                placeholder="Your Email *"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-exclusive-bg rounded px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-black"
              />
              <input
                type="tel"
                required
                placeholder="Your Phone *"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="bg-exclusive-bg rounded px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>

            <div>
              <textarea
                rows={7}
                required
                placeholder="Your Message *"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-exclusive-bg rounded px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-black resize-none"
              ></textarea>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-10 py-3.5 bg-exclusive-red hover:bg-exclusive-red-hover text-white font-medium text-sm rounded transition-colors"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>

      </div>

    </div>
  );
};
