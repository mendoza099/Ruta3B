import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Swal from "sweetalert2";

const getState = ({ getStore, getActions, setStore }) => {
  const [type, setType] = useState(false);

  return {
    store: {
      auth: false,
      url: process.env.BACKEND_URL,
      message: null,
      demo: [
        {
          title: "FIRST",
          background: "white",
          initial: "white",
        },

      ],
      restaurantes: [],
      profiles: [],
      likes: [],
      reservations: [],
      restaurante: [],
      went: [],
      profileRestaurante: [],
      url: [],
      precio: [],
    },

    actions: {
     
      /**AÑADIR A FAVORITOS */

      addFavorite: async (id) => {
        const response = await fetch(
          process.env.BACKEND_URL + "/api/favlocales/" + id,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.status === 200) {
          const data = await response.json();
          setStore({
            auth: true,
          });
        } else if (response.status === 208) {
          Swal.fire({
            icon: 'info',
            title: 'Ya en favoritos',
            text: 'Este restaurante ya lo tienes en favoritos',
            confirmButtonColor: '#667eea'
          });
        }

        // console.log(data);
        return true;
      },
      
      removeFavorite: async (id) => {
        fetch(process.env.BACKEND_URL + "/api/favlocales/" + id, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
          .then((response) => {
            return response.json();
          })
          .then((data) =>
            setStore({
              likes: data,
            })
          );
        return true;
      },
      getFavorit: (id_user, id_local) => {
        fetch(process.env.BACKEND_URL + "/api/user/favoritos", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
          .then((response) => {
            return response.json();
          })
          .then((data) =>
            setStore({
              likes: data,
            })
          );
      },
      addWent: (nombre) => {
        //Creamos la funcion para obtener el nombre con el Onclick
        const store = getStore(); //Obtenemos Store con "getStore"
        setStore({
          went: store.went.concat(nombre),
        }); //Actualizamos la informacion que está en like concatenando el valor de name.
      },


      /**NUEVO SISTEMA DE RESERVAS */

      // Crear reserva
      createReservation: async (localId, date, time = null, people = 2, notes = null) => {
        try {
          const response = await fetch(
            process.env.BACKEND_URL + "/api/reservations",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              body: JSON.stringify({
                local_id: localId,
                date: date,
                time: time,
                people: people,
                notes: notes
              }),
            }
          );
          
          if (response.status === 201) {
            const data = await response.json();
            Swal.fire({
              icon: 'success',
              title: '¡Reserva creada!',
              text: 'Tu reserva ha sido creada exitosamente',
              confirmButtonColor: '#667eea'
            });
            getActions().getReservations();
            return true;
          } else if (response.status === 409) {
            Swal.fire({
              icon: 'warning',
              title: 'Reserva duplicada',
              text: 'Ya tienes una reserva para esta fecha en este restaurante',
              confirmButtonColor: '#667eea'
            });
            return false;
          } else if (response.status === 400) {
            const error = await response.json();
            Swal.fire({
              icon: 'error',
              title: 'Datos inválidos',
              text: error.message || 'Por favor verifica los datos',
              confirmButtonColor: '#667eea'
            });
            return false;
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo crear la reserva',
              confirmButtonColor: '#667eea'
            });
            return false;
          }
        } catch (err) {
          Swal.fire({
            icon: 'error',
            title: 'Error de conexión',
            text: 'Error al crear la reserva. Por favor, intenta de nuevo.',
            confirmButtonColor: '#667eea'
          });
          return false;
        }
      },

      // Obtener todas las reservas del usuario
      getReservations: async () => {
        try {
          const response = await fetch(
            process.env.BACKEND_URL + "/api/reservations",
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          
          if (response.ok) {
            const data = await response.json();
            setStore({ reservations: data });
          } else {
            setStore({ reservations: [] });
          }
        } catch (err) {
          setStore({ reservations: [] });
        }
      },

      // Cancelar reserva
      cancelReservation: async (reservationId) => {
        try {
          const response = await fetch(
            process.env.BACKEND_URL + "/api/reservations/" + reservationId,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          
          if (response.ok) {
            Swal.fire({
              icon: 'success',
              title: 'Reserva cancelada',
              text: 'La reserva ha sido cancelada exitosamente',
              confirmButtonColor: '#667eea'
            });
            getActions().getReservations();
            return true;
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo cancelar la reserva',
              confirmButtonColor: '#667eea'
            });
            return false;
          }
        } catch (err) {
          Swal.fire({
            icon: 'error',
            title: 'Error de conexión',
            text: 'Error al cancelar la reserva',
            confirmButtonColor: '#667eea'
          });
          return false;
        }
      },

      // Actualizar reserva
      updateReservation: async (reservationId, updates) => {
        try {
          const response = await fetch(
            process.env.BACKEND_URL + "/api/reservations/" + reservationId,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              body: JSON.stringify(updates),
            }
          );
          
          if (response.ok) {
            Swal.fire({
              icon: 'success',
              title: 'Reserva actualizada',
              text: 'La reserva ha sido actualizada exitosamente',
              confirmButtonColor: '#667eea'
            });
            getActions().getReservations();
            return true;
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo actualizar la reserva',
              confirmButtonColor: '#667eea'
            });
            return false;
          }
        } catch (err) {
          Swal.fire({
            icon: 'error',
            title: 'Error de conexión',
            text: 'Error al actualizar la reserva',
            confirmButtonColor: '#667eea'
          });
          return false;
        }
      },
      addWent: (nombre) => {
        //Creamos la funcion para obtener el nombre con el Onclick
        const store = getStore(); //Obtenemos Store con "getStore"
        setStore({
          went: store.went.concat(nombre),
        }); //Actualizamos la informacion que está en like concatenando el valor de name.
      },
      

      /****************************************************** */
      login: async (email, password) => {
        try {
          // Validar que los campos no estén vacíos
          if (!email || !password) {
            return {
              success: false,
              message: "Por favor, completa todos los campos"
            };
          }

          const backendUrl = process.env.BACKEND_URL || "http://localhost:3001";
          console.log("🔍 Intentando login en:", backendUrl + "/api/login");

          const response = await fetch(backendUrl + "/api/login", {
            method: "POST",
            body: JSON.stringify({
              email: email,
              password: password,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          });
          
          const data = await response.json();
          
          if (response.status === 200) {
            // Login exitoso
            setStore({
              auth: true,
            });
            
            localStorage.setItem("token", data.access_token);
            
            if (data.type === true) {
              // Es un restaurante
              localStorage.setItem("esLocal", "true");
              localStorage.removeItem("esUsuario");
              return {
                success: true,
                isRestaurant: true,
                message: "¡Bienvenido de nuevo!"
              };
            } else {
              // Es un usuario normal
              localStorage.setItem("esUsuario", "true");
              localStorage.removeItem("esLocal");
              return {
                success: true,
                isRestaurant: false,
                message: "¡Bienvenido de nuevo!"
              };
            }
          } else if (response.status === 401) {
            // Credenciales incorrectas
            return {
              success: false,
              message: "Email o contraseña incorrectos"
            };
          } else {
            // Otro error
            return {
              success: false,
              message: data.message || "Error al iniciar sesión"
            };
          }
        } catch (err) {
          console.error("Error en login:", err);
          return {
            success: false,
            message: "Error de conexión. Por favor, intenta de nuevo."
          };
        }
      },
      syncTokenFromLocalStorage: () => {
        const auth = localStorage.getItem("token");
        if (auth && auth !== "" && auth !== undefined)
          setStore({
            auth: auth,
          });
      },
      getInformationCurrentMember: () => {
        const store = getStore();
        fetch(process.env.BACKEND_URL + "/api/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
          .then((response) => response.json())
          .then((data) =>
            setStore({
              profiles: data,
            })
          );
      },
      getRestaurantes: async () => {
        const store = getStore();
        // fetching data from the backend
        const resp = await fetch(process.env.BACKEND_URL + "/api/restaurantes")
          .then((resp) => resp.json())
          .then((data) =>
            setStore({
              restaurantes: data,
            })
          );
      },

      logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("esLocal");
        localStorage.removeItem("esUsuario");
        setStore({
          auth: false,
        });
      },
      
      getInformationCurrentRestaurant: () => {
        fetch(process.env.BACKEND_URL + "/api/profile-restaurante", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
          .then((response) => response.json())
          .then((data) =>
            setStore({
              profileRestaurante: data,
            })
          );
      },

      registroUsuario: async (nombre, apellido, email, password) => {
        const response = await fetch(process.env.BACKEND_URL + "/api/user", {
          method: "POST",
          body: JSON.stringify({
            nombre: nombre,
            apellido: apellido,
            email: email,
            password: password,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.status === 201) {
          const data = await response.json();
          return true;
        } else if (response.status === 409) {
          Swal.fire({
            icon: 'warning',
            title: 'Email ya registrado',
            text: 'Ya hay un usuario registrado con ese email',
            confirmButtonColor: '#667eea'
          });
          return false;
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error de registro',
            text: 'Error al registrar usuario. Por favor, intenta de nuevo.',
            confirmButtonColor: '#667eea'
          });
          return false;
        }
        
      },

      añadirPrecio: async (id, precio) => {
        const response = await fetch(
          process.env.BACKEND_URL + "/api/addPrice/" + id,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
              id: id,
              precio: precio,
            }),
          }
        );
        if (response.ok) {
          console.log("Datos guardados");
        } else {
          console.log("No se ha podido modificar el dato");
        }
      },

      

      // REGISTRO DE USUARIO
      RegistroLocales: (nombre, email, password, tipo_local, descripcion, direccion, ciudad, codigo_postal) => {
        fetch(process.env.BACKEND_URL + "/api/locales", {
          method: "POST",
          body: JSON.stringify({
            nombre: nombre,
            email: email,
            password: password,
            tipo_local: tipo_local,
            descripcion: descripcion,
            direccion: direccion,
            ciudad: ciudad,
            codigo_postal: codigo_postal,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            console.log(data);
          });
      },

      
        añadirPrecio: async (id, precio) => {
                const response = await fetch(process.env.BACKEND_URL + "/api/addPrice/" + id, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({
                        id: id,
                        precio: precio,

                    }),
                });
                if (response.ok) {
                    console.log("Datos guardados");
                } else {
                    console.log("No se ha podido modificar el dato");
                }
            },
            modificarDatos: async (id,nombre,tipo_local,descripcion) => {
                const response = await fetch(process.env.BACKEND_URL + "/api/editInfoRestaurantes/" + id, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({
                        id: id,
                        nombre:nombre,
                        tipo_local:tipo_local,
                        descripcion:descripcion,
                    }),
                });
                if (response.ok) {
                    console.log("Datos guardados");
                } else {
                    console.log("No se ha podido modificar el dato");
                }
            },
            
           
            uploadFile: async (uploadImages) => {
                const store = getStore();
                const cloud_name = "dqa8txoeg"; //"pluggedin";
                const preset = "ehajybj3"; //"icnpftra";
                const url_claudinari = `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`;
                const formData = new FormData();
                formData.append("file", uploadImages);
                formData.append("upload_preset", `${preset}`);
                try {
                    const response = await fetch(
                        //   process.env.BACKEND_URL + "/api/hello",
                        url_claudinari, {
                            method: "POST",
                            body: formData,
                        }
                    );
                    if (response.ok) {
                        const data = await response.json();
                        //   actions.putImage(data.secure_url);
                        // console.log(data);
                        // console.log(data.url)
                        setStore({url:data.url})
                        // console.log(data.url)
                            console.log(store.url);
                    }
                } catch (error) {
                    console.log("message", error);
                };
            },

            añadirFoto: async (id)=>{
                const store = getStore();
                const response = await fetch(process.env.BACKEND_URL + "/api/addPhoto/"+id,
                    {
                      method: "PUT",
                      headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                      },
                      body: JSON.stringify({
                        id:id,
                        foto: store.url,

                      }),
                    }
                  );
                  if (response.ok) {
                    Swal.fire({
                      icon: 'success',
                      title: 'Datos guardados',
                      text: 'Los cambios se han guardado correctamente',
                      confirmButtonColor: '#667eea'
                    });
                  } else {
                    Swal.fire({
                      icon: 'error',
                      title: 'Error',
                      text: 'No se ha podido modificar el dato',
                      confirmButtonColor: '#667eea'
                    });
                  }

             }
    }
  }
}
export default getState;
