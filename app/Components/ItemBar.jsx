
"use client"
import { useState } from "react";







// Item bar is the Text Box for the food and price
export default function ItemBar ({ item, updateItem, toggleselect, itemGreyselect }){
  // Styles 
  const textBoxStyle = "block text-xs text-gray-500 mb-1"
  return(
      <div 
      onClick={ () => toggleselect(item.id)}
      className = {`flex items-center gap-4 p-3 rounded-lg shadow-m mb-3 ${itemGreyselect(item.id) ? 'bg-gray-200' : 'bg-gray-50'}` }>
        <div className = "flex-1">
          <label className = {textBoxStyle}> Item {item.id}</label>
            <input 
            type = "text"
            placeholder = "Chicken"
            onChange={(e) => updateItem(item.id, "name", e.target.value)}
            onClick={(e) => e.stopPropagation() }
            className="w-full border border-gray-300 rounded-lg p-2 text-sm text-blue-600 "
            >
            </input>
        </div>
        <div className="w-32">
          <label className= {textBoxStyle}> $ Price</label>
          <input
          type = "number"
          placeholder="0.00"
          className="w-full border border-gray-300 rounded-lg p-2 text-sm text-blue-600 "
          onChange={(e) => updateItem(item.id, "price", Number(e.target.value))}
          onClick={(e) => e.stopPropagation() }
          >
          </input>
        </div>
      </div>
  );
}

