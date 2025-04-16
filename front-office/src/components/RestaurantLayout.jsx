import React from 'react';
import { useNavigate } from 'react-router-dom';

const RestaurantLayout = ({ tables }) => {
  const navigate = useNavigate();

  const leftTables = tables.slice(0, Math.ceil(tables.length / 2));
  const rightTables = tables.slice(Math.ceil(tables.length / 2));

  const getTableStyle = (isReserved) => {
    return isReserved
      ? 'bg-gray-400 cursor-not-allowed'
      : 'bg-green-600 hover:bg-green-700 cursor-pointer';
  };

  const renderChairs = (nbPlaces) => {
    const chairConfigurations = {
      1: [{ top: '-10px', left: '50%', transform: 'translateX(-50%)' }],
      2: [
        { top: '-10px', left: '30%' },
        { top: '-10px', left: '70%' },
      ],
      3: [
        { top: '-10px', left: '50%', transform: 'translateX(-50%)' },
        { top: '20%', right: '-10px' },
        { top: '20%', left: '-10px' },
      ],
      4: [
        { top: '-10px', left: '50%', transform: 'translateX(-50%)' },
        { bottom: '-10px', left: '50%', transform: 'translateX(-50%)' },
        { top: '50%', left: '-10px', transform: 'translateY(-50%)' },
        { top: '50%', right: '-10px', transform: 'translateY(-50%)' },
      ],
      default: [
        { top: '-10px', left: '50%', transform: 'translateX(-50%)' },
        { bottom: '-10px', left: '50%', transform: 'translateX(-50%)' },
        { top: '50%', left: '-10px', transform: 'translateY(-50%)' },
        { top: '50%', right: '-10px', transform: 'translateY(-50%)' },
        { top: '15%', right: '15%', transform: 'rotate(-45deg)' },
        { top: '15%', left: '15%', transform: 'rotate(45deg)' },
        { bottom: '15%', right: '15%', transform: 'rotate(45deg)' },
        { bottom: '15%', left: '15%', transform: 'rotate(-45deg)' },
      ],
    };

    const positions =
      chairConfigurations[nbPlaces] ||
      chairConfigurations.default.slice(0, nbPlaces);

    return positions.map((pos, index) => (
      <div
        key={index}
        className="absolute bg-amber-100 w-6 h-6 rounded-sm border border-amber-300"
        style={pos}
      >
        <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs">
          🪑
        </span>
      </div>
    ));
  };

  const renderTable = (table) => (
    <div key={table._id} className="group relative flex justify-center my-12">
      <div className="relative">
        {renderChairs(table.chairnb)}

        <div
          className={`w-24 h-24 rounded-full shadow-lg flex flex-col items-center justify-center text-white ${getTableStyle(
            table.isReserved
          )} transition duration-300 border-4 border-white relative z-10`}
        >
          <div className="text-center font-semibold">Table {table.nbtable}</div>
          <div className="text-xs mt-1">{table.chairnb} seats</div>

          {!table.isReserved && (
            <button
              className="mt-2 opacity-0 group-hover:opacity-100 transition text-xs bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded-full shadow"
              onClick={() => navigate(`/reservation/${table._id}`)}
            >
              Reserve
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold text-center mb-8">
        Restaurant Map
      </h2>

      <div className="relative max-w-4xl mx-auto">
        <div className="border-2 border-gray-600 rounded-lg p-6 bg-gray-50 shadow-lg">
          <div className="text-center mb-6">
            <div className="inline-block px-12 py-3 bg-gray-200 rounded-b-lg border-t-0 border-2 border-gray-300">
              <span className="font-semibold text-gray-700">MAIN ENTRANCE</span>
            </div>
          </div>

          <div className="flex justify-between items-start">
            <div className="w-2/5 pl-4">
              {leftTables.map(renderTable)}

              <div className="mt-4 p-4 bg-blue-100 border-2 border-blue-300 rounded-lg text-center shadow-inner">
                <div className="font-semibold text-blue-800">🚻 RESTROOMS</div>
                <div className="text-xs text-blue-600 mt-1">
                  Customer access
                </div>
              </div>
            </div>

            <div className="w-1/5 mx-2">
              <div className="bg-gray-300 h-full rounded-lg shadow-inner relative">
                <div className="absolute top-1/4 w-full border-t-2 border-gray-400 border-dashed"></div>
                <div className="absolute top-2/4 w-full border-t-2 border-gray-400 border-dashed"></div>
                <div className="absolute top-3/4 w-full border-t-2 border-gray-400 border-dashed"></div>

                <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 bg-brown-500 p-1 text-center text-xs text-white rounded shadow-lg">
                  🚪 KITCHEN
                </div>
              </div>
            </div>

            <div className="w-2/5 pr-4">
              {rightTables.map(renderTable)}

              <div className="mt-4 p-4 bg-amber-100 border-2 border-amber-300 rounded-lg text-center shadow-inner">
                <div className="font-semibold text-amber-800">
                  🛎 SERVER AREA
                </div>
                <div className="text-xs text-amber-600 mt-1">
                  Order prep zone
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 p-4 bg-red-100 border-2 border-red-300 rounded-lg text-center shadow-inner relative">
            <div className="font-semibold text-red-800">👨‍🍳 MAIN KITCHEN</div>
            <div className="text-xs text-red-600 mt-1">Staff only access</div>
            <div className="flex justify-center space-x-4 mt-2">
              <span className="text-xs bg-white px-2 py-1 rounded">
                🍳 Grill
              </span>
              <span className="text-xs bg-white px-2 py-1 rounded">
                ❄️ Fridges
              </span>
              <span className="text-xs bg-white px-2 py-1 rounded">
                🍽 Dishwashing
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantLayout;
