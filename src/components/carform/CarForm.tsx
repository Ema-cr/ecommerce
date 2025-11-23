import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import axios from "axios";

type CarFormData = {
  brand: string;
  model: string;
  year: number;
  price: number;
  reference: string;
  engine: {
    type: string;
    fuel: string;
    hp: number;
    transmission: string;
  };
  imageUrl: string;
  condition: "New" | "Used";
};

const CarForm = () => {
  const validationSchema = Yup.object().shape({
    brand: Yup.string().required("Brand is required"),
    model: Yup.string().required("Model is required"),
    year: Yup.number().required("Year is required").min(1900).max(new Date().getFullYear()),
    price: Yup.number().required("Price is required").positive(),
    reference: Yup.string().required("Reference is required"),
    engine: Yup.object().shape({
      type: Yup.string().required("Engine type is required"),
      fuel: Yup.string().required("Fuel type is required"),
      hp: Yup.number().required("Horsepower is required").positive(),
      transmission: Yup.string().required("Transmission type is required"),
    }),
    imageUrl: Yup.string().url("Invalid URL").required("Image URL is required"),
    condition: Yup.string().oneOf(["New", "Used"]).required("Condition is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CarFormData>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data: CarFormData) => {
    try {
      const response = await axios.post("/api/cars", data);
      alert("Car created successfully");
    } catch (error) {
      console.error("Error creating car", error);
      alert("Error creating car");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("brand")} placeholder="Brand" />
      <p>{errors.brand?.message}</p>

      <input {...register("model")} placeholder="Model" />
      <p>{errors.model?.message}</p>

      <input {...register("year")} placeholder="Year" />
      <p>{errors.year?.message}</p>

      <input {...register("price")} placeholder="Price" />
      <p>{errors.price?.message}</p>

      <input {...register("reference")} placeholder="Reference" />
      <p>{errors.reference?.message}</p>

      <input {...register("engine.type")} placeholder="Engine Type" />
      <p>{errors.engine?.type?.message}</p>

      <input {...register("engine.fuel")} placeholder="Engine Fuel" />
      <p>{errors.engine?.fuel?.message}</p>

      <input {...register("engine.hp")} placeholder="Engine HP" />
      <p>{errors.engine?.hp?.message}</p>

      <input {...register("engine.transmission")} placeholder="Transmission" />
      <p>{errors.engine?.transmission?.message}</p>

      <input {...register("imageUrl")} placeholder="Image URL" />
      <p>{errors.imageUrl?.message}</p>

      <select {...register("condition")}>
        <option value="New">New</option>
        <option value="Used">Used</option>
      </select>

      <button type="submit">Submit</button>
    </form>
  );
};

export default CarForm;
