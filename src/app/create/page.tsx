// /app/create/page.tsx
import React from "react";
import CarForm from "@/components/carform/CarForm";

const CreateCarPage = () => {
  return (
    <div>
      <h1>Create a New Car</h1>
      <CarForm />
    </div>
  );
};

export default CreateCarPage;
