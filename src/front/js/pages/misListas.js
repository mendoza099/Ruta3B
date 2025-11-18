import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import "../../styles/listas.css";
import Swal from "sweetalert2";

export const MisListas = () => {
  const [lists, setLists] = useState([]);
  const [selectedList, setSelectedList] = useState(null);
  const [listItems, setListItems] = useState([]);

  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    try {
      const response = await fetch(process.env.BACKEND_URL + "/api/user-lists", {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      if (response.ok) {
        const data = await response.json();
        setLists(data);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchListItems = async (listId) => {
    try {
      const response = await fetch(process.env.BACKEND_URL + `/api/user-lists/${listId}`, {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      if (response.ok) {
        const data = await response.json();
        setListItems(data.items || []);
        setSelectedList(data);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const createList = async () => {
    const { value: name } = await Swal.fire({
      title: 'Nueva Lista',
      input: 'text',
      inputLabel: 'Nombre de la lista',
      inputPlaceholder: 'Ej: Mis 10 Favoritos',
      showCancelButton: true,
      confirmButtonColor: '#667eea'
    });

    if (name) {
      try {
        const response = await fetch(process.env.BACKEND_URL + "/api/user-lists", {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          },
          body: JSON.stringify({ name })
        });
        if (response.ok) {
          fetchLists();
          Swal.fire({ icon: 'success', title: 'Lista creada', confirmButtonColor: '#667eea' });
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(listItems);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setListItems(items);

    // Actualizar posiciones en el backend
    const itemsOrder = items.map((item, index) => ({ id: item.id, position: index }));
    
    try {
      await fetch(process.env.BACKEND_URL + `/api/user-lists/${selectedList.id}/reorder`, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ items: itemsOrder })
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="listas-container">
      <div className="listas-header">
        <h1>Mis Listas Personalizadas</h1>
        <button onClick={createList} className="btn-create-list">+ Nueva Lista</button>
      </div>

      <div className="listas-content">
        <div className="lists-sidebar">
          <h3>Mis Listas ({lists.length})</h3>
          {lists.map(list => (
            <div key={list.id} className={`list-item ${selectedList?.id === list.id ? 'active' : ''}`} onClick={() => fetchListItems(list.id)}>
              <h4>{list.name}</h4>
              <span>{list.items_count} items</span>
            </div>
          ))}
        </div>

        <div className="list-detail">
          {selectedList ? (
            <>
              <h2>{selectedList.name}</h2>
              <p>{selectedList.description}</p>
              
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="list">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="draggable-list">
                      {listItems.map((item, index) => (
                        <Draggable key={item.id} draggableId={String(item.id)} index={index}>
                          {(provided) => (
                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="draggable-item">
                              <span className="drag-handle">☰</span>
                              <span className="position">#{index + 1}</span>
                              <img src={item.local_photo} alt={item.local_name} />
                              <div className="item-info">
                                <h4>{item.local_name}</h4>
                                <p>{item.local_city} • {item.local_type}</p>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </>
          ) : (
            <div className="empty-state">
              <p>Selecciona una lista o crea una nueva</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
