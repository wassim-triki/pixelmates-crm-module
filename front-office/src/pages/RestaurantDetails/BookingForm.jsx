// src/components/BookingForm.jsx
import React, { useState, useEffect, useMemo } from 'react';
import axiosInstance from '../../config/axios';
import Canvas from '../../../../back-office/src/jsx/pages/FloorConfiguration/Canvas';

// Utility: generate 30-min slots between two "HH:mm" strings
const generateSlots = (open, close) => {
  const [oh, om] = open.split(':').map(Number);
  const [ch, cm] = close.split(':').map(Number);
  const slots = [];
  let minutes = oh * 60 + om;
  const end = ch * 60 + cm;

  while (minutes < end) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
    minutes += 30;
  }
  return slots;
};

// Format "HH:mm" → "h:mm AM/PM"
const formatTime = (time) => {
  const [h, m] = time.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
};

const BookingForm = ({ restaurant }) => {
  // form state
  const [formData, setFormData] = useState({
    guests: 2,
    date: '',
    time: '',
    tableId: '',
  });

  // fetched tables for layout & min/max covers
  const [tables, setTables] = useState([]);
  const [tablesLoading, setTablesLoading] = useState(false);
  const [tablesError, setTablesError] = useState('');

  // slots from workFrom/workTo
  const slots = useMemo(() => {
    if (!restaurant?.workFrom || !restaurant?.workTo) return [];
    return generateSlots(restaurant.workFrom, restaurant.workTo);
  }, [restaurant]);

  // submit state
  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);

  // fetch tables on mount
  useEffect(() => {
    if (!restaurant?._id) return;
    setTablesLoading(true);
    axiosInstance
      .get(`/restaurants/${restaurant._id}/tables`)
      .then((res) => setTables(res.data))
      .catch(() => setTablesError('Failed to load tables.'))
      .finally(() => setTablesLoading(false));
  }, [restaurant]);

  // validate form
  useEffect(() => {
    const { guests, date, time, tableId } = formData;
    setIsValid(
      guests > 0 &&
        date !== '' &&
        time !== '' &&
        tableId !== '' &&
        slots.includes(time)
    );
  }, [formData, slots]);

  // handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({
      ...f,
      [name]: name === 'guests' ? parseInt(value, 10) : value,
    }));
  };
  const handleTableSelect = (id) => {
    setFormData((f) => ({ ...f, tableId: id }));
  };
  const handleSlotClick = (slot) => {
    setFormData((f) => ({ ...f, time: slot }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;
    setIsLoading(true);
    const payload = {
      restaurantId: restaurant._id,
      ...formData,
    };
    console.log('Would submit:', payload);
    // TODO: await axiosInstance.post('/reservations', payload)
    setIsLoading(false);
  };

  // only show tables matching guest count & online
  const availableTables = tables.filter(
    (t) =>
      t.isAvailable &&
      formData.guests >= t.minCovers &&
      formData.guests <= t.maxCovers
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6 relative">
      {/* --- Step 1: Guests & Date --- */}
      {/* <div className="bg-white p-4 grid grid-cols-2 gap-4 rounded shadow">
        <div>
          <label className="block text-sm font-medium">Guests</label>
          <select
            name="guests"
            value={formData.guests}
            onChange={handleChange}
            className="mt-1 block w-full border px-3 py-2 rounded"
          >
            {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
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
      </div> */}

      {/* --- Step 2: Visual table picker --- */}
      <div>
        <label className="block text-sm font-medium mb-2">Choose a table</label>
        {tablesLoading && <p>Loading layout…</p>}
        {tablesError && <p className="text-red-500">{tablesError}</p>}
        {!tablesLoading && !tablesError && (
          <div className="canvas-wrapper">
            <Canvas
              tables={availableTables}
              selectedId={formData.tableId}
              onSelect={handleTableSelect}
              interactive={false}
            />
          </div>
        )}
      </div>

      {/* --- Step 3: Time slots --- */}
      {/* <div>
        <span className="block text-base font-semibold text-center">
          Select a time
        </span>
        <div className="mt-3 grid grid-cols-4 gap-3">
          {slots.map((slot) => {
            const isChosen = formData.time === slot;
            return (
              <button
                key={slot}
                type="button"
                onClick={() => handleSlotClick(slot)}
                className={`px-3 py-2 border rounded text-sm font-medium transition-colors ${
                  isChosen
                    ? 'bg-green-100 border-green-500'
                    : 'bg-white hover:border-gray-400'
                }`}
              >
                {formatTime(slot)}
              </button>
            );
          })}
        </div>
      </div> */}

      <hr className="border-gray-200 my-4" />

      {/* --- Submit --- */}
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
