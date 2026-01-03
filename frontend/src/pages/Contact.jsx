import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';
import ReCAPTCHA from 'react-google-recaptcha';
import Cookies from 'js-cookie';
import { FaEnvelope, FaPhone, FaPaperclip } from 'react-icons/fa';

const formSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  company: z.string().min(2, 'Company/Organization is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\+?[\d\s-]{8,}$/, 'Invalid phone number'),
  projectType: z.enum(['web', 'mobile', 'enterprise', 'other'], { required_error: 'Project type is required' }),
  projectDescription: z.string().min(50, 'Project description must be at least 50 characters'),
  preferredTechnologies: z.array(z.string()).min(1, 'Select at least one technology'),
  budgetRange: z.enum(['<10k', '10k-25k', '25k-50k', '50k-100k', '>100k'], { required_error: 'Budget range is required' }),
  timeline: z.string().min(10, 'Timeline description is required'),
  communicationMethod: z.enum(['email', 'phone', 'video'], { required_error: 'Communication method is required' }),
  meetingPlatform: z.enum(['zoom', 'google_meet', 'microsoft_teams', 'other'], { required_error: 'Meeting platform is required' }),
  requirementsDoc: z.instanceof(File).optional(),
  ndaDoc: z.instanceof(File).optional(),
  confidentiality: z.boolean().refine(val => val === true, 'You must agree to the confidentiality terms'),
  captcha: z.string().min(1, 'Please complete the CAPTCHA'),
});

function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const { handleSubmit, control, reset, formState: { errors, isValid } } = useForm({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      preferredTechnologies: [],
      confidentiality: false,
      captcha: '',
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((item, index) => formData.append(`${key}[${index}]`, item));
        } else if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, value);
        }
      });

      const response = await axios.post('/api/contact/submit/', formData, {
        headers: { 'Content-Type': 'multipart/form-data', 'X-CSRFToken': Cookies.get('csrftoken') },
      });

      setSubmissionStatus('success');
      reset();
      alert(`Inquiry submitted successfully! ID: ${response.data.inquiryId}`);
    } catch (error) {
      setSubmissionStatus('error');
      alert('Error submitting inquiry: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-900 text-white font-inter py-12 sm:py-16">
      <section className="w-full max-w-full px-4 sm:px-6">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-montserrat text-center text-primary mb-4 sm:mb-6">
          Get in Touch
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-300 text-center mb-6 sm:mb-8">
          Let's discuss your project. Fill out the form or reach out directly to start your journey.
        </p>

        {/* Contact Methods */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 mb-8 sm:mb-12">
          <div className="flex items-center justify-center space-x-2">
            <FaEnvelope className="text-blue-500 text-xl sm:text-2xl" />
            <a href="mailto:contact@yourdomain.com" className="text-blue-400 hover:underline">contact@yourdomain.com</a>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <FaPhone className="text-blue-500 text-xl sm:text-2xl" />
            <a href="tel:+1234567890" className="text-blue-400 hover:underline">+1 (234) 567-890</a>
          </div>
        </div>

        {/* Inquiry Form */}
        <div className="max-w-2xl mx-auto bg-gray-800 p-6 sm:p-8 rounded-lg shadow-lg">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm sm:text-base font-semibold mb-1">Full Name *</label>
              <Controller
                name="fullName"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="John Doe"
                  />
                )}
              />
              {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>}
            </div>

            {/* Company/Organization */}
            <div>
              <label className="block text-sm sm:text-base font-semibold mb-1">Company/Organization *</label>
              <Controller
                name="company"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your Company"
                  />
                )}
              />
              {errors.company && <p className="text-red-500 text-sm mt-1">{errors.company.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm sm:text-base font-semibold mb-1">Email Address *</label>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="email"
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="you@example.com"
                  />
                )}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm sm:text-base font-semibold mb-1">Phone Number *</label>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="tel"
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+1234567890"
                  />
                )}
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
            </div>

            {/* Project Type */}
            <div>
              <label className="block text-sm sm:text-base font-semibold mb-1">Project Type *</label>
              <Controller
                name="projectType"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select project type</option>
                    <option value="web">Web Application</option>
                    <option value="mobile">Mobile Application</option>
                    <option value="enterprise">Enterprise Application</option>
                    <option value="other">Other</option>
                  </select>
                )}
              />
              {errors.projectType && <p className="text-red-500 text-sm mt-1">{errors.projectType.message}</p>}
            </div>

            {/* Project Description */}
            <div>
              <label className="block text-sm sm:text-base font-semibold mb-1">Project Description *</label>
              <Controller
                name="projectDescription"
                control={control}
                render={({ field }) => (
                  <textarea
                    {...field}
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="5"
                    placeholder="Describe your project in detail"
                  />
                )}
              />
              {errors.projectDescription && <p className="text-red-500 text-sm mt-1">{errors.projectDescription.message}</p>}
            </div>

            {/* Preferred Technologies */}
            <div>
              <label className="block text-sm sm:text-base font-semibold mb-1">Preferred Technologies *</label>
              <Controller
                name="preferredTechnologies"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    multiple
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="React">React</option>
                    <option value="Django">Django</option>
                    <option value="Node.js">Node.js</option>
                    <option value="PostgreSQL">PostgreSQL</option>
                    <option value="MongoDB">MongoDB</option>
                    <option value="Tailwind CSS">Tailwind CSS</option>
                  </select>
                )}
              />
              {errors.preferredTechnologies && <p className="text-red-500 text-sm mt-1">{errors.preferredTechnologies.message}</p>}
            </div>

            {/* Budget Range */}
            <div>
              <label className="block text-sm sm:text-base font-semibold mb-1">Estimated Budget Range *</label>
              <Controller
                name="budgetRange"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select budget range</option>
                    <option value="<10k">Less than $10,000</option>
                    <option value="10k-25k">$10,000 - $25,000</option>
                    <option value="25k-50k">$25,000 - $50,000</option>
                    <option value="50k-100k">$50,000 - $100,000</option>
                    <option value=">100k">More than $100,000</option>
                  </select>
                )}
              />
              {errors.budgetRange && <p className="text-red-500 text-sm mt-1">{errors.budgetRange.message}</p>}
            </div>

            {/* Timeline */}
            <div>
              <label className="block text-sm sm:text-base font-semibold mb-1">Project Timeline *</label>
              <Controller
                name="timeline"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="E.g., 3 months, Q2 2026"
                  />
                )}
              />
              {errors.timeline && <p className="text-red-500 text-sm mt-1">{errors.timeline.message}</p>}
            </div>

            {/* Communication Method */}
            <div>
              <label className="block text-sm sm:text-base font-semibold mb-1">Preferred Communication Method *</label>
              <Controller
                name="communicationMethod"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select communication method</option>
                    <option value="email">Email</option>
                    <option value="phone">Phone</option>
                    <option value="video">Video Call</option>
                  </select>
                )}
              />
              {errors.communicationMethod && <p className="text-red-500 text-sm mt-1">{errors.communicationMethod.message}</p>}
            </div>

            {/* Meeting Platform */}
            <div>
              <label className="block text-sm sm:text-base font-semibold mb-1">Preferred Meeting Platform *</label>
              <Controller
                name="meetingPlatform"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select meeting platform</option>
                    <option value="zoom">Zoom</option>
                    <option value="google_meet">Google Meet</option>
                    <option value="microsoft_teams">Microsoft Teams</option>
                    <option value="other">Other</option>
                  </select>
                )}
              />
              {errors.meetingPlatform && <p className="text-red-500 text-sm mt-1">{errors.meetingPlatform.message}</p>}
            </div>

            {/* Requirements Document */}
            <div>
              <label className="block text-sm sm:text-base font-semibold mb-1">Requirements Document (Optional)</label>
              <Controller
                name="requirementsDoc"
                control={control}
                render={({ field }) => (
                  <div className="flex items-center space-x-2">
                    <FaPaperclip className="text-blue-500" />
                    <input
                      type="file"
                      onChange={(e) => field.onChange(e.target.files[0])}
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                    />
                  </div>
                )}
              />
              {errors.requirementsDoc && <p className="text-red-500 text-sm mt-1">{errors.requirementsDoc.message}</p>}
            </div>

            {/* NDA Document */}
            <div>
              <label className="block text-sm sm:text-base font-semibold mb-1">NDA Document (Optional)</label>
              <Controller
                name="ndaDoc"
                control={control}
                render={({ field }) => (
                  <div className="flex items-center space-x-2">
                    <FaPaperclip className="text-blue-500" />
                    <input
                      type="file"
                      onChange={(e) => field.onChange(e.target.files[0])}
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                    />
                  </div>
                )}
              />
              {errors.ndaDoc && <p className="text-red-500 text-sm mt-1">{errors.ndaDoc.message}</p>}
            </div>

            {/* Confidentiality Agreement */}
            <div>
              <label className="flex items-center space-x-2 text-sm sm:text-base">
                <Controller
                  name="confidentiality"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="checkbox"
                      className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-600 rounded"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  )}
                />
                <span>
                  I agree to the{' '}
                  <a href="/privacy-policy" className="text-blue-400 hover:underline">Privacy Policy</a> and confidentiality terms *
                </span>
              </label>
              {errors.confidentiality && <p className="text-red-500 text-sm mt-1">{errors.confidentiality.message}</p>}
            </div>

            {/* CAPTCHA */}
            <div>
              <Controller
                name="captcha"
                control={control}
                render={({ field }) => (
                  <ReCAPTCHA
                    sitekey="YOUR_RECAPTCHA_SITE_KEY"
                    onChange={field.onChange}
                    theme="dark"
                    className="mx-auto"
                  />
                )}
              />
              {errors.captcha && <p className="text-red-500 text-sm mt-1">{errors.captcha.message}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !isValid}
              className="w-full bg-blue-600 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-full font-bold hover:bg-blue-700 transition duration-300 disabled:bg-gray-600"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
            </button>
          </form>

          {submissionStatus === 'success' && (
            <p className="text-green-500 text-center mt-4">Your inquiry has been submitted! We'll follow up within 24-48 hours.</p>
          )}
          {submissionStatus === 'error' && (
            <p className="text-red-500 text-center mt-4">An error occurred. Please try again or contact us directly.</p>
          )}
        </div>

        {/* Privacy Policy Note */}
        <p className="text-center text-gray-400 text-sm mt-6">
          Your data is protected under GDPR. See our <a href="/privacy-policy" className="text-blue-400 hover:underline">Privacy Policy</a> for details.
        </p>
      </section>
    </div>
  );
}

export default Contact;