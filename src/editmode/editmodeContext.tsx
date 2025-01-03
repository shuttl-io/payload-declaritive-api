"use client";
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

type EditModeContext = {
  isLoggedIn: boolean;
  isEditing: boolean;
};
const EditModeContext = createContext<EditModeContext | null>(null);

export function useEditMode() {
  const ctx = useContext(EditModeContext);
  if (ctx === null) {
    throw new Error("edit mode must be in context!");
  }
  return ctx;
}

export function EditMode(props: PropsWithChildren) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetch("/api/users/me", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(async (response) => {
      const user = await response.json();
      if (user.user === null) {
        setIsLoggedIn(false);
      } else {
        setIsLoggedIn(true);
      }
    });
  }, []);
  return (
    <EditModeContext.Provider value={{ isLoggedIn, isEditing }}>
      {props.children}
      {isLoggedIn && !isEditing && (
        <button
          style={{
            position: "fixed",
            background: "black",
            top: "91vh",
            right: "2vw",
            fontSize: "1.5rem",
            width: "50px",
            height: "50px",
            borderRadius: "50%",
          }}
          onClick={(e) => {
            e.preventDefault();
            setIsEditing(true);
          }}
        >
          <i className="las la-edit"></i>
        </button>
      )}
    </EditModeContext.Provider>
  );
}
