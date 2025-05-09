import React, { useState, useEffect } from 'react';

const BookingForm = () => {
  // your form data will go here
  const [formData, setFormData] = useState({
    guests: '',
    date: '',
    time: '',
    // etc…
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);

  // whenever formData changes, re-compute validity
  useEffect(() => {
    // stub validation: all fields non-empty
    const valid =
      formData.guests !== '' && formData.date !== '' && formData.time !== '';
    setIsValid(valid);
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;
    setIsLoading(true);

    // ← your real API call goes here:
    // await axios.post('/…', formData)

    // fake delay
    await new Promise((r) => setTimeout(r, 1000));
    setIsLoading(false);

    // maybe close modal or show a success message…
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* EXAMPLE FIELDS */}
      <div>
        <label className="block text-sm font-medium">Guests</label>
        <input
          type="number"
          name="guests"
          value={formData.guests}
          onChange={handleChange}
          className="mt-1 block w-full border px-3 py-2 rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Date</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="mt-1 block w-full border px-3 py-2 rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Time</label>
        <input
          type="time"
          name="time"
          value={formData.time}
          onChange={handleChange}
          className="mt-1 block w-full border px-3 py-2 rounded"
        />
      </div>

      <hr className="border-gray-200 my-4" />

      <button
        type="submit"
        disabled={!isValid || isLoading}
        className="w-full py-3 bg-[#ef7d70] text-white font-semibold rounded disabled:opacity-50 flex justify-center items-center"
      >
        {isLoading ? (
          <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
        ) : (
          'Continue'
        )}
      </button>
    </form>
  );
};

export default BookingForm;
