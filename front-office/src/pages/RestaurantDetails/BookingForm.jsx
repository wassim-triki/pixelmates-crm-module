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
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    guests: 0,
    date: '',
    time: '',
    tableId: '',
  });
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isValid, setIsValid] = useState(false);

  // 1) fetch
  useEffect(() => {
    if (!restaurant?._id) return;
    setLoading(true);
    axiosInstance
      .get(`/restaurants/${restaurant._id}/tables`)
      .then((res) => {
        // map _id → id for each table
        setTables(
          res.data.map((t) => ({
            ...t,
            id: t._id,
          }))
        );
      })
      .catch(() => setError('Failed to load tables.'))
      .finally(() => setLoading(false));
  }, [restaurant]);

  // 2) all possible slots
  const slots = useMemo(() => {
    if (!restaurant?.workFrom || !restaurant?.workTo) return [];
    return generateSlots(restaurant.workFrom, restaurant.workTo);
  }, [restaurant]);

  // 3) form validation (step 2)
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
  const handleTableSelect = (id) => setFormData((f) => ({ ...f, tableId: id }));
  const handleSlotClick = (slot) => setFormData((f) => ({ ...f, time: slot }));
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;
    console.log('Submitting reservation:', {
      restaurantId: restaurant._id,
      ...formData,
    });
    // await axiosInstance.post('/reservations', { restaurantId: restaurant._id, ...formData });
  };

  // 4) filter available & build guest options
  const availableTables = tables.filter((t) => t.isAvailable);
  const selectedTable = tables.find((t) => t.id === formData.tableId) || {};
  const guestOptions = selectedTable.minCovers
    ? Array.from(
        { length: selectedTable.maxCovers - selectedTable.minCovers + 1 },
        (_, i) => selectedTable.minCovers + i
      )
    : [];

  // 5) today for date min
  const today = new Date().toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Step 1 */}
      {step === 1 && (
        <div>
          <label className="block text-sm font-medium mb-2">
            Choose a table
          </label>
          {loading && <p className="text-gray-500">Loading layout…</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading && !error && (
            <div className="w-full flex justify-center overflow-auto p-4 xbg-gray-50 rounded">
              <Canvas
                tables={availableTables}
                selectedId={formData.tableId}
                onSelect={handleTableSelect}
                interactive={false}
              />
            </div>
          )}
          <button
            type="button"
            onClick={() => setStep(2)}
            disabled={!formData.tableId}
            className={`w-full mt-4 py-3 cursor-pointer bg-[#ef7d70] text-white font-semibold rounded transition-opacity ${
              !formData.tableId
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:opacity-90'
            }`}
          >
            Continue
          </button>
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <div>
          <div className="bg-white p-4 grid grid-cols-2 gap-4 rounded shadow">
            <div>
              <label className="block text-sm font-medium">Guests</label>
              <select
                name="guests"
                value={formData.guests}
                onChange={handleChange}
                className="mt-1 block w-full border px-3 py-2 rounded"
              >
                <option value="">Select</option>
                {guestOptions.map((n) => (
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
                min={today}
                value={formData.date}
                onChange={handleChange}
                className="mt-1 block w-full border px-3 py-2 rounded"
              />
            </div>
          </div>

          <div className="mt-4">
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
                    className={`px-3 py-2 border rounded cursor-pointer text-sm font-medium transition-colors ${
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
          </div>

          <div className="flex justify-between cursor-pointer items-center mt-6">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={!isValid}
              className={`px-6 py-3 bg-[#ef7d70] cursor-pointer text-white font-semibold rounded transition-opacity ${
                !isValid ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
              }`}
            >
              Reserve
            </button>
          </div>
        </div>
      )}
    </form>
  );
};

export default BookingForm;
