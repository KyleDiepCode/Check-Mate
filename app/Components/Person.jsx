"use client"





export default function PersonRow( { person, personSelect, personToggle , calculateSubtotal, updatePerson} ){

    return(
    <div 
    onClick={() => personSelect(person.id)}
    className={`p-7 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 ${person.id === personToggle.selectedid ? "bg-gray-200" : "bg-gray-50"}` }
    style={{ outline: `5px inset ${person.color}` }} 
    >    
      <input 
      className="font-semibold text-lg text-gray-700"
      style={{ fieldSizing: 'content', minWidth: '4ch' }}
      value={person.name}
    //   need on change since its a controlled input
      onChange={(e) => updatePerson(person.id, "name", e.target.value)}
      onClick={(e) => {
        e.stopPropagation()
        e.target.select()}
      }
      >
      </input>
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

