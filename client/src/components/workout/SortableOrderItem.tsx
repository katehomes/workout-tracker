import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Props {
  id: number;
  children: (props: ReturnType<typeof useSortable>) => React.ReactNode;
}

const SortableOrderItem: React.FC<Props> = ({ id, children }) => {
  const sortable = useSortable({ id: `set-${id}` });

  const { setNodeRef, transform, transition } = sortable;

  const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

  return (
      <div ref={setNodeRef} style={style}>
        {children(sortable)}
      </div>
    );
};

export default SortableOrderItem;


// import React, { useState, useEffect } from 'react';
// import {
//   DndContext,
//   closestCenter,
//   PointerSensor,
//   useSensor,
//   useSensors,
//   KeyboardSensor,
//   type DragEndEvent,
//   DragOverlay,
//   type DragStartEvent
// } from '@dnd-kit/core';
// import {
//   arrayMove,
//   SortableContext,
//   sortableKeyboardCoordinates,
//   useSortable,
//   verticalListSortingStrategy
// } from '@dnd-kit/sortable';
// import SortableOrderItem from './SortableOrderItem';
// import { RxDragHandleHorizontal } from "react-icons/rx";
// import { RxDragHandleDots2 } from "react-icons/rx";
// import { MdDragHandle } from "react-icons/md";
// import { MdOutlinePlaylistRemove } from "react-icons/md";

// export interface SetOrderEntry {
//   setId: number;
//   repeat?: number;
// }

// interface SetOrderEditorProps {
//   title: string;
//   sets: { title?: string }[];
//   setOrder: number[];
//   setSetOrder: (order: number[]) => void;
// }

// export function flattenSetOrder(setOrder: SetOrderEntry[]): number[] {
//   return setOrder.flatMap(entry =>
//     Array(entry.repeat ?? 1).fill(entry.setId)
//   );
// }

// export function groupSetOrder(flat: number[]): SetOrderEntry[] {
//   const grouped: SetOrderEntry[] = [];
//   let i = 0;

//   while (i < flat.length) {
//     const current = flat[i];
//     let count = 1;
//     while (flat[i + count] === current) count++;

//     grouped.push({ setId: current, repeat: count });
//     i += count;
//   }

//   return grouped;
// }

// const SetOrderEditor: React.FC<SetOrderEditorProps> = ({ title, sets, setOrder, setSetOrder }) => {
//   const sensors = useSensors(useSensor(PointerSensor));
//   const groupedOrder = groupSetOrder(setOrder);
//   const [activeItem, setActiveItem] = useState<SetOrderEntry | null>(null);

//   useEffect(() => {
//     console.log('Grouped Set Order:', groupedOrder);
//   }, [setOrder]);

//   useEffect(() => {
//     console.log('activeItem use effect:', activeItem);
//   }, [activeItem]);

//   const handleDragStart = ({ active }: DragStartEvent) => {
//     console.log('handleDragStart');
//     console.log('active', active);
//     const index = parseInt(active.id.toString().split('-')[1]);
//     const item = groupedOrder[index];
//     console.log('item != null', item != null);
//     if (item) {
//         setActiveItem(item);
//     }
//   };

//   const handleDragEnd = (event: DragEndEvent) => {
//     console.log('handleDragEnd');
//     const { active, over } = event;
//     setActiveItem(null);
//     console.log("over: ", over);
//     if (!over || active.id === over.id) return;

//     const oldIndex = parseInt(active.id.toString().split('-')[1]);
//     const newIndex = parseInt(over.id.toString().split('-')[1]);

//     console.log("oldIndex: ", oldIndex);
//     console.log("newIndex: ", newIndex);

//     const reordered = arrayMove(groupedOrder, oldIndex, newIndex);
//     setSetOrder(flattenSetOrder(reordered));
//   };

//   return (
//     <div className="border rounded p-4 space-y-2 bg-gray-50 max-w-md relative z-50">
//       <h3 className="font-semibold text-lg truncate" title={title}>
//         {title}
//       </h3>
//       {/*
//       <DndContext
//             sensors={sensors}
//             collisionDetection={closestCenter}
//             onDragStart={(e) => handleDragStart(e, setIndex)}
//             onDragEnd={(event) => handleDragEnd(event, setIndex)}
//         >
//             <SortableContext items={groupedOrder.map((_, i) => i.toString())} strategy={verticalListSortingStrategy}>
//             {groupedOrder.map((entry, orderIndex) => {
//                 const setTitle = sets[entry.setId]?.title?.trim() || `Set ${entry.setId + 1}`;
                
//                 <SortableOrderItem key={`set-${orderIndex}`} id={orderIndex}>
//                 {({ attributes, listeners }) => {
//                 return (
//                     <div key={orderIndex} className="relative mb-4 bg-white p-3 rounded shadow space-y-2">
//                         <button
//                             {...attributes}
//                             {...listeners}
//                             className="cursor-grab text-gray-500 hover:text-gray-700 text-xl"
//                             title="Drag To Reorder"
//                         >
//                             ☰
//                         </button>
//                         <tr className="bg-white border-t">
//                             <td className="px-3 py-2 font-medium">{setTitle}</td>
//                             <td className="">
//                             <select
//                                 className="select select-xs"
//                                 value={entry.repeat ?? 1}
//                                 onChange={(e) => {
//                                 const newGrouped = [...groupedOrder];
//                                 newGrouped[orderIndex].repeat = parseInt(e.target.value);
//                                 setSetOrder(flattenSetOrder(newGrouped));
//                                 }}
//                             >
//                                 {[1, 2, 3, 4, 5].map(r => (
//                                 <option key={r} value={r}>{r}x</option>
//                                 ))}
//                             </select>
//                             </td>
//                             <td className="">
//                             <button
//                                 onClick={() => {
//                                 const newGrouped = [...groupedOrder];
//                                 newGrouped.splice(orderIndex, 1);
//                                 setSetOrder(flattenSetOrder(newGrouped));
//                                 }}
//                                 className="text-red-600 hover:underline text-sm"
//                             >
//                                 <MdOutlinePlaylistRemove />
//                             </button>
//                             </td>
//                         </tr>
                    
                    
                    
//                     </div>
//                 )}}
//                 </SortableExercise>
//             ))}
//             </SortableContext>
//             <DragOverlay>
//                 {activeItem ? (
//                     <tr className="bg-white border-t shadow opacity-90">
//                     <td className="px-3 py-2 font-medium" colSpan={3}>
//                         {sets[activeItem.setId]?.title?.trim() || `Set ${activeItem.setId + 1}`} {activeItem.repeat && activeItem.repeat > 1 ? `(x${activeItem.repeat})` : ""}
//                     </td>
//                     </tr>
//                 ) : null}
//             </DragOverlay>
//         </DndContext>
//       */}

//       <DndContext
//             sensors={sensors}
//             collisionDetection={closestCenter}
//             onDragStart={(e) => handleDragStart(e)}
//             onDragEnd={(event) => handleDragEnd(event)}
//         >
//             <SortableContext items={groupedOrder.map((_, i) => i.toString())} strategy={verticalListSortingStrategy}>
//             { groupedOrder.map((entry, orderIndex) => (
//                 <SortableOrderItem key={`set-${orderIndex}`} id={`set-${orderIndex}`}>
//                 {({ attributes, listeners }) => {
//                 return (
//                     <div key={orderIndex} className="relative mb-4 bg-white p-3 rounded shadow space-y-2">
//                         <button
//                             {...attributes}
//                             {...listeners}
//                             className="cursor-grab text-gray-500 hover:text-gray-700 text-xl"
//                             title="Drag To Reorder"
//                         >
//                             ☰
//                         </button>
//                         <tr className="bg-white border-t">
//                             <td className="px-3 py-2 font-medium">{sets[entry.setId]?.title?.trim() || `Set ${entry.setId + 1}`}</td>
//                             <td className="">
//                             <select
//                                 className="select select-xs"
//                                 value={entry.repeat ?? 1}
//                                 onChange={(e) => {
//                                 const newGrouped = [...groupedOrder];
//                                 newGrouped[orderIndex].repeat = parseInt(e.target.value);
//                                 setSetOrder(flattenSetOrder(newGrouped));
//                                 }}
//                             >
//                                 {[1, 2, 3, 4, 5].map(r => (
//                                 <option key={r} value={r}>{r}x</option>
//                                 ))}
//                             </select>
//                             </td>
//                             <td className="">
//                             <button
//                                 onClick={() => {
//                                 const newGrouped = [...groupedOrder];
//                                 newGrouped.splice(orderIndex, 1);
//                                 setSetOrder(flattenSetOrder(newGrouped));
//                                 }}
//                                 className="text-red-600 hover:underline text-sm"
//                             >
//                                 <MdOutlinePlaylistRemove />
//                             </button>
//                             </td>
//                         </tr>
                    
                    
                    
//                     </div>
//                 )}}
//                 </SortableOrderItem>
//             ))}
//             </SortableContext>
//             <DragOverlay>
//                 {activeItem ? (
//                     <tr className="bg-white border-t shadow opacity-90">
//                     <td className="px-3 py-2 font-medium" colSpan={3}>
//                         {sets[activeItem.setId]?.title?.trim() || `Set ${activeItem.setId + 1}`} {activeItem.repeat && activeItem.repeat > 1 ? `(x${activeItem.repeat})` : ""}
//                     </td>
//                     </tr>
//                 ) : null}
//             </DragOverlay>
//         </DndContext>
//     </div>
//   );
// };

// export default SetOrderEditor;