import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const RestaurantLayout = ({ tables }) => {
  const navigate = useNavigate();

  // Découpage des tables en deux colonnes
  const leftTables = tables.slice(0, Math.ceil(tables.length / 2));
  const rightTables = tables.slice(Math.ceil(tables.length / 2));

  // Configuration des formes de tables
  const getTableShape = (shape) => {
    const shapes = {
      rectangle: 'w-32 h-24 rounded-lg',
      square: 'w-24 h-24 rounded-sm',
      round: 'w-24 h-24 rounded-full',
      default: 'w-24 h-24 rounded-full'
    };
    return shapes[shape.toLowerCase()] || shapes.default;
  };

  // Style dynamique des tables
  const getTableStyle = (isReserved, shape) => {
    const baseClasses = `shadow-lg flex flex-col items-center justify-center text-white 
      transition duration-300 border-4 border-white relative z-10 
      ${getTableShape(shape)}`;
    
    return isReserved 
      ? `${baseClasses} bg-gray-400 cursor-not-allowed`
      : `${baseClasses} bg-green-600 hover:bg-green-700 cursor-pointer`;
  };

  // Positionnement dynamique des chaises
  const renderChairs = (nbPlaces) => {
    return Array.from({ length: nbPlaces }).map((_, index) => {
      const angle = (index * 360) / nbPlaces;
      const radius = 50; // Distance du centre en pixels
      
      return (
        <div
          key={index}
          className="absolute bg-amber-100 w-6 h-6 rounded-sm border border-amber-300"
          style={{
            transform: `rotate(${angle}deg) translate(${radius}px) rotate(-${angle}deg)`
          }}
        >
          <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs">
            🪑
          </span>
        </div>
      );
    });
  };

  // Rendu d'une table individuelle
  const renderTable = (table) => (
    <div key={table._id} className="group relative flex justify-center my-12">
      <div className="relative">
        {renderChairs(table.chairnb)}
        
        <div className={getTableStyle(table.isReserved, table.shape)}>
          <div className="text-center font-semibold p-2">
            <div>Table {table.nbtable}</div>
            <div className="text-xs mt-1">{table.chairnb} places</div>
          </div>

          {/* Badge d'information */}
          <div className="absolute top-0 left-0 text-xs bg-white/80 text-gray-800 p-1 rounded m-1">
            {table.shape} · {table.view}
          </div>

          {/* Bouton de réservation */}
 {!table.isReserved && (
  <Link
  to={`/restaurants/${table.restauId._id}/tables/${table._id}/reserve`}
  className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-4 
    opacity-0 group-hover:opacity-100 transition-all duration-300 
    text-xs bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded-full 
    shadow-lg text-white"
>
  Réserver
</Link>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Plan du Restaurant
      </h2>

      <div className="max-w-7xl mx-auto">
        <div className="border-2 border-gray-200 rounded-xl bg-white shadow-xl">
          
          {/* Entrée principale */}
          <div className="text-center mb-8 pt-6">
            <div className="inline-block px-8 py-2 bg-gray-100 rounded-b-lg border-t-0 border-2 border-gray-200">
              <span className="font-semibold text-gray-600">ENTRÉE PRINCIPALE</span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between p-6 gap-6">
            
            {/* Colonne gauche */}
            <div className="flex-1 space-y-8">
              {leftTables.map(renderTable)}
              
              <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg text-center">
                <div className="font-semibold text-blue-800">🚾 SANITAIRES</div>
                <div className="text-xs text-blue-600 mt-1">Accès clients</div>
              </div>
            </div>

            {/* Zone centrale (cuisine) */}
            <div className="w-full md:w-1/5 mx-4 relative">
              <div className="bg-gray-200 h-full rounded-lg shadow-inner p-4">
                <div className="sticky top-4 text-center">
                  <div className="bg-brown-600 text-white px-3 py-1 rounded-lg text-xs">
                    🧑🍳 CUISINE
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="h-1 bg-gray-300"></div>
                    <div className="h-1 bg-gray-300"></div>
                    <div className="h-1 bg-gray-300"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Colonne droite */}
            <div className="flex-1 space-y-8">
              {rightTables.map(renderTable)}
              
              <div className="mt-6 p-4 bg-amber-50 border-2 border-amber-200 rounded-lg text-center">
                <div className="font-semibold text-amber-800">🔔 ZONE SERVICE</div>
                <div className="text-xs text-amber-600 mt-1">Préparation commandes</div>
              </div>
            </div>
          </div>

          {/* Zone cuisine principale */}
          <div className="mt-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg text-center mx-6 mb-6">
            <div className="font-semibold text-red-800">👨🍳 CUISINE PRINCIPALE</div>
            <div className="text-xs text-red-600 mt-1">Accès réservé au personnel</div>
            <div className="flex justify-center gap-3 mt-3">
              <span className="text-xs bg-white px-2 py-1 rounded border">
                🍳 Grill
              </span>
              <span className="text-xs bg-white px-2 py-1 rounded border">
                ❄️ Réfrigération
              </span>
              <span className="text-xs bg-white px-2 py-1 rounded border">
                🍽 Lavage
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantLayout;