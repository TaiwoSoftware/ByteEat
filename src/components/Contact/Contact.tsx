import { useState } from "react";
import { supabase } from "../Auth/supabaseClient";

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface ContactSubmission {
  name: string;
  email: string;
  message: string;
  created_at?: string;
}

export const Contact = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const submission: ContactSubmission = {
        name: formData.name,
        email: formData.email,
        message: formData.message,
      };

      const { error: supabaseError } = await supabase
        .from("contact_submissions")
        .insert([submission]);

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      setFormData({
        name: "",
        email: "",
        message: "",
      });

      setShowModal(true);
      setTimeout(() => setShowModal(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 md:px-12">
      <h1 className="text-4xl font-fredoka font-extrabold text-center text-gray-800 mb-8">
        Contact Us
      </h1>

      <div className="max-w-lg mx-auto bg-white p-8 rounded-xl shadow-lg">
        {error && <div className="text-red-600 mb-4">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 font-semibold">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-semibold">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="message" className="block text-gray-700 font-semibold">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              rows={4}
              required
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-orange-600 text-white rounded-full font-medium text-sm hover:bg-orange-700 transition-all duration-300 disabled:bg-gray-400"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </div>
        </form>
      </div>

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            <div className="text-4xl text-green-600 animate-bounce">👍</div>
            <h2 className="text-2xl font-semibold text-gray-800 mt-4">
              Message Sent Successfully!
            </h2>
            <p className="text-gray-600 mt-2">
              Thank you for reaching out. We'll get back to you soon!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};