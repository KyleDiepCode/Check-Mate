"use client"





export default function PersonRow( { person, personSelect, personToggle , calculateSubtotal, updatePerson} ){

    const isSelected = person.id === personToggle.selectedid

    return(
    <div
    onClick={() => personSelect(person.id)}
    className="p-4 rounded-xl flex flex-col items-start gap-1 cursor-pointer transition-all"
    style={{
        boxShadow: `0 0 0 4px ${person.color}`,
        backgroundColor: isSelected ? person.color : '#f9fafb'
    }}
    >
      <input
      className="font-semibold text-base text-gray-700 bg-transparent"
      style={{ fieldSizing: 'content', minWidth: '4ch' }}
      value={person.name}
      onChange={(e) => updatePerson(person.id, "name", e.target.value)}
      onClick={(e) => {
        e.stopPropagation()
        e.target.select()}
      }
      />
      <span className="text-xs font-semibold text-gray-700">${calculateSubtotal(person).toFixed(2)}</span>
      {/*
      <div className="flex-1 grid grid-cols-3 gap-3">
        <div>
          <label 
          onClick = {(e)=> e.stopPropagation()}
          className="block text-xs text-gray-500 mb-1">Subtotal</label>
          <input type="number" className="w-full border rounded-md p-2 text-sm outline-none focus:border-blue-500" placeholder="0.00" />
        </div>
        <div>
          <label 
          onClick = {(e)=> e.stopPropagation()}
          className="block text-xs text-gray-500 mb-1">Tax</label>
          <input type="number" className="w-full border rounded-md p-2 text-sm outline-none focus:border-blue-500" placeholder="0.00" />
        </div>
        <div>
          <label 
          onClick = {(e)=> e.stopPropagation()}
          className="block text-xs text-gray-500 mb-1">Tip</label>
          <input type="number" className="w-full border rounded-md p-2 text-sm outline-none focus:border-blue-500" placeholder="0.00" />
        </div>
        <div>
        </div>
      </div>
      <p>{calculateSubtotal(person).toFixed(2)}</p>
        */}
    </div>
  );
} 

