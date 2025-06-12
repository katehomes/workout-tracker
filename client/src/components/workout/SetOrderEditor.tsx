import React, { useState, useEffect, useMemo } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import SortableOrderItem from './SortableOrderItem';
import { MdDragHandle } from "react-icons/md";
import { MdOutlinePlaylistRemove } from "react-icons/md";
import { TbPlaylistAdd } from "react-icons/tb";
import { useWorkoutDraft } from '../../contexts/WorkoutDraftContext';

export interface SetOrderEntry {
  setId: number;
  repeat?: number;
}

export function flattenSetOrder(setOrder: SetOrderEntry[]): number[] {
  return setOrder.flatMap(entry =>
    Array(entry.repeat ?? 1).fill(entry.setId)
  );
}

export function groupSetOrder(flat: number[]): SetOrderEntry[] {
  const grouped: SetOrderEntry[] = [];
  let i = 0;

  while (i < flat.length) {
    const current = flat[i];
    let count = 1;
    while (flat[i + count] === current) count++;

    grouped.push({ setId: current, repeat: count });
    i += count;
  }

  return grouped;
}

const SetOrderEditor: React.FC = () => {

  const {draft, setSetOrder} = useWorkoutDraft();
  
  const sets = draft.sets!;
  const setOrder: number[] = draft.setOrder!;
  
  const sensors = useSensors(useSensor(PointerSensor));
  const groupedOrder = useMemo(() => groupSetOrder(setOrder), [setOrder]);
  const [activeItem, setActiveItem] = useState<SetOrderEntry | null>(null);
  const [newItem, setNewItem] = useState<SetOrderEntry>({ setId: -1});

  useEffect(() => {
    console.log('Grouped Set Order:', groupedOrder);
  }, [setOrder]);

  useEffect(() => {
    console.log('newItem use effect:', newItem);
  }, [newItem]);

  const handleDragStart = ({ active }: DragStartEvent) => {
    console.log('handleDragStart');
    console.log('active', active);
    const index = parseInt(active.id.toString().split('-')[1]);
    const item = groupedOrder[index];
    console.log('item != null', item != null);
    if (item) {
        setActiveItem(item);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    console.log('handleDragEnd');
    const { active, over } = event;
    setActiveItem(null);
    console.log("over: ", over);
    if (!over || active.id === over.id) return;

    const oldIndex = parseInt(active.id.toString().split('-')[1]);
    const newIndex = parseInt(over.id.toString().split('-')[1]);

    console.log("oldIndex: ", oldIndex);
    console.log("newIndex: ", newIndex);

    const reordered = arrayMove(groupedOrder, oldIndex, newIndex);
    setSetOrder(flattenSetOrder(reordered));
  };

  const addNewItem = () => {
    console.log("addnewi sets", sets);
    console.log("newItem", newItem);

    const selectedSetId = newItem.setId;
    if (!isNaN(selectedSetId) && selectedSetId != -1) {
        const newSetOrder = [...setOrder]
        for (let i = 0; i < (newItem.repeat ?? 1); i++) {
            newSetOrder.push(selectedSetId);
        }
        console.log(newSetOrder);
        setSetOrder(newSetOrder);
        setNewItem({...newItem, setId: -1});
    }
    console.log("newItem", newItem);
  }

  return (
    <div className="border rounded bg-gray-50">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={(e) => handleDragStart(e)}
        onDragEnd={(e) => handleDragEnd(e)}
      >
        <SortableContext
          items={groupedOrder.map((_, i) => `set-${i}`)}
          strategy={verticalListSortingStrategy}
        >
        <div id="so-table" className="grid grid-rows-3 gap-1">
            <div id="so-thead" className="grid grid-cols-[5%_60%_15%_10%] gap-1 justify-center">
                <div className="border-b"></div>
                <div className="text-left px-3 py-2 border-b">Set</div>
                <div className="text-left py-2 border-b">Repeats</div>
                <div className="border-b"></div>
            </div>

            {groupedOrder.map((entry, orderIndex) => {
                const setTitle = sets[entry.setId]?.title?.trim() || `Set ${entry.setId + 1}`;
                return (
                    <SortableOrderItem key={`set-${orderIndex}`} id={orderIndex}>
                    {({ attributes, listeners }) => (
                        <div className="grid grid-cols-[5%_60%_15%_10%] gap-1 justify-center hover:bg-blue-100 bg-blue-200">
                            <div>
                                <button
                                    className="cursor-grab text-gray-500 hover:text-gray-700 text-sm align-middle content-center "
                                    title="Drag To Reorder"
                                    {...attributes}
                                    {...listeners}
                                    >
                                    <MdDragHandle />
                                </button>
                            </div>
                            <div className="px-3 font-medium">{setTitle}</div>
                            <div>
                                <select
                                    className="select select-xs"
                                    value={entry.repeat ?? 0}
                                    onChange={(e) => {
                                    const newGrouped = [...groupedOrder];
                                    newGrouped[orderIndex].repeat = parseInt(e.target.value);
                                    setSetOrder(flattenSetOrder(newGrouped));
                                    }}
                                >
                                    {[1, 2, 3, 4, 5].map(r => (
                                    <option key={r} value={r}>{r}x</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <button
                                    onClick={() => {
                                    const newGrouped = [...groupedOrder];
                                    newGrouped.splice(orderIndex, 1);
                                    setSetOrder(flattenSetOrder(newGrouped));
                                    }}
                                    className="text-red-600 hover:underline text-m"
                                >
                                    <MdOutlinePlaylistRemove />
                                </button>
                            </div>
                        </div>
                    )}
                    </SortableOrderItem>
                );
            })}

            <div className={'grid grid-cols-[7%_60%_15%_10%] justify-center gap-1'} >
                <div className="border-t ">
                    <span className='text-green-600 text-xs align-middle content-center'></span>
                </div>
                
                <div className="px-3 font-medium border-t align-middle content-center">
                  <select
                    id="so-new-setId" 
                    className="input input-bordered w-full"
                    value={newItem.setId ?? -1}
                    onChange={(e) => {
                      const selectedSetId = parseInt(e.target.value);
                      console.log("selectedSetId", selectedSetId);
                      if (!isNaN(selectedSetId) && selectedSetId != -1 ) {
                        setNewItem({...newItem, setId: selectedSetId})
                      }
                    }}
                  >
                    <option key="default" value={-1} disabled>Select a set...</option>
                    {sets.map((s, i) => (
                      <option key={i} value={i}>
                        {s.title?.trim() || `Set ${i + 1}`}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="py-2 font-medium border-t align-middle content-center">
                    <select
                        id="so-new-repeat" 
                        className="select select-xs"
                        value={newItem.repeat ?? 1}
                        onChange={(e) => {
                            const selectedRepeats = parseInt(e.target.value);
                            if (!isNaN(selectedRepeats)) {
                                setNewItem({...newItem, repeat: selectedRepeats})
                            }
                        }}
                    >
                        {[1, 2, 3, 4, 5].map(r => (
                        <option key={r} value={r}>{r}x</option>
                        ))}
                    </select>
                </div>
                <div className='text-gray-500 text-m align-middle content-center border-t'>
                    <button
                        onClick={() => {
                            addNewItem()
                        }}
                        className="text-green-600 align-middle content-center hover:text-white-700"
                    >
                        <TbPlaylistAdd />
                    </button>
                </div>
            </div>
        </div>
        </SortableContext>

        <DragOverlay dropAnimation={null}>
          {activeItem ? (
            <div id="so-active-item" className="grid grid-cols-[5%_70%_20%_5%] gap-1 bg-white border-t shadow opacity-90">
                
                <div>
                    <button
                        className="cursor-grab text-gray-500 hover:text-gray-700 text-xl  align-middle content-center"
                        title="Drag To Reorder"
                        >
                        <MdDragHandle />
                    </button>
                </div>
                <div className="px-3 py-2 font-medium">{sets[activeItem.setId]?.title?.trim() || `Set ${activeItem.setId + 1}`}</div>
                <div>
                    <select
                        className="select select-xs"
                        value={activeItem.repeat ?? 1}
                    >
                        {[1, 2, 3, 4, 5].map(r => (
                        <option key={r} value={r}>{r}x</option>
                        ))}
                    </select>
                </div>
                <div>
                    <button
                        className="text-red-600 hover:underline text-sm"
                    >
                        <MdOutlinePlaylistRemove />
                    </button>
                </div>
                
            </div>
            
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default SetOrderEditor;
