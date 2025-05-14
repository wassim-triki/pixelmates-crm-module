import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../config/axios';
import Canvas from '../../../../back-office/src/jsx/pages/FloorConfiguration/Canvas';
import { toast } from 'react-toastify';
import { ThreeDots } from 'react-loader-spinner';
import { useAuth } from '../../context/authContext';
import { useModal } from '../../context/modalContext';

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

const formatTime = (time) => {
  const [h, m] = time.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
};

const BookingForm = ({ restaurant, closeModal }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    guests: 0,
    date: '',
    time: '',
    tableId: '',
    rewardId: null, // Add rewardId to the form data
  });
  const [tables, setTables] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isValid, setIsValid] = useState(false);

  const navigate = useNavigate();
  const { user } = useAuth();
  const { openModal } = useModal();

 /* useEffect(() => {
    if (!restaurant?._id) return;
    setLoading(true);
    axiosInstance
      .get(`/restaurants/${restaurant._id}/tables`)
      .then((res) => {
        setTables(
          res.data.map((t) => ({
            ...t,
            id: t._id,
          }))
        );
      })
      .catch(() => setError('Failed to load tables.'))
      .finally(() => setLoading(false));
  }, [restaurant]);*/
useEffect(() => {
  if (!restaurant?._id) {
    console.error('Restaurant ID is missing.');
    return;
  }

  setLoading(true);
  axiosInstance
    .get(`/restaurants/${restaurant._id}/tables`)
    .then((res) => {
      console.log('Tables response:', res.data);
      setTables(
        res.data.map((t) => ({
          ...t,
          id: t._id,
        }))
      );
    })
    .catch((err) => {
      console.error('Failed to load tables:', err.message);
      setError('Failed to load tables.');
    })
    .finally(() => setLoading(false));
}, [restaurant]);



  /*useEffect(() => {
    if (!restaurant?._id) return;
    axiosInstance
      .get(`/rewards/restaurant/${restaurant._id}`)
      .then((res) => setRewards(res.data))
      .catch(() => setError('Failed to load rewards.'));
  }, [restaurant]);
*/
useEffect(() => {
  if (!restaurant?._id) {
    console.error('Restaurant ID is missing.');
    return;
  }

  axiosInstance
    .get(`/rewards/restaurant/${restaurant._id}`)
    .then((res) => {
      console.log('Rewards response:', res.data);
      setRewards(res.data);
    })
    .catch((err) => {
      console.error('Failed to load rewards:', err.message);
      setError('Failed to load rewards.');
    });
}, [restaurant]);

  const slots = useMemo(() => {
    if (!restaurant?.workFrom || !restaurant?.workTo) return [];
    return generateSlots(restaurant.workFrom, restaurant.workTo);
  }, [restaurant]);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({
      ...f,
      [name]: name === 'guests' ? parseInt(value, 10) : value,
    }));
  };

  const handleTableSelect = (id) => setFormData((f) => ({ ...f, tableId: id }));
  const handleSlotClick = (slot) => setFormData((f) => ({ ...f, time: slot }));
  const handleRewardSelect = (rewardId) =>
    setFormData((f) => ({ ...f, rewardId }));
/*
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      navigate('/login', {
        state: {
          from: {
            pathname: `/restaurants/${restaurant._id}`,
          },
        },
      });
      return;
    }

    if (!isValid) return;

    setLoading(true);
    try {
      let redemptionResponse = null;

      // If a reward is selected, redeem it
      if (formData.rewardId) {
        redemptionResponse = await axiosInstance.post('/redeem', {
          userEmail: user.email,
          rewardId: formData.rewardId,
        });

        toast.success('Reward redeemed successfully!');
      }

      // Proceed with the reservation
      const payload = {
        userId: user.id,
        ...formData,
      };

      await axiosInstance.post('/reservations', payload);

      toast.success('Reservation successful!');
      closeModal();
    } catch (err) {
      console.error(err);
      const message =
        err.response?.data?.message ||
        err.message ||
        'Reservation failed. Please try again.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };*/

  /*
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!user) {
    console.error('User is not logged in.');
    navigate('/login', {
      state: {
        from: {
          pathname: `/restaurants/${restaurant._id}`,
        },
      },
    });
    return;
  }

  if (!isValid) {
    console.error('Form is not valid.');
    return;
  }

  setLoading(true);
  try {
    // Step 1: Create the reservation
    const payload = {
      userId: user.id,
      ...formData,
    };
    console.log('Reservation payload:', payload);

    const reservationResponse = await axiosInstance.post('/reservations', payload);
    console.log('Reservation response:', reservationResponse.data);

    const reservationId = reservationResponse.data._id; // Assuming the reservation ID is returned in the response

    toast.success('Reservation successful!');

    // Step 2: Redeem the reward (if selected)
    if (formData.rewardId) {
      console.log('Redeeming reward with ID:', formData.rewardId);
      const redemptionResponse = await axiosInstance.post('/redemptions/redeem', {
        userEmail: user.email,
        rewardId: formData.rewardId,
        reservationId, // Pass the reservation ID to the backend
      });
      console.log('Reward redemption response:', redemptionResponse.data);
      toast.success('Reward redeemed successfully!');
    }

    closeModal();
  } catch (err) {
    console.error('Error during reservation or redemption:', err.message);
    const message =
      err.response?.data?.message ||
      err.message ||
      'Reservation failed. Please try again.';
    toast.error(message);
  } finally {
    setLoading(false);
  }
};
*/


const handleSubmit = async (e) => {
  e.preventDefault();

  if (!user) {
    console.error('User is not logged in.');
    navigate('/login', {
      state: {
        from: {
          pathname: `/restaurants/${restaurant._id}`,
        },
      },
    });
    return;
  }

  if (!isValid) {
    console.error('Form is not valid.');
    return;
  }

  setLoading(true);
  try {
    // Step 1: Create the reservation
    const payload = {
      userId: user.id,
      ...formData,
    };
    console.log('Reservation payload:', payload);

    const reservationResponse = await axiosInstance.post('/reservations', payload);
    console.log('Reservation response:', reservationResponse.data);

    // Extract the reservation ID
    const reservationId = reservationResponse.data.reservation?._id || reservationResponse.data._id; // Ensure `_id` exists in the response
    if (!reservationId) {
      throw new Error('Reservation ID is missing in the response.');
    }

    toast.success('Reservation successful!');
    console.log('Reservation ID:', reservationId);

    // Step 2: Redeem the reward (if selected)
    if (formData.rewardId) {
      console.log('Redeeming reward with ID:', formData.rewardId);
      const redemptionPayload = {
        userEmail: user.email,
        rewardId: formData.rewardId,
        reservationId, // Pass the reservation ID to the backend
      };
      console.log('Redemption payload:', redemptionPayload);

      const redemptionResponse = await axiosInstance.post('/redemptions/redeem', redemptionPayload);
      console.log('Reward redemption response:', redemptionResponse.data);
      toast.success('Reward redeemed successfully!');
    }

    closeModal();
  } catch (err) {
    console.error('Error during reservation or redemption:', err.message);
    const message =
      err.response?.data?.message ||
      err.message ||
      'Reservation failed. Please try again.';
    toast.error(message);
  } finally {
    setLoading(false);
  }
};

  const availableTables = tables.filter((t) => t.isAvailable);
  const selectedTable = tables.find((t) => t.id === formData.tableId) || {};
  const guestOptions = selectedTable.minCovers
    ? Array.from(
        { length: selectedTable.maxCovers - selectedTable.minCovers + 1 },
        (_, i) => selectedTable.minCovers + i
      )
    : [];
  const today = new Date().toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Step 1: Select a Table */}
      {step === 1 && (
        <div>
          <label className="block text-sm font-medium mb-2">
            Choose a table
          </label>
          {loading && <p className="text-gray-500">Loading layout…</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading && !error && (
            <div className="w-full flex justify-center overflow-auto p-4 bg-gray-50 rounded">
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

      {/* Step 2: Select Guests, Date, and Time */}
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
              type="button"
              onClick={() => setStep(3)}
              disabled={!isValid}
              className={`px-6 py-3 bg-[#ef7d70] cursor-pointer text-white font-semibold rounded transition-opacity ${
                !isValid ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
              }`}
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Select a Reward */}
      {step === 3 && (
        <div>
          <h2 className="text-lg font-bold mb-4">Available Rewards</h2>
          {rewards.length > 0 ? (
            <ul className="space-y-2">
              {rewards.map((reward) => (
                <li
                  key={reward._id}
                  className={`p-3 border rounded cursor-pointer ${
                    formData.rewardId === reward._id
                      ? 'bg-green-100 border-green-500'
                      : reward.pointsCost > user.points
                      ? 'bg-gray-200 border-gray-400 cursor-not-allowed'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                  onClick={() =>
                    reward.pointsCost <= user.points &&
                    handleRewardSelect(reward._id)
                  }
                >
                  <h4 className="font-bold">{reward.name}</h4>
                  <p className="text-sm text-gray-600">{reward.description}</p>
                  <p className="text-sm text-gray-500">
                    Points: {reward.pointsCost}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No rewards available for this restaurant.</p>
          )}

          <div className="flex justify-between cursor-pointer items-center mt-6">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Back
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-[#ef7d70] cursor-pointer text-white font-semibold rounded hover:opacity-90"
            >
              Reserve
            </button>
            <button
              type="button"
              onClick={() => handleRewardSelect(null)}
              className="px-6 py-3 bg-gray-300 cursor-pointer text-black font-semibold rounded hover:bg-gray-400"
            >
              Skip
            </button>
          </div>
        </div>
      )}
    </form>
  );
};

export default BookingForm;