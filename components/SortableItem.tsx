import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableItemProps {
  id: string;
  children: React.ReactNode;
  className?: string;
}

export const SortableItem: React.FC<SortableItemProps> = ({ id, children, className }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 999 : 'auto',
    position: 'relative' as const,
  };

  return (
    <div ref={setNodeRef} style={style} className={className}>
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing touch-none">
        {children}
      </div>
    </div>
  );
};

export const SortableItemHandle: React.FC<{id: string, children: React.ReactNode, className?: string}> = ({ id, children, className }) => {
    // This component is for when we want a specific handle, but for simplicity in this app
    // we often make the whole card draggable or a specific icon within the main SortableItem.
    // This is a placeholder if we need fine-grained control later.
    return <div className={className}>{children}</div>
}